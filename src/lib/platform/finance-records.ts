import { EnrollmentStatus, InvoiceStatus, PaymentStatus } from "@prisma/client";

import { getDb } from "@/lib/db";
import {
  getDatabaseUnavailableMessage,
  isDatabaseConnectionError,
  isDatabaseSchemaMismatchError,
  logDataAccessError,
} from "@/lib/platform/database-errors";

export const MINIMUM_LEARNING_CLEARANCE_PERCENT = 50;

function money(value: unknown, currency = "UGX") {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function label(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function iso(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

function isInvoiceOverdue(status: InvoiceStatus) {
  return (
    status === InvoiceStatus.ISSUED ||
    status === InvoiceStatus.PARTIALLY_PAID ||
    status === InvoiceStatus.OVERDUE
  );
}

export type FinanceInvoiceRow = {
  id: string;
  invoiceNumber: string;
  learner: string;
  email: string;
  program: string;
  course: string;
  amountDue: string;
  amountPaid: string;
  balance: string;
  clearancePercent: number;
  minimumClearancePercent: number;
  belowMinimumClearance: boolean;
  dueDate: string;
  status: string;
  statusValue: InvoiceStatus;
  enrollmentStatus: string | null;
  paymentCount: number;
  latestPaymentReference: string | null;
};

function emptyFinanceRecords(error?: unknown) {
  const databaseMessage = isDatabaseSchemaMismatchError(error)
    ? "Finance records need the latest payment migration. Run Prisma migrations, then refresh this page."
    : getDatabaseUnavailableMessage(error);

  return {
    databaseUnavailable: true,
    databaseMessage,
    snapshot: {
      invoiceCount: 0,
      issuedTotal: money(0),
      paidTotal: money(0),
      verifiedTotal: money(0),
      overdueCount: 0,
      holdCount: 0,
    },
    invoices: [] as FinanceInvoiceRow[],
    payments: [] as Array<{
      id: string;
      learner: string;
      email: string;
      invoiceNumber: string;
      amount: string;
      currency: string;
      reference: string;
      method: string;
      provider: string | null;
      providerReference: string | null;
      providerStatus: string | null;
      failureReason: string | null;
      status: string;
      statusValue: PaymentStatus;
      receivedAt: string | null;
      verifiedAt: string | null;
      createdAt: string;
    }>,
  };
}

export async function getFinanceWorkspaceRecords() {
  const db = getDb();
  const now = new Date();
  let invoices;
  let payments;
  let holdCount;

  try {
    [invoices, payments, holdCount] = await Promise.all([
      db.invoice.findMany({
        include: {
          user: { include: { profile: true } },
          program: true,
          enrollment: { include: { course: true } },
          payments: { orderBy: { createdAt: "desc" } },
        },
        orderBy: [{ status: "asc" }, { dueDate: "asc" }],
        take: 150,
      }),
      db.payment.findMany({
        include: {
          user: { include: { profile: true } },
          invoice: true,
        },
        orderBy: { createdAt: "desc" },
        take: 40,
      }),
      db.enrollment.count({ where: { status: EnrollmentStatus.ON_HOLD } }),
    ]);
  } catch (error) {
    logDataAccessError("Finance workspace records lookup failed", error);

    if (isDatabaseConnectionError(error) || isDatabaseSchemaMismatchError(error)) {
      return emptyFinanceRecords(error);
    }

    throw error;
  }

  const rows: FinanceInvoiceRow[] = invoices.map((invoice) => {
    const learner =
      [invoice.user.profile?.firstName, invoice.user.profile?.lastName].filter(Boolean).join(" ") ||
      invoice.user.email;
    const amountDue = Number(invoice.amountDue);
    const amountPaid = Number(invoice.amountPaid);
    const balance = Math.max(amountDue - amountPaid, 0);
    const clearancePercent = amountDue > 0 ? Math.min(100, Math.round((amountPaid / amountDue) * 100)) : 100;

    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      learner,
      email: invoice.user.email,
      program: invoice.program?.title ?? "Course invoice",
      course: invoice.enrollment?.course.title ?? "Not linked",
      amountDue: money(invoice.amountDue),
      amountPaid: money(invoice.amountPaid),
      balance: money(balance),
      clearancePercent,
      minimumClearancePercent: MINIMUM_LEARNING_CLEARANCE_PERCENT,
      belowMinimumClearance:
        clearancePercent < MINIMUM_LEARNING_CLEARANCE_PERCENT &&
        invoice.status !== InvoiceStatus.PAID &&
        invoice.status !== InvoiceStatus.VOID,
      dueDate: invoice.dueDate.toISOString(),
      status: label(invoice.status),
      statusValue: invoice.status,
      enrollmentStatus: invoice.enrollment?.status ? label(invoice.enrollment.status) : null,
      paymentCount: invoice.payments.length,
      latestPaymentReference: invoice.payments[0]?.reference ?? null,
    };
  });

  const issuedTotal = invoices.reduce((total, invoice) => total + Number(invoice.amountDue), 0);
  const paidTotal = invoices.reduce((total, invoice) => total + Number(invoice.amountPaid), 0);
  const verifiedTotal = payments
    .filter((payment) => payment.status === PaymentStatus.VERIFIED)
    .reduce((total, payment) => total + Number(payment.amount), 0);
  const overdueCount = invoices.filter(
    (invoice) => invoice.dueDate < now && isInvoiceOverdue(invoice.status)
  ).length;

  return {
    databaseUnavailable: false,
    databaseMessage: null,
    snapshot: {
      invoiceCount: invoices.length,
      issuedTotal: money(issuedTotal),
      paidTotal: money(paidTotal),
      verifiedTotal: money(verifiedTotal),
      overdueCount,
      holdCount,
    },
    invoices: rows,
    payments: payments.map((payment) => {
      const learner =
        [payment.user.profile?.firstName, payment.user.profile?.lastName].filter(Boolean).join(" ") ||
        payment.user.email;

      return {
        id: payment.id,
        learner,
        email: payment.user.email,
        invoiceNumber: payment.invoice?.invoiceNumber ?? "Unapplied",
        amount: money(payment.amount, payment.currency),
        currency: payment.currency,
        reference: payment.reference,
        method: payment.method,
        provider: payment.provider,
        providerReference: payment.providerReference,
        providerStatus: payment.providerStatus,
        failureReason: payment.failureReason,
        status: label(payment.status),
        statusValue: payment.status,
        receivedAt: iso(payment.receivedAt),
        verifiedAt: iso(payment.verifiedAt),
        createdAt: payment.createdAt.toISOString(),
      };
    }),
  };
}
