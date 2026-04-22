import type { AuditAction, Prisma } from "@prisma/client";

import { getDb } from "@/lib/db";
import { hasDatabase, platformEnv } from "@/lib/platform/env";

type AuditInput = {
  actorId?: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string;
  summary: string;
  payload?: Prisma.InputJsonValue;
};

export async function writeAuditLog(input: AuditInput) {
  if (!platformEnv.useDatabase || !hasDatabase) {
    return;
  }

  const db = getDb();

  await db.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      summary: input.summary,
      payload: input.payload,
    },
  });
}
