"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { LessonActionPanel } from "@/components/elearning/lesson-action-panel";
import { StatusBadge } from "@/components/platform/status-badge";
import { cn } from "@/lib/utils";

export type CourseWorkspaceModule = {
  id: string;
  title: string;
  summary: string;
  progress: number;
  lessons: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    type: string;
    duration: string;
    completed: boolean;
    objective: string;
    keyPoints: string[];
    instructorNote: string;
    practicalTask: string;
    resources: {
      id: string;
      title: string;
      description: string | null;
      mimeType: string;
      sizeBytes: number;
      isPrivate: boolean;
    }[];
    assignment: {
      id: string;
      title: string;
      brief: string;
      instructions: string;
      dueAt: string | null;
      maxScore: number;
      submission: {
        id: string;
        status: string;
        score: number | null;
        feedback: string | null;
        submittedAt: string | null;
      } | null;
    } | null;
    quiz: {
      id: string;
      title: string;
      summary: string;
      instructions: string;
      timeLimitMinutes: number | null;
      passingScore: number;
      maxAttempts: number;
      attempts: {
        id: string;
        score: number | null;
        passed: boolean | null;
        submittedAt: string | null;
      }[];
      questions: {
        id: string;
        prompt: string;
        questionType: string;
        options: unknown;
        points: number;
      }[];
    } | null;
    discussions: {
      id: string;
      title: string;
      body: string;
      authorName: string;
      replyCount: number;
      createdAt: string;
    }[];
  }[];
};

type CourseModuleAccordionProps = {
  courseId: string;
  courseSlug: string;
  currentLessonId: string;
  modules: CourseWorkspaceModule[];
  defaultExpandAll?: boolean;
};

export function CourseModuleAccordion({
  courseId,
  courseSlug,
  currentLessonId,
  modules,
  defaultExpandAll = false,
}: CourseModuleAccordionProps) {
  const [openModules, setOpenModules] = useState<string[]>(
    defaultExpandAll ? modules.map((module) => module.id) : []
  );

  const toggleModule = (moduleId: string) => {
    setOpenModules((current) =>
      current.includes(moduleId)
        ? current.filter((item) => item !== moduleId)
        : [...current, moduleId]
    );
  };

  return (
    <div className="grid gap-2.5">
      {modules.map((module, moduleIndex) => {
        const isOpen = openModules.includes(module.id);

        return (
          <section
            key={module.id}
            className="overflow-hidden rounded-[24px] border border-black/8 bg-white/90 shadow-[0_18px_55px_-52px_rgba(17,17,17,0.45)]"
          >
            <button
              type="button"
              onClick={() => toggleModule(module.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[#fbfaf4]"
            >
              <span className="min-w-0">
                <span className="font-heading block truncate text-lg font-bold text-[var(--color-ink)]">
                  Module {moduleIndex + 1}: {module.title.replace(/^Module\s+\d+:\s*/i, "")}
                </span>
                <span className="mt-2 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  <span>{module.lessons.length} lessons</span>
                  <span>{module.progress}% complete</span>
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-[var(--color-muted)] transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            {isOpen ? (
              <div className="border-t border-black/8 bg-[#fbfaf4] px-4 pb-4 pt-4">
                <div className="grid gap-3">
                  {module.lessons.map((lesson) => {
                    const active = lesson.id === currentLessonId || lesson.slug === currentLessonId;

                    return (
                      <article
                        key={lesson.id}
                        className={cn(
                          "rounded-[22px] border px-4 py-4 transition",
                          active
                            ? "border-[#f3d53b] bg-white shadow-[0_18px_35px_-30px_rgba(17,17,17,0.5)]"
                            : "border-[var(--color-border)] bg-white"
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <Link href={`/learn/course/${courseSlug}?lesson=${lesson.id}`}>
                            <p className="font-semibold text-[var(--color-ink)]">{lesson.title}</p>
                            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                              {lesson.summary}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                              <span>{lesson.type}</span>
                              <span>{lesson.duration}</span>
                            </div>
                          </Link>
                          <StatusBadge
                            value={lesson.completed ? "Complete" : active ? "Current" : "Open"}
                            tone={lesson.completed ? "success" : "neutral"}
                          />
                        </div>

                        {active ? (
                          <LessonActionPanel
                            courseId={courseId}
                            courseSlug={courseSlug}
                            lessonId={lesson.id}
                            completed={lesson.completed}
                            objective={lesson.objective}
                            keyPoints={lesson.keyPoints}
                            instructorNote={lesson.instructorNote}
                            practicalTask={lesson.practicalTask}
                            resources={lesson.resources}
                            assignment={lesson.assignment}
                            quiz={lesson.quiz}
                          />
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
