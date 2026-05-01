import Link from "next/link";

import { ProgressBar } from "@/components/platform/progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLearnerWorkspaceRecords } from "@/lib/platform/learning-records";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

export default async function ContinueLearningPage() {
  const session = await requireRole(["student", "super_admin"], "/learn/continue");
  const workspace = await getLearnerWorkspaceRecords(session);
  const courses = workspace.records.filter((course) => course.nextLesson);

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Continue learning
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Resume the next lesson in each active course and stay ahead of deadlines.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {courses.length ? (
          courses.map((course) => (
            <Card key={course.enrollmentId}>
              <CardContent className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                    {course.title}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Next lesson: {course.nextLesson?.title}
                  </p>
                  <div className="mt-5">
                    <ProgressBar value={course.progress} />
                  </div>
                  <p className="mt-3 text-sm text-[var(--color-muted)]">
                    {course.pendingAssignments} open assignment(s) - {course.completedLessons}/
                    {course.lessonCount} lessons completed
                  </p>
                </div>
                <div className="flex justify-start xl:justify-end">
                  <Button asChild>
                    <Link href={`/learn/course/${course.slug}?lesson=${course.nextLesson?.id}&view=modules`}>
                      Resume lesson
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                No active lesson to resume
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Enroll in a course or open My Courses to review completed course work.
              </p>
              <div className="mt-5">
                <Button asChild>
                  <Link href="/learn/my-courses">Open my courses</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
