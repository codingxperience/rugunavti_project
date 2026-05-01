import { AuditAction, ContentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { sendTransactionalEmail } from "@/lib/platform/email";
import { hasDatabase, platformEnv } from "@/lib/platform/env";
import { enforceRateLimit } from "@/lib/platform/rate-limit";
import { createUniqueReference } from "@/lib/platform/references";
import { applicationFormSchema } from "@/lib/platform/schemas";

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts.shift() ?? fullName;
  const lastName = parts.length ? parts.join(" ") : "Applicant";

  return { firstName, lastName };
}

function createFallbackReference() {
  return `RUG-APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
}

export async function POST(request: Request) {
  const rateLimitResponse = enforceRateLimit(request, {
    keyPrefix: "applications",
    limit: 4,
    windowMs: 60 * 1000,
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const payload = await request.json().catch(() => null);
  const result = applicationFormSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  if (!platformEnv.useDatabase) {
    return NextResponse.json({
      success: true,
      message: "Your application interest has been submitted to admissions review.",
      reference: createFallbackReference(),
    });
  }

  if (!hasDatabase) {
    return NextResponse.json(
      {
        success: false,
        message: "Database is not configured. Admissions could not save this application.",
      },
      { status: 503 }
    );
  }

  const db = getDb();
  const values = result.data;
  const { firstName, lastName } = splitName(values.fullName);
  const whatsapp = `${values.whatsappCountryCode} ${values.whatsapp}`.trim();
  const alternativePhone = values.alternativePhone
    ? `${values.alternativePhoneCountryCode} ${values.alternativePhone}`.trim()
    : null;
  const nextOfKinPhone = `${values.nextOfKinPhoneCountryCode} ${values.nextOfKinPhone}`.trim();
  const dateOfBirth = `${values.dateOfBirthYear}-${values.dateOfBirthMonth.padStart(2, "0")}-${values.dateOfBirthDay.padStart(2, "0")}`;

  try {
    const reference = await createUniqueReference("RUG-APP", async (candidate) => {
      const existing = await db.application.findUnique({ where: { reference: candidate } });
      return Boolean(existing);
    });

    const applicant = await db.user.upsert({
      where: { email: values.email.toLowerCase() },
      update: {
        isActive: true,
        profile: {
          upsert: {
            update: {
              firstName,
              lastName,
              phone: alternativePhone,
              whatsapp,
              nationality: values.nationality,
              country: values.nationality,
            },
            create: {
              firstName,
              lastName,
              phone: alternativePhone,
              whatsapp,
              nationality: values.nationality,
              country: values.nationality,
            },
          },
        },
      },
      create: {
        email: values.email.toLowerCase(),
        isActive: true,
        profile: {
          create: {
            firstName,
            lastName,
            phone: alternativePhone,
            whatsapp,
            nationality: values.nationality,
            country: values.nationality,
          },
        },
      },
    });

    const applicantRole = await db.role.upsert({
      where: { slug: "applicant" },
      update: {},
      create: {
        slug: "applicant",
        name: "Applicant",
        description: "Applicant with access to application workflows",
      },
    });

    await db.userRole.upsert({
      where: {
        userId_roleId: {
          userId: applicant.id,
          roleId: applicantRole.id,
        },
      },
      update: {},
      create: {
        userId: applicant.id,
        roleId: applicantRole.id,
      },
    });

    const program =
      (await db.program.findFirst({
        where: {
          title: values.firstChoice,
          status: ContentStatus.PUBLISHED,
        },
      })) ??
      (await db.program.findFirst({
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { createdAt: "asc" },
      }));

    if (!program) {
      throw new Error("No published programs are available in the database.");
    }

    const intake = await db.intake.findFirst({
      where: {
        programId: program.id,
        title: values.preferredIntake,
        status: ContentStatus.PUBLISHED,
      },
    });

    const application = await db.application.create({
      data: {
        userId: applicant.id,
        programId: program.id,
        intakeId: intake?.id,
        reference,
        firstChoice: values.firstChoice,
        secondChoice: values.secondChoice || null,
        notes: values.goals || null,
        documents: {
          applicant: {
            fullName: values.fullName,
            email: values.email,
            gender: values.gender,
            dateOfBirth,
            nationality: values.nationality,
            hasDisability: values.hasDisability,
          },
          contact: {
            whatsappCountryCode: values.whatsappCountryCode,
            whatsapp: values.whatsapp,
            whatsappFormatted: whatsapp,
            alternativePhoneCountryCode: values.alternativePhoneCountryCode,
            alternativePhone: values.alternativePhone ?? null,
            alternativePhoneFormatted: alternativePhone,
          },
          nextOfKin: {
            name: values.nextOfKinName,
            email: values.nextOfKinEmail,
            relationship: values.nextOfKinRelationship,
            phoneCountryCode: values.nextOfKinPhoneCountryCode,
            phone: values.nextOfKinPhone,
            phoneFormatted: nextOfKinPhone,
          },
          preferredLevel: values.preferredLevel,
          preferredIntake: values.preferredIntake,
          studyMode: values.studyMode,
          education: {
            previousDegreeProgramme: values.previousDegreeProgramme,
            classOfDegree: values.classOfDegree,
            highestQualification: values.highestQualification,
            creditTransfer: values.creditTransfer,
          },
          highestQualification: values.highestQualification,
          creditTransfer: values.creditTransfer,
          referralSource: values.referralSource,
          documentUploadChoice: values.documentUploadChoice,
          uploadedDocuments: values.uploadedDocuments,
          documentCount: values.uploadedDocuments.length,
          submittedFrom: "website",
        },
        submittedAt: new Date(),
      },
    });

    await writeAuditLog({
      action: AuditAction.CREATE,
      entityType: "Application",
      entityId: application.id,
      summary: `Application ${application.reference} submitted from website.`,
      payload: {
        reference: application.reference,
        firstChoice: values.firstChoice,
        preferredIntake: values.preferredIntake,
        preferredLevel: values.preferredLevel,
        creditTransfer: values.creditTransfer,
        referralSource: values.referralSource,
        documentCount: values.uploadedDocuments.length,
      },
    });

    await sendTransactionalEmail({
      to: values.email,
      subject: `Ruguna application received: ${application.reference}`,
      text: `Dear ${values.fullName},\n\nYour Ruguna College application interest has been received.\n\nReference: ${application.reference}\nProgramme: ${values.firstChoice}\nAward level: ${values.preferredLevel}\nIntake: ${values.preferredIntake}\nWhatsApp: ${whatsapp}\nCredit transfer: ${values.creditTransfer}\nDocuments uploaded: ${values.uploadedDocuments.length}\n\nAdmissions will review your submission and follow up through your provided contacts.\n\nRuguna College\nOne Who Prevails`,
    });

    return NextResponse.json({
      success: true,
      message: "Your application interest has been saved and routed to admissions review.",
      reference: application.reference,
    });
  } catch (error) {
    console.error("Application submission failed", error);

    return NextResponse.json(
      {
        success: false,
        message: "Admissions could not save this application. Please try again or contact support.",
      },
      { status: 500 }
    );
  }
}
