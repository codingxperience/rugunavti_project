import { AuditAction, ContentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { courseWeekUpsertSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = courseWeekUpsertSchema.safeParse(payload);

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
        { success: false, message: "You can only manage weekly plans for courses assigned to you." },
        { status: 403 }
      );
    }

    const week = values.id
      ? await db.courseWeek.update({
          where: { id: values.id },
          data: {
            weekNumber: values.weekNumber,
            title: values.title,
            overview: values.overview,
            topic: values.topic,
            preparationQuizTitle: values.preparationQuizTitle,
            preparationMaterials: values.preparationMaterials,
            preparationReading: values.preparationReading,
            teachOneAnotherTask: values.teachOneAnotherTask,
            ponderProveTask: values.ponderProveTask,
            liveSessionNote: values.liveSessionNote || null,
            dueDateOffsetDays: values.dueDateOffsetDays,
            status: values.published ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
          },
        })
      : await db.courseWeek.upsert({
          where: {
            courseId_weekNumber: {
              courseId: values.courseId,
              weekNumber: values.weekNumber,
            },
          },
          update: {
            title: values.title,
            overview: values.overview,
            topic: values.topic,
            preparationQuizTitle: values.preparationQuizTitle,
            preparationMaterials: values.preparationMaterials,
            preparationReading: values.preparationReading,
            teachOneAnotherTask: values.teachOneAnotherTask,
            ponderProveTask: values.ponderProveTask,
            liveSessionNote: values.liveSessionNote || null,
            dueDateOffsetDays: values.dueDateOffsetDays,
            status: values.published ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
          },
          create: {
            courseId: values.courseId,
            weekNumber: values.weekNumber,
            title: values.title,
            overview: values.overview,
            topic: values.topic,
            preparationQuizTitle: values.preparationQuizTitle,
            preparationMaterials: values.preparationMaterials,
            preparationReading: values.preparationReading,
            teachOneAnotherTask: values.teachOneAnotherTask,
            ponderProveTask: values.ponderProveTask,
            liveSessionNote: values.liveSessionNote || null,
            dueDateOffsetDays: values.dueDateOffsetDays,
            status: values.published ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
          },
        });

    await writeAuditLog({
      actorId: auth.user.id,
      action: values.id ? AuditAction.UPDATE : AuditAction.CREATE,
      entityType: "CourseWeek",
      entityId: week.id,
      summary: `${auth.user.email} ${values.id ? "updated" : "created"} week ${week.weekNumber} for ${course.title}.`,
      payload: {
        courseId: course.id,
        weekNumber: week.weekNumber,
        status: week.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: values.id ? "Week updated." : "Week saved.",
      week,
    });
  } catch (error) {
    console.error("Course week upsert failed", error);

    return NextResponse.json(
      { success: false, message: "Weekly plan could not be saved." },
      { status: 500 }
    );
  }
}
