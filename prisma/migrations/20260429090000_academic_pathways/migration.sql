-- Academic pathway support for programme plans, shared courses, 7/14-week offerings, and weekly assessment rhythm.
CREATE TYPE "CoursePace" AS ENUM ('SEVEN_WEEK', 'FOURTEEN_WEEK', 'CUSTOM');
CREATE TYPE "CourseRequirement" AS ENUM ('REQUIRED', 'ELECTIVE', 'SUPPORTING');
CREATE TYPE "AssessmentComponentCategory" AS ENUM ('PREPARATION', 'TEACH_ONE_ANOTHER', 'PONDER_PROVE', 'PRACTICAL_FIELDWORK', 'FINAL_CAPSTONE');

ALTER TABLE "Enrollment" ADD COLUMN "programEnrollmentId" TEXT;
ALTER TABLE "Enrollment" ADD COLUMN "courseOfferingId" TEXT;

CREATE TABLE "ProgramEnrollment" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "programId" TEXT NOT NULL,
  "intakeId" TEXT,
  "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
  "currentTerm" INTEGER NOT NULL DEFAULT 1,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expectedCompletionAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProgramEnrollment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProgramCourse" (
  "id" TEXT NOT NULL,
  "programId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "yearNumber" INTEGER NOT NULL DEFAULT 1,
  "termNumber" INTEGER NOT NULL,
  "sequence" INTEGER NOT NULL DEFAULT 1,
  "requirement" "CourseRequirement" NOT NULL DEFAULT 'REQUIRED',
  "creditUnits" INTEGER,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProgramCourse_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseOffering" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "programId" TEXT,
  "intakeId" TEXT,
  "title" TEXT NOT NULL,
  "pace" "CoursePace" NOT NULL DEFAULT 'FOURTEEN_WEEK',
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "enrollmentDeadline" TIMESTAMP(3),
  "capacity" INTEGER,
  "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CourseOffering_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseAssessmentComponent" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "category" "AssessmentComponentCategory" NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "weightPercent" INTEGER NOT NULL,
  "position" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CourseAssessmentComponent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseWeek" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "weekNumber" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "overview" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "preparationQuizTitle" TEXT NOT NULL,
  "preparationMaterials" TEXT NOT NULL,
  "preparationReading" TEXT NOT NULL,
  "teachOneAnotherTask" TEXT NOT NULL,
  "ponderProveTask" TEXT NOT NULL,
  "liveSessionNote" TEXT,
  "dueDateOffsetDays" INTEGER,
  "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CourseWeek_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProgramEnrollment_userId_programId_key" ON "ProgramEnrollment"("userId", "programId");
CREATE INDEX "ProgramEnrollment_programId_status_idx" ON "ProgramEnrollment"("programId", "status");
CREATE INDEX "ProgramEnrollment_userId_status_idx" ON "ProgramEnrollment"("userId", "status");

CREATE UNIQUE INDEX "ProgramCourse_programId_courseId_key" ON "ProgramCourse"("programId", "courseId");
CREATE INDEX "ProgramCourse_programId_yearNumber_termNumber_sequence_idx" ON "ProgramCourse"("programId", "yearNumber", "termNumber", "sequence");
CREATE INDEX "ProgramCourse_courseId_idx" ON "ProgramCourse"("courseId");

CREATE UNIQUE INDEX "CourseOffering_courseId_title_key" ON "CourseOffering"("courseId", "title");
CREATE INDEX "CourseOffering_courseId_status_startDate_idx" ON "CourseOffering"("courseId", "status", "startDate");
CREATE INDEX "CourseOffering_programId_status_idx" ON "CourseOffering"("programId", "status");

CREATE UNIQUE INDEX "CourseAssessmentComponent_courseId_position_key" ON "CourseAssessmentComponent"("courseId", "position");
CREATE INDEX "CourseAssessmentComponent_courseId_category_idx" ON "CourseAssessmentComponent"("courseId", "category");

CREATE UNIQUE INDEX "CourseWeek_courseId_weekNumber_key" ON "CourseWeek"("courseId", "weekNumber");
CREATE INDEX "CourseWeek_courseId_status_idx" ON "CourseWeek"("courseId", "status");

CREATE INDEX "Enrollment_programEnrollmentId_status_idx" ON "Enrollment"("programEnrollmentId", "status");
CREATE INDEX "Enrollment_courseOfferingId_status_idx" ON "Enrollment"("courseOfferingId", "status");

ALTER TABLE "ProgramEnrollment" ADD CONSTRAINT "ProgramEnrollment_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProgramEnrollment" ADD CONSTRAINT "ProgramEnrollment_programId_fkey"
  FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProgramEnrollment" ADD CONSTRAINT "ProgramEnrollment_intakeId_fkey"
  FOREIGN KEY ("intakeId") REFERENCES "Intake"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_programId_fkey"
  FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseOffering" ADD CONSTRAINT "CourseOffering_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourseOffering" ADD CONSTRAINT "CourseOffering_programId_fkey"
  FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseOffering" ADD CONSTRAINT "CourseOffering_intakeId_fkey"
  FOREIGN KEY ("intakeId") REFERENCES "Intake"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CourseAssessmentComponent" ADD CONSTRAINT "CourseAssessmentComponent_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CourseWeek" ADD CONSTRAINT "CourseWeek_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_programEnrollmentId_fkey"
  FOREIGN KEY ("programEnrollmentId") REFERENCES "ProgramEnrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseOfferingId_fkey"
  FOREIGN KEY ("courseOfferingId") REFERENCES "CourseOffering"("id") ON DELETE SET NULL ON UPDATE CASCADE;
