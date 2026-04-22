import Link from "next/link";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLearnerQuizzes } from "@/lib/platform/learning-records";

export const dynamic = "force-dynamic";

export default async function LearnQuizzesPage() {
  const quizzes = await getLearnerQuizzes();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">Quizzes</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review quiz windows, launch the related lesson, and submit attempts from the classroom.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {quizzes.length ? (
          quizzes.map((quiz) => {
            const latestAttempt = quiz.attempts[0];

            return (
              <Card key={quiz.id}>
                <CardContent className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge value="Quiz" />
                      <StatusBadge
                        value={
                          latestAttempt?.passed
                            ? "Passed"
                            : latestAttempt
                              ? "Attempted"
                              : "Available"
                        }
                        tone={latestAttempt?.passed ? "success" : "neutral"}
                      />
                    </div>
                    <h2 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">
                      {quiz.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      {quiz.course.title} - {quiz.lesson?.title ?? "Course quiz"}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{quiz.summary}</p>
                    <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">
                      Passing score: {quiz.passingScore}% - Attempts: {quiz.attempts.length}/{quiz.maxAttempts}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 xl:items-end">
                    <Button asChild>
                      <Link
                        href={`/learn/course/${quiz.course.slug}${
                          quiz.lessonId ? `?lesson=${quiz.lessonId}` : ""
                        }`}
                      >
                        Open quiz lesson
                      </Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link href="/learn/help">Need quiz support</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                No quizzes are available
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Quizzes appear here after you enroll in a course with published assessment checks.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
