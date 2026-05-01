import { AuditAction, ContentStatus, EnrollmentStatus, ProgramLevel } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { courseEnrollmentSchema } from "@/lib/platform/schemas";
import { attachUserRole, requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["student", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = courseEnrollmentSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();

  try {
    const course = await db.course.findFirst({
      where: {
        slug: result.data.courseSlug,
        status: ContentStatus.PUBLISHED,
      },
      include: {
        program: true,
        programCourses: {
          include: {
            program: true,
          },
        },
        offerings: {
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { startDate: "asc" },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "This course is not available for enrollment." },
        { status: 404 }
      );
    }

    await attachUserRole(auth.user.id, "student");

    const requestedProgramId = result.data.programId;
    const belongsToRequestedProgram =
      requestedProgramId === course.programId ||
      course.programCourses.some((item) => item.programId === requestedProgramId);
    const programId = requestedProgramId && belongsToRequestedProgram ? requestedProgramId : course.programId;
    const selectedProgram =
      programId === course.programId
        ? course.program
        : course.programCourses.find((item) => item.programId === programId)?.program ?? course.program;
    const existingProgramEnrollment = await db.programEnrollment.findUnique({
      where: {
        userId_programId: {
          userId: auth.user.id,
          programId,
        },
      },
    });
    const hasAcademicPlacement =
      existingProgramEnrollment?.status === EnrollmentStatus.ACTIVE ||
      existingProgramEnrollment?.status === EnrollmentStatus.PENDING;

    if (selectedProgram.level !== ProgramLevel.SHORT_COURSE && !hasAcademicPlacement) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This course belongs to an academic programme. Apply through admissions first so Ruguna can verify entry requirements, equivalencies, intake placement, and your approved course plan.",
        },
        { status: 403 }
      );
    }

    const requestedOffering = result.data.courseOfferingId
      ? course.offerings.find(
          (offering) =>
            offering.id === result.data.courseOfferingId &&
            (!offering.programId || offering.programId === programId)
        )
      : null;
    const courseOffering =
      requestedOffering ??
      course.offerings.find((offering) => !offering.programId || offering.programId === programId) ??
      null;
    let programEnrollment = existingProgramEnrollment;

    if (
      programEnrollment &&
      selectedProgram.level === ProgramLevel.SHORT_COURSE &&
      programEnrollment.status !== EnrollmentStatus.ACTIVE
    ) {
      programEnrollment = await db.programEnrollment.update({
        where: { id: programEnrollment.id },
        data: { status: EnrollmentStatus.ACTIVE },
      });
    }

    if (!programEnrollment) {
      programEnrollment = await db.programEnrollment.create({
        data: {
          userId: auth.user.id,
          programId,
          status: EnrollmentStatus.ACTIVE,
        },
      });
    }

    const enrollment = await db.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: auth.user.id,
          courseId: course.id,
        },
      },
      update: {
        status: EnrollmentStatus.ACTIVE,
        programId,
        programEnrollmentId: programEnrollment.id,
        courseOfferingId: courseOffering?.id,
      },
      create: {
        userId: auth.user.id,
        programId,
        courseId: course.id,
        programEnrollmentId: programEnrollment.id,
        courseOfferingId: courseOffering?.id,
        status: EnrollmentStatus.ACTIVE,
      },
    });

    await writeAuditLog({
      actorId: auth.user.id,
      action: AuditAction.CREATE,
      entityType: "Enrollment",
      entityId: enrollment.id,
      summary: `${auth.user.email} enrolled in ${course.title}.`,
      payload: {
        courseSlug: course.slug,
        programId,
        programEnrollmentId: programEnrollment.id,
        courseOfferingId: courseOffering?.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Enrollment saved. You can now continue into the classroom.",
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        progressPercent: enrollment.progressPercent,
        courseSlug: course.slug,
      },
    });
  } catch (error) {
    console.error("Course enrollment failed", error);

    return NextResponse.json(
      { success: false, message: "Enrollment could not be saved. Please try again." },
      { status: 500 }
    );
  }
}
