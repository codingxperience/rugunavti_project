import { InvoiceStatus, PaymentStatus } from "@prisma/client";

import { recordPaymentAction, updateInvoiceStatusAction } from "@/app/finance/actions";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import type { FinanceInvoiceRow } from "@/lib/platform/finance-records";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Kampala",
  }).format(new Date(value));
}

function statusTone(status: InvoiceStatus) {
  if (status === InvoiceStatus.PAID) return "success";
  if (status === InvoiceStatus.OVERDUE || status === InvoiceStatus.VOID) return "danger";
  if (status === InvoiceStatus.PARTIALLY_PAID) return "warning";
  return "neutral";
}

const invoiceStatuses = [
  InvoiceStatus.ISSUED,
  InvoiceStatus.PARTIALLY_PAID,
  InvoiceStatus.PAID,
  InvoiceStatus.OVERDUE,
  InvoiceStatus.VOID,
];

export function FinanceInvoicesTable({ invoices }: { invoices: FinanceInvoiceRow[] }) {
  if (!invoices.length) {
    return (
      <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8">
        <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
          No invoices yet
        </h2>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          Finance records will appear here after admissions or admin creates learner invoices.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {invoices.map((invoice) => (
        <article
          key={invoice.id}
          className="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-[0_22px_60px_-52px_rgba(17,17,17,0.45)]"
        >
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {invoice.invoiceNumber}
                  </p>
                  <h2 className="font-heading mt-2 text-2xl font-bold text-[var(--color-ink)]">
                    {invoice.learner}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{invoice.email}</p>
                </div>
                <StatusBadge value={invoice.status} tone={statusTone(invoice.statusValue)} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-[#f6f5ef] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Amount due
                  </p>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">{invoice.amountDue}</p>
                </div>
                <div className="rounded-2xl bg-[#f6f5ef] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Paid
                  </p>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">{invoice.amountPaid}</p>
                </div>
                <div className="rounded-2xl bg-[#f6f5ef] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Balance
                  </p>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">{invoice.balance}</p>
                </div>
                <div className="rounded-2xl bg-[#f6f5ef] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Due
                  </p>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-black/6 bg-[#fbfbf7] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                      Access clearance
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      Minimum required before learning continues: {invoice.minimumClearancePercent}%
                    </p>
                  </div>
                  <StatusBadge
                    value={
                      invoice.belowMinimumClearance
                        ? `${invoice.clearancePercent}% - below minimum`
                        : `${invoice.clearancePercent}% cleared`
                    }
                    tone={invoice.belowMinimumClearance ? "warning" : "success"}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-[var(--color-muted)]">
                <p>
                  <span className="font-semibold text-[var(--color-ink)]">Programme:</span>{" "}
                  {invoice.program}
                </p>
                <p>
                  <span className="font-semibold text-[var(--color-ink)]">Course:</span>{" "}
                  {invoice.course}
                </p>
                <p>
                  <span className="font-semibold text-[var(--color-ink)]">Latest reference:</span>{" "}
                  {invoice.latestPaymentReference ?? "No payment reference recorded"}
                </p>
                {invoice.enrollmentStatus ? (
                  <p>
                    <span className="font-semibold text-[var(--color-ink)]">Learning access:</span>{" "}
                    {invoice.enrollmentStatus}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3">
              <form action={updateInvoiceStatusAction} className="rounded-[24px] border border-black/6 bg-[#fbfbf7] p-4">
                <input type="hidden" name="invoiceId" value={invoice.id} />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Update status
                </p>
                <label className="mt-3 block text-sm font-semibold text-[var(--color-ink)]" htmlFor={`status-${invoice.id}`}>
                  Invoice status
                </label>
                <select
                  id={`status-${invoice.id}`}
                  name="status"
                  defaultValue={invoice.statusValue}
                  className="mt-2 h-11 w-full rounded-full border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-ink)] outline-none"
                >
                  {invoiceStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <label className="mt-3 block text-sm font-semibold text-[var(--color-ink)]" htmlFor={`hold-${invoice.id}`}>
                  Learner access
                </label>
                <select
                  id={`hold-${invoice.id}`}
                  name="holdEnrollment"
                  defaultValue="none"
                  className="mt-2 h-11 w-full rounded-full border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-ink)] outline-none"
                >
                  <option value="none">No access change</option>
                  <option value="hold">Place account on hold</option>
                  <option value="release">Release hold</option>
                </select>
                <Button type="submit" size="sm" className="mt-4 w-full">
                  Save finance update
                </Button>
              </form>

              <form action={recordPaymentAction} className="rounded-[24px] border border-black/6 bg-white p-4">
                <input type="hidden" name="invoiceId" value={invoice.id} />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Record payment
                </p>
                <div className="mt-3 grid gap-2">
                  <input
                    name="amount"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Amount received"
                    className="h-11 rounded-full border border-[var(--color-border)] bg-[#fbfbf7] px-4 text-sm outline-none"
                    required
                  />
                  <input
                    name="reference"
                    placeholder="Payment reference"
                    className="h-11 rounded-full border border-[var(--color-border)] bg-[#fbfbf7] px-4 text-sm outline-none"
                    required
                  />
                  <input
                    name="method"
                    placeholder="Method e.g. bank, mobile money"
                    className="h-11 rounded-full border border-[var(--color-border)] bg-[#fbfbf7] px-4 text-sm outline-none"
                    required
                  />
                  <select
                    name="status"
                    defaultValue={PaymentStatus.RECEIVED}
                    className="h-11 rounded-full border border-[var(--color-border)] bg-[#fbfbf7] px-4 text-sm font-semibold outline-none"
                  >
                    <option value={PaymentStatus.RECEIVED}>Received</option>
                    <option value={PaymentStatus.VERIFIED}>Verified</option>
                    <option value={PaymentStatus.PENDING}>Pending review</option>
                  </select>
                </div>
                <Button type="submit" variant="secondary" size="sm" className="mt-4 w-full">
                  Add payment
                </Button>
              </form>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
