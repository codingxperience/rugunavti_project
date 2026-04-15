import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  MessageSquare,
} from "lucide-react";

import { LessonCompleteToggle } from "@/components/elearning/lesson-complete-toggle";
import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCourseLessons, getDemoCourseBySlug } from "@/data";

export default async function LearnCoursePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { slug } = await params;
  const { lesson } = await searchParams;
  const course = getDemoCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const lessons = getCourseLessons(course);
  const currentLesson =
    lessons.find((item) => item.id === lesson) ??
    lessons.find((item) => item.status === "current") ??
    lessons[0];
  const currentIndex = lessons.findIndex((item) => item.id === currentLesson.id);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="grid gap-4">
        <Card>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Course navigation
            </p>
            <h1 className="font-heading mt-4 text-3xl font-bold text-[var(--color-ink)]">
              {course.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {course.school}
            </p>
            <div className="mt-5">
              <ProgressBar value={course.progress} />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <StatusBadge value={`${course.progress}% complete`} tone="success" />
              <StatusBadge value={course.delivery} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {course.modules.map((module) => (
            <Card key={module.id}>
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-heading text-xl font-bold text-[var(--color-ink)]">
                    {module.title}
                  </h2>
                  <StatusBadge value={`${module.progress}%`} tone="success" />
                </div>
                <div className="mt-4 grid gap-2">
                  {module.lessons.map((item) => {
                    const active = item.id === currentLesson.id;

                    return (
                      <Link
                        key={item.id}
                        href={`/learn/course/${course.slug}?lesson=${item.id}`}
                        className={`rounded-[22px] px-4 py-3 text-sm transition ${
                          active
                            ? "bg-[var(--color-ink)] text-white"
                            : "border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-muted)]"
                        }`}
                      >
                        <p className="font-semibold">{item.title}</p>
                        <p className={`mt-1 text-xs ${active ? "text-white/70" : "text-[var(--color-muted)]"}`}>
                          {item.type} • {item.duration}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </aside>

      <div className="grid gap-6">
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  {currentLesson.moduleTitle}
                </p>
                <h2 className="font-heading mt-3 text-4xl font-bold text-[var(--color-ink)]">
                  {currentLesson.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {currentLesson.summary}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <StatusBadge value={currentLesson.type} />
                <StatusBadge value={currentLesson.duration} tone="success" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="grid gap-4">
                <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Learning objective
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {currentLesson.objective}
                  </p>
                </div>

                <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Key lesson points
                  </p>
                  <div className="mt-4 grid gap-3">
                    {currentLesson.keyPoints.map((point) => (
                      <div
                        key={point}
                        className="rounded-[22px] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]"
                      >
                        {point}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Instructor note
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {currentLesson.instructorNote}
                  </p>
                </div>

                {currentLesson.practicalTask ? (
                  <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      Practical task
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {currentLesson.practicalTask}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4">
                <Card className="bg-[var(--color-ink)] text-white">
                  <CardContent>
                    <h3 className="font-heading text-2xl font-bold">Lesson actions</h3>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <LessonCompleteToggle courseSlug={course.slug} lessonId={currentLesson.id} />
                      <Button
                        asChild
                        variant="secondary"
                        className="border-white/14 bg-white/8 text-white hover:bg-white/14 hover:text-white"
                      >
                        <Link href="/learn/downloads">Open downloads</Link>
                      </Button>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {previousLesson ? (
                        <Button
                          asChild
                          variant="secondary"
                          className="border-white/14 bg-white/8 text-white hover:bg-white/14 hover:text-white"
                        >
                          <Link href={`/learn/course/${course.slug}?lesson=${previousLesson.id}`}>
                            <ArrowLeft className="h-4 w-4" />
                            Previous
                          </Link>
                        </Button>
                      ) : null}
                      {nextLesson ? (
                        <Button asChild>
                          <Link href={`/learn/course/${course.slug}?lesson=${nextLesson.id}`}>
                            Next lesson
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <h3 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                      Downloads and resources
                    </h3>
                    <div className="mt-5 grid gap-3">
                      {currentLesson.resources.map((resource) => (
                        <div
                          key={resource.label}
                          className="flex items-center justify-between gap-3 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                        >
                          <div>
                            <p className="font-semibold text-[var(--color-ink)]">{resource.label}</p>
                            <p className="mt-1 text-sm text-[var(--color-muted)]">
                              {resource.type} • {resource.size}
                            </p>
                          </div>
                          <Download className="h-4 w-4 text-[var(--color-ink)]" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
          <Card>
            <CardContent>
              <h3 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Assignment and quiz entry points
              </h3>
              <div className="mt-5 grid gap-3">
                {currentLesson.assignment ? (
                  <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--color-ink)]">
                          {currentLesson.assignment.title}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                          {currentLesson.assignment.detail}
                        </p>
                      </div>
                      <StatusBadge value={currentLesson.assignment.status} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button asChild>
                        <Link href="/learn/assignments">Open assignments</Link>
                      </Button>
                      <span className="text-sm text-[var(--color-muted)]">
                        Due: {currentLesson.assignment.due}
                      </span>
                    </div>
                  </div>
                ) : null}

                {currentLesson.quiz ? (
                  <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--color-ink)]">{currentLesson.quiz.title}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                          {currentLesson.quiz.detail}
                        </p>
                      </div>
                      <StatusBadge value={currentLesson.quiz.status} tone="success" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button asChild variant="secondary">
                        <Link href="/learn/quizzes">Open quizzes</Link>
                      </Button>
                      <span className="text-sm text-[var(--color-muted)]">
                        Due: {currentLesson.quiz.due}
                      </span>
                    </div>
                  </div>
                ) : null}

                {!currentLesson.assignment && !currentLesson.quiz ? (
                  <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 text-sm leading-7 text-[var(--color-muted)]">
                    This lesson focuses on guided study, instructor notes, and downloadable
                    resources rather than a separate quiz or assignment.
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-[var(--color-ink)]" />
                <h3 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  Lesson discussion
                </h3>
              </div>
              <div className="mt-5 grid gap-3">
                {currentLesson.discussion.length ? (
                  currentLesson.discussion.map((post) => (
                    <div
                      key={`${post.author}-${post.postedAt}-${post.message}`}
                      className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-[var(--color-ink)]">
                          {post.author} • {post.role}
                        </p>
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                          {post.postedAt}
                        </p>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                        {post.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm leading-7 text-[var(--color-muted)]">
                    No discussion posts yet for this lesson. Use course announcements and support if you need help before the next live session.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
