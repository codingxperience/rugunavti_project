import { AuditAction, DiscussionThreadType, EnrollmentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { discussionThreadSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["student", "instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = discussionThreadSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();

  try {
    const lesson = result.data.lessonId
      ? await db.lesson.findUnique({
          where: { id: result.data.lessonId },
          include: { module: true },
        })
      : null;
    const courseId = lesson?.module.courseId ?? result.data.courseId;

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "Choose a valid course or lesson for the discussion." },
        { status: 400 }
      );
    }

    const course = await db.course.findUnique({ where: { id: courseId } });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course was not found." },
        { status: 404 }
      );
    }

    if (auth.session.role === "student") {
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: auth.user.id,
            courseId,
          },
        },
      });

      if (!enrollment || enrollment.status === EnrollmentStatus.CANCELLED) {
        return NextResponse.json(
          { success: false, message: "You must be enrolled in this course to start a discussion." },
          { status: 403 }
        );
      }
    }

    const thread = await db.discussionThread.create({
      data: {
        courseId,
        lessonId: lesson?.id,
        authorId: auth.user.id,
        threadType: lesson ? DiscussionThreadType.LESSON : DiscussionThreadType.COURSE,
        title: result.data.title,
        body: result.data.body,
      },
    });

    await writeAuditLog({
      actorId: auth.user.id,
      action: AuditAction.CREATE,
      entityType: "DiscussionThread",
      entityId: thread.id,
      summary: `${auth.user.email} started a discussion in ${course.title}.`,
      payload: {
        courseId,
        lessonId: lesson?.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Discussion posted.",
      thread,
    });
  } catch (error) {
    console.error("Discussion thread creation failed", error);

    return NextResponse.json(
      { success: false, message: "Your discussion could not be posted." },
      { status: 500 }
    );
  }
}
