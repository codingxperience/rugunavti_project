import { AuditAction, EnrollmentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { discussionReplySchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["student", "instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = discussionReplySchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();

  try {
    const thread = await db.discussionThread.findUnique({
      where: { id: result.data.threadId },
      include: { course: true },
    });

    if (!thread) {
      return NextResponse.json(
        { success: false, message: "Discussion thread was not found." },
        { status: 404 }
      );
    }

    if (auth.session.role === "student" && thread.courseId) {
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: auth.user.id,
            courseId: thread.courseId,
          },
        },
      });

      if (!enrollment || enrollment.status === EnrollmentStatus.CANCELLED) {
        return NextResponse.json(
          { success: false, message: "You must be enrolled in this course to reply." },
          { status: 403 }
        );
      }
    }

    const reply = await db.discussionReply.create({
      data: {
        threadId: thread.id,
        authorId: auth.user.id,
        body: result.data.body,
      },
    });

    await writeAuditLog({
      actorId: auth.user.id,
      action: AuditAction.CREATE,
      entityType: "DiscussionReply",
      entityId: reply.id,
      summary: `${auth.user.email} replied to ${thread.title}.`,
      payload: {
        threadId: thread.id,
        courseId: thread.courseId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Reply posted.",
      reply,
    });
  } catch (error) {
    console.error("Discussion reply creation failed", error);

    return NextResponse.json(
      { success: false, message: "Your reply could not be posted." },
      { status: 500 }
    );
  }
}
