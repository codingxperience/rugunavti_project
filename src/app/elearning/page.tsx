import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { CourseCard } from "@/components/elearning/course-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  elearningBenefits,
  elearningCategories,
  elearningFaqs,
  elearningSteps,
  elearningTestimonials,
  elearningTrustSignals,
  featuredElearningCourses,
  siteConfig,
} from "@/data";

export default function ElearningLandingPage() {
  return (
    <>
      <section className="section-padding pb-10 pt-10 sm:pt-14">
        <div className="container-width grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(560px,0.95fr)] xl:items-start">
          <div className="fade-up">
            <span className="eyebrow">Ruguna eLearning</span>
            <h1 className="font-heading mt-6 max-w-4xl text-5xl font-bold leading-[0.95] tracking-tight text-[var(--color-ink)] sm:text-6xl xl:text-7xl">
              Flexible Skills Learning for Real Work and Real Opportunity
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              Study practical Ruguna courses online with structured lessons, guided
              learning, assessments, and completion pathways designed for modern
              learners in Uganda and beyond.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/elearning/login">
                  Start learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/elearning/courses">Browse courses</Link>
              </Button>
            </div>

          </div>

          <div className="fade-up-delay xl:self-start">
            <div className="flex xl:justify-end">
              <Image
                src="/brand/elearning_home_illustration.png"
                alt="Ruguna eLearning home illustration"
                width={880}
                height={880}
                priority
                className="h-auto w-full max-w-[640px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                Why learn with Ruguna online
              </span>
              <h2 className="font-heading mt-4 text-4xl font-bold">
                Serious digital learning with vocational discipline
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
                Ruguna eLearning is built for practical progress, not passive watching.
                Learners move through guided modules, assignments, quiz checks,
                tutor updates, and completion milestones that make sense for
                employability-focused study.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-4">
              {elearningTrustSignals.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Featured courses</span>
              <h2 className="font-heading mt-5 text-4xl font-bold text-[var(--color-ink)]">
                Online and blended courses ready for real learners
              </h2>
            </div>
            <Button asChild variant="secondary">
              <Link href="/elearning/courses">View full catalog</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            {featuredElearningCourses.map((course) => (
              <CourseCard key={course.slug} course={course} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width">
          <div>
            <span className="eyebrow">Learning categories</span>
            <h2 className="font-heading mt-5 text-4xl font-bold text-[var(--color-ink)]">
              Schools and subject areas that make sense online
            </h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {elearningCategories.map((category) => (
              <Card key={category.slug}>
                <CardContent>
                  <h3 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                    {category.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {category.description}
                  </p>
                  <div className="mt-5 rounded-[22px] bg-[var(--color-surface-alt)] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      Online focus
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      {category.onlineFocus}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
          <Card>
            <CardContent>
              <span className="eyebrow">How online learning works</span>
              <div className="mt-6 grid gap-3">
                {elearningSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                  >
                    <div className="font-heading flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-bold text-[var(--color-ink)]">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-7 text-[var(--color-muted)]">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {elearningBenefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardContent>
                  <h3 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 xl:grid-cols-3">
          {elearningTestimonials.map((item) => (
            <Card key={item.name}>
              <CardContent>
                <p className="text-sm leading-7 text-[var(--color-muted)]">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6">
                  <p className="font-heading text-xl font-bold text-[var(--color-ink)]">
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{item.detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardContent>
              <span className="eyebrow">FAQ</span>
              <div className="mt-6 grid gap-3">
                {elearningFaqs.slice(0, 5).map((item) => (
                  <div
                    key={item.question}
                    className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                  >
                    <h3 className="font-heading text-xl font-bold text-[var(--color-ink)]">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <MessageCircle className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
              <h2 className="font-heading mt-5 text-3xl font-bold">Live support</h2>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Chat with Ruguna support on WhatsApp if you need help choosing a course,
                understanding blended attendance, or getting started with online learning.
              </p>
              <div className="mt-6 grid gap-3">
                <Button asChild>
                  <Link
                    href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp support
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="border-white/14 bg-white/8 text-white hover:bg-white/14 hover:text-white"
                >
                  <Link href="/elearning/contact">Support contacts</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-width">
          <Card className="overflow-hidden border-black/6 bg-[#171715] text-white">
            <CardContent className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                  Start learning
                </span>
                <h2 className="font-heading mt-5 text-4xl font-bold">
                  Enter the Ruguna classroom with a real learner flow
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
                  Create your account, verify your email, browse the course catalog,
                  and move into a structured learning dashboard designed for serious
                  online and blended study.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/elearning/register">Create account</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="border-white/14 bg-white/8 text-white hover:bg-white/14 hover:text-white"
                >
                  <Link href="/elearning/login">Student login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
