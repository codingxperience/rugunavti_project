import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { ProgramDirectory } from "@/components/site/program-directory";
import { programs, schools } from "@/data";
import { intakeScheduleHref, shortCourseIntakeSummary } from "@/data/intakes";
import { publicPageMetadata } from "@/lib/site-metadata";

export const metadata = publicPageMetadata("/short-courses");

export default function ShortCoursesPage() {
  const shortCourses = programs.filter((program) => program.level === "Short Course");

  return (
    <>
      <PageHero
        eyebrow="Short courses"
        title="Fast upskilling routes for digital work, energy, and practical opportunity"
        description="Short courses are ideal for flexible entry, quick confidence building, and focused skill development."
        aside={
          <div className="grid gap-3 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-xl font-bold text-[var(--color-ink)]">
              Phase 1 intake windows
            </p>
            <p>{shortCourseIntakeSummary}</p>
            <Link href={intakeScheduleHref} className="font-semibold underline">
              See intake guidance
            </Link>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width">
          <ProgramDirectory
            programs={shortCourses}
            schools={schools}
            initialLevel="Short Course"
          />
        </div>
      </section>
    </>
  );
}
