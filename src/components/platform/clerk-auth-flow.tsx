"use client";

import { SignIn, SignUp, useAuth, useClerk } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

import { clerkAppearance } from "@/lib/platform/clerk-appearance";
import { resolveSafeRedirectTarget } from "@/lib/platform/navigation";

import { AuthCompletionGuard } from "./auth-completion-guard";

type ClerkAuthFlowProps = {
  mode: "sign-in" | "sign-up";
  redirectTarget?: string | null;
  requiresFreshSignIn?: boolean;
};

function subscribeToHydrationStore() {
  return () => undefined;
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

export function ClerkAuthFlow({
  mode,
  redirectTarget,
  requiresFreshSignIn = false,
}: ClerkAuthFlowProps) {
  const mounted = useSyncExternalStore(
    subscribeToHydrationStore,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const { signOut } = useClerk();
  const safeTarget = redirectTarget
    ? resolveSafeRedirectTarget(redirectTarget, "/learn/dashboard")
    : null;
  const completionUrl = safeTarget
    ? `/elearning/auth-complete?next=${encodeURIComponent(safeTarget)}`
    : "/elearning/auth-complete";
  const signInUrl = safeTarget
    ? `/elearning/login?next=${encodeURIComponent(safeTarget)}`
    : "/elearning/login";
  const signUpUrl = safeTarget
    ? `/elearning/register?next=${encodeURIComponent(safeTarget)}`
    : "/elearning/register";

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !requiresFreshSignIn) {
      return;
    }

    void signOut({ redirectUrl: signInUrl });
  }, [isLoaded, isSignedIn, requiresFreshSignIn, signInUrl, signOut]);

  if (!mounted || !isLoaded) {
    return (
      <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[0_28px_70px_-54px_rgba(17,17,17,0.45)]">
        <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--color-ink)]" />
          Loading secure sign-in.
        </div>
      </div>
    );
  }

  if (isSignedIn && !requiresFreshSignIn) {
    return <AuthCompletionGuard target={safeTarget} compact />;
  }

  if (isSignedIn && requiresFreshSignIn) {
    return (
      <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[0_28px_70px_-54px_rgba(17,17,17,0.45)]">
        <div className="flex items-start gap-3">
          <Loader2 className="mt-1 h-4 w-4 animate-spin shrink-0 text-[var(--color-ink)]" />
          <div>
            <h2 className="font-heading text-xl font-bold text-[var(--color-ink)]">
              Securing previous session
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              Ruguna is closing the previous sign-in before asking you to authenticate again.
            </p>
          </div>
        </div>
      </div>
    );
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
