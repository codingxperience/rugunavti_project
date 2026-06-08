import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import {
  isDatabaseConnectionError,
  logDataAccessError,
} from "@/lib/platform/database-errors";
import { hasDatabase, platformEnv } from "@/lib/platform/env";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAuthorizedCronRequest(request: Request) {
  const secret = platformEnv.cronSecret;

  if (!secret) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!platformEnv.useDatabase || !hasDatabase) {
    return NextResponse.json(
      {
        ok: false,
        service: "supabase-postgres",
        message: "Database mode is not configured.",
      },
      { status: 503 }
    );
  }

  const startedAt = Date.now();

  try {
    await getDb().$queryRaw<Array<{ ok: number }>>`SELECT 1 AS ok`;

    return NextResponse.json(
      {
        ok: true,
        service: "supabase-postgres",
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    logDataAccessError("Supabase keepalive failed", error);

    return NextResponse.json(
      {
        ok: false,
        service: "supabase-postgres",
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        databaseConnectionError: isDatabaseConnectionError(error),
        message: "Supabase/Postgres health check failed.",
      },
      { status: 503 }
    );
  }
}
