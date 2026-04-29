import Link from "next/link";
import type { Metadata } from "next";

import { AuthShell } from "@/components/platform/auth-shell";
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
    <AuthShell
      activeKey="sign-in"
      title="Workspace access required"
      description="This account is signed in, but it is not assigned to that workspace yet."
    >
      <div className="rounded-[32px] border border-[var(--color-border)] bg-white p-7 shadow-[0_30px_80px_-56px_rgba(17,17,17,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Ruguna eLearning
        </p>
        <h1 className="font-heading mt-3 text-3xl font-bold text-[var(--color-ink)]">
          You need another workspace role
        </h1>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          Your current account can open its assigned workspace, but it cannot open{" "}
          <span className="font-semibold text-[var(--color-ink)]">{requestedTarget}</span> yet.
        </p>

        <div className="mt-6 grid gap-3 rounded-[24px] border border-black/8 bg-[#f6f5ef] p-4 text-sm text-[var(--color-muted)]">
          <p>
            <span className="font-semibold text-[var(--color-ink)]">Current role:</span>{" "}
            {currentRoles}
          </p>
          <p>
            <span className="font-semibold text-[var(--color-ink)]">Required role:</span>{" "}
            {requiredRoles}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {session.isAuthenticated ? (
            <Button asChild>
              <Link href={currentWorkspace}>Open my workspace</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href={`/elearning/login?next=${encodeURIComponent(requestedTarget)}`}>
                Sign in again
              </Link>
            </Button>
          )}
          <Button asChild variant="secondary">
            <Link href="/elearning/logout">Switch account</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/elearning/contact">Contact support</Link>
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
