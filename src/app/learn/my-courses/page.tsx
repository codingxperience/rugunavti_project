import Link from "next/link";

import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLearnerWorkspaceRecords } from "@/lib/platform/learning-records";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

export default async function LearnMyCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const session = await requireRole(["student", "super_admin"], "/learn/my-courses");
  const workspace = await getLearnerWorkspaceRecords(session);
  const normalizedQuery = query?.trim().toLowerCase();

  const filteredCourses = normalizedQuery
    ? workspace.records.filter((course) =>
        [course.title, course.school, course.program, course.nextLesson?.title]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : workspace.records;

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">My courses</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review enrolled Ruguna eLearning courses, resume the next lesson, and track progress
            from your database-backed learning record.
          </p>
          {query ? (
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              Search results for <span className="font-semibold text-[var(--color-ink)]">{query}</span>
            </p>
          ) : null}
        </CardContent>
      </Card>

      {filteredCourses.length ? (
        <div className="grid gap-4">
          {filteredCourses.map((course) => (
            <Card key={course.enrollmentId}>
              <CardContent className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_240px] xl:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge value={course.program} />
                    <StatusBadge
                      value={course.progress >= 100 ? "Completed" : course.delivery}
                      tone={course.progress >= 100 ? "success" : "neutral"}
                    />
                  </div>
                  <h2 className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">
                    {course.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                    {course.school}. {course.lessonCount} lessons across {course.moduleCount} modules.
                  </p>
                  <div className="mt-5">
                    <ProgressBar value={course.progress} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
                    <span>
                      Next lesson: {course.nextLesson?.title ?? "All published lessons completed"}
                    </span>
                    <span>{course.pendingAssignments} assignment(s) open</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 xl:items-end">
                  <Button asChild>
                    <Link
                      href={
                        course.nextLesson
                          ? `/learn/course/${course.slug}?lesson=${course.nextLesson.id}`
                          : `/learn/course/${course.slug}`
                      }
                    >
                      {course.progress >= 100 ? "Review course" : "Continue learning"}
                    </Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/learn/assignments">View assignments</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              {query ? "No matching courses found" : "No enrolled courses yet"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              {query
                ? "Try a different course title, school, programme, or lesson search term."
                : "Browse the eLearning catalog and enroll into a course to start building your learning record."}
            </p>
            <div className="mt-5">
              <Button asChild>
                <Link href="/elearning/courses">Browse courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
