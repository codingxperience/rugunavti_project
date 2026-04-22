import { AuditAction, TicketPriority } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { hasDatabase, platformEnv } from "@/lib/platform/env";
import { enforceRateLimit } from "@/lib/platform/rate-limit";
import { createUniqueReference } from "@/lib/platform/references";
import { contactFormSchema } from "@/lib/platform/schemas";

function createFallbackReference() {
  return `RUG-CON-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export async function POST(request: Request) {
  const rateLimitResponse = enforceRateLimit(request, {
    keyPrefix: "contact",
    limit: 8,
    windowMs: 60 * 1000,
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const payload = await request.json().catch(() => null);
  const result = contactFormSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  if (!platformEnv.useDatabase) {
    return NextResponse.json({
      success: true,
      message: "Your inquiry has been logged and routed to the admissions or support team.",
      reference: createFallbackReference(),
    });
  }

  if (!hasDatabase) {
    return NextResponse.json(
      {
        success: false,
        message: "Database is not configured. Support could not save this inquiry.",
      },
      { status: 503 }
    );
  }

  const db = getDb();
  const values = result.data;

  try {
    const ticketNumber = await createUniqueReference("RUG-TKT", async (candidate) => {
      const existing = await db.supportTicket.findUnique({ where: { ticketNumber: candidate } });
      return Boolean(existing);
    });

    const ticket = await db.supportTicket.create({
      data: {
        ticketNumber,
        requesterName: values.fullName,
        requesterContact: values.emailOrPhone,
        category: values.category,
        subject: `${values.category} inquiry from ${values.fullName}`,
        message: values.message,
        priority: TicketPriority.MEDIUM,
      },
    });

    await writeAuditLog({
      action: AuditAction.CREATE,
      entityType: "SupportTicket",
      entityId: ticket.id,
      summary: `Public inquiry ${ticket.ticketNumber} submitted from website.`,
      payload: {
        ticketNumber: ticket.ticketNumber,
        category: values.category,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been saved and routed to admissions or learner support.",
      reference: ticket.ticketNumber,
    });
  } catch (error) {
    console.error("Contact inquiry failed", error);

    return NextResponse.json(
      {
        success: false,
        message: "Support could not save this inquiry. Please try again or use WhatsApp.",
      },
      { status: 500 }
    );
  }
}
