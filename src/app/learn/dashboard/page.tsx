import Link from "next/link";
import {
  Bell,
  BookOpenText,
  CalendarClock,
  CircleHelp,
  FileBadge2,
  GraduationCap,
} from "lucide-react";

import { MetricCard } from "@/components/platform/metric-card";
import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  demoStudentCourses,
  getRecommendedLesson,
  learnerDashboardSnapshot,
  learnerHelpChannels,
  learnerProfile,
  studentAnnouncements,
  studentDeadlines,
  studentRecentGrades,
  studentSupportTickets,
  studentTimetable,
} from "@/data";

export default function LearnDashboardPage() {
  const activeCourses = demoStudentCourses.filter((course) => course.progress < 100);
  const certificates = demoStudentCourses.filter((course) => course.certificateCode);
  const nextCourse = activeCourses[0];
  const nextLesson = nextCourse ? getRecommendedLesson(nextCourse) : null;

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          label="Active courses"
          value={String(learnerDashboardSnapshot.activeCourses)}
          detail="Current courses with active lessons and assessment windows."
          icon={<BookOpenText className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Average progress"
          value={`${learnerDashboardSnapshot.averageProgress}%`}
          detail="Course completion progress across your current learning load."
          icon={<GraduationCap className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Assignments open"
          value={String(learnerDashboardSnapshot.outstandingAssignments)}
          detail="Assignments or practical tasks awaiting submission or review."
          icon={<CalendarClock className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Certificates"
          value={String(learnerDashboardSnapshot.availableCertificates)}
          detail="Issued completion records available in your account."
          icon={<FileBadge2 className="h-5 w-5 text-[var(--color-ink)]" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Welcome back
            </p>
            <h1 className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">
              {learnerProfile.name}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
              Continue with{" "}
              <span className="font-semibold text-[var(--color-ink)]">
                {nextLesson?.title ?? "your current module"}
              </span>{" "}
              and stay ahead of this week&apos;s deadlines.
            </p>

            {nextCourse && nextLesson ? (
              <div className="mt-8 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                      Continue learning
                    </p>
                    <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
                      {nextCourse.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{nextLesson.title}</p>
                  </div>
                  <StatusBadge value={`${nextCourse.progress}% complete`} tone="success" />
                </div>
                <div className="mt-5">
                  <ProgressBar value={nextCourse.progress} />
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href={`/learn/course/${nextCourse.slug}?lesson=${nextLesson.id}`}>
                      Resume lesson
                    </Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/learn/my-courses">View all courses</Link>
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="mt-8 grid gap-4">
              {demoStudentCourses.map((course) => {
                const recommendedLesson = getRecommendedLesson(course);

                return (
                  <Card key={course.slug} className="border-black/8 bg-white shadow-none">
                    <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <StatusBadge value={course.award} />
                          <StatusBadge
                            value={course.progress >= 100 ? "Completed" : course.delivery}
                            tone={course.progress >= 100 ? "success" : "neutral"}
                          />
                        </div>
                        <p className="font-heading mt-4 text-xl font-bold text-[var(--color-ink)]">
                          {course.title}
                        </p>
                        <p className="mt-2 text-sm text-[var(--color-muted)]">
                          Next lesson: {recommendedLesson.title}
                        </p>
                        <div className="mt-4">
                          <ProgressBar value={course.progress} />
                        </div>
                      </div>
                      <div className="flex justify-start lg:justify-end">
                        <Button asChild variant="secondary">
                          <Link href={`/learn/course/${course.slug}?lesson=${recommendedLesson.id}`}>
                            {course.progress >= 100 ? "Review course" : "Continue learning"}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5" />
                <h2 className="font-heading text-2xl font-bold">Announcements</h2>
              </div>
              <div className="mt-5 grid gap-3">
                {studentAnnouncements.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/80"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <CircleHelp className="h-5 w-5 text-[var(--color-ink)]" />
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  Support and access
                </h2>
              </div>
              <div className="mt-5 grid gap-3">
                {learnerHelpChannels.map((channel) => (
                  <div
                    key={channel.title}
                    className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                  >
                    <p className="font-semibold text-[var(--color-ink)]">{channel.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      {channel.detail}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <Card>
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Upcoming deadlines and timetable
            </h2>
            <div className="mt-5 grid gap-3">
              {studentDeadlines.map((deadline) => (
                <div
                  key={deadline}
                  className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm text-[var(--color-muted)]"
                >
                  {deadline}
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3">
              {studentTimetable.map((event) => (
                <div
                  key={event}
                  className="rounded-[22px] border border-[var(--color-border)] bg-white p-4 text-sm text-[var(--color-muted)]"
                >
                  {event}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Grades, certificates, and tickets
            </h2>
            <div className="mt-5 grid gap-3">
              {studentRecentGrades.map((grade) => (
                <div
                  key={grade.title}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-ink)]">{grade.title}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">{grade.score}</p>
                  </div>
                  <StatusBadge value={grade.status} tone="success" />
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              {studentSupportTickets.map((ticket) => (
                <div
                  key={ticket.title}
                  className="rounded-[22px] border border-[var(--color-border)] bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-[var(--color-ink)]">{ticket.title}</p>
                    <StatusBadge value={ticket.status} />
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {ticket.detail}
                  </p>
                </div>
              ))}
            </div>

            {certificates.length ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/learn/certificates">View certificates</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/learn/help">Get support</Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
