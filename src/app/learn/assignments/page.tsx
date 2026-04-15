import Link from "next/link";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { learnerAssignments } from "@/data";

export default function LearnAssignmentsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Assignments
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Track assignment windows, read briefs, and return to the related lesson when needed.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {learnerAssignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardContent className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge value={assignment.type} />
                  <StatusBadge value={assignment.status} tone="warning" />
                </div>
                <h2 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">
                  {assignment.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {assignment.courseTitle} • {assignment.lessonTitle}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  {assignment.detail}
                </p>
                <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">
                  Due: {assignment.due}
                </p>
              </div>
              <div className="flex flex-col gap-3 xl:items-end">
                <Button asChild>
                  <Link href={`/learn/course/${assignment.courseSlug}`}>Open lesson</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/learn/help">Get submission help</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
