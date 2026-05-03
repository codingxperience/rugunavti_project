import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AuditActivityList } from "@/components/platform/audit-activity-list";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminAuditRecords } from "@/lib/platform/learning-records";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

export default async function AdminAuditTrailPage() {
  await requireRole(["registrar_admin", "super_admin"], "/admin/elearning/audit");
  const auditLogs = await getAdminAuditRecords(50);

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <Link
            href="/admin/elearning"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--color-soft-accent)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Admin
              </p>
              <h1 className="font-heading mt-2 text-4xl font-bold text-[var(--color-ink)]">
                Audit trail
              </h1>
            </div>
            <span className="rounded-full bg-[var(--color-soft-accent)] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-ink)]">
              {auditLogs.length} records
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <AuditActivityList records={auditLogs} showAuditId />
        </CardContent>
      </Card>
    </div>
  );
}
