import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  LayoutDashboard,
  ScrollText,
  ShieldCheck,
  Users2,
} from "lucide-react";

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
          detail="Published courses available to learners."
          icon={<LayoutDashboard className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Learners"
          value={String(records.snapshot.activeLearners)}
          detail="Active and completed learner enrollments."
          icon={<Users2 className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Instructors"
          value={String(records.snapshot.instructors)}
          detail="Instructor accounts with teaching access."
          icon={<ShieldCheck className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Announcements"
          value={String(records.snapshot.announcements)}
          detail="Recent platform and course notices."
          icon={<ScrollText className="h-5 w-5 text-[var(--color-ink)]" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardContent>
            <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
              Operations overview
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
              Live course publishing, learner activity, staff roles, and announcements from the
              Ruguna eLearning database.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: "Manage courses",
                  text: "Create, assign, and publish eLearning courses.",
                  href: "/admin/elearning/courses",
                  icon: BookOpenText,
                },
                {
                  title: "Manage users",
                  text: "Assign learner, instructor, and admin roles.",
                  href: "/admin/elearning/users",
                  icon: Users2,
                },
                {
                  title: "Announcements",
                  text: "Publish notices for learners and courses.",
                  href: "/admin/elearning/announcements",
                  icon: ScrollText,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 transition hover:-translate-y-1 hover:bg-white"
                  >
                    <Icon className="h-5 w-5 text-[var(--color-ink)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
                    <p className="mt-4 font-semibold text-[var(--color-ink)]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                      {item.text}
                    </p>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-ink)]">
                      Open <ArrowRight className="h-4 w-4" />
                    </p>
                  </Link>
                );
              })}
            </div>

            <h2 className="font-heading mt-8 text-2xl font-bold text-[var(--color-ink)]">
              Recent notices
            </h2>
            <div className="mt-4 grid gap-3">
              {records.announcements.length ? (
                records.announcements.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-[var(--color-border)] bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-[var(--color-ink)]">{item.title}</p>
                      <StatusBadge
                        value={item.status}
                        tone={item.status === "PUBLISHED" ? "success" : "neutral"}
                      />
                    </div>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      {item.scope.toLowerCase()} {item.course ? `- ${item.course.title}` : ""}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)]">
                  No announcements have been published yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--color-ink)] text-white">
          <CardContent>
            <h2 className="font-heading text-2xl font-bold">Recent activity</h2>
            <div className="mt-5 grid gap-3">
              {records.auditLogs.length ? (
                records.auditLogs.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-6 text-white/80"
                  >
                    <p>{item.summary}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/45">
                      {item.action} - {item.entityType}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/80">
                  Admin, instructor, and learner activity will appear here.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
