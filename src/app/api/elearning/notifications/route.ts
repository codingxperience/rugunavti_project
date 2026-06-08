import { AnnouncementScope, ApplicationStatus, ContentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { isDatabaseConnectionError, logDataAccessError } from "@/lib/platform/database-errors";
import { hasDatabase, platformEnv } from "@/lib/platform/env";
import { getCurrentSession } from "@/lib/platform/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatStatus(status: ApplicationStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

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
        applications: {
          where: {
            status: {
              in: [
                ApplicationStatus.SUBMITTED,
                ApplicationStatus.IN_REVIEW,
                ApplicationStatus.DOCUMENTS_REQUIRED,
                ApplicationStatus.OFFERED,
                ApplicationStatus.WAITLISTED,
              ],
            },
          },
          orderBy: { updatedAt: "desc" },
          take: 2,
          select: {
            id: true,
            reference: true,
            status: true,
            updatedAt: true,
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

    const applicationNotifications =
      user?.applications.map((item) => ({
        id: `application-${item.id}`,
        title: `Application ${item.reference}: ${formatStatus(item.status)}`,
        scope: "APPLICATION",
        date: item.updatedAt.toISOString(),
        href: "/apply/status",
      })) ?? [];

    return NextResponse.json({
      count: count + applicationNotifications.length,
      latest: [
        ...applicationNotifications,
        ...latest.map((item) => ({
        id: item.id,
        title: item.title,
        scope: item.scope,
        date: (item.publishedAt ?? item.createdAt).toISOString(),
        href: "/learn/announcements",
        })),
      ]
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        .slice(0, 3),
    });
  } catch (error) {
    logDataAccessError("Header notification lookup failed", error);

    if (!isDatabaseConnectionError(error)) {
      throw error;
    }

    return NextResponse.json({ count: 0, latest: [] });
  }
}
