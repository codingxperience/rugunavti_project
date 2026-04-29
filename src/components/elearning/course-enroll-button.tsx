"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";

type CourseEnrollButtonProps = {
  courseSlug: string;
  programId?: string;
  courseOfferingId?: string;
  size?: "default" | "lg";
  label?: string;
};

export function CourseEnrollButton({
  courseSlug,
  programId,
  courseOfferingId,
  size = "lg",
  label = "Enroll and start learning",
}: CourseEnrollButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function enroll() {
    setIsPending(true);
    setMessage(null);

    try {
      const response = await fetch("/api/elearning/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, programId, courseOfferingId }),
      });
      const payload = (await response.json()) as { success: boolean; message: string };

      if (response.status === 401) {
        const next = encodeURIComponent(`/elearning/courses/${courseSlug}`);
        router.push(`/elearning/login?next=${next}`);
        return;
      }

      if (!response.ok || !payload.success) {
        setMessage(payload.message || "Enrollment could not be completed.");
        return;
      }

      setMessage(payload.message);
      startTransition(() => {
        router.push(`/learn/course/${courseSlug}`);
        router.refresh();
      });
    } catch {
      setMessage("Enrollment could not be completed. Check your connection and try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" size={size} onClick={enroll} disabled={isPending}>
        {isPending ? "Enrolling..." : label}
      </Button>
      {message ? <p className="text-sm text-[var(--color-muted)]">{message}</p> : null}
    </div>
  );
}
