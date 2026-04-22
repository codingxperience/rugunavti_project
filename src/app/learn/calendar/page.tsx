import { CalendarClock, Clock3, GraduationCap } from "lucide-react";

import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { demoStudentCourses, studentDeadlines, studentTimetable } from "@/data";

export default function LearnCalendarPage() {
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
                Keep track of live sessions, practical labs, quizzes, and assignment deadlines
                across your enrolled Ruguna courses.
              </p>
            </div>
            <StatusBadge value={`${demoStudentCourses.length} enrolled courses`} tone="success" />
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <CalendarClock className="h-5 w-5 text-[var(--color-ink)]" />
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Upcoming deadlines
              </h2>
            </div>
            <div className="mt-5 grid gap-3">
              {studentDeadlines.map((deadline) => (
                <div
                  key={deadline}
                  className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]"
                >
                  {deadline}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-[var(--color-ink)]" />
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                This week&apos;s timetable
              </h2>
            </div>
            <div className="mt-5 grid gap-3">
              {studentTimetable.map((event) => (
                <div
                  key={event}
                  className="rounded-[22px] border border-[var(--color-border)] bg-white p-4 text-sm leading-7 text-[var(--color-muted)]"
                >
                  {event}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-[var(--color-ink)]" />
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Course schedules
            </h2>
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {demoStudentCourses.map((course) => (
              <div
                key={course.slug}
                className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[var(--color-ink)]">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      {course.delivery} learning with {course.instructor}
                    </p>
                  </div>
                  <StatusBadge value={`Next: ${course.nextDeadline}`} />
                </div>
                <div className="mt-4 grid gap-3">
                  {course.schedule.map((item) => (
                    <div
                      key={`${course.slug}-${item}`}
                      className="rounded-[18px] bg-white p-4 text-sm leading-7 text-[var(--color-muted)]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
