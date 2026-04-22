import { AuditAction, ContentStatus, EnrollmentStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { quizAttemptSchema } from "@/lib/platform/schemas";
import { requireApiUser } from "@/lib/platform/users";

function normalizeAnswer(value: unknown): string {
  if (Array.isArray(value)) {
    return JSON.stringify([...value].map(String).sort());
  }

  if (value && typeof value === "object") {
    return JSON.stringify(
      Object.fromEntries(
        Object.entries(value as Record<string, unknown>).sort(([left], [right]) =>
          left.localeCompare(right)
        )
      )
    );
  }

  return JSON.stringify(value);
}

export async function POST(request: Request) {
  const auth = await requireApiUser(["student", "super_admin"]);

  if (!auth.ok) {
    return NextResponse.json(auth.response, { status: auth.status });
  }

  const payload = await request.json().catch(() => null);
  const result = quizAttemptSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const db = getDb();

  try {
    const quiz = await db.quiz.findFirst({
      where: {
        id: result.data.quizId,
        status: ContentStatus.PUBLISHED,
      },
      include: {
        questions: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, message: "This quiz is not available." },
        { status: 404 }
      );
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: auth.user.id,
          courseId: quiz.courseId,
        },
      },
    });

    if (!enrollment || enrollment.status === EnrollmentStatus.CANCELLED) {
      return NextResponse.json(
        { success: false, message: "You must be enrolled in this course to attempt the quiz." },
        { status: 403 }
      );
    }

    const attemptCount = await db.quizAttempt.count({
      where: {
        quizId: quiz.id,
        userId: auth.user.id,
      },
    });

    if (attemptCount >= quiz.maxAttempts) {
      return NextResponse.json(
        { success: false, message: "You have used all available attempts for this quiz." },
        { status: 409 }
      );
    }

    const responseByQuestion = new Map(result.data.answers.map((answer) => [answer.questionId, answer.response]));
    const totalPoints = quiz.questions.reduce((total, question) => total + question.points, 0);
    let earnedPoints = 0;

    const answers = quiz.questions
      .filter((question) => responseByQuestion.has(question.id))
      .map((question) => {
        const response = responseByQuestion.get(question.id);
        const isCorrect = normalizeAnswer(response) === normalizeAnswer(question.correctAnswer);

        if (isCorrect) {
          earnedPoints += question.points;
        }

        return {
          quizQuestionId: question.id,
          response: response as Prisma.InputJsonValue,
          isCorrect,
        };
      });

    if (!answers.length) {
      return NextResponse.json(
        { success: false, message: "No valid quiz answers were submitted." },
        { status: 400 }
      );
    }

    const score = totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passingScore;
    const attempt = await db.quizAttempt.create({
      data: {
        quizId: quiz.id,
        enrollmentId: enrollment.id,
        userId: auth.user.id,
        score,
        passed,
        submittedAt: new Date(),
        answers: {
          create: answers,
        },
      },
      include: {
        answers: true,
      },
    });

    await writeAuditLog({
      actorId: auth.user.id,
      action: AuditAction.CREATE,
      entityType: "QuizAttempt",
      entityId: attempt.id,
      summary: `${auth.user.email} submitted quiz ${quiz.title}.`,
      payload: {
        quizId: quiz.id,
        score,
        passed,
        attemptNumber: attemptCount + 1,
      },
    });

    return NextResponse.json({
      success: true,
      message: passed ? "Quiz submitted and passed." : "Quiz submitted for review.",
      attempt: {
        id: attempt.id,
        score: attempt.score,
        passed: attempt.passed,
        attemptNumber: attemptCount + 1,
        remainingAttempts: Math.max(quiz.maxAttempts - attemptCount - 1, 0),
      },
    });
  } catch (error) {
    console.error("Quiz attempt failed", error);

    return NextResponse.json(
      { success: false, message: "Your quiz attempt could not be saved." },
      { status: 500 }
    );
  }
}
