"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type StaffAnnouncementFormProps = {
  courses: { id: string; title: string }[];
};

export function StaffAnnouncementForm({ courses }: StaffAnnouncementFormProps) {
  const router = useRouter();
  const [scope, setScope] = useState("COURSE");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      body: String(formData.get("body") ?? ""),
      scope,
      courseId: scope === "COURSE" ? String(formData.get("courseId") ?? "") : undefined,
      published: formData.get("published") === "on",
    };

    try {
      const response = await fetch("/api/admin/elearning/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { success: boolean; message: string };
      setMessage(body.message);

      if (response.ok && body.success) {
        event.currentTarget.reset();
        startTransition(() => router.refresh());
      }
    } catch {
      setMessage("Announcement could not be saved. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[28px] border border-[var(--color-border)] bg-white p-5">
      <div>
        <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
          Publish announcement
        </h2>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          Send a course or platform notice to learners from the eLearning workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Scope
          <select
            className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm"
            value={scope}
            onChange={(event) => setScope(event.target.value)}
          >
            <option value="COURSE">Course</option>
            <option value="PLATFORM">Platform</option>
          </select>
        </label>

        {scope === "COURSE" ? (
          <label className="grid gap-2 text-sm font-medium">
            Course
            <select name="courseId" className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm">
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <label className="grid gap-2 text-sm font-medium">
        Title
        <Input name="title" required placeholder="Example: Saturday practical lab confirmed" />
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Message
        <Textarea name="body" required placeholder="Give learners the full update, action required, and support channel if needed." />
      </label>

      <label className="inline-flex items-center gap-2 text-sm font-medium">
        <input name="published" type="checkbox" defaultChecked />
        Publish now
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save announcement"}
        </Button>
        {message ? <p className="text-sm text-[var(--color-muted)]">{message}</p> : null}
      </div>
    </form>
  );
}
