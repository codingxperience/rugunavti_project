import { notFound } from "next/navigation";

import { StaffCourseBuilder } from "@/components/elearning/staff-course-builder";
import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStaffCourseBuilderRecord } from "@/lib/platform/staff-records";

export const dynamic = "force-dynamic";

export default async function InstructorCourseBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getStaffCourseBuilderRecord(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge value={course.deliveryMode.replace(/_/g, " ")} />
            <StatusBadge
              value={course.status}
              tone={course.status === "PUBLISHED" ? "success" : "warning"}
            />
          </div>
          <h1 className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">
            {course.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Manage lesson ordering, publish states, assessment configuration, and resource
            attachment for this course.
          </p>
        </CardContent>
      </Card>

      <StaffCourseBuilder course={course} />

      <div className="grid gap-4">
        {course.modules.map((module) => (
          <details
            key={module.id}
            className="group rounded-[28px] border border-[var(--color-border)] bg-white"
          >
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4 px-5 py-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  Module {module.position}: {module.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{module.summary}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={`${module.lessons.length} lessons`} />
                <StatusBadge
                  value={module.status}
                  tone={module.status === "PUBLISHED" ? "success" : "warning"}
                />
              </div>
            </summary>
            <div className="border-t border-[var(--color-border)] p-5">
              <div className="grid gap-3">
                {module.lessons.length ? (
                  module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[var(--color-ink)]">{lesson.title}</p>
                          <p className="mt-2 text-sm text-[var(--color-muted)]">
                            {lesson.lessonType.replace(/_/g, " ")} -{" "}
                            {lesson.durationMinutes ?? "self-paced"} min -{" "}
                            {lesson.resources.length} resources
                          </p>
                        </div>
                        <StatusBadge
                          value={lesson.status}
                          tone={lesson.status === "PUBLISHED" ? "success" : "warning"}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]">
                    No lessons have been added to this module yet.
                  </div>
                )}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
