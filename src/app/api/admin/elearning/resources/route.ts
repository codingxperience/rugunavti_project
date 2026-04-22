import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { lessonResourceUpsertSchema } from "@/lib/platform/schemas";
import { validateUploadMetadata } from "@/lib/platform/storage";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = lessonResourceUpsertSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();
  const values = result.data;

  try {
    validateUploadMetadata({
      mimeType: values.mimeType,
      sizeBytes: values.sizeBytes,
    });

    const lesson = await db.lesson.findUnique({
      where: { id: values.lessonId },
      include: { module: { include: { course: true } } },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, message: "Lesson was not found." },
        { status: 404 }
      );
    }

    if (
      auth.session.role === "instructor" &&
      lesson.module.course.ownerId &&
      lesson.module.course.ownerId !== auth.user.id
    ) {
      return NextResponse.json(
        { success: false, message: "You can only attach resources to courses assigned to you." },
        { status: 403 }
      );
    }

    const resource = values.id
      ? await db.lessonResource.update({
          where: { id: values.id },
          data: {
            title: values.title,
            description: values.description,
            fileUrl: values.fileUrl,
            mimeType: values.mimeType,
            sizeBytes: values.sizeBytes,
            isPrivate: values.isPrivate,
          },
        })
      : await db.lessonResource.create({
          data: {
            lessonId: lesson.id,
            title: values.title,
            description: values.description,
            fileUrl: values.fileUrl,
            mimeType: values.mimeType,
            sizeBytes: values.sizeBytes,
            isPrivate: values.isPrivate,
          },
        });

    await writeAuditLog({
      actorId: auth.user.id,
      action: values.id ? AuditAction.UPDATE : AuditAction.CREATE,
      entityType: "LessonResource",
      entityId: resource.id,
      summary: `${auth.user.email} ${values.id ? "updated" : "attached"} resource ${resource.title}.`,
      payload: {
        lessonId: lesson.id,
        mimeType: resource.mimeType,
        isPrivate: resource.isPrivate,
      },
    });

    return NextResponse.json({
      success: true,
      message: values.id ? "Resource updated." : "Resource attached.",
      resource,
    });
  } catch (error) {
    console.error("Lesson resource upsert failed", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Resource could not be saved.",
      },
      { status: 400 }
    );
  }
}
