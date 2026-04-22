"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SubmissionGradeFormProps = {
  submissionId: string;
  maxScore: number;
  currentScore: number | null;
  currentFeedback: string | null;
};

export function SubmissionGradeForm({
  submissionId,
  maxScore,
  currentScore,
  currentFeedback,
}: SubmissionGradeFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      submissionId,
      score: Number(formData.get("score") ?? 0),
      feedback: String(formData.get("feedback") ?? ""),
      returned: formData.get("returned") === "on",
    };

    try {
      const response = await fetch("/api/instructor/submissions/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { success: boolean; message: string };
      setMessage(body.message);

      if (response.ok && body.success) {
        startTransition(() => router.refresh());
      }
    } catch {
      setMessage("Grade could not be saved. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 grid gap-3 rounded-[22px] border border-[var(--color-border)] bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-[120px_minmax(0,1fr)]">
        <Input name="score" type="number" min={0} max={maxScore} defaultValue={currentScore ?? 0} required />
        <Textarea name="feedback" defaultValue={currentFeedback ?? ""} required placeholder="Feedback for learner" />
      </div>
      <label className="inline-flex items-center gap-2 text-sm font-medium">
        <input name="returned" type="checkbox" />
        Return for revision instead of final grading
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save feedback"}
        </Button>
        {message ? <p className="text-sm text-[var(--color-muted)]">{message}</p> : null}
      </div>
    </form>
  );
}
