import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { getRouteRule } from "@/lib/platform/auth";
import { getDefaultWorkspaceRoute, resolveSafeRedirectTarget } from "@/lib/platform/navigation";
import { getCurrentSession } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workspace access required",
  description: "Your Ruguna eLearning account needs the correct workspace role.",
};

function formatRole(role: string) {
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function ElearningAccessDeniedPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const session = await getCurrentSession();
  const requestedTarget = resolveSafeRedirectTarget(next, "/learn/dashboard");
  const requestedRule = getRouteRule(requestedTarget);
  const currentWorkspace = session.isAuthenticated
    ? getDefaultWorkspaceRoute(session.role)
    : "/elearning/login";
  const currentRoles = session.roles.length
    ? session.roles.map(formatRole).join(", ")
    : "No active role";
  const requiredRoles = requestedRule?.roles.length
    ? requestedRule.roles.map(formatRole).join(" or ")
    : "A protected Ruguna workspace role";

  return (
    <section className="flex min-h-dvh items-center justify-center bg-[#f6f5ef] px-4 py-10">
      <div className="w-full max-w-[460px] rounded-[26px] border border-black/8 bg-white p-6 shadow-[0_24px_70px_-58px_rgba(17,17,17,0.55)] sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Ruguna eLearning
        </p>
        <h1 className="font-heading mt-2 text-2xl font-bold leading-tight text-[var(--color-ink)]">
          Workspace not available
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          This account is signed in, but it has not been assigned to that area.
        </p>

        <div className="mt-5 grid gap-2 rounded-[20px] bg-[#f6f5ef] p-4 text-sm text-[var(--color-muted)]">
          <p>
            <span className="font-semibold text-[var(--color-ink)]">Your access:</span>{" "}
            {currentRoles}
          </p>
          <p>
            <span className="font-semibold text-[var(--color-ink)]">Needed:</span>{" "}
            {requiredRoles}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {session.isAuthenticated ? (
            <Button asChild>
              <Link href={currentWorkspace}>Open my workspace</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href={`/elearning/login?next=${encodeURIComponent(requestedTarget)}`}>
                Sign in
              </Link>
            </Button>
          )}
          <Button asChild variant="secondary">
            <Link href="/elearning/logout">Switch account</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/elearning/contact">Get help</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
