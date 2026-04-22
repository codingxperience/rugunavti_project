"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type BuilderCourse = {
  id: string;
  modules: {
    id: string;
    title: string;
    position: number;
    lessons: {
      id: string;
      title: string;
      lessonType: string;
      position: number;
    }[];
  }[];
};

type StaffCourseBuilderProps = {
  course: BuilderCourse;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function postJson(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await response.json()) as { success: boolean; message: string };

  return { ok: response.ok && body.success, message: body.message };
}

export function StaffCourseBuilder({ course }: StaffCourseBuilderProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const lessons = course.modules.flatMap((module) => module.lessons);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    action: string,
    buildPayload: (formData: FormData) => unknown
  ) {
    event.preventDefault();
    setPending(action);
    setMessage(null);

    try {
      const result = await postJson(action, buildPayload(new FormData(event.currentTarget)));
      setMessage(result.message);

      if (result.ok) {
        event.currentTarget.reset();
        startTransition(() => router.refresh());
      }
    } catch {
      setMessage("Save failed. Check your connection and try again.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <form
        onSubmit={(event) =>
          handleSubmit(event, "/api/admin/elearning/modules", (formData) => ({
            courseId: course.id,
            title: String(formData.get("title") ?? ""),
            summary: String(formData.get("summary") ?? ""),
            position: Number(formData.get("position") ?? course.modules.length + 1),
            published: formData.get("published") === "on",
          }))
        }
        className="grid gap-4 rounded-[28px] border border-[var(--color-border)] bg-white p-5"
      >
        <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">Add module</h2>
        <Input name="title" required placeholder="Module title" />
        <Textarea name="summary" required placeholder="Module summary and learning focus" />
        <Input name="position" type="number" min={1} defaultValue={course.modules.length + 1} required />
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input name="published" type="checkbox" defaultChecked />
          Publish module
        </label>
        <Button type="submit" disabled={pending === "/api/admin/elearning/modules"}>
          {pending === "/api/admin/elearning/modules" ? "Saving..." : "Save module"}
        </Button>
      </form>

      <form
        onSubmit={(event) =>
          handleSubmit(event, "/api/admin/elearning/lessons", (formData) => {
            const title = String(formData.get("title") ?? "");

            return {
              moduleId: String(formData.get("moduleId") ?? ""),
              title,
              slug: slugify(String(formData.get("slug") ?? title)),
              summary: String(formData.get("summary") ?? ""),
              lessonType: String(formData.get("lessonType") ?? "TEXT"),
              position: Number(formData.get("position") ?? 1),
              durationMinutes: Number(formData.get("durationMinutes") ?? 30),
              published: formData.get("published") === "on",
              body: {
                objective: String(formData.get("objective") ?? ""),
                keyPoints: String(formData.get("keyPoints") ?? "")
                  .split(/\r?\n/)
                  .map((item) => item.trim())
                  .filter(Boolean),
                instructorNote: String(formData.get("instructorNote") ?? ""),
                practicalTask: String(formData.get("practicalTask") ?? ""),
              },
            };
          })
        }
        className="grid gap-4 rounded-[28px] border border-[var(--color-border)] bg-white p-5"
      >
        <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">Add lesson</h2>
        <select name="moduleId" className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm">
          {course.modules.map((module) => (
            <option key={module.id} value={module.id}>
              Module {module.position}: {module.title}
            </option>
          ))}
        </select>
        <div className="grid gap-3 md:grid-cols-2">
          <Input name="title" required placeholder="Lesson title" />
          <Input name="slug" placeholder="Optional custom slug" />
        </div>
        <Textarea name="summary" required placeholder="Short lesson summary" />
        <div className="grid gap-3 md:grid-cols-3">
          <select name="lessonType" className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm">
            <option value="TEXT">Text</option>
            <option value="VIDEO">Video</option>
            <option value="RESOURCE">Resource</option>
            <option value="LIVE_SESSION">Live session</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="QUIZ">Quiz</option>
            <option value="PRACTICAL_TASK">Practical task</option>
            <option value="BLENDED_GUIDE">Blended guide</option>
          </select>
          <Input name="position" type="number" min={1} defaultValue={1} required />
          <Input name="durationMinutes" type="number" min={1} defaultValue={30} required />
        </div>
        <Input name="objective" placeholder="Learning objective" />
        <Textarea name="keyPoints" placeholder="Key points, one per line" />
        <Textarea name="instructorNote" placeholder="Instructor note" />
        <Textarea name="practicalTask" placeholder="Practical task or fieldwork instruction" />
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input name="published" type="checkbox" defaultChecked />
          Publish lesson
        </label>
        <Button type="submit" disabled={pending === "/api/admin/elearning/lessons"}>
          {pending === "/api/admin/elearning/lessons" ? "Saving..." : "Save lesson"}
        </Button>
      </form>

      <form
        onSubmit={(event) =>
          handleSubmit(event, "/api/admin/elearning/resources", (formData) => ({
            lessonId: String(formData.get("lessonId") ?? ""),
            title: String(formData.get("title") ?? ""),
            description: String(formData.get("description") ?? "") || undefined,
            fileUrl: String(formData.get("fileUrl") ?? ""),
            mimeType: String(formData.get("mimeType") ?? "application/pdf"),
            sizeBytes: Number(formData.get("sizeBytes") ?? 256000),
            isPrivate: formData.get("isPrivate") === "on",
          }))
        }
        className="grid gap-4 rounded-[28px] border border-[var(--color-border)] bg-white p-5"
      >
        <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">Attach resource</h2>
        <LessonSelect lessons={lessons} />
        <Input name="title" required placeholder="Resource title" />
        <Input name="fileUrl" required placeholder="Supabase path or external URL" />
        <div className="grid gap-3 md:grid-cols-2">
          <select name="mimeType" className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm">
            <option value="application/pdf">PDF</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="text/csv">CSV</option>
          </select>
          <Input name="sizeBytes" type="number" min={1} defaultValue={256000} required />
        </div>
        <Textarea name="description" placeholder="Optional resource note" />
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input name="isPrivate" type="checkbox" defaultChecked />
          Private learner resource
        </label>
        <Button type="submit" disabled={pending === "/api/admin/elearning/resources"}>
          {pending === "/api/admin/elearning/resources" ? "Saving..." : "Attach resource"}
        </Button>
      </form>

      <form
        onSubmit={(event) =>
          handleSubmit(event, "/api/admin/elearning/assignments", (formData) => {
            const dueAt = String(formData.get("dueAt") ?? "");

            return {
              courseId: course.id,
              lessonId: String(formData.get("lessonId") ?? "") || undefined,
              title: String(formData.get("title") ?? ""),
              brief: String(formData.get("brief") ?? ""),
              instructions: String(formData.get("instructions") ?? ""),
              dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
              maxScore: Number(formData.get("maxScore") ?? 100),
              allowRetry: formData.get("allowRetry") === "on",
              acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png", "text/csv"],
              published: formData.get("published") === "on",
            };
          })
        }
        className="grid gap-4 rounded-[28px] border border-[var(--color-border)] bg-white p-5"
      >
        <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">Create assignment</h2>
        <LessonSelect lessons={lessons} />
        <Input name="title" required placeholder="Assignment title" />
        <Textarea name="brief" required placeholder="Assignment brief" />
        <Textarea name="instructions" required placeholder="Submission instructions" />
        <div className="grid gap-3 md:grid-cols-2">
          <Input name="dueAt" type="datetime-local" />
          <Input name="maxScore" type="number" min={1} defaultValue={100} required />
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input name="allowRetry" type="checkbox" defaultChecked />
          Allow retry
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input name="published" type="checkbox" defaultChecked />
          Publish assignment
        </label>
        <Button type="submit" disabled={pending === "/api/admin/elearning/assignments"}>
          {pending === "/api/admin/elearning/assignments" ? "Saving..." : "Save assignment"}
        </Button>
      </form>

      <form
        onSubmit={(event) =>
          handleSubmit(event, "/api/admin/elearning/quizzes", (formData) => ({
            courseId: course.id,
            lessonId: String(formData.get("lessonId") ?? "") || undefined,
            title: String(formData.get("title") ?? ""),
            summary: String(formData.get("summary") ?? ""),
            instructions: String(formData.get("instructions") ?? ""),
            timeLimitMinutes: Number(formData.get("timeLimitMinutes") ?? 20),
            passingScore: Number(formData.get("passingScore") ?? 60),
            maxAttempts: Number(formData.get("maxAttempts") ?? 2),
            published: formData.get("published") === "on",
            questions: [
              {
                prompt: String(formData.get("prompt") ?? ""),
                questionType: "TRUE_FALSE",
                options: { true: "True", false: "False" },
                correctAnswer: formData.get("correctAnswer") === "true",
                explanation: String(formData.get("explanation") ?? ""),
                points: 1,
                position: 1,
              },
            ],
          }))
        }
        className="grid gap-4 rounded-[28px] border border-[var(--color-border)] bg-white p-5"
      >
        <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">Create quiz</h2>
        <LessonSelect lessons={lessons} />
        <Input name="title" required placeholder="Quiz title" />
        <Textarea name="summary" required placeholder="Quiz summary" />
        <Textarea name="instructions" required placeholder="Learner instructions" />
        <div className="grid gap-3 md:grid-cols-3">
          <Input name="timeLimitMinutes" type="number" min={1} defaultValue={20} required />
          <Input name="passingScore" type="number" min={0} max={100} defaultValue={60} required />
          <Input name="maxAttempts" type="number" min={1} max={10} defaultValue={2} required />
        </div>
        <Input name="prompt" required placeholder="True/false question prompt" />
        <select name="correctAnswer" className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm">
          <option value="true">Correct answer: True</option>
          <option value="false">Correct answer: False</option>
        </select>
        <Textarea name="explanation" placeholder="Feedback shown after grading" />
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input name="published" type="checkbox" defaultChecked />
          Publish quiz
        </label>
        <Button type="submit" disabled={pending === "/api/admin/elearning/quizzes"}>
          {pending === "/api/admin/elearning/quizzes" ? "Saving..." : "Save quiz"}
        </Button>
      </form>

      {message ? (
        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm text-[var(--color-muted)] xl:col-span-2">
          {message}
        </div>
      ) : null}
    </div>
  );
}

function LessonSelect({ lessons }: { lessons: BuilderCourse["modules"][number]["lessons"] }) {
  return (
    <select name="lessonId" className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm">
      {lessons.map((lesson) => (
        <option key={lesson.id} value={lesson.id}>
          Lesson {lesson.position}: {lesson.title}
        </option>
      ))}
    </select>
  );
}
