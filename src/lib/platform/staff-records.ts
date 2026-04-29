import { AssignmentStatus, ContentStatus, EnrollmentStatus, SubmissionStatus } from "@prisma/client";

import { getDb } from "@/lib/db";
import { platformEnv } from "@/lib/platform/env";
import { ensureUserForSession } from "@/lib/platform/users";

function iso(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

function canSeeOwnedOrUnassigned(role: string | null, userId: string) {
  return role === "instructor" ? { OR: [{ ownerId: userId }, { ownerId: null }] } : {};
}

export async function getStaffCourseManagementRecords() {
  const user = await ensureUserForSession();
  const role = user.userRoles[0]?.role.slug ?? null;
  const db = getDb();
  const [schools, programs, courses] = await Promise.all([
    db.school.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    db.program.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { title: "asc" },
      select: { id: true, title: true, schoolId: true, level: true },
    }),
    db.course.findMany({
      where: canSeeOwnedOrUnassigned(role, user.id),
      include: {
        school: true,
        program: true,
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { position: "asc" },
        },
        enrollments: true,
        owner: { include: { profile: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return {
    user,
    schools,
    programs,
    courses: courses.map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      summary: course.summary,
      description: course.description,
      deliveryMode: course.deliveryMode,
      estimatedHours: course.estimatedHours,
      thumbnailUrl: course.thumbnailUrl,
      status: course.status,
      schoolId: course.schoolId,
      schoolName: course.school.name,
      programId: course.programId,
      programTitle: course.program.title,
      programLevel: course.program.level,
      ownerName:
        [course.owner?.profile?.firstName, course.owner?.profile?.lastName].filter(Boolean).join(" ") ||
        course.owner?.email ||
        "Unassigned",
      moduleCount: course.modules.length,
      lessonCount: course.modules.reduce((count, module) => count + module.lessons.length, 0),
      enrollmentCount: course.enrollments.length,
      updatedAt: course.updatedAt.toISOString(),
    })),
  };
}

export async function getStaffCourseBuilderRecord(courseId: string) {
  const user = await ensureUserForSession();
  const role = user.userRoles[0]?.role.slug ?? null;
  const db = getDb();
  const course = await db.course.findFirst({
    where: {
      id: courseId,
      ...canSeeOwnedOrUnassigned(role, user.id),
    },
    include: {
      school: true,
      program: true,
      modules: {
        include: {
          lessons: {
            include: {
              resources: true,
              assignments: true,
              quizzes: { include: { questions: { orderBy: { position: "asc" } } } },
            },
            orderBy: { position: "asc" },
          },
        },
        orderBy: { position: "asc" },
      },
      enrollments: true,
    },
  });

  if (!course) {
    return null;
  }

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    summary: course.summary,
    description: course.description,
    status: course.status,
    deliveryMode: course.deliveryMode,
    estimatedHours: course.estimatedHours,
    schoolName: course.school.name,
    programTitle: course.program.title,
    enrollmentCount: course.enrollments.length,
    modules: course.modules.map((module) => ({
      id: module.id,
      title: module.title,
      summary: module.summary,
      position: module.position,
      status: module.status,
      lessons: module.lessons.map((lesson) => ({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        lessonType: lesson.lessonType,
        position: lesson.position,
        durationMinutes: lesson.durationMinutes,
        status: lesson.status,
        resources: lesson.resources.map((resource) => ({
          id: resource.id,
          title: resource.title,
          mimeType: resource.mimeType,
          sizeBytes: resource.sizeBytes,
          isPrivate: resource.isPrivate,
        })),
        assignments: lesson.assignments.map((assignment) => ({
          id: assignment.id,
          title: assignment.title,
          status: assignment.status,
          dueAt: iso(assignment.dueAt),
          maxScore: assignment.maxScore,
        })),
        quizzes: lesson.quizzes.map((quiz) => ({
          id: quiz.id,
          title: quiz.title,
          status: quiz.status,
          passingScore: quiz.passingScore,
          maxAttempts: quiz.maxAttempts,
          questions: quiz.questions.length,
        })),
      })),
    })),
  };
}

export async function getStaffAnnouncementRecords() {
  const records = await getStaffCourseManagementRecords();
  const db = getDb();
  const announcements = await db.announcement.findMany({
    where:
      records.user.userRoles[0]?.role.slug === "instructor"
        ? {
            OR: [
              { createdById: records.user.id },
              { course: { ownerId: records.user.id } },
              { course: { ownerId: null } },
            ],
          }
        : {},
    include: { course: true, school: true, program: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return {
    courses: records.courses.map((course) => ({ id: course.id, title: course.title })),
    announcements: announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      scope: announcement.scope,
      status: announcement.status,
      courseTitle: announcement.course?.title ?? null,
      publishedAt: iso(announcement.publishedAt),
      createdAt: announcement.createdAt.toISOString(),
    })),
  };
}

export async function getStaffSubmissions() {
  const user = await ensureUserForSession();
  const role = user.userRoles[0]?.role.slug ?? null;
  const db = getDb();
  const submissions = await db.submission.findMany({
    where: {
      assignment: {
        status: AssignmentStatus.PUBLISHED,
        course: canSeeOwnedOrUnassigned(role, user.id),
      },
    },
    include: {
      user: { include: { profile: true } },
      assignment: { include: { course: true } },
    },
    orderBy: { submittedAt: "desc" },
    take: 100,
  });

  return submissions.map((submission) => ({
    id: submission.id,
    learnerName:
      [submission.user.profile?.firstName, submission.user.profile?.lastName].filter(Boolean).join(" ") ||
      submission.user.email,
    learnerEmail: submission.user.email,
    courseTitle: submission.assignment.course.title,
    taskTitle: submission.assignment.title,
    maxScore: submission.assignment.maxScore,
    status: submission.status,
    submittedAt: iso(submission.submittedAt),
    score: submission.score,
    feedback: submission.feedback,
  }));
}

export async function getAdminCategories() {
  const db = getDb();
  const schools = await db.school.findMany({
    where: { status: ContentStatus.PUBLISHED },
    include: {
      courses: { where: { status: ContentStatus.PUBLISHED } },
      programs: { where: { status: ContentStatus.PUBLISHED } },
    },
    orderBy: { name: "asc" },
  });

  return schools.map((school) => ({
    id: school.id,
    slug: school.slug,
    title: school.name,
    description: school.description,
    courseCount: school.courses.length,
    programCount: school.programs.length,
  }));
}

export async function getAdminUsers() {
  const db = getDb();
  const users = await db.user.findMany({
    include: {
      profile: true,
      userRoles: { include: { role: true } },
      enrollments: { where: { status: { in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED] } } },
      submissions: { where: { status: { in: [SubmissionStatus.SUBMITTED, SubmissionStatus.GRADED, SubmissionStatus.RETURNED] } } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return users.map((user) => ({
    id: user.id,
    name: [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(" ") || user.email,
    email: user.email,
    roles: user.userRoles.map((item) => item.role.name),
    roleSlugs: user.userRoles.map((item) => item.role.slug),
    isActive: user.isActive,
    enrollmentCount: user.enrollments.length,
    submissionCount: user.submissions.length,
    createdAt: user.createdAt.toISOString(),
  }));
}

function readSettingValue(
  settings: Array<{ settingKey: string; value: unknown }>,
  key: string
) {
  const value = settings.find((setting) => setting.settingKey === key)?.value;

  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function getAdminElearningSettingsRecords() {
  const db = getDb();
  const settings = await db.siteSetting.findMany({
    where: {
      settingKey: {
        in: ["site.utility_header", "elearning.auth", "elearning.storage"],
      },
    },
    orderBy: { settingKey: "asc" },
  });
  const utilityHeader = readSettingValue(settings, "site.utility_header");
  const auth = readSettingValue(settings, "elearning.auth");
  const storage = readSettingValue(settings, "elearning.storage");
  const utilityLinks = Array.isArray(utilityHeader.links)
    ? utilityHeader.links.filter(
        (item): item is { label?: string; href?: string } =>
          Boolean(item) && typeof item === "object"
      )
    : [];

  return {
    cards: [
      {
        label: "Learner login",
        value: typeof auth.loginRoute === "string" ? auth.loginRoute : "/elearning/login",
        detail: "Shared login entry for students, instructors, and admins.",
      },
      {
        label: "After sign-in routing",
        value:
          typeof auth.defaultLearnerRoute === "string"
            ? auth.defaultLearnerRoute
            : "/learn/dashboard",
        detail: "The app now redirects by role after the session is confirmed.",
      },
      {
        label: "Storage buckets",
        value: `${storage.publicBucket ?? platformEnv.supabasePublicBucket} / ${
          storage.privateBucket ?? platformEnv.supabasePrivateBucket
        }`,
        detail: "Public profile/course media and private learner resources.",
      },
      {
        label: "Session policy",
        value: "Clerk session + Ruguna bridge cookie",
        detail: "The Ruguna cookie expires with the Clerk session; preview fallback is up to 8 hours.",
      },
      {
        label: "Utility eLearning link",
        value: utilityLinks.find((link) => link.label?.toLowerCase().includes("learning"))?.href ?? "/elearning",
        detail: "Public website entry into the eLearning product.",
      },
      {
        label: "Certificate verification",
        value: "/verification",
        detail: "Public verification route for issued completion records.",
      },
    ],
    rawSettings: settings.map((setting) => ({
      key: setting.settingKey,
      category: setting.category,
      updatedAt: setting.updatedAt.toISOString(),
    })),
  };
}
