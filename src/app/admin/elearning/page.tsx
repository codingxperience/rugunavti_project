import { LayoutDashboard, ScrollText, ShieldCheck, Users2 } from "lucide-react";

import { MetricCard } from "@/components/platform/metric-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminElearningRecords } from "@/lib/platform/learning-records";

export const dynamic = "force-dynamic";

export default async function AdminElearningDashboardPage() {
  const records = await getAdminElearningRecords();

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          label="Active courses"
          value={String(records.snapshot.activeCourses)}
          detail="Published courses visible in the public catalog or learner workspace."
          icon={<LayoutDashboard className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Learners"
          value={String(records.snapshot.activeLearners)}
          detail="Learners currently active across online and blended delivery."
          icon={<Users2 className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Instructors"
          value={String(records.snapshot.instructors)}
          detail="Instructor accounts delivering or grading eLearning content."
          icon={<ShieldCheck className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Announcements"
          value={String(records.snapshot.announcements)}
          detail="Recent announcements in the eLearning product."
          icon={<ScrollText className="h-5 w-5 text-[var(--color-ink)]" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardContent>
            <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
              Platform operations
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
              This dashboard reads live Supabase/PostgreSQL data for eLearning operations:
              course publishing, learner enrollment, announcements, and audit activity.
            </p>
            <div className="mt-6 grid gap-3">
              {records.announcements.length ? (
                records.announcements.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-[var(--color-ink)]">{item.title}</p>
                      <StatusBadge value={item.status} tone={item.status === "PUBLISHED" ? "success" : "neutral"} />
                    </div>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      {item.scope.toLowerCase()} {item.course ? `• ${item.course.title}` : ""}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)]">
                  No announcements have been published yet. Use the announcements API or admin
                  content screen to create the first platform or course notice.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--color-ink)] text-white">
          <CardContent>
            <h2 className="font-heading text-2xl font-bold">Recent audit activity</h2>
            <div className="mt-5 grid gap-3">
              {records.auditLogs.length ? (
                records.auditLogs.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/80"
                  >
                    <p>{item.summary}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/45">
                      {item.action} • {item.entityType}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/80">
                  Audit log entries will appear here as admins, instructors, and learners use the
                  platform.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
