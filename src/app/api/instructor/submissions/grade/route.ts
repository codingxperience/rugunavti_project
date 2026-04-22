import { AuditAction, SubmissionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { gradeSubmissionSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = gradeSubmissionSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();

  try {
    const submission = await db.submission.findUnique({
      where: { id: result.data.submissionId },
      include: {
        assignment: { include: { course: true } },
        enrollment: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Submission was not found." },
        { status: 404 }
      );
    }

    if (
      auth.session.role === "instructor" &&
      submission.assignment.course.ownerId &&
      submission.assignment.course.ownerId !== auth.user.id
    ) {
      return NextResponse.json(
        { success: false, message: "You can only grade submissions for courses assigned to you." },
        { status: 403 }
      );
    }

    if (result.data.score > submission.assignment.maxScore) {
      return NextResponse.json(
        {
          success: false,
          message: `Score cannot exceed the assignment maximum of ${submission.assignment.maxScore}.`,
        },
        { status: 400 }
      );
    }

    const gradedSubmission = await db.submission.update({
      where: { id: submission.id },
      data: {
        score: result.data.score,
        feedback: result.data.feedback,
        status: result.data.returned ? SubmissionStatus.RETURNED : SubmissionStatus.GRADED,
        gradedAt: new Date(),
      },
    });

    const gradedSubmissions = await db.submission.findMany({
      where: {
        enrollmentId: submission.enrollmentId,
        score: { not: null },
      },
      include: { assignment: true },
    });
    const totalPossible = gradedSubmissions.reduce((total, item) => total + item.assignment.maxScore, 0);
    const totalEarned = gradedSubmissions.reduce((total, item) => total + (item.score ?? 0), 0);
    const assessmentRate = totalPossible ? Math.round((totalEarned / totalPossible) * 100) : 0;

    await db.enrollment.update({
      where: { id: submission.enrollmentId },
      data: { assessmentRate },
    });

    await writeAuditLog({
      actorId: auth.user.id,
      action: AuditAction.UPDATE,
      entityType: "Submission",
      entityId: submission.id,
      summary: `${auth.user.email} graded submission for ${submission.assignment.title}.`,
      payload: {
        score: gradedSubmission.score,
        status: gradedSubmission.status,
        assessmentRate,
      },
    });

    return NextResponse.json({
      success: true,
      message: result.data.returned ? "Submission returned with feedback." : "Submission graded.",
      submission: gradedSubmission,
      assessmentRate,
    });
  } catch (error) {
    console.error("Submission grading failed", error);

    return NextResponse.json(
      { success: false, message: "Submission could not be graded." },
      { status: 500 }
    );
  }
}
