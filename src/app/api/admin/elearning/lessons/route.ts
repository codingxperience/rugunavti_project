import { AuditAction, ContentStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { lessonUpsertSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = lessonUpsertSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();
  const values = result.data;

  try {
    const module = await db.module.findUnique({
      where: { id: values.moduleId },
      include: { course: true },
    });

    if (!module) {
      return NextResponse.json(
        { success: false, message: "Module was not found." },
        { status: 404 }
      );
    }

    if (auth.session.role === "instructor" && module.course.ownerId && module.course.ownerId !== auth.user.id) {
      return NextResponse.json(
        { success: false, message: "You can only manage lessons for courses assigned to you." },
        { status: 403 }
      );
    }

    const lesson = values.id
      ? await db.lesson.update({
          where: { id: values.id },
          data: {
            slug: values.slug,
            title: values.title,
            summary: values.summary,
            body: values.body as Prisma.InputJsonValue,
            lessonType: values.lessonType,
            position: values.position,
            durationMinutes: values.durationMinutes,
            videoUrl: values.videoUrl,
            liveSessionUrl: values.liveSessionUrl,
            status: values.published ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
          },
        })
      : await db.lesson.create({
          data: {
            moduleId: values.moduleId,
            slug: values.slug,
            title: values.title,
            summary: values.summary,
            body: values.body as Prisma.InputJsonValue,
            lessonType: values.lessonType,
            position: values.position,
            durationMinutes: values.durationMinutes,
            videoUrl: values.videoUrl,
            liveSessionUrl: values.liveSessionUrl,
            status: values.published ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
          },
        });

    await writeAuditLog({
      actorId: auth.user.id,
      action: values.id ? AuditAction.UPDATE : AuditAction.CREATE,
      entityType: "Lesson",
      entityId: lesson.id,
      summary: `${auth.user.email} ${values.id ? "updated" : "created"} lesson ${lesson.title}.`,
      payload: {
        moduleId: values.moduleId,
        type: lesson.lessonType,
        position: lesson.position,
        status: lesson.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: values.id ? "Lesson updated." : "Lesson created.",
      lesson,
    });
  } catch (error) {
    console.error("Lesson upsert failed", error);

    return NextResponse.json(
      { success: false, message: "Lesson could not be saved." },
      { status: 500 }
    );
  }
}
