import Link from "next/link";
import { notFound } from "next/navigation";
import { Bell, BookOpenText, CalendarDays, FileText, UsersRound } from "lucide-react";

import { CourseEnrollButton } from "@/components/elearning/course-enroll-button";
import { CourseModuleAccordion } from "@/components/elearning/course-module-accordion";
import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLearnerCourseWorkspace } from "@/lib/platform/learning-records";

export const dynamic = "force-dynamic";

const courseViews = [
  { id: "lessons", label: "Lessons", icon: BookOpenText },
  { id: "announcements", label: "Announcements", icon: Bell },
  { id: "grades", label: "Grades", icon: FileText },
  { id: "people", label: "People", icon: UsersRound },
  { id: "syllabus", label: "Syllabus", icon: FileText },
] as const;

type CourseView = (typeof courseViews)[number]["id"];

function isCourseView(value: string | undefined): value is CourseView {
  return courseViews.some((item) => item.id === value);
}

function formatDate(value: Date | string | null) {
  if (!value) return "No deadline";

  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function LearnCoursePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string; view?: string }>;
}) {
  const { slug } = await params;
  const { lesson, view } = await searchParams;
  const workspace = await getLearnerCourseWorkspace(slug);

  if (!workspace) {
    notFound();
  }

  if (!workspace.enrollment) {
    return (
      <Card>
        <CardContent>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Enrollment required
          </p>
          <h1 className="font-heading mt-4 text-4xl font-bold text-[var(--color-ink)]">
            {workspace.course.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            This classroom opens after enrollment. Enroll now and Ruguna eLearning will create
            your protected course record, progress tracker, and assessment workspace.
          </p>
          <div className="mt-6">
            <CourseEnrollButton courseSlug={workspace.course.slug} />
          </div>
        </CardContent>
      </Card>
    );
  }

  const lessons = workspace.modules.flatMap((module) => module.lessons);
  const currentLesson =
    lessons.find((item) => item.id === lesson || item.slug === lesson) ??
    lessons.find((item) => !item.completed) ??
    lessons[0];
  const currentView: CourseView = isCourseView(view) ? view : "lessons";
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((item) => item.completed).length;
  const instructorName =
    [workspace.course.owner?.profile?.firstName, workspace.course.owner?.profile?.lastName]
      .filter(Boolean)
      .join(" ") || "Ruguna Instructor";
  const selectedOffering = workspace.enrollment.courseOffering ?? workspace.course.offerings[0] ?? null;
  const plannedWeekCount =
    workspace.course.weekPlans.length ||
    (selectedOffering?.pace === "SEVEN_WEEK" ? 7 : selectedOffering?.pace === "FOURTEEN_WEEK" ? 14 : 14);
  const pathwayPlacements = workspace.course.programCourses.length
    ? workspace.course.programCourses
    : [
        {
          program: { title: workspace.course.program.title, school: workspace.course.school },
          yearNumber: 1,
          termNumber: 1,
          requirement: "REQUIRED",
          creditUnits: null,
        },
      ];
  const assessmentComponents = workspace.course.assessmentComponents.length
    ? workspace.course.assessmentComponents
    : [
        {
          id: "default-preparation",
          title: "Preparation",
          description: "Weekly study-material quizzes and guided reading checks.",
          weightPercent: 30,
        },
        {
          id: "default-teach-one-another",
          title: "Teach One Another",
          description: "Weekly group presentations and peer teaching work.",
          weightPercent: 30,
        },
        {
          id: "default-ponder-prove",
          title: "Ponder and Prove",
          description: "Weekly papers and capstone proof-of-learning work.",
          weightPercent: 40,
        },
      ];
  const weeklyPlan = workspace.course.weekPlans.length
    ? workspace.course.weekPlans
    : Array.from({ length: plannedWeekCount }, (_, index) => {
        const weekNumber = index + 1;
        const lessonForWeek = lessons[index % Math.max(lessons.length, 1)];

        return {
          id: `derived-week-${weekNumber}`,
          weekNumber,
          title: `Week ${weekNumber}: ${lessonForWeek?.title ?? workspace.course.title}`,
          topic: lessonForWeek?.summary ?? workspace.course.summary,
          preparationQuizTitle: `Preparation quiz ${weekNumber}`,
          preparationMaterials: "Review the weekly study guide and instructor notes.",
          preparationReading: "Complete the assigned reading before attempting the weekly quiz.",
          teachOneAnotherTask:
            "Prepare a short group explanation or presentation that helps classmates apply the topic.",
          ponderProveTask:
            weekNumber === plannedWeekCount
              ? "Submit the capstone case study or final learning reflection."
              : "Write a weekly critique or applied paper connected to a real workplace scenario.",
          liveSessionNote:
            workspace.course.deliveryMode === "BLENDED"
              ? "Check announcements for blended practical or live-session details."
              : null,
        };
      });

  const buildCourseHref = (nextView: CourseView) => {
    const nextParams = new URLSearchParams();

    if (currentLesson) {
      nextParams.set("lesson", currentLesson.id);
    }

    if (nextView !== "lessons") {
      nextParams.set("view", nextView);
    }

    return `/learn/course/${workspace.course.slug}?${nextParams.toString()}`;
  };

  const courseAssessments = lessons.flatMap((item) => {
    const entries = [];

    if (item.assignment) {
      entries.push({
        type: "Assignment",
        title: item.assignment.title,
        status: item.assignment.submission?.status ?? "Open",
        detail: item.assignment.brief,
        due: formatDate(item.assignment.dueAt),
        lessonTitle: item.title,
      });
    }

    if (item.quiz) {
      entries.push({
        type: "Quiz",
        title: item.quiz.title,
        status: item.quiz.attempts[0]?.passed ? "Passed" : item.quiz.attempts[0] ? "Attempted" : "Available",
        detail: item.quiz.summary,
        due: item.quiz.timeLimitMinutes ? `${item.quiz.timeLimitMinutes} minute limit` : "Untimed",
        lessonTitle: item.title,
      });
    }

    return entries;
  });

  const content =
    currentView === "lessons" ? (
      <CourseModuleAccordion
        courseId={workspace.course.id}
        courseSlug={workspace.course.slug}
        currentLessonId={currentLesson?.id ?? ""}
        modules={workspace.modules}
        defaultExpandAll
      />
    ) : currentView === "announcements" ? (
      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-[var(--color-ink)]" />
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Course announcements
            </h2>
          </div>
          <div className="mt-5 grid gap-3">
            {workspace.course.announcements.length ? (
              workspace.course.announcements.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                >
                  <p className="font-semibold text-[var(--color-ink)]">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{item.body}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)]">
                No course announcements have been posted yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    ) : currentView === "grades" ? (
      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[var(--color-ink)]" />
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Assessment progress
            </h2>
          </div>
          <div className="mt-5 grid gap-3">
            {courseAssessments.length ? (
              courseAssessments.map((item) => (
                <div
                  key={`${item.lessonTitle}-${item.title}`}
                  className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--color-ink)]">{item.title}</p>
                      <p className="mt-2 text-sm text-[var(--color-muted)]">
                        {item.type} - {item.lessonTitle}
                      </p>
                    </div>
                    <StatusBadge value={item.status} tone="success" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.detail}</p>
                  <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">{item.due}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)]">
                No assignments or quizzes are attached to this course yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    ) : currentView === "people" ? (
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <UsersRound className="h-5 w-5 text-[var(--color-ink)]" />
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Course people
              </h2>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
                <p className="font-semibold text-[var(--color-ink)]">{instructorName}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Lead instructor</p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  Course support, grading, announcements, and learning guidance.
                </p>
              </div>
              <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
                <p className="font-semibold text-[var(--color-ink)]">
                  {workspace.user.profile?.firstName} {workspace.user.profile?.lastName}
                </p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Current learner</p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  Enrollment status: {workspace.enrollment.status.toLowerCase()}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    ) : (
      <div className="grid gap-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-[var(--color-ink)]" />
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Schedule and learning rhythm
              </h2>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <p className="font-semibold text-[var(--color-ink)]">Course pace</p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  {selectedOffering ? formatEnumLabel(selectedOffering.pace) : "Fourteen Week"} course
                  with {plannedWeekCount} planned week(s). Seven-week courses run faster; fourteen-week
                  courses normally run without a mid-course break.
                </p>
              </div>
              <div className="rounded-[22px] border border-[var(--color-border)] bg-white p-4">
                <p className="font-semibold text-[var(--color-ink)]">Offering</p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  {selectedOffering?.title ?? "Open online course"}. Start:{" "}
                  {selectedOffering?.startDate ? formatDate(selectedOffering.startDate) : "Self-paced"}.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {pathwayPlacements.map((placement) => (
                <div
                  key={`${placement.program.title}-${placement.yearNumber}-${placement.termNumber}`}
                  className="rounded-[22px] border border-[var(--color-border)] bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-[var(--color-ink)]">{placement.program.title}</p>
                    <StatusBadge
                      value={`Year ${placement.yearNumber}, Semester ${placement.termNumber}`}
                    />
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {formatEnumLabel(placement.requirement)} course
                    {placement.creditUnits ? `, ${placement.creditUnits} credit unit(s)` : ""}.
                    {placement.program.school.name !== workspace.course.school.name
                      ? ` Shared from ${workspace.course.school.name}.`
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Assessment weighting
            </h2>
            <div className="mt-5 grid gap-3">
              {assessmentComponents.length ? (
                assessmentComponents.map((component) => (
                  <div
                    key={component.id}
                    className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-[var(--color-ink)]">{component.title}</p>
                      <StatusBadge value={`${component.weightPercent}%`} tone="success" />
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      {component.description}
                    </p>
                  </div>
                ))
              ) : (
                <div
                  className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                >
                  <p className="text-sm leading-7 text-[var(--color-muted)]">
                    Assessment weighting has not been configured for this course yet.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>

        <Card>
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Weekly course plan
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
              Each week connects preparation, peer teaching, and proof-of-learning work so learners
              can see what is expected before deadlines arrive.
            </p>
            <div className="mt-6 grid gap-3">
              {weeklyPlan.length ? (
                weeklyPlan.map((week) => (
                  <details
                    key={week.id}
                    className="group rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                  >
                    <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                          Week {week.weekNumber}
                        </p>
                        <h3 className="font-heading mt-2 text-xl font-bold text-[var(--color-ink)]">
                          {week.title}
                        </h3>
                      </div>
                      <StatusBadge value={week.topic} />
                    </summary>
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <div className="rounded-[18px] bg-white p-4">
                        <p className="font-semibold text-[var(--color-ink)]">Preparation</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                          {week.preparationQuizTitle}. {week.preparationMaterials}{" "}
                          {week.preparationReading}
                        </p>
                      </div>
                      <div className="rounded-[18px] bg-white p-4">
                        <p className="font-semibold text-[var(--color-ink)]">Teach one another</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                          {week.teachOneAnotherTask}
                        </p>
                      </div>
                      <div className="rounded-[18px] bg-white p-4">
                        <p className="font-semibold text-[var(--color-ink)]">Ponder and prove</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                          {week.ponderProveTask}
                        </p>
                      </div>
                    </div>
                    {week.liveSessionNote ? (
                      <p className="mt-4 rounded-[18px] bg-white px-4 py-3 text-sm leading-7 text-[var(--color-muted)]">
                        {week.liveSessionNote}
                      </p>
                    ) : null}
                  </details>
                ))
              ) : (
                <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)]">
                  Weekly planning has not been published for this course yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Selected course
          </p>
          <h1 className="font-heading mt-4 text-4xl font-bold text-[var(--color-ink)]">
            {workspace.course.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            {workspace.course.school.name} with {instructorName}. Review modules, announcements,
            people, and assessment progress from one connected course workspace.
          </p>

          <div className="mt-6">
            <ProgressBar value={workspace.enrollment.progressPercent} />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <StatusBadge value={workspace.course.program.level.replace(/_/g, " ")} />
            <StatusBadge value={workspace.course.deliveryMode.replace(/_/g, " ")} />
            <StatusBadge value={`${workspace.enrollment.progressPercent}% complete`} tone="success" />
            <StatusBadge value={`${completedLessons}/${totalLessons} lessons`} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {courseViews.map((item) => {
              const active = currentView === item.id;
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={buildCourseHref(item.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-black/6 bg-white text-[var(--color-ink)] shadow-[0_16px_30px_-24px_rgba(17,17,17,0.45)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-ink)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {content}
    </div>
  );
}
