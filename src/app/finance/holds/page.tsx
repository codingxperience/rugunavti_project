import { StatusBadge } from "@/components/platform/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFinanceWorkspaceRecords } from "@/lib/platform/finance-records";

export const dynamic = "force-dynamic";

export default async function FinanceHoldsPage() {
  const records = await getFinanceWorkspaceRecords();
  const holdRows = records.invoices.filter(
    (invoice) => invoice.enrollmentStatus === "On Hold" || invoice.belowMinimumClearance
  );

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Account holds
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Finance follow-up for active holds and invoices below the minimum clearance rule.
          </p>
        </CardContent>
      </Card>

      {records.databaseUnavailable ? (
        <Card className="border-amber-200/70 bg-amber-50/80">
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Hold records are temporarily unavailable
            </h2>
            <p className="mt-2 text-sm leading-7 text-amber-900/80">
              {records.databaseMessage} Check the Supabase connection, then refresh this page.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {holdRows.length ? (
          holdRows.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {invoice.invoiceNumber}
                  </p>
                  <h2 className="font-heading mt-2 text-2xl font-bold text-[var(--color-ink)]">
                    {invoice.learner}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {invoice.program} | Balance {invoice.balance} | {invoice.clearancePercent}% cleared
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={invoice.status} tone="warning" />
                  {invoice.enrollmentStatus === "On Hold" ? (
                    <StatusBadge value="On Hold" tone="danger" />
                  ) : (
                    <StatusBadge value="Below 50%" tone="warning" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                No active holds
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Holds will appear here when finance places a learner account on hold.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
