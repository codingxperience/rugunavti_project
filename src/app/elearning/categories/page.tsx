import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminElearningCategories, elearningCourses } from "@/data";

export default function ElearningCategoriesPage() {
  return (
    <section className="section-padding pt-10 sm:pt-14">
      <div className="container-width">
        <span className="eyebrow">Categories</span>
        <h1 className="font-heading mt-5 text-5xl font-bold text-[var(--color-ink)]">
          Online learning categories and schools
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
          Ruguna prioritises the subject areas that work well online or in blended
          delivery without compromising credibility or practical relevance.
        </p>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {adminElearningCategories.map((category) => (
            <Card key={category.slug}>
              <CardContent>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                      {category.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {category.description}
                    </p>
                  </div>
                  <div className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
                    {category.courseCount} course{category.courseCount === 1 ? "" : "s"}
                  </div>
                </div>

                <div className="mt-5 rounded-[24px] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]">
                  {category.onlineFocus}
                </div>

                <div className="mt-5 grid gap-3">
                  {elearningCourses
                    .filter((course) => course.categorySlug === category.slug)
                    .map((course) => (
                      <div
                        key={course.slug}
                        className="rounded-[22px] border border-[var(--color-border)] bg-white p-4"
                      >
                        <p className="font-semibold text-[var(--color-ink)]">{course.title}</p>
                        <p className="mt-2 text-sm text-[var(--color-muted)]">{course.summary}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Button asChild>
            <Link href="/elearning/courses">Browse all courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
