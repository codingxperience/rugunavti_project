import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bell,
  BookOpenText,
  CalendarDays,
  Download,
  FileText,
  House,
  UsersRound,
} from "lucide-react";

import { CourseEnrollButton } from "@/components/elearning/course-enroll-button";
import { CourseModuleAccordion } from "@/components/elearning/course-module-accordion";
import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLearnerCourseWorkspace } from "@/lib/platform/learning-records";
import { requireRole } from "@/lib/platform/session";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const courseViews = [
  { id: "home", label: "Home", icon: House },
  { id: "lessons", label: "Lessons", icon: BookOpenText },
  { id: "announcements", label: "Announcements", icon: Bell },
  { id: "syllabus", label: "Syllabus", icon: CalendarDays },
  { id: "grades", label: "Grades", icon: FileText },
  { id: "people", label: "People", icon: UsersRound },
  { id: "materials", label: "Course Materials", icon: Download },
] as const;

type CourseView = (typeof courseViews)[number]["id"];

function isCourseView(value: string | undefined): value is CourseView {
  return courseViews.some((item) => item.id === value);
}

function normalizeCourseView(value: string | undefined, hasLessonQuery: boolean): CourseView {
  if (value === "modules") {
    return "lessons";
  }

  if (isCourseView(value)) {
    return value;
  }

  return hasLessonQuery ? "lessons" : "home";
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "Not scheduled";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatEnumLabel(value: string | null | undefined) {
  if (!value) return "Not configured";

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatBytes(value: number) {
  if (value < 1024 * 1024) {
    return `${Math.max(Math.round(value / 1024), 1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
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
  const session = await requireRole(["student", "super_admin"], `/learn/course/${slug}`);
  const workspace = await getLearnerCourseWorkspace(slug, session);

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
    lessons[0] ??
    null;
  const currentView = normalizeCourseView(view, Boolean(lesson));
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((item) => item.completed).length;
  const courseResources = lessons.flatMap((item) =>
    item.resources.map((resource) => ({
      ...resource,
      lessonTitle: item.title,
    }))
  );
  const instructorName =
    [workspace.course.owner?.profile?.firstName, workspace.course.owner?.profile?.lastName]
      .filter(Boolean)
      .join(" ") || "Ruguna Instructor";
  const learnerName =
    [workspace.user.profile?.firstName, workspace.user.profile?.lastName].filter(Boolean).join(" ") ||
    workspace.user.email;
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

  const buildCourseHref = (nextView: CourseView) => {
    const nextParams = new URLSearchParams();

    if (currentLesson && nextView === "lessons") {
      nextParams.set("lesson", currentLesson.id);
    }

    if (nextView !== "home") {
      nextParams.set("view", nextView);
    }

    const query = nextParams.toString();

    return `/learn/course/${workspace.course.slug}${query ? `?${query}` : ""}`;
  };

  const content =
    currentView === "home" ? (
      <div className="grid gap-4">
        <Card>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Course home
            </p>
            <h2 className="font-heading mt-3 text-3xl font-bold text-[var(--color-ink)]">
              {workspace.course.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
              {workspace.course.description || workspace.course.summary}
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <CourseStat label="Progress" value={`${workspace.enrollment.progressPercent}%`} />
              <CourseStat label="Lessons" value={`${completedLessons}/${totalLessons}`} />
              <CourseStat label="Schedule" value={`${plannedWeekCount} weeks`} />
            </div>
            {currentLesson ? (
              <div className="mt-6 rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Continue learning
                </p>
                <h3 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
                  {currentLesson.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  {currentLesson.summary}
                </p>
                <div className="mt-5">
                  <Button asChild>
                    <Link href={buildCourseHref("lessons")}>Open lesson</Link>
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    ) : currentView === "lessons" ? (
      <CourseModuleAccordion
        courseId={workspace.course.id}
        courseSlug={workspace.course.slug}
        currentLessonId={currentLesson?.id ?? ""}
        modules={workspace.modules}
      />
    ) : currentView === "announcements" ? (
      <Card>
        <CardContent>
          <SectionHeading icon={<Bell className="h-5 w-5" />} title="Course announcements" />
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
              <EmptyState text="No course announcements have been posted yet." />
            )}
          </div>
        </CardContent>
      </Card>
    ) : currentView === "grades" ? (
      <Card>
        <CardContent>
          <SectionHeading icon={<FileText className="h-5 w-5" />} title="Assessment progress" />
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
              <EmptyState text="No assignments or quizzes are attached to this course yet." />
            )}
          </div>
        </CardContent>
      </Card>
    ) : currentView === "people" ? (
      <Card>
        <CardContent>
          <SectionHeading icon={<UsersRound className="h-5 w-5" />} title="Course people" />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <PersonCard
              name={instructorName}
              role="Lead instructor"
              detail="Course support, grading, announcements, and learning guidance."
            />
            <PersonCard
              name={learnerName}
              role="Current learner"
              detail={`Enrollment status: ${formatEnumLabel(workspace.enrollment.status)}.`}
            />
          </div>
        </CardContent>
      </Card>
    ) : currentView === "materials" ? (
      <Card>
        <CardContent>
          <SectionHeading icon={<Download className="h-5 w-5" />} title="Course materials" />
          <div className="mt-5 grid gap-3">
            {courseResources.length ? (
              courseResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-ink)]">{resource.title}</p>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      {resource.lessonTitle} - {resource.mimeType} - {formatBytes(resource.sizeBytes)}
                    </p>
                  </div>
                  <Button asChild variant="secondary">
                    <Link href={`/api/elearning/resources/${resource.id}`}>Download</Link>
                  </Button>
                </div>
              ))
            ) : (
              <EmptyState text="No downloadable materials have been attached to this course yet." />
            )}
          </div>
        </CardContent>
      </Card>
    ) : (
      <div className="grid gap-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardContent>
              <SectionHeading
                icon={<CalendarDays className="h-5 w-5" />}
                title="Schedule and learning rhythm"
              />
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <InfoPanel
                  title="Course pace"
                  detail={`${selectedOffering ? formatEnumLabel(selectedOffering.pace) : "Fourteen Week"} course with ${plannedWeekCount} planned week(s). Seven-week courses run faster; fourteen-week courses normally run without a mid-course break.`}
                />
                <InfoPanel
                  title="Offering"
                  detail={`${selectedOffering?.title ?? "Open online course"}. Start: ${
                    selectedOffering?.startDate ? formatDate(selectedOffering.startDate) : "Self-paced"
                  }.`}
                />
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
                {assessmentComponents.map((component) => (
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
                ))}
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
                      <InfoPanel
                        title="Preparation"
                        detail={`${week.preparationQuizTitle}. ${week.preparationMaterials} ${week.preparationReading}`}
                      />
                      <InfoPanel title="Teach one another" detail={week.teachOneAnotherTask} />
                      <InfoPanel title="Ponder and prove" detail={week.ponderProveTask} />
                    </div>
                    {week.liveSessionNote ? (
                      <p className="mt-4 rounded-[18px] bg-white px-4 py-3 text-sm leading-7 text-[var(--color-muted)]">
                        {week.liveSessionNote}
                      </p>
                    ) : null}
                  </details>
                ))
              ) : (
                <EmptyState text="Weekly planning has not been published for this course yet." />
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
            {workspace.course.school.name} with {instructorName}. Your lessons, syllabus,
            assessments, people, and materials stay inside this course workspace.
          </p>
          <div className="mt-6">
            <ProgressBar value={workspace.enrollment.progressPercent} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <StatusBadge value={formatEnumLabel(workspace.course.program.level)} />
            <StatusBadge value={formatEnumLabel(workspace.course.deliveryMode)} />
            <StatusBadge value={`${workspace.enrollment.progressPercent}% complete`} tone="success" />
            <StatusBadge value={`${completedLessons}/${totalLessons} lessons`} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[245px_minmax(0,1fr)]">
        <aside className="rounded-[30px] border border-black/6 bg-white p-4 shadow-[0_25px_70px_-58px_rgba(17,17,17,0.45)] xl:sticky xl:top-6 xl:self-start">
          <div className="border-b border-black/8 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Course menu
            </p>
            <p className="font-heading mt-2 text-xl font-bold text-[var(--color-ink)]">
              {workspace.course.program.title}
            </p>
          </div>
          <nav className="mt-4 grid gap-1">
            {courseViews.map((item) => {
              const active = currentView === item.id;
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={buildCourseHref(item.id)}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition",
                    active
                      ? "bg-[var(--color-ink)] text-white shadow-[0_18px_38px_-28px_rgba(17,17,17,0.7)]"
                      : "text-[var(--color-muted)] hover:bg-[#f6f5ef] hover:text-[var(--color-ink)]"
                  )}
                >
                  <Icon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section>{content}</section>
      </div>
    </div>
  );
}

function CourseStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[var(--color-border)] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="font-heading mt-2 text-2xl font-bold text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 text-[var(--color-ink)]">
      {icon}
      <h2 className="font-heading text-2xl font-bold">{title}</h2>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)]">
      {text}
    </div>
  );
}

function InfoPanel({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[18px] border border-[var(--color-border)] bg-white p-4">
      <p className="font-semibold text-[var(--color-ink)]">{title}</p>
      <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{detail}</p>
    </div>
  );
}

function PersonCard({ name, role, detail }: { name: string; role: string; detail: string }) {
  return (
    <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
      <p className="font-semibold text-[var(--color-ink)]">{name}</p>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{role}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{detail}</p>
    </div>
  );
}
