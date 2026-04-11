import { notFound } from "next/navigation";

import { CtaBanner } from "@/components/site/cta-banner";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { getProgramsBySchool, getSchoolBySlug, schools } from "@/data";

export function generateStaticParams() {
  return schools.map((school) => ({ slug: school.slug }));
}

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);

  if (!school) {
    notFound();
  }

  const relatedPrograms = getProgramsBySchool(slug);

  return (
    <>
      <PageHero
        eyebrow="School detail"
        title={school.name}
        description={school.highlight}
        aside={
          <div className="grid gap-4 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-xl font-bold text-[var(--color-ink)]">Awards available</p>
            <p>{school.awards.join(" · ")}</p>
            <div className="h-px bg-[var(--color-border)]" />
            <p className="font-heading text-xl font-bold text-[var(--color-ink)]">Study modes</p>
            <p>{school.studyModes.join(" · ")}</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card>
            <CardContent>
              <h2 className="font-heading text-3xl font-bold">School overview</h2>
              <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">{school.overview}</p>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-heading text-xl font-bold">Flagship programs</h3>
                  <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                    {school.flagshipPrograms.map((program) => (
                      <li key={program}>• {program}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold">Career pathways</h3>
                  <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                    {school.careerPaths.map((path) => (
                      <li key={path}>• {path}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <p className="text-xs uppercase tracking-[0.22em] text-white/56">Next step</p>
              <h3 className="font-heading mt-4 text-2xl font-bold">Ready to choose a path?</h3>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Review the programs below, compare duration and study mode, and move toward application.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {relatedPrograms.map((program) => (
            <Card key={program.slug}>
              <CardContent>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  {program.level} · {program.studyMode}
                </p>
                <h3 className="font-heading mt-4 text-2xl font-bold">{program.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {program.overview}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <CtaBanner
        title={`Apply to ${school.shortName} pathways with guided admissions support`}
        description="The scaffold is ready for school-specific landing content, staff contacts, industry partners, and intake notices."
        primaryLabel="Apply Now"
        primaryHref="/apply"
        secondaryLabel="View All Programs"
        secondaryHref="/programs"
      />
    </>
  );
}
