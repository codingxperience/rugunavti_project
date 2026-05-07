"use server";

import { AuditAction, EnrollmentStatus, InvoiceStatus, PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import {
  paymentCountsTowardPaidTotal,
  recalculateInvoicePaymentStatus,
} from "@/lib/platform/payment-ledger";
import { createUniqueReference } from "@/lib/platform/references";
import { attachUserRole, requireApiUser } from "@/lib/platform/users";

const createInvoiceSchema = z.object({
  learnerEmail: z.string().trim().email(),
  amountDue: z.coerce.number().positive(),
  dueDate: z.string().trim().min(1),
  notes: z.string().trim().max(240).optional(),
});

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

export async function createInvoiceAction(formData: FormData) {
  const auth = await requireApiUser(["finance_admin", "super_admin"]);

  if (!auth.ok) {
    redirect("/elearning/access-denied?next=/finance/invoices");
  }

  const parsed = createInvoiceSchema.safeParse({
    learnerEmail: formData.get("learnerEmail"),
    amountDue: formData.get("amountDue"),
    dueDate: formData.get("dueDate"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    redirect("/finance/invoices?status=invalid-invoice");
  }

  const dueDate = new Date(`${parsed.data.dueDate}T23:59:59.000+03:00`);

  if (Number.isNaN(dueDate.getTime())) {
    redirect("/finance/invoices?status=invalid-invoice");
  }

  const db = getDb();
  const email = parsed.data.learnerEmail.toLowerCase();
  const invoiceNumber = await createUniqueReference("RUG-INV", async (candidate) => {
    const existing = await db.invoice.findUnique({ where: { invoiceNumber: candidate } });
    return Boolean(existing);
  });

  const invoice = await db.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email },
      update: { isActive: true },
      create: { email, isActive: true },
    });
    const latestEnrollment = await tx.enrollment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, programId: true },
    });
    const createdInvoice = await tx.invoice.create({
      data: {
        userId: user.id,
        programId: latestEnrollment?.programId ?? null,
        enrollmentId: latestEnrollment?.id ?? null,
        invoiceNumber,
        amountDue: parsed.data.amountDue,
        dueDate,
        notes: parsed.data.notes || "Finance-issued learner invoice",
        status: InvoiceStatus.ISSUED,
      },
    });

    await writeAuditLog(
      {
        actorId: auth.user.id,
        action: AuditAction.CREATE,
        entityType: "Invoice",
        entityId: createdInvoice.id,
        summary: `Finance issued ${createdInvoice.invoiceNumber} to ${email}.`,
        payload: {
          learnerEmail: email,
          amountDue: parsed.data.amountDue,
          dueDate: dueDate.toISOString(),
        },
      },
      tx
    );

    return createdInvoice;
  });

  const learner = await db.user.findUnique({ where: { email }, select: { id: true } });

  if (learner) {
    await attachUserRole(learner.id, "student");
  }

  revalidatePath("/finance");
  revalidatePath("/finance/invoices");
  revalidatePath("/learn/payments");
  redirect(`/finance/invoices?status=invoice-created&invoice=${encodeURIComponent(invoice.invoiceNumber)}`);
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
        provider: "MANUAL",
        providerStatus: parsed.data.status,
        status: parsed.data.status,
        receivedAt: paymentCountsTowardPaidTotal(parsed.data.status) ? new Date() : null,
        verifiedAt: parsed.data.status === PaymentStatus.VERIFIED ? new Date() : null,
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
        providerStatus: parsed.data.status,
        receivedAt: paymentCountsTowardPaidTotal(parsed.data.status)
          ? (payment.receivedAt ?? new Date())
          : payment.receivedAt,
        verifiedAt:
          parsed.data.status === PaymentStatus.VERIFIED
            ? (payment.verifiedAt ?? new Date())
            : payment.verifiedAt,
        failureReason: parsed.data.status === PaymentStatus.FAILED ? payment.failureReason ?? "Marked failed by finance." : null,
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
