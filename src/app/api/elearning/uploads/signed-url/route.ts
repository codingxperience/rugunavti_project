import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { writeAuditLog } from "@/lib/platform/audit";
import { hasSupabase, platformEnv } from "@/lib/platform/env";
import { enforceRateLimit } from "@/lib/platform/rate-limit";
import { signedUploadSchema } from "@/lib/platform/schemas";
import { assertStoragePathWithinPrefixes, createSignedUploadUrl } from "@/lib/platform/storage";
import { requireApiUser } from "@/lib/platform/users";

function hasStaffUploadAccess(user: { userRoles: Array<{ role: { slug: string } }> }) {
  return user.userRoles.some(({ role }) =>
    ["instructor", "registrar_admin", "super_admin"].includes(role.slug)
  );
}

function allowedUploadPrefixes(userId: string, staffAccess: boolean) {
  if (staffAccess) {
    return [
      "course-resources/",
      "courses/",
      "lessons/",
      "assignments/feedback/",
      "announcements/",
    ];
  }

  return [
    `submissions/${userId}/`,
    `learners/${userId}/assignments/`,
    `learners/${userId}/support/`,
  ];
}

export async function POST(request: Request) {
  const rateLimitResponse = enforceRateLimit(request, {
    keyPrefix: "elearning-signed-uploads",
    limit: 30,
    windowMs: 60 * 1000,
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const auth = await requireApiUser(["student", "instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  if (!hasSupabase) {
    return NextResponse.json(
      { success: false, message: "Supabase Storage is not configured." },
      { status: 503 }
    );
  }

  const payload = await request.json().catch(() => null);
  const result = signedUploadSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  try {
    if (result.data.bucket !== platformEnv.supabasePrivateBucket) {
      return NextResponse.json(
        { success: false, message: "eLearning uploads must use Ruguna private storage." },
        { status: 400 }
      );
    }

    const staffAccess = hasStaffUploadAccess(auth.user);
    const prefixes = allowedUploadPrefixes(auth.user.id, staffAccess);

    assertStoragePathWithinPrefixes(result.data.path, prefixes);

    const signedUpload = await createSignedUploadUrl({
      ...result.data,
      bucket: platformEnv.supabasePrivateBucket,
    });

    await writeAuditLog({
      actorId: auth.user.id,
      action: AuditAction.CREATE,
      entityType: "StorageUploadUrl",
      entityId: signedUpload.path,
      summary: `${auth.user.email} requested a signed upload URL.`,
      payload: {
        bucket: signedUpload.bucket,
        path: signedUpload.path,
        scope: staffAccess ? "staff-course-content" : "learner-workspace",
        mimeType: result.data.mimeType,
        sizeBytes: result.data.sizeBytes,
      },
    });

    return NextResponse.json({
      success: true,
      upload: signedUpload,
    });
  } catch (error) {
    console.error("Signed upload URL creation failed", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to create upload URL.",
      },
      { status: 400 }
    );
  }
}
