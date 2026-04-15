import Link from "next/link";

import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig, supportCategories } from "@/data";

export default function ElearningContactPage() {
  return (
    <section className="section-padding pt-10 sm:pt-14">
      <div className="container-width grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardContent>
            <span className="eyebrow">Contact support</span>
            <h1 className="font-heading mt-5 text-5xl font-bold text-[var(--color-ink)]">
              Admissions and learner support for eLearning
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
              Use this support channel for course selection, login issues, enrollment
              questions, certificate checks, and general learner assistance.
            </p>
            <div className="mt-8">
              <ContactForm categories={supportCategories} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <h2 className="font-heading text-3xl font-bold">Direct channels</h2>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-white/74">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/56">Phone</p>
                  <p className="mt-2">{siteConfig.phone}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/56">Email</p>
                  <p className="mt-2">{siteConfig.email}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/56">WhatsApp</p>
                  <p className="mt-2">{siteConfig.whatsapp}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Quick links
              </h2>
              <div className="mt-5 grid gap-3">
                <Button asChild>
                  <Link href="/elearning/login">Student login</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/verification">Verify certificate</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/elearning/courses">Browse courses</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
