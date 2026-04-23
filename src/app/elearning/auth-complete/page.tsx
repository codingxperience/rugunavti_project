import type { Metadata } from "next";

import { AuthShell } from "@/components/platform/auth-shell";
import { AuthCompletionGuard } from "@/components/platform/auth-completion-guard";
import { resolveSafeRedirectTarget } from "@/lib/platform/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finishing sign in",
  description: "Confirming your Ruguna eLearning session.",
};

export default async function ElearningAuthCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTarget = resolveSafeRedirectTarget(next, "/learn/dashboard");

  return (
    <AuthShell
      activeKey="sign-in"
      title="Finishing sign in"
      description="Hold on while we secure your classroom and learner records."
    >
      <AuthCompletionGuard target={redirectTarget} />
    </AuthShell>
  );
}
