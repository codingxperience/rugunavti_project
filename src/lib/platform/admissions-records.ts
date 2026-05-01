import { hasDatabase } from "@/lib/platform/env";
import { getDb } from "@/lib/db";

export type AdminApplicationDocument = {
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  bucket: string;
  path: string;
  category: string;
};

export type AdminApplicationRow = {
  id: string;
  reference: string;
  applicant: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  disability: string;
  nextOfKin: string;
  education: string;
  creditTransfer: string;
  referralSource: string;
  program: string;
  intake: string;
  preferredLevel: string;
  status: string;
  submittedAt: string;
  documents: AdminApplicationDocument[];
};

function readString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readDocuments(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      preferredLevel: "Not specified",
      gender: "Not provided",
      dateOfBirth: "Not provided",
      disability: "Not provided",
      nextOfKin: "Not provided",
      education: "Not provided",
      creditTransfer: "Not provided",
      referralSource: "Not provided",
      documents: [] as AdminApplicationDocument[],
    };
  }

  const record = value as Record<string, unknown>;
  const applicant = typeof record.applicant === "object" && record.applicant ? record.applicant as Record<string, unknown> : {};
  const nextOfKin = typeof record.nextOfKin === "object" && record.nextOfKin ? record.nextOfKin as Record<string, unknown> : {};
  const education = typeof record.education === "object" && record.education ? record.education as Record<string, unknown> : {};
  const uploaded = Array.isArray(record.uploadedDocuments) ? record.uploadedDocuments : [];
  const nextOfKinLabel = [
    readString(nextOfKin.name),
    readString(nextOfKin.relationship),
    readString(nextOfKin.phoneFormatted),
  ].filter(Boolean).join(" - ");
  const educationLabel = [
    readString(education.previousDegreeProgramme),
    readString(education.classOfDegree),
  ].filter(Boolean).join(" - ");

  return {
    preferredLevel: readString(record.preferredLevel, "Not specified"),
    gender: readString(applicant.gender, "Not provided"),
    dateOfBirth: readString(applicant.dateOfBirth, "Not provided"),
    disability: readString(applicant.hasDisability, "Not provided"),
    nextOfKin: nextOfKinLabel || "Not provided",
    education: educationLabel || readString(record.highestQualification, "Not provided"),
    creditTransfer: readString(record.creditTransfer, "Not provided"),
    referralSource: readString(record.referralSource, "Not provided"),
    documents: uploaded
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item))
      .map((item) => ({
        originalName: readString(item.originalName, "supporting-document"),
        mimeType: readString(item.mimeType, "application/octet-stream"),
        sizeBytes: typeof item.sizeBytes === "number" ? item.sizeBytes : 0,
        bucket: readString(item.bucket),
        path: readString(item.path),
        category: readString(item.category, "supporting-document"),
      }))
      .filter((item) => item.bucket && item.path),
  };
}

export async function getAdminApplicationRecords(): Promise<AdminApplicationRow[]> {
  if (!hasDatabase) {
    return [];
  }

  const applications = await getDb().application.findMany({
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      program: true,
      intake: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return applications.map((application) => {
    const documentDetails = readDocuments(application.documents);
    const profile = application.user.profile;
    const applicant =
      [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || application.user.email;

    return {
      id: application.id,
      reference: application.reference,
      applicant,
      email: application.user.email,
      phone: profile?.whatsapp || profile?.phone || "Not provided",
      gender: documentDetails.gender,
      dateOfBirth: documentDetails.dateOfBirth,
      disability: documentDetails.disability,
      nextOfKin: documentDetails.nextOfKin,
      education: documentDetails.education,
      creditTransfer: documentDetails.creditTransfer,
      referralSource: documentDetails.referralSource,
      program: application.firstChoice || application.program.title,
      intake: application.intake?.title ?? "Admissions to advise",
      preferredLevel: documentDetails.preferredLevel,
      status: application.status.replace(/_/g, " "),
      submittedAt: (application.submittedAt ?? application.createdAt).toISOString(),
      documents: documentDetails.documents,
    };
  });
}
