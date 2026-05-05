import { InvoiceStatus, PaymentStatus } from "@prisma/client";

import { getDb } from "@/lib/db";
import type { PlatformSession } from "@/lib/platform/auth";
import {
  getDatabaseUnavailableMessage,
  isDatabaseConnectionError,
  logDataAccessError,
} from "@/lib/platform/database-errors";
import { MINIMUM_LEARNING_CLEARANCE_PERCENT } from "@/lib/platform/finance-records";
import { ensureUserForSession } from "@/lib/platform/users";

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

function clearancePercent(amountDue: number, amountPaid: number) {
  if (amountDue <= 0) {
    return 100;
  }

  return Math.min(100, Math.round((amountPaid / amountDue) * 100));
}

export async function getLearnerFinanceRecords(session?: PlatformSession) {
  const db = getDb();
  let user;
  let invoices;

  try {
    user = await ensureUserForSession(session);
    invoices = await db.invoice.findMany({
      where: { userId: user.id },
      include: {
        program: true,
        enrollment: { include: { course: true } },
        payments: { orderBy: { createdAt: "desc" } },
      },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }],
    });
  } catch (error) {
    logDataAccessError("Learner finance records lookup failed", error);

    if (isDatabaseConnectionError(error)) {
      return {
        databaseUnavailable: true,
        databaseMessage: getDatabaseUnavailableMessage(error),
        user: null,
        records: [],
        snapshot: {
          amountDue: money(0),
          amountPaid: money(0),
          balance: money(0),
          clearancePercent: 0,
          pendingPaymentCount: 0,
          minimumClearancePercent: MINIMUM_LEARNING_CLEARANCE_PERCENT,
        },
      };
    }

    throw error;
  }

  const records = invoices.map((invoice) => {
    const amountDue = Number(invoice.amountDue);
    const amountPaid = Number(invoice.amountPaid);
    const percent = clearancePercent(amountDue, amountPaid);
    const balance = Math.max(amountDue - amountPaid, 0);
    const isSettled = invoice.status === InvoiceStatus.PAID || balance <= 0;

    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      title: invoice.enrollment?.course.title ?? invoice.program?.title ?? "Ruguna invoice",
      amountDue: money(amountDue),
      amountPaid: money(amountPaid),
      balance: money(balance),
      rawBalance: balance,
      dueDate: invoice.dueDate.toISOString(),
      status: label(invoice.status),
      statusValue: invoice.status,
      enrollmentStatus: invoice.enrollment?.status ?? null,
      minimumClearancePercent: MINIMUM_LEARNING_CLEARANCE_PERCENT,
      clearancePercent: percent,
      canContinue: isSettled || percent >= MINIMUM_LEARNING_CLEARANCE_PERCENT,
      payments: invoice.payments.map((payment) => ({
        id: payment.id,
        amount: money(payment.amount, payment.currency),
        reference: payment.reference,
        method: payment.method,
        status: label(payment.status),
        statusValue: payment.status,
        createdAt: payment.createdAt.toISOString(),
        receivedAt: payment.receivedAt?.toISOString() ?? null,
      })),
    };
  });

  const amountDue = invoices.reduce((total, invoice) => total + Number(invoice.amountDue), 0);
  const amountPaid = invoices.reduce((total, invoice) => total + Number(invoice.amountPaid), 0);
  const pendingPaymentCount = invoices.reduce(
    (total, invoice) =>
      total + invoice.payments.filter((payment) => payment.status === PaymentStatus.PENDING).length,
    0
  );

  return {
    databaseUnavailable: false,
    databaseMessage: null,
    user,
    records,
    snapshot: {
      amountDue: money(amountDue),
      amountPaid: money(amountPaid),
      balance: money(Math.max(amountDue - amountPaid, 0)),
      clearancePercent: clearancePercent(amountDue, amountPaid),
      pendingPaymentCount,
      minimumClearancePercent: MINIMUM_LEARNING_CLEARANCE_PERCENT,
    },
  };
}
