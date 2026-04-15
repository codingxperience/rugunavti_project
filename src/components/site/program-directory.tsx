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

const skillAreaMap: Record<string, string> = {
  "digital-technology-ai-cyber-systems": "Digital and AI",
  "engineering-construction-smart-infrastructure": "Engineering",
  "renewable-energy-climate-technology": "Renewable Energy",
  "agribusiness-food-systems-agritech": "Agribusiness",
  "health-public-health-allied-services": "Health",
  "business-entrepreneurship-digital-economy": "Business",
  "creative-arts-media-digital-production": "Creative Arts",
  "hospitality-tourism-experience-management": "Hospitality",
  "automotive-mechanical-transport-technology": "Automotive",
  "logistics-supply-chain-procurement": "Logistics",
  "security-safety-industrial-systems": "Security",
  "ict-support-digital-operations": "ICT Support",
  "education-training-tvet-instruction": "Education",
};

function getDurationBucket(durationMonths: number) {
  if (durationMonths <= 3) return "Up to 3 months";
  if (durationMonths <= 12) return "4 to 12 months";
  if (durationMonths <= 24) return "1 to 2 years";
  return "More than 2 years";
}

export function ProgramDirectory({
  programs,
  schools,
  initialLevel = "All levels",
}: ProgramDirectoryProps) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState(initialLevel);
  const [school, setSchool] = useState("All schools");
  const [mode, setMode] = useState("All modes");
  const [duration, setDuration] = useState("All durations");
  const [skillArea, setSkillArea] = useState("All skill areas");

  const deferredQuery = useDeferredValue(query);

  const schoolNameMap = useMemo(
    () => Object.fromEntries(schools.map((item) => [item.slug, item.shortName])),
    [schools]
  );

  const skillAreas = useMemo(
    () => Array.from(new Set(programs.map((program) => skillAreaMap[program.schoolSlug] ?? "General"))),
    [programs]
  );

  const filteredPrograms = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return programs.filter((program) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${program.title} ${program.overview} ${schoolNameMap[program.schoolSlug] ?? ""} ${skillAreaMap[program.schoolSlug] ?? ""}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesLevel = level === "All levels" || program.level === level;
      const matchesSchool = school === "All schools" || program.schoolSlug === school;
      const matchesMode = mode === "All modes" || program.studyMode === mode;
      const matchesDuration =
        duration === "All durations" || getDurationBucket(program.durationMonths) === duration;
      const matchesSkillArea =
        skillArea === "All skill areas" ||
        (skillAreaMap[program.schoolSlug] ?? "General") === skillArea;

      return (
        matchesQuery &&
        matchesLevel &&
        matchesSchool &&
        matchesMode &&
        matchesDuration &&
        matchesSkillArea
      );
    });
  }, [deferredQuery, duration, level, mode, programs, school, schoolNameMap, skillArea]);

  return (
    <div className="grid gap-8">
      <Card>
        <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.72fr))]">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search programmes, pathways, or schools"
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
          <FilterSelect value={duration} onChange={setDuration}>
            <option>All durations</option>
            <option>Up to 3 months</option>
            <option>4 to 12 months</option>
            <option>1 to 2 years</option>
            <option>More than 2 years</option>
          </FilterSelect>
          <FilterSelect value={skillArea} onChange={setSkillArea}>
            <option>All skill areas</option>
            {skillAreas.map((area) => (
              <option key={area}>{area}</option>
            ))}
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
                    <span className="rounded-full bg-[var(--color-soft-accent)] px-3 py-1 text-xs font-medium text-[var(--color-ink)]">
                      {skillAreaMap[program.schoolSlug] ?? "General"}
                    </span>
                    {program.intakeMonths.map((month) => (
                      <span
                        key={`${program.slug}-${month}`}
                        className="rounded-full bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]"
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
            <p className="font-heading text-2xl font-bold text-[var(--color-ink)]">No programmes match this filter set</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Adjust your school, mode, duration, or skill-area filters to widen the results.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
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
