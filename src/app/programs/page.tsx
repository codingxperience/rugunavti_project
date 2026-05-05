import { ProgramDirectory } from "@/components/site/program-directory";
import { PageHero } from "@/components/site/page-hero";
import { programs, schools } from "@/data";

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const { level } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Programmes and courses"
        title="Browse all Ruguna pathways by level, school, mode, duration, and skill area"
        description="Compare programmes by school, award level, delivery mode, duration, and career direction."
        aside={
          <div className="grid gap-4 text-sm text-[var(--color-muted)]">
            <p className="font-heading text-3xl font-bold text-[var(--color-ink)]">{programs.length} programmes</p>
            <p>Search the academic catalogue, review programme details, and move into admissions when ready.</p>
          </div>
        }
      />

      <section className="section-padding pt-0">
        <div className="container-width">
          <ProgramDirectory
            programs={programs}
            schools={schools}
            initialLevel={level ?? "All levels"}
          />
        </div>
      </section>
    </>
  );
}
