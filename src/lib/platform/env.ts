const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const normalizedSiteUrl = rawSiteUrl.replace(/\/$/, "");
const isLocalSiteUrl =
  normalizedSiteUrl.includes("localhost") || normalizedSiteUrl.includes("127.0.0.1");

export const platformEnv = {
  siteUrl: rawSiteUrl,
  nodeEnv: process.env.NODE_ENV || "development",
  useDatabase: process.env.RUGUNA_USE_DATABASE === "true",
  allowDevAuth: process.env.RUGUNA_ALLOW_DEV_AUTH === "true",
  enableAnalytics: process.env.RUGUNA_ENABLE_ANALYTICS === "true",
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  clerkProxyUrl:
    process.env.NEXT_PUBLIC_CLERK_PROXY_URL ||
    (isLocalSiteUrl ? undefined : `${normalizedSiteUrl}/__clerk`),
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabasePublicBucket: process.env.SUPABASE_BUCKET_PUBLIC || "ruguna-public",
  supabasePrivateBucket: process.env.SUPABASE_BUCKET_PRIVATE || "ruguna-private",
  resendApiKey: process.env.RESEND_API_KEY,
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
};

export const isProduction = platformEnv.nodeEnv === "production";

export const hasClerk =
  Boolean(platformEnv.clerkPublishableKey) && Boolean(platformEnv.clerkSecretKey);

export const hasDatabase = Boolean(process.env.DATABASE_URL);
export const hasSupabase =
  Boolean(platformEnv.supabaseUrl) && Boolean(platformEnv.supabaseServiceRoleKey);
export const hasResend = Boolean(platformEnv.resendApiKey);
export const hasPostHog = Boolean(platformEnv.posthogKey) && platformEnv.enableAnalytics;

export const requiredProductionEnvKeys = [
  "NEXT_PUBLIC_SITE_URL",
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_WEBHOOK_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_BUCKET_PUBLIC",
  "SUPABASE_BUCKET_PRIVATE",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
] as const;

export function getMissingProductionEnv(env: NodeJS.ProcessEnv = process.env) {
  return requiredProductionEnvKeys.filter((key) => !env[key]);
}

export function getProductionEnvWarnings(env: NodeJS.ProcessEnv = process.env) {
  const warnings: string[] = [];

  if (env.RUGUNA_ALLOW_DEV_AUTH === "true") {
    warnings.push("RUGUNA_ALLOW_DEV_AUTH must be false in production.");
  }

  if (env.RUGUNA_USE_DATABASE !== "true") {
    warnings.push("RUGUNA_USE_DATABASE must be true in production.");
  }

  if (env.NEXT_PUBLIC_SITE_URL?.includes("localhost")) {
    warnings.push("NEXT_PUBLIC_SITE_URL must be the deployed Ruguna domain in production.");
  }

  if (
    env.NEXT_PUBLIC_SITE_URL &&
    !env.NEXT_PUBLIC_SITE_URL.includes("localhost") &&
    !env.NEXT_PUBLIC_CLERK_PROXY_URL
  ) {
    warnings.push(
      "NEXT_PUBLIC_CLERK_PROXY_URL is not set; the app will derive it from NEXT_PUBLIC_SITE_URL, but Vercel and Clerk Dashboard should explicitly use the same /__clerk URL."
    );
  }

  if (env.DATABASE_URL && !env.DATABASE_URL.includes("sslmode=require")) {
    warnings.push("DATABASE_URL should enforce sslmode=require for Supabase/Postgres.");
  }

  return warnings;
}
