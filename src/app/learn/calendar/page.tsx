import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Video } from "lucide-react";

import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLearnerAcademicCalendar } from "@/lib/platform/learning-records";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type CalendarView = "today" | "week" | "month";

type AgendaItem = {
  id: string;
  title: string;
  courseTitle: string;
  type: "Course" | "Assignment" | "Quiz" | "Live";
  duration: string;
  at: Date;
  href: string;
};

function isCalendarView(value: string | undefined): value is CalendarView {
  return value === "today" || value === "week" || value === "month";
}

function addDays(date: Date, days: number, hour = 9) {
  const nextDate = new Date(date);

  nextDate.setDate(nextDate.getDate() + days);
  nextDate.setHours(hour, 0, 0, 0);

  return nextDate;
}

function formatTime(value: Date) {
  return new Intl.DateTimeFormat("en-UG", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-UG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

function isSameDay(left: Date, right: Date) {
  return left.toDateString() === right.toDateString();
}

function withinDays(value: Date, start: Date, days: number) {
  const end = addDays(start, days, 23);

  return value >= start && value <= end;
}

function getAgendaColor(type: AgendaItem["type"], index: number) {
  if (type === "Assignment") return "bg-[#fde4aa]";
  if (type === "Quiz") return "bg-[#dcdcff]";
  if (type === "Live") return "bg-[#b8f2d4]";

  return index % 2 === 0 ? "bg-[#f8c9d0]" : "bg-[#d8dcff]";
}

function buildAgenda(calendar: Awaited<ReturnType<typeof getLearnerAcademicCalendar>>) {
  const agenda: AgendaItem[] = [];

  for (const enrollment of calendar.enrollments) {
    const startDate = new Date(enrollment.startDate);

    enrollment.weeks.forEach((week) => {
      const at = addDays(startDate, (week.weekNumber - 1) * 7, 9);

      agenda.push({
        id: `${enrollment.id}-week-${week.weekNumber}`,
        title: week.title.replace(/^Week\s+\d+:\s*/i, ""),
        courseTitle: enrollment.courseTitle,
        type: week.liveSessionNote ? "Live" : "Course",
        duration: enrollment.pace.includes("Seven") ? "1h 30m" : "2h",
        at,
        href: `/learn/course/${enrollment.courseSlug}?view=syllabus`,
      });
    });

    enrollment.assignments.forEach((assignment) => {
      if (!assignment.dueAt) return;

      agenda.push({
        id: `${enrollment.id}-assignment-${assignment.id}`,
        title: assignment.title,
        courseTitle: enrollment.courseTitle,
        type: "Assignment",
        duration: "Due",
        at: new Date(assignment.dueAt),
        href: `/learn/assignments`,
      });
    });

    enrollment.quizzes.forEach((quiz, index) => {
      agenda.push({
        id: `${enrollment.id}-quiz-${quiz.id}`,
        title: quiz.title,
        courseTitle: enrollment.courseTitle,
        type: "Quiz",
        duration: quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes}m` : "Self-paced",
        at: addDays(startDate, index * 7 + 3, 16),
        href: `/learn/quizzes`,
      });
    });
  }

  return agenda.sort((left, right) => left.at.getTime() - right.at.getTime());
}

export default async function LearnCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const [{ view }, calendar] = await Promise.all([searchParams, getLearnerAcademicCalendar()]);
  const selectedView: CalendarView = isCalendarView(view) ? view : "today";
  const agenda = buildAgenda(calendar);
  const today = new Date();
  const nextAgendaDate = agenda.find((item) => item.at >= today)?.at ?? agenda[0]?.at ?? today;
  const selectedDate = selectedView === "today" ? nextAgendaDate : today;
  const visibleAgenda = agenda.filter((item) => {
    if (selectedView === "today") return isSameDay(item.at, selectedDate);
    if (selectedView === "week") return withinDays(item.at, today, 7);

    return withinDays(item.at, today, 31);
  });
  const displayAgenda = visibleAgenda.length
    ? visibleAgenda
    : agenda.filter((item) => item.at >= today).slice(0, 4);

  return (
    <div className="grid gap-8">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-5xl font-bold tracking-[-0.06em] text-[var(--color-ink)] md:text-7xl">
            Schedule
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            Your course weeks, live sessions, quizzes, and assignment deadlines from active Ruguna
            enrollments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/learn/my-courses"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-black"
          >
            Open courses
          </Link>
          <div className="flex rounded-full border border-black/8 bg-white p-1 shadow-[0_16px_40px_-32px_rgba(17,17,17,0.5)]">
            {(["today", "week", "month"] as const).map((item) => (
              <Link
                key={item}
                href={`/learn/calendar?view=${item}`}
                className={cn(
                  "rounded-full px-6 py-3 text-sm font-bold capitalize transition",
                  selectedView === item
                    ? "bg-[var(--color-soft-accent)] text-[var(--color-ink)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                )}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Card className="overflow-hidden rounded-[36px] border-black/8 bg-white shadow-[0_34px_100px_-78px_rgba(17,17,17,0.55)]">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/6 px-6 py-6 md:px-10">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[var(--color-soft-accent)] text-[var(--color-ink)]">
                <CalendarDays className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                  {selectedView === "today" ? "Next agenda" : `${selectedView} agenda`}
                </h2>
                <p className="mt-1 text-sm font-semibold text-[var(--color-muted)]">
                  {formatDate(selectedDate)}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black/8 bg-white">
                <ChevronLeft className="h-5 w-5" />
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black/8 bg-white">
                <ChevronRight className="h-5 w-5" />
              </span>
            </div>
          </div>

          <div className="grid gap-0 px-5 py-8 md:px-10">
            {displayAgenda.length ? (
              displayAgenda.slice(0, selectedView === "month" ? 12 : 6).map((item, index) => (
                <div key={item.id} className="grid grid-cols-[90px_1fr] gap-5 md:grid-cols-[120px_1fr]">
                  <div className="relative border-r border-black/8 py-5 pr-5 text-right">
                    <p className="text-sm font-bold text-[var(--color-muted)]">{formatTime(item.at)}</p>
                    <span
                      className={cn(
                        "absolute -right-[7px] top-8 h-3.5 w-3.5 rounded-full border-2 border-white",
                        getAgendaColor(item.type, index)
                      )}
                    />
                  </div>
                  <Link
                    href={item.href}
                    className={cn(
                      "my-3 flex min-h-32 items-center justify-between gap-4 rounded-[30px] px-6 py-5 transition hover:-translate-y-1 md:px-9",
                      getAgendaColor(item.type, index)
                    )}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge value={item.type} />
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-ink)]">
                          <Clock3 className="h-4 w-4" />
                          {item.duration}
                        </span>
                      </div>
                      <h3 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]/60">
                        {item.courseTitle}
                      </p>
                    </div>
                    <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-ink)] shadow-[0_16px_35px_-24px_rgba(17,17,17,0.55)] sm:flex">
                      <Video className="h-5 w-5" />
                    </span>
                  </Link>
                </div>
              ))
            ) : (
              <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 text-sm leading-7 text-[var(--color-muted)]">
                Enroll into a course to see your agenda.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
