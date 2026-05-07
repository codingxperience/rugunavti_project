import { AuditAction, EnrollmentStatus, InvoiceStatus, PaymentStatus, Prisma } from "@prisma/client";

import { MINIMUM_LEARNING_CLEARANCE_PERCENT } from "@/lib/platform/finance-records";
import { writeAuditLog } from "@/lib/platform/audit";

export function paymentCountsTowardPaidTotal(status: PaymentStatus) {
  return status === PaymentStatus.RECEIVED || status === PaymentStatus.VERIFIED;
}

export function nextInvoiceStatus(
  amountDue: number,
  amountPaid: number,
  fallback: InvoiceStatus
) {
  if (amountPaid <= 0) {
    return fallback === InvoiceStatus.PAID || fallback === InvoiceStatus.PARTIALLY_PAID
      ? InvoiceStatus.ISSUED
      : fallback;
  }

  if (amountPaid >= amountDue) {
    return InvoiceStatus.PAID;
  }

  return InvoiceStatus.PARTIALLY_PAID;
}

export async function recalculateInvoicePaymentStatus(
  tx: Prisma.TransactionClient,
  invoiceId: string,
  fallback: InvoiceStatus
) {
  const invoice = await tx.invoice.findUnique({
    where: { id: invoiceId },
    select: {
      amountDue: true,
      enrollmentId: true,
      enrollment: { select: { status: true } },
    },
  });

  if (!invoice) {
    return;
  }

  const payments = await tx.payment.findMany({
    where: { invoiceId },
    select: { amount: true, status: true },
  });
  const amountDue = Number(invoice.amountDue);
  const amountPaid = payments
    .filter((payment) => paymentCountsTowardPaidTotal(payment.status))
    .reduce((total, payment) => total + Number(payment.amount), 0);
  const clearancePercent = amountDue > 0 ? Math.min(100, Math.round((amountPaid / amountDue) * 100)) : 100;

  await tx.invoice.update({
    where: { id: invoiceId },
    data: {
      amountPaid,
      status: nextInvoiceStatus(amountDue, amountPaid, fallback),
    },
  });

  if (
    invoice.enrollmentId &&
    invoice.enrollment?.status === EnrollmentStatus.ON_HOLD &&
    clearancePercent >= MINIMUM_LEARNING_CLEARANCE_PERCENT
  ) {
    await tx.enrollment.update({
      where: { id: invoice.enrollmentId },
      data: { status: EnrollmentStatus.ACTIVE },
    });
  }
}

type SettlementStatus = "success" | "failed" | "pending";

type ProviderSettlementInput = {
  reference: string;
  provider: "Stripe" | "Flutterwave";
  providerReference?: string | null;
  status: SettlementStatus;
  paidAmount?: number | null;
  currency?: string | null;
  payload?: Prisma.InputJsonValue;
  providerStatus?: string | null;
};

export async function settleProviderPayment(
  tx: Prisma.TransactionClient,
  input: ProviderSettlementInput
) {
  const payment = await tx.payment.findUnique({
    where: { reference: input.reference },
    include: { invoice: true },
  });

  if (!payment) {
    return { ok: false as const, reason: "payment-not-found" };
  }

  if (!payment.invoiceId || !payment.invoice) {
    return { ok: false as const, reason: "invoice-not-found" };
  }

  const expectedAmount = Number(payment.amount);
  const paidAmount = Number(input.paidAmount ?? 0);
  const expectedCurrency = payment.currency.toUpperCase();
  const paidCurrency = (input.currency ?? payment.currency).toUpperCase();
  const amountMatches = input.status !== "success" || paidAmount + 0.01 >= expectedAmount;
  const currencyMatches = input.status !== "success" || expectedCurrency === paidCurrency;
  const nextStatus =
    input.status === "success" && amountMatches && currencyMatches
      ? PaymentStatus.VERIFIED
      : input.status === "failed" || !amountMatches || !currencyMatches
        ? PaymentStatus.FAILED
        : PaymentStatus.PENDING;

  const updated = await tx.payment.update({
    where: { id: payment.id },
    data: {
      status: nextStatus,
      provider: input.provider.toUpperCase(),
      providerReference: input.providerReference ?? payment.providerReference,
      providerStatus: input.providerStatus ?? input.status,
      rawPayload: input.payload ?? payment.rawPayload ?? Prisma.JsonNull,
      failureReason:
        nextStatus === PaymentStatus.FAILED
          ? !amountMatches
            ? "Provider amount was lower than the invoice payment amount."
            : !currencyMatches
              ? "Provider currency did not match the invoice payment currency."
              : `${input.provider} reported the payment as failed.`
          : null,
      receivedAt:
        nextStatus === PaymentStatus.VERIFIED
          ? (payment.receivedAt ?? new Date())
          : payment.receivedAt,
      verifiedAt:
        nextStatus === PaymentStatus.VERIFIED
          ? (payment.verifiedAt ?? new Date())
          : payment.verifiedAt,
    },
  });

  await recalculateInvoicePaymentStatus(tx, payment.invoiceId, payment.invoice.status);

  await writeAuditLog(
    {
      actorId: null,
      action: AuditAction.UPDATE,
      entityType: "Payment",
      entityId: payment.id,
      summary:
        nextStatus === PaymentStatus.VERIFIED
          ? `${input.provider} verified payment ${payment.reference}.`
          : `${input.provider} updated payment ${payment.reference} to ${nextStatus}.`,
      payload: {
        provider: input.provider,
        providerReference: input.providerReference ?? null,
        reference: payment.reference,
        invoiceNumber: payment.invoice.invoiceNumber,
        expectedAmount,
        paidAmount,
        expectedCurrency,
        paidCurrency,
        amountMatches,
        currencyMatches,
        payload: input.payload ?? null,
      },
    },
    tx
  );

  return {
    ok: true as const,
    status: updated.status,
    invoiceId: payment.invoiceId,
    invoiceNumber: payment.invoice.invoiceNumber,
  };
}
