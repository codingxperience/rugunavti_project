import Link from "next/link";

import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLearnerAssignments } from "@/lib/platform/learning-records";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

function formatDate(value: Date | null) {
  if (!value) return "No fixed deadline";

  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function LearnAssignmentsPage() {
  const session = await requireRole(["student", "super_admin"], "/learn/assignments");
  const assignments = await getLearnerAssignments(session);

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Assignments
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Track assignment windows, read briefs, and open the connected lesson to submit work.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {assignments.length ? (
          assignments.map((assignment) => {
            const submission = assignment.submissions[0];

            return (
              <Card key={assignment.id}>
                <CardContent className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge value="Assignment" />
                      <StatusBadge
                        value={submission?.status ?? "Open"}
                        tone={submission ? "success" : "warning"}
                      />
                    </div>
                    <h2 className="font-heading mt-4 text-2xl font-bold text-[var(--color-ink)]">
                      {assignment.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      {assignment.course.title} - {assignment.lesson?.title ?? "Course assignment"}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                      {assignment.brief}
                    </p>
                    <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">
                      Due: {formatDate(assignment.dueAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 xl:items-end">
                    <Button asChild>
                      <Link
                        href={`/learn/course/${assignment.course.slug}${
                          assignment.lessonId ? `?lesson=${assignment.lessonId}` : ""
                        }`}
                      >
                        Open lesson
                      </Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link href="/learn/help">Get submission help</Link>
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
                No assignments are open
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Assignments appear here after you enroll in a course that has published assessment
                tasks.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
