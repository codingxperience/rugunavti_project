import {
  AssignmentStatus,
  ContentStatus,
  DeliveryMode,
  LessonType,
  PrismaClient,
  ProgramLevel,
  QuizQuestionType,
} from "@prisma/client";

import { demoStudentCourses } from "../src/data/learning";
import { programs } from "../src/data/programs";
import { schools } from "../src/data/schools";

const prisma = new PrismaClient();

const roles = [
  ["applicant", "Applicant with access to application workflows"],
  ["student", "Learner enrolled into one or more courses"],
  ["instructor", "Instructor with access to teaching and grading tools"],
  ["registrar_admin", "Registrar and admissions administrator"],
  ["finance_admin", "Finance administrator"],
  ["super_admin", "Full system administrator"],
] as const;

const levelMap = {
  "Short Course": ProgramLevel.SHORT_COURSE,
  Certificate: ProgramLevel.CERTIFICATE,
  Diploma: ProgramLevel.DIPLOMA,
  "Bachelor's": ProgramLevel.BACHELORS,
} as const;

const deliveryModeMap: Record<string, DeliveryMode> = {
  Online: DeliveryMode.ONLINE,
  Blended: DeliveryMode.BLENDED,
  Practical: DeliveryMode.PRACTICAL,
  Day: DeliveryMode.DAY,
  Evening: DeliveryMode.EVENING,
  Weekend: DeliveryMode.WEEKEND,
};

const lessonTypeMap: Record<string, LessonType> = {
  "Text lesson": LessonType.TEXT,
  "Video lesson": LessonType.VIDEO,
  "Blended lesson": LessonType.BLENDED_GUIDE,
  "Blended instruction": LessonType.BLENDED_GUIDE,
  "Practical task": LessonType.PRACTICAL_TASK,
  "Downloadable resource": LessonType.RESOURCE,
  Quiz: LessonType.QUIZ,
  Assignment: LessonType.ASSIGNMENT,
};

function monthStartDate(month: string) {
  const monthIndex = new Date(`${month} 1, ${new Date().getFullYear()}`).getMonth();
  const year = monthIndex < new Date().getMonth() ? new Date().getFullYear() + 1 : new Date().getFullYear();

  return new Date(Date.UTC(year, monthIndex, 1, 9, 0, 0));
}

async function seedRoles() {
  for (const [slug, description] of roles) {
    await prisma.role.upsert({
      where: { slug },
      update: {
        name: slug.replace(/_/g, " "),
        description,
      },
      create: {
        slug,
        name: slug.replace(/_/g, " "),
        description,
      },
    });
  }
}

async function seedSchools() {
  const schoolIds = new Map<string, string>();

  for (const school of schools) {
    const record = await prisma.school.upsert({
      where: { slug: school.slug },
      update: {
        name: school.name,
        shortName: school.shortName,
        description: school.overview,
        outcomes: school.careerPaths,
        studyModes: school.studyModes.map((mode) => deliveryModeMap[mode]).filter(Boolean),
        heroSummary: school.highlight,
        status: ContentStatus.PUBLISHED,
      },
      create: {
        slug: school.slug,
        name: school.name,
        shortName: school.shortName,
        description: school.overview,
        outcomes: school.careerPaths,
        studyModes: school.studyModes.map((mode) => deliveryModeMap[mode]).filter(Boolean),
        heroSummary: school.highlight,
        status: ContentStatus.PUBLISHED,
      },
    });

    schoolIds.set(school.slug, record.id);
  }

  return schoolIds;
}

async function seedPrograms(schoolIds: Map<string, string>) {
  const programIds = new Map<string, string>();

  for (const program of programs) {
    const schoolId = schoolIds.get(program.schoolSlug);

    if (!schoolId) {
      continue;
    }

    const record = await prisma.program.upsert({
      where: { slug: program.slug },
      update: {
        schoolId,
        title: program.title,
        summary: program.overview,
        overview: program.overview,
        level: levelMap[program.level],
        deliveryMode: deliveryModeMap[program.studyMode],
        durationMonths: program.durationMonths,
        durationLabel: program.durationText,
        skillArea: program.careerOpportunities[0] ?? program.level,
        audience: program.whoItsFor,
        entryRequirements: program.entryRequirements,
        outcomes: program.learningOutcomes,
        assessments: ["Lesson completion", "Assignments", "Practical tasks", "Assessment checks"],
        toolsRequired: ["Phone or laptop", "Internet access for online components", "Notebook"],
        tuitionLabel: program.tuitionText,
        certification: program.certificationOutcome,
        featured: Boolean(program.featured),
        status: ContentStatus.PUBLISHED,
      },
      create: {
        schoolId,
        slug: program.slug,
        title: program.title,
        summary: program.overview,
        overview: program.overview,
        level: levelMap[program.level],
        deliveryMode: deliveryModeMap[program.studyMode],
        durationMonths: program.durationMonths,
        durationLabel: program.durationText,
        skillArea: program.careerOpportunities[0] ?? program.level,
        audience: program.whoItsFor,
        entryRequirements: program.entryRequirements,
        outcomes: program.learningOutcomes,
        assessments: ["Lesson completion", "Assignments", "Practical tasks", "Assessment checks"],
        toolsRequired: ["Phone or laptop", "Internet access for online components", "Notebook"],
        tuitionLabel: program.tuitionText,
        certification: program.certificationOutcome,
        featured: Boolean(program.featured),
        status: ContentStatus.PUBLISHED,
      },
    });

    programIds.set(program.slug, record.id);

    await prisma.intake.deleteMany({ where: { programId: record.id } });
    await prisma.intake.createMany({
      data: program.intakeMonths.map((month) => ({
        programId: record.id,
        title: `${month} intake`,
        startDate: monthStartDate(month),
        applicationDeadline: new Date(monthStartDate(month).getTime() - 1000 * 60 * 60 * 24 * 14),
        status: ContentStatus.PUBLISHED,
      })),
    });
  }

  return programIds;
}

async function seedDemoCourses(programIds: Map<string, string>, schoolIds: Map<string, string>) {
  for (const course of demoStudentCourses) {
    const programId = programIds.get(course.slug);
    const matchingProgram = programs.find((program) => program.slug === course.slug);
    const schoolId = matchingProgram ? schoolIds.get(matchingProgram.schoolSlug) : undefined;

    if (!programId || !schoolId) {
      continue;
    }

    const courseRecord = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {
        programId,
        schoolId,
        title: course.title,
        summary: course.school,
        description: `${course.title} delivered through Ruguna eLearning with structured modules, lessons, assessment checkpoints, and learner progress tracking.`,
        deliveryMode: deliveryModeMap[course.delivery] ?? DeliveryMode.BLENDED,
        estimatedHours: course.modules.reduce((total, module) => total + module.lessons.length * 2, 0),
        status: ContentStatus.PUBLISHED,
      },
      create: {
        programId,
        schoolId,
        slug: course.slug,
        title: course.title,
        summary: course.school,
        description: `${course.title} delivered through Ruguna eLearning with structured modules, lessons, assessment checkpoints, and learner progress tracking.`,
        deliveryMode: deliveryModeMap[course.delivery] ?? DeliveryMode.BLENDED,
        estimatedHours: course.modules.reduce((total, module) => total + module.lessons.length * 2, 0),
        status: ContentStatus.PUBLISHED,
      },
    });

    for (const [moduleIndex, module] of course.modules.entries()) {
      const moduleRecord = await prisma.module.upsert({
        where: {
          courseId_position: {
            courseId: courseRecord.id,
            position: moduleIndex + 1,
          },
        },
        update: {
          title: module.title,
          summary: module.lessons[0]?.summary ?? module.title,
          status: ContentStatus.PUBLISHED,
        },
        create: {
          courseId: courseRecord.id,
          title: module.title,
          summary: module.lessons[0]?.summary ?? module.title,
          position: moduleIndex + 1,
          status: ContentStatus.PUBLISHED,
        },
      });

      for (const [lessonIndex, lesson] of module.lessons.entries()) {
        const lessonRecord = await prisma.lesson.upsert({
          where: {
            moduleId_slug: {
              moduleId: moduleRecord.id,
              slug: lesson.id,
            },
          },
          update: {
            title: lesson.title,
            summary: lesson.summary,
            body: {
              objective: lesson.objective,
              keyPoints: lesson.keyPoints,
              instructorNote: lesson.instructorNote,
              practicalTask: lesson.practicalTask,
            },
            lessonType: lessonTypeMap[lesson.type] ?? LessonType.TEXT,
            position: lessonIndex + 1,
            durationMinutes: Number.parseInt(lesson.duration, 10) || null,
            status: ContentStatus.PUBLISHED,
          },
          create: {
            moduleId: moduleRecord.id,
            slug: lesson.id,
            title: lesson.title,
            summary: lesson.summary,
            body: {
              objective: lesson.objective,
              keyPoints: lesson.keyPoints,
              instructorNote: lesson.instructorNote,
              practicalTask: lesson.practicalTask,
            },
            lessonType: lessonTypeMap[lesson.type] ?? LessonType.TEXT,
            position: lessonIndex + 1,
            durationMinutes: Number.parseInt(lesson.duration, 10) || null,
            status: ContentStatus.PUBLISHED,
          },
        });

        for (const resource of lesson.resources) {
          await prisma.lessonResource.upsert({
            where: {
              id: `${lessonRecord.id}-${resource.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            },
            update: {
              title: resource.label,
              fileUrl: `/seeded-resources/${course.slug}/${lesson.id}/${resource.label}`,
              mimeType: resource.type === "CSV" ? "text/csv" : "application/pdf",
              sizeBytes: 256000,
              isPrivate: true,
            },
            create: {
              id: `${lessonRecord.id}-${resource.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
              lessonId: lessonRecord.id,
              title: resource.label,
              fileUrl: `/seeded-resources/${course.slug}/${lesson.id}/${resource.label}`,
              mimeType: resource.type === "CSV" ? "text/csv" : "application/pdf",
              sizeBytes: 256000,
              isPrivate: true,
            },
          });
        }

        if (lesson.assignment) {
          await prisma.assignment.upsert({
            where: { id: `${lessonRecord.id}-assignment` },
            update: {
              courseId: courseRecord.id,
              lessonId: lessonRecord.id,
              title: lesson.assignment.title,
              brief: lesson.assignment.detail,
              instructions:
                "Submit your work with clear notes. Attach a file link if your evidence is stored in Ruguna Storage or another approved classroom location.",
              dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
              maxScore: 100,
              allowRetry: true,
              acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png", "text/csv"],
              status: AssignmentStatus.PUBLISHED,
            },
            create: {
              id: `${lessonRecord.id}-assignment`,
              courseId: courseRecord.id,
              lessonId: lessonRecord.id,
              title: lesson.assignment.title,
              brief: lesson.assignment.detail,
              instructions:
                "Submit your work with clear notes. Attach a file link if your evidence is stored in Ruguna Storage or another approved classroom location.",
              dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
              maxScore: 100,
              allowRetry: true,
              acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png", "text/csv"],
              status: AssignmentStatus.PUBLISHED,
            },
          });
        }

        if (lesson.quiz) {
          const quizRecord = await prisma.quiz.upsert({
            where: { id: `${lessonRecord.id}-quiz` },
            update: {
              courseId: courseRecord.id,
              lessonId: lessonRecord.id,
              title: lesson.quiz.title,
              summary: lesson.quiz.detail,
              instructions:
                "Answer each question from the lesson material. Your score is recorded immediately after submission.",
              timeLimitMinutes: 20,
              passingScore: 60,
              maxAttempts: 2,
              status: ContentStatus.PUBLISHED,
            },
            create: {
              id: `${lessonRecord.id}-quiz`,
              courseId: courseRecord.id,
              lessonId: lessonRecord.id,
              title: lesson.quiz.title,
              summary: lesson.quiz.detail,
              instructions:
                "Answer each question from the lesson material. Your score is recorded immediately after submission.",
              timeLimitMinutes: 20,
              passingScore: 60,
              maxAttempts: 2,
              status: ContentStatus.PUBLISHED,
            },
          });

          await prisma.quizQuestion.upsert({
            where: {
              quizId_position: {
                quizId: quizRecord.id,
                position: 1,
              },
            },
            update: {
              prompt: `True or false: ${lesson.title} should be completed with clear evidence and documented assumptions.`,
              questionType: QuizQuestionType.TRUE_FALSE,
              options: { true: "True", false: "False" },
              correctAnswer: true,
              explanation:
                "Ruguna assessment expects learners to show practical evidence and explain assumptions clearly.",
              points: 1,
            },
            create: {
              quizId: quizRecord.id,
              prompt: `True or false: ${lesson.title} should be completed with clear evidence and documented assumptions.`,
              questionType: QuizQuestionType.TRUE_FALSE,
              options: { true: "True", false: "False" },
              correctAnswer: true,
              explanation:
                "Ruguna assessment expects learners to show practical evidence and explain assumptions clearly.",
              points: 1,
              position: 1,
            },
          });
        }
      }
    }
  }
}

async function seedSettings() {
  const settings = [
    {
      settingKey: "site.utility_header",
      category: "navigation",
      value: {
        links: [
          { label: "Fees & Funding", href: "/fees-funding" },
          { label: "Campus News", href: "/news-events" },
          { label: "E-Learning", href: "/elearning" },
          { label: "E-Library", href: "/e-library" },
          { label: "Verification", href: "/verification" },
          { label: "Student Portal", href: "/student-portal" },
          { label: "Staff Portal", href: "/staff-portal" },
        ],
      },
    },
    {
      settingKey: "elearning.auth",
      category: "elearning",
      value: {
        loginRoute: "/elearning/login",
        registerRoute: "/elearning/register",
        defaultLearnerRoute: "/learn/dashboard",
      },
    },
    {
      settingKey: "elearning.storage",
      category: "integrations",
      value: {
        publicBucket: process.env.SUPABASE_BUCKET_PUBLIC || "ruguna-public",
        privateBucket: process.env.SUPABASE_BUCKET_PRIVATE || "ruguna-private",
        maxUploadMB: 20,
      },
    },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { settingKey: setting.settingKey },
      update: {
        category: setting.category,
        value: setting.value,
      },
      create: setting,
    });
  }
}

async function main() {
  await seedRoles();
  const schoolIds = await seedSchools();
  const programIds = await seedPrograms(schoolIds);
  await seedDemoCourses(programIds, schoolIds);
  await seedSettings();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
