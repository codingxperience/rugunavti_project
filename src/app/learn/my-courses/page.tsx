import Link from "next/link";

import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getLearnerWorkspaceRecords,
  type LearnerCourseRecord,
} from "@/lib/platform/learning-records";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

const fallbackImages = [
  "/brand/hero_illustration.jpg",
  "/brand/home_illustration.jpg",
  "/brand/hero-illustration.jpg",
];

function imageFor(course: LearnerCourseRecord, index: number) {
  return course.thumbnailUrl || fallbackImages[index % fallbackImages.length];
}

function courseHref(course: LearnerCourseRecord) {
  return course.nextLesson
    ? `/learn/course/${course.slug}?lesson=${course.nextLesson.id}&view=modules`
    : `/learn/course/${course.slug}`;
}

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
        [course.title, course.school, course.nextLesson?.title]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : workspace.records;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-4">
        <div>
          <h1 className="font-heading text-5xl font-bold tracking-[-0.05em] text-[var(--color-ink)]">
            Courses
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Your active Ruguna courses, progress, next lessons, and assessment access.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/elearning/courses">Browse catalog</Link>
        </Button>
      </div>

      {query ? (
        <p className="text-sm text-[var(--color-muted)]">
          Search results for <span className="font-semibold text-[var(--color-ink)]">{query}</span>
        </p>
      ) : null}

      {filteredCourses.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <Link
              key={course.enrollmentId}
              href={courseHref(course)}
              className="group overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_24px_80px_-62px_rgba(17,17,17,0.65)] transition hover:-translate-y-1"
            >
              <div
                className="min-h-36 bg-cover bg-center p-5 text-white"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(17,17,17,0.82), rgba(17,17,17,0.18)), url(${imageFor(course, index)})`,
                }}
              >
                <StatusBadge value={course.delivery} />
                <h2 className="font-heading mt-12 text-2xl font-bold leading-tight">{course.title}</h2>
              </div>
              <div className="grid gap-4 p-5">
                <p className="text-sm font-semibold text-[var(--color-ink)]">{course.school}</p>
                <ProgressBar value={course.progress} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-[var(--color-muted)]">
                    {course.completedLessons}/{course.lessonCount} lessons
                  </p>
                  <p className="text-sm font-bold text-[var(--color-ink)]">
                    {course.progress >= 100 ? "Review" : "Continue"}
                  </p>
                </div>
                <p className="text-sm leading-6 text-[var(--color-muted)]">
                  Next: {course.nextLesson?.title ?? "All published lessons completed"}
                </p>
              </div>
            </Link>
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
                ? "Try a different course title, school, or lesson search term."
                : "Short courses can be started immediately. Academic courses appear after admissions or admin placement."}
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
