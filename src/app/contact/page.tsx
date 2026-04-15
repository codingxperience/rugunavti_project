import Link from "next/link";

import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/site/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig, supportCategories } from "@/data";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact and help"
        title="Speak to admissions, request support, or reach the team through the fastest channel for your situation"
        description="Ruguna provides admissions guidance, technical help, verification support, and finance clarification through a structured contact workflow and direct WhatsApp access."
        aside={
          <div className="grid gap-3 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-xl font-bold text-[var(--color-ink)]">Office hours</p>
            <p>{siteConfig.hours}</p>
            <div className="h-px bg-[var(--color-border)]" />
            <p className="font-heading text-xl font-bold text-[var(--color-ink)]">WhatsApp</p>
            <p>{siteConfig.whatsapp}</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardContent>
              <ContactForm categories={supportCategories} />
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="bg-[var(--color-ink)] text-white">
              <CardContent>
                <p className="text-xs uppercase tracking-[0.22em] text-white/56">Admissions direct line</p>
                <p className="mt-3 font-heading text-2xl font-bold">{siteConfig.phone}</p>
                <p className="mt-2 text-sm text-white/72">{siteConfig.email}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Support categories</p>
                <div className="mt-4 grid gap-2">
                  {supportCategories.map((category) => (
                    <div key={category} className="rounded-[18px] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-muted)]">
                      {category}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Office information</p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{siteConfig.address}</p>
                <div className="mt-5 grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
                  <Link href="/prospectus">Download prospectus</Link>
                  <Link href="/verification">Verify certificate</Link>
                  <Link href="https://wa.me/256754000321" target="_blank" rel="noreferrer">
                    WhatsApp inquiry
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
