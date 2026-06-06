import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, description, aside }: PageHeroProps) {
  return (
    <section className="section-padding relative isolate overflow-hidden pb-12 pt-10 sm:pt-14">
      {/* ambient brand backdrop — keeps interior heroes premium, not brochure-flat */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full bg-[var(--color-accent)] opacity-40 blur-[90px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-72 w-72 rounded-full bg-[#1f7a4d]/15 blur-[90px]"
      />
      <div className="container-width grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <div className="fade-up">
          {eyebrow ? <Badge className="mb-5">{eyebrow}</Badge> : null}
          <h1 className="font-heading max-w-4xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--color-muted)]">
            {description}
          </p>
        </div>
        {aside ? (
          <div className="fade-up-delay rounded-[32px] border border-[var(--color-border)] bg-white/90 p-6 shadow-[0_30px_70px_-52px_rgba(17,17,17,0.7)]">
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}
