"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

const configuredIdleMinutes = Number(
  process.env.NEXT_PUBLIC_RUGUNA_WORKSPACE_IDLE_MINUTES ?? 3
);
const idleTimeoutMs =
  (Number.isFinite(configuredIdleMinutes) && configuredIdleMinutes > 0
    ? Math.max(3, Math.min(Math.floor(configuredIdleMinutes), 60))
    : 3) *
  60 *
  1000;
const heartbeatIntervalMs = Math.min(5 * 60 * 1000, Math.max(60_000, idleTimeoutMs / 4));
const lastActivityKey = "ruguna-session-last-activity";
const lastHeartbeatKey = "ruguna-session-last-heartbeat";
const skippedPrefixes = [
  "/elearning/login",
  "/elearning/register",
  "/elearning/logout",
  "/elearning/auth-complete",
  "/elearning/session-expired",
];
const guardedPrefixes = [
  "/learn",
  "/student",
  "/instructor",
  "/admin",
  "/registrar",
  "/finance",
  "/account",
];

function shouldSkip(pathname: string) {
  if (skippedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  return !guardedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function readLastActivity() {
  const value = Number(window.localStorage.getItem(lastActivityKey) ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function writeLastActivity() {
  window.localStorage.setItem(lastActivityKey, String(Date.now()));
}

function clearSessionActivity() {
  window.localStorage.removeItem(lastActivityKey);
  window.localStorage.removeItem(lastHeartbeatKey);
}

async function clearPlatformSession() {
  await fetch("/api/elearning/logout", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
  }).catch(() => null);
}

async function isAuthenticatedSession() {
  const response = await fetch("/api/elearning/session-status", {
    cache: "no-store",
    credentials: "include",
  }).catch(() => null);

  if (!response?.ok) {
    return false;
  }

  const payload = (await response.json().catch(() => null)) as {
    authenticated?: boolean;
  } | null;

  return Boolean(payload?.authenticated);
}

function recentlyActive() {
  const lastActivity = readLastActivity();

  return Boolean(lastActivity && Date.now() - lastActivity <= idleTimeoutMs);
}

export function ClerkSessionIdleGuard() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  useEffect(() => {
    if (shouldSkip(pathname)) {
      return undefined;
    }

    let cancelled = false;

    const expireSession = async () => {
      if (cancelled) return;

      try {
        clearSessionActivity();
        await clearPlatformSession();
        await signOut({ redirectUrl: "/elearning/login?reauth=1" });
      } catch {
        await clearPlatformSession();
        window.location.assign("/elearning/login?reauth=1");
      }
    };

    const checkIdle = async () => {
      const lastActivity = readLastActivity();

      if (lastActivity && Date.now() - lastActivity > idleTimeoutMs) {
        await expireSession();
        return;
      }

      if (!lastActivity) {
        writeLastActivity();
      }
    };

    const refreshServerSession = async () => {
      if (!recentlyActive()) {
        return;
      }

      const lastHeartbeat = Number(window.localStorage.getItem(lastHeartbeatKey) ?? 0);

      if (Number.isFinite(lastHeartbeat) && Date.now() - lastHeartbeat < heartbeatIntervalMs) {
        return;
      }

      window.localStorage.setItem(lastHeartbeatKey, String(Date.now()));

      if (!(await isAuthenticatedSession())) {
        await expireSession();
      }
    };

    const markActive = () => {
      writeLastActivity();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkIdle();
        void refreshServerSession();
      }
    };
    const handleFocus = () => {
      markActive();
      void refreshServerSession();
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === lastActivityKey && event.newValue === null) {
        void expireSession();
      }
    };

    void checkIdle();
    void refreshServerSession();

    const interval = window.setInterval(() => {
      void checkIdle();
      void refreshServerSession();
    }, 60_000);
    const events = ["click", "keydown", "mousemove", "scroll", "touchstart"] as const;

    for (const event of events) {
      window.addEventListener(event, markActive, { passive: true });
    }

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(interval);

      for (const event of events) {
        window.removeEventListener(event, markActive);
      }

      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, signOut]);

  return null;
}

export function LocalSessionIdleGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (shouldSkip(pathname)) {
      return undefined;
    }

    let cancelled = false;

    const expireSession = async () => {
      if (cancelled) return;

      clearSessionActivity();
      await clearPlatformSession();
      window.location.assign("/elearning/login?reauth=1");
    };

    const checkIdle = async () => {
      const lastActivity = readLastActivity();

      if (lastActivity && Date.now() - lastActivity > idleTimeoutMs) {
        await expireSession();
        return;
      }

      if (!lastActivity) {
        writeLastActivity();
      }
    };

    const refreshServerSession = async () => {
      if (!recentlyActive()) {
        return;
      }

      const lastHeartbeat = Number(window.localStorage.getItem(lastHeartbeatKey) ?? 0);

      if (Number.isFinite(lastHeartbeat) && Date.now() - lastHeartbeat < heartbeatIntervalMs) {
        return;
      }

      window.localStorage.setItem(lastHeartbeatKey, String(Date.now()));

      if (!(await isAuthenticatedSession())) {
        await expireSession();
      }
    };

    const markActive = () => {
      writeLastActivity();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkIdle();
        void refreshServerSession();
      }
    };
    const handleFocus = () => {
      markActive();
      void refreshServerSession();
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === lastActivityKey && event.newValue === null) {
        void expireSession();
      }
    };

    void checkIdle();
    void refreshServerSession();

    const interval = window.setInterval(() => {
      void checkIdle();
      void refreshServerSession();
    }, 60_000);
    const events = ["click", "keydown", "mousemove", "scroll", "touchstart"] as const;

    for (const event of events) {
      window.addEventListener(event, markActive, { passive: true });
    }

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(interval);

      for (const event of events) {
        window.removeEventListener(event, markActive);
      }

      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  return null;
}
