import { AuditAction, CertificateStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { createUniqueReference } from "@/lib/platform/references";
import { certificateIssueSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = certificateIssueSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();

  try {
    const enrollment = await db.enrollment.findUnique({
      where: { id: result.data.enrollmentId },
      include: {
        user: { include: { profile: true } },
        program: true,
        course: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "Enrollment was not found." },
        { status: 404 }
      );
    }

    if (!enrollment.eligibleForCertificate && !result.data.force) {
      return NextResponse.json(
        {
          success: false,
          message: "This learner is not yet eligible for a certificate. Use force only after manual review.",
        },
        { status: 409 }
      );
    }

    const existing = await db.certificate.findFirst({
      where: {
        enrollmentId: enrollment.id,
        status: CertificateStatus.ISSUED,
      },
      include: { verification: true },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Certificate was already issued.",
        certificate: existing,
      });
    }

    const reference = await createUniqueReference("RUG-CERT", async (candidate) => {
      const existingCertificate = await db.certificate.findUnique({ where: { reference: candidate } });
      return Boolean(existingCertificate);
    });
    const verificationCode = await createUniqueReference("RUG-VERIFY", async (candidate) => {
      const existingVerification = await db.certificateVerification.findUnique({
        where: { verificationCode: candidate },
      });
      return Boolean(existingVerification);
    });

    const certificate = await db.certificate.create({
      data: {
        userId: enrollment.userId,
        enrollmentId: enrollment.id,
        programId: enrollment.programId,
        courseId: enrollment.courseId,
        reference,
        certificateUrl: result.data.certificateUrl,
        expiresAt: result.data.expiresAt ? new Date(result.data.expiresAt) : null,
        status: CertificateStatus.ISSUED,
        verification: {
          create: {
            verificationCode,
          },
        },
      },
      include: {
        verification: true,
        user: { include: { profile: true } },
        course: true,
        program: true,
      },
    });

    await writeAuditLog({
      actorId: auth.user.id,
      action: AuditAction.ISSUE,
      entityType: "Certificate",
      entityId: certificate.id,
      summary: `${auth.user.email} issued certificate ${certificate.reference}.`,
      payload: {
        enrollmentId: enrollment.id,
        learnerEmail: enrollment.user.email,
        courseSlug: enrollment.course.slug,
        verificationCode,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Certificate issued.",
      certificate,
    });
  } catch (error) {
    console.error("Certificate issue failed", error);

    return NextResponse.json(
      { success: false, message: "Certificate could not be issued." },
      { status: 500 }
    );
  }
}
