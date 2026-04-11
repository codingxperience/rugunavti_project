import { PageHero } from "@/components/site/page-hero";
import { ProgramDirectory } from "@/components/site/program-directory";
import { programs, schools } from "@/data";

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
            <p className="font-heading text-3xl font-bold text-[var(--color-ink)]">
              {shortCourses.length}
            </p>
            <p>Short-format learning experiences prepared for weekend and selected online delivery.</p>
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
