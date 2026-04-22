import { AuditAction, ContentStatus, EnrollmentStatus, LessonProgressStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { lessonProgressSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["student", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = lessonProgressSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();
  const { courseSlug, lessonId, completed } = result.data;

  try {
    const course = await db.course.findFirst({
      where: {
        slug: courseSlug,
        status: ContentStatus.PUBLISHED,
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course was not found." },
        { status: 404 }
      );
    }

    const lesson = await db.lesson.findFirst({
      where: {
        id: lessonId,
        module: {
          courseId: course.id,
        },
      },
      include: {
        module: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, message: "Lesson was not found in this course." },
        { status: 404 }
      );
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: auth.user.id,
          courseId: course.id,
        },
      },
    });

    if (!enrollment || enrollment.status !== EnrollmentStatus.ACTIVE) {
      return NextResponse.json(
        { success: false, message: "You must be actively enrolled before recording lesson progress." },
        { status: 403 }
      );
    }

    const progress = await db.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
        },
      },
      update: {
        status: completed ? LessonProgressStatus.COMPLETED : LessonProgressStatus.IN_PROGRESS,
        completedAt: completed ? new Date() : null,
        lastAccessedAt: new Date(),
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId: lesson.id,
        userId: auth.user.id,
        status: completed ? LessonProgressStatus.COMPLETED : LessonProgressStatus.IN_PROGRESS,
        completedAt: completed ? new Date() : null,
      },
    });

    const [totalLessons, completedLessons] = await Promise.all([
      db.lesson.count({
        where: {
          status: ContentStatus.PUBLISHED,
          module: {
            courseId: course.id,
          },
        },
      }),
      db.lessonProgress.count({
        where: {
          enrollmentId: enrollment.id,
          status: LessonProgressStatus.COMPLETED,
          lesson: {
            status: ContentStatus.PUBLISHED,
            module: {
              courseId: course.id,
            },
          },
        },
      }),
    ]);

    const progressPercent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const updatedEnrollment = await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progressPercent,
        eligibleForCertificate: progressPercent >= 100,
        status: progressPercent >= 100 ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
        completedAt: progressPercent >= 100 ? new Date() : null,
      },
    });

    await writeAuditLog({
      actorId: auth.user.id,
      action: AuditAction.UPDATE,
      entityType: "LessonProgress",
      entityId: progress.id,
      summary: `${auth.user.email} updated progress for ${lesson.title}.`,
      payload: {
        courseSlug,
        lessonId: lesson.id,
        status: progress.status,
        progressPercent,
      },
    });

    return NextResponse.json({
      success: true,
      message: completed ? "Lesson marked complete." : "Lesson progress saved.",
      progress: {
        id: progress.id,
        status: progress.status,
        courseProgressPercent: updatedEnrollment.progressPercent,
        eligibleForCertificate: updatedEnrollment.eligibleForCertificate,
      },
    });
  } catch (error) {
    console.error("Lesson progress update failed", error);

    return NextResponse.json(
      { success: false, message: "Lesson progress could not be saved." },
      { status: 500 }
    );
  }
}
