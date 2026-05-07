import { NextResponse } from "next/server";

import {
  verifyAndSettleFlutterwavePayment,
  verifyFlutterwaveWebhookSignature,
} from "@/lib/platform/checkout-providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!verifyFlutterwaveWebhookSignature(rawBody, request.headers)) {
    return NextResponse.json({ ok: false, error: "Invalid Flutterwave webhook signature." }, { status: 401 });
  }

  let payload: {
    event?: string;
    type?: string;
    data?: {
      id?: number | string;
      tx_ref?: string;
      reference?: string;
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const transactionId =
    typeof payload.data?.id === "number" || /^\d+$/.test(String(payload.data?.id ?? ""))
      ? payload.data?.id
      : null;

  const result = await verifyAndSettleFlutterwavePayment({
    transactionId,
    txRef: payload.data?.tx_ref ?? payload.data?.reference,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
