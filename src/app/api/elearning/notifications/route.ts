import { AnnouncementScope, ContentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { isDatabaseConnectionError, logDataAccessError } from "@/lib/platform/database-errors";
import { hasDatabase, platformEnv } from "@/lib/platform/env";
import { getCurrentSession } from "@/lib/platform/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await getCurrentSession();

  if (!session.isAuthenticated || !platformEnv.useDatabase || !hasDatabase) {
    return NextResponse.json({ count: 0, latest: [] });
  }

  try {
    const db = getDb();
    const user = await db.user.findFirst({
      where: {
        OR: [
          ...(session.clerkUserId ? [{ clerkId: session.clerkUserId }] : []),
          ...(session.email ? [{ email: session.email.toLowerCase() }] : []),
        ],
      },
      select: {
        enrollments: {
          select: {
            courseId: true,
            programId: true,
            course: { select: { schoolId: true } },
          },
        },
      },
    });

    const courseIds = user?.enrollments.map((item) => item.courseId).filter(Boolean) ?? [];
    const programIds = user?.enrollments.map((item) => item.programId).filter(Boolean) ?? [];
    const schoolIds = user?.enrollments.map((item) => item.course?.schoolId).filter(Boolean) ?? [];

    const where = {
      status: ContentStatus.PUBLISHED,
      OR: [
        { scope: AnnouncementScope.PLATFORM },
        ...(courseIds.length ? [{ courseId: { in: courseIds } }] : []),
        ...(programIds.length ? [{ programId: { in: programIds } }] : []),
        ...(schoolIds.length ? [{ schoolId: { in: schoolIds } }] : []),
      ],
    };

    const [count, latest] = await Promise.all([
      db.announcement.count({ where }),
      db.announcement.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 3,
        select: {
          id: true,
          title: true,
          scope: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      count,
      latest: latest.map((item) => ({
        id: item.id,
        title: item.title,
        scope: item.scope,
        date: (item.publishedAt ?? item.createdAt).toISOString(),
      })),
    });
  } catch (error) {
    logDataAccessError("Header notification lookup failed", error);

    if (!isDatabaseConnectionError(error)) {
      throw error;
    }

    return NextResponse.json({ count: 0, latest: [] });
  }
}
