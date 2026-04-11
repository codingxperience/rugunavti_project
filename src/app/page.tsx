import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  GraduationCap,
  Hammer,
  MonitorSmartphone,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import { CtaBanner } from "@/components/site/cta-banner";
import { HomeHero } from "@/components/site/home-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  careerOutcomes,
  programs,
  schools,
  testimonials,
  whyChooseRuguna,
} from "@/data";

const iconMap = {
  hammer: Hammer,
  briefcase: BriefcaseBusiness,
  calendar: CalendarClock,
  monitor: MonitorSmartphone,
  rocket: Rocket,
  shield: ShieldCheck,
} as const;

export default function HomePage() {
  const featuredSchools = schools.slice(0, 4);
  const featuredPrograms = programs.filter((program) => program.featured).slice(0, 4);

  return (
    <>
      <HomeHero />

      <section className="section-padding pt-8">
        <div className="container-width rounded-[32px] border border-[var(--color-border)] bg-white/85 p-6 shadow-[0_28px_90px_-64px_rgba(17,17,17,0.85)] sm:p-8">
          <SectionHeading
            eyebrow="Featured schools"
            title="Strong schools built for high-demand practical pathways"
            description="Start with the institute's headline schools and move into a program path that matches your ambition, schedule, and future work goals."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredSchools.map((school) => (
              <Link key={school.slug} href={`/schools/${school.slug}`}>
                <Card className="h-full transition hover:-translate-y-1 hover:border-[var(--color-ink)]/10">
                  <CardContent className="flex h-full flex-col justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                        {school.awards.join(" · ")}
                      </p>
                      <h3 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">
                        {school.shortName}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                        {school.highlight}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
                      Explore school
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
          <SectionHeading
            eyebrow="Why choose Ruguna"
            title="A serious vocational platform with clarity, support, and practical value"
            description="The design, content, and structure are intentionally built to reassure applicants and move them confidently toward enrollment."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {whyChooseRuguna.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];

              return (
                <Card key={item.title} className="bg-white/90">
                  <CardContent>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-soft-accent)]">
                      <Icon className="h-5 w-5 text-[var(--color-ink)]" />
                    </div>
                    <h3 className="font-heading mt-5 text-xl font-bold text-[var(--color-ink)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width">
          <SectionHeading
            eyebrow="Program pathways"
            title="Choose the level that fits your starting point and pace"
            description="From short upskilling tracks to diploma and bachelor's pathways, the institute supports multiple entry points into practical learning."
            align="center"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Short Courses",
                detail: "Fast, flexible upskilling for targeted practical outcomes.",
              },
              {
                title: "Certificate",
                detail: "Strong entry-level professional grounding with applied labs.",
              },
              {
                title: "Diploma",
                detail: "Career-oriented depth for technical and supervisory progression.",
              },
              {
                title: "Bachelor's",
                detail: "Advanced pathways for leadership, systems thinking, and progression.",
              },
            ].map((pathway) => (
              <Card key={pathway.title}>
                <CardContent>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-ink)] text-white">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading mt-5 text-2xl font-bold">{pathway.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {pathway.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {featuredPrograms.map((program) => (
              <Card key={program.slug} className="overflow-hidden">
                <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      {program.level} · {program.studyMode}
                    </p>
                    <h3 className="font-heading mt-3 text-2xl font-bold">{program.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {program.overview}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[var(--color-soft-accent)] px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      Duration
                    </p>
                    <p className="font-heading mt-2 text-xl font-bold">{program.durationText}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="/programs">Browse all programs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
          <SectionHeading
            eyebrow="Career outcomes"
            title="Study with purpose and build toward real opportunity"
            description="Ruguna is positioned to support learners who want practical, work-ready, and business-ready outcomes."
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {careerOutcomes.map((outcome) => (
              <Card key={outcome} className="bg-[var(--color-ink)] text-white">
                <CardContent>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/56">Outcome pathway</p>
                  <h3 className="font-heading mt-4 text-2xl font-bold">{outcome}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">
                    Learn by doing, grow with structured support, and prepare for workplace or enterprise opportunities.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width">
          <SectionHeading
            eyebrow="Testimonials"
            title="A structure ready for real student voices"
            description="The homepage supports authentic graduate stories, program context, and outcome-focused credibility."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {testimonials.map((story) => (
              <Card key={`${story.name}-${story.program}`}>
                <CardContent>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-soft-accent)] font-heading text-xl font-bold">
                    {story.name.charAt(0)}
                  </div>
                  <p className="mt-5 text-base leading-8 text-[var(--color-ink)]">“{story.quote}”</p>
                  <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                    <p className="font-heading text-lg font-bold">{story.name}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {story.program} · Class of {story.graduationYear}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to apply, compare programs, or download the prospectus?"
        description="The next intake journey starts with clear admissions steps, transparent requirements, and a guided digital experience built for mobile-first applicants."
        primaryLabel="Apply for the Next Intake"
        primaryHref="/apply"
        secondaryLabel="Explore Courses and Entry Requirements"
        secondaryHref="/programs"
      />
    </>
  );
}
