"use server";

import { AuditAction, PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { requireApiUser } from "@/lib/platform/users";

const paymentReferenceSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.coerce.number().positive(),
  method: z.enum(["MTN Mobile Money", "Airtel Money", "Bank transfer", "Card or virtual card"]),
  reference: z.string().trim().min(3).max(80),
});

export async function submitLearnerPaymentReferenceAction(formData: FormData) {
  const auth = await requireApiUser(["student", "super_admin"]);

  if (!auth.ok) {
    redirect("/elearning/login?next=/learn/payments");
  }

  const parsed = paymentReferenceSchema.safeParse({
    invoiceId: formData.get("invoiceId"),
    amount: formData.get("amount"),
    method: formData.get("method"),
    reference: formData.get("reference"),
  });

  if (!parsed.success) {
    redirect("/learn/payments?status=invalid-reference");
  }

  const db = getDb();
  const invoice = await db.invoice.findUnique({
    where: { id: parsed.data.invoiceId },
    select: {
      id: true,
      userId: true,
      invoiceNumber: true,
      amountDue: true,
      amountPaid: true,
    },
  });

  if (!invoice || invoice.userId !== auth.user.id) {
    redirect("/learn/payments?status=invoice-not-found");
  }

  const balance = Math.max(Number(invoice.amountDue) - Number(invoice.amountPaid), 0);

  if (parsed.data.amount > balance && balance > 0) {
    redirect("/learn/payments?status=amount-too-high");
  }

  const duplicate = await db.payment.findUnique({
    where: { reference: parsed.data.reference },
    select: { id: true },
  });

  if (duplicate) {
    redirect("/learn/payments?status=duplicate-reference");
  }

  await db.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        userId: auth.user.id,
        invoiceId: invoice.id,
        amount: parsed.data.amount,
        reference: parsed.data.reference,
        method: parsed.data.method,
        status: PaymentStatus.PENDING,
      },
    });

    await writeAuditLog(
      {
        actorId: auth.user.id,
        action: AuditAction.CREATE,
        entityType: "Payment",
        entityId: payment.id,
        summary: `Learner submitted payment reference ${payment.reference}.`,
        payload: {
          invoiceNumber: invoice.invoiceNumber,
          method: payment.method,
          amount: parsed.data.amount,
        },
      },
      tx
    );
  });

  revalidatePath("/learn/payments");
  redirect("/learn/payments?status=reference-submitted");
}
