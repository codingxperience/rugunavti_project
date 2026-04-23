"use client";

import { RedirectToTasks, TaskChooseOrganization, TaskResetPassword, TaskSetupMFA, useSession } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { clerkAppearance } from "@/lib/platform/clerk-appearance";

type ClerkTaskRouterProps = {
  task: string;
  redirectTarget: string;
};

export function ClerkTaskRouter({ task, redirectTarget }: ClerkTaskRouterProps) {
  const router = useRouter();
  const { isLoaded, session } = useSession();
  const currentTask = session?.currentTask?.key;
  const completionUrl = `/elearning/auth-complete?next=${encodeURIComponent(redirectTarget)}`;

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!currentTask) {
      router.replace(completionUrl);
      return;
    }

    if (currentTask !== task) {
      router.replace(`/elearning/tasks/${currentTask}?next=${encodeURIComponent(redirectTarget)}`);
    }
  }, [completionUrl, currentTask, isLoaded, redirectTarget, router, task]);

  if (!isLoaded) {
    return (
      <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[0_28px_70px_-54px_rgba(17,17,17,0.45)]">
        <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--color-ink)]" />
          Loading your secure account task.
        </div>
      </div>
    );
  }

  if (!currentTask) {
    return null;
  }

  switch (task) {
    case "choose-organization":
      return (
        <TaskChooseOrganization
          appearance={clerkAppearance}
          redirectUrlComplete={completionUrl}
        />
      );
    case "reset-password":
      return (
        <TaskResetPassword
          appearance={clerkAppearance}
          redirectUrlComplete={completionUrl}
        />
      );
    case "setup-mfa":
      return (
        <TaskSetupMFA
          appearance={clerkAppearance}
          redirectUrlComplete={completionUrl}
        />
      );
    default:
      return <RedirectToTasks />;
  }
}
