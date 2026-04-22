import {
  AssignmentStatus,
  ContentStatus,
  EnrollmentStatus,
  LessonProgressStatus,
  SubmissionStatus,
} from "@prisma/client";

import { getDb } from "@/lib/db";
import { ensureUserForSession } from "@/lib/platform/users";

export type LearnerCourseRecord = {
  id: string;
  enrollmentId: string;
  slug: string;
  title: string;
  school: string;
  program: string;
  delivery: string;
  progress: number;
  status: string;
  moduleCount: number;
  lessonCount: number;
  completedLessons: number;
  nextLesson: {
    id: string;
    title: string;
    moduleTitle: string;
  } | null;
  pendingAssignments: number;
  quizAttempts: number;
  certificates: number;
};

export async function getLearnerWorkspaceRecords() {
  const db = getDb();
  const user = await ensureUserForSession();

  const enrollments = await db.enrollment.findMany({
    where: {
      userId: user.id,
      status: { not: EnrollmentStatus.CANCELLED },
    },
    include: {
      course: {
        include: {
          school: true,
          program: true,
          modules: {
            where: { status: ContentStatus.PUBLISHED },
            include: {
              lessons: {
                where: { status: ContentStatus.PUBLISHED },
                include: {
                  progress: {
                    where: { userId: user.id },
                  },
                },
                orderBy: { position: "asc" },
              },
            },
            orderBy: { position: "asc" },
          },
          assignments: {
            where: { status: "PUBLISHED" },
            include: {
              submissions: {
                where: { userId: user.id },
              },
            },
          },
          quizzes: {
            where: { status: ContentStatus.PUBLISHED },
            include: {
              attempts: {
                where: { userId: user.id },
              },
            },
          },
          announcements: {
            where: { status: ContentStatus.PUBLISHED },
            orderBy: { createdAt: "desc" },
            take: 3,
          },
        },
      },
      certificates: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const records: LearnerCourseRecord[] = enrollments.map((enrollment) => {
    const lessons = enrollment.course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title }))
    );
    const completedLessons = lessons.filter((lesson) =>
      lesson.progress.some((progress) => progress.status === LessonProgressStatus.COMPLETED)
    ).length;
    const nextLesson =
      lessons.find((lesson) =>
        lesson.progress.every((progress) => progress.status !== LessonProgressStatus.COMPLETED)
      ) ?? lessons[0] ?? null;
    const pendingAssignments = enrollment.course.assignments.filter((assignment) =>
      assignment.submissions.every(
        (submission) =>
          submission.status !== SubmissionStatus.SUBMITTED &&
          submission.status !== SubmissionStatus.GRADED &&
          submission.status !== SubmissionStatus.RETURNED
      )
    ).length;
    const quizAttempts = enrollment.course.quizzes.reduce(
      (count, quiz) => count + quiz.attempts.length,
      0
    );

    return {
      id: enrollment.course.id,
      enrollmentId: enrollment.id,
      slug: enrollment.course.slug,
      title: enrollment.course.title,
      school: enrollment.course.school.name,
      program: enrollment.course.program.title,
      delivery: enrollment.course.deliveryMode.replace(/_/g, " "),
      progress: enrollment.progressPercent,
      status: enrollment.status,
      moduleCount: enrollment.course.modules.length,
      lessonCount: lessons.length,
      completedLessons,
      nextLesson: nextLesson
        ? {
            id: nextLesson.id,
            title: nextLesson.title,
            moduleTitle: nextLesson.moduleTitle,
          }
        : null,
      pendingAssignments,
      quizAttempts,
      certificates: enrollment.certificates.length,
    };
  });

  const recommendedCourses = await db.course.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      enrollments: {
        none: { userId: user.id },
      },
    },
    include: {
      school: true,
      program: true,
      modules: {
        where: { status: ContentStatus.PUBLISHED },
        include: {
          lessons: { where: { status: ContentStatus.PUBLISHED } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
    take: 4,
  });

  const announcements = await db.announcement.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      OR: [
        { scope: "PLATFORM" },
        { courseId: { in: records.map((course) => course.id) } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const activeCourses = records.filter((course) => course.status !== EnrollmentStatus.COMPLETED).length;
  const averageProgress = records.length
    ? Math.round(records.reduce((total, course) => total + course.progress, 0) / records.length)
    : 0;
  const outstandingAssignments = records.reduce(
    (total, course) => total + course.pendingAssignments,
    0
  );
  const availableCertificates = records.reduce((total, course) => total + course.certificates, 0);

  return {
    user,
    records,
    recommendedCourses,
    announcements,
    snapshot: {
      activeCourses,
      averageProgress,
      outstandingAssignments,
      availableCertificates,
    },
  };
}

export async function getAdminElearningRecords() {
  const db = getDb();
  const [activeCourses, activeLearners, instructors, announcements, auditLogs] = await Promise.all([
    db.course.count({ where: { status: ContentStatus.PUBLISHED } }),
    db.enrollment.count({ where: { status: { in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED] } } }),
    db.userRole.count({ where: { role: { slug: "instructor" } } }),
    db.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { course: true },
    }),
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { actor: true },
    }),
  ]);

  return {
    snapshot: {
      activeCourses,
      activeLearners,
      instructors,
      announcements: announcements.length,
    },
    announcements,
    auditLogs,
  };
}

function readLessonBody(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      objective: "",
      keyPoints: [] as string[],
      instructorNote: "",
      practicalTask: "",
    };
  }

  const record = body as Record<string, unknown>;

  return {
    objective: typeof record.objective === "string" ? record.objective : "",
    keyPoints: Array.isArray(record.keyPoints)
      ? record.keyPoints.filter((item): item is string => typeof item === "string")
      : [],
    instructorNote: typeof record.instructorNote === "string" ? record.instructorNote : "",
    practicalTask: typeof record.practicalTask === "string" ? record.practicalTask : "",
  };
}

function lessonTypeLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function getLearnerCourseWorkspace(slug: string) {
  const db = getDb();
  const user = await ensureUserForSession();
  const course = await db.course.findFirst({
    where: {
      slug,
      status: ContentStatus.PUBLISHED,
    },
    include: {
      school: true,
      program: true,
      owner: { include: { profile: true } },
      modules: {
        where: { status: ContentStatus.PUBLISHED },
        include: {
          lessons: {
            where: { status: ContentStatus.PUBLISHED },
            include: {
              resources: true,
              progress: { where: { userId: user.id } },
              assignments: {
                where: { status: "PUBLISHED" },
                include: {
                  submissions: { where: { userId: user.id } },
                },
              },
              quizzes: {
                where: { status: ContentStatus.PUBLISHED },
                include: {
                  questions: { orderBy: { position: "asc" } },
                  attempts: {
                    where: { userId: user.id },
                    orderBy: { submittedAt: "desc" },
                  },
                },
              },
              discussions: {
                include: {
                  author: { include: { profile: true } },
                  replies: true,
                },
                orderBy: { createdAt: "desc" },
                take: 3,
              },
            },
            orderBy: { position: "asc" },
          },
        },
        orderBy: { position: "asc" },
      },
      announcements: {
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { publishedAt: "desc" },
        take: 10,
      },
      enrollments: {
        where: { userId: user.id },
        include: {
          certificates: true,
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  const enrollment = course.enrollments[0] ?? null;

  if (!enrollment) {
    return { user, course, enrollment: null, modules: [] };
  }

  const modules = course.modules.map((module) => {
    const lessons = module.lessons.map((lesson) => {
      const body = readLessonBody(lesson.body);
      const progress = lesson.progress[0];
      const completed = progress?.status === LessonProgressStatus.COMPLETED;
      const assignment = lesson.assignments[0];
      const quiz = lesson.quizzes[0];

      return {
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        type: lessonTypeLabel(lesson.lessonType),
        duration: lesson.durationMinutes ? `${lesson.durationMinutes} min` : "Self-paced",
        completed,
        objective: body.objective,
        keyPoints: body.keyPoints,
        instructorNote: body.instructorNote,
        practicalTask: body.practicalTask,
        resources: lesson.resources.map((resource) => ({
          id: resource.id,
          title: resource.title,
          description: resource.description,
          mimeType: resource.mimeType,
          sizeBytes: resource.sizeBytes,
          isPrivate: resource.isPrivate,
        })),
        assignment: assignment
          ? {
              id: assignment.id,
              title: assignment.title,
              brief: assignment.brief,
              instructions: assignment.instructions,
                dueAt: assignment.dueAt?.toISOString() ?? null,
              maxScore: assignment.maxScore,
              submission: assignment.submissions[0]
                ? {
                    id: assignment.submissions[0].id,
                    status: assignment.submissions[0].status,
                    score: assignment.submissions[0].score,
                    feedback: assignment.submissions[0].feedback,
                    submittedAt: assignment.submissions[0].submittedAt?.toISOString() ?? null,
                  }
                : null,
            }
          : null,
        quiz: quiz
          ? {
              id: quiz.id,
              title: quiz.title,
              summary: quiz.summary,
              instructions: quiz.instructions,
              timeLimitMinutes: quiz.timeLimitMinutes,
              passingScore: quiz.passingScore,
              maxAttempts: quiz.maxAttempts,
              attempts: quiz.attempts.map((attempt) => ({
                id: attempt.id,
                score: attempt.score,
                passed: attempt.passed,
                submittedAt: attempt.submittedAt?.toISOString() ?? null,
              })),
              questions: quiz.questions.map((question) => ({
                id: question.id,
                prompt: question.prompt,
                questionType: question.questionType,
                options: question.options,
                points: question.points,
              })),
            }
          : null,
        discussions: lesson.discussions.map((thread) => ({
          id: thread.id,
          title: thread.title,
          body: thread.body,
          authorName:
            [thread.author.profile?.firstName, thread.author.profile?.lastName].filter(Boolean).join(" ") ||
            thread.author.email,
          replyCount: thread.replies.length,
          createdAt: thread.createdAt.toISOString(),
        })),
      };
    });

    const completedLessons = lessons.filter((lesson) => lesson.completed).length;

    return {
      id: module.id,
      title: module.title,
      summary: module.summary,
      progress: lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 0,
      lessons,
    };
  });

  return {
    user,
    course,
    enrollment,
    modules,
  };
}

export async function getLearnerAssignments() {
  const workspace = await getLearnerWorkspaceRecords();
  const db = getDb();
  const assignments = await db.assignment.findMany({
    where: {
      status: AssignmentStatus.PUBLISHED,
      course: {
        enrollments: {
          some: {
            userId: workspace.user.id,
            status: { not: EnrollmentStatus.CANCELLED },
          },
        },
      },
    },
    include: {
      course: true,
      lesson: true,
      submissions: { where: { userId: workspace.user.id } },
    },
    orderBy: { dueAt: "asc" },
  });

  return assignments;
}

export async function getLearnerQuizzes() {
  const workspace = await getLearnerWorkspaceRecords();
  const db = getDb();
  const quizzes = await db.quiz.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      course: {
        enrollments: {
          some: {
            userId: workspace.user.id,
            status: { not: EnrollmentStatus.CANCELLED },
          },
        },
      },
    },
    include: {
      course: true,
      lesson: true,
      attempts: { where: { userId: workspace.user.id } },
    },
    orderBy: { createdAt: "desc" },
  });

  return quizzes;
}

export async function getLearnerCertificates() {
  const user = await ensureUserForSession();
  const db = getDb();

  return db.certificate.findMany({
    where: {
      userId: user.id,
    },
    include: {
      course: true,
      program: true,
      verification: true,
    },
    orderBy: { issuedAt: "desc" },
  });
}

export async function getLearnerDownloads() {
  const user = await ensureUserForSession();
  const db = getDb();

  return db.lessonResource.findMany({
    where: {
      lesson: {
        module: {
          course: {
            enrollments: {
              some: {
                userId: user.id,
                status: { not: EnrollmentStatus.CANCELLED },
              },
            },
          },
        },
      },
    },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
