import { ApplicationStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getDb } from "@/lib/db";
import {
  getDatabaseUnavailableMessage,
  isDatabaseConnectionError,
  logDataAccessError,
  withDatabaseRetry,
} from "@/lib/platform/database-errors";
import { hasDatabase, platformEnv } from "@/lib/platform/env";
import { enforceRateLimit } from "@/lib/platform/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const lookupSchema = z.object({
  reference: z.string().trim().min(6).max(80),
  email: z.string().trim().email().max(254),
});

function formatStatus(status: ApplicationStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function noStoreJson(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...init?.headers,
    },
  });
}

export async function POST(request: Request) {
  const rateLimitResponse = enforceRateLimit(request, {
    keyPrefix: "application-status",
    limit: 10,
    windowMs: 60 * 1000,
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const payload = await request.json().catch(() => null);
  const result = lookupSchema.safeParse(payload);

  if (!result.success) {
    return noStoreJson(
      {
        success: false,
        message: "Enter a valid application reference and email address.",
        errors: result.error.flatten(),
      },
      { status: 400 }
    );
  }

  if (!platformEnv.useDatabase || !hasDatabase) {
    return noStoreJson(
      {
        success: false,
        message: "Application status lookup is temporarily unavailable.",
      },
      { status: 503 }
    );
  }

  const db = getDb();
  const reference = result.data.reference.trim();
  const email = result.data.email.trim().toLowerCase();

  try {
    const application = await withDatabaseRetry("Application status lookup", () =>
      db.application.findFirst({
        where: {
          reference,
          user: {
            email,
          },
        },
        select: {
          reference: true,
          status: true,
          submittedAt: true,
          reviewedAt: true,
          updatedAt: true,
          program: {
            select: {
              title: true,
            },
          },
          intake: {
            select: {
              title: true,
            },
          },
        },
      })
    );

    if (!application) {
      return noStoreJson({
        success: true,
        found: false,
        message:
          "No matching application was found. Check the reference and email exactly as submitted.",
      });
    }

    return noStoreJson({
      success: true,
      found: true,
      application: {
        reference: application.reference,
        status: formatStatus(application.status),
        statusValue: application.status,
        programTitle: application.program.title,
        intakeTitle: application.intake?.title ?? "Intake to be confirmed",
        submittedAt: application.submittedAt?.toISOString() ?? null,
        reviewedAt: application.reviewedAt?.toISOString() ?? null,
        updatedAt: application.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    logDataAccessError("Application status lookup failed", error);

    if (isDatabaseConnectionError(error)) {
      return noStoreJson(
        {
          success: false,
          message: getDatabaseUnavailableMessage(error),
        },
        { status: 503 }
      );
    }

    return noStoreJson(
      {
        success: false,
        message: "Application status could not be checked. Please try again.",
      },
      { status: 500 }
    );
  }
}
