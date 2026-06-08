import type { Metadata } from "next";

import { AuthShell } from "@/components/platform/auth-shell";
import { SessionExpiredClient } from "@/components/platform/session-expired-client";
import { hasClerk } from "@/lib/platform/env";
import { resolveSafeRedirectTarget } from "@/lib/platform/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Session locked",
  description: "Ruguna dashboard access requires a fresh sign-in after inactivity.",
};

export default async function ElearningSessionExpiredPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextTarget = resolveSafeRedirectTarget(next, "/learn/dashboard");

  return (
    <AuthShell
      activeKey="sign-in"
      title="Session locked"
      description="Confirm your identity before returning to the workspace."
    >
      <SessionExpiredClient nextTarget={nextTarget} clerkEnabled={hasClerk} />
    </AuthShell>
  );
}
