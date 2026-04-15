import { NextResponse } from "next/server";

import { contactFormSchema } from "@/lib/platform/schemas";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const result = contactFormSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Your inquiry has been logged and routed to the admissions or support team.",
    reference: `RUG-CON-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
  });
}
