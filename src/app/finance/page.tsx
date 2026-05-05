import { FinanceInvoicesTable } from "@/components/platform/finance-invoices-table";
import { MetricCard } from "@/components/platform/metric-card";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/platform/status-badge";
import { getFinanceWorkspaceRecords } from "@/lib/platform/finance-records";

export const dynamic = "force-dynamic";

const statusMessages: Record<string, string> = {
  "invoice-updated": "Finance update saved.",
  "payment-recorded": "Payment reference recorded.",
  "invalid-invoice-update": "Invoice update could not be validated.",
  "invalid-payment": "Payment details could not be validated.",
  "invoice-not-found": "Invoice was not found.",
  "duplicate-reference": "That payment reference already exists.",
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "Not received";
  }

  return new Intl.DateTimeFormat("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Kampala",
  }).format(new Date(value));
}

export default async function FinanceDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const [{ status }, records] = await Promise.all([searchParams, getFinanceWorkspaceRecords()]);
  const statusMessage = status ? statusMessages[status] : null;

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="Invoices" value={String(records.snapshot.invoiceCount)} detail={records.snapshot.issuedTotal} />
        <MetricCard label="Paid" value={records.snapshot.paidTotal} detail="Recorded against issued invoices." />
        <MetricCard label="Verified" value={records.snapshot.verifiedTotal} detail="Confirmed payment references." />
        <MetricCard label="Holds" value={String(records.snapshot.holdCount)} detail={`${records.snapshot.overdueCount} overdue account${records.snapshot.overdueCount === 1 ? "" : "s"}.`} />
      </section>

      {statusMessage ? (
        <Card className={status?.startsWith("invalid") || status === "invoice-not-found" || status === "duplicate-reference" ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}>
          <CardContent>
            <p className={status?.startsWith("invalid") || status === "invoice-not-found" || status === "duplicate-reference" ? "text-sm font-semibold text-amber-800" : "text-sm font-semibold text-emerald-800"}>
              {statusMessage}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {records.databaseUnavailable ? (
        <Card className="border-amber-200/70 bg-amber-50/80">
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Finance records are temporarily unavailable
            </h2>
            <p className="mt-2 text-sm leading-7 text-amber-900/80">
              {records.databaseMessage} Check the Supabase connection, then refresh this page.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">Invoices and payment status</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Track learner invoices, record references, confirm payment status, and control account holds where finance affects learning access.
          </p>
        </CardContent>
      </Card>

      <FinanceInvoicesTable invoices={records.invoices} />

      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                Recent payments
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Latest payment references entered by finance or synced from payment records.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {records.payments.length ? (
              records.payments.slice(0, 8).map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/6 bg-[#fbfbf7] p-4"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-ink)]">{payment.reference}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {payment.learner} | {payment.invoiceNumber} | {payment.method}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {formatDateTime(payment.receivedAt ?? payment.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--color-ink)]">
                      {payment.amount}
                    </span>
                    <StatusBadge
                      value={payment.status}
                      tone={payment.statusValue === "VERIFIED" ? "success" : payment.statusValue === "FAILED" ? "danger" : "neutral"}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-black/10 p-5 text-sm text-[var(--color-muted)]">
                No payments have been recorded yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
