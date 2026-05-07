import crypto from "node:crypto";

import { AuditAction, PaymentStatus, Prisma } from "@prisma/client";
import Stripe from "stripe";

import { getDb } from "@/lib/db";
import { platformEnv } from "@/lib/platform/env";
import { settleProviderPayment } from "@/lib/platform/payment-ledger";
import { writeAuditLog } from "@/lib/platform/audit";

type CheckoutProvider = "stripe" | "flutterwave";

type CheckoutInvoice = {
  id: string;
  invoiceNumber: string;
  userId: string;
  amountDue: Prisma.Decimal;
  amountPaid: Prisma.Decimal;
  status: import("@prisma/client").InvoiceStatus;
  user: {
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      phone: string | null;
    } | null;
  };
};

const zeroDecimalCurrencies = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

let stripeClient: Stripe | null = null;

function readEnv(key: string) {
  const value = process.env[key]?.trim();
  return value ? value : null;
}

function getSiteUrl() {
  return (platformEnv.siteOrigin || platformEnv.siteUrl || "http://localhost:3000").replace(/\/$/, "");
}

function getPaymentCurrency(provider: CheckoutProvider) {
  const providerCurrency =
    provider === "stripe"
      ? readEnv("STRIPE_CHECKOUT_CURRENCY")
      : readEnv("FLUTTERWAVE_CHECKOUT_CURRENCY");

  return (providerCurrency || readEnv("RUGUNA_PAYMENT_CURRENCY") || "UGX").toUpperCase();
}

function toMinorUnit(amount: number, currency: string) {
  return zeroDecimalCurrencies.has(currency.toUpperCase())
    ? Math.round(amount)
    : Math.round(amount * 100);
}

function fromMinorUnit(amount: number | null | undefined, currency: string) {
  const safeAmount = Number(amount ?? 0);
  return zeroDecimalCurrencies.has(currency.toUpperCase()) ? safeAmount : safeAmount / 100;
}

function getStripeClient() {
  const secretKey = readEnv("STRIPE_SECRET_KEY");

  if (!secretKey) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      maxNetworkRetries: 2,
      timeout: 20_000,
    });
  }

  return stripeClient;
}

export function getOnlinePaymentProviderStatus() {
  return {
    stripe: Boolean(readEnv("STRIPE_SECRET_KEY")),
    stripeWebhook: Boolean(readEnv("STRIPE_WEBHOOK_SECRET")),
    flutterwave: Boolean(readEnv("FLUTTERWAVE_SECRET_KEY")),
    flutterwaveWebhook: Boolean(readEnv("FLUTTERWAVE_WEBHOOK_SECRET_HASH")),
    testMode: readEnv("RUGUNA_PAYMENT_MODE") !== "live",
  };
}

export function getCheckoutReference(provider: CheckoutProvider, invoiceNumber: string) {
  const prefix = provider === "stripe" ? "STR" : "FLW";
  const safeInvoice = invoiceNumber.replace(/[^a-zA-Z0-9]/g, "").slice(-12);
  return `RUG-${prefix}-${safeInvoice}-${Date.now().toString(36)}`.toUpperCase();
}

type CreateCheckoutInput = {
  invoice: CheckoutInvoice;
  amount: number;
  provider: CheckoutProvider;
};

function assertAmountWithinBalance(invoice: CheckoutInvoice, amount: number) {
  const balance = Math.max(Number(invoice.amountDue) - Number(invoice.amountPaid), 0);

  if (amount <= 0 || !Number.isFinite(amount)) {
    return { ok: false as const, reason: "invalid-amount" };
  }

  if (amount > balance && balance > 0) {
    return { ok: false as const, reason: "amount-too-high" };
  }

  return { ok: true as const, balance };
}

export async function createPaymentCheckout(input: CreateCheckoutInput) {
  const amountCheck = assertAmountWithinBalance(input.invoice, input.amount);

  if (!amountCheck.ok) {
    return amountCheck;
  }

  const reusableCheckout = await getDb().payment.findFirst({
    where: {
      invoiceId: input.invoice.id,
      userId: input.invoice.userId,
      amount: input.amount,
      provider: input.provider === "stripe" ? "STRIPE" : "FLUTTERWAVE",
      status: PaymentStatus.PENDING,
      checkoutUrl: { not: null },
      createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) },
    },
    select: {
      checkoutUrl: true,
      reference: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (reusableCheckout?.checkoutUrl) {
    return {
      ok: true as const,
      checkoutUrl: reusableCheckout.checkoutUrl,
      reference: reusableCheckout.reference,
      reused: true,
    };
  }

  if (input.provider === "stripe") {
    return createStripeCheckout(input);
  }

  return createFlutterwaveCheckout(input);
}

async function createStripeCheckout({ invoice, amount }: CreateCheckoutInput) {
  const stripe = getStripeClient();

  if (!stripe) {
    return { ok: false as const, reason: "stripe-not-configured" };
  }

  const db = getDb();
  const currency = getPaymentCurrency("stripe");
  const reference = getCheckoutReference("stripe", invoice.invoiceNumber);
  const payment = await db.payment.create({
    data: {
      userId: invoice.userId,
      invoiceId: invoice.id,
      amount,
      currency,
      reference,
      method: "Stripe Checkout",
      provider: "STRIPE",
      status: PaymentStatus.PENDING,
    },
  });

  try {
    const siteUrl = getSiteUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: invoice.user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: toMinorUnit(amount, currency),
            product_data: {
              name: `Ruguna College invoice ${invoice.invoiceNumber}`,
              description: "Tuition or learning access payment",
            },
          },
        },
      ],
      metadata: {
        paymentId: payment.id,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        reference,
      },
      success_url: `${siteUrl}/learn/payments/complete?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/learn/payments?status=checkout-cancelled`,
    });

    await db.payment.update({
      where: { id: payment.id },
      data: {
        providerReference: session.id,
        providerStatus: session.status ?? "open",
        checkoutUrl: session.url,
        rawPayload: {
          stripeSessionId: session.id,
          paymentStatus: session.payment_status,
          status: session.status,
          urlCreated: Boolean(session.url),
        },
      },
    });

    await writeAuditLog({
      actorId: invoice.userId,
      action: AuditAction.CREATE,
      entityType: "Payment",
      entityId: payment.id,
      summary: `Learner started Stripe checkout ${reference}.`,
      payload: {
        invoiceNumber: invoice.invoiceNumber,
        amount,
        currency,
        stripeSessionId: session.id,
      },
    });

    return { ok: true as const, checkoutUrl: session.url, reference };
  } catch (error) {
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.FAILED,
        failureReason: error instanceof Error ? error.message : "Stripe checkout failed.",
        providerStatus: "checkout_failed",
      },
    });

    return { ok: false as const, reason: "stripe-checkout-failed" };
  }
}

async function createFlutterwaveCheckout({ invoice, amount }: CreateCheckoutInput) {
  const secretKey = readEnv("FLUTTERWAVE_SECRET_KEY");

  if (!secretKey) {
    return { ok: false as const, reason: "flutterwave-not-configured" };
  }

  const db = getDb();
  const currency = getPaymentCurrency("flutterwave");
  const reference = getCheckoutReference("flutterwave", invoice.invoiceNumber);
  const name = [invoice.user.profile?.firstName, invoice.user.profile?.lastName].filter(Boolean).join(" ");
  const siteUrl = getSiteUrl();
  const payment = await db.payment.create({
    data: {
      userId: invoice.userId,
      invoiceId: invoice.id,
      amount,
      currency,
      reference,
      method: "Flutterwave Checkout",
      provider: "FLUTTERWAVE",
      status: PaymentStatus.PENDING,
    },
  });

  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: reference,
        amount,
        currency,
        redirect_url: `${siteUrl}/learn/payments/complete?provider=flutterwave`,
        customer: {
          email: invoice.user.email,
          name: name || invoice.user.email,
          phonenumber: invoice.user.profile?.phone ?? undefined,
        },
        customizations: {
          title: "Ruguna College",
          description: `Invoice ${invoice.invoiceNumber}`,
          logo: `${siteUrl}/brand/ruguna_logo_v2.jpeg`,
        },
        meta: {
          paymentId: payment.id,
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
        },
      }),
    });

    const payload = (await response.json()) as {
      status?: string;
      message?: string;
      data?: { link?: string };
    };

    if (!response.ok || payload.status !== "success" || !payload.data?.link) {
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          providerStatus: payload.status ?? "checkout_failed",
          failureReason: payload.message || "Flutterwave checkout failed.",
          rawPayload: payload as Prisma.InputJsonValue,
        },
      });

      return { ok: false as const, reason: payload.message || "flutterwave-checkout-failed" };
    }

    await db.payment.update({
      where: { id: payment.id },
      data: {
        providerStatus: payload.status,
        checkoutUrl: payload.data.link,
        rawPayload: payload as Prisma.InputJsonValue,
      },
    });

    await writeAuditLog({
      actorId: invoice.userId,
      action: AuditAction.CREATE,
      entityType: "Payment",
      entityId: payment.id,
      summary: `Learner started Flutterwave checkout ${reference}.`,
      payload: {
        invoiceNumber: invoice.invoiceNumber,
        amount,
        currency,
      },
    });

    return { ok: true as const, checkoutUrl: payload.data.link, reference };
  } catch (error) {
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.FAILED,
        providerStatus: "checkout_failed",
        failureReason: error instanceof Error ? error.message : "Flutterwave checkout failed.",
      },
    });

    return { ok: false as const, reason: "flutterwave-checkout-failed" };
  }
}

export async function settleStripeCheckoutSession(sessionId: string) {
  const stripe = getStripeClient();

  if (!stripe) {
    return { ok: false as const, reason: "stripe-not-configured" };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const reference = session.metadata?.reference;

  if (!reference) {
    return { ok: false as const, reason: "missing-reference" };
  }

  const currency = session.currency?.toUpperCase() ?? null;
  const paidAmount = currency ? fromMinorUnit(session.amount_total, currency) : null;
  const status = session.payment_status === "paid" ? "success" : "pending";

  return getDb().$transaction((tx) =>
    settleProviderPayment(tx, {
      reference,
      provider: "Stripe",
      providerReference: session.id,
      status,
      paidAmount,
      currency,
      providerStatus: session.payment_status,
      payload: {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        status: session.status,
        amountTotal: session.amount_total,
        currency: session.currency,
      },
    })
  );
}

export async function settleStripeWebhookEvent(rawBody: string, signature: string | null) {
  const stripe = getStripeClient();
  const webhookSecret = readEnv("STRIPE_WEBHOOK_SECRET");

  if (!stripe || !webhookSecret || !signature) {
    return { ok: false as const, reason: "stripe-webhook-not-configured" };
  }

  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return { ok: true as const, ignored: true };
  }

  const session = event.data.object as Stripe.Checkout.Session;
  return settleStripeCheckoutSession(session.id);
}

type FlutterwaveTransaction = {
  id?: number;
  tx_ref?: string;
  flw_ref?: string;
  status?: string;
  amount?: number;
  currency?: string;
  charged_amount?: number;
};

export async function verifyAndSettleFlutterwavePayment(input: {
  transactionId?: string | number | null;
  txRef?: string | null;
}) {
  const secretKey = readEnv("FLUTTERWAVE_SECRET_KEY");

  if (!secretKey) {
    return { ok: false as const, reason: "flutterwave-not-configured" };
  }

  const transactionId = input.transactionId ? String(input.transactionId) : null;
  const txRef = input.txRef?.trim() || null;
  const url = transactionId
    ? `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`
    : txRef
      ? `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`
      : null;

  if (!url) {
    return { ok: false as const, reason: "missing-reference" };
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  const payload = (await response.json()) as {
    status?: string;
    message?: string;
    data?: FlutterwaveTransaction;
  };
  const data = payload.data;
  const reference = data?.tx_ref ?? txRef;

  if (!response.ok || payload.status !== "success" || !data || !reference) {
    return { ok: false as const, reason: payload.message || "verification-failed" };
  }

  return getDb().$transaction((tx) =>
    settleProviderPayment(tx, {
      reference,
      provider: "Flutterwave",
      providerReference: data.flw_ref ?? (data.id ? String(data.id) : null),
      status: data.status === "successful" ? "success" : data.status === "failed" ? "failed" : "pending",
      paidAmount: Number(data.charged_amount ?? data.amount ?? 0),
      currency: data.currency ?? null,
      providerStatus: data.status ?? payload.status ?? null,
      payload: {
        transactionId: data.id ?? null,
        flutterwaveStatus: data.status ?? null,
        flutterwaveReference: data.flw_ref ?? null,
        message: payload.message ?? null,
      },
    })
  );
}

export function verifyFlutterwaveWebhookSignature(rawBody: string, headers: Headers) {
  const secret = readEnv("FLUTTERWAVE_WEBHOOK_SECRET_HASH");

  if (!secret) {
    return false;
  }

  const hmacSignature = headers.get("flutterwave-signature");

  if (hmacSignature) {
    const expectedBase64 = crypto.createHmac("sha256", secret).update(rawBody).digest("base64");
    const expectedHex = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    return safeCompare(expectedBase64, hmacSignature) || safeCompare(expectedHex, hmacSignature);
  }

  const legacyHash = headers.get("verif-hash") || headers.get("VERIF-HASH");
  return Boolean(legacyHash && safeCompare(secret, legacyHash));
}

function safeCompare(expected: string, actual: string) {
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
