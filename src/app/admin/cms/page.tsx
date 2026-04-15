import { Card, CardContent } from "@/components/ui/card";

const cmsBlocks = [
  "Homepage hero and section ordering",
  "Utility header items and footer links",
  "School and programme descriptions",
  "FAQs, testimonials, announcements, and downloadable documents",
  "SEO metadata and page-level search descriptions",
];

export default function AdminCmsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">CMS, downloads, and SEO control</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Non-technical staff can manage core institutional content, utility links, downloads, and search metadata through this admin area.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cmsBlocks.map((item) => (
          <Card key={item}>
            <CardContent>
              <p className="font-heading text-xl font-bold text-[var(--color-ink)]">{item}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
