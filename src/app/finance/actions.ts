"use server";

import { AuditAction, EnrollmentStatus, InvoiceStatus, PaymentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { requireApiUser } from "@/lib/platform/users";

const invoiceStatusSchema = z.object({
  invoiceId: z.string().min(1),
  status: z.nativeEnum(InvoiceStatus),
  holdEnrollment: z.enum(["none", "hold", "release"]).default("none"),
});

const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.coerce.number().positive(),
  reference: z.string().trim().min(3).max(80),
  method: z.string().trim().min(2).max(80),
  status: z.nativeEnum(PaymentStatus).default(PaymentStatus.RECEIVED),
});

const paymentStatusSchema = z.object({
  paymentId: z.string().min(1),
  status: z.nativeEnum(PaymentStatus),
});

function nextInvoiceStatus(amountDue: number, amountPaid: number, fallback: InvoiceStatus) {
  if (amountPaid <= 0) {
    return fallback;
  }

  if (amountPaid >= amountDue) {
    return InvoiceStatus.PAID;
  }

  return InvoiceStatus.PARTIALLY_PAID;
}

function countsTowardPaidTotal(status: PaymentStatus) {
  return status === PaymentStatus.RECEIVED || status === PaymentStatus.VERIFIED;
}

async function recalculateInvoicePaymentStatus(
  tx: Prisma.TransactionClient,
  invoiceId: string,
  fallback: InvoiceStatus
) {
  const invoice = await tx.invoice.findUnique({
    where: { id: invoiceId },
    select: { amountDue: true },
  });

  if (!invoice) {
    return;
  }

  const payments = await tx.payment.findMany({
    where: { invoiceId },
    select: { amount: true, status: true },
  });
  const amountPaid = payments
    .filter((payment) => countsTowardPaidTotal(payment.status))
    .reduce((total, payment) => total + Number(payment.amount), 0);

  await tx.invoice.update({
    where: { id: invoiceId },
    data: {
      amountPaid,
      status: nextInvoiceStatus(Number(invoice.amountDue), amountPaid, fallback),
    },
  });
}

export async function updateInvoiceStatusAction(formData: FormData) {
  const auth = await requireApiUser(["finance_admin", "super_admin"]);

  if (!auth.ok) {
    redirect("/elearning/access-denied?next=/finance");
  }

  const parsed = invoiceStatusSchema.safeParse({
    invoiceId: formData.get("invoiceId"),
    status: formData.get("status"),
    holdEnrollment: formData.get("holdEnrollment") || "none",
  });

  if (!parsed.success) {
    redirect("/finance?status=invalid-invoice-update");
  }

  const db = getDb();
  const invoice = await db.invoice.findUnique({
    where: { id: parsed.data.invoiceId },
    include: { enrollment: true, user: true },
  });

  if (!invoice) {
    redirect("/finance?status=invoice-not-found");
  }

  await db.$transaction(async (tx) => {
    await tx.invoice.update({
      where: { id: invoice.id },
      data: { status: parsed.data.status },
    });

    if (invoice.enrollmentId && parsed.data.holdEnrollment !== "none") {
      await tx.enrollment.update({
        where: { id: invoice.enrollmentId },
        data: {
          status:
            parsed.data.holdEnrollment === "hold"
              ? EnrollmentStatus.ON_HOLD
              : EnrollmentStatus.ACTIVE,
        },
      });
    }

    await writeAuditLog(
      {
        actorId: auth.user.id,
        action: AuditAction.UPDATE,
        entityType: "Invoice",
        entityId: invoice.id,
        summary: `Finance updated ${invoice.invoiceNumber} to ${parsed.data.status}.`,
        payload: {
          invoiceNumber: invoice.invoiceNumber,
          status: parsed.data.status,
          holdEnrollment: parsed.data.holdEnrollment,
        },
      },
      tx
    );
  });

  revalidatePath("/finance");
  redirect("/finance?status=invoice-updated");
}

export async function recordPaymentAction(formData: FormData) {
  const auth = await requireApiUser(["finance_admin", "super_admin"]);

  if (!auth.ok) {
    redirect("/elearning/access-denied?next=/finance");
  }

  const parsed = paymentSchema.safeParse({
    invoiceId: formData.get("invoiceId"),
    amount: formData.get("amount"),
    reference: formData.get("reference"),
    method: formData.get("method"),
    status: formData.get("status") || PaymentStatus.RECEIVED,
  });

  if (!parsed.success) {
    redirect("/finance?status=invalid-payment");
  }

  const db = getDb();
  const invoice = await db.invoice.findUnique({
    where: { id: parsed.data.invoiceId },
    include: { payments: true },
  });

  if (!invoice) {
    redirect("/finance?status=invoice-not-found");
  }

  const referenceExists = await db.payment.findUnique({
    where: { reference: parsed.data.reference },
    select: { id: true },
  });

  if (referenceExists) {
    redirect("/finance?status=duplicate-reference");
  }

  await db.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        userId: invoice.userId,
        invoiceId: invoice.id,
        amount: parsed.data.amount,
        reference: parsed.data.reference,
        method: parsed.data.method,
        status: parsed.data.status,
        receivedAt: countsTowardPaidTotal(parsed.data.status) ? new Date() : null,
      },
    });

    await recalculateInvoicePaymentStatus(tx, invoice.id, invoice.status);

    await writeAuditLog(
      {
        actorId: auth.user.id,
        action: AuditAction.CREATE,
        entityType: "Payment",
        entityId: payment.id,
        summary: `Finance recorded payment ${payment.reference} for ${invoice.invoiceNumber}.`,
        payload: {
          invoiceNumber: invoice.invoiceNumber,
          amount: parsed.data.amount,
          status: parsed.data.status,
        },
      },
      tx
    );
  });

  revalidatePath("/finance");
  revalidatePath("/finance/payments");
  redirect("/finance?status=payment-recorded");
}

export async function updatePaymentStatusAction(formData: FormData) {
  const auth = await requireApiUser(["finance_admin", "super_admin"]);

  if (!auth.ok) {
    redirect("/elearning/access-denied?next=/finance/payments");
  }

  const parsed = paymentStatusSchema.safeParse({
    paymentId: formData.get("paymentId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect("/finance/payments?status=invalid-payment-status");
  }

  const db = getDb();
  const payment = await db.payment.findUnique({
    where: { id: parsed.data.paymentId },
    include: { invoice: true },
  });

  if (!payment) {
    redirect("/finance/payments?status=payment-not-found");
  }

  await db.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: parsed.data.status,
        receivedAt: countsTowardPaidTotal(parsed.data.status)
          ? (payment.receivedAt ?? new Date())
          : payment.receivedAt,
      },
    });

    if (payment.invoiceId && payment.invoice) {
      await recalculateInvoicePaymentStatus(tx, payment.invoiceId, payment.invoice.status);
    }

    await writeAuditLog(
      {
        actorId: auth.user.id,
        action: AuditAction.UPDATE,
        entityType: "Payment",
        entityId: payment.id,
        summary: `Finance marked payment ${payment.reference} as ${parsed.data.status}.`,
        payload: {
          invoiceNumber: payment.invoice?.invoiceNumber ?? null,
          reference: payment.reference,
          status: parsed.data.status,
        },
      },
      tx
    );
  });

  revalidatePath("/finance");
  revalidatePath("/finance/payments");
  redirect("/finance/payments?status=payment-updated");
}
