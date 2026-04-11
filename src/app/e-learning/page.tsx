import Link from "next/link";
import { BookOpenText, MonitorPlay } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ELearningPage() {
  return (
    <>
      <PageHero
        eyebrow="E-Learning"
        title="A future home for digital learning access, course materials, and guided study support"
        description="This route gives the utility bar a real destination now, and later it can connect to protected learner resources, learning activities, and instructor materials."
        aside={
          <div className="grid gap-4 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-xl font-bold text-[var(--color-ink)]">Planned direction</p>
            <p>Learning resources, notes, assignment support, and structured digital study access.</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <MonitorPlay className="h-5 w-5 text-[var(--color-ink)]" />
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  Digital learning access
                </h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                This area can later support course notes, guided practical exercises, digital short courses,
                and student learning updates inside a protected experience.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <div className="flex items-center gap-3">
                <BookOpenText className="h-5 w-5" />
                <h2 className="font-heading text-2xl font-bold">Next phase integration</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/72">
                This route is ready to connect to Clerk-protected student access, instructor uploads, and future LMS or resource workflows.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/student-portal">Student Portal</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/programs">Explore Programs</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
