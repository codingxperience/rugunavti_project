import { Card, CardContent } from "@/components/ui/card";
import { getLearnerWorkspaceRecords } from "@/lib/platform/learning-records";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function LearnAnnouncementsPage() {
  const session = await requireRole(["student", "super_admin"], "/learn/announcements");
  const workspace = await getLearnerWorkspaceRecords(session);

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Announcements
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Platform-wide updates and course-level learning notices from your active Ruguna
            eLearning record.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {workspace.announcements.length ? (
          workspace.announcements.map((item) => (
            <Card key={item.id}>
              <CardContent>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {item.scope.toLowerCase().replace(/_/g, " ")} announcement
                </p>
                <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.body}</p>
                <p className="mt-4 text-sm font-semibold text-[var(--color-ink)]">
                  {formatDate(item.publishedAt ?? item.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                No announcements yet
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Course and platform notices will appear here after Ruguna staff publish them.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
