import { AuditAction, ContentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { moduleUpsertSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = moduleUpsertSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();
  const values = result.data;

  try {
    const course = await db.course.findUnique({ where: { id: values.courseId } });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course was not found." },
        { status: 404 }
      );
    }

    if (auth.session.role === "instructor" && course.ownerId && course.ownerId !== auth.user.id) {
      return NextResponse.json(
        { success: false, message: "You can only manage modules for courses assigned to you." },
        { status: 403 }
      );
    }

    const courseModule = values.id
      ? await db.module.update({
          where: { id: values.id },
          data: {
            title: values.title,
            summary: values.summary,
            position: values.position,
            status: values.published ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
          },
        })
      : await db.$transaction(async (tx) => {
          const existingAtPosition = await tx.module.findFirst({
            where: {
              courseId: values.courseId,
              position: values.position,
            },
            select: { id: true },
          });
          const lastModule = existingAtPosition
            ? await tx.module.findFirst({
                where: { courseId: values.courseId },
                orderBy: { position: "desc" },
                select: { position: true },
              })
            : null;
          const finalPosition = existingAtPosition
            ? (lastModule?.position ?? values.position) + 1
            : values.position;

          return tx.module.create({
            data: {
              courseId: values.courseId,
              title: values.title,
              summary: values.summary,
              position: finalPosition,
              status: values.published ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
            },
          });
        });

    await writeAuditLog({
      actorId: auth.user.id,
      action: values.id ? AuditAction.UPDATE : AuditAction.CREATE,
      entityType: "Module",
      entityId: courseModule.id,
      summary: `${auth.user.email} ${values.id ? "updated" : "created"} module ${courseModule.title}.`,
      payload: {
        courseId: values.courseId,
        position: courseModule.position,
        status: courseModule.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: values.id ? "Module updated." : "Module created.",
      module: courseModule,
    });
  } catch (error) {
    console.error("Module upsert failed", error);

    return NextResponse.json(
      { success: false, message: "Module could not be saved." },
      { status: 500 }
    );
  }
}
