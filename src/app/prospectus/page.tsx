import Link from "next/link";
import { Download, PhoneCall } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/data";

export default function ProspectusPage() {
  return (
    <>
      <PageHero
        eyebrow="Prospectus"
        title="A prospectus-ready page for downloads, pathway guidance, and next-intake information"
        description="Until the final PDF is uploaded, this page acts as the prospectus hub for learners who need a quick overview before they apply."
        aside={
          <div className="grid gap-4 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-xl font-bold text-[var(--color-ink)]">Need a copy now?</p>
            <p>Admissions can share the latest prospectus package and guidance through the contact channels below.</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent>
              <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                What the final prospectus will contain
              </h2>
              <div className="mt-6 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                <p>• School and program overviews</p>
                <p>• Entry requirements and study modes</p>
                <p>• Fee guidance and installment notes</p>
                <p>• Admissions steps and document checklist</p>
                <p>• Contact details and next-intake information</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5" />
                <h2 className="font-heading text-2xl font-bold">Download-ready hub</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/72">
                When the final PDF is available, this route can serve the download directly without
                changing the rest of the site navigation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-width flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/programs">Explore Programs</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/apply">Apply Now</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">
              <PhoneCall className="h-4 w-4" />
              Contact Admissions
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
