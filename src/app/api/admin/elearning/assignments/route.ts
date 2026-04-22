import { AssignmentStatus, AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { assignmentUpsertSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = assignmentUpsertSchema.safeParse(payload);

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
        { success: false, message: "You can only manage assignments for courses assigned to you." },
        { status: 403 }
      );
    }

    const assignment = values.id
      ? await db.assignment.update({
          where: { id: values.id },
          data: {
            lessonId: values.lessonId,
            title: values.title,
            brief: values.brief,
            instructions: values.instructions,
            dueAt: values.dueAt ? new Date(values.dueAt) : null,
            maxScore: values.maxScore,
            allowRetry: values.allowRetry,
            acceptedMimeTypes: values.acceptedMimeTypes,
            status: values.published ? AssignmentStatus.PUBLISHED : AssignmentStatus.DRAFT,
          },
        })
      : await db.assignment.create({
          data: {
            courseId: values.courseId,
            lessonId: values.lessonId,
            title: values.title,
            brief: values.brief,
            instructions: values.instructions,
            dueAt: values.dueAt ? new Date(values.dueAt) : null,
            maxScore: values.maxScore,
            allowRetry: values.allowRetry,
            acceptedMimeTypes: values.acceptedMimeTypes,
            status: values.published ? AssignmentStatus.PUBLISHED : AssignmentStatus.DRAFT,
          },
        });

    await writeAuditLog({
      actorId: auth.user.id,
      action: values.id ? AuditAction.UPDATE : AuditAction.CREATE,
      entityType: "Assignment",
      entityId: assignment.id,
      summary: `${auth.user.email} ${values.id ? "updated" : "created"} assignment ${assignment.title}.`,
      payload: {
        courseId: assignment.courseId,
        lessonId: assignment.lessonId,
        status: assignment.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: values.id ? "Assignment updated." : "Assignment created.",
      assignment,
    });
  } catch (error) {
    console.error("Assignment upsert failed", error);

    return NextResponse.json(
      { success: false, message: "Assignment could not be saved." },
      { status: 500 }
    );
  }
}
