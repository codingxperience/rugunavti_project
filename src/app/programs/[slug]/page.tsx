import { notFound } from "next/navigation";

import { CtaBanner } from "@/components/site/cta-banner";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { getProgramBySlug, getSchoolBySlug, programs } from "@/data";

const defaultAssessments = ["Quizzes", "Assignments", "Practical tasks", "Final assessment"];
const defaultTools = ["Smartphone or laptop", "Internet access for selected sessions", "Notebook and practical materials where relevant"];

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const school = getSchoolBySlug(program.schoolSlug);

  return (
    <>
      <PageHero
        eyebrow="Programme detail"
        title={program.title}
        description={program.overview}
        aside={
          <div className="grid gap-4 text-sm text-[var(--color-muted)]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em]">Award</p>
              <p className="mt-1 font-semibold text-[var(--color-ink)]">{program.level}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em]">Duration</p>
              <p className="mt-1 font-semibold text-[var(--color-ink)]">{program.durationText}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em]">Learning mode</p>
              <p className="mt-1 font-semibold text-[var(--color-ink)]">{program.studyMode}</p>
            </div>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card>
            <CardContent>
              <div className="grid gap-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    {school?.name}
                  </p>
                  <h2 className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">Who it is for</h2>
                  <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">{program.whoItsFor}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-heading text-xl font-bold">Learning outcomes</h3>
                    <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                      {program.learningOutcomes.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold">Entry requirements</h3>
                    <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                      {program.entryRequirements.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-heading text-xl font-bold">Module structure</h3>
                    <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                      {program.modules.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold">Career opportunities</h3>
                    <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                      {program.careerOpportunities.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-heading text-xl font-bold">Assessment model</h3>
                    <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                      {defaultAssessments.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold">Tools and equipment</h3>
                    <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                      {defaultTools.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="bg-[var(--color-ink)] text-white">
              <CardContent>
                <p className="text-xs uppercase tracking-[0.22em] text-white/56">Tuition and intakes</p>
                <p className="font-heading mt-3 text-2xl font-bold">{program.tuitionText}</p>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  Planned intake months: {program.intakeMonths.join(", ")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Certification</p>
                <p className="font-heading mt-3 text-xl font-bold text-[var(--color-ink)]">
                  {program.certificationOutcome}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <CtaBanner
        title={`Ready to apply for ${program.title}?`}
        description="Review requirements, download the prospectus, or continue directly into the admissions form."
        primaryLabel="Apply Now"
        primaryHref="/apply"
        secondaryLabel="Download Prospectus"
        secondaryHref="/prospectus"
      />
    </>
  );
}
