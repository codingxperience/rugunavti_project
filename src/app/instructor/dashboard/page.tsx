import { FolderKanban, Megaphone, MessageSquare, PenTool } from "lucide-react";

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

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          label="Assigned courses"
          value={String(courseRecords.courses.length)}
          detail="Courses currently available for lesson publishing and review."
          icon={<FolderKanban className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Submission queue"
          value={String(pendingSubmissions)}
          detail="Submissions that still need grading, feedback, or release."
          icon={<PenTool className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Announcements"
          value={String(announcements.announcements.length)}
          detail="Teaching notices and learner reminders in the platform."
          icon={<Megaphone className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Discussion follow-up"
          value="Live"
          detail="Course discussions are stored against lessons and course workspaces."
          icon={<MessageSquare className="h-5 w-5 text-[var(--color-ink)]" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardContent>
            <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
              Course delivery overview
            </h1>
            <div className="mt-6 grid gap-4">
              {courseRecords.courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                      {course.title}
                    </p>
                    <StatusBadge value={course.status} tone={course.status === "PUBLISHED" ? "success" : "warning"} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {course.deliveryMode.replace(/_/g, " ")} delivery - {course.enrollmentCount} learners - {course.moduleCount} modules
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <h2 className="font-heading text-2xl font-bold">Teaching focus</h2>
              <div className="mt-5 grid gap-3">
                {submissions.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/80"
                  >
                    {item.learnerName} - {item.taskTitle} - {item.status}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Recent announcements
              </h2>
              <div className="mt-5 grid gap-3">
                {announcements.announcements.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]"
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
