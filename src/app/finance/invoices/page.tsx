import { FinanceInvoicesTable } from "@/components/platform/finance-invoices-table";
import { Card, CardContent } from "@/components/ui/card";
import { getFinanceWorkspaceRecords } from "@/lib/platform/finance-records";

export const dynamic = "force-dynamic";

export default async function FinanceInvoicesPage() {
  const records = await getFinanceWorkspaceRecords();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Invoices
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review learner invoices, update invoice status, and record payment references.
          </p>
        </CardContent>
      </Card>
      {records.databaseUnavailable ? (
        <Card className="border-amber-200/70 bg-amber-50/80">
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Invoice records are temporarily unavailable
            </h2>
            <p className="mt-2 text-sm leading-7 text-amber-900/80">
              {records.databaseMessage} Check the Supabase connection, then refresh this page.
            </p>
          </CardContent>
        </Card>
      ) : null}
      <FinanceInvoicesTable invoices={records.invoices} />
    </div>
  );
}
