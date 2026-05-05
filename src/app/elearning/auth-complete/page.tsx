import type { Metadata } from "next";

import { AuthShell } from "@/components/platform/auth-shell";
import { AuthCompletionGuard } from "@/components/platform/auth-completion-guard";
import { resolveSafeRedirectTarget } from "@/lib/platform/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signing in",
  description: "Confirming secure Ruguna access.",
};

export default async function ElearningAuthCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTarget = next ? resolveSafeRedirectTarget(next, "/learn/dashboard") : null;

  return (
    <AuthShell
      activeKey="sign-in"
      title="Signing in"
      description="Opening your Ruguna workspace."
    >
      <AuthCompletionGuard target={redirectTarget} />
    </AuthShell>
  );
}
