"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

const idleTimeoutMs = 30 * 60 * 1000;
const lastActivityKey = "ruguna-session-last-activity";
const skippedPrefixes = [
  "/elearning/login",
  "/elearning/register",
  "/elearning/logout",
  "/elearning/auth-complete",
];

function shouldSkip(pathname: string) {
  return skippedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function readLastActivity() {
  const value = Number(window.localStorage.getItem(lastActivityKey) ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function writeLastActivity() {
  window.localStorage.setItem(lastActivityKey, String(Date.now()));
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
        window.localStorage.removeItem(lastActivityKey);
        await signOut({ redirectUrl: "/api/elearning/logout?next=%2F" });
      } catch {
        await clearPlatformSession();
        window.location.assign("/");
      }
    };

    const checkIdle = async () => {
      const lastActivity = readLastActivity();

      if (lastActivity && Date.now() - lastActivity > idleTimeoutMs) {
        if (await isAuthenticatedSession()) {
          await expireSession();
        } else {
          window.localStorage.removeItem(lastActivityKey);
        }
        return;
      }

      if (!lastActivity) {
        writeLastActivity();
      }
    };

    const markActive = () => {
      writeLastActivity();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkIdle();
      }
    };

    void checkIdle();

    const interval = window.setInterval(() => {
      void checkIdle();
    }, 60_000);
    const events = ["click", "keydown", "mousemove", "scroll", "touchstart"] as const;

    for (const event of events) {
      window.addEventListener(event, markActive, { passive: true });
    }

    window.addEventListener("focus", markActive);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(interval);

      for (const event of events) {
        window.removeEventListener(event, markActive);
      }

      window.removeEventListener("focus", markActive);
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

      window.localStorage.removeItem(lastActivityKey);
      await clearPlatformSession();
      window.location.assign("/");
    };

    const checkIdle = async () => {
      const lastActivity = readLastActivity();

      if (lastActivity && Date.now() - lastActivity > idleTimeoutMs) {
        if (await isAuthenticatedSession()) {
          await expireSession();
        } else {
          window.localStorage.removeItem(lastActivityKey);
        }
        return;
      }

      if (!lastActivity) {
        writeLastActivity();
      }
    };

    const markActive = () => {
      writeLastActivity();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkIdle();
      }
    };

    void checkIdle();

    const interval = window.setInterval(() => {
      void checkIdle();
    }, 60_000);
    const events = ["click", "keydown", "mousemove", "scroll", "touchstart"] as const;

    for (const event of events) {
      window.addEventListener(event, markActive, { passive: true });
    }

    window.addEventListener("focus", markActive);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(interval);

      for (const event of events) {
        window.removeEventListener(event, markActive);
      }

      window.removeEventListener("focus", markActive);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  return null;
}
