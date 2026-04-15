import Link from "next/link";

import { ApplicationInterestForm } from "@/components/forms/application-interest-form";
import { CtaBanner } from "@/components/site/cta-banner";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { admissionRequirements, applyTracks, intakeMoments, programs, siteConfig } from "@/data";

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Apply online"
        title="Start your Ruguna application with a guided, phone-friendly admissions flow"
        description="Applicants can compare levels, choose a programme, submit personal and academic details, and move into admissions review with a clear reference number."
        aside={
          <div className="grid gap-4 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-xl font-bold text-[var(--color-ink)]">Intake rhythm</p>
            <p>{intakeMoments.join(", ")} intakes with programme-specific start dates and admissions guidance.</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width flex flex-wrap gap-3">
          {applyTracks.map((track, index) => (
            <div
              key={track.label}
              className={`rounded-full px-5 py-4 text-sm font-semibold ${
                index === 0
                  ? "bg-[var(--color-ink)] text-white"
                  : "border border-[var(--color-border)] bg-white text-[var(--color-ink)]"
              }`}
            >
              {track.label}
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardContent>
              <ApplicationInterestForm
                intakeOptions={[...intakeMoments]}
                programOptions={programs.slice(0, 8).map((program) => program.title)}
              />
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="bg-[var(--color-ink)] text-white">
              <CardContent>
                <p className="text-xs uppercase tracking-[0.22em] text-white/56">Before you submit</p>
                <div className="mt-5 grid gap-3">
                  {admissionRequirements.map((item) => (
                    <div key={item} className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/80">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Support options</p>
                <div className="mt-4 grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
                  <Link href={siteConfig.prospectusHref}>Download prospectus</Link>
                  <Link href="/contact">Talk to admissions</Link>
                  <Link href="https://wa.me/256754000321" target="_blank" rel="noreferrer">
                    WhatsApp inquiry
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Need entry guidance before you apply?"
        description="Compare programmes, confirm requirements, and ask admissions for support before you submit."
        primaryLabel="View Admissions"
        primaryHref="/admissions"
        secondaryLabel="Contact Admissions"
        secondaryHref="/contact"
      />
    </>
  );
}
