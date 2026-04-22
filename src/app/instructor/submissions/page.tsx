import { SubmissionGradeForm } from "@/components/elearning/submission-grade-form";
import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStaffSubmissions } from "@/lib/platform/staff-records";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "Not submitted";

  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function InstructorSubmissionsPage() {
  const submissions = await getStaffSubmissions();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Submission review queue
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review incoming learner work, publish feedback, and keep assessment turnaround visible.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {submissions.length ? (
          submissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent>
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_180px] xl:items-start">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                      {submission.taskTitle}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      {submission.learnerName} - {submission.courseTitle}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      Submitted: {formatDate(submission.submittedAt)}
                    </p>
                  </div>
                  <div className="flex justify-start xl:justify-end">
                    <StatusBadge value={submission.status} tone={submission.status === "GRADED" ? "success" : "warning"} />
                  </div>
                </div>
                <SubmissionGradeForm
                  submissionId={submission.id}
                  maxScore={submission.maxScore}
                  currentScore={submission.score}
                  currentFeedback={submission.feedback}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                No submissions yet
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Learner submissions will appear here after students submit assignments from the
                course player.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
