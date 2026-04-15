"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section-padding">
      <div className="container-width max-w-3xl rounded-[32px] border border-[var(--color-border)] bg-white/90 p-8 shadow-[0_28px_90px_-64px_rgba(17,17,17,0.85)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Something went wrong
        </p>
        <h1 className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">
          The platform hit an unexpected error
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          {error.message || "Please retry the action or return to the previous page."}
        </p>
        <div className="mt-6">
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
    </section>
  );
}
