import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CtaBanner } from "@/components/site/cta-banner";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { schools } from "@/data";

export default function SchoolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Schools"
        title="Thirteen schools structured around practical sectors and real opportunity"
        description="Each school is framed with a clear overview, flagship pathways, career directions, and a focused call to action."
        aside={
          <div className="grid gap-3">
            <p className="font-heading text-3xl font-bold text-[var(--color-ink)]">13</p>
            <p className="text-sm leading-7 text-[var(--color-muted)]">
              Schools spanning digital technology, engineering, energy, health, business, logistics,
              creative industries, and TVET instruction.
            </p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {schools.map((school) => (
            <Link key={school.slug} href={`/schools/${school.slug}`}>
              <Card className="h-full transition hover:-translate-y-1 hover:border-[var(--color-ink)]/10">
                <CardContent className="flex h-full flex-col justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      {school.awards.join(" · ")}
                    </p>
                    <h2 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">
                      {school.name}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                      {school.overview}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
                    View school details
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Need help choosing the right school?"
        description="Admissions support can guide learners toward a pathway that fits their goals, entry profile, and preferred study mode."
        primaryLabel="Speak to Admissions"
        primaryHref="/contact"
        secondaryLabel="Explore Programs"
        secondaryHref="/programs"
      />
    </>
  );
}
