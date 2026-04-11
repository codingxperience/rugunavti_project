import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/data";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Speak to admissions, ask a question, or reach out through the channel that works for you"
        description="The contact experience is structured for quick inquiries, WhatsApp follow-up, and future workflow automation."
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
              <form className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Full name
                    <Input placeholder="Your name" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Phone or email
                    <Input placeholder="How should we reply?" />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-medium">
                  Inquiry category
                  <Input placeholder="Admissions, fees, verification, or student support" />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Message
                  <Textarea placeholder="Tell us what you need help with" />
                </label>
                <Button type="submit" className="w-full sm:w-fit">
                  Send inquiry
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="bg-[var(--color-ink)] text-white">
              <CardContent>
                <p className="text-xs uppercase tracking-[0.22em] text-white/56">Admissions</p>
                <p className="mt-3 font-heading text-2xl font-bold">{siteConfig.phone}</p>
                <p className="mt-2 text-sm text-white/72">{siteConfig.email}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Location
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {siteConfig.address}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Quick direction
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  Map embeds, direction links, and inquiry routing can be connected here in the next phase.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
