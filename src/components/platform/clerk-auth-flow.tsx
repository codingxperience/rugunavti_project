"use client";

import { SignIn, SignUp, useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import { clerkAppearance } from "@/lib/platform/clerk-appearance";
import { resolveSafeRedirectTarget } from "@/lib/platform/navigation";

import { AuthCompletionGuard } from "./auth-completion-guard";

type ClerkAuthFlowProps = {
  mode: "sign-in" | "sign-up";
  redirectTarget: string;
};

export function ClerkAuthFlow({ mode, redirectTarget }: ClerkAuthFlowProps) {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const safeTarget = resolveSafeRedirectTarget(redirectTarget, "/learn/dashboard");
  const completionUrl = `/elearning/auth-complete?next=${encodeURIComponent(safeTarget)}`;
  const signInUrl = `/elearning/login?next=${encodeURIComponent(safeTarget)}`;
  const signUpUrl = `/elearning/register?next=${encodeURIComponent(safeTarget)}`;

  if (!isLoaded) {
    return (
      <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[0_28px_70px_-54px_rgba(17,17,17,0.45)]">
        <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--color-ink)]" />
          Loading secure sign-in.
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return <AuthCompletionGuard target={safeTarget} compact />;
  }

  if (mode === "sign-in") {
    return (
      <SignIn
        appearance={clerkAppearance}
        path="/elearning/login"
        routing="path"
        signUpUrl={signUpUrl}
        forceRedirectUrl={completionUrl}
        fallbackRedirectUrl={completionUrl}
      />
    );
  }

  return (
    <SignUp
      appearance={clerkAppearance}
      path="/elearning/register"
      routing="path"
      signInUrl={signInUrl}
      forceRedirectUrl={completionUrl}
      fallbackRedirectUrl={completionUrl}
    />
  );
}
