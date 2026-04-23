import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthShell } from "@/components/platform/auth-shell";
import { ClerkTaskRouter } from "@/components/platform/clerk-task-router";
import { resolveSafeRedirectTarget } from "@/lib/platform/navigation";

const taskContent = {
  "choose-organization": {
    title: "Choose your workspace",
    description: "Select the Clerk workspace required to finish secure access.",
  },
  "reset-password": {
    title: "Secure your password",
    description: "Complete the required password reset to continue into Ruguna eLearning.",
  },
  "setup-mfa": {
    title: "Add an extra security step",
    description: "Set up multi-factor authentication to finish secure sign-in.",
  },
} as const;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Complete account task",
  description: "Finish the required Clerk account task for Ruguna eLearning.",
};

export default async function ElearningTaskPage({
  params,
  searchParams,
}: {
  params: Promise<{ task: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ task }, { next }] = await Promise.all([params, searchParams]);
  const content = taskContent[task as keyof typeof taskContent];

  if (!content) {
    notFound();
  }

  return (
    <AuthShell activeKey="sign-in" title={content.title} description={content.description}>
      <ClerkTaskRouter
        task={task}
        redirectTarget={resolveSafeRedirectTarget(next, "/learn/dashboard")}
      />
    </AuthShell>
  );
}
