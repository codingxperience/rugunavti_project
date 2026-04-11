import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CtaBanner } from "@/components/site/cta-banner";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import {
  admissionRequirements,
  admissionsMenuGroups,
  admissionsSteps,
  faqs,
  intakeMoments,
  siteConfig,
} from "@/data";

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Clear application steps, phone-friendly uploads, and guided next actions"
        description="The reference material used a strong section-navigation pattern for admissions. Here, that idea becomes a cleaner overview panel, quick action links, and a more structured decision path."
        aside={
          <div className="grid gap-3 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-3xl font-bold text-[var(--color-ink)]">
              {admissionsSteps.length} steps
            </p>
            <p>
              Main intakes currently framed around {intakeMoments.join(", ")} with document-ready,
              mobile-friendly application preparation.
            </p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { href: "/apply", label: "Apply Online" },
            { href: "/fees-funding", label: "Fees & Funding" },
            { href: siteConfig.prospectusHref, label: "Download Prospectus" },
            { href: "/contact", label: "Speak to Admissions" },
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
        <div className="container-width overflow-hidden rounded-[34px] border border-[var(--color-border)] bg-white shadow-[0_40px_90px_-64px_rgba(17,17,17,0.85)]">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)]">
            {admissionsMenuGroups.map((group) => (
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

            <div className="rounded-[30px] bg-[var(--color-surface-alt)] p-6">
              <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Intake guidance
              </p>
              <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
                Learners can prepare for the next intake by choosing a pathway, reviewing requirements,
                and gathering phone-ready documents before opening the application flow.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {intakeMoments.map((month) => (
                  <span
                    key={month}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
                  >
                    {month}
                  </span>
                ))}
              </div>
              <Link
                href="/apply"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]"
              >
                Continue to apply
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {admissionsSteps.map((step, index) => (
              <Card key={step}>
                <CardContent>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Step {index + 1}
                  </p>
                  <h2 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">
                    {step}
                  </h2>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent>
              <h2 className="font-heading text-3xl font-bold">Documents required</h2>
              <ul className="mt-6 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                {admissionRequirements.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <h2 className="font-heading text-3xl font-bold">Applicant-friendly scenarios</h2>
              <ul className="mt-6 grid gap-3 text-sm leading-7 text-white/72">
                <li>• International applicants can be supported with document guidance.</li>
                <li>• Mature-age and adult learners can be guided into the right intake path.</li>
                <li>• Mobile photo uploads are supported in the future admissions workflow.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width">
          <h2 className="font-heading text-3xl font-bold">Admissions FAQ</h2>
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

      <CtaBanner
        title="Apply for the next intake with a structure built for clarity"
        description="The next phase can connect this page to real auth, forms, uploads, document review, and admission-status workflows."
        primaryLabel="Apply Now"
        primaryHref="/apply"
        secondaryLabel="Contact Admissions"
        secondaryHref="/contact"
      />
    </>
  );
}
