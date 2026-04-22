import { AuditAction, AssignmentStatus, EnrollmentStatus, SubmissionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { assignmentSubmissionSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["student", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = assignmentSubmissionSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();

  try {
    const assignment = await db.assignment.findFirst({
      where: {
        id: result.data.assignmentId,
        status: AssignmentStatus.PUBLISHED,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, message: "This assignment is not open for submission." },
        { status: 404 }
      );
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: auth.user.id,
          courseId: assignment.courseId,
        },
      },
    });

    if (!enrollment || enrollment.status === EnrollmentStatus.CANCELLED) {
      return NextResponse.json(
        { success: false, message: "You must be enrolled in this course to submit work." },
        { status: 403 }
      );
    }

    const now = new Date();
    const status =
      assignment.dueAt && assignment.dueAt.getTime() < now.getTime()
        ? SubmissionStatus.LATE
        : SubmissionStatus.SUBMITTED;

    const submission = await db.submission.upsert({
      where: {
        assignmentId_enrollmentId: {
          assignmentId: assignment.id,
          enrollmentId: enrollment.id,
        },
      },
      update: {
        body: result.data.body,
        fileUrl: result.data.fileUrl,
        status,
        submittedAt: now,
      },
      create: {
        assignmentId: assignment.id,
        enrollmentId: enrollment.id,
        userId: auth.user.id,
        body: result.data.body,
        fileUrl: result.data.fileUrl,
        status,
        submittedAt: now,
      },
    });

    await writeAuditLog({
      actorId: auth.user.id,
      action: AuditAction.UPDATE,
      entityType: "Submission",
      entityId: submission.id,
      summary: `${auth.user.email} submitted ${assignment.title}.`,
      payload: {
        assignmentId: assignment.id,
        status: submission.status,
        hasFile: Boolean(submission.fileUrl),
      },
    });

    return NextResponse.json({
      success: true,
      message: status === SubmissionStatus.LATE ? "Submission saved as late." : "Submission saved.",
      submission: {
        id: submission.id,
        status: submission.status,
        submittedAt: submission.submittedAt,
      },
    });
  } catch (error) {
    console.error("Assignment submission failed", error);

    return NextResponse.json(
      { success: false, message: "Your assignment submission could not be saved." },
      { status: 500 }
    );
  }
}
