import Link from "next/link";
import { BookOpenCheck, CalendarDays, GraduationCap, Layers3 } from "lucide-react";

import { CourseEnrollButton } from "@/components/elearning/course-enroll-button";
import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLearnerProgramPathway } from "@/lib/platform/learning-records";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-UG", { dateStyle: "medium" }).format(new Date(value));
}

export default async function LearnProgramPage() {
  const pathway = await getLearnerProgramPathway();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                Programme pathway
              </p>
              <h1 className="font-heading mt-4 text-4xl font-bold text-[var(--color-ink)]">
                My Program
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                See the programme you are pursuing, the courses planned by semester, shared courses
                from other Ruguna schools, and the courses available for enrollment now.
              </p>
            </div>
            <StatusBadge
              value={`${pathway.programEnrollments.length} active programme${
                pathway.programEnrollments.length === 1 ? "" : "s"
              }`}
              tone={pathway.programEnrollments.length ? "success" : "neutral"}
            />
          </div>
        </CardContent>
      </Card>

      {pathway.programEnrollments.length ? (
        pathway.programEnrollments.map((programEnrollment) => {
          const plannedCourseCount = programEnrollment.semesters.reduce(
            (count, semester) => count + semester.courses.length,
            0
          );
          const enrolledCourseCount = programEnrollment.semesters.reduce(
            (count, semester) =>
              count + semester.courses.filter((course) => course.status !== "available").length,
            0
          );
          const pathwayProgress = plannedCourseCount
            ? Math.round((enrolledCourseCount / plannedCourseCount) * 100)
            : 0;

          return (
            <section key={programEnrollment.id} className="grid gap-5">
              <Card className="border-black/8 bg-white">
                <CardContent>
                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                    <div>
                      <div className="flex flex-wrap gap-3">
                        <StatusBadge value={programEnrollment.program.level} />
                        <StatusBadge value={programEnrollment.program.deliveryMode} />
                        <StatusBadge value={programEnrollment.status} tone="success" />
                      </div>
                      <h2 className="font-heading mt-5 text-3xl font-bold text-[var(--color-ink)]">
                        {programEnrollment.program.title}
                      </h2>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                        {programEnrollment.program.school}. {programEnrollment.program.durationLabel}.
                        {programEnrollment.intake
                          ? ` ${programEnrollment.intake.title} starts ${formatDate(
                              programEnrollment.intake.startDate
                            )}.`
                          : " Intake details will be attached by admissions when confirmed."}
                      </p>
                      <div className="mt-5">
                        <ProgressBar value={pathwayProgress} />
                      </div>
                    </div>

                    <div className="grid gap-3 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
                      {[
                        {
                          label: "Current semester",
                          value: `Semester ${programEnrollment.currentTerm}`,
                          icon: CalendarDays,
                        },
                        {
                          label: "Enrolled courses",
                          value: `${enrolledCourseCount}/${plannedCourseCount}`,
                          icon: BookOpenCheck,
                        },
                        {
                          label: "Academic structure",
                          value: `${programEnrollment.semesters.length} semester block(s)`,
                          icon: Layers3,
                        },
                      ].map((item) => {
                        const Icon = item.icon;

                        return (
                          <div key={item.label} className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
                              <Icon className="h-5 w-5 text-[var(--color-ink)]" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                                {item.label}
                              </p>
                              <p className="font-heading mt-1 text-xl font-bold text-[var(--color-ink)]">
                                {item.value}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {programEnrollment.semesters.map((semester) => (
                <Card key={semester.key}>
                  <CardContent>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                          Course plan
                        </p>
                        <h3 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
                          {semester.title}
                        </h3>
                      </div>
                      <StatusBadge value={`${semester.courses.length} course(s)`} />
                    </div>

                    <div className="mt-6 grid gap-4">
                      {semester.courses.map((course) => (
                        <div
                          key={course.id}
                          className="grid gap-4 rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-center"
                        >
                          <div>
                            <div className="flex flex-wrap gap-2">
                              <StatusBadge value={course.requirement} />
                              <StatusBadge value={`${course.weekCount} weeks`} />
                              <StatusBadge value={course.pace} />
                              {course.sharedFromOtherSchool ? (
                                <StatusBadge value="Shared school course" tone="neutral" />
                              ) : null}
                            </div>
                            <h4 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">
                              {course.title}
                            </h4>
                            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                              {course.school}
                              {course.creditUnits ? ` • ${course.creditUnits} credit unit(s)` : ""}
                              {course.offeringTitle ? ` • ${course.offeringTitle}` : ""}
                            </p>
                            {course.status !== "available" ? (
                              <div className="mt-4">
                                <ProgressBar value={course.progress} />
                              </div>
                            ) : null}
                          </div>

                          <div className="flex flex-col gap-3 xl:items-end">
                            {course.status === "available" ? (
                              <CourseEnrollButton
                                courseSlug={course.slug}
                                programId={programEnrollment.program.id}
                                courseOfferingId={course.offeringId ?? undefined}
                                size="default"
                                label="Enroll in course"
                              />
                            ) : (
                              <Button asChild>
                                <Link href={`/learn/course/${course.slug}`}>
                                  {course.status === "completed" ? "Review course" : "Continue course"}
                                </Link>
                              </Button>
                            )}
                            <Button asChild variant="secondary">
                              <Link href={`/elearning/courses/${course.slug}`}>Course details</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          );
        })
      ) : (
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-[var(--color-ink)]" />
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Choose a Ruguna programme or course
              </h2>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Your programme pathway appears after you enroll into a Ruguna online course or after
              admissions attaches your account to a programme intake.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/elearning/courses">Browse online courses</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/programs">View programmes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
