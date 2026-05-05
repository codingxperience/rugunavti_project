import Link from "next/link";
import { WalletCards } from "lucide-react";

import { submitLearnerPaymentReferenceAction } from "@/app/learn/payments/actions";
import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/data";
import { getLearnerFinanceRecords } from "@/lib/platform/learner-finance-records";
import { getPaymentChannels } from "@/lib/platform/payment-settings";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

const statusMessages: Record<string, string> = {
  "reference-submitted": "Payment reference sent to finance for verification.",
  "invalid-reference": "Check the amount, method, and reference before submitting again.",
  "invoice-not-found": "That invoice could not be found on your account.",
  "amount-too-high": "The amount is higher than the current balance.",
  "duplicate-reference": "That payment reference has already been submitted.",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Kampala",
  }).format(new Date(value));
}

function statusTone(status: string) {
  if (status === "PAID" || status === "VERIFIED" || status === "RECEIVED") return "success";
  if (status === "FAILED" || status === "VOID") return "danger";
  if (status === "PARTIALLY_PAID" || status === "PENDING") return "warning";
  return "neutral";
}

export default async function LearnerPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const [session, { status }] = await Promise.all([
    requireRole(["student", "super_admin"], "/learn/payments"),
    searchParams,
  ]);
  const finance = await getLearnerFinanceRecords(session);
  const statusMessage = status ? statusMessages[status] : null;
  const paymentChannels = getPaymentChannels();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Fees
            </p>
            <h1 className="font-heading mt-3 text-4xl font-bold text-[var(--color-ink)]">
              Payments and access
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
              Track invoices, submit payment references, and see whether your course access is clear.
            </p>
          </div>
          <div className="rounded-[28px] bg-[var(--color-ink)] p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Clearance
            </p>
            <p className="font-heading mt-3 text-4xl font-bold">
              {finance.snapshot.clearancePercent}%
            </p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Minimum to continue: {finance.snapshot.minimumClearancePercent}%
            </p>
          </div>
        </CardContent>
      </Card>

      {statusMessage ? (
        <Card className={status === "reference-submitted" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}>
          <CardContent>
            <p className={status === "reference-submitted" ? "text-sm font-semibold text-emerald-800" : "text-sm font-semibold text-amber-800"}>
              {statusMessage}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {finance.databaseUnavailable ? (
        <Card className="border-amber-200/70 bg-amber-50/80">
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Payment details are temporarily unavailable
            </h2>
            <p className="mt-2 text-sm leading-7 text-amber-900/80">
              {finance.databaseMessage} You can continue using the platform and refresh this
              page after the database connection is restored.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Total billed
            </p>
            <p className="font-heading mt-3 text-3xl font-bold text-[var(--color-ink)]">
              {finance.snapshot.amountDue}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Confirmed paid
            </p>
            <p className="font-heading mt-3 text-3xl font-bold text-[var(--color-ink)]">
              {finance.snapshot.amountPaid}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Balance
            </p>
            <p className="font-heading mt-3 text-3xl font-bold text-[var(--color-ink)]">
              {finance.snapshot.balance}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4">
          {finance.records.length ? (
            finance.records.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        {invoice.invoiceNumber}
                      </p>
                      <h2 className="font-heading mt-2 text-2xl font-bold text-[var(--color-ink)]">
                        {invoice.title}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Due {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                    <StatusBadge value={invoice.status} tone={statusTone(invoice.statusValue)} />
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                        Due
                      </p>
                      <p className="mt-1 font-semibold text-[var(--color-ink)]">{invoice.amountDue}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                        Paid
                      </p>
                      <p className="mt-1 font-semibold text-[var(--color-ink)]">{invoice.amountPaid}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                        Balance
                      </p>
                      <p className="mt-1 font-semibold text-[var(--color-ink)]">{invoice.balance}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-[var(--color-ink)]">Access clearance</span>
                      <span className="text-[var(--color-muted)]">
                        {invoice.clearancePercent}% / {invoice.minimumClearancePercent}%
                      </span>
                    </div>
                    <ProgressBar value={invoice.clearancePercent} />
                    <p className="text-sm leading-6 text-[var(--color-muted)]">
                      {invoice.canContinue
                        ? "Access is clear for this invoice."
                        : "Pay or verify at least 50% to continue without a finance hold."}
                    </p>
                  </div>

                  {invoice.rawBalance > 0 ? (
                    <form action={submitLearnerPaymentReferenceAction} className="mt-6 rounded-[24px] border border-black/6 bg-[#fbfbf7] p-4">
                      <input type="hidden" name="invoiceId" value={invoice.id} />
                      <p className="text-sm font-semibold text-[var(--color-ink)]">
                        Submit payment reference
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <input
                          name="amount"
                          type="number"
                          min="1"
                          step="1"
                          required
                          placeholder="Amount paid"
                          className="h-11 rounded-full border border-[var(--color-border)] bg-white px-4 text-sm outline-none"
                        />
                        <select
                          name="method"
                          required
                          defaultValue="MTN Mobile Money"
                          className="h-11 rounded-full border border-[var(--color-border)] bg-white px-4 text-sm font-semibold outline-none"
                        >
                          <option>MTN Mobile Money</option>
                          <option>Airtel Money</option>
                          <option>Bank transfer</option>
                          <option>Card or virtual card</option>
                        </select>
                        <input
                          name="reference"
                          required
                          placeholder="Transaction or receipt reference"
                          className="h-11 rounded-full border border-[var(--color-border)] bg-white px-4 text-sm outline-none md:col-span-2"
                        />
                      </div>
                      <Button type="submit" className="mt-4">
                        Send to finance
                      </Button>
                    </form>
                  ) : null}

                  {invoice.payments.length ? (
                    <div className="mt-5 grid gap-2">
                      {invoice.payments.slice(0, 3).map((payment) => (
                        <div
                          key={payment.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/6 bg-white px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-ink)]">
                              {payment.reference}
                            </p>
                            <p className="mt-1 text-xs text-[var(--color-muted)]">
                              {payment.method} | {payment.amount}
                            </p>
                          </div>
                          <StatusBadge value={payment.status} tone={statusTone(payment.statusValue)} />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent>
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  No invoices yet
                </h2>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  Programme or course fees will appear here after admissions or finance creates an invoice.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-6 xl:self-start">
          <Card>
            <CardContent>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-soft-accent)]">
                <WalletCards className="h-5 w-5 text-[var(--color-ink)]" />
              </div>
              <h2 className="font-heading mt-5 text-2xl font-bold text-[var(--color-ink)]">
                Payment channels
              </h2>
              <div className="mt-4 grid gap-3">
                {paymentChannels.map((channel) => (
                  <div
                    key={channel.label}
                    className="rounded-[22px] border border-black/8 bg-[#fbfbf7] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-[var(--color-ink)]">{channel.label}</p>
                      <StatusBadge
                        value={channel.configured ? "Ready" : "Confirm"}
                        tone={channel.configured ? "success" : "warning"}
                      />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                      {channel.detail}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
                      {channel.referenceHint}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3">
                <Button asChild>
                  <Link href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                    WhatsApp finance
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/learn/help">Open support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
