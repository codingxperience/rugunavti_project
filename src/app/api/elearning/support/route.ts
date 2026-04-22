import { AuditAction, TicketPriority } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { createUniqueReference } from "@/lib/platform/references";
import { supportTicketSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["student", "instructor", "registrar_admin", "finance_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = supportTicketSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();

  try {
    const ticketNumber = await createUniqueReference("RUG-TKT", async (candidate) => {
      const existing = await db.supportTicket.findUnique({ where: { ticketNumber: candidate } });
      return Boolean(existing);
    });

    const ticket = await db.supportTicket.create({
      data: {
        ticketNumber,
        userId: auth.user.id,
        requesterName: [auth.user.profile?.firstName, auth.user.profile?.lastName].filter(Boolean).join(" "),
        requesterContact: auth.user.email,
        category: result.data.category,
        subject: result.data.subject,
        message: result.data.message,
        priority: TicketPriority.MEDIUM,
      },
    });

    await writeAuditLog({
      actorId: auth.user.id,
      action: AuditAction.CREATE,
      entityType: "SupportTicket",
      entityId: ticket.id,
      summary: `${auth.user.email} opened support ticket ${ticket.ticketNumber}.`,
      payload: {
        ticketNumber: ticket.ticketNumber,
        category: ticket.category,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Support ticket opened.",
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
      },
    });
  } catch (error) {
    console.error("Authenticated support ticket failed", error);

    return NextResponse.json(
      { success: false, message: "Support ticket could not be opened." },
      { status: 500 }
    );
  }
}
