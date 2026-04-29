import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(3, "Enter your full name."),
  emailOrPhone: z.string().min(5, "Enter an email address or phone number."),
  category: z.string().min(2, "Choose a support category."),
  message: z.string().min(20, "Provide enough detail for the team to help."),
});

export const applicationFormSchema = z.object({
  fullName: z.string().min(3, "Enter the applicant's full name."),
  email: z.string().email("Enter a valid email address."),
  whatsapp: z.string().min(9, "Enter a valid phone or WhatsApp number."),
  nationality: z.string().min(2, "Select a nationality."),
  preferredLevel: z.string().min(2, "Select an award level."),
  preferredIntake: z.string().min(2, "Select an intake."),
  firstChoice: z.string().min(2, "Select a first programme choice."),
  secondChoice: z.string().optional(),
  studyMode: z.string().min(2, "Select a study mode."),
  goals: z.string().min(20, "Tell admissions a little about your goals."),
  previousSchool: z.string().min(2, "Enter your previous school or institution."),
  highestQualification: z.string().min(2, "Select a qualification."),
  yearCompleted: z.string().regex(/^\d{4}$/, "Enter a valid completion year."),
});

export const verificationSchema = z.object({
  code: z.string().min(6, "Enter a verification code."),
});

export const courseEnrollmentSchema = z.object({
  courseSlug: z.string().min(2, "Choose a valid course."),
  programId: z.string().min(2).optional(),
  courseOfferingId: z.string().min(2).optional(),
});

export const lessonProgressSchema = z.object({
  courseSlug: z.string().min(2, "Choose a valid course."),
  lessonId: z.string().min(2, "Choose a valid lesson."),
  completed: z.boolean().default(true),
});

export const assignmentSubmissionSchema = z
  .object({
    assignmentId: z.string().min(2, "Choose a valid assignment."),
    body: z.string().trim().min(10, "Add submission notes or attach a file.").optional(),
    fileUrl: z.string().url("Attach a valid file URL.").optional(),
  })
  .refine((value) => Boolean(value.body || value.fileUrl), {
    message: "Submit written work or attach a file.",
    path: ["body"],
  });

const quizResponseSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.record(z.string(), z.unknown()),
]);

export const quizAttemptSchema = z.object({
  quizId: z.string().min(2, "Choose a valid quiz."),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(2, "Choose a valid question."),
        response: quizResponseSchema,
      })
    )
    .min(1, "Answer at least one question."),
});

export const discussionThreadSchema = z
  .object({
    courseId: z.string().min(2).optional(),
    lessonId: z.string().min(2).optional(),
    title: z.string().trim().min(3, "Add a short title."),
    body: z.string().trim().min(3, "Add your question or contribution."),
  })
  .refine((value) => Boolean(value.courseId || value.lessonId), {
    message: "Choose a course or lesson for this discussion.",
    path: ["courseId"],
  });

export const discussionReplySchema = z.object({
  threadId: z.string().min(2, "Choose a valid discussion thread."),
  body: z.string().trim().min(3, "Add a reply."),
});

export const supportTicketSchema = z.object({
  category: z.string().min(2, "Choose a support category."),
  subject: z.string().trim().min(3, "Add a support subject."),
  message: z.string().trim().min(10, "Explain what support you need."),
});

export const announcementSchema = z.object({
  title: z.string().trim().min(3, "Add an announcement title."),
  body: z.string().trim().min(10, "Add useful announcement details."),
  scope: z.enum(["PLATFORM", "SCHOOL", "PROGRAM", "COURSE"]).default("COURSE"),
  schoolId: z.string().min(2).optional(),
  programId: z.string().min(2).optional(),
  courseId: z.string().min(2).optional(),
  published: z.boolean().default(true),
});

export const courseUpsertSchema = z.object({
  id: z.string().min(2).optional(),
  programId: z.string().min(2, "Choose a program."),
  schoolId: z.string().min(2, "Choose a school."),
  slug: z.string().trim().min(3, "Add a course slug."),
  title: z.string().trim().min(3, "Add a course title."),
  summary: z.string().trim().min(10, "Add a useful summary."),
  description: z.string().trim().min(20, "Add a course description."),
  deliveryMode: z.enum(["ONLINE", "BLENDED", "PRACTICAL", "DAY", "EVENING", "WEEKEND"]),
  estimatedHours: z.coerce.number().int().min(1).max(500),
  thumbnailUrl: z.string().url().optional(),
  published: z.boolean().default(false),
});

export const moduleUpsertSchema = z.object({
  id: z.string().min(2).optional(),
  courseId: z.string().min(2, "Choose a course."),
  title: z.string().trim().min(3, "Add a module title."),
  summary: z.string().trim().min(10, "Add a module summary."),
  position: z.coerce.number().int().min(1),
  published: z.boolean().default(true),
});

export const lessonUpsertSchema = z.object({
  id: z.string().min(2).optional(),
  moduleId: z.string().min(2, "Choose a module."),
  slug: z.string().trim().min(3, "Add a lesson slug."),
  title: z.string().trim().min(3, "Add a lesson title."),
  summary: z.string().trim().min(10, "Add a lesson summary."),
  body: z.record(z.string(), z.unknown()).default({}),
  lessonType: z.enum([
    "TEXT",
    "VIDEO",
    "RESOURCE",
    "LIVE_SESSION",
    "ASSIGNMENT",
    "QUIZ",
    "PRACTICAL_TASK",
    "BLENDED_GUIDE",
  ]),
  position: z.coerce.number().int().min(1),
  durationMinutes: z.coerce.number().int().min(1).max(600).optional(),
  videoUrl: z.string().url().optional(),
  liveSessionUrl: z.string().url().optional(),
  published: z.boolean().default(true),
});

export const lessonResourceUpsertSchema = z.object({
  id: z.string().min(2).optional(),
  lessonId: z.string().min(2, "Choose a lesson."),
  title: z.string().trim().min(3, "Add a resource title."),
  description: z.string().trim().optional(),
  fileUrl: z.string().trim().min(3, "Attach a valid file URL or storage path."),
  mimeType: z.string().trim().min(3, "Provide the file MIME type."),
  sizeBytes: z.coerce.number().int().min(1),
  isPrivate: z.boolean().default(false),
});

export const assignmentUpsertSchema = z.object({
  id: z.string().min(2).optional(),
  courseId: z.string().min(2, "Choose a course."),
  lessonId: z.string().min(2).optional(),
  title: z.string().trim().min(3, "Add an assignment title."),
  brief: z.string().trim().min(10, "Add a clear assignment brief."),
  instructions: z.string().trim().min(10, "Add submission instructions."),
  dueAt: z.string().datetime().optional(),
  maxScore: z.coerce.number().int().min(1).max(1000),
  allowRetry: z.boolean().default(false),
  acceptedMimeTypes: z.array(z.string().trim().min(3)).default(["application/pdf"]),
  published: z.boolean().default(true),
});

export const quizUpsertSchema = z.object({
  id: z.string().min(2).optional(),
  courseId: z.string().min(2, "Choose a course."),
  lessonId: z.string().min(2).optional(),
  title: z.string().trim().min(3, "Add a quiz title."),
  summary: z.string().trim().min(10, "Add a quiz summary."),
  instructions: z.string().trim().min(10, "Add quiz instructions."),
  timeLimitMinutes: z.coerce.number().int().min(1).max(600).optional(),
  passingScore: z.coerce.number().int().min(0).max(100),
  maxAttempts: z.coerce.number().int().min(1).max(10),
  published: z.boolean().default(true),
  questions: z
    .array(
      z.object({
        id: z.string().min(2).optional(),
        prompt: z.string().trim().min(3, "Add the question prompt."),
        questionType: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_TEXT"]),
        options: z.record(z.string(), z.unknown()).optional(),
        correctAnswer: quizResponseSchema,
        explanation: z.string().trim().optional(),
        points: z.coerce.number().int().min(1).max(100).default(1),
        position: z.coerce.number().int().min(1),
      })
    )
    .default([]),
});

export const gradeSubmissionSchema = z.object({
  submissionId: z.string().min(2, "Choose a submission."),
  score: z.coerce.number().int().min(0),
  feedback: z.string().trim().min(3, "Add feedback for the learner."),
  returned: z.boolean().default(false),
});

export const signedUploadSchema = z.object({
  bucket: z.string().trim().min(2, "Choose a storage bucket."),
  path: z.string().trim().min(3, "Choose a storage path."),
  mimeType: z.string().trim().min(3, "Provide the file MIME type."),
  sizeBytes: z.coerce.number().int().min(1),
});

export const certificateIssueSchema = z.object({
  enrollmentId: z.string().min(2, "Choose a valid enrollment."),
  certificateUrl: z.string().url().optional(),
  expiresAt: z.string().datetime().optional(),
  force: z.boolean().default(false),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ApplicationFormInput = z.infer<typeof applicationFormSchema>;
export type VerificationInput = z.infer<typeof verificationSchema>;
export type CourseEnrollmentInput = z.infer<typeof courseEnrollmentSchema>;
export type LessonProgressInput = z.infer<typeof lessonProgressSchema>;
export type AssignmentSubmissionInput = z.infer<typeof assignmentSubmissionSchema>;
export type QuizAttemptInput = z.infer<typeof quizAttemptSchema>;
export type DiscussionThreadInput = z.infer<typeof discussionThreadSchema>;
export type DiscussionReplyInput = z.infer<typeof discussionReplySchema>;
export type SupportTicketInput = z.infer<typeof supportTicketSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type CourseUpsertInput = z.infer<typeof courseUpsertSchema>;
export type ModuleUpsertInput = z.infer<typeof moduleUpsertSchema>;
export type LessonUpsertInput = z.infer<typeof lessonUpsertSchema>;
export type LessonResourceUpsertInput = z.infer<typeof lessonResourceUpsertSchema>;
export type AssignmentUpsertInput = z.infer<typeof assignmentUpsertSchema>;
export type QuizUpsertInput = z.infer<typeof quizUpsertSchema>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
export type SignedUploadInput = z.infer<typeof signedUploadSchema>;
export type CertificateIssueInput = z.infer<typeof certificateIssueSchema>;
