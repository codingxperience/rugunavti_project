import Link from "next/link";

import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { demoStudentCourses, getRecommendedLesson } from "@/data";

export default async function LearnMyCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const normalizedQuery = query?.trim().toLowerCase();

  const filteredCourses = normalizedQuery
    ? demoStudentCourses.filter((course) =>
        [
          course.title,
          course.school,
          course.instructor,
          ...course.modules.map((module) => module.title),
          ...course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.title)),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : demoStudentCourses;

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">My courses</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review your enrolled courses, resume the next lesson, and track progress across
            online and blended study.
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
          {filteredCourses.map((course) => {
            const recommendedLesson = getRecommendedLesson(course);
            const totalLessons = course.modules.reduce(
              (total, module) => total + module.lessons.length,
              0
            );

            return (
              <Card key={course.slug}>
                <CardContent className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_240px] xl:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge value={course.award} />
                      <StatusBadge
                        value={course.progress >= 100 ? "Completed" : course.delivery}
                        tone={course.progress >= 100 ? "success" : "neutral"}
                      />
                    </div>
                    <h2 className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">
                      {course.title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                      {course.school} with {course.instructor}. {totalLessons} lessons
                      across {course.modules.length} modules.
                    </p>
                    <div className="mt-5">
                      <ProgressBar value={course.progress} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
                      <span>Next lesson: {recommendedLesson.title}</span>
                      <span>Deadline: {course.nextDeadline}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 xl:items-end">
                    <Button asChild>
                      <Link href={`/learn/course/${course.slug}?lesson=${recommendedLesson.id}`}>
                        {course.progress >= 100 ? "Review course" : "Continue learning"}
                      </Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link href="/learn/assignments">View assignments</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              No matching courses found
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Try a different course title, lesson name, or instructor search term.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
