"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const HOME_NOTICE_KEY = "ruguna-home-notice-dismissed-until";
const HOME_NOTICE_DISMISS_MS = 10 * 60 * 1000;

export function HomeAnnouncementNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedUntil = Number(window.localStorage.getItem(HOME_NOTICE_KEY) ?? 0);

    if (Number.isFinite(dismissedUntil) && dismissedUntil > Date.now()) {
      const timeout = window.setTimeout(() => {
        window.localStorage.removeItem(HOME_NOTICE_KEY);
        setVisible(true);
      }, dismissedUntil - Date.now());

      return () => window.clearTimeout(timeout);
    }

    window.localStorage.removeItem(HOME_NOTICE_KEY);
    setVisible(true);
    return undefined;
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <section className="fixed inset-x-4 top-24 z-50 mx-auto w-[min(680px,calc(100vw-2rem))] overflow-hidden rounded-[28px] border border-white/80 bg-white/68 shadow-[0_30px_90px_-58px_rgba(17,17,17,0.68)] ring-1 ring-black/5 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(253,224,71,0.32),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(255,255,255,0.46))]" />
      <div className="relative grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Ruguna College
          </p>
          <h2 className="font-heading mt-1 text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Practical Skills for Work and Enterprise
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-muted)]">
            Apply online, compare programmes, or start with eLearning short courses.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Link
            href="/apply"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#fde047] px-4 text-sm font-bold text-[#111111] transition hover:-translate-y-0.5 hover:bg-[#f8d92d]"
          >
            Apply
          </Link>
          <Link
            href="/elearning/courses"
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/8 bg-white/72 px-4 text-sm font-bold text-[#111111] transition hover:-translate-y-0.5 hover:bg-white"
          >
            Courses
          </Link>
          <button
            type="button"
            aria-label="Dismiss Ruguna notice"
            onClick={() => {
              window.localStorage.setItem(
                HOME_NOTICE_KEY,
                String(Date.now() + HOME_NOTICE_DISMISS_MS)
              );
              setVisible(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white/72 text-[var(--color-muted)] transition hover:bg-white hover:text-[var(--color-ink)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
