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
    <section className="section-padding pb-12 pt-10 sm:pt-14">
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
