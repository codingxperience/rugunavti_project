import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleCheckBig } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig, socialProof } from "@/data";

export function HomeHero() {
  return (
    <section className="section-padding pb-10 pt-10 sm:pt-16">
      <div className="container-width grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:items-center">
        <div className="fade-up">
          <p className="eyebrow">{siteConfig.motto}</p>
          <h1 className="font-heading mt-6 max-w-[10ch] text-3xl leading-[0.92] font-bold tracking-[-0.04em] text-[var(--color-ink)] sm:max-w-4xl sm:text-6xl sm:leading-[0.95] lg:text-7xl">
            {siteConfig.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-xl">
            {siteConfig.subheadline}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/apply">
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/programs">Explore Programs</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {socialProof.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3 text-sm font-medium text-[var(--color-ink)]"
              >
                <CircleCheckBig className="h-4 w-4 text-[var(--color-ink)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-up-delay relative">
          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-accent)] blur-2xl sm:h-32 sm:w-32" />
          <div className="relative overflow-hidden rounded-[34px] bg-white/70 shadow-[0_28px_90px_-60px_rgba(17,17,17,0.9)]">
            <Image
              src="/brand/hero_illustration.jpg"
              alt="Ruguna student reading in a bright study environment"
              width={1024}
              height={1024}
              priority
              className="aspect-square w-full object-cover object-center"
            />
          </div>

          {/*
          <div className="grid gap-3 sm:grid-cols-4">
            {publicStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
              >
                <p className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
          */}
        </div>
      </div>
    </section>
  );
}
