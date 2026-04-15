import { FolderKanban, Megaphone, MessageSquare, PenTool } from "lucide-react";

import { MetricCard } from "@/components/platform/metric-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  instructorAnnouncementDrafts,
  instructorBuilderCourses,
  instructorSubmissions,
} from "@/data";

export default function InstructorDashboardPage() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          label="Assigned courses"
          value={String(instructorBuilderCourses.length)}
          detail="Courses currently owned for lesson publishing and review."
          icon={<FolderKanban className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Submission queue"
          value={String(instructorSubmissions.length)}
          detail="Submissions that still need grading, feedback, or release."
          icon={<PenTool className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Announcements"
          value={String(instructorAnnouncementDrafts.length)}
          detail="Draft teaching notices and learner reminders."
          icon={<Megaphone className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Discussion follow-up"
          value="3"
          detail="Learner questions that still need an instructor reply."
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
              {instructorBuilderCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                      {course.title}
                    </p>
                    <StatusBadge value={course.publishState} tone="success" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {course.mode} delivery • {course.learners} learners • {course.modules.length} modules
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
                {instructorSubmissions.map((item) => (
                  <div
                    key={`${item.learner}-${item.task}`}
                    className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/80"
                  >
                    {item.learner} • {item.task} • {item.status}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Announcement drafts
              </h2>
              <div className="mt-5 grid gap-3">
                {instructorAnnouncementDrafts.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]"
                  >
                    {item}
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
