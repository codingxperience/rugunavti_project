import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { instructorBuilderCourses } from "@/data";

export default async function InstructorCourseBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = instructorBuilderCourses.find((item) => item.id === id);

  if (!course) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge value={course.mode} />
            <StatusBadge value={course.publishState} tone="success" />
          </div>
          <h1 className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">
            {course.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Manage lesson ordering, publish states, assessment configuration, and resource attachment for this course.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {course.modules.map((module) => (
          <Card key={module.id}>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                {module.title}
              </h2>
              <div className="mt-5 grid gap-3">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--color-ink)]">{lesson.title}</p>
                        <p className="mt-2 text-sm text-[var(--color-muted)]">
                          {lesson.type} • {lesson.duration}
                        </p>
                      </div>
                      <StatusBadge value={lesson.state} tone={lesson.state === "Published" ? "success" : "warning"} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
