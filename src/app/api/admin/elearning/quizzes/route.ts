import { AuditAction, ContentStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { quizUpsertSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

export async function POST(request: Request) {
  const auth = await requireApiUser(["instructor", "registrar_admin", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = quizUpsertSchema.safeParse(payload);

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
        { success: false, message: "You can only manage quizzes for courses assigned to you." },
        { status: 403 }
      );
    }

    const quiz = values.id
      ? await db.quiz.update({
          where: { id: values.id },
          data: {
            lessonId: values.lessonId,
            title: values.title,
            summary: values.summary,
            instructions: values.instructions,
            timeLimitMinutes: values.timeLimitMinutes,
            passingScore: values.passingScore,
            maxAttempts: values.maxAttempts,
            status: values.published ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
          },
        })
      : await db.quiz.create({
          data: {
            courseId: values.courseId,
            lessonId: values.lessonId,
            title: values.title,
            summary: values.summary,
            instructions: values.instructions,
            timeLimitMinutes: values.timeLimitMinutes,
            passingScore: values.passingScore,
            maxAttempts: values.maxAttempts,
            status: values.published ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
          },
        });

    if (values.questions.length) {
      await db.quizQuestion.deleteMany({ where: { quizId: quiz.id } });
      await db.quizQuestion.createMany({
        data: values.questions.map((question) => ({
          quizId: quiz.id,
          prompt: question.prompt,
          questionType: question.questionType,
          options: question.options as Prisma.InputJsonValue | undefined,
          correctAnswer: question.correctAnswer as Prisma.InputJsonValue,
          explanation: question.explanation,
          points: question.points,
          position: question.position,
        })),
      });
    }

    const savedQuiz = await db.quiz.findUnique({
      where: { id: quiz.id },
      include: { questions: { orderBy: { position: "asc" } } },
    });

    await writeAuditLog({
      actorId: auth.user.id,
      action: values.id ? AuditAction.UPDATE : AuditAction.CREATE,
      entityType: "Quiz",
      entityId: quiz.id,
      summary: `${auth.user.email} ${values.id ? "updated" : "created"} quiz ${quiz.title}.`,
      payload: {
        courseId: quiz.courseId,
        lessonId: quiz.lessonId,
        status: quiz.status,
        questions: values.questions.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: values.id ? "Quiz updated." : "Quiz created.",
      quiz: savedQuiz,
    });
  } catch (error) {
    console.error("Quiz upsert failed", error);

    return NextResponse.json(
      { success: false, message: "Quiz could not be saved." },
      { status: 500 }
    );
  }
}
