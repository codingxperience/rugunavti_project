import { createInvoiceAction } from "@/app/finance/actions";
import { FinanceInvoicesTable } from "@/components/platform/finance-invoices-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFinanceWorkspaceRecords } from "@/lib/platform/finance-records";

export const dynamic = "force-dynamic";

const statusMessages: Record<string, string> = {
  "invoice-created": "Invoice issued. The learner can now open Payments and pay online.",
  "invalid-invoice": "Check the learner email, amount, and due date before issuing the invoice.",
};

function defaultDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
}

export default async function FinanceInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; invoice?: string }>;
}) {
  const [{ status, invoice }, records] = await Promise.all([
    searchParams,
    getFinanceWorkspaceRecords(),
  ]);
  const statusMessage = status ? statusMessages[status] : null;

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

      {statusMessage ? (
        <div
          className={`rounded-[22px] border px-4 py-3 text-sm font-semibold ${
            status === "invoice-created"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-amber-200 bg-amber-50 text-amber-950"
          }`}
        >
          {statusMessage}
          {invoice ? <span className="ml-2 text-[var(--color-muted)]">({invoice})</span> : null}
        </div>
      ) : null}

      <Card>
        <CardContent>
          <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Issue invoice
              </p>
              <h2 className="font-heading mt-2 text-2xl font-bold text-[var(--color-ink)]">
                Create learner invoice
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Add a tuition invoice by learner email. It appears immediately in the learner payment workspace.
              </p>
            </div>
            <form action={createInvoiceAction} className="grid gap-3 md:grid-cols-[minmax(0,1.25fr)_160px_160px_auto]">
              <label className="grid gap-1.5 text-sm font-semibold text-[var(--color-ink)]">
                Learner email
                <input
                  name="learnerEmail"
                  type="email"
                  required
                  placeholder="student@example.com"
                  className="h-11 rounded-2xl border border-[var(--color-border)] bg-[#fbfbf7] px-4 text-sm outline-none focus:border-[var(--color-ink)]/30"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-[var(--color-ink)]">
                Amount
                <input
                  name="amountDue"
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="450000"
                  className="h-11 rounded-2xl border border-[var(--color-border)] bg-[#fbfbf7] px-4 text-sm outline-none focus:border-[var(--color-ink)]/30"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-[var(--color-ink)]">
                Due date
                <input
                  name="dueDate"
                  type="date"
                  required
                  defaultValue={defaultDueDate()}
                  className="h-11 rounded-2xl border border-[var(--color-border)] bg-[#fbfbf7] px-4 text-sm outline-none focus:border-[var(--color-ink)]/30"
                />
              </label>
              <div className="flex items-end">
                <Button type="submit" className="h-11 w-full md:w-auto">
                  Issue
                </Button>
              </div>
              <label className="grid gap-1.5 text-sm font-semibold text-[var(--color-ink)] md:col-span-full">
                Note
                <input
                  name="notes"
                  placeholder="Example: May intake tuition deposit"
                  className="h-11 rounded-2xl border border-[var(--color-border)] bg-[#fbfbf7] px-4 text-sm outline-none focus:border-[var(--color-ink)]/30"
                />
              </label>
            </form>
          </div>
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
