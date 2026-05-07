import Link from "next/link";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import {
  settleStripeCheckoutSession,
  verifyAndSettleFlutterwavePayment,
} from "@/lib/platform/checkout-providers";
import { requireRole } from "@/lib/platform/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

function resultCopy(status: string | undefined) {
  if (status === "VERIFIED") {
    return {
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: "Payment confirmed",
      body: "Your payment has been verified and your finance record has been updated.",
      tone: "bg-emerald-50 text-emerald-700",
    };
  }

  if (status === "FAILED") {
    return {
      icon: <XCircle className="h-6 w-6" />,
      title: "Payment not completed",
      body: "The provider did not confirm this payment. You can try again or contact finance with your reference.",
      tone: "bg-red-50 text-red-700",
    };
  }

  return {
    icon: <Clock3 className="h-6 w-6" />,
    title: "Payment is being checked",
    body: "We have received the checkout response and are waiting for final provider confirmation.",
    tone: "bg-amber-50 text-amber-800",
  };
}

export default async function PaymentCompletePage({
  searchParams,
}: {
  searchParams: Promise<{
    provider?: string;
    session_id?: string;
    transaction_id?: string;
    tx_ref?: string;
    status?: string;
  }>;
}) {
  await requireRole(["student", "super_admin"], "/learn/payments/complete");
  const params = await searchParams;
  const provider = params.provider;

  const result =
    provider === "stripe" && params.session_id
      ? await settleStripeCheckoutSession(params.session_id)
      : provider === "flutterwave"
        ? await verifyAndSettleFlutterwavePayment({
            transactionId: params.transaction_id,
            txRef: params.tx_ref,
          })
        : { ok: false as const, reason: "unknown-provider" };
  const copy = result.ok ? resultCopy(result.status) : resultCopy("FAILED");

  return (
    <div className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-10">
      <Card className="w-full">
        <CardContent className="text-center">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl ${copy.tone}`}>
            {copy.icon}
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Ruguna payments
          </p>
          <h1 className="font-heading mt-3 text-4xl font-bold text-[var(--color-ink)]">
            {copy.title}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--color-muted)]">
            {copy.body}
          </p>
          {!result.ok ? (
            <p className="mt-4 rounded-2xl bg-[#f6f5ef] px-4 py-3 text-sm text-[var(--color-muted)]">
              Reference check: {result.reason}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/learn/payments">View payments</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/learn/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
