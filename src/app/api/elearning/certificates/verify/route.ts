import { AuditAction, CertificateStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { hasDatabase, platformEnv } from "@/lib/platform/env";
import { enforceRateLimit } from "@/lib/platform/rate-limit";
import { verificationSchema } from "@/lib/platform/schemas";

export async function GET(request: Request) {
  const rateLimitResponse = enforceRateLimit(request, {
    keyPrefix: "certificate-verify",
    limit: 20,
    windowMs: 60 * 1000,
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { searchParams } = new URL(request.url);
  const result = verificationSchema.safeParse({ code: searchParams.get("code") ?? "" });

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Enter a valid certificate verification code." },
      { status: 400 }
    );
  }

  if (!platformEnv.useDatabase || !hasDatabase) {
    return NextResponse.json(
      { success: false, message: "Certificate verification database is not configured." },
      { status: 503 }
    );
  }

  const db = getDb();

  try {
    const verification = await db.certificateVerification.findUnique({
      where: { verificationCode: result.data.code },
      include: {
        certificate: {
          include: {
            user: { include: { profile: true } },
            program: true,
            course: true,
          },
        },
      },
    });

    if (!verification || verification.certificate.status !== CertificateStatus.ISSUED) {
      return NextResponse.json(
        { success: false, message: "No active certificate was found for this code." },
        { status: 404 }
      );
    }

    const updatedVerification = await db.certificateVerification.update({
      where: { id: verification.id },
      data: { lastVerifiedAt: new Date() },
    });

    await writeAuditLog({
      action: AuditAction.VERIFY,
      entityType: "CertificateVerification",
      entityId: verification.id,
      summary: `Certificate ${verification.certificate.reference} verified publicly.`,
      payload: {
        verificationCode: verification.verificationCode,
        certificateReference: verification.certificate.reference,
      },
    });

    return NextResponse.json({
      success: true,
      certificate: {
        reference: verification.certificate.reference,
        verificationCode: verification.verificationCode,
        learnerName: [
          verification.certificate.user.profile?.firstName,
          verification.certificate.user.profile?.lastName,
        ]
          .filter(Boolean)
          .join(" "),
        courseTitle: verification.certificate.course?.title,
        programTitle: verification.certificate.program.title,
        issuedAt: verification.certificate.issuedAt,
        expiresAt: verification.certificate.expiresAt,
        lastVerifiedAt: updatedVerification.lastVerifiedAt,
      },
    });
  } catch (error) {
    console.error("Certificate verification failed", error);

    return NextResponse.json(
      { success: false, message: "Certificate verification failed. Please try again." },
      { status: 500 }
    );
  }
}
