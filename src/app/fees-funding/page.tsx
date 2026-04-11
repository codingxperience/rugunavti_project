import { CtaBanner } from "@/components/site/cta-banner";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { feeHighlights } from "@/data";

export default function FeesFundingPage() {
  return (
    <>
      <PageHero
        eyebrow="Fees & funding"
        title="Transparent fee ranges, installment-ready communication, and funding guidance"
        description="This section is prepared for level-based tuition overview, downloadable schedules, and policy publishing by finance or registrar teams."
        aside={
          <div className="grid gap-3 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-3xl font-bold text-[var(--color-ink)]">4 levels</p>
            <p>Clear pricing orientation helps applicants decide early and reduces uncertainty in the admissions flow.</p>
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

      <section className="section-padding">
        <div className="container-width grid gap-4 lg:grid-cols-3">
          {[
            "Installment policy notices can be published per intake or award level.",
            "Scholarship and sponsorship information can be presented as managed CMS entries.",
            "Downloadable schedules and finance FAQs can be added without changing the page structure.",
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
        description="The platform is ready for finance-admin communication, downloadable schedules, and program-specific pricing detail."
        primaryLabel="Speak to Admissions"
        primaryHref="/contact"
        secondaryLabel="Explore Programs"
        secondaryHref="/programs"
      />
    </>
  );
}
