import { CtaBanner } from "@/components/site/cta-banner";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { eventItems, newsItems } from "@/data";

export default function NewsEventsPage() {
  return (
    <>
      <PageHero
        eyebrow="News & events"
        title="A structured home for announcements, campus stories, and intake events"
        description="This page is ready for CMS-managed publishing so staff can update institute news, event calendars, and notices without code changes."
        aside={
          <div className="grid gap-3 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-3xl font-bold text-[var(--color-ink)]">
              {newsItems.length + eventItems.length}
            </p>
            <p>Combined news and event modules with room for featured images, categorization, and detailed pages later.</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-bold">Latest news</h2>
            <div className="mt-6 grid gap-4">
              {newsItems.map((item) => (
                <Card key={item.slug}>
                  <CardContent>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      {item.category} · {item.date}
                    </p>
                    <h3 className="font-heading mt-4 text-2xl font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-3xl font-bold">Upcoming events</h2>
            <div className="mt-6 grid gap-4">
              {eventItems.map((item) => (
                <Card key={item.title} className="bg-[var(--color-ink)] text-white">
                  <CardContent>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/56">
                      {item.type} · {item.date}
                    </p>
                    <h3 className="font-heading mt-4 text-2xl font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/72">{item.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Keep future applicants and students informed with living content"
        description="The scaffold is ready for a database-driven news engine, event registrations, and announcement banners."
        primaryLabel="Apply Now"
        primaryHref="/apply"
        secondaryLabel="Contact Admissions"
        secondaryHref="/contact"
      />
    </>
  );
}
