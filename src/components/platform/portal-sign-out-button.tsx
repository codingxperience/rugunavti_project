"use client";

import { useClerk } from "@clerk/nextjs";
import { Loader2, LogOut } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PortalSignOutButtonProps = {
  compact?: boolean;
  className?: string;
  children?: ReactNode;
};

export function PortalSignOutButton({
  compact = false,
  className,
  children,
}: PortalSignOutButtonProps) {
  const [busy, setBusy] = useState(false);
  const { signOut } = useClerk();

  function clearLocalSessionNotices() {
    try {
      window.localStorage.removeItem("ruguna-session-last-activity");
      window.localStorage.removeItem("ruguna-session-last-heartbeat");

      for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
        const key = window.localStorage.key(index);

        if (key?.startsWith("ruguna-application-notice:")) {
          window.localStorage.removeItem(key);
        }
      }
    } catch {
      // Local browser cleanup must never block sign-out.
    }
  }

  async function handleSignOut() {
    clearLocalSessionNotices();
    setBusy(true);

    await fetch("/api/elearning/logout", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    }).catch(() => null);

    try {
      await signOut({ redirectUrl: "/elearning/login" });
    } catch {
      window.location.assign("/elearning/login");
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => void handleSignOut()}
      disabled={busy}
      className={cn(
        compact
          ? "h-10 w-10 rounded-2xl border-white/12 bg-white/8 p-0 text-white hover:bg-white/12 hover:text-white"
          : "border-white/12 bg-white/8 text-white hover:bg-white/12 hover:text-white",
        className
      )}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      {compact ? <span className="sr-only">Sign out</span> : children ?? "Sign out"}
    </Button>
  );
}
