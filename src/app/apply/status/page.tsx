import Link from "next/link";
import { ApplicationStatus } from "@prisma/client";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDb } from "@/lib/db";
import { hasDatabase, platformEnv } from "@/lib/platform/env";

export const dynamic = "force-dynamic";

const orderedStatuses = [
  ApplicationStatus.SUBMITTED,
  ApplicationStatus.IN_REVIEW,
  ApplicationStatus.DOCUMENTS_REQUIRED,
  ApplicationStatus.OFFERED,
  ApplicationStatus.WAITLISTED,
  ApplicationStatus.REJECTED,
  ApplicationStatus.WITHDRAWN,
] as const;

function statusLabel(status: ApplicationStatus | string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusTone(status: ApplicationStatus) {
  if (status === ApplicationStatus.OFFERED) return "success";
  if (status === ApplicationStatus.REJECTED || status === ApplicationStatus.WITHDRAWN) return "danger";
  if (status === ApplicationStatus.IN_REVIEW || status === ApplicationStatus.DOCUMENTS_REQUIRED) return "warning";
  return "neutral";
}

function stepState(current: ApplicationStatus, step: ApplicationStatus) {
  if (current === ApplicationStatus.REJECTED || current === ApplicationStatus.WITHDRAWN) {
    return current === step ? "current" : "pending";
  }

  if (current === ApplicationStatus.WAITLISTED) {
    return step === ApplicationStatus.WAITLISTED ? "current" : "pending";
  }

  const linearSteps: ApplicationStatus[] = [
    ApplicationStatus.SUBMITTED,
    ApplicationStatus.IN_REVIEW,
    ApplicationStatus.DOCUMENTS_REQUIRED,
    ApplicationStatus.OFFERED,
  ];
  const currentIndex = linearSteps.indexOf(current);
  const stepIndex = linearSteps.indexOf(step);

  if (stepIndex === -1) return "pending";
  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "current";
  return "pending";
}

async function findApplication(reference?: string, email?: string) {
  if (!platformEnv.useDatabase || !hasDatabase || !reference || !email) {
    return null;
  }

  const db = getDb();

  return db.application.findFirst({
    where: {
      reference: reference.trim(),
      user: {
        email: email.trim().toLowerCase(),
      },
    },
    include: {
      user: { include: { profile: true } },
      program: true,
      intake: true,
    },
  });
}

export default async function ApplicationStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; email?: string }>;
}) {
  const params = await searchParams;
  const reference = params.reference?.trim() ?? "";
  const email = params.email?.trim() ?? "";
  const application = await findApplication(reference, email);

  return (
    <section className="section-padding pt-10 sm:pt-14">
      <div className="container-width grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardContent>
            <span className="eyebrow">Application status</span>
            <h1 className="font-heading mt-5 text-4xl font-bold text-[var(--color-ink)] sm:text-5xl">
              Track your Ruguna application
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Enter the email and reference used during application. Ruguna shows only matching records.
            </p>

            <form className="mt-7 grid gap-3 rounded-[28px] border border-black/8 bg-[#fbfbf7] p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
              <input
                name="reference"
                defaultValue={reference}
                placeholder="Application reference"
                className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none"
              />
              <input
                name="email"
                defaultValue={email}
                placeholder="Email address"
                type="email"
                className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none"
              />
              <Button type="submit">Check status</Button>
            </form>

            {reference && email && !application ? (
              <div className="mt-6 rounded-[26px] border border-amber-200 bg-amber-50 p-5">
                <h2 className="font-heading text-2xl font-bold text-amber-950">
                  No matching application found
                </h2>
                <p className="mt-2 text-sm leading-7 text-amber-900">
                  Check the reference and email exactly as submitted. If the details are correct,
                  contact admissions for help.
                </p>
              </div>
            ) : null}

            {application ? (
              <div className="mt-7 grid gap-6">
                <div className="rounded-[30px] border border-black/8 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        {application.reference}
                      </p>
                      <h2 className="font-heading mt-2 text-3xl font-bold text-[var(--color-ink)]">
                        {application.program.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                        {application.intake?.title ?? "Intake to be confirmed"}
                      </p>
                    </div>
                    <StatusBadge value={statusLabel(application.status)} tone={statusTone(application.status)} />
                  </div>
                </div>

                <div className="grid gap-3">
                  {orderedStatuses.map((status) => {
                    const state = stepState(application.status, status);

                    return (
                      <div
                        key={status}
                        className={`flex items-center gap-4 rounded-[24px] border p-4 ${
                          state === "current"
                            ? "border-[#e4c92e] bg-[#fff8cc]"
                            : state === "done"
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-black/8 bg-[#fbfbf7]"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                            state === "current"
                              ? "bg-[#fde047] text-[var(--color-ink)]"
                              : state === "done"
                                ? "bg-emerald-600 text-white"
                                : "bg-white text-[var(--color-muted)]"
                          }`}
                        >
                          {state === "done" ? "✓" : "•"}
                        </span>
                        <div>
                          <p className="font-semibold text-[var(--color-ink)]">{statusLabel(status)}</p>
                          <p className="mt-1 text-sm text-[var(--color-muted)]">
                            {status === ApplicationStatus.DOCUMENTS_REQUIRED
                              ? "Admissions may ask for extra documents before a decision."
                              : status === ApplicationStatus.OFFERED
                                ? "Your offer is ready for the next admissions step."
                                : status === ApplicationStatus.WAITLISTED
                                  ? "Admissions will contact you if space opens."
                                  : status === ApplicationStatus.REJECTED
                                    ? "Admissions could not approve this application."
                                    : status === ApplicationStatus.WITHDRAWN
                                      ? "This application was withdrawn."
                                      : "Admissions progress update."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <aside className="grid gap-4 self-start lg:sticky lg:top-28">
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <h2 className="font-heading text-2xl font-bold">What your reference does</h2>
              <p className="mt-3 text-sm leading-7 text-white/72">
                It identifies your application in admissions, email updates, document follow-up,
                and registrar decisions.
              </p>
              <div className="mt-5 grid gap-3">
                <Button asChild>
                  <Link href="/elearning/login">Sign in to eLearning</Link>
                </Button>
                <Button asChild variant="secondary" className="border-white/14 bg-white/8 text-white hover:bg-white/14 hover:text-white">
                  <Link href="/contact">Contact admissions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}
