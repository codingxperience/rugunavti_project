export const platformEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  useDatabase: process.env.RUGUNA_USE_DATABASE === "true",
  allowDevAuth: process.env.RUGUNA_ALLOW_DEV_AUTH === "true",
  enableAnalytics: process.env.RUGUNA_ENABLE_ANALYTICS === "true",
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
};

export const hasClerk =
  Boolean(platformEnv.clerkPublishableKey) && Boolean(platformEnv.clerkSecretKey);

export const hasDatabase = Boolean(process.env.DATABASE_URL);
export const hasSupabase =
  Boolean(platformEnv.supabaseUrl) && Boolean(platformEnv.supabaseServiceRoleKey);
export const hasResend = Boolean(platformEnv.resendApiKey);
export const hasPostHog = Boolean(platformEnv.posthogKey) && platformEnv.enableAnalytics;
