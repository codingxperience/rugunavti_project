"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

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
  const [message, setMessage] = useState("Closing the previous workspace session.");

  useEffect(() => {
    let cancelled = false;

    async function expire() {
      clearBrowserSessionState();
      await clearPlatformSession();

      if (cancelled) {
        return;
      }

      setMessage("Returning to secure sign in.");

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

  return <SessionExpiredNotice message={message} signInHref={signInHref} />;
}

function LocalSessionExpiredFlow({ nextTarget }: { nextTarget: string }) {
  const router = useRouter();
  const signInHref = useMemo(() => buildSignInHref(nextTarget), [nextTarget]);
  const [message, setMessage] = useState("Closing the previous workspace session.");

  useEffect(() => {
    let cancelled = false;

    async function expire() {
      clearBrowserSessionState();
      await clearPlatformSession();

      if (cancelled) {
        return;
      }

      setMessage("Returning to secure sign in.");
      router.replace(signInHref);
    }

    void expire();

    return () => {
      cancelled = true;
    };
  }, [router, signInHref]);

  return <SessionExpiredNotice message={message} signInHref={signInHref} />;
}

function SessionExpiredNotice({
  message,
  signInHref,
}: {
  message: string;
  signInHref: string;
}) {
  return (
    <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 text-center shadow-[0_28px_70px_-54px_rgba(17,17,17,0.45)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-soft-accent)] text-[var(--color-ink)]">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <h1 className="font-heading mt-5 text-2xl font-bold text-[var(--color-ink)]">
        Session locked
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[var(--color-muted)]">
        For security, Ruguna closes dashboard access after 3 minutes of inactivity and requires a fresh sign-in before critical information is shown again.
      </p>
      <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-muted)]">
        <Loader2 className="h-4 w-4 animate-spin text-[var(--color-ink)]" />
        {message}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href={signInHref}>Sign in again</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Public website</Link>
        </Button>
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
