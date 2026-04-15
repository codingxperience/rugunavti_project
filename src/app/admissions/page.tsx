import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { admissionRequirements, admissionsSteps, faqs, intakeMoments } from "@/data";

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Requirements, document preparation, intakes, and next steps in one admissions overview"
        description="Ruguna admissions is structured to help applicants understand what is required, when to apply, and how to move from inquiry to confirmed enrollment."
        aside={
          <div className="grid gap-3 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-3xl font-bold text-[var(--color-ink)]">{admissionsSteps.length} steps</p>
            <p>Main intakes are framed around {intakeMoments.join(", ")} with programme-level variations where required.</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { href: "/apply", label: "Apply Online" },
            { href: "/prospectus", label: "Prospectus & Guides" },
            { href: "/programs", label: "Compare Programmes" },
            { href: "/contact", label: "Contact Admissions" },
          ].map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={`inline-flex items-center justify-center rounded-full px-5 py-4 text-sm font-semibold transition ${
                index === 0
                  ? "bg-[var(--color-ink)] text-white"
                  : "border border-[var(--color-border)] bg-white text-[var(--color-ink)] hover:bg-[var(--color-soft-accent)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {admissionsSteps.map((step, index) => (
            <Card key={step}>
              <CardContent>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Step {index + 1}</p>
                <h2 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">{step}</h2>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent>
              <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">Document requirements</h2>
              <div className="mt-6 grid gap-3">
                {admissionRequirements.map((item) => (
                  <div key={item} className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <h2 className="font-heading text-3xl font-bold">Applicant support</h2>
              <div className="mt-6 grid gap-3 text-sm leading-7 text-white/80">
                <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">Phone-first application support for learners who upload documents from their device camera.</div>
                <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">Guidance for working adults, regional applicants, and learners choosing between study modes.</div>
                <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">Structured links into finance clarification, prospectus downloads, and admissions follow-up.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width">
          <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">Admissions FAQ</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardContent>
                  <h3 className="font-heading text-xl font-bold">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
