import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgramLevel } from "@prisma/client";
import {
  Bell,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  House,
  Menu,
  MessageSquareText,
  Play,
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
  { id: "announcements", label: "Announcements", icon: Bell },
  { id: "syllabus", label: "Syllabus", icon: CalendarDays },
  { id: "modules", label: "Modules", icon: BookOpenText },
  { id: "grades", label: "Grades", icon: FileText },
  { id: "people", label: "People", icon: UsersRound },
  { id: "materials", label: "Materials", icon: Download },
  { id: "discussions", label: "Discussions", icon: MessageSquareText },
] as const;

type CourseView = (typeof courseViews)[number]["id"];

function isCourseView(value: string | undefined): value is CourseView {
  return courseViews.some((item) => item.id === value);
}

function normalizeCourseView(value: string | undefined, hasLessonQuery: boolean): CourseView {
  if (value === "lessons") return "modules";
  if (isCourseView(value)) return value;

  return hasLessonQuery ? "modules" : "home";
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

function formatDateShort(value: Date | string | null | undefined) {
  if (!value) return "Not scheduled";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-UG", { dateStyle: "medium" }).format(date);
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

function courseCode(title: string) {
  return title
    .split(/\s+/)
    .filter((part) => part.length > 2)
    .slice(0, 2)
    .map((part) => part.slice(0, 3).toUpperCase())
    .join("");
}

function letterGrade(percent: number) {
  if (percent >= 90) return "A";
  if (percent >= 80) return "B";
  if (percent >= 70) return "C";
  if (percent >= 60) return "D";
  return percent > 0 ? "Needs attention" : "Not graded";
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
    const selfEnroll = workspace.course.program.level === ProgramLevel.SHORT_COURSE;

    return (
      <Card>
        <CardContent>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {selfEnroll ? "Enrollment required" : "Admissions placement required"}
          </p>
          <h1 className="font-heading mt-4 text-4xl font-bold text-[var(--color-ink)]">
            {workspace.course.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            {selfEnroll
              ? "This short course opens after enrollment. Ruguna eLearning will create your course record, progress tracker, and assessment workspace."
              : "This course belongs to an academic pathway. Admissions must verify requirements and place your account into the approved intake before course access opens."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {selfEnroll ? (
              <CourseEnrollButton courseSlug={workspace.course.slug} />
            ) : (
              <Button asChild>
                <Link href={`/apply?program=${encodeURIComponent(workspace.course.program.title)}`}>
                  Apply through admissions
                </Link>
              </Button>
            )}
            <Button asChild variant="secondary">
              <Link href="/elearning/courses">Back to catalog</Link>
            </Button>
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
  const selectedOffering = workspace.enrollment.courseOffering ?? workspace.course.offerings[0] ?? null;
  const plannedWeekCount =
    workspace.course.weekPlans.length ||
    (selectedOffering?.pace === "SEVEN_WEEK" ? 7 : selectedOffering?.pace === "FOURTEEN_WEEK" ? 14 : 14);
  const instructorName =
    [workspace.course.owner?.profile?.firstName, workspace.course.owner?.profile?.lastName]
      .filter(Boolean)
      .join(" ") || "Ruguna Instructor";
  const learnerName =
    [workspace.user.profile?.firstName, workspace.user.profile?.lastName].filter(Boolean).join(" ") ||
    workspace.user.email;
  const courseResources = lessons.flatMap((item) =>
    item.resources.map((resource) => ({
      ...resource,
      lessonTitle: item.title,
    }))
  );
  const courseDiscussions = lessons.flatMap((item) =>
    item.discussions.map((thread) => ({
      ...thread,
      lessonTitle: item.title,
    }))
  );
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
  const courseAssessments = lessons.flatMap((item, index) => {
    const entries: Array<{
      id: string;
      type: "Assignment" | "Quiz";
      title: string;
      group: string;
      status: string;
      due: string;
      submitted: string;
      score: number | null;
      maxScore: number;
      lessonTitle: string;
      detail: string;
    }> = [];

    if (item.assignment) {
      const isPresentation = /presentation|teach/i.test(item.assignment.title);

      entries.push({
        id: item.assignment.id,
        type: "Assignment",
        title: item.assignment.title,
        group: isPresentation ? "Teach One Another" : "Ponder and Prove",
        status: item.assignment.submission?.status ?? "Open",
        due: formatDate(item.assignment.dueAt),
        submitted: formatDate(item.assignment.submission?.submittedAt),
        score: item.assignment.submission?.score ?? null,
        maxScore: item.assignment.maxScore,
        lessonTitle: item.title,
        detail: item.assignment.brief,
      });
    }

    if (item.quiz) {
      const latestAttempt = item.quiz.attempts[0] ?? null;

      entries.push({
        id: item.quiz.id,
        type: "Quiz",
        title: item.quiz.title,
        group: "Preparation",
        status: latestAttempt?.passed ? "Passed" : latestAttempt ? "Attempted" : "Available",
        due: item.quiz.timeLimitMinutes ? `${item.quiz.timeLimitMinutes} minute limit` : "Untimed",
        submitted: formatDate(latestAttempt?.submittedAt),
        score: latestAttempt?.score ?? null,
        maxScore: 100,
        lessonTitle: item.title || `Week ${index + 1}`,
        detail: item.quiz.summary,
      });
    }

    return entries;
  });
  const earnedPoints = courseAssessments.reduce((total, item) => total + (item.score ?? 0), 0);
  const possiblePoints = courseAssessments.reduce((total, item) => total + item.maxScore, 0);
  const totalPercent = possiblePoints ? Math.round((earnedPoints / possiblePoints) * 10000) / 100 : 0;
  const gradeGroups = assessmentComponents.map((component) => {
    const items = courseAssessments.filter((item) => item.group === component.title);
    const groupEarned = items.reduce((total, item) => total + (item.score ?? 0), 0);
    const groupPossible = items.reduce((total, item) => total + item.maxScore, 0);
    const percent = groupPossible ? Math.round((groupEarned / groupPossible) * 10000) / 100 : 0;

    return {
      ...component,
      earned: groupEarned,
      possible: groupPossible,
      percent,
      weightedPercent: Math.round(((percent * component.weightPercent) / 100) * 100) / 100,
    };
  });
  const gradedCount = courseAssessments.filter((item) => item.score !== null).length;
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
  const coverImage = workspace.course.thumbnailUrl || "/brand/hero_illustration.jpg";

  const buildCourseHref = (nextView: CourseView) => {
    const nextParams = new URLSearchParams();

    if (currentLesson && nextView === "modules") {
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
      <div className="grid gap-7">
        <section>
          <h2 className="font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--color-ink)]">
            Recent Announcements
          </h2>
          <div className="mt-4 divide-y divide-black/10 border-y border-black/10">
            {workspace.course.announcements.length ? (
              workspace.course.announcements.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={buildCourseHref("announcements")}
                  className="grid gap-3 py-5 md:grid-cols-[72px_minmax(0,1fr)_160px]"
                >
                  <span className="mt-2 h-3 w-3 rounded-full bg-[#0b7fb7]" />
                  <span>
                    <span className="block font-semibold text-[var(--color-ink)]">{item.title}</span>
                    <span className="mt-1 line-clamp-1 block text-sm leading-6 text-[var(--color-muted)]">
                      {item.body}
                    </span>
                  </span>
                  <span className="text-sm text-[var(--color-muted)]">
                    Posted {formatDateShort(item.publishedAt ?? item.createdAt)}
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-5 text-sm leading-7 text-[var(--color-muted)]">
                No announcements have been posted for this course yet.
              </div>
            )}
          </div>
        </section>

        <section>
          <div
            className="min-h-44 rounded-[4px] bg-cover bg-center p-6 text-white"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(17,17,17,0.84), rgba(17,17,17,0.1)), url(${coverImage})`,
            }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#fde047]">
              {courseCode(workspace.course.title)}
            </p>
            <h2 className="font-heading mt-12 max-w-2xl text-4xl font-bold">
              {workspace.course.title}
            </h2>
          </div>

          <h3 className="font-heading mt-5 text-3xl font-bold text-[var(--color-ink)]">
            Welcome to {workspace.course.title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            {workspace.course.description || workspace.course.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`${buildCourseHref("modules")}#start-here`}>Start Here</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={buildCourseHref("people")}>Your Instructor</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={buildCourseHref("syllabus")}>Course Guide</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={buildCourseHref("materials")}>Student Resources</Link>
            </Button>
          </div>

          <h3 className="font-heading mt-8 text-3xl font-bold text-[var(--color-ink)]">Weeks</h3>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {weeklyPlan.map((week) => (
              <Link
                key={week.id}
                href={`${buildCourseHref("modules")}#week-${week.weekNumber}`}
                className="rounded-[5px] bg-[#4a4a4a] px-4 py-3 text-center font-heading text-2xl font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-ink)] hover:text-[#fde047]"
              >
                {String(week.weekNumber).padStart(2, "0")}
              </Link>
            ))}
          </div>
        </section>
      </div>
    ) : currentView === "announcements" ? (
      <Card>
        <CardContent>
          <SectionHeading icon={<Bell className="h-5 w-5" />} title="Announcements" />
          <div className="mt-5 divide-y divide-black/10">
            {workspace.course.announcements.length ? (
              workspace.course.announcements.map((item) => (
                <article key={item.id} className="grid gap-3 py-5 md:grid-cols-[72px_minmax(0,1fr)_180px]">
                  <span className="mt-2 h-3 w-3 rounded-full bg-[#0b7fb7]" />
                  <div>
                    <p className="font-semibold text-[var(--color-ink)]">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{item.body}</p>
                  </div>
                  <p className="text-sm text-[var(--color-muted)]">
                    {formatDate(item.publishedAt ?? item.createdAt)}
                  </p>
                </article>
              ))
            ) : (
              <EmptyState text="No course announcements have been posted yet." />
            )}
          </div>
        </CardContent>
      </Card>
    ) : currentView === "modules" ? (
      <div className="grid gap-5">
        <ModuleSection id="start-here" title="Start Here" completeLabel="Required" defaultOpen>
          <ModuleRow
            title="Course orientation"
            detail="Read this before beginning the weekly sequence."
            href={buildCourseHref("syllabus")}
            status="Reading"
          />
          <ModuleRow
            title="Student resources"
            detail="Download course materials, templates, and support documents."
            href={buildCourseHref("materials")}
            status="Resources"
          />
          <ModuleRow
            title="Meet your instructor"
            detail={`${instructorName} supports announcements, grading, and course guidance.`}
            href={buildCourseHref("people")}
            status="People"
          />
        </ModuleSection>

        {weeklyPlan.map((week) => {
          const lessonForWeek = lessons[(week.weekNumber - 1) % Math.max(lessons.length, 1)];
          const quizForWeek = courseAssessments.filter((item) => item.type === "Quiz")[week.weekNumber - 1];
          const assignmentForWeek =
            courseAssessments.filter((item) => item.type === "Assignment")[week.weekNumber - 1] ??
            courseAssessments.find((item) => item.group === "Ponder and Prove");

          return (
            <ModuleSection
              key={week.id}
              id={`week-${week.weekNumber}`}
              title={`Week ${String(week.weekNumber).padStart(2, "0")}: ${week.title.replace(/^Week\s+\d+:\s*/i, "")}`}
              completeLabel={lessonForWeek?.completed ? "Complete" : "Open"}
              defaultOpen={week.weekNumber === 1}
            >
              <ModuleRow
                title={week.preparationQuizTitle}
                detail="Quiz and reading checks"
                href={quizForWeek ? buildCourseHref("grades") : buildCourseHref("syllabus")}
                status="Preparation"
                complete={Boolean(quizForWeek?.score)}
              />
              <ModuleRow
                title={lessonForWeek?.title ?? week.title}
                detail={`${lessonForWeek?.type ?? "Lesson"} • ${lessonForWeek?.duration ?? "Self-paced"}`}
                href={
                  lessonForWeek
                    ? `/learn/course/${workspace.course.slug}?lesson=${lessonForWeek.id}&view=modules`
                    : buildCourseHref("syllabus")
                }
                status={lessonForWeek?.completed ? "Complete" : "Lesson"}
                complete={lessonForWeek?.completed}
              />
              <ModuleRow
                title={`W${String(week.weekNumber).padStart(2, "0")} Teach One Another`}
                detail="Presentation • group activity"
                href={buildCourseHref("discussions")}
                status="Presentation"
              />
              <ModuleRow
                title={assignmentForWeek?.title ?? `W${String(week.weekNumber).padStart(2, "0")} Paper`}
                detail="Paper • Ponder and Prove"
                href={buildCourseHref("grades")}
                status={assignmentForWeek?.status ?? "Ponder and Prove"}
                complete={Boolean(assignmentForWeek?.score)}
              />
              {week.liveSessionNote ? (
                <ModuleRow
                  title={`W${String(week.weekNumber).padStart(2, "0")} Live or blended session`}
                  detail="Live • blended session"
                  href={buildCourseHref("announcements")}
                  status="Live"
                />
              ) : null}
            </ModuleSection>
          );
        })}

        {currentLesson ? (
          <Card>
            <CardContent>
              <SectionHeading icon={<Play className="h-5 w-5" />} title="Lesson classroom" />
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Select a lesson row above or continue from the active lesson below.
              </p>
              <div className="mt-5">
                <CourseModuleAccordion
                  courseId={workspace.course.id}
                  courseSlug={workspace.course.slug}
                  currentLessonId={currentLesson.id}
                  modules={workspace.modules}
                />
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    ) : currentView === "grades" ? (
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-5">
              <div>
                <h2 className="font-heading text-3xl font-bold tracking-[-0.04em] text-[var(--color-ink)]">
                  Grades for {learnerName}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  Assignments are weighted by the course grading model.
                </p>
              </div>
              <div className="rounded-[8px] border border-black/10 bg-[#f6f7f7] px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">Total</p>
                <p className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  {totalPercent}% ({letterGrade(totalPercent)})
                </p>
              </div>
            </div>

            <form className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_100px]">
              <input type="hidden" name="view" value="grades" />
              <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Course
                <select
                  name="course"
                  defaultValue={workspace.course.slug}
                  className="h-11 rounded-[4px] border border-black/12 bg-white px-3 text-sm normal-case tracking-normal text-[var(--color-ink)]"
                >
                  <option value={workspace.course.slug}>{workspace.course.title}</option>
                </select>
              </label>
              <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                Arrange by
                <select
                  name="arrange"
                  defaultValue="due"
                  className="h-11 rounded-[4px] border border-black/12 bg-white px-3 text-sm normal-case tracking-normal text-[var(--color-ink)]"
                >
                  <option value="due">Due date</option>
                  <option value="group">Group</option>
                  <option value="score">Score</option>
                </select>
              </label>
              <Button type="submit" variant="secondary" className="self-end rounded-[4px]">
                Apply
              </Button>
            </form>

            <div id="grades-table" className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-black/12 text-xs font-semibold text-[var(--color-muted)]">
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Due</th>
                    <th className="py-3 pr-4">Submitted</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {courseAssessments.length ? (
                    courseAssessments.map((item) => (
                      <tr key={item.id} className="border-b border-black/8 align-top">
                        <td className="py-3 pr-4">
                          <Link href={buildCourseHref("modules")} className="font-semibold text-[#0b74aa] hover:underline">
                            {item.title}
                          </Link>
                          <p className="mt-1 text-xs text-[var(--color-muted)]">{item.group}</p>
                        </td>
                        <td className="py-3 pr-4 text-[var(--color-muted)]">{item.due}</td>
                        <td className="py-3 pr-4 text-[var(--color-muted)]">{item.submitted}</td>
                        <td className="py-3 pr-4">
                          <StatusBadge
                            value={item.status}
                            tone={/graded|passed|complete/i.test(item.status) ? "success" : "neutral"}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right font-semibold text-[var(--color-ink)]">
                          {item.score ?? "-"} / {item.maxScore}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-[var(--color-muted)]">
                        No assignments or quizzes are attached to this course yet.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  {gradeGroups.map((group) => (
                    <tr key={group.id} className="border-b border-black/8">
                      <td className="py-3 pr-4 font-semibold text-[var(--color-ink)]" colSpan={3}>
                        {group.title}
                      </td>
                      <td className="py-3 pr-4 text-[var(--color-muted)]">{group.percent}%</td>
                      <td className="py-3 pr-4 text-right font-semibold text-[var(--color-ink)]">
                        {group.earned.toFixed(1)} / {group.possible.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-black/25">
                    <td className="py-4 font-bold text-[var(--color-ink)]" colSpan={4}>
                      Total
                    </td>
                    <td className="py-4 pr-4 text-right font-bold text-[var(--color-ink)]">
                      {totalPercent}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        <aside className="grid gap-4 xl:sticky xl:top-6 xl:self-start">
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                {totalPercent}% ({letterGrade(totalPercent)})
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {gradedCount} of {courseAssessments.length} graded items recorded.
              </p>
              <Button asChild variant="secondary" className="mt-5 w-full rounded-[4px]">
                <Link href="/learn/certificates">View certificates</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-heading text-xl font-bold text-[var(--color-ink)]">
                Weighted groups
              </h2>
              <div className="mt-4 overflow-hidden rounded-[4px] border border-black/10">
                <div className="grid grid-cols-[minmax(0,1fr)_70px] bg-[#f4f5f5] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  <span>Group</span>
                  <span className="text-right">Weight</span>
                </div>
                {gradeGroups.map((component) => (
                  <div
                    key={component.id}
                    className="grid grid-cols-[minmax(0,1fr)_70px] border-t border-black/8 px-3 py-3 text-sm"
                  >
                    <span className="text-[var(--color-muted)]">{component.title}</span>
                    <span className="text-right font-bold text-[var(--color-ink)]">
                      {component.weightPercent}%
                    </span>
                  </div>
                ))}
                <div className="grid grid-cols-[minmax(0,1fr)_70px] border-t border-black/12 px-3 py-3 text-sm font-bold text-[var(--color-ink)]">
                  <span>Total</span>
                  <span className="text-right">100%</span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-6 text-[var(--color-muted)]">
                Scores marked as unsubmitted are not counted until the instructor records or
                releases the grade.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    ) : currentView === "people" ? (
      <Card>
        <CardContent>
          <SectionHeading icon={<UsersRound className="h-5 w-5" />} title="People" />
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <InfoPanel
              title="Instructor"
              detail={`${instructorName} handles announcements, feedback, grading, and course guidance.`}
            />
            <InfoPanel
              title="Learners"
              detail={`${workspace.roster.length} active learner record(s) are connected to this course.`}
            />
            <InfoPanel
              title="Support"
              detail="Use Help for access questions and Discussions for course questions."
            />
          </div>

          <div className="mt-6 overflow-hidden rounded-[4px] border border-black/10">
            <div className="grid grid-cols-[minmax(0,1.3fr)_130px_120px_90px] bg-[#f4f5f5] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)] max-md:hidden">
              <span>Name</span>
              <span>Role</span>
              <span>Status</span>
              <span className="text-right">Progress</span>
            </div>
            <PersonRow
              name={instructorName}
              email={workspace.course.owner?.email ?? "instructor@ruguna.local"}
              role="Instructor"
              status="Teaching"
              progress={100}
              location={workspace.course.school.name}
            />
            {workspace.roster.length ? (
              workspace.roster.map((person) => (
                <PersonRow
                  key={person.id}
                  name={person.name}
                  email={person.email}
                  role={person.userId === workspace.user.id ? "You" : "Learner"}
                  status={formatEnumLabel(person.status)}
                  progress={person.progress}
                  location={person.location}
                />
              ))
            ) : (
              <div className="px-4 py-6 text-sm text-[var(--color-muted)]">
                No learner roster is visible for this course yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    ) : currentView === "materials" ? (
      <Card>
        <CardContent>
          <SectionHeading icon={<Download className="h-5 w-5" />} title="Course Materials" />
          <div className="mt-5 grid gap-3">
            {courseResources.length ? (
              courseResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex flex-wrap items-center justify-between gap-4 border-b border-black/8 py-4"
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
    ) : currentView === "discussions" ? (
      <Card>
        <CardContent>
          <SectionHeading icon={<MessageSquareText className="h-5 w-5" />} title="Discussions" />
          <div className="mt-5 grid gap-3">
            {courseDiscussions.length ? (
              courseDiscussions.map((thread) => (
                <article
                  key={thread.id}
                  className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                >
                  <p className="font-semibold text-[var(--color-ink)]">{thread.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{thread.body}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    {thread.authorName} - {thread.lessonTitle} - {thread.replyCount} replies
                  </p>
                </article>
              ))
            ) : (
              <EmptyState text="No discussion threads have been opened for this course yet." />
            )}
          </div>
        </CardContent>
      </Card>
    ) : (
      <div className="grid gap-5">
        <Card>
          <CardContent>
            <SectionHeading icon={<CalendarDays className="h-5 w-5" />} title="Syllabus" />
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
              This course uses a {plannedWeekCount}-week rhythm. Each week connects preparation,
              peer teaching, and proof-of-learning work so expectations are visible before
              deadlines arrive.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <InfoPanel
                title="Course pace"
                detail={`${selectedOffering ? formatEnumLabel(selectedOffering.pace) : "Fourteen Week"} course with ${plannedWeekCount} planned week(s).`}
              />
              <InfoPanel
                title="Offering"
                detail={`${selectedOffering?.title ?? "Open online course"}. Start: ${
                  selectedOffering?.startDate ? formatDate(selectedOffering.startDate) : "Self-paced"
                }.`}
              />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {assessmentComponents.map((component) => (
                <InfoPanel
                  key={component.id}
                  title={`${component.title} (${component.weightPercent}%)`}
                  detail={component.description}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Weekly course plan
            </h2>
            <div className="mt-5 grid gap-3">
              {weeklyPlan.map((week) => (
                <Link
                  key={week.id}
                  href={`${buildCourseHref("modules")}#week-${week.weekNumber}`}
                  className="grid gap-3 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 transition hover:-translate-y-0.5 hover:bg-white md:grid-cols-[120px_minmax(0,1fr)]"
                >
                  <p className="font-heading text-xl font-bold text-[var(--color-ink)]">
                    Week {week.weekNumber}
                  </p>
                  <div>
                    <p className="font-semibold text-[var(--color-ink)]">{week.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{week.topic}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="grid gap-6 xl:grid-cols-[180px_minmax(0,1fr)]">
      <aside className="xl:sticky xl:top-6 xl:self-start">
        <details open className="overflow-hidden rounded-[4px] border border-black/10 bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 border-b border-black/10 px-4 py-3 marker:hidden">
            <span>
              <span className="block text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                {courseCode(workspace.course.title)}
              </span>
              <span className="mt-1 block text-sm font-bold text-[var(--color-ink)]">Course menu</span>
            </span>
            <Menu className="h-4 w-4 text-[var(--color-ink)]" />
          </summary>
          <nav className="grid gap-0 py-2">
            {courseViews.map((item) => {
              const active = currentView === item.id;
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={buildCourseHref(item.id)}
                  className={cn(
                    "group flex items-center gap-3 border-l-4 px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "border-[var(--color-ink)] bg-[#fff8c5] text-[var(--color-ink)]"
                      : "border-transparent text-[#0b74aa] hover:border-[#fde047] hover:bg-[#fbfaf4] hover:text-[var(--color-ink)]"
                  )}
                >
                  <Icon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </details>
      </aside>

      <main className="min-w-0">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <p className="text-sm text-[var(--color-muted)]">{workspace.course.school.name}</p>
            <h1 className="font-heading mt-2 text-4xl font-bold tracking-[-0.04em] text-[var(--color-ink)]">
              {workspace.course.title}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {completedLessons}/{totalLessons} lessons complete
            </p>
          </div>
          <div className="w-full max-w-[220px]">
            <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              <span>Progress</span>
              <span>{workspace.enrollment.progressPercent}%</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={workspace.enrollment.progressPercent} />
            </div>
          </div>
        </div>
        {content}
      </main>

    </div>
  );
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 text-[var(--color-ink)]">
      {icon}
      <h2 className="font-heading text-3xl font-bold tracking-[-0.04em]">{title}</h2>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)]">
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

function initialsFor(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "R"
  );
}

function PersonRow({
  name,
  email,
  role,
  status,
  progress,
  location,
}: {
  name: string;
  email: string;
  role: string;
  status: string;
  progress: number;
  location: string;
}) {
  return (
    <div className="grid gap-3 border-t border-black/8 px-4 py-4 md:grid-cols-[minmax(0,1.3fr)_130px_120px_90px] md:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-bold text-white">
          {initialsFor(name)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold text-[var(--color-ink)]">{name}</span>
          <span className="mt-1 block truncate text-xs text-[var(--color-muted)]">
            {email} - {location}
          </span>
        </span>
      </div>
      <p className="text-sm font-semibold text-[var(--color-ink)]">{role}</p>
      <p className="text-sm text-[var(--color-muted)]">{status}</p>
      <p className="text-sm font-bold text-[var(--color-ink)] md:text-right">{progress}%</p>
    </div>
  );
}

function ModuleSection({
  id,
  title,
  completeLabel,
  defaultOpen = false,
  children,
}: {
  id: string;
  title: string;
  completeLabel: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group overflow-hidden border-b border-[#b9c4d5] bg-white"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-3 py-4 marker:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-lg text-[var(--color-ink)] transition group-open:rotate-180">^</span>
          <h2 className="truncate text-base font-bold text-[var(--color-ink)]">{title}</h2>
        </div>
        <span className="rounded-[4px] bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
          {completeLabel}
        </span>
      </summary>
      <div className="grid gap-0 pb-3">{children}</div>
    </details>
  );
}

function ModuleRow({
  title,
  detail,
  href,
  status,
  complete = true,
}: {
  title: string;
  detail: string;
  href: string;
  status: string;
  complete?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group grid gap-3 px-3 py-3 transition hover:bg-[#fbfaf4] md:grid-cols-[34px_minmax(0,1fr)_140px]"
    >
      <span
        className={cn(
          "mt-1 flex h-5 w-5 items-center justify-center rounded-full text-white",
          complete ? "bg-[#2f7d32]" : "border border-black/20 bg-white text-[var(--color-muted)]"
        )}
      >
        {complete ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
      </span>
      <span>
        <span className="block text-base font-medium text-[var(--color-ink)] group-hover:text-[#0b74aa]">
          {title}
        </span>
        <span className="mt-1 block text-sm leading-5 text-[var(--color-muted)]">{detail}</span>
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)] md:text-right">
        {status}
      </span>
    </Link>
  );
}
