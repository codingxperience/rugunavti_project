import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

async function main() {
  loadEnvConfig(process.cwd());

  const {
    allowedUploadMimeTypes,
    getAllowedStorageBuckets,
    maxUploadBytes,
  } = await import("../src/lib/platform/storage");

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Supabase Storage setup failed: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
    process.exit(1);
  }

  const buckets = getAllowedStorageBuckets();

  if (!buckets.length) {
    console.error("Supabase Storage setup failed: no storage buckets are configured.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(`Unable to list Supabase buckets: ${listError.message}`);
  }

  const existingBucketIds = new Set((existingBuckets ?? []).map((bucket) => bucket.id));

  for (const bucket of buckets) {
    const options = {
      public: bucket.isPublic,
      fileSizeLimit: maxUploadBytes,
      allowedMimeTypes: [...allowedUploadMimeTypes],
    };

    const result = existingBucketIds.has(bucket.id)
      ? await supabase.storage.updateBucket(bucket.id, options)
      : await supabase.storage.createBucket(bucket.id, options);

    if (result.error) {
      throw new Error(`Unable to configure bucket ${bucket.id}: ${result.error.message}`);
    }

    console.log(
      `${existingBucketIds.has(bucket.id) ? "Updated" : "Created"} bucket: ${bucket.id} (${bucket.isPublic ? "public" : "private"})`
    );
  }

  console.log("Supabase Storage setup complete.");
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
