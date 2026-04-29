import Link from "next/link";
import { BookOpenText, CalendarClock, FileBadge2, GraduationCap } from "lucide-react";

import { MetricCard } from "@/components/platform/metric-card";
import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resolveDisplayName } from "@/lib/platform/display-name";
import { getLearnerWorkspaceRecords } from "@/lib/platform/learning-records";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

export default async function LearnDashboardPage() {
  const session = await requireRole(["student", "super_admin"], "/learn/dashboard");
  const workspace = await getLearnerWorkspaceRecords(session);
  const displayName = resolveDisplayName({
    firstName: workspace.user.profile?.firstName,
    lastName: workspace.user.profile?.lastName,
    email: workspace.user.email,
    fallback: "Learner",
  });
  const nextCourse = workspace.records.find((course) => course.progress < 100) ?? workspace.records[0];

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          label="Active courses"
          value={String(workspace.snapshot.activeCourses)}
          detail="Current courses with active lessons and assessment windows."
          icon={<BookOpenText className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Average progress"
          value={`${workspace.snapshot.averageProgress}%`}
          detail="Course completion progress across your learning load."
          icon={<GraduationCap className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Assignments open"
          value={String(workspace.snapshot.outstandingAssignments)}
          detail="Assignments or practical tasks waiting for submission."
          icon={<CalendarClock className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Certificates"
          value={String(workspace.snapshot.availableCertificates)}
          detail="Issued completion records available in your account."
          icon={<FileBadge2 className="h-5 w-5 text-[var(--color-ink)]" />}
        />
      </section>

      <Card>
        <CardContent>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Welcome back
          </p>
          <h1 className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">
            {displayName}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Your dashboard is connected to the live eLearning database: enrollments, lessons,
            assignments, progress, and certificates update from your protected account.
          </p>

          {nextCourse?.nextLesson ? (
            <div className="mt-8 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    Continue learning
                  </p>
                  <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
                    {nextCourse.title}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {nextCourse.nextLesson.moduleTitle}: {nextCourse.nextLesson.title}
                  </p>
                </div>
                <StatusBadge value={`${nextCourse.progress}% complete`} tone="success" />
              </div>
              <div className="mt-5">
                <ProgressBar value={nextCourse.progress} />
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/learn/course/${nextCourse.slug}?lesson=${nextCourse.nextLesson.id}`}>
                    Resume lesson
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/learn/my-courses">View all courses</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Start your first online course
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                You do not have an active enrollment yet. Browse published Ruguna eLearning courses
                and enroll into a course that matches your learning pathway.
              </p>
              <div className="mt-5">
                <Button asChild>
                  <Link href="/elearning/courses">Browse courses</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {workspace.records.length ? (
        <section className="grid gap-4">
          {workspace.records.map((course) => (
            <Card key={course.enrollmentId} className="border-black/8 bg-white shadow-none">
              <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge value={course.program} />
                    <StatusBadge value={course.status} tone={course.progress >= 100 ? "success" : "neutral"} />
                  </div>
                  <p className="font-heading mt-4 text-xl font-bold text-[var(--color-ink)]">
                    {course.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {course.school}. {course.completedLessons}/{course.lessonCount} lessons completed
                    across {course.moduleCount} modules.
                  </p>
                  <div className="mt-4">
                    <ProgressBar value={course.progress} />
                  </div>
                </div>
                <div className="flex justify-start lg:justify-end">
                  <Button asChild variant="secondary">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {workspace.recommendedCourses.map((course) => {
            const lessons = course.modules.reduce((count, module) => count + module.lessons.length, 0);

            return (
              <Card key={course.id}>
                <CardContent>
                  <StatusBadge value={course.program.level.replace(/_/g, " ")} />
                  <h2 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">
                    {course.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {course.school.name}. {course.modules.length} modules and {lessons} lessons
                    available for online or blended study.
                  </p>
                  <div className="mt-5">
                    <Button asChild variant="secondary">
                      <Link href={`/elearning/courses/${course.slug}`}>View course</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
}
