import Link from "next/link";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { learnerQuizzes } from "@/data";

export default function LearnQuizzesPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">Quizzes</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review quiz windows, launch the related lesson, and keep track of completion status.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {learnerQuizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardContent className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge value={quiz.type} />
                  <StatusBadge value={quiz.status} tone="success" />
                </div>
                <h2 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">
                  {quiz.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {quiz.courseTitle} • {quiz.lessonTitle}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{quiz.detail}</p>
                <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">
                  Due: {quiz.due}
                </p>
              </div>
              <div className="flex flex-col gap-3 xl:items-end">
                <Button asChild>
                  <Link href={`/learn/course/${quiz.courseSlug}`}>Open lesson</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/learn/help">Need quiz support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
