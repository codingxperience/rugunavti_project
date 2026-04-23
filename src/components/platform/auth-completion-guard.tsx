"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RedirectToTasks, useAuth, useSession } from "@clerk/nextjs";
import { ArrowRight, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type AuthCompletionGuardProps = {
  target: string;
  compact?: boolean;
};

type SessionStatusResponse = {
  authenticated: boolean;
  destination: string | null;
  requestedTarget: string;
  role: string | null;
  sessionStatus: "active" | "pending" | null;
  source: string;
};

const MAX_ATTEMPTS = 12;
const RETRY_DELAY_MS = 600;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AuthCompletionGuard({
  target,
  compact = false,
}: AuthCompletionGuardProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const { session } = useSession();
  const [phase, setPhase] = useState<"loading" | "checking" | "timeout" | "signed-out">("loading");
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState("Confirming your protected learning session.");
  const isMountedRef = useRef(true);
  const isCheckingRef = useRef(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const checkServerSession = useCallback(async () => {
    if (isCheckingRef.current) {
      return;
    }

    isCheckingRef.current = true;
    setPhase("checking");
    setMessage("Securing your classroom and syncing your learning workspace.");

    try {
      for (let currentAttempt = 1; currentAttempt <= MAX_ATTEMPTS; currentAttempt += 1) {
        if (!isMountedRef.current) {
          return;
        }

        setAttempt(currentAttempt);

        const response = await fetch(
          `/api/elearning/session-status?target=${encodeURIComponent(target)}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        if (response.ok) {
          const payload = (await response.json()) as SessionStatusResponse;

          if (payload.authenticated && payload.destination) {
            window.location.replace(payload.destination);
            return;
          }
        }

        await wait(RETRY_DELAY_MS);
      }

      if (!isMountedRef.current) {
        return;
      }

      setPhase("timeout");
      setMessage("Your sign-in completed, but Ruguna is still waiting for the server session to settle.");
    } catch {
      if (!isMountedRef.current) {
        return;
      }

      setPhase("timeout");
      setMessage("We could not confirm your session automatically. Retry once, then use sign in again if needed.");
    } finally {
      isCheckingRef.current = false;
    }
  }, [target]);

  useEffect(() => {
    if (!isLoaded) {
      setPhase("loading");
      setMessage("Loading your Ruguna session.");
      return;
    }

    if (!isSignedIn) {
      setPhase("signed-out");
      setMessage("Sign in to continue to your Ruguna classroom.");
      return;
    }

    const currentTask = session?.currentTask?.key;

    if (currentTask) {
      router.replace(`/elearning/tasks/${currentTask}?next=${encodeURIComponent(target)}`);
      return;
    }

    void checkServerSession();
  }, [checkServerSession, isLoaded, isSignedIn, router, session, target]);

  if (phase === "signed-out") {
    return compact ? null : (
      <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 text-center shadow-[0_28px_70px_-54px_rgba(17,17,17,0.45)]">
        <p className="text-sm leading-7 text-[var(--color-muted)]">{message}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/elearning/login">Open sign in</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/elearning">Back to eLearning</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? "rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[0_28px_70px_-54px_rgba(17,17,17,0.45)]"
          : "rounded-[32px] border border-[var(--color-border)] bg-white p-7 text-center shadow-[0_30px_80px_-56px_rgba(17,17,17,0.5)]"
      }
    >
      <RedirectToTasks />
      <div className={compact ? "flex items-start gap-3" : "flex flex-col items-center"}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-soft-accent)] text-[var(--color-ink)]">
          {phase === "timeout" ? (
            <ShieldCheck className="h-5 w-5" />
          ) : (
            <Loader2 className="h-5 w-5 animate-spin" />
          )}
        </span>
        <div className={compact ? "min-w-0 flex-1" : "mt-5"}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Ruguna eLearning
          </p>
          <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
            {phase === "timeout" ? "Session confirmation needed" : "Preparing your classroom"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{message}</p>
          {phase !== "timeout" ? (
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Attempt {attempt || 1} of {MAX_ATTEMPTS}
            </p>
          ) : null}
        </div>
      </div>

      {phase === "timeout" ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={() => void checkServerSession()}>
            <RefreshCw className="h-4 w-4" />
            Retry check
          </Button>
          <Button asChild variant="secondary">
            <Link href="/elearning/login">
              Back to sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : null}

      {phase !== "timeout" && !compact ? (
        <p className="mt-6 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Protected access · Database-backed learner records · Clerk session verification
        </p>
      ) : null}
    </div>
  );
}
