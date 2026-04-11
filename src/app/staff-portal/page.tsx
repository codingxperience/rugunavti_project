import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { portalHighlights } from "@/data";

export default function StaffPortalPage() {
  return (
    <>
      <PageHero
        eyebrow="Staff portal"
        title="Registrar, finance, and admin operations prepared for role-based workflows"
        description="The staff portal entry page communicates the future structure for admissions review, program management, finance workflows, and institute administration."
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 lg:grid-cols-2">
          {portalHighlights.staff.map((item) => (
            <Card key={item} className="bg-[var(--color-ink)] text-white">
              <CardContent>
                <p className="font-heading text-2xl font-bold">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
