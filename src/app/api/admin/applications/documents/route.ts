import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { createSignedDownloadUrl } from "@/lib/platform/storage";
import { requireApiUser } from "@/lib/platform/users";

function readDocumentAt(value: unknown, index: number) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const uploadedDocuments = (value as Record<string, unknown>).uploadedDocuments;

  if (!Array.isArray(uploadedDocuments)) {
    return null;
  }

  const document = uploadedDocuments[index];

  if (!document || typeof document !== "object" || Array.isArray(document)) {
    return null;
  }

  const record = document as Record<string, unknown>;
  const bucket = typeof record.bucket === "string" ? record.bucket : "";
  const path = typeof record.path === "string" ? record.path : "";

  return bucket && path ? { bucket, path } : null;
}

export async function GET(request: Request) {
  const auth = await requireApiUser(["registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const url = new URL(request.url);
  const applicationId = url.searchParams.get("applicationId");
  const index = Number(url.searchParams.get("index") ?? "0");

  if (!applicationId || !Number.isInteger(index) || index < 0) {
    return NextResponse.json(
      { success: false, message: "Choose a valid application document." },
      { status: 400 }
    );
  }

  const application = await getDb().application.findUnique({
    where: { id: applicationId },
    select: { documents: true },
  });
  const document = readDocumentAt(application?.documents, index);

  if (!document) {
    return NextResponse.json(
      { success: false, message: "That application document was not found." },
      { status: 404 }
    );
  }

  const signedUrl = await createSignedDownloadUrl({
    bucket: document.bucket,
    path: document.path,
    expiresInSeconds: 60 * 5,
  });

  return NextResponse.redirect(signedUrl);
}
