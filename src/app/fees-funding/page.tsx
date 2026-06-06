import { CtaBanner } from "@/components/site/cta-banner";
import { MediaBand } from "@/components/site/media";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { feeHighlights } from "@/data";

export default function FeesFundingPage() {
  return (
    <>
      <PageHero
        eyebrow="Fees & funding"
        title="Fee guidance, payment planning, and funding support"
        description="Review tuition ranges, payment notes, downloadable schedules, and admissions guidance before applying."
        aside={
          <div className="grid gap-3 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-3xl font-bold text-[var(--color-ink)]">4 levels</p>
            <p>Clear fee guidance helps applicants plan early and ask the right questions.</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 lg:grid-cols-2">
          {feeHighlights.map((item) => (
            <Card key={item.level}>
              <CardContent>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  {item.level}
                </p>
                <h2 className="font-heading mt-4 text-3xl font-bold">{item.range}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <MediaBand
        image="/img/business.jpg"
        alt="Planning Ruguna College fees and funding"
        eyebrow="Plan with confidence"
        title="Clear costs, flexible payment, early planning"
        description="Understand tuition ranges by award level, plan around intakes, and ask the right questions early — so finance never gets in the way of starting."
      />

      <section className="section-padding">
        <div className="container-width grid gap-4 lg:grid-cols-3">
          {[
            "Installment guidance is shared by intake or award level.",
            "Scholarship and sponsorship notes are published as they become available.",
            "Downloadable schedules and finance FAQs support admissions decisions.",
          ].map((note) => (
            <Card key={note}>
              <CardContent>
                <p className="text-sm leading-7 text-[var(--color-muted)]">{note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Need fee clarification before applying?"
        description="Contact admissions for programme fees, payment timing, and document guidance."
        primaryLabel="Speak to Admissions"
        primaryHref="/contact"
        secondaryLabel="Explore Programs"
        secondaryHref="/programs"
      />
    </>
  );
}
