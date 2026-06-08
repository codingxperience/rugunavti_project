"use client";

import { type FormEvent, useId, useState } from "react";
import { CheckCircle2, Clock3, Loader2, Search, ShieldCheck } from "lucide-react";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ApplicationStatusValue =
  | "SUBMITTED"
  | "IN_REVIEW"
  | "DOCUMENTS_REQUIRED"
  | "OFFERED"
  | "WAITLISTED"
  | "REJECTED"
  | "WITHDRAWN";

type LookupResult = {
  reference: string;
  status: string;
  statusValue: ApplicationStatusValue;
  programTitle: string;
  intakeTitle: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  updatedAt: string;
};

type LookupResponse = {
  success: boolean;
  found?: boolean;
  message?: string;
  application?: LookupResult;
};

const orderedStatuses: ApplicationStatusValue[] = [
  "SUBMITTED",
  "IN_REVIEW",
  "DOCUMENTS_REQUIRED",
  "OFFERED",
  "WAITLISTED",
  "REJECTED",
  "WITHDRAWN",
];

function statusLabel(status: ApplicationStatusValue | string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusTone(status: ApplicationStatusValue) {
  if (status === "OFFERED") return "success";
  if (status === "REJECTED" || status === "WITHDRAWN") return "danger";
  if (status === "IN_REVIEW" || status === "DOCUMENTS_REQUIRED") return "warning";
  return "neutral";
}

function stepState(current: ApplicationStatusValue, step: ApplicationStatusValue) {
  if (current === "REJECTED" || current === "WITHDRAWN") {
    return current === step ? "current" : "pending";
  }

  if (current === "WAITLISTED") {
    return step === "WAITLISTED" ? "current" : "pending";
  }

  const linearSteps: ApplicationStatusValue[] = [
    "SUBMITTED",
    "IN_REVIEW",
    "DOCUMENTS_REQUIRED",
    "OFFERED",
  ];
  const currentIndex = linearSteps.indexOf(current);
  const stepIndex = linearSteps.indexOf(step);

  if (stepIndex === -1 || currentIndex === -1) return "pending";
  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "current";
  return "pending";
}

function stepDescription(status: ApplicationStatusValue) {
  if (status === "DOCUMENTS_REQUIRED") {
    return "Admissions may ask for extra documents before a decision.";
  }

  if (status === "OFFERED") {
    return "Your offer is ready for the next admissions step.";
  }

  if (status === "WAITLISTED") {
    return "Admissions will contact you if space opens.";
  }

  if (status === "REJECTED") {
    return "Admissions could not approve this application.";
  }

  if (status === "WITHDRAWN") {
    return "This application was withdrawn.";
  }

  return "Admissions progress update.";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function ApplicationStatusLookup() {
  const referenceId = useId();
  const emailId = useId();
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [lookupState, setLookupState] = useState<"idle" | "checking" | "found" | "not-found" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [application, setApplication] = useState<LookupResult | null>(null);
  const isChecking = lookupState === "checking";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isChecking) {
      return;
    }

    setLookupState("checking");
    setMessage(null);
    setApplication(null);

    try {
      const response = await fetch("/api/applications/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, email }),
      });
      const payload = (await response.json()) as LookupResponse;

      if (!response.ok || !payload.success) {
        setLookupState("error");
        setMessage(payload.message ?? "Application status could not be checked. Please try again.");
        return;
      }

      if (!payload.found || !payload.application) {
        setLookupState("not-found");
        setMessage(
          payload.message ??
            "No matching application was found. Check the reference and email exactly as submitted."
        );
        return;
      }

      setApplication(payload.application);
      setLookupState("found");
      setMessage(null);
    } catch {
      setLookupState("error");
      setMessage("Application status could not be checked. Please confirm your connection and try again.");
    }
  }

  return (
    <div className="mt-7">
      <form
        onSubmit={handleSubmit}
        aria-busy={isChecking}
        className="grid gap-3 rounded-[28px] border border-black/8 bg-[#fbfbf7] p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
      >
        <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]" htmlFor={referenceId}>
          Application reference
          <input
            id={referenceId}
            name="reference"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="RUG-APP-2026-000000"
            autoComplete="off"
            className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm font-normal text-[var(--color-ink)] outline-none transition focus:border-[var(--color-ink)] focus:ring-4 focus:ring-black/5"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]" htmlFor={emailId}>
          Applicant email
          <input
            id={emailId}
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            type="email"
            autoComplete="email"
            className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm font-normal text-[var(--color-ink)] outline-none transition focus:border-[var(--color-ink)] focus:ring-4 focus:ring-black/5"
            required
          />
        </label>
        <Button
          type="submit"
          disabled={isChecking}
          className={cn(
            "h-12 self-end px-5",
            isChecking &&
              "bg-[var(--color-ink)] text-white shadow-[0_18px_46px_-30px_rgba(17,17,17,0.78)] disabled:opacity-100"
          )}
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking status
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Check status
            </>
          )}
        </Button>
      </form>

      <div aria-live="polite" className="mt-6 grid gap-5">
        {isChecking ? (
          <div
            role="status"
            className="flex items-start gap-4 rounded-[24px] border border-[#d4b800]/55 bg-[#fff7c2] p-4 shadow-[0_20px_55px_-46px_rgba(17,17,17,0.62)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-white">
              <Loader2 className="h-5 w-5 animate-spin" />
            </span>
            <span>
              <span className="block font-heading text-xl font-bold text-[var(--color-ink)]">
                Checking application
              </span>
              <span className="mt-1 block text-sm leading-6 text-[var(--color-muted)]">
                Matching the reference with admissions records. Keep this page open.
              </span>
            </span>
          </div>
        ) : null}

        {message && !isChecking ? (
          <div
            className={cn(
              "rounded-[26px] border p-5",
              lookupState === "not-found"
                ? "border-amber-200 bg-amber-50 text-amber-950"
                : "border-rose-200 bg-rose-50 text-rose-950"
            )}
          >
            <h2 className="font-heading text-2xl font-bold">
              {lookupState === "not-found" ? "No matching application found" : "Status check unavailable"}
            </h2>
            <p className="mt-2 text-sm leading-7">{message}</p>
          </div>
        ) : null}

        {application ? (
          <div className="grid gap-6">
            <div className="rounded-[30px] border border-black/8 bg-white p-5 shadow-[0_18px_60px_-52px_rgba(17,17,17,0.58)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {application.reference}
                  </p>
                  <h2 className="font-heading mt-2 text-3xl font-bold text-[var(--color-ink)]">
                    {application.programTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    {application.intakeTitle}
                  </p>
                </div>
                <StatusBadge value={application.status} tone={statusTone(application.statusValue)} />
              </div>

              <div className="mt-5 grid gap-3 border-t border-black/8 pt-4 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    Submitted
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                    {formatDate(application.submittedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    Last update
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                    {formatDate(application.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    Reviewed
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                    {formatDate(application.reviewedAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {orderedStatuses.map((status) => {
                const state = stepState(application.statusValue, status);

                return (
                  <div
                    key={status}
                    className={cn(
                      "flex items-center gap-4 rounded-[24px] border p-4",
                      state === "current"
                        ? "border-[#d4b800] bg-[#fff7c2]"
                        : state === "done"
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-black/8 bg-[#fbfbf7]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                        state === "current"
                          ? "bg-[var(--color-ink)] text-white"
                          : state === "done"
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-[var(--color-muted)]"
                      )}
                    >
                      {state === "done" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : state === "current" ? (
                        <Clock3 className="h-4 w-4" />
                      ) : (
                        <ShieldCheck className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <p className="font-semibold text-[var(--color-ink)]">{statusLabel(status)}</p>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">{stepDescription(status)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
