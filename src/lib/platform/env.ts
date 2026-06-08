const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const normalizedSiteUrl = rawSiteUrl.replace(/\/$/, "");
const isLocalSiteUrl =
  normalizedSiteUrl.includes("localhost") || normalizedSiteUrl.includes("127.0.0.1");
let normalizedSiteOrigin: string | null = null;

try {
  normalizedSiteOrigin = new URL(normalizedSiteUrl).origin;
} catch {
  normalizedSiteOrigin = null;
}

const rawClerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkUsesLiveKeys = rawClerkPublishableKey?.startsWith("pk_live_") ?? false;
const rawClerkProxyUrl =
  process.env.NEXT_PUBLIC_CLERK_PROXY_URL ||
  (isLocalSiteUrl ? undefined : `${normalizedSiteUrl}/__clerk`);

function readSecret(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (!/^[\x20-\x7E]+$/.test(trimmed) || trimmed.includes("•")) {
    return undefined;
  }

  return trimmed;
}

function parseEmailList(value: string | undefined) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

function parsePositiveInteger(value: string | undefined) {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : null;
}

export const platformEnv = {
  siteUrl: rawSiteUrl,
  siteOrigin: normalizedSiteOrigin,
  nodeEnv: process.env.NODE_ENV || "development",
  useDatabase: process.env.RUGUNA_USE_DATABASE === "true",
  allowDevAuth: process.env.RUGUNA_ALLOW_DEV_AUTH === "true",
  enableAnalytics: process.env.RUGUNA_ENABLE_ANALYTICS === "true",
  workspaceIdleMinutes:
    parsePositiveInteger(process.env.RUGUNA_WORKSPACE_IDLE_MINUTES) ??
    parsePositiveInteger(process.env.NEXT_PUBLIC_RUGUNA_WORKSPACE_IDLE_MINUTES) ??
    3,
  clerkPublishableKey: rawClerkPublishableKey,
  clerkSecretKey: readSecret(process.env.CLERK_SECRET_KEY),
  clerkUsesLiveKeys,
  clerkProxyUrl: clerkUsesLiveKeys ? rawClerkProxyUrl : undefined,
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET,
  cronSecret: process.env.CRON_SECRET,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabasePublicBucket: process.env.SUPABASE_BUCKET_PUBLIC || "ruguna-public",
  supabasePrivateBucket: process.env.SUPABASE_BUCKET_PRIVATE || "ruguna-private",
  resendApiKey: process.env.RESEND_API_KEY,
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
  bootstrapRoleEmails: {
    superAdmin: parseEmailList(process.env.RUGUNA_SUPER_ADMIN_EMAILS),
    registrarAdmin: parseEmailList(process.env.RUGUNA_REGISTRAR_ADMIN_EMAILS),
    financeAdmin: parseEmailList(process.env.RUGUNA_FINANCE_ADMIN_EMAILS),
    instructor: parseEmailList(process.env.RUGUNA_INSTRUCTOR_EMAILS),
  },
};

export const isProduction = platformEnv.nodeEnv === "production";

export const hasClerk =
  Boolean(platformEnv.clerkPublishableKey) && Boolean(platformEnv.clerkSecretKey);

export const hasDatabase = Boolean(process.env.DATABASE_URL);
export const hasSupabase =
  Boolean(platformEnv.supabaseUrl) && Boolean(platformEnv.supabaseServiceRoleKey);
export const hasResend = Boolean(platformEnv.resendApiKey);
export const hasPostHog = Boolean(platformEnv.posthogKey) && platformEnv.enableAnalytics;

export function getAuthorizedPartyOrigins(additionalOrigins: Array<string | null | undefined> = []) {
  const origins = [platformEnv.siteOrigin, ...additionalOrigins]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.replace(/\/$/, ""));

  return Array.from(new Set(origins));
}

export const requiredProductionEnvKeys = [
  "NEXT_PUBLIC_SITE_URL",
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_WEBHOOK_SECRET",
  "CRON_SECRET",
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

  const serverIdleMinutes = parsePositiveInteger(env.RUGUNA_WORKSPACE_IDLE_MINUTES);
  const clientIdleMinutes = parsePositiveInteger(env.NEXT_PUBLIC_RUGUNA_WORKSPACE_IDLE_MINUTES);

  if ((serverIdleMinutes ?? clientIdleMinutes ?? 3) > 30) {
    warnings.push("Ruguna workspace idle timeout should be 30 minutes or less for protected dashboards.");
  }

  if (serverIdleMinutes && clientIdleMinutes && serverIdleMinutes !== clientIdleMinutes) {
    warnings.push("RUGUNA_WORKSPACE_IDLE_MINUTES and NEXT_PUBLIC_RUGUNA_WORKSPACE_IDLE_MINUTES should match.");
  }

  if (env.NEXT_PUBLIC_SITE_URL?.includes("localhost")) {
    warnings.push("NEXT_PUBLIC_SITE_URL must be the deployed Ruguna domain in production.");
  }

  if (env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_test_")) {
    warnings.push(
      "Clerk is using test keys, so proxy-based Frontend API routing is disabled until live keys are configured."
    );
  }

  if (env.CLERK_SECRET_KEY && !readSecret(env.CLERK_SECRET_KEY)) {
    warnings.push(
      "CLERK_SECRET_KEY contains invalid characters. Paste the real sk_test_ or sk_live_ value, not a masked dashboard value."
    );
  }

  if (
    env.NEXT_PUBLIC_SITE_URL &&
    !env.NEXT_PUBLIC_SITE_URL.includes("localhost") &&
    env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_live_") &&
    !env.NEXT_PUBLIC_CLERK_PROXY_URL
  ) {
    warnings.push(
      "NEXT_PUBLIC_CLERK_PROXY_URL is not set; the app will derive it from NEXT_PUBLIC_SITE_URL, but Vercel and Clerk Dashboard should explicitly use the same /__clerk URL."
    );
  }

  if (env.DATABASE_URL && !env.DATABASE_URL.includes("sslmode=require")) {
    warnings.push("DATABASE_URL should enforce sslmode=require for Supabase/Postgres.");
  }

  if (env.RUGUNA_PAYMENT_MODE === "live") {
    if (env.STRIPE_SECRET_KEY && !env.STRIPE_WEBHOOK_SECRET) {
      warnings.push("STRIPE_WEBHOOK_SECRET is required when Stripe live checkout is enabled.");
    }

    if (env.FLUTTERWAVE_SECRET_KEY && !env.FLUTTERWAVE_WEBHOOK_SECRET_HASH) {
      warnings.push("FLUTTERWAVE_WEBHOOK_SECRET_HASH is required when Flutterwave live checkout is enabled.");
    }
  }

  if (env.RUGUNA_PAYMENT_MODE !== "live") {
    if (env.STRIPE_SECRET_KEY && !env.STRIPE_WEBHOOK_SECRET) {
      warnings.push("Stripe test checkout is configured, but STRIPE_WEBHOOK_SECRET is missing.");
    }

    if (env.FLUTTERWAVE_SECRET_KEY && !env.FLUTTERWAVE_WEBHOOK_SECRET_HASH) {
      warnings.push("Flutterwave test checkout is configured, but FLUTTERWAVE_WEBHOOK_SECRET_HASH is missing.");
    }
  }

  return warnings;
}
