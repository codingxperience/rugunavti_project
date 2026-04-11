import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { portalHighlights } from "@/data";

export default function StudentPortalPage() {
  return (
    <>
      <PageHero
        eyebrow="Student portal"
        title="A student dashboard foundation for timetables, fees, results, and support"
        description="This route acts as the public-facing entry to the future student portal experience and communicates what learners can expect once authenticated."
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 lg:grid-cols-2">
          {portalHighlights.student.map((item) => (
            <Card key={item}>
              <CardContent>
                <p className="font-heading text-2xl font-bold text-[var(--color-ink)]">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
