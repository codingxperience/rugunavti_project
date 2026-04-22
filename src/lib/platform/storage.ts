import { createClient } from "@supabase/supabase-js";

import { hasSupabase, platformEnv } from "@/lib/platform/env";

export const allowedUploadMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

export const maxUploadBytes = 20 * 1024 * 1024;

const allowedMimeTypes = new Set<string>(allowedUploadMimeTypes);

export function getAllowedStorageBuckets() {
  return [
    {
      id: platformEnv.supabasePublicBucket,
      isPublic: true,
    },
    {
      id: platformEnv.supabasePrivateBucket,
      isPublic: false,
    },
  ].filter((bucket) => bucket.id);
}

function validateBucket(bucket: string) {
  const allowedBuckets = new Set(getAllowedStorageBuckets().map((item) => item.id));

  if (!allowedBuckets.has(bucket)) {
    throw new Error("This storage bucket is not allowed for Ruguna uploads.");
  }
}

function validateStoragePath(path: string) {
  const cleanPathPattern = /^[a-zA-Z0-9][a-zA-Z0-9/_.,=-]*$/;

  if (!cleanPathPattern.test(path) || path.includes("..") || path.includes("//")) {
    throw new Error("This storage path is not allowed.");
  }
}

let supabaseAdminClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (!hasSupabase || !platformEnv.supabaseUrl || !platformEnv.supabaseServiceRoleKey) {
    throw new Error("Supabase service credentials are not configured.");
  }

  supabaseAdminClient ??= createClient(
    platformEnv.supabaseUrl,
    platformEnv.supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return supabaseAdminClient;
}

export function validateUploadMetadata(input: {
  bucket?: string;
  path?: string;
  mimeType: string;
  sizeBytes: number;
}) {
  if (input.bucket) {
    validateBucket(input.bucket);
  }

  if (input.path) {
    validateStoragePath(input.path);
  }

  if (!allowedMimeTypes.has(input.mimeType)) {
    throw new Error("This file type is not allowed.");
  }

  if (input.sizeBytes > maxUploadBytes) {
    throw new Error("Files must be 20 MB or smaller.");
  }
}

export async function createSignedDownloadUrl(input: {
  bucket: string;
  path: string;
  expiresInSeconds?: number;
}) {
  validateBucket(input.bucket);
  validateStoragePath(input.path);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(input.bucket)
    .createSignedUrl(input.path, input.expiresInSeconds ?? 60 * 10);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message || "Unable to create a signed download URL.");
  }

  return data.signedUrl;
}

export async function createSignedUploadUrl(input: {
  bucket: string;
  path: string;
  mimeType: string;
  sizeBytes: number;
}) {
  validateUploadMetadata({
    bucket: input.bucket,
    path: input.path,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
  });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from(input.bucket).createSignedUploadUrl(input.path);

  if (error || !data?.signedUrl || !data?.token) {
    throw new Error(error?.message || "Unable to create a signed upload URL.");
  }

  return {
    signedUrl: data.signedUrl,
    token: data.token,
    path: input.path,
    bucket: input.bucket,
  };
}
