import { RegistrarApplicationsList } from "@/components/platform/registrar-applications-list";
import { Card, CardContent } from "@/components/ui/card";
import { getRegistrarWorkspaceRecords } from "@/lib/platform/registrar-records";

export const dynamic = "force-dynamic";

const statusMessages: Record<string, string> = {
  "application-updated": "Application decision saved.",
  "enrollment-activated": "Learner programme record activated.",
  "invalid-status": "Application status could not be validated.",
  "invalid-activation": "Learning plan activation could not be validated.",
  "application-not-found": "Application was not found.",
};

export default async function RegistrarApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const [{ status }, records] = await Promise.all([searchParams, getRegistrarWorkspaceRecords()]);
  const statusMessage = status ? statusMessages[status] : null;

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Applications
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Manage submitted admissions records, documents, status decisions, and the first learner record activation.
          </p>
        </CardContent>
      </Card>

      {statusMessage ? (
        <Card className={status?.startsWith("invalid") || status === "application-not-found" ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}>
          <CardContent>
            <p className={status?.startsWith("invalid") || status === "application-not-found" ? "text-sm font-semibold text-amber-800" : "text-sm font-semibold text-emerald-800"}>
              {statusMessage}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <RegistrarApplicationsList applications={records.applications} />
    </div>
  );
}
