"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function ElearningLogoutPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useAuth({
    treatPendingAsSignedOut: false,
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        if (isLoaded && isSignedIn) {
          await signOut({ redirectUrl: "/api/elearning/logout" });
          return;
        }

        await fetch("/api/elearning/logout", {
          method: "POST",
          credentials: "include",
        });

        if (!cancelled) {
          router.replace("/elearning/login");
        }
      } catch {
        if (!cancelled) {
          router.replace("/elearning/login");
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, router, signOut]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#edece6] px-4">
      <div className="w-full max-w-md rounded-[32px] border border-black/6 bg-white p-8 text-center shadow-[0_30px_80px_-56px_rgba(17,17,17,0.5)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-soft-accent)] text-[var(--color-ink)]">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Ruguna eLearning
        </p>
        <h1 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
          Signing you out
        </h1>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          Closing your classroom session and returning you to secure sign in.
        </p>
      </div>
    </main>
  );
}
