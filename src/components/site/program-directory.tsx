"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useDeferredValue, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Program, School } from "@/data";

type ProgramDirectoryProps = {
  programs: Program[];
  schools: School[];
  initialLevel?: string;
};

export function ProgramDirectory({
  programs,
  schools,
  initialLevel = "All levels",
}: ProgramDirectoryProps) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState(initialLevel);
  const [school, setSchool] = useState("All schools");
  const [mode, setMode] = useState("All modes");

  const deferredQuery = useDeferredValue(query);

  const schoolNameMap = useMemo(
    () => Object.fromEntries(schools.map((item) => [item.slug, item.shortName])),
    [schools]
  );

  const filteredPrograms = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return programs.filter((program) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${program.title} ${program.overview} ${schoolNameMap[program.schoolSlug] ?? ""}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesLevel = level === "All levels" || program.level === level;
      const matchesSchool = school === "All schools" || program.schoolSlug === school;
      const matchesMode = mode === "All modes" || program.studyMode === mode;

      return matchesQuery && matchesLevel && matchesSchool && matchesMode;
    });
  }, [deferredQuery, level, mode, programs, school, schoolNameMap]);

  return (
    <div className="grid gap-8">
      <Card>
        <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.6fr))]">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search programs, pathways, or schools"
          />
          <FilterSelect value={level} onChange={setLevel}>
            <option>All levels</option>
            <option>Short Course</option>
            <option>Certificate</option>
            <option>Diploma</option>
            <option>Bachelor&apos;s</option>
          </FilterSelect>
          <FilterSelect value={school} onChange={setSchool}>
            <option>All schools</option>
            {schools.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.shortName}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect value={mode} onChange={setMode}>
            <option>All modes</option>
            <option>Day</option>
            <option>Evening</option>
            <option>Weekend</option>
            <option>Blended</option>
            <option>Online</option>
          </FilterSelect>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredPrograms.map((program) => (
          <Link key={program.slug} href={`/programs/${program.slug}`}>
            <Card className="h-full transition hover:-translate-y-1 hover:border-[var(--color-ink)]/10">
              <CardContent className="grid h-full gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    {program.level} · {schoolNameMap[program.schoolSlug]} · {program.studyMode}
                  </p>
                  <h3 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
                    {program.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {program.overview}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {program.intakeMonths.map((month) => (
                      <span
                        key={`${program.slug}-${month}`}
                        className="rounded-full bg-[var(--color-soft-accent)] px-3 py-1 text-xs font-medium text-[var(--color-ink)]"
                      >
                        {month} intake
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[22px] bg-[var(--color-surface-alt)] px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Duration
                  </p>
                  <p className="font-heading mt-2 text-lg font-bold">{program.durationText}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredPrograms.length === 0 ? (
        <Card>
          <CardContent>
            <h3 className="font-heading text-2xl font-bold">No programs match this filter yet.</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Try a broader keyword or switch one of the filters back to all options.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
};

function FilterSelect({ value, onChange, children }: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-ink)]/25 focus:ring-4 focus:ring-[var(--color-soft-accent)]"
    >
      {children}
    </select>
  );
}
