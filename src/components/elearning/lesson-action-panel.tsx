"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type LessonResource = {
  id: string;
  title: string;
  description: string | null;
  mimeType: string;
  sizeBytes: number;
};

type LessonAssignment = {
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
};

type LessonQuiz = {
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
};

type LessonActionPanelProps = {
  courseSlug: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  objective: string;
  keyPoints: string[];
  instructorNote: string;
  practicalTask: string;
  resources: LessonResource[];
  assignment: LessonAssignment | null;
  quiz: LessonQuiz | null;
};

function formatDate(value: Date | string | null) {
  if (!value) return "No fixed deadline";

  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatBytes(value: number) {
  if (value < 1024 * 1024) {
    return `${Math.max(Math.round(value / 1024), 1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function optionEntries(options: unknown) {
  if (!options || typeof options !== "object" || Array.isArray(options)) {
    return [] as { value: string; label: string }[];
  }

  return Object.entries(options as Record<string, unknown>).map(([value, label]) => ({
    value,
    label: String(label),
  }));
}

export function LessonActionPanel({
  courseSlug,
  courseId,
  lessonId,
  completed,
  objective,
  keyPoints,
  instructorNote,
  practicalTask,
  resources,
  assignment,
  quiz,
}: LessonActionPanelProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [assignmentBody, setAssignmentBody] = useState("");
  const [assignmentFileUrl, setAssignmentFileUrl] = useState("");
  const [quizResponses, setQuizResponses] = useState<Record<string, string>>({});
  const [discussionTitle, setDiscussionTitle] = useState("");
  const [discussionBody, setDiscussionBody] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  async function postJson(url: string, body: unknown, action: string) {
    setPendingAction(action);
    setMessage(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as { success: boolean; message: string };

      setMessage(payload.message);

      if (response.ok && payload.success) {
        startTransition(() => {
          router.refresh();
        });
      }

      return response.ok && payload.success;
    } catch {
      setMessage("Action failed. Check your connection and try again.");
      return false;
    } finally {
      setPendingAction(null);
    }
  }

  async function markComplete() {
    await postJson(
      "/api/elearning/progress",
      { courseSlug, lessonId, completed: true },
      "progress"
    );
  }

  async function submitAssignment() {
    if (!assignment) return;

    const saved = await postJson(
      "/api/elearning/submissions",
      {
        assignmentId: assignment.id,
        body: assignmentBody || undefined,
        fileUrl: assignmentFileUrl || undefined,
      },
      "assignment"
    );

    if (saved) {
      setAssignmentBody("");
      setAssignmentFileUrl("");
    }
  }

  async function submitQuiz() {
    if (!quiz) return;

    const saved = await postJson(
      "/api/elearning/quizzes/attempts",
      {
        quizId: quiz.id,
        answers: quiz.questions.map((question) => {
          const rawResponse = quizResponses[question.id] ?? "";
          const response =
            question.questionType === "TRUE_FALSE" ? rawResponse === "true" : rawResponse;

          return { questionId: question.id, response };
        }),
      },
      "quiz"
    );

    if (saved) {
      setQuizResponses({});
    }
  }

  async function postDiscussion() {
    const saved = await postJson(
      "/api/elearning/discussions",
      {
        courseId,
        lessonId,
        title: discussionTitle,
        body: discussionBody,
      },
      "discussion"
    );

    if (saved) {
      setDiscussionTitle("");
      setDiscussionBody("");
    }
  }

  return (
    <div className="mt-5 grid gap-4 border-t border-[var(--color-border)] pt-5">
      {objective || keyPoints.length || instructorNote || practicalTask ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {objective ? (
            <div className="rounded-[22px] border border-[var(--color-border)] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Learning objective
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{objective}</p>
            </div>
          ) : null}
          {keyPoints.length ? (
            <div className="rounded-[22px] border border-[var(--color-border)] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Key lesson points
              </p>
              <ul className="mt-3 grid gap-2 text-sm leading-7 text-[var(--color-muted)]">
                {keyPoints.map((point) => (
                  <li key={point}>- {point}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {instructorNote ? (
            <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Instructor note
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{instructorNote}</p>
            </div>
          ) : null}
          {practicalTask ? (
            <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-soft-accent)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Practical task
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{practicalTask}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={markComplete} disabled={completed || pendingAction === "progress"}>
          {completed ? "Marked complete" : pendingAction === "progress" ? "Saving..." : "Mark lesson complete"}
        </Button>
        <StatusBadge value={completed ? "Completed" : "In progress"} tone={completed ? "success" : "neutral"} />
        {message ? <p className="text-sm text-[var(--color-muted)]">{message}</p> : null}
      </div>

      {resources.length ? (
        <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-4">
          <p className="font-semibold text-[var(--color-ink)]">Downloads and resources</p>
          <div className="mt-3 grid gap-2">
            {resources.map((resource) => (
              <Link
                key={resource.id}
                href={`/api/elearning/resources/${resource.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm"
              >
                <span className="font-semibold text-[var(--color-ink)]">{resource.title}</span>
                <span className="text-[var(--color-muted)]">
                  {resource.mimeType} - {formatBytes(resource.sizeBytes)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {assignment ? (
        <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-[var(--color-ink)]">{assignment.title}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{assignment.brief}</p>
              <p className="mt-2 text-sm font-medium text-[var(--color-ink)]">
                Due: {formatDate(assignment.dueAt)}
              </p>
            </div>
            {assignment.submission ? (
              <StatusBadge value={assignment.submission.status} tone="success" />
            ) : (
              <StatusBadge value="Open" tone="warning" />
            )}
          </div>

          <div className="mt-4 grid gap-3">
            <Textarea
              value={assignmentBody}
              onChange={(event) => setAssignmentBody(event.target.value)}
              placeholder="Write submission notes, evidence, or a short explanation for your instructor."
            />
            <Input
              value={assignmentFileUrl}
              onChange={(event) => setAssignmentFileUrl(event.target.value)}
              placeholder="Optional file URL after upload"
              type="url"
            />
            <Button
              type="button"
              onClick={submitAssignment}
              disabled={pendingAction === "assignment" || (!assignmentBody && !assignmentFileUrl)}
            >
              {pendingAction === "assignment" ? "Submitting..." : "Submit assignment"}
            </Button>
          </div>
        </div>
      ) : null}

      {quiz ? (
        <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-[var(--color-ink)]">{quiz.title}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{quiz.summary}</p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Passing score: {quiz.passingScore}% - Attempts used: {quiz.attempts.length}/{quiz.maxAttempts}
              </p>
            </div>
            {quiz.attempts[0] ? (
              <StatusBadge
                value={`${quiz.attempts[0].score ?? 0}% ${quiz.attempts[0].passed ? "passed" : "submitted"}`}
                tone={quiz.attempts[0].passed ? "success" : "warning"}
              />
            ) : (
              <StatusBadge value="Available" tone="success" />
            )}
          </div>

          <div className="mt-4 grid gap-4">
            {quiz.questions.map((question) => {
              const options = optionEntries(question.options);

              return (
                <fieldset key={question.id} className="grid gap-3 rounded-[20px] bg-[var(--color-surface-alt)] p-4">
                  <legend className="font-semibold text-[var(--color-ink)]">{question.prompt}</legend>
                  {options.length ? (
                    <div className="flex flex-wrap gap-3">
                      {options.map((option) => (
                        <label key={option.value} className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
                          <input
                            checked={quizResponses[question.id] === option.value}
                            name={question.id}
                            onChange={() =>
                              setQuizResponses((current) => ({
                                ...current,
                                [question.id]: option.value,
                              }))
                            }
                            type="radio"
                            value={option.value}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <Input
                      value={quizResponses[question.id] ?? ""}
                      onChange={(event) =>
                        setQuizResponses((current) => ({
                          ...current,
                          [question.id]: event.target.value,
                        }))
                      }
                      placeholder="Type your answer"
                    />
                  )}
                </fieldset>
              );
            })}

            <Button
              type="button"
              onClick={submitQuiz}
              disabled={
                pendingAction === "quiz" ||
                quiz.attempts.length >= quiz.maxAttempts ||
                quiz.questions.some((question) => !quizResponses[question.id])
              }
            >
              {pendingAction === "quiz" ? "Submitting..." : "Submit quiz"}
            </Button>
          </div>
        </div>
      ) : null}

      <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-4">
        <p className="font-semibold text-[var(--color-ink)]">Lesson discussion</p>
        <div className="mt-4 grid gap-3">
          <Input
            value={discussionTitle}
            onChange={(event) => setDiscussionTitle(event.target.value)}
            placeholder="Short discussion title"
          />
          <Textarea
            value={discussionBody}
            onChange={(event) => setDiscussionBody(event.target.value)}
            placeholder="Ask a question or share what you need clarified."
          />
          <Button
            type="button"
            onClick={postDiscussion}
            disabled={pendingAction === "discussion" || discussionTitle.length < 3 || discussionBody.length < 3}
          >
            {pendingAction === "discussion" ? "Posting..." : "Post discussion"}
          </Button>
        </div>
      </div>
    </div>
  );
}
