"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type BuilderCourse = {
  id: string;
  weekPlans: {
    id: string;
    weekNumber: number;
    title: string;
    topic: string;
    status: string;
  }[];
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

type ApiResponse = {
  success: boolean;
  message?: string;
  errors?: {
    fieldErrors?: Record<string, string[] | undefined>;
    formErrors?: string[];
  };
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatApiMessage(payload: ApiResponse, fallback: string) {
  const fieldMessages = Object.values(payload.errors?.fieldErrors ?? {})
    .flat()
    .filter(Boolean);
  const formMessages = payload.errors?.formErrors?.filter(Boolean) ?? [];
  const details = [...formMessages, ...fieldMessages];

  return details.length ? details.join(" ") : payload.message ?? fallback;
}

async function postJson(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await response.json().catch(() => null)) as ApiResponse | null;

  return {
    ok: response.ok && Boolean(body?.success),
    message: body
      ? formatApiMessage(body, response.ok ? "Saved." : "Save failed.")
      : "Save failed. The server returned an invalid response.",
  };
}

function ActionDisclosure({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-[26px] border border-[var(--color-border)] bg-white shadow-[0_20px_70px_-60px_rgba(17,17,17,0.55)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <span>
          <span className="font-heading text-xl font-bold text-[var(--color-ink)]">{title}</span>
          <span className="mt-1 block text-sm leading-6 text-[var(--color-muted)]">
            {description}
          </span>
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f6f5ef] text-[var(--color-ink)]">
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="border-t border-[var(--color-border)] p-5">{children}</div>
    </details>
  );
}

export function StaffCourseBuilder({ course }: StaffCourseBuilderProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const lessons = course.modules.flatMap((module) => module.lessons);
  const hasModules = course.modules.length > 0;
  const hasLessons = lessons.length > 0;

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
    <section className="grid gap-4">
      <div className="rounded-[28px] border border-[var(--color-border)] bg-[#f6f5ef] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Course builder
        </p>
        <h2 className="font-heading mt-2 text-2xl font-bold text-[var(--color-ink)]">
          Build course content
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
          Open one action at a time. Weekly plans shape the learner module list; modules and
          lessons hold the classroom content, resources, assignments, and quizzes.
        </p>
        {message ? (
          <div className="mt-4 rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
            {message}
          </div>
        ) : null}
      </div>

      <ActionDisclosure
        title="Add module"
        description="Create the next folded section in the course structure."
      >
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
          className="grid gap-4"
        >
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
      </ActionDisclosure>

      <ActionDisclosure
        title="Add weekly plan"
        description="Create the week-by-week learning rhythm students see in Modules and Syllabus."
      >
        <form
          onSubmit={(event) =>
            handleSubmit(event, "/api/admin/elearning/weeks", (formData) => ({
              courseId: course.id,
              weekNumber: Number(formData.get("weekNumber") ?? course.weekPlans.length + 1),
              title: String(formData.get("title") ?? ""),
              overview: String(formData.get("overview") ?? ""),
              topic: String(formData.get("topic") ?? ""),
              preparationQuizTitle: String(formData.get("preparationQuizTitle") ?? ""),
              preparationMaterials: String(formData.get("preparationMaterials") ?? ""),
              preparationReading: String(formData.get("preparationReading") ?? ""),
              teachOneAnotherTask: String(formData.get("teachOneAnotherTask") ?? ""),
              ponderProveTask: String(formData.get("ponderProveTask") ?? ""),
              liveSessionNote: String(formData.get("liveSessionNote") ?? "") || undefined,
              dueDateOffsetDays: Number(formData.get("dueDateOffsetDays") ?? 7),
              published: formData.get("published") === "on",
            }))
          }
          className="grid gap-4"
        >
          <div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)]">
            <Input
              name="weekNumber"
              type="number"
              min={1}
              max={52}
              defaultValue={course.weekPlans.length + 1}
              required
            />
            <Input name="title" required placeholder="Week 01: Topic title" />
          </div>
          <Input name="topic" required placeholder="Weekly topic" />
          <Textarea name="overview" required placeholder="What this week is about" />
          <Input name="preparationQuizTitle" required placeholder="Preparation quiz title" />
          <div className="grid gap-3 md:grid-cols-2">
            <Textarea name="preparationMaterials" required placeholder="Preparation materials" />
            <Textarea name="preparationReading" required placeholder="Reading or study guidance" />
          </div>
          <Textarea name="teachOneAnotherTask" required placeholder="Teach One Another group task" />
          <Textarea name="ponderProveTask" required placeholder="Ponder and Prove paper/project task" />
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="liveSessionNote" placeholder="Optional live or blended session note" />
            <Input name="dueDateOffsetDays" type="number" min={0} max={400} defaultValue={7} />
          </div>
          <label className="inline-flex items-center gap-2 text-sm font-medium">
            <input name="published" type="checkbox" defaultChecked />
            Publish weekly plan
          </label>
          <Button type="submit" disabled={pending === "/api/admin/elearning/weeks"}>
            {pending === "/api/admin/elearning/weeks" ? "Saving..." : "Save weekly plan"}
          </Button>
        </form>
      </ActionDisclosure>

      <ActionDisclosure
        title="Add lesson"
        description="Attach a lesson to an existing module."
      >
        {hasModules ? (
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
                  videoUrl: String(formData.get("videoUrl") ?? ""),
                  liveSessionUrl: String(formData.get("liveSessionUrl") ?? ""),
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
            className="grid gap-4"
          >
            <ModuleSelect modules={course.modules} />
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
            <div className="grid gap-3 md:grid-cols-2">
              <Input name="videoUrl" placeholder="Video URL when lesson is video" />
              <Input name="liveSessionUrl" placeholder="Live session URL when needed" />
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
        ) : (
          <EmptyBuilderMessage text="Create a module before adding lessons." />
        )}
      </ActionDisclosure>

      <ActionDisclosure
        title="Attach resource"
        description="Attach a PDF, image, CSV, or other approved learner file."
      >
        {hasLessons ? (
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
            className="grid gap-4"
          >
            <LessonSelect lessons={lessons} />
            <Input name="title" required placeholder="Resource title" />
            <Input name="fileUrl" required placeholder="Supabase path or external URL" />
            <div className="grid gap-3 md:grid-cols-2">
              <select name="mimeType" className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm">
                <option value="application/pdf">PDF</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
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
        ) : (
          <EmptyBuilderMessage text="Create at least one lesson before attaching resources." />
        )}
      </ActionDisclosure>

      <ActionDisclosure
        title="Create assignment"
        description="Create a graded submission task for this course."
      >
        {hasLessons ? (
          <form
            onSubmit={(event) =>
              handleSubmit(event, "/api/admin/elearning/assignments", (formData) => {
                const dueAt = String(formData.get("dueAt") ?? "");

                return {
                  courseId: course.id,
                  lessonId: String(formData.get("lessonId") ?? ""),
                  title: String(formData.get("title") ?? ""),
                  brief: String(formData.get("brief") ?? ""),
                  instructions: String(formData.get("instructions") ?? ""),
                  dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
                  maxScore: Number(formData.get("maxScore") ?? 100),
                  allowRetry: formData.get("allowRetry") === "on",
                  acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png", "image/webp", "text/csv"],
                  published: formData.get("published") === "on",
                };
              })
            }
            className="grid gap-4"
          >
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
        ) : (
          <EmptyBuilderMessage text="Create a lesson before attaching assignments." />
        )}
      </ActionDisclosure>

      <ActionDisclosure
        title="Create quiz"
        description="Create a timed or self-paced quiz with an initial true/false question."
      >
        {hasLessons ? (
          <form
            onSubmit={(event) =>
              handleSubmit(event, "/api/admin/elearning/quizzes", (formData) => ({
                courseId: course.id,
                lessonId: String(formData.get("lessonId") ?? ""),
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
            className="grid gap-4"
          >
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
        ) : (
          <EmptyBuilderMessage text="Create a lesson before adding quizzes." />
        )}
      </ActionDisclosure>
    </section>
  );
}

function ModuleSelect({ modules }: { modules: BuilderCourse["modules"] }) {
  return (
    <select name="moduleId" className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm">
      {modules.map((module) => (
        <option key={module.id} value={module.id}>
          Module {module.position}: {module.title}
        </option>
      ))}
    </select>
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

function EmptyBuilderMessage({ text }: { text: string }) {
  return (
    <div className={cn("rounded-[22px] border border-[var(--color-border)] bg-[#f6f5ef] p-4 text-sm leading-7 text-[var(--color-muted)]")}>
      {text}
    </div>
  );
}
