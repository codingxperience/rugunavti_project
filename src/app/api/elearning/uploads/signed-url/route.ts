import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { writeAuditLog } from "@/lib/platform/audit";
import { hasSupabase } from "@/lib/platform/env";
import { signedUploadSchema } from "@/lib/platform/schemas";
import { createSignedUploadUrl } from "@/lib/platform/storage";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
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
    const signedUpload = await createSignedUploadUrl(result.data);

    await writeAuditLog({
      actorId: auth.user.id,
      action: AuditAction.CREATE,
      entityType: "StorageUploadUrl",
      entityId: signedUpload.path,
      summary: `${auth.user.email} requested a signed upload URL.`,
      payload: {
        bucket: signedUpload.bucket,
        path: signedUpload.path,
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
