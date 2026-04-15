import { FinanceInvoicesTable } from "@/components/platform/finance-invoices-table";
import { MetricCard } from "@/components/platform/metric-card";
import { Card, CardContent } from "@/components/ui/card";
import { financeWorkspace } from "@/data";

export default function FinanceDashboardPage() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="Invoices issued" value={financeWorkspace.invoicesIssued} detail="Current billed value across active learners." />
        <MetricCard label="Payments verified" value={financeWorkspace.paymentsVerified} detail="Verified incoming value with payment references logged." />
        <MetricCard label="Overdue accounts" value={String(financeWorkspace.overdueAccounts)} detail="Learners requiring structured follow-up." />
        <MetricCard label="Enrollment holds" value={String(financeWorkspace.holdsApplied)} detail="Temporary holds currently applied for finance reasons." />
      </section>

      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">Invoices and payment status</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Finance administrators can confirm references, update payment status, release holds, and follow up on overdue balances.
          </p>
        </CardContent>
      </Card>

      <FinanceInvoicesTable />
    </div>
  );
}
