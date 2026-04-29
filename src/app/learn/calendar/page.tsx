import Link from "next/link";
import { CalendarClock, Clock3, GraduationCap } from "lucide-react";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLearnerAcademicCalendar } from "@/lib/platform/learning-records";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) {
    return "No date set";
  }

  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default async function LearnCalendarPage() {
  const calendar = await getLearnerAcademicCalendar();
  const deadlineItems = calendar.enrollments.flatMap((enrollment) => [
    ...enrollment.assignments.map((assignment) => ({
      id: `${enrollment.id}-${assignment.id}`,
      title: assignment.title,
      courseTitle: enrollment.courseTitle,
      dueAt: assignment.dueAt,
      type: "Assignment",
    })),
    ...enrollment.quizzes.map((quiz) => ({
      id: `${enrollment.id}-${quiz.id}`,
      title: quiz.title,
      courseTitle: enrollment.courseTitle,
      dueAt: null,
      type: quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes}-minute quiz` : "Quiz",
    })),
  ]);
  const weeklyItems = calendar.enrollments.flatMap((enrollment) =>
    enrollment.weeks.slice(0, 6).map((week) => ({
      enrollment,
      week,
    }))
  );

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                Learning calendar
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                Track your active course schedules, weekly plans, quizzes, and assignment deadlines
                from your real Ruguna eLearning enrollments.
              </p>
            </div>
            <StatusBadge value={`${calendar.enrollments.length} enrolled course(s)`} tone="success" />
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <CalendarClock className="h-5 w-5 text-[var(--color-ink)]" />
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Upcoming assessment work
              </h2>
            </div>
            <div className="mt-5 grid gap-3">
              {deadlineItems.length ? (
                deadlineItems.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-[var(--color-ink)]">{item.title}</p>
                      <StatusBadge value={item.type} />
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      {item.courseTitle}. Due: {formatDate(item.dueAt)}.
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]">
                  No assignment or quiz deadlines are attached to your active courses yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-[var(--color-ink)]" />
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Active course schedules
              </h2>
            </div>
            <div className="mt-5 grid gap-4">
              {calendar.enrollments.length ? (
                calendar.enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-[var(--color-ink)]">
                          {enrollment.courseTitle}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--color-muted)]">
                          {enrollment.offeringTitle} • {enrollment.pace} • {enrollment.weekCount} weeks
                        </p>
                      </div>
                      <StatusBadge value={`${enrollment.progress}% complete`} tone="success" />
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                      Starts {formatDate(enrollment.startDate)}
                      {enrollment.endDate ? ` and ends ${formatDate(enrollment.endDate)}` : ""}.
                    </p>
                    <div className="mt-5">
                      <Button asChild variant="secondary">
                        <Link href={`/learn/course/${enrollment.courseSlug}?view=syllabus`}>
                          Open syllabus
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]">
                  Enroll into a course to see your academic calendar.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-[var(--color-ink)]" />
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Weekly learning plan
            </h2>
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {weeklyItems.length ? (
              weeklyItems.map(({ enrollment, week }) => (
                <div
                  key={`${enrollment.id}-${week.id}`}
                  className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {enrollment.courseTitle} • Week {week.weekNumber}
                  </p>
                  <h3 className="font-heading mt-3 text-xl font-bold text-[var(--color-ink)]">
                    {week.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    Preparation: {week.preparationQuizTitle}. Teach one another:{" "}
                    {week.teachOneAnotherTask}. Ponder and prove: {week.ponderProveTask}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)] xl:col-span-2">
                Weekly learning plans will appear here when your enrolled courses publish their
                7-week or 14-week syllabus schedules.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
