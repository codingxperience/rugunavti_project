import Link from "next/link";
import { ArrowRight, FolderKanban, Megaphone, PenTool, Users2 } from "lucide-react";

import { MetricCard } from "@/components/platform/metric-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getStaffAnnouncementRecords,
  getStaffCourseManagementRecords,
  getStaffSubmissions,
} from "@/lib/platform/staff-records";

export const dynamic = "force-dynamic";

export default async function InstructorDashboardPage() {
  const [courseRecords, submissions, announcements] = await Promise.all([
    getStaffCourseManagementRecords(),
    getStaffSubmissions(),
    getStaffAnnouncementRecords(),
  ]);
  const pendingSubmissions = submissions.filter((item) => item.status !== "GRADED").length;
  const learnerCount = courseRecords.courses.reduce(
    (count, course) => count + course.enrollmentCount,
    0
  );

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          label="Assigned courses"
          value={String(courseRecords.courses.length)}
          detail="Courses available for teaching, lesson updates, and publishing."
          icon={<FolderKanban className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Learners"
          value={String(learnerCount)}
          detail="Learners enrolled across your assigned courses."
          icon={<Users2 className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="To grade"
          value={String(pendingSubmissions)}
          detail="Submissions still waiting for feedback or scores."
          icon={<PenTool className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Announcements"
          value={String(announcements.announcements.length)}
          detail="Course notices and learner reminders."
          icon={<Megaphone className="h-5 w-5 text-[var(--color-ink)]" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                  Course delivery
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                  Assigned courses, learner counts, modules, and publishing status from the live
                  eLearning database.
                </p>
              </div>
              <Link
                href="/instructor/courses"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--color-soft-accent)]"
              >
                Manage courses <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {courseRecords.courses.length ? (
                courseRecords.courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/instructor/course/${course.id}/builder`}
                    className="group rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 transition hover:-translate-y-1 hover:bg-white"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                        {course.title}
                      </p>
                      <StatusBadge
                        value={course.status}
                        tone={course.status === "PUBLISHED" ? "success" : "warning"}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {course.deliveryMode.replace(/_/g, " ")} delivery - {course.enrollmentCount}{" "}
                      learners - {course.moduleCount} modules - {course.lessonCount} lessons
                    </p>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-ink)]">
                      Open builder{" "}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)]">
                  No courses are assigned yet. Ask an admin to assign you to a course from course
                  management.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <h2 className="font-heading text-2xl font-bold">Grading queue</h2>
              <div className="mt-5 grid gap-3">
                {submissions.length ? (
                  submissions.slice(0, 5).map((item) => (
                    <Link
                      key={item.id}
                      href="/instructor/submissions"
                      className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-6 text-white/80 transition hover:bg-white/10"
                    >
                      <p>{item.learnerName}</p>
                      <p className="mt-1 font-semibold text-white">{item.taskTitle}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/45">
                        {item.status}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/80">
                    No submissions are waiting for review.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Recent announcements
              </h2>
              <div className="mt-5 grid gap-3">
                {announcements.announcements.length ? (
                  announcements.announcements.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]"
                    >
                      {item.title}
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]">
                    No announcements have been posted yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
