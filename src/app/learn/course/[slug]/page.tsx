import Link from "next/link";
import { notFound } from "next/navigation";
import { Bell, BookOpenText, FileText, UsersRound } from "lucide-react";

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
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Course structure
            </h2>
            <div className="mt-5 grid gap-3">
              <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <p className="font-semibold text-[var(--color-ink)]">Award and delivery</p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  {workspace.course.program.level.replace(/_/g, " ").toLowerCase()} pathway
                  delivered through {workspace.course.deliveryMode.toLowerCase()} study.
                </p>
              </div>
              <div className="rounded-[22px] border border-[var(--color-border)] bg-white p-4">
                <p className="font-semibold text-[var(--color-ink)]">Modules and lessons</p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  {workspace.modules.length} modules and {totalLessons} published lessons are
                  currently available inside this course workspace.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Module outline
            </h2>
            <div className="mt-5 grid gap-3">
              {workspace.modules.map((module, index) => (
                <div
                  key={module.id}
                  className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-[var(--color-ink)]">
                      Module {index + 1}: {module.title.replace(/^Module\s+\d+:\s*/i, "")}
                    </p>
                    <StatusBadge value={`${module.lessons.length} lessons`} />
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {module.summary}
                  </p>
                </div>
              ))}
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
