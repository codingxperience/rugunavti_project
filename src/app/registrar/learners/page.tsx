import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { getRegistrarWorkspaceRecords } from "@/lib/platform/registrar-records";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Kampala",
  }).format(new Date(value));
}

export default async function RegistrarLearnersPage() {
  const records = await getRegistrarWorkspaceRecords();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Learner records
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Programme enrollments created from admissions decisions and active learning access.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {records.learners.length ? (
          records.learners.map((learner) => (
            <Card key={learner.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                    {learner.learner}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{learner.email}</p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {learner.program} | {learner.school}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Intake: {learner.intake} | Term {learner.currentTerm} | Started {formatDate(learner.startedAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={learner.status} tone={learner.status === "Active" ? "success" : "neutral"} />
                  <StatusBadge
                    value={`${learner.completedCourses}/${learner.courseCount} courses`}
                    tone="neutral"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                No learner records yet
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Learner records are created when admissions activates an approved application.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
