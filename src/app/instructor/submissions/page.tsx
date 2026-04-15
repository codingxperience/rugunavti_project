import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { instructorSubmissions } from "@/data";

export default function InstructorSubmissionsPage() {
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
        {instructorSubmissions.map((submission) => (
          <Card key={`${submission.learner}-${submission.task}`}>
            <CardContent className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_180px] xl:items-center">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  {submission.task}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {submission.learner} • {submission.course}
                </p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Submitted: {submission.submittedAt}
                </p>
              </div>
              <div className="flex justify-start xl:justify-end">
                <StatusBadge value={submission.status} tone="warning" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
