"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useSyncExternalStore } from "react";

import { StatusBadge } from "@/components/platform/status-badge";
import type { LearnerApplicationRecord } from "@/lib/platform/learning-records";

const NOTICE_DISMISS_MS = 10 * 60 * 1000;
const NOTICE_STORAGE_EVENT = "ruguna-application-notice-change";

type ApplicationStatusNoticeProps = {
  applications: LearnerApplicationRecord[];
  email: string;
};

function applicationStatusTone(status: string): "neutral" | "success" | "warning" | "danger" {
  if (status === "OFFERED") return "success";
  if (status === "REJECTED" || status === "WITHDRAWN") return "danger";
  if (status === "IN_REVIEW" || status === "DOCUMENTS_REQUIRED") return "warning";
  return "neutral";
}

function getDismissedSnapshot(storageKey: string) {
  if (typeof window === "undefined") {
    return false;
  }

  const dismissedUntil = Number(window.localStorage.getItem(storageKey) ?? 0);
  return Number.isFinite(dismissedUntil) && dismissedUntil > Date.now();
}

function subscribeToDismissedNotice(storageKey: string, onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => onStoreChange();
  const dismissedUntil = Number(window.localStorage.getItem(storageKey) ?? 0);
  const delay = dismissedUntil - Date.now();
  const timeout =
    Number.isFinite(dismissedUntil) && delay > 0
      ? window.setTimeout(() => {
          window.localStorage.removeItem(storageKey);
          onStoreChange();
        }, delay)
      : null;

  window.addEventListener("storage", handleChange);
  window.addEventListener(NOTICE_STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(NOTICE_STORAGE_EVENT, handleChange);

    if (timeout) {
      window.clearTimeout(timeout);
    }
  };
}

export function ApplicationStatusNotice({
  applications,
  email,
}: ApplicationStatusNoticeProps) {
  const visibleApplications = applications.slice(0, 2);
  const storageKey = `ruguna-application-notice:${email}:${visibleApplications.map((item) => item.reference).join(":")}`;
  const dismissed = useSyncExternalStore(
    (onStoreChange) => subscribeToDismissedNotice(storageKey, onStoreChange),
    () => getDismissedSnapshot(storageKey),
    () => false
  );

  if (!visibleApplications.length || dismissed) {
    return null;
  }

  const primaryApplication = visibleApplications[0];

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/55 p-4 shadow-[0_28px_90px_-60px_rgba(17,17,17,0.62)] ring-1 ring-black/5 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(253,224,71,0.34),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.84),rgba(255,255,255,0.34))]" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Admissions
            </p>
            <h2 className="font-heading mt-1 text-xl font-bold text-[var(--color-ink)]">
              Application update
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
              {primaryApplication.program}
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss application notice"
            onClick={() => {
              window.localStorage.setItem(storageKey, String(Date.now() + NOTICE_DISMISS_MS));
              window.dispatchEvent(new Event(NOTICE_STORAGE_EVENT));
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/75 text-[var(--color-muted)] shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-ink)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-2">
          {visibleApplications.map((application) => (
            <div
              key={application.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-white/70 bg-white/62 px-4 py-3 shadow-sm backdrop-blur-xl"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  {application.reference} - {application.intake}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                  {application.program}
                </p>
              </div>
              <StatusBadge
                value={application.status}
                tone={applicationStatusTone(application.statusValue)}
              />
            </div>
          ))}
        </div>

        <Link
          href={`/apply/status?reference=${encodeURIComponent(primaryApplication.reference)}&email=${encodeURIComponent(email)}`}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-[#d4b800] bg-[#fde047] px-4 py-2 text-sm font-bold text-[#111111] shadow-[0_18px_38px_-28px_rgba(17,17,17,0.45)] transition hover:-translate-y-0.5 hover:bg-[#f8d92d]"
        >
          Track application
        </Link>
      </div>
    </section>
  );
}
