"use server";

import { ApplicationStatus, AuditAction, EnrollmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { sendTransactionalEmail } from "@/lib/platform/email";
import { platformEnv } from "@/lib/platform/env";
import { attachUserRole, requireApiUser } from "@/lib/platform/users";

const applicationStatusSchema = z.object({
  applicationId: z.string().min(1),
  status: z.nativeEnum(ApplicationStatus),
});

const activateEnrollmentSchema = z.object({
  applicationId: z.string().min(1),
});

function formatApplicationStatus(status: ApplicationStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function applicationStatusUrl() {
  return new URL("/apply/status", platformEnv.siteUrl).toString();
}

export async function updateApplicationStatusAction(formData: FormData) {
  const auth = await requireApiUser(["registrar_admin", "super_admin"]);

  if (!auth.ok) {
    redirect("/elearning/access-denied?next=/registrar/applications");
  }

  const parsed = applicationStatusSchema.safeParse({
    applicationId: formData.get("applicationId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect("/registrar/applications?status=invalid-status");
  }

  const db = getDb();
  const application = await db.application.update({
    where: { id: parsed.data.applicationId },
    data: {
      status: parsed.data.status,
      reviewedAt:
        parsed.data.status === ApplicationStatus.SUBMITTED ||
        parsed.data.status === ApplicationStatus.DRAFT
          ? null
          : new Date(),
    },
    include: {
      user: true,
      program: true,
    },
  });

  await writeAuditLog({
    actorId: auth.user.id,
    action: AuditAction.UPDATE,
    entityType: "Application",
    entityId: application.id,
    summary: `Registrar updated ${application.reference} to ${parsed.data.status}.`,
    payload: {
      reference: application.reference,
      status: parsed.data.status,
    },
  });

  await sendTransactionalEmail({
    to: application.user.email,
    subject: `Ruguna application update: ${application.reference}`,
    text: `Dear applicant,\n\nYour Ruguna College application status has been updated.\n\nReference: ${application.reference}\nProgramme: ${application.program.title}\nCurrent status: ${formatApplicationStatus(application.status)}\n\nTrack your application here:\n${applicationStatusUrl()}\n\nUse your reference and the email address that received this message.\n\nRuguna College\nOne Who Prevails`,
  });

  revalidatePath("/registrar");
  revalidatePath("/registrar/applications");
  revalidatePath("/apply/status");
  redirect("/registrar/applications?status=application-updated");
}

export async function activateProgramEnrollmentAction(formData: FormData) {
  const auth = await requireApiUser(["registrar_admin", "super_admin"]);

  if (!auth.ok) {
    redirect("/elearning/access-denied?next=/registrar/applications");
  }

  const parsed = activateEnrollmentSchema.safeParse({
    applicationId: formData.get("applicationId"),
  });

  if (!parsed.success) {
    redirect("/registrar/applications?status=invalid-activation");
  }

  const db = getDb();
  const application = await db.application.findUnique({
    where: { id: parsed.data.applicationId },
    include: {
      user: true,
      program: {
        include: {
          programCourses: {
            where: {
              yearNumber: 1,
              termNumber: 1,
            },
            include: { course: true },
            orderBy: { sequence: "asc" },
          },
          courses: true,
        },
      },
      intake: true,
    },
  });

  if (!application) {
    redirect("/registrar/applications?status=application-not-found");
  }

  const plannedCourses = application.program.programCourses.length
    ? application.program.programCourses.map((plan) => plan.course)
    : application.program.courses;

  await db.$transaction(async (tx) => {
    const programEnrollment = await tx.programEnrollment.upsert({
      where: {
        userId_programId: {
          userId: application.userId,
          programId: application.programId,
        },
      },
      update: {
        intakeId: application.intakeId,
        status: EnrollmentStatus.ACTIVE,
      },
      create: {
        userId: application.userId,
        programId: application.programId,
        intakeId: application.intakeId,
        status: EnrollmentStatus.ACTIVE,
        currentTerm: 1,
      },
    });

    for (const course of plannedCourses) {
      await tx.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: application.userId,
            courseId: course.id,
          },
        },
        update: {
          programEnrollmentId: programEnrollment.id,
          status: EnrollmentStatus.ACTIVE,
        },
        create: {
          userId: application.userId,
          programId: application.programId,
          programEnrollmentId: programEnrollment.id,
          courseId: course.id,
          status: EnrollmentStatus.ACTIVE,
        },
      });
    }

    await tx.application.update({
      where: { id: application.id },
      data: {
        status: ApplicationStatus.OFFERED,
        reviewedAt: new Date(),
      },
    });

    await writeAuditLog(
      {
        actorId: auth.user.id,
        action: AuditAction.CREATE,
        entityType: "ProgramEnrollment",
        entityId: programEnrollment.id,
        summary: `Registrar activated ${application.user.email} for ${application.program.title}.`,
        payload: {
          reference: application.reference,
          programId: application.programId,
          courseCount: plannedCourses.length,
        },
      },
      tx
    );
  });

  await attachUserRole(application.userId, "student");

  await sendTransactionalEmail({
    to: application.user.email,
    subject: `Ruguna admission offer: ${application.reference}`,
    text: `Dear applicant,\n\nYour Ruguna College application has been marked as Offered and your learner record has been prepared.\n\nReference: ${application.reference}\nProgramme: ${application.program.title}\n\nTrack your application here:\n${applicationStatusUrl()}\n\nUse your reference and the email address that received this message.\n\nYou can sign in to Ruguna eLearning to view your learner workspace when access is active.\n\nRuguna College\nOne Who Prevails`,
  });

  revalidatePath("/registrar");
  revalidatePath("/registrar/applications");
  revalidatePath("/registrar/learners");
  revalidatePath("/apply/status");
  redirect("/registrar/applications?status=enrollment-activated");
}
