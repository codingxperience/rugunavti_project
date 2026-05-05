import Link from "next/link";
import { ContentStatus, EnrollmentStatus, ProgramLevel, type Prisma } from "@prisma/client";
import { ArrowRight, Search } from "lucide-react";

import { CourseEnrollButton } from "@/components/elearning/course-enroll-button";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDb } from "@/lib/db";
import {
  getDatabaseUnavailableMessage,
  isDatabaseConnectionError,
  logDataAccessError,
} from "@/lib/platform/database-errors";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

function label(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type CatalogCourse = Prisma.CourseGetPayload<{
  include: {
    school: true;
    program: true;
    modules: {
      include: {
        lessons: true;
      };
    };
    offerings: true;
    enrollments: true;
  };
}>;

export default async function LearnerCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; level?: string; mode?: string }>;
}) {
  const [session, filters] = await Promise.all([
    requireRole(["student", "super_admin"], "/learn/catalog"),
    searchParams,
  ]);
  const db = getDb();
  const query = filters.query?.trim() ?? "";
  const userIdentityFilters = [
    ...(session.clerkUserId ? [{ clerkId: session.clerkUserId }] : []),
    ...(session.email ? [{ email: session.email.toLowerCase() }] : []),
  ];
  let courses: CatalogCourse[] = [];
  let databaseMessage: string | null = null;

  try {
    courses = await db.course.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { summary: { contains: query, mode: "insensitive" } },
                { school: { name: { contains: query, mode: "insensitive" } } },
                { program: { title: { contains: query, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: {
        school: true,
        program: true,
        modules: {
          where: { status: ContentStatus.PUBLISHED },
          include: { lessons: { where: { status: ContentStatus.PUBLISHED } } },
        },
        offerings: {
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { startDate: "asc" },
        },
        enrollments: {
          where: {
            user: {
              OR: userIdentityFilters.length ? userIdentityFilters : [{ email: "__none__" }],
            },
            status: { not: EnrollmentStatus.CANCELLED },
          },
        },
      },
      orderBy: [{ program: { level: "asc" } }, { title: "asc" }],
    });
  } catch (error) {
    logDataAccessError("Learner catalog lookup failed", error);

    if (!isDatabaseConnectionError(error)) {
      throw error;
    }

    databaseMessage = getDatabaseUnavailableMessage(error);
    courses = [];
  }

  const filteredCourses = courses.filter((course) => {
    if (filters.level && filters.level !== "all" && label(course.program.level) !== filters.level) {
      return false;
    }

    if (filters.mode && filters.mode !== "all" && label(course.deliveryMode) !== filters.mode) {
      return false;
    }

    return true;
  });
  const levels = Array.from(new Set(courses.map((course) => label(course.program.level))));
  const modes = Array.from(new Set(courses.map((course) => label(course.deliveryMode))));

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Course catalog
              </p>
              <h1 className="font-heading mt-3 text-4xl font-bold text-[var(--color-ink)]">
                Browse courses
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                Start open short courses here. Programme courses open after admissions confirms placement.
              </p>
            </div>
            <Button asChild variant="secondary">
              <Link href="/learn/dashboard">Back to dashboard</Link>
            </Button>
          </div>

          <form className="mt-6 grid gap-3 rounded-[28px] border border-black/8 bg-[#fbfbf7] p-4 md:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                name="query"
                defaultValue={filters.query ?? ""}
                placeholder="Search course, school, or skill"
                className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white pl-11 pr-4 text-sm outline-none"
              />
            </label>
            <select
              name="level"
              defaultValue={filters.level ?? "all"}
              className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold outline-none"
            >
              <option value="all">All levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <select
              name="mode"
              defaultValue={filters.mode ?? "all"}
              className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold outline-none"
            >
              <option value="all">All modes</option>
              {modes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
            <Button type="submit">Filter</Button>
          </form>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {databaseMessage ? (
          <Card className="border-amber-200/70 bg-amber-50/80 md:col-span-2 2xl:col-span-3">
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Course catalog is temporarily unavailable
              </h2>
              <p className="mt-2 text-sm leading-7 text-amber-900/80">
                {databaseMessage} Refresh after the database connection is restored.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {filteredCourses.map((course) => {
          const enrollment = course.enrollments[0] ?? null;
          const lessonCount = course.modules.reduce(
            (total, module) => total + module.lessons.length,
            0
          );
          const isShortCourse = course.program.level === ProgramLevel.SHORT_COURSE;
          const offering = course.offerings[0] ?? null;

          return (
            <Card key={course.id} className="h-full">
              <CardContent className="flex h-full flex-col gap-5">
                <div className="rounded-[28px] bg-[var(--color-ink)] p-5 text-white">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                      {course.school.name}
                    </p>
                    <StatusBadge value={label(course.program.level)} tone="warning" />
                  </div>
                  <h2 className="font-heading mt-6 text-2xl font-bold leading-tight">
                    {course.title}
                  </h2>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {course.program.title}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm leading-7 text-[var(--color-muted)]">
                    {course.summary}
                  </p>
                </div>

                <div className="grid gap-2 text-sm text-[var(--color-muted)]">
                  <p>{lessonCount} lessons · {course.estimatedHours} hours</p>
                  <p>{label(course.deliveryMode)} · {offering ? label(offering.pace) : "Self-paced"}</p>
                </div>

                <div className="mt-auto flex flex-wrap gap-3">
                  {enrollment ? (
                    <Button asChild>
                      <Link href={`/learn/course/${course.slug}`}>
                        Open course
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : isShortCourse ? (
                    <CourseEnrollButton courseSlug={course.slug} size="default" label="Enroll" />
                  ) : (
                    <Button asChild>
                      <Link href={`/apply?program=${encodeURIComponent(course.program.title)}&level=${encodeURIComponent(label(course.program.level))}`}>
                        Apply first
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="secondary">
                    <Link href={`/elearning/courses/${course.slug}`}>View details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {!databaseMessage && !filteredCourses.length ? (
        <Card>
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              No courses matched
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              Try a different search or clear the filters.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
