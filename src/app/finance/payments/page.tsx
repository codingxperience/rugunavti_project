import { PaymentStatus } from "@prisma/client";

import { updatePaymentStatusAction } from "@/app/finance/actions";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFinanceWorkspaceRecords } from "@/lib/platform/finance-records";

export const dynamic = "force-dynamic";

const statusMessages: Record<string, string> = {
  "payment-updated": "Payment status updated.",
  "invalid-payment-status": "Payment status could not be validated.",
  "payment-not-found": "Payment reference was not found.",
};

function formatDateTime(value: string | null) {
  if (!value) return "Not received";

  return new Intl.DateTimeFormat("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Kampala",
  }).format(new Date(value));
}

function compactProvider(value: string | null) {
  if (!value || value === "MANUAL") return "Finance reference";
  if (value === "STRIPE") return "Stripe";
  if (value === "FLUTTERWAVE") return "Flutterwave";
  return value;
}

export default async function FinancePaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const [{ status }, records] = await Promise.all([searchParams, getFinanceWorkspaceRecords()]);
  const statusMessage = status ? statusMessages[status] : null;

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Payments
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Review provider checkouts, mobile money references, and finance-confirmed receipts.
          </p>
        </CardContent>
      </Card>

      {statusMessage ? (
        <Card className={status === "payment-updated" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}>
          <CardContent>
            <p className={status === "payment-updated" ? "text-sm font-semibold text-emerald-800" : "text-sm font-semibold text-amber-800"}>
              {statusMessage}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {records.databaseUnavailable ? (
        <Card className="border-amber-200/70 bg-amber-50/80">
          <CardContent>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Payment records are temporarily unavailable
            </h2>
            <p className="mt-2 text-sm leading-7 text-amber-900/80">
              {records.databaseMessage} Check the Supabase connection, then refresh this page.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {records.payments.length ? (
          records.payments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {compactProvider(payment.provider)}
                  </p>
                  <h2 className="font-heading mt-2 text-2xl font-bold text-[var(--color-ink)]">
                    {payment.learner}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {payment.invoiceNumber} | {payment.reference} | {formatDateTime(payment.receivedAt ?? payment.createdAt)}
                  </p>
                  <div className="mt-3 grid gap-2 text-xs text-[var(--color-muted)] sm:grid-cols-2">
                    <span>Method: {payment.method}</span>
                    <span>Provider status: {payment.providerStatus ?? payment.status}</span>
                    {payment.providerReference ? <span>Provider ref: {payment.providerReference}</span> : null}
                    {payment.verifiedAt ? <span>Verified: {formatDateTime(payment.verifiedAt)}</span> : null}
                    {payment.failureReason ? (
                      <span className="text-red-700 sm:col-span-2">{payment.failureReason}</span>
                    ) : null}
                  </div>
                </div>
                <form action={updatePaymentStatusAction} className="grid gap-3 rounded-[22px] border border-black/6 bg-[#fbfbf7] p-4">
                  <input type="hidden" name="paymentId" value={payment.id} />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--color-ink)]">
                    {payment.amount}
                  </span>
                  <StatusBadge
                    value={payment.status}
                    tone={payment.statusValue === "VERIFIED" ? "success" : payment.statusValue === "FAILED" ? "danger" : "neutral"}
                  />
                  </div>
                  <select
                    name="status"
                    defaultValue={payment.statusValue}
                    className="h-11 rounded-full border border-[var(--color-border)] bg-white px-4 text-sm font-semibold outline-none"
                  >
                    <option value={PaymentStatus.PENDING}>Pending review</option>
                    <option value={PaymentStatus.RECEIVED}>Received</option>
                    <option value={PaymentStatus.VERIFIED}>Verified</option>
                    <option value={PaymentStatus.FAILED}>Failed</option>
                    <option value={PaymentStatus.REFUNDED}>Refunded</option>
                  </select>
                  <Button type="submit" size="sm">
                    Save status
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                No payments yet
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Payments will appear after finance records a reference on an invoice.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
