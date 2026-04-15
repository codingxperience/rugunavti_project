import { NextResponse } from "next/server";

import { applicationFormSchema } from "@/lib/platform/schemas";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const result = applicationFormSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Your application interest has been submitted to admissions review.",
    reference: `RUG-APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`,
  });
}
