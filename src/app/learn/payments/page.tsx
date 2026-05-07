import Link from "next/link";
import { AlertCircle, CheckCircle2, CreditCard, Smartphone, WalletCards } from "lucide-react";

import {
  startLearnerCheckoutAction,
  submitLearnerPaymentReferenceAction,
} from "@/app/learn/payments/actions";
import { ProgressBar } from "@/components/platform/progress-bar";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/data";
import { getOnlinePaymentProviderStatus } from "@/lib/platform/checkout-providers";
import { getLearnerFinanceRecords } from "@/lib/platform/learner-finance-records";
import { getPaymentChannels } from "@/lib/platform/payment-settings";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

const statusMessages: Record<string, { tone: "success" | "warning" | "danger"; text: string }> = {
  "reference-submitted": {
    tone: "success",
    text: "Payment reference received. Finance will verify it against your invoice.",
  },
  "invalid-reference": {
    tone: "warning",
    text: "Check the amount, method, and reference before submitting again.",
  },
  "invoice-not-found": {
    tone: "danger",
    text: "That invoice could not be found on your account.",
  },
  "amount-too-high": {
    tone: "warning",
    text: "The amount is higher than the current balance.",
  },
  "duplicate-reference": {
    tone: "warning",
    text: "That payment reference has already been submitted.",
  },
  "checkout-cancelled": {
    tone: "warning",
    text: "Checkout was cancelled before payment was completed.",
  },
  "invalid-checkout": {
    tone: "warning",
    text: "Choose a valid amount before starting checkout.",
  },
  "stripe-not-configured": {
    tone: "warning",
    text: "Card checkout needs Stripe test keys before it can open.",
  },
  "flutterwave-not-configured": {
    tone: "warning",
    text: "Mobile money checkout needs Flutterwave test keys before it can open.",
  },
  "checkout-error": {
    tone: "danger",
    text: "Checkout could not start. Try again or submit a payment reference.",
  },
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

function messageToneClass(tone: "success" | "warning" | "danger") {
  if (tone === "success") {
    return "border-emerald-200/70 bg-emerald-50/75 text-emerald-900";
  }

  if (tone === "danger") {
    return "border-red-200/70 bg-red-50/75 text-red-900";
  }

  return "border-amber-200/70 bg-amber-50/75 text-amber-950";
}

function providerButtonClass(enabled: boolean) {
  return [
    "flex h-14 w-full items-center justify-center gap-3 rounded-2xl border px-4 text-sm font-bold transition",
    enabled
      ? "border-[#111111] bg-[#111111] text-white shadow-[0_18px_40px_-30px_rgba(17,17,17,0.85)] hover:-translate-y-0.5 hover:bg-black"
      : "cursor-not-allowed border-black/8 bg-[#f3f2ec] text-[var(--color-muted)]",
  ].join(" ");
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
  const onlineProviders = getOnlinePaymentProviderStatus();

  return (
    <div className="grid gap-5">
      <section className="rounded-[26px] bg-white p-5 shadow-[0_20px_70px_-62px_rgba(17,17,17,0.55)] ring-1 ring-black/5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Payments
          </p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-[var(--color-ink)]">
            Pay tuition
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-muted)]">
            Pay by mobile money or card through hosted checkout. Ruguna never stores card numbers,
            wallet PINs, or bank passwords.
          </p>
        </div>
      </section>

      {statusMessage ? (
        <div
          className={`flex items-start gap-3 rounded-[24px] border px-4 py-3 text-sm font-semibold backdrop-blur-xl ${messageToneClass(statusMessage.tone)}`}
        >
          {statusMessage.tone === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <p>{statusMessage.text}</p>
        </div>
      ) : null}

      {finance.databaseUnavailable ? (
        <div className="rounded-[28px] border border-amber-200/70 bg-amber-50/80 p-5 text-amber-950">
          <h2 className="font-heading text-xl font-bold">Payment details are temporarily unavailable</h2>
          <p className="mt-2 text-sm leading-7">
            {finance.databaseMessage} Refresh this page after the database connection is restored.
          </p>
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ["Total billed", finance.snapshot.amountDue],
          ["Confirmed paid", finance.snapshot.amountPaid],
          ["Balance", finance.snapshot.balance],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[26px] border border-black/6 bg-white/78 p-5 shadow-[0_18px_60px_-56px_rgba(17,17,17,0.55)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {label}
            </p>
            <p className="font-heading mt-2 text-2xl font-bold text-[var(--color-ink)]">
              {value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid gap-4">
          {finance.records.length ? (
            finance.records.map((invoice) => (
              <Card key={invoice.id} className="overflow-hidden">
                <CardContent>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                        {invoice.invoiceNumber}
                      </p>
                      <h2 className="font-heading mt-2 text-2xl font-bold text-[var(--color-ink)]">
                        {invoice.title}
                      </h2>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        Due {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                    <StatusBadge value={invoice.status} tone={statusTone(invoice.statusValue)} />
                  </div>

                  <div className="mt-5 grid gap-3 rounded-[24px] bg-[#f8f7f1] p-4 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                        Due
                      </p>
                      <p className="mt-1 font-bold text-[var(--color-ink)]">{invoice.amountDue}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                        Paid
                      </p>
                      <p className="mt-1 font-bold text-[var(--color-ink)]">{invoice.amountPaid}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                        Balance
                      </p>
                      <p className="mt-1 font-bold text-[var(--color-ink)]">{invoice.balance}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-[var(--color-ink)]">Learning clearance</span>
                      <span className="text-[var(--color-muted)]">
                        {invoice.clearancePercent}% / {invoice.minimumClearancePercent}%
                      </span>
                    </div>
                    <ProgressBar value={invoice.clearancePercent} />
                    <p className="text-sm leading-6 text-[var(--color-muted)]">
                      {invoice.canContinue
                        ? "Access is clear for this invoice."
                        : "Clear at least 50% to continue without a finance hold."}
                    </p>
                  </div>

                  {invoice.rawBalance > 0 ? (
                    <div className="mt-6 rounded-[28px] border border-black/8 bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-heading text-xl font-bold text-[var(--color-ink)]">
                            Pay this invoice
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                            Checkout opens securely in your browser and returns here after payment.
                          </p>
                        </div>
                        <span className="rounded-full bg-[#f8f7f1] px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)]">
                          {onlineProviders.testMode ? "Test mode" : "Live mode"}
                        </span>
                      </div>

                      <form action={startLearnerCheckoutAction} className="mt-4 grid gap-3">
                        <input type="hidden" name="invoiceId" value={invoice.id} />
                        <label className="grid gap-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                            Amount
                          </span>
                          <input
                            name="amount"
                            type="number"
                            min="1"
                            max={Math.ceil(invoice.rawBalance)}
                            step="1"
                            required
                            defaultValue={Math.ceil(invoice.rawBalance)}
                            className="h-12 rounded-2xl border border-[var(--color-border)] bg-[#fbfaf5] px-4 text-sm font-semibold text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]/35"
                            aria-label={`Amount to pay for ${invoice.invoiceNumber}`}
                          />
                        </label>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <button
                            type="submit"
                            name="provider"
                            value="flutterwave"
                            disabled={!onlineProviders.flutterwave}
                            className={providerButtonClass(onlineProviders.flutterwave)}
                          >
                            <Smartphone className="h-4 w-4" />
                            Pay with mobile money
                          </button>
                          <button
                            type="submit"
                            name="provider"
                            value="stripe"
                            disabled={!onlineProviders.stripe}
                            className={providerButtonClass(onlineProviders.stripe)}
                          >
                            <CreditCard className="h-4 w-4" />
                            Pay with card
                          </button>
                        </div>
                      </form>

                      {onlineProviders.flutterwave && onlineProviders.stripe ? null : (
                        <p className="mt-3 rounded-2xl bg-[#fff9d8] px-4 py-3 text-xs font-medium leading-5 text-[#5f4b00]">
                          Online checkout needs provider test keys before it can open. Until then,
                          submit a receipt reference for finance review.
                        </p>
                      )}

                      {(onlineProviders.flutterwave || onlineProviders.stripe) &&
                      (!onlineProviders.flutterwaveWebhook || !onlineProviders.stripeWebhook) ? (
                        <p className="mt-3 rounded-2xl bg-[#f8f7f1] px-4 py-3 text-xs font-medium leading-5 text-[var(--color-muted)]">
                          Add webhook secrets so successful provider payments confirm automatically.
                        </p>
                      ) : null}

                      <details className="mt-3 rounded-[22px] border border-black/8 bg-[#fbfaf5]">
                        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-[var(--color-ink)] marker:hidden">
                          Already paid? Send receipt reference
                        </summary>
                        <form action={submitLearnerPaymentReferenceAction} className="border-t border-black/6 p-4">
                          <input type="hidden" name="invoiceId" value={invoice.id} />
                          <div className="grid gap-3 md:grid-cols-2">
                            <input
                              name="amount"
                              type="number"
                              min="1"
                              step="1"
                              required
                              placeholder="Amount paid"
                              className="h-11 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none"
                            />
                            <select
                              name="method"
                              required
                              defaultValue="MTN Mobile Money"
                              className="h-11 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold outline-none"
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
                              className="h-11 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none md:col-span-2"
                            />
                          </div>
                          <Button type="submit" className="mt-4">
                            Send to finance
                          </Button>
                        </form>
                      </details>
                    </div>
                  ) : null}

                  {invoice.payments.length ? (
                    <div className="mt-5 grid gap-2">
                      {invoice.payments.slice(0, 3).map((payment) => (
                        <div
                          key={payment.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/6 bg-[#fbfaf5] px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-ink)]">
                              {payment.reference}
                            </p>
                            <p className="mt-1 text-xs text-[var(--color-muted)]">
                              {payment.method} | {payment.amount}
                              {payment.providerStatus ? ` | ${payment.providerStatus}` : ""}
                            </p>
                            {payment.failureReason ? (
                              <p className="mt-1 text-xs text-red-700">{payment.failureReason}</p>
                            ) : null}
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

        <aside className="grid gap-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[28px] border border-black/8 bg-white/82 p-5 shadow-[0_18px_60px_-58px_rgba(17,17,17,0.55)]">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-soft-accent)]">
                <WalletCards className="h-5 w-5 text-[var(--color-ink)]" />
              </span>
              <div>
                <h2 className="font-heading text-lg font-bold text-[var(--color-ink)]">
                  How payments clear
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  Keep the invoice reference on every payment.
                </p>
              </div>
            </div>
            <div className="mt-4 divide-y divide-black/8">
              {paymentChannels.map((channel) => (
                <div key={channel.label} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-[var(--color-ink)]">{channel.label}</p>
                    <span className={channel.configured ? "text-emerald-700" : "text-amber-700"}>
                      {channel.configured ? "Ready" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
                    {channel.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-2">
              <Button asChild>
                <Link href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                  WhatsApp finance
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/learn/help">Open support</Link>
              </Button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
