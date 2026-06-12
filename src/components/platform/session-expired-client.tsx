"use client";

import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";

type SessionExpiredClientProps = {
  nextTarget: string;
  clerkEnabled: boolean;
};

const localStoragePrefixesToClear = ["ruguna-application-notice:"];
const localStorageKeysToClear = [
  "ruguna-session-last-activity",
  "ruguna-session-last-heartbeat",
];

function clearBrowserSessionState() {
  try {
    for (const key of localStorageKeysToClear) {
      window.localStorage.removeItem(key);
    }

    for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
      const key = window.localStorage.key(index);

      if (key && localStoragePrefixesToClear.some((prefix) => key.startsWith(prefix))) {
        window.localStorage.removeItem(key);
      }
    }
  } catch {
    // Browser storage cleanup should not block a security redirect.
  }
}

async function clearPlatformSession() {
  await fetch("/api/elearning/logout", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
  }).catch(() => null);
}

function buildSignInHref(nextTarget: string) {
  return `/elearning/login?reauth=1&next=${encodeURIComponent(nextTarget)}`;
}

function ClerkSessionExpiredFlow({ nextTarget }: { nextTarget: string }) {
  const { signOut } = useClerk();
  const signInHref = useMemo(() => buildSignInHref(nextTarget), [nextTarget]);

  useEffect(() => {
    let cancelled = false;

    async function expire() {
      clearBrowserSessionState();
      await clearPlatformSession();

      if (cancelled) {
        return;
      }

      try {
        await signOut({ redirectUrl: signInHref });
      } catch {
        window.location.assign(signInHref);
      }
    }

    void expire();

    return () => {
      cancelled = true;
    };
  }, [signInHref, signOut]);

  return <SessionExpiredNotice />;
}

function LocalSessionExpiredFlow({ nextTarget }: { nextTarget: string }) {
  const router = useRouter();
  const signInHref = useMemo(() => buildSignInHref(nextTarget), [nextTarget]);

  useEffect(() => {
    let cancelled = false;

    async function expire() {
      clearBrowserSessionState();
      await clearPlatformSession();

      if (cancelled) {
        return;
      }

      router.replace(signInHref);
    }

    void expire();

    return () => {
      cancelled = true;
    };
  }, [router, signInHref]);

  return <SessionExpiredNotice />;
}

function SessionExpiredNotice() {
  return (
    <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 text-center shadow-[0_28px_70px_-54px_rgba(17,17,17,0.45)]">
      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-muted)]">
        <Loader2 className="h-4 w-4 animate-spin text-[var(--color-ink)]" />
        Redirecting to sign in.
      </div>
    </div>
  );
}

export function SessionExpiredClient({
  nextTarget,
  clerkEnabled,
}: SessionExpiredClientProps) {
  return clerkEnabled ? (
    <ClerkSessionExpiredFlow nextTarget={nextTarget} />
  ) : (
    <LocalSessionExpiredFlow nextTarget={nextTarget} />
  );
}
