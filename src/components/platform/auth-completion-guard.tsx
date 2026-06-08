"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RedirectToTasks, useAuth, useSession } from "@clerk/nextjs";
import { ArrowRight, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type AuthCompletionGuardProps = {
  target?: string | null;
  compact?: boolean;
};

type SessionStatusResponse = {
  authenticated: boolean;
  destination: string | null;
  requestedTarget: string;
  role: string | null;
  roles: string[];
  sessionStatus: "active" | "pending" | null;
  source: string;
  diagnostics: {
    host: string | null;
    origin: string | null;
    hasClerkConfigured: boolean;
    expectedProxyUrl: string | null;
    hasCookieHeader: boolean;
    hasAnyClerkCookie: boolean;
    hasSessionTokenCookie: boolean;
    hasClientUatCookie: boolean;
    hasBridgeCookie: boolean;
    workspaceSessionActive: boolean;
    workspaceIdleTimeoutSeconds: number;
    serverUserId: string | null;
    serverSessionId: string | null;
    serverSessionStatus: string | null;
    authError: string | null;
  };
};

const MAX_ATTEMPTS = 12;
const RETRY_DELAY_MS = 600;
const SHOW_AUTH_DIAGNOSTICS =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_SHOW_AUTH_DIAGNOSTICS === "true";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AuthCompletionGuard({
  target,
  compact = false,
}: AuthCompletionGuardProps) {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn, sessionId } = useAuth({
    treatPendingAsSignedOut: false,
  });
  const { session } = useSession();
  const [phase, setPhase] = useState<"loading" | "checking" | "timeout" | "signed-out">("loading");
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState("Loading your Ruguna workspace.");
  const [diagnostics, setDiagnostics] = useState<SessionStatusResponse["diagnostics"] | null>(null);
  const [bridgeMessage, setBridgeMessage] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const isCheckingRef = useRef(false);
  const bridgeAttemptedRef = useRef(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const establishBridgeSession = useCallback(async () => {
    const token = await getToken({ skipCache: true });

    if (!token) {
      return {
        ok: false,
        message: "Clerk has not issued a fresh session token yet.",
      };
    }

    const response = await fetch("/api/elearning/session-bridge", {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: sessionId ?? session?.id ?? null,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          message?: string;
        }
      | null;

    return {
      ok: response.ok,
      message: payload?.message ?? null,
    };
  }, [getToken, session?.id, sessionId]);

  const checkServerSession = useCallback(async () => {
    if (isCheckingRef.current) {
      return;
    }

    isCheckingRef.current = true;
    setPhase("checking");
    setMessage("Loading your Ruguna workspace.");

    try {
      for (let currentAttempt = 1; currentAttempt <= MAX_ATTEMPTS; currentAttempt += 1) {
        if (!isMountedRef.current) {
          return;
        }

        setAttempt(currentAttempt);

        if (!bridgeAttemptedRef.current) {
          const bridgeResult = await establishBridgeSession();
          if (bridgeResult.ok) {
            bridgeAttemptedRef.current = true;
            setBridgeMessage(null);
          } else {
            setBridgeMessage(
              bridgeResult.message ?? "Ruguna could not verify the Clerk session token yet."
            );
          }
        }

        const response = await fetch(
          target
            ? `/api/elearning/session-status?target=${encodeURIComponent(target)}`
            : "/api/elearning/session-status",
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        if (response.ok) {
          const payload = (await response.json()) as SessionStatusResponse;
          setDiagnostics(payload.diagnostics);

          if (payload.diagnostics.hasBridgeCookie) {
            bridgeAttemptedRef.current = true;
            setBridgeMessage(null);
          }

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

      const currentDiagnostics = diagnostics;
      setPhase("timeout");
      setMessage("We could not open the workspace automatically.");

      if (!currentDiagnostics?.hasBridgeCookie) {
        bridgeAttemptedRef.current = false;
      }
    } catch {
      if (!isMountedRef.current) {
        return;
      }

      setPhase("timeout");
      setMessage("We could not open the workspace automatically.");
      bridgeAttemptedRef.current = false;
    } finally {
      isCheckingRef.current = false;
    }
  }, [diagnostics, establishBridgeSession, target]);

  useEffect(() => {
    if (!isLoaded) {
      setPhase("loading");
      setMessage("Loading your Ruguna workspace.");
      return;
    }

    if (!isSignedIn) {
      setPhase("signed-out");
      setMessage("Sign in to continue.");
      return;
    }

    const currentTask = session?.currentTask?.key;

    if (currentTask) {
      router.replace(
        target
          ? `/elearning/tasks/${currentTask}?next=${encodeURIComponent(target)}`
          : `/elearning/tasks/${currentTask}`
      );
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
          <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
            {phase === "timeout" ? "Session check needed" : "Opening workspace"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{message}</p>
          {phase === "checking" && attempt > 2 ? (
            <div className="mx-auto mt-4 flex w-fit gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-ink)]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-ink)] [animation-delay:140ms]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-ink)] [animation-delay:280ms]" />
            </div>
          ) : null}
        </div>
      </div>

      {phase === "timeout" ? (
        <>
          {SHOW_AUTH_DIAGNOSTICS && diagnostics ? (
            <div className="mt-5 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-left text-sm text-[var(--color-muted)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Session diagnostics
              </p>
              <div className="mt-3 grid gap-2">
                <p>Client signed in: yes</p>
                <p>Server Clerk cookie received: {diagnostics.hasAnyClerkCookie ? "yes" : "no"}</p>
                <p>Server __session cookie received: {diagnostics.hasSessionTokenCookie ? "yes" : "no"}</p>
                <p>Server __client_uat cookie received: {diagnostics.hasClientUatCookie ? "yes" : "no"}</p>
                <p>Ruguna bridge cookie received: {diagnostics.hasBridgeCookie ? "yes" : "no"}</p>
                <p>Ruguna workspace session active: {diagnostics.workspaceSessionActive ? "yes" : "no"}</p>
                <p>Workspace idle timeout: {diagnostics.workspaceIdleTimeoutSeconds} seconds</p>
                <p>Server user detected: {diagnostics.serverUserId ? "yes" : "no"}</p>
                <p>Server session status: {diagnostics.serverSessionStatus ?? "none"}</p>
                <p>Server host: {diagnostics.host ?? "unknown"}</p>
                <p>Expected proxy URL: {diagnostics.expectedProxyUrl ?? "not configured"}</p>
                {diagnostics.authError ? <p>Server auth error: {diagnostics.authError}</p> : null}
                {bridgeMessage ? <p>Bridge session result: {bridgeMessage}</p> : null}
              </div>
            </div>
          ) : null}
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
        </>
      ) : null}

    </div>
  );
}
