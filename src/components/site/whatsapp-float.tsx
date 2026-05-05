"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useState } from "react";

import { siteConfig } from "@/data";

const supportTopics = [
  { label: "Apply to Ruguna College", href: "/apply" },
  { label: "Admissions guidance", href: "/admissions" },
  { label: "eLearning access", href: "/elearning/login" },
  { label: "Fees and payment guidance", href: "/fees-funding" },
  { label: "Certificate verification", href: "/verification" },
];

type WhatsAppFloatProps = {
  variant?: "whatsapp" | "support";
};

export function WhatsAppFloat({ variant = "whatsapp" }: WhatsAppFloatProps) {
  const [open, setOpen] = useState(false);
  const whatsappNumber = siteConfig.whatsapp.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappNumber}`;
  const isSupportMode = variant === "support";

  if (!open) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
        {isSupportMode ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-bold text-[var(--color-ink)] shadow-[0_20px_60px_-42px_rgba(17,17,17,0.7)] transition hover:-translate-y-0.5 hover:bg-[#fbfaf4]"
          >
            Live support
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Ruguna support"
          className={
            isSupportMode
              ? "inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-[0_22px_50px_-24px_rgba(17,17,17,0.7)] transition hover:-translate-y-0.5 hover:bg-black"
              : "inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_22px_50px_-18px_rgba(37,211,102,0.85)] transition hover:-translate-y-0.5 hover:bg-[#20bd5b]"
          }
        >
          <span className="relative flex h-7 w-7 items-center justify-center text-white">
            <MessageCircle className="absolute h-7 w-7 text-white" strokeWidth={2.3} />
            {!isSupportMode ? (
              <Phone className="relative h-3.5 w-3.5 text-white" strokeWidth={2.7} />
            ) : null}
          </span>
        </button>
      </div>
    );
  }

  return (
    <section className="fixed bottom-5 right-4 z-50 max-h-[min(560px,calc(100dvh-2rem))] w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_26px_80px_-46px_rgba(17,17,17,0.68)]">
      <div className="flex items-start justify-between gap-4 border-b border-black/6 bg-[#fbfaf4] p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Ruguna support
          </p>
          <h2 className="font-heading mt-1 text-xl font-bold text-[var(--color-ink)]">
            Live support
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
            Quick links for admissions, eLearning, fees, and records.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close Ruguna live support"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/8 bg-white text-[var(--color-ink)] transition hover:bg-[var(--color-soft-accent)]"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[340px] overflow-y-auto p-4">
        <div className="grid gap-2">
          {supportTopics.map((topic) => (
            <Link
              key={topic.href}
              href={topic.href}
              className="flex items-center justify-between rounded-2xl border border-black/6 bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[#fbfaf4]"
            >
              {topic.label}
              <ChevronRight className="h-4 w-4 text-[var(--color-muted)]" />
            </Link>
          ))}
        </div>

        <Link
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#20bd5b]"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp support
        </Link>
      </div>

      <div className="grid grid-cols-2 border-t border-black/6 bg-[#fbfaf4] px-4 py-3 text-center text-xs font-semibold text-[var(--color-muted)]">
        <Link href="/contact" className="grid justify-items-center gap-1 transition hover:text-[var(--color-ink)]">
          <HelpCircle className="h-4 w-4" />
          Help
        </Link>
        <Link href={whatsappHref} target="_blank" rel="noreferrer" className="grid justify-items-center gap-1 transition hover:text-[var(--color-ink)]">
          <MessageCircle className="h-4 w-4" />
          Chat
        </Link>
      </div>
    </section>
  );
}
