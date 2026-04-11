import { CtaBanner } from "@/components/site/cta-banner";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { portalHighlights, studentLifeHighlights } from "@/data";

export default function StudentLifePage() {
  return (
    <>
      <PageHero
        eyebrow="Student life"
        title="A practical student experience with support, structure, and digital access"
        description="Student life at Ruguna is framed around employability support, campus communication, and day-to-day academic coordination."
        aside={
          <div className="grid gap-4 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-3xl font-bold text-[var(--color-ink)]">Mobile-first</p>
            <p>Designed for learners who need quick access to timetables, announcements, fees, and support from one portal.</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {studentLifeHighlights.map((item) => (
            <Card key={item}>
              <CardContent>
                <p className="font-heading text-xl font-bold text-[var(--color-ink)]">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent>
              <h2 className="font-heading text-3xl font-bold">Student dashboard basics</h2>
              <ul className="mt-6 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                {portalHighlights.student.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <h2 className="font-heading text-3xl font-bold">Career and attachment support</h2>
              <p className="mt-4 text-sm leading-7 text-white/72">
                The platform blueprint already supports internship tracking, downloadable documents, and helpdesk-style support journeys.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <CtaBanner
        title="Explore admissions, then step into a student experience built around momentum"
        description="This page is ready for clubs, gallery content, student stories, and richer community features later."
        primaryLabel="Apply Now"
        primaryHref="/apply"
        secondaryLabel="View Admissions"
        secondaryHref="/admissions"
      />
    </>
  );
}
