import { AnnouncementScope, AuditAction, ContentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { announcementSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function GET() {
  const auth = await requireApiUser(["instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const db = getDb();
  const announcements = await db.announcement.findMany({
    where:
      auth.session.role === "instructor"
        ? {
            OR: [
              { createdById: auth.user.id },
              { course: { ownerId: auth.user.id } },
              { course: { ownerId: null } },
            ],
          }
        : {},
    include: {
      course: true,
      school: true,
      program: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ success: true, announcements });
}

export async function POST(request: Request) {
  const auth = await requireApiUser(["instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = announcementSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();
  const values = result.data;

  try {
    if (auth.session.role === "instructor" && values.courseId) {
      const course = await db.course.findUnique({ where: { id: values.courseId } });

      if (!course || (course.ownerId && course.ownerId !== auth.user.id)) {
        return NextResponse.json(
          { success: false, message: "You can only announce to courses assigned to you." },
          { status: 403 }
        );
      }
    }

    if (auth.session.role === "instructor" && values.scope !== AnnouncementScope.COURSE) {
      return NextResponse.json(
        { success: false, message: "Instructors can only publish course announcements." },
        { status: 403 }
      );
    }

    const announcement = await db.announcement.create({
      data: {
        title: values.title,
        body: values.body,
        scope: values.scope,
        schoolId: values.schoolId,
        programId: values.programId,
        courseId: values.courseId,
        status: values.published ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
        createdById: auth.user.id,
        updatedById: auth.user.id,
        publishedAt: values.published ? new Date() : null,
      },
    });

    await writeAuditLog({
      actorId: auth.user.id,
      action: values.published ? AuditAction.PUBLISH : AuditAction.CREATE,
      entityType: "Announcement",
      entityId: announcement.id,
      summary: `${auth.user.email} created announcement ${announcement.title}.`,
      payload: {
        scope: announcement.scope,
        status: announcement.status,
        courseId: announcement.courseId,
      },
    });

    return NextResponse.json({
      success: true,
      message: values.published ? "Announcement published." : "Announcement saved as draft.",
      announcement,
    });
  } catch (error) {
    console.error("Announcement creation failed", error);

    return NextResponse.json(
      { success: false, message: "Announcement could not be saved." },
      { status: 500 }
    );
  }
}
