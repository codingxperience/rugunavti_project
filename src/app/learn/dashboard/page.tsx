import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpenText,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileBadge2,
  MessageSquareText,
} from "lucide-react";

import { MetricCard } from "@/components/platform/metric-card";
import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resolveDisplayName } from "@/lib/platform/display-name";
import {
  getLearnerWorkspaceRecords,
  type LearnerCourseRecord,
} from "@/lib/platform/learning-records";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

const courseImageFallbacks = [
  "/brand/hero_illustration.jpg",
  "/brand/home_illustration.jpg",
  "/brand/hero-illustration.jpg",
];

function courseImage(course: LearnerCourseRecord, index: number) {
  return course.thumbnailUrl || courseImageFallbacks[index % courseImageFallbacks.length];
}

function courseCode(title: string) {
  return title
    .split(/\s+/)
    .filter((part) => part.length > 2)
    .slice(0, 2)
    .map((part) => part.slice(0, 3).toUpperCase())
    .join("");
}

function courseHref(course: LearnerCourseRecord) {
  return course.nextLesson
    ? `/learn/course/${course.slug}?lesson=${course.nextLesson.id}`
    : `/learn/course/${course.slug}`;
}

export default async function LearnDashboardPage() {
  const session = await requireRole(["student", "super_admin"], "/learn/dashboard");
  const workspace = await getLearnerWorkspaceRecords(session);
  const displayName = resolveDisplayName({
    firstName: workspace.user.profile?.firstName,
    lastName: workspace.user.profile?.lastName,
    email: workspace.user.email,
    fallback: "Learner",
  });
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          <MetricCard
            label="Courses"
            value={String(workspace.snapshot.activeCourses)}
            detail="Active course enrollments in this learning account."
            icon={<BookOpenText className="h-5 w-5 text-[var(--color-ink)]" />}
          />
          <MetricCard
            label="Progress"
            value={`${workspace.snapshot.averageProgress}%`}
            detail="Average completion across enrolled courses."
            icon={<CheckCircle2 className="h-5 w-5 text-[var(--color-ink)]" />}
          />
          <MetricCard
            label="Tasks"
            value={String(workspace.snapshot.outstandingAssignments)}
            detail="Assignments and quizzes that still need attention."
            icon={<ClipboardList className="h-5 w-5 text-[var(--color-ink)]" />}
          />
          <MetricCard
            label="Certificates"
            value={String(workspace.snapshot.availableCertificates)}
            detail="Completion records currently available to this learner."
            icon={<FileBadge2 className="h-5 w-5 text-[var(--color-ink)]" />}
          />
        </section>

        <div className="rounded-[28px] border border-black/8 bg-[#fff4ad] px-5 py-4 shadow-[0_18px_50px_-42px_rgba(17,17,17,0.55)]">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[var(--color-ink)]">
              i
            </span>
            <div>
              <p className="font-semibold text-[var(--color-ink)]">
                Welcome{displayName ? `, ${displayName}` : ""}.
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-ink)]/72">
                Your enrolled Ruguna courses appear here. Open a course card to view announcements,
                modules, syllabus, grades, people, and materials.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <h1 className="font-heading text-5xl font-bold tracking-[-0.05em] text-[var(--color-ink)]">
              Dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Course cards are generated from your live enrollments.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/elearning/courses">Browse courses</Link>
          </Button>
        </div>

        {workspace.records.length ? (
          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {workspace.records.map((course, index) => (
              <Link
                key={course.enrollmentId}
                href={courseHref(course)}
                className="group overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_24px_80px_-62px_rgba(17,17,17,0.65)] transition hover:-translate-y-1 hover:shadow-[0_34px_90px_-58px_rgba(17,17,17,0.72)]"
              >
                <div
                  className="relative min-h-36 bg-cover bg-center p-5 text-white"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(17,17,17,0.82), rgba(17,17,17,0.2)), url(${courseImage(course, index)})`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-white/16 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                      {courseCode(course.title)}
                    </span>
                    <span className="rounded-full bg-[#fde047] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111]">
                      {course.delivery}
                    </span>
                  </div>
                  <h2 className="font-heading mt-10 max-w-[18rem] text-2xl font-bold leading-tight">
                    {course.title}
                  </h2>
                </div>

                <div className="grid gap-4 p-5">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{course.school}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                      {course.completedLessons}/{course.lessonCount} lessons complete
                    </p>
                  </div>
                  <ProgressBar value={course.progress} />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <StatusBadge
                      value={course.progress >= 100 ? "Completed" : `${course.progress}% complete`}
                      tone={course.progress >= 100 ? "success" : "neutral"}
                    />
                    <span className="text-sm font-bold text-[var(--color-ink)] transition group-hover:translate-x-0.5">
                      {course.progress >= 100 ? "Review course" : "Open course"}
                    </span>
                  </div>
                  {course.nextLesson ? (
                    <p className="text-sm leading-6 text-[var(--color-muted)]">
                      Next: {course.nextLesson.title}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent>
              <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                No enrolled courses yet
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Short courses can be started online. Academic programme courses appear after
                admissions or admin course placement.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/elearning/courses?level=Short%20Course">Start a short course</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/apply">Apply for a programme</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      <aside className="grid gap-4 xl:sticky xl:top-6 xl:self-start">
        <Card>
          <CardContent>
            <h2 className="font-heading text-xl font-bold text-[var(--color-ink)]">To Do</h2>
            <div className="mt-4 grid gap-3">
              {workspace.records.some((course) => course.pendingAssignments > 0) ? (
                workspace.records
                  .filter((course) => course.pendingAssignments > 0)
                  .slice(0, 4)
                  .map((course) => (
                    <Link
                      key={course.enrollmentId}
                      href={`/learn/course/${course.slug}?view=grades`}
                      className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 transition hover:-translate-y-0.5 hover:bg-white"
                    >
                      <p className="text-sm font-semibold text-[var(--color-ink)]">{course.title}</p>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {course.pendingAssignments} task(s) need attention
                      </p>
                    </Link>
                  ))
              ) : (
                <p className="text-sm leading-7 text-[var(--color-muted)]">Nothing for now.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-heading text-xl font-bold text-[var(--color-ink)]">
              Course shortcuts
            </h2>
            <div className="mt-4 grid gap-2">
              <Shortcut href="/learn/my-courses" icon={<BookOpenText className="h-4 w-4" />} label="Courses" />
              <Shortcut href="/learn/calendar" icon={<CalendarClock className="h-4 w-4" />} label="Calendar" />
              <Shortcut href="/learn/certificates" icon={<FileBadge2 className="h-4 w-4" />} label="Certificates" />
              <Shortcut href="/learn/help" icon={<MessageSquareText className="h-4 w-4" />} label="Help" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-heading text-xl font-bold text-[var(--color-ink)]">
              Recent notices
            </h2>
            <div className="mt-4 grid gap-3">
              {workspace.announcements.length ? (
                workspace.announcements.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                  >
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{item.title}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">
                      {item.body}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-[var(--color-muted)]">No announcements yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function Shortcut({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-white"
    >
      <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110">
        {icon}
      </span>
      {label}
    </Link>
  );
}
