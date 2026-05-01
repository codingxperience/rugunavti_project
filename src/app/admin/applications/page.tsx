import { AdminApplicationsTable } from "@/components/platform/admin-applications-table";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminApplicationRecords } from "@/lib/platform/admissions-records";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  await requireRole(["registrar_admin", "super_admin"], "/admin/applications");
  const applications = await getAdminApplicationRecords();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">Applications and admissions queue</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Track intake demand, documentation gaps, and admission decisions from a single operations table.
          </p>
        </CardContent>
      </Card>
      <AdminApplicationsTable data={applications} />
    </div>
  );
}
