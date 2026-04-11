import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { ProgramDirectory } from "@/components/site/program-directory";
import { Card, CardContent } from "@/components/ui/card";
import { academicMenuGroups, programs, schools } from "@/data";

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Searchable program discovery with a clearer academic structure"
        description="Inspired by the academic navigation reference, this page now introduces pathways, schools, and next actions before learners dive into the full searchable directory."
        aside={
          <div className="grid gap-4 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-3xl font-bold text-[var(--color-ink)]">
              {programs.length} programs
            </p>
            <p>
              Search by keyword, compare schools and study modes, and move into program detail
              pages with more context.
            </p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width overflow-hidden rounded-[34px] border border-[var(--color-border)] bg-white shadow-[0_40px_90px_-64px_rgba(17,17,17,0.85)]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_290px]">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3">
              {academicMenuGroups.map((group) => (
                <div key={group.title}>
                  <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {group.title}
                  </p>
                  <div className="mt-5 grid gap-4">
                    {group.links.map((link) => (
                      <Link
                        key={`${group.title}-${link.href}-${link.label}`}
                        href={link.href}
                        className="rounded-2xl p-2 transition hover:bg-[var(--color-surface-alt)]"
                      >
                        <p className="text-sm font-semibold text-[var(--color-ink)]">{link.label}</p>
                        {link.detail ? (
                          <p className="mt-1 text-xs leading-6 text-[var(--color-muted)]">
                            {link.detail}
                          </p>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="accent-panel flex flex-col justify-between gap-6 p-8 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/56">
                  Academic planning
                </p>
                <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight">
                  From school choice to enrollment, with less guesswork.
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  The strongest cue from the inspiration was its structured academic orientation. Here,
                  that becomes a cleaner decision panel tailored to Ruguna&apos;s schools and pathways.
                </p>
              </div>
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)]"
              >
                Start your application
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width">
          <ProgramDirectory programs={programs} schools={schools} />
        </div>
      </section>

      <section className="section-padding pt-8">
        <div className="container-width grid gap-4 lg:grid-cols-3">
          {[
            "Use the directory to compare duration, study mode, and intake months across programs.",
            "Open any program to see outcomes, entry requirements, career pathways, and module structure.",
            "Move into the Apply page when you already know your preferred path and intake window.",
          ].map((item) => (
            <Card key={item}>
              <CardContent>
                <p className="text-sm leading-7 text-[var(--color-muted)]">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
