import Link from "next/link";
import { ArrowRight, FileCheck2, GraduationCap, ScrollText, UserRoundCheck } from "lucide-react";

import { MetricCard } from "@/components/platform/metric-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRegistrarWorkspaceRecords } from "@/lib/platform/registrar-records";

export const dynamic = "force-dynamic";

const flowColumns = [
  { key: "SUBMITTED", label: "Submitted" },
  { key: "IN REVIEW", label: "In review" },
  { key: "DOCUMENTS REQUIRED", label: "Documents" },
  { key: "OFFERED", label: "Offered" },
  { key: "WAITLISTED", label: "Waitlisted" },
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-UG", {
    day: "2-digit",
    month: "short",
    timeZone: "Africa/Kampala",
  }).format(new Date(value));
}

export default async function RegistrarDashboardPage() {
  const records = await getRegistrarWorkspaceRecords();
  const priorityApplications = records.applications
    .filter((application) =>
      ["SUBMITTED", "IN REVIEW", "DOCUMENTS REQUIRED", "WAITLISTED"].includes(
        application.status.toUpperCase()
      )
    )
    .slice(0, 6);

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          label="Applications"
          value={String(records.snapshot.applications)}
          detail={`${records.snapshot.pendingApplications} awaiting admissions action.`}
          icon={<FileCheck2 className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Offers"
          value={String(records.snapshot.offers)}
          detail="Applicants marked as offered."
          icon={<UserRoundCheck className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Learners"
          value={String(records.snapshot.activeLearners)}
          detail="Active programme records."
          icon={<GraduationCap className="h-5 w-5 text-[var(--color-ink)]" />}
        />
        <MetricCard
          label="Certificates"
          value={String(records.snapshot.issuedCertificates)}
          detail="Issued completion records."
          icon={<ScrollText className="h-5 w-5 text-[var(--color-ink)]" />}
        />
      </section>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
              Admissions desk
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
              Review submitted applications, update admissions decisions, and activate approved learner records.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/registrar/applications">
              View all applications
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Application flow
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                A compact queue for admissions work. Detailed review stays on the applications page.
              </p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link href="/registrar/applications">Manage applications</Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {flowColumns.map((column) => {
              const count = records.applications.filter(
                (application) => application.status.toUpperCase() === column.key
              ).length;

              return (
                <div
                  key={column.key}
                  className="rounded-[24px] border border-black/8 bg-[#fbfbf7] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    {column.label}
                  </p>
                  <p className="font-heading mt-2 text-3xl font-bold text-[var(--color-ink)]">
                    {count}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3">
            {priorityApplications.length ? (
              priorityApplications.map((application) => (
                <Link
                  key={application.id}
                  href="/registrar/applications"
                  className="grid gap-3 rounded-[24px] border border-black/8 bg-white p-4 transition hover:-translate-y-0.5 hover:bg-[#fbfbf7] md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      {application.reference} · {formatDate(application.submittedAt)}
                    </p>
                    <p className="mt-1 truncate font-heading text-xl font-bold text-[var(--color-ink)]">
                      {application.applicant}
                    </p>
                    <p className="mt-1 truncate text-sm text-[var(--color-muted)]">
                      {application.program}
                    </p>
                  </div>
                  <StatusBadge value={application.status} tone="warning" />
                </Link>
              ))
            ) : (
              <div className="rounded-[24px] border border-black/8 bg-[#fbfbf7] p-5">
                <p className="font-semibold text-[var(--color-ink)]">No priority applications.</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  New submissions and document follow-ups will appear here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Recent learner records
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Programme records activated from admissions review.
              </p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link href="/registrar/learners">Open learners</Link>
            </Button>
          </div>
          <div className="mt-5 grid gap-3">
            {records.learners.slice(0, 6).map((learner) => (
              <div
                key={learner.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/6 bg-[#fbfbf7] p-4"
              >
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">{learner.learner}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {learner.program} | {learner.intake}
                  </p>
                </div>
                <StatusBadge value={learner.status} tone={learner.status === "Active" ? "success" : "neutral"} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
