import { ApplicationStatus, CertificateStatus, EnrollmentStatus } from "@prisma/client";

import { getDb } from "@/lib/db";
import { getAdminApplicationRecords } from "@/lib/platform/admissions-records";

function label(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function iso(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

export async function getRegistrarWorkspaceRecords() {
  const db = getDb();
  const [applications, programEnrollments, certificates] = await Promise.all([
    getAdminApplicationRecords(),
    db.programEnrollment.findMany({
      include: {
        user: { include: { profile: true } },
        program: { include: { school: true } },
        intake: true,
        courseEnrollments: { include: { course: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    }),
    db.certificate.findMany({
      include: {
        user: { include: { profile: true } },
        program: true,
        course: true,
        verification: true,
      },
      orderBy: { issuedAt: "desc" },
      take: 100,
    }),
  ]);

  const pendingApplications = applications.filter((application) =>
    ["SUBMITTED", "IN REVIEW", "DOCUMENTS REQUIRED"].includes(application.status.toUpperCase())
  );
  const learners = programEnrollments.map((enrollment) => {
    const learner =
      [enrollment.user.profile?.firstName, enrollment.user.profile?.lastName]
        .filter(Boolean)
        .join(" ") || enrollment.user.email;

    return {
      id: enrollment.id,
      learner,
      email: enrollment.user.email,
      program: enrollment.program.title,
      school: enrollment.program.school.name,
      intake: enrollment.intake?.title ?? "No intake assigned",
      status: label(enrollment.status),
      currentTerm: enrollment.currentTerm,
      startedAt: enrollment.startedAt.toISOString(),
      expectedCompletionAt: iso(enrollment.expectedCompletionAt),
      courseCount: enrollment.courseEnrollments.length,
      completedCourses: enrollment.courseEnrollments.filter(
        (courseEnrollment) => courseEnrollment.status === EnrollmentStatus.COMPLETED
      ).length,
    };
  });

  return {
    snapshot: {
      applications: applications.length,
      pendingApplications: pendingApplications.length,
      offers: applications.filter((application) => application.status.toUpperCase() === "OFFERED").length,
      activeLearners: programEnrollments.filter(
        (enrollment) => enrollment.status === EnrollmentStatus.ACTIVE
      ).length,
      issuedCertificates: certificates.filter(
        (certificate) => certificate.status === CertificateStatus.ISSUED
      ).length,
    },
    applications,
    pendingApplications,
    learners,
    certificates: certificates.map((certificate) => {
      const learner =
        [certificate.user.profile?.firstName, certificate.user.profile?.lastName]
          .filter(Boolean)
          .join(" ") || certificate.user.email;

      return {
        id: certificate.id,
        learner,
        email: certificate.user.email,
        reference: certificate.reference,
        verificationCode: certificate.verification?.verificationCode ?? "Not created",
        program: certificate.program.title,
        course: certificate.course?.title ?? "Programme completion",
        status: label(certificate.status),
        statusValue: certificate.status,
        issuedAt: certificate.issuedAt.toISOString(),
      };
    }),
  };
}

export { ApplicationStatus };
