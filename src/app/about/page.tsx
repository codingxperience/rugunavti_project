import { CtaBanner } from "@/components/site/cta-banner";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  "Integrity",
  "Excellence",
  "Innovation",
  "Service",
  "Discipline",
  "Employability",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Ruguna"
        title="Practical, future-ready vocational education for Uganda and the wider region"
        description="Ruguna Vocational Training Institute positions technical and professional education around employability, entrepreneurship, flexible access, and credible digital delivery."
        aside={
          <div className="grid gap-4 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-xl font-bold text-[var(--color-ink)]">Mission</p>
            <p>Equip learners with practical, future-ready skills for employment, entrepreneurship, and community transformation.</p>
            <div className="h-px bg-[var(--color-border)]" />
            <p className="font-heading text-xl font-bold text-[var(--color-ink)]">Vision</p>
            <p>Become a leading African institute for practical, technology-enabled vocational and professional education.</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 lg:grid-cols-3">
          {[
            "Institutional delivery designed for credibility, practical skill-building, and learner trust.",
            "Academic pathways that balance workshop and practical learning with structured digital support.",
            "A mobile-aware digital platform that supports admissions, learning delivery, certificates, and student services.",
          ].map((point) => (
            <Card key={point}>
              <CardContent>
                <p className="text-sm leading-7 text-[var(--color-muted)]">{point}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
          <SectionHeading
            eyebrow="Why TVET matters"
            title="A vocational pathway that meets market demand and local economic realities"
            description="Ruguna centres employability, applied competence, affordability, flexible study options, and digital readiness for a changing economy."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Hands-on learning linked to real work contexts",
              "Skills that support both employment and entrepreneurship",
              "Digital literacy and platform readiness built into student support",
              "Industry relevance across technical, health, service, and business pathways",
            ].map((item) => (
              <Card key={item}>
                <CardContent>
                  <p className="font-heading text-xl font-bold text-[var(--color-ink)]">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width">
          <SectionHeading
            eyebrow="Core values"
            title="The culture behind the Ruguna learning experience"
            description="These values shape admissions service, teaching quality, learner support, and internal platform operations."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {values.map((value) => (
              <Card key={value} className="bg-[var(--color-ink)] text-white">
                <CardContent>
                  <p className="font-heading text-2xl font-bold">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Explore schools, compare pathways, and understand the Ruguna model in detail"
        description="Move from institutional overview into schools, programmes, admissions, or the eLearning platform."
        primaryLabel="Explore Schools"
        primaryHref="/schools"
        secondaryLabel="View Programmes"
        secondaryHref="/programs"
      />
    </>
  );
}
