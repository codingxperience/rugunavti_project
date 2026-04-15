import Link from "next/link";
import { Download } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { downloadableDocuments } from "@/data";

export default function ProspectusPage() {
  return (
    <>
      <PageHero
        eyebrow="Prospectus and guides"
        title="Download institutional and programme guidance before you apply"
        description="The prospectus area gives applicants, parents, sponsors, and working learners a clear place to review programme options, admissions requirements, and payment guidance."
      />

      <section id="downloads" className="section-padding pt-0">
        <div className="container-width grid gap-4 lg:grid-cols-3">
          {downloadableDocuments.map((document) => (
            <Card key={document.slug}>
              <CardContent>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  {document.category}
                </p>
                <h2 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">
                  {document.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{document.summary}</p>
                <div className="mt-6 flex items-center gap-3">
                  <Button asChild>
                    <Link href={document.href}>
                      <Download className="h-4 w-4" />
                      Download
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
