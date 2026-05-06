import Link from "next/link";

import { ApplicationInterestForm } from "@/components/forms/application-interest-form";
import { CtaBanner } from "@/components/site/cta-banner";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { admissionRequirements, applyTracks, intakeMoments, programs, siteConfig } from "@/data";

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string; level?: string }>;
}) {
  const { program, level } = await searchParams;
  const requestedProgram = program?.trim();
  const requestedLevel = level?.trim();
  const selectedProgram = requestedProgram
    ? programs.find((item) => item.title.toLowerCase() === requestedProgram.toLowerCase())
    : null;
  const programOptions = programs.map((item) => item.title);
  const trackLevels = new Map([
    ["Certificate", "Certificate"],
    ["Diploma", "Diploma"],
    ["Bachelor's", "Bachelor's"],
    ["Short Courses", "Short Course"],
  ]);
  const selectedLevel =
    [...trackLevels.values()].find((item) => item === requestedLevel) ??
    selectedProgram?.level ??
    "Certificate";

  return (
    <>
      <PageHero
        eyebrow="Apply online"
        title="Apply to Ruguna College in minutes"
        description="Choose your study path, share your details, and send your application for admissions review."
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {applyTracks.map((track) => (
            <Link
              key={track.label}
              href={{
                pathname: "/apply",
                query: {
                  ...(selectedProgram ? { program: selectedProgram.title } : {}),
                  level: trackLevels.get(track.label) ?? "Certificate",
                },
              }}
              className={`rounded-2xl border px-5 py-4 text-sm font-semibold transition hover:border-black/20 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#fde047]/40 ${
                selectedLevel === trackLevels.get(track.label)
                  ? "border-[#d6a500] bg-[#fff8cc] text-[var(--color-ink)] ring-1 ring-[#fde047]"
                  : "border-[var(--color-border)] bg-white text-[var(--color-ink)]"
              }`}
            >
              <span className="block">{track.label}</span>
              <span className="mt-1 block max-w-[260px] text-xs font-medium leading-5 text-[var(--color-muted)]">
                {track.detail}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
          <Card>
            <CardContent>
              <ApplicationInterestForm
                intakeOptions={[...intakeMoments]}
                programOptions={programOptions}
                defaultProgram={selectedProgram?.title}
                defaultLevel={selectedLevel}
                defaultStudyMode={selectedProgram?.studyMode}
              />
            </CardContent>
          </Card>

          <aside className="grid self-start lg:sticky lg:top-28">
            <Card className="bg-[var(--color-ink)] text-white">
              <CardContent className="p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-white/56">Before you submit</p>
                <div className="mt-5 grid gap-2.5">
                  {admissionRequirements.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/7 px-3.5 py-3 text-xs leading-6 text-white/78">
                      {item}
                    </div>
                  ))}
                  <div className="rounded-2xl border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10 px-3.5 py-3 text-xs leading-6 text-white/82">
                    If you are not sure about your award level, previous qualification, or documents,
                    submit what you have and Ruguna admissions will advise you.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent className="p-5 sm:p-6">
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
          </aside>
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
