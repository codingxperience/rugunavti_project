"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type StaffCourseFormProps = {
  schools: { id: string; name: string }[];
  programs: { id: string; title: string; schoolId: string }[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function StaffCourseForm({ schools, programs }: StaffCourseFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [schoolId, setSchoolId] = useState(schools[0]?.id ?? "");
  const filteredPrograms = programs.filter((program) => program.schoolId === schoolId);
  const [programId, setProgramId] = useState(filteredPrograms[0]?.id ?? programs[0]?.id ?? "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      schoolId,
      programId,
      title,
      slug: slug || slugify(title),
      summary: String(formData.get("summary") ?? ""),
      description: String(formData.get("description") ?? ""),
      deliveryMode: String(formData.get("deliveryMode") ?? "BLENDED"),
      estimatedHours: Number(formData.get("estimatedHours") ?? 24),
      thumbnailUrl: String(formData.get("thumbnailUrl") ?? "") || undefined,
      published: formData.get("published") === "on",
    };

    try {
      const response = await fetch("/api/admin/elearning/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { success: boolean; message: string };
      setMessage(body.message);

      if (response.ok && body.success) {
        setTitle("");
        setSlug("");
        event.currentTarget.reset();
        startTransition(() => router.refresh());
      }
    } catch {
      setMessage("Course could not be saved. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[28px] border border-[var(--color-border)] bg-white p-5">
      <div>
        <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">Create eLearning course</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          Create a published or draft course attached to an existing Ruguna school and programme.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          School
          <select
            className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm"
            value={schoolId}
            onChange={(event) => {
              const nextSchoolId = event.target.value;
              setSchoolId(nextSchoolId);
              setProgramId(programs.find((program) => program.schoolId === nextSchoolId)?.id ?? "");
            }}
          >
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Programme
          <select
            className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm"
            value={programId}
            onChange={(event) => setProgramId(event.target.value)}
          >
            {(filteredPrograms.length ? filteredPrograms : programs).map((program) => (
              <option key={program.id} value={program.id}>
                {program.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Course title
          <Input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slug) setSlug(slugify(event.target.value));
            }}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Slug
          <Input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} required />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium">
        Summary
        <Textarea name="summary" required placeholder="Short catalog summary for learners." />
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Description
        <Textarea name="description" required placeholder="Detailed course description, learning value, and delivery context." />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium">
          Delivery mode
          <select name="deliveryMode" className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm">
            <option value="ONLINE">Online</option>
            <option value="BLENDED">Blended</option>
            <option value="PRACTICAL">Practical</option>
            <option value="WEEKEND">Weekend</option>
            <option value="EVENING">Evening</option>
            <option value="DAY">Day</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Estimated hours
          <Input name="estimatedHours" type="number" min={1} max={500} defaultValue={24} required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Thumbnail URL
          <Input name="thumbnailUrl" type="url" placeholder="Optional" />
        </label>
      </div>

      <label className="inline-flex items-center gap-2 text-sm font-medium">
        <input name="published" type="checkbox" defaultChecked />
        Publish immediately
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving course..." : "Save course"}
        </Button>
        {message ? <p className="text-sm text-[var(--color-muted)]">{message}</p> : null}
      </div>
    </form>
  );
}
