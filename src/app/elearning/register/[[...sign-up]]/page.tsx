import Link from "next/link";
import type { Metadata } from "next";

import { AuthShell } from "@/components/platform/auth-shell";
import { ClerkAuthFlow } from "@/components/platform/clerk-auth-flow";
import { Button } from "@/components/ui/button";
import { hasClerk, platformEnv } from "@/lib/platform/env";
import { resolveSafeRedirectTarget } from "@/lib/platform/navigation";

export const metadata: Metadata = {
  title: "Create a Ruguna eLearning account",
  description: "Register for Ruguna eLearning.",
};

export default async function ElearningRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectUrl = next ? resolveSafeRedirectTarget(next, "/learn/dashboard") : null;

  return (
    <AuthShell
      activeKey="sign-up"
      title="Create account"
      description="Use email or Google to start learning."
    >
      {hasClerk ? (
        <ClerkAuthFlow mode="sign-up" redirectTarget={redirectUrl} />
      ) : platformEnv.allowDevAuth ? (
        <div className="grid gap-4 rounded-[26px] border border-[var(--color-border)] bg-white p-5">
          <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
            Local access only
          </h2>
          <p className="text-sm leading-7 text-[var(--color-muted)]">
            Use the local sign-in screen to review Ruguna eLearning workspaces.
          </p>
          <Button asChild>
            <Link href="/elearning/login">Go to sign in</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 rounded-[24px] border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
            Authentication setup required
          </p>
          <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
            Account creation is not available yet
          </h2>
          <p className="text-sm leading-7 text-amber-900/80">
            Add Clerk keys in Vercel, then redeploy.
          </p>
          <Button asChild>
            <Link href="/elearning/login">Back to sign in</Link>
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
