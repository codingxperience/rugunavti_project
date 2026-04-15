import { LayoutDashboard, ScrollText, ShieldCheck, Users2 } from "lucide-react";

import { MetricCard } from "@/components/platform/metric-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  adminAuditLog,
  adminElearningAnnouncements,
  adminElearningDashboard,
} from "@/data";

export default function AdminElearningDashboardPage() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="Active courses" value={String(adminElearningDashboard.activeCourses)} detail="Courses currently visible in the public catalog or learner workspace." icon={<LayoutDashboard className="h-5 w-5 text-[var(--color-ink)]" />} />
        <MetricCard label="Learners" value={String(adminElearningDashboard.activeLearners)} detail="Learners currently active across online and blended delivery." icon={<Users2 className="h-5 w-5 text-[var(--color-ink)]" />} />
        <MetricCard label="Instructors" value={String(adminElearningDashboard.instructors)} detail="Instructor accounts delivering or grading eLearning content." icon={<ShieldCheck className="h-5 w-5 text-[var(--color-ink)]" />} />
        <MetricCard label="Announcements" value={String(adminElearningDashboard.announcements)} detail="Live or scheduled announcements in the eLearning product." icon={<ScrollText className="h-5 w-5 text-[var(--color-ink)]" />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardContent>
            <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
              Platform operations
            </h1>
            <div className="mt-6 grid gap-3">
              {adminElearningAnnouncements.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                >
                  <p className="font-semibold text-[var(--color-ink)]">{item.title}</p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {item.audience} • {item.status}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--color-ink)] text-white">
          <CardContent>
            <h2 className="font-heading text-2xl font-bold">Recent audit activity</h2>
            <div className="mt-5 grid gap-3">
              {adminAuditLog.map((item) => (
                <div key={item} className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/80">
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
