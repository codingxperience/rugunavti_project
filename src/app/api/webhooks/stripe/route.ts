import { NextResponse } from "next/server";

import { settleStripeWebhookEvent } from "@/lib/platform/checkout-providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  try {
    const result = await settleStripeWebhookEvent(rawBody, signature);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe webhook failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
