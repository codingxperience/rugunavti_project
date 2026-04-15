import { Filter, Search } from "lucide-react";

import { CourseCard } from "@/components/elearning/course-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  elearningCategories,
  elearningCourses,
  filterElearningCourses,
} from "@/data";

export default async function ElearningCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    level?: string;
    duration?: string;
    mode?: string;
    skill?: string;
  }>;
}) {
  const filters = await searchParams;
  const results = filterElearningCourses(filters);
  const skillAreas = Array.from(new Set(elearningCourses.map((course) => course.skillArea)));

  return (
    <section className="section-padding pt-10 sm:pt-14">
      <div className="container-width">
        <span className="eyebrow">Course catalog</span>
        <h1 className="font-heading mt-5 text-5xl font-bold text-[var(--color-ink)]">
          Browse Ruguna online and blended learning
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
          Search across short courses, certificates, and blended pathways built for
          flexible digital delivery.
        </p>

        <form className="mt-8 grid gap-4 rounded-[34px] border border-black/6 bg-white p-5 shadow-[0_24px_90px_-72px_rgba(17,17,17,0.65)] xl:grid-cols-[minmax(0,1.2fr)_repeat(5,minmax(0,0.75fr))]">
          <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
            Search
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                name="query"
                defaultValue={filters.query ?? ""}
                placeholder="Course title, skill area, school"
                className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] pl-11 pr-4 text-sm outline-none transition focus:border-black/16"
              />
            </div>
          </label>

          <FilterSelect
            name="category"
            label="Category"
            value={filters.category}
            options={[
              { label: "All categories", value: "all" },
              ...elearningCategories.map((category) => ({
                label: category.title,
                value: category.slug,
              })),
            ]}
          />
          <FilterSelect
            name="level"
            label="Level"
            value={filters.level}
            options={[
              { label: "All levels", value: "all" },
              { label: "Short Course", value: "Short Course" },
              { label: "Certificate", value: "Certificate" },
              { label: "Diploma", value: "Diploma" },
            ]}
          />
          <FilterSelect
            name="duration"
            label="Duration"
            value={filters.duration}
            options={[
              { label: "All durations", value: "all" },
              { label: "Short", value: "Short" },
              { label: "Medium", value: "Medium" },
              { label: "Extended", value: "Extended" },
            ]}
          />
          <FilterSelect
            name="mode"
            label="Learning mode"
            value={filters.mode}
            options={[
              { label: "All modes", value: "all" },
              { label: "Online", value: "Online" },
              { label: "Blended", value: "Blended" },
            ]}
          />
          <FilterSelect
            name="skill"
            label="Skill area"
            value={filters.skill}
            options={[
              { label: "All skills", value: "all" },
              ...skillAreas.map((skill) => ({ label: skill, value: skill })),
            ]}
          />
        </form>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-muted)]">
            {results.length} course{results.length === 1 ? "" : "s"} matched your filters
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm text-[var(--color-muted)]">
            <Filter className="h-4 w-4 text-[var(--color-ink)]" />
            Search, compare, and enroll
          </div>
        </div>

        {results.length ? (
          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            {results.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        ) : (
          <Card className="mt-8">
            <CardContent>
              <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
                No courses matched those filters
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Adjust the category, mode, or duration filters and try again. The
                catalog is intentionally focused on courses that can be delivered well
                online or in blended format.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

function FilterSelect({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value?: string;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-ink)]">
      {label}
      <select
        name={name}
        defaultValue={value ?? "all"}
        className="h-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm outline-none transition focus:border-black/16"
      >
        {options.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
