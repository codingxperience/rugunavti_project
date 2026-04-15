import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookMarked, Clock3, GraduationCap, MonitorPlay } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getElearningCourseBySlug } from "@/data";

export default async function ElearningCourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getElearningCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <section className="section-padding pt-10 sm:pt-14">
      <div className="container-width grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6">
          <Card className="overflow-hidden border-black/6">
            <CardContent className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <span className="eyebrow">{course.category}</span>
                <h1 className="font-heading mt-6 text-5xl font-bold text-[var(--color-ink)]">
                  {course.title}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
                  {course.overview}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/elearning/login">
                      Enroll or start learning
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/elearning/courses">Back to catalog</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-[30px] bg-[var(--color-surface-alt)] p-5">
                <div className={`rounded-[26px] bg-gradient-to-br p-5 ${course.coverTone}`}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-72">
                    {course.level}
                  </p>
                  <p className="font-heading mt-3 text-3xl font-bold">{course.coverLabel}</p>
                </div>
                <div className="mt-5 grid gap-3 text-sm text-[var(--color-muted)]">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-4 w-4 text-[var(--color-ink)]" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-3">
                    <MonitorPlay className="h-4 w-4 text-[var(--color-ink)]" />
                    {course.mode}
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-[var(--color-ink)]" />
                    {course.school}
                  </div>
                  <div className="flex items-center gap-3">
                    <BookMarked className="h-4 w-4 text-[var(--color-ink)]" />
                    {course.startWindow}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                What you will learn
              </h2>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {course.whatYouWillLearn.map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                Module outline
              </h2>
              <div className="mt-6 grid gap-4">
                {course.modules.map((module, index) => (
                  <div
                    key={module.title}
                    className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                        {index + 1}. {module.title}
                      </p>
                      <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        {module.lessonCount} lessons
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {module.focus}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <h2 className="font-heading text-3xl font-bold">Course overview</h2>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-white/74">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/56">Who it is for</p>
                  <p className="mt-2">{course.audience}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/56">Assessment</p>
                  <p className="mt-2">{course.assessmentMethod}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/56">Completion</p>
                  <p className="mt-2">{course.certificate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Prerequisites
              </h2>
              <div className="mt-5 grid gap-3">
                {course.prerequisites.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Tools and access
              </h2>
              <div className="mt-5 grid gap-3">
                {course.tools.map((tool) => (
                  <div
                    key={tool}
                    className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-muted)]"
                  >
                    {tool}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
