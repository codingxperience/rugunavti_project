import Link from "next/link";
import { BookCopy, FileText } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ELibraryPage() {
  return (
    <>
      <PageHero
        eyebrow="E-Library"
        title="A future library hub for prospectuses, academic documents, and student-ready resources"
        description="This placeholder gives the upper navigation a meaningful destination now and a clean handoff point for later content, downloads, and protected academic resources."
        aside={
          <div className="grid gap-4 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-xl font-bold text-[var(--color-ink)]">Resource-ready</p>
            <p>Prospectuses, notices, forms, guides, and future student-access reading materials.</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <BookCopy className="h-5 w-5 text-[var(--color-ink)]" />
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  Library and download hub
                </h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                This route can later host digital reading resources, prospectuses, schedules, notices, and programme documents managed through the admin CMS.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                <h2 className="font-heading text-2xl font-bold">Next phase integration</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/72">
                The page is ready for searchable resources, role-based downloads, and more formal academic document handling later.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/prospectus">View Prospectus</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Contact Admissions</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
