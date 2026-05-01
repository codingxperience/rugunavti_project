import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(3, "Enter your full name."),
  emailOrPhone: z.string().min(5, "Enter an email address or phone number."),
  category: z.string().min(2, "Choose a support category."),
  message: z.string().min(20, "Provide enough detail for the team to help."),
});

const optionalTrimmedText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

const requiredPhoneInput = z
  .string()
  .trim()
  .min(4, "Enter a reachable phone number.")
  .max(40, "Phone number is too long.")
  .regex(/^[+\d\s().-]+$/, "Use digits, +, spaces, brackets, dots, or hyphens only.");

const optionalPhoneInput = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  requiredPhoneInput.optional()
);

const requiredDialCode = z.string().trim().min(1, "Select a country code.");
const yesNoSchema = z.enum(["Yes", "No"], { message: "Choose Yes or No." });

function validDateParts(day: string, month: string, year: string) {
  const parsedDay = Number(day);
  const parsedMonth = Number(month);
  const parsedYear = Number(year);
  const date = new Date(Date.UTC(parsedYear, parsedMonth - 1, parsedDay));
  const currentYear = new Date().getFullYear();

  return (
    Number.isInteger(parsedDay) &&
    Number.isInteger(parsedMonth) &&
    Number.isInteger(parsedYear) &&
    parsedYear >= 1900 &&
    parsedYear <= currentYear &&
    date.getUTCFullYear() === parsedYear &&
    date.getUTCMonth() === parsedMonth - 1 &&
    date.getUTCDate() === parsedDay
  );
}

export const applicationDocumentSchema = z.object({
  originalName: z.string().trim().min(1),
  mimeType: z.string().trim().min(3),
  sizeBytes: z.coerce.number().int().positive(),
  bucket: z.string().trim().min(2),
  path: z.string().trim().min(3),
  category: z.string().trim().min(2),
});

export const applicationFormSchema = z
  .object({
    fullName: z.string().trim().min(3, "Enter the applicant's full name."),
    email: z.string().trim().email("Enter a valid email address."),
    gender: z.enum(["Female", "Male"], { message: "Select a gender." }),
    dateOfBirthDay: z.string().trim().regex(/^\d{1,2}$/, "Enter day as DD."),
    dateOfBirthMonth: z.string().trim().regex(/^\d{1,2}$/, "Enter month as MM."),
    dateOfBirthYear: z.string().trim().regex(/^\d{4}$/, "Enter year as YYYY."),
    nationality: z.string().trim().min(2, "Select a nationality."),
    hasDisability: yesNoSchema,
    whatsappCountryCode: requiredDialCode,
    whatsapp: requiredPhoneInput,
    alternativePhoneCountryCode: requiredDialCode,
    alternativePhone: optionalPhoneInput,
    nextOfKinName: z.string().trim().min(3, "Enter next of kin name."),
    nextOfKinEmail: z.string().trim().email("Enter next of kin email."),
    nextOfKinRelationship: z.string().trim().min(2, "Enter the relationship."),
    nextOfKinPhoneCountryCode: requiredDialCode,
    nextOfKinPhone: requiredPhoneInput,
    preferredLevel: z.string().trim().min(2, "Select an award level."),
    preferredIntake: z.string().trim().min(2, "Select an intake."),
    firstChoice: z.string().trim().min(2, "Select a first programme choice."),
    secondChoice: optionalTrimmedText,
    studyMode: z.string().trim().min(2, "Select a study mode."),
    goals: z.preprocess(
      (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
      z.string().trim().min(10, "Use at least a short two-line explanation.").max(1200).optional()
    ),
    previousDegreeProgramme: z
      .string()
      .trim()
      .min(2, "Enter the previous degree, diploma, certificate, or school programme."),
    classOfDegree: z.string().trim().min(2, "Enter the class or result level."),
    highestQualification: z.string().trim().min(2, "Select a qualification."),
    creditTransfer: yesNoSchema,
    referralSource: z.string().trim().min(2, "Select how you heard about Ruguna."),
    confirmationAnswer: z
      .string()
      .trim()
      .refine((value) => value === "24", "Enter the correct answer to continue."),
    documentUploadChoice: z.enum(["now", "later"]).default("later"),
    uploadedDocuments: z.array(applicationDocumentSchema).max(10).default([]),
  })
  .refine(
    (values) =>
      validDateParts(
        values.dateOfBirthDay,
        values.dateOfBirthMonth,
        values.dateOfBirthYear
      ),
    {
      message: "Enter a valid date of birth.",
      path: ["dateOfBirthDay"],
    }
  );

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

const optionalIdSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().min(2).optional()
);

const optionalUrlSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().url().optional()
);

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
  schoolId: optionalIdSchema,
  programId: optionalIdSchema,
  courseId: optionalIdSchema,
  published: z.boolean().default(true),
}).superRefine((value, context) => {
  if (value.scope === "COURSE" && !value.courseId) {
    context.addIssue({
      code: "custom",
      message: "Choose a course for a course announcement.",
      path: ["courseId"],
    });
  }
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
  thumbnailUrl: optionalUrlSchema,
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

export const courseWeekUpsertSchema = z.object({
  id: z.string().min(2).optional(),
  courseId: z.string().min(2, "Choose a course."),
  weekNumber: z.coerce.number().int().min(1).max(52),
  title: z.string().trim().min(3, "Add a week title."),
  overview: z.string().trim().min(10, "Add a week overview."),
  topic: z.string().trim().min(3, "Add the weekly topic."),
  preparationQuizTitle: z.string().trim().min(3, "Add the preparation quiz title."),
  preparationMaterials: z.string().trim().min(10, "Add preparation materials."),
  preparationReading: z.string().trim().min(10, "Add preparation reading."),
  teachOneAnotherTask: z.string().trim().min(10, "Add the peer teaching task."),
  ponderProveTask: z.string().trim().min(10, "Add the proof-of-learning task."),
  liveSessionNote: z.string().trim().optional(),
  dueDateOffsetDays: z.coerce.number().int().min(0).max(400).optional(),
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
  videoUrl: optionalUrlSchema,
  liveSessionUrl: optionalUrlSchema,
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
  lessonId: optionalIdSchema,
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
  lessonId: optionalIdSchema,
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
export type ApplicationDocumentInput = z.infer<typeof applicationDocumentSchema>;
export type ApplicationFormRawInput = z.input<typeof applicationFormSchema>;
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
export type CourseWeekUpsertInput = z.infer<typeof courseWeekUpsertSchema>;
export type LessonUpsertInput = z.infer<typeof lessonUpsertSchema>;
export type LessonResourceUpsertInput = z.infer<typeof lessonResourceUpsertSchema>;
export type AssignmentUpsertInput = z.infer<typeof assignmentUpsertSchema>;
export type QuizUpsertInput = z.infer<typeof quizUpsertSchema>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
export type SignedUploadInput = z.infer<typeof signedUploadSchema>;
export type CertificateIssueInput = z.infer<typeof certificateIssueSchema>;
