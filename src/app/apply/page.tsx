import Link from "next/link";

import { ApplicationInterestForm } from "@/components/forms/application-interest-form";
import { CtaBanner } from "@/components/site/cta-banner";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { admissionRequirements, applyTracks, intakeMoments, programs, siteConfig } from "@/data";

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string }>;
}) {
  const { program } = await searchParams;
  const requestedProgram = program?.trim();
  const selectedProgram = requestedProgram
    ? programs.find((item) => item.title.toLowerCase() === requestedProgram.toLowerCase())
    : null;
  const programOptions = programs.map((item) => item.title);

  return (
    <>
      <PageHero
        eyebrow="Apply online"
        title="Start your Ruguna application with a guided, phone-friendly admissions flow"
        description="Applicants can choose a programme, ask for award-level guidance, add optional supporting documents, and move into admissions review with a clear reference number."
        aside={
          <div className="grid gap-4 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-xl font-bold text-[var(--color-ink)]">Intake rhythm</p>
            <p>{intakeMoments.join(", ")} intakes with programme-specific start dates and admissions guidance.</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width flex flex-wrap gap-3">
          {applyTracks.map((track) => (
            <div
              key={track.label}
              className="rounded-[22px] border border-[var(--color-border)] bg-white px-5 py-4 text-sm font-semibold text-[var(--color-ink)] shadow-[0_18px_55px_-48px_rgba(17,17,17,0.65)]"
            >
              <span className="block">{track.label}</span>
              <span className="mt-1 block max-w-[260px] text-xs font-medium leading-5 text-[var(--color-muted)]">
                {track.detail}
              </span>
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
                programOptions={programOptions}
                defaultProgram={selectedProgram?.title}
                defaultLevel={selectedProgram?.level}
                defaultStudyMode={selectedProgram?.studyMode}
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
                  <div className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/80">
                    If you are not sure about your award level, previous qualification, or documents,
                    submit what you have and Ruguna admissions will advise you.
                  </div>
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
