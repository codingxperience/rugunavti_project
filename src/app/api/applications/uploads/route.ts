import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { hasSupabase, platformEnv } from "@/lib/platform/env";
import { enforceRateLimit } from "@/lib/platform/rate-limit";
import { getSupabaseAdmin, maxUploadBytes, validateUploadMetadata } from "@/lib/platform/storage";

export const runtime = "nodejs";

const extensionMimeTypes: Record<string, string> = {
  csv: "text/csv",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  pdf: "application/pdf",
  png: "image/png",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  webp: "image/webp",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

function safeFileName(name: string) {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return cleaned || "supporting-document";
}

function inferMimeType(name: string, fallback: string) {
  if (fallback) return fallback;

  const extension = name.split(".").pop()?.toLowerCase();

  return extension ? extensionMimeTypes[extension] ?? "" : "";
}

function readFormString(value: FormDataEntryValue | null, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export async function POST(request: Request) {
  const rateLimitResponse = enforceRateLimit(request, {
    keyPrefix: "application-uploads",
    limit: 12,
    windowMs: 60 * 1000,
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  if (!hasSupabase) {
    return NextResponse.json(
      {
        success: false,
        message: "Document upload is not configured yet. You can still submit the form without files.",
      },
      { status: 503 }
    );
  }

  const formData = await request.formData().catch(() => null);
  const fileEntry = formData?.get("file");

  if (!fileEntry || typeof fileEntry !== "object" || !("arrayBuffer" in fileEntry)) {
    return NextResponse.json(
      { success: false, message: "Choose a document to upload." },
      { status: 400 }
    );
  }

  const file = fileEntry as File;
  const originalName = safeFileName(file.name || "supporting-document");
  const mimeType = inferMimeType(originalName, file.type);
  const category = readFormString(formData?.get("category") ?? null, "supporting-document");
  const bucket = platformEnv.supabasePrivateBucket;
  const path = `applications/${new Date().getFullYear()}/${randomUUID()}-${originalName}`;

  try {
    validateUploadMetadata({
      bucket,
      path,
      mimeType,
      sizeBytes: file.size,
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: mimeType,
      upsert: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      document: {
        originalName,
        mimeType,
        sizeBytes: file.size,
        bucket,
        path,
        category,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : `Upload failed. Files must be ${Math.round(maxUploadBytes / (1024 * 1024))} MB or smaller.`,
      },
      { status: 400 }
    );
  }
}
