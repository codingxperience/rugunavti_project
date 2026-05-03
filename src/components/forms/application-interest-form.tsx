"use client";

import Link from "next/link";
import type {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { dialingCodeOptions, nationalityOptions, ugandaDialCode } from "@/data/country-options";
import {
  type ApplicationDocumentInput,
  type ApplicationFormInput,
  type ApplicationFormRawInput,
  applicationFormSchema,
} from "@/lib/platform/schemas";

type ApplicationInterestFormProps = {
  intakeOptions: string[];
  programOptions: string[];
  defaultProgram?: string;
  defaultLevel?: string;
  defaultStudyMode?: string;
};

const acceptedApplicationFiles = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "text/plain",
  "text/csv",
].join(",");

const maxApplicationFileBytes = 20 * 1024 * 1024;
const applicationDraftKey = "ruguna-application-draft-v2";
const intakeChoices = ["May", "September"];
const referralOptions = [
  "Online Search Engines (Google, Bing, Yahoo, etc.)",
  "Social Media (Facebook, X, Instagram, TikTok)",
  "Referral/Recommendation by a friend",
  "Marketing Flyer / Brochure",
  "Television",
  "Radio",
  "WhatsApp or direct admissions contact",
  "School or employer recommendation",
];

export function ApplicationInterestForm({
  programOptions,
  defaultProgram,
  defaultLevel,
  defaultStudyMode,
}: ApplicationInterestFormProps) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<ApplicationDocumentInput[]>([]);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [documentUploadChoice, setDocumentUploadChoice] = useState<"now" | "later">("later");
  const form = useForm<ApplicationFormRawInput, unknown, ApplicationFormInput>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      gender: "Female",
      dateOfBirthDay: "",
      dateOfBirthMonth: "",
      dateOfBirthYear: "",
      whatsapp: "",
      whatsappCountryCode: ugandaDialCode,
      alternativePhone: "",
      alternativePhoneCountryCode: ugandaDialCode,
      nationality: "Uganda",
      hasDisability: "No",
      nextOfKinName: "",
      nextOfKinEmail: "",
      nextOfKinRelationship: "",
      nextOfKinPhone: "",
      nextOfKinPhoneCountryCode: ugandaDialCode,
      preferredLevel: defaultLevel ?? "Undecided / I need guidance",
      preferredIntake: intakeChoices[0],
      firstChoice: defaultProgram ?? programOptions[0] ?? "",
      secondChoice: programOptions.find((option) => option !== defaultProgram) ?? "",
      studyMode: defaultStudyMode ?? "Blended",
      goals: "",
      previousDegreeProgramme: "",
      classOfDegree: "",
      highestQualification: "UCE",
      creditTransfer: "No",
      referralSource: "",
      confirmationAnswer: "",
      documentUploadChoice: "later",
      uploadedDocuments: [],
    },
  });

  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(applicationDraftKey);

      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as Partial<ApplicationFormRawInput>;

        form.reset({
          ...form.getValues(),
          ...parsed,
          confirmationAnswer: "",
          documentUploadChoice: parsed.documentUploadChoice === "now" ? "later" : "later",
          uploadedDocuments: [],
        });
        setDocumentUploadChoice("later");
        setDraftRestored(true);
      }
    } catch {
      window.localStorage.removeItem(applicationDraftKey);
    } finally {
      setDraftReady(true);
    }
  }, [form]);

  useEffect(() => {
    if (!draftReady || submissionSuccess) {
      return undefined;
    }

    const subscription = form.watch((value) => {
      const draft = {
        ...value,
        confirmationAnswer: "",
        documentUploadChoice: "later",
        uploadedDocuments: [],
      };

      window.localStorage.setItem(applicationDraftKey, JSON.stringify(draft));
    });

    return () => subscription.unsubscribe();
  }, [draftReady, form, submissionSuccess]);

  function chooseDocumentUploadChoice(choice: "now" | "later") {
    setDocumentUploadChoice(choice);
    form.setValue("documentUploadChoice", choice, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (choice === "later") {
      setSelectedFiles([]);
      setUploadMessage(null);
      setFileInputKey((value) => value + 1);
    }
  }

  function onFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const oversized = files.find((file) => file.size > maxApplicationFileBytes);

    setUploadMessage(null);

    if (oversized) {
      setSelectedFiles([]);
      setUploadMessage(`${oversized.name} is larger than 20 MB. Choose a smaller file.`);
      return;
    }

    setSelectedFiles(files);
  }

  async function uploadSelectedDocuments() {
    if (documentUploadChoice !== "now" || selectedFiles.length === 0) {
      return uploadedDocuments;
    }

    setUploadMessage(`Uploading ${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"}...`);

    const uploaded: ApplicationDocumentInput[] = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "application-supporting-document");

      const response = await fetch("/api/applications/uploads", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        success: boolean;
        message?: string;
        document?: ApplicationDocumentInput;
      };

      if (!response.ok || !payload.success || !payload.document) {
        throw new Error(payload.message || `Could not upload ${file.name}.`);
      }

      uploaded.push(payload.document);
    }

    const nextDocuments = [...uploadedDocuments, ...uploaded];
    setUploadedDocuments(nextDocuments);
    setSelectedFiles([]);
    setFileInputKey((value) => value + 1);
    setUploadMessage(`${nextDocuments.length} document${nextDocuments.length === 1 ? "" : "s"} ready for admissions review.`);

    return nextDocuments;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setServerMessage(null);
    setReference(null);
    setSubmissionSuccess(false);

    let documents: ApplicationDocumentInput[];

    try {
      documents = await uploadSelectedDocuments();
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "Document upload failed.");
      return;
    }

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, uploadedDocuments: documents }),
    });
    const payload = (await response.json()) as {
      success: boolean;
      message: string;
      reference?: string;
    };

    setServerMessage(payload.message);
    setReference(payload.reference ?? null);
    setSubmissionSuccess(response.ok && payload.success);

    if (response.ok && payload.success) {
      window.localStorage.removeItem(applicationDraftKey);
      setSelectedFiles([]);
      setUploadedDocuments([]);
      setUploadMessage(null);
      setDocumentUploadChoice("later");
      setFileInputKey((value) => value + 1);
      form.reset({
        ...form.getValues(),
        confirmationAnswer: "",
        uploadedDocuments: [],
        documentUploadChoice: "later",
      });
    }
  });

  function startAnotherApplication() {
    const nextDefaults: ApplicationFormRawInput = {
      fullName: "",
      email: "",
      gender: "Female",
      dateOfBirthDay: "",
      dateOfBirthMonth: "",
      dateOfBirthYear: "",
      whatsapp: "",
      whatsappCountryCode: ugandaDialCode,
      alternativePhone: "",
      alternativePhoneCountryCode: ugandaDialCode,
      nationality: "Uganda",
      hasDisability: "No",
      nextOfKinName: "",
      nextOfKinEmail: "",
      nextOfKinRelationship: "",
      nextOfKinPhone: "",
      nextOfKinPhoneCountryCode: ugandaDialCode,
      preferredLevel: defaultLevel ?? "Undecided / I need guidance",
      preferredIntake: intakeChoices[0],
      firstChoice: defaultProgram ?? programOptions[0] ?? "",
      secondChoice: programOptions.find((option) => option !== defaultProgram) ?? "",
      studyMode: defaultStudyMode ?? "Blended",
      goals: "",
      previousDegreeProgramme: "",
      classOfDegree: "",
      highestQualification: "UCE",
      creditTransfer: "No",
      referralSource: "",
      confirmationAnswer: "",
      documentUploadChoice: "later" as const,
      uploadedDocuments: [],
    };

    window.localStorage.removeItem(applicationDraftKey);
    form.reset(nextDefaults);
    setServerMessage(null);
    setReference(null);
    setSubmissionSuccess(false);
    setDraftRestored(false);
    setSelectedFiles([]);
    setUploadedDocuments([]);
    setUploadMessage(null);
    setDocumentUploadChoice("later");
    setFileInputKey((value) => value + 1);
  }

  if (submissionSuccess) {
    return (
      <section className="rounded-[34px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-[#fff8bf] p-6 shadow-[0_28px_90px_-64px_rgba(17,17,17,0.85)] sm:p-8">
        <div className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-900">
          Submitted
        </div>
        <h2 className="font-heading mt-5 text-3xl font-bold tracking-tight text-[var(--color-ink)]">
          Application received
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-950">
          {serverMessage ?? "Your Ruguna College application has been saved and sent to admissions review."}
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-[24px] border border-emerald-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Reference
            </p>
            <p className="mt-2 font-heading text-xl font-bold text-[var(--color-ink)]">
              {reference}
            </p>
          </div>
          <div className="rounded-[24px] border border-emerald-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Next step
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-ink)]">
              Admissions will review your details and contact you by email, phone, or WhatsApp.
            </p>
          </div>
          <div className="rounded-[24px] border border-emerald-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Keep safe
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-ink)]">
              Save this reference for follow-up and document verification.
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={startAnotherApplication}>
            Submit another application
          </Button>
          <Link
            href="/admissions"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--color-soft-accent)]"
          >
            View admissions guidance
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--color-soft-accent)]"
          >
            Contact admissions
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      {draftRestored ? (
        <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
          We restored your saved application draft on this device. Review the details, re-enter the
          confirmation answer, and submit when ready.
        </div>
      ) : null}

      {serverMessage ? (
        <div
          className={
            submissionSuccess
              ? "rounded-[26px] border border-emerald-200 bg-emerald-50 p-5"
              : "rounded-[26px] border border-amber-200 bg-amber-50 p-5"
          }
        >
          <p className={submissionSuccess ? "font-heading text-2xl font-bold text-emerald-950" : "font-heading text-2xl font-bold text-amber-950"}>
            {submissionSuccess ? "Application submitted" : "Application not submitted"}
          </p>
          <p className={submissionSuccess ? "mt-2 text-sm leading-7 text-emerald-900" : "mt-2 text-sm leading-7 text-amber-900"}>
            {serverMessage}
            {reference ? ` Reference: ${reference}.` : ""}
          </p>
          {submissionSuccess ? (
            <p className="mt-2 text-sm leading-7 text-emerald-900">
              Keep this page open if you want to review what you sent. Ruguna admissions will contact
              you using the phone, WhatsApp, or email details provided.
            </p>
          ) : null}
        </div>
      ) : null}

      <FormSection
        eyebrow="Personal details"
        title="Applicant information"
        description="Enter the details Ruguna admissions will use to identify and contact the applicant."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name" required error={form.formState.errors.fullName?.message}>
            <Input {...form.register("fullName")} placeholder="Full name" />
          </Field>
          <Field label="Email address" required error={form.formState.errors.email?.message}>
            <Input {...form.register("email")} placeholder="name@example.com" type="email" />
          </Field>
          <Field label="Gender" required error={form.formState.errors.gender?.message}>
            <RadioGroup
              options={["Female", "Male"]}
              name="gender"
              register={form.register("gender")}
            />
          </Field>
          <Field label="Date of birth" required error={form.formState.errors.dateOfBirthDay?.message}>
            <div className="grid grid-cols-3 gap-2">
              <Input {...form.register("dateOfBirthDay")} inputMode="numeric" maxLength={2} placeholder="DD" />
              <Input {...form.register("dateOfBirthMonth")} inputMode="numeric" maxLength={2} placeholder="MM" />
              <Input {...form.register("dateOfBirthYear")} inputMode="numeric" maxLength={4} placeholder="YYYY" />
            </div>
          </Field>
          <Field label="Nationality" required error={form.formState.errors.nationality?.message}>
            <Select {...form.register("nationality")} options={nationalityOptions} />
          </Field>
          <Field label="Do you have a disability?" required error={form.formState.errors.hasDisability?.message}>
            <RadioGroup
              options={["Yes", "No"]}
              name="hasDisability"
              register={form.register("hasDisability")}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        eyebrow="Contact details"
        title="Phone and WhatsApp"
        description="Use country codes so local and international applicants can be reached without guessing formats."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="WhatsApp number" required error={form.formState.errors.whatsapp?.message}>
            <PhoneInput
              countryProps={form.register("whatsappCountryCode")}
              numberProps={form.register("whatsapp")}
              placeholder="Your WhatsApp number"
            />
          </Field>
          <Field label="Alternative phone number" error={form.formState.errors.alternativePhone?.message}>
            <PhoneInput
              countryProps={form.register("alternativePhoneCountryCode")}
              numberProps={form.register("alternativePhone")}
              placeholder="Alternative phone number"
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        eyebrow="Next of kin"
        title="Next of kin contact details"
        description="This contact helps admissions and student support reach a trusted person when needed."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Next of kin name" required error={form.formState.errors.nextOfKinName?.message}>
            <Input {...form.register("nextOfKinName")} placeholder="Next of kin name" />
          </Field>
          <Field label="Next of kin email" required error={form.formState.errors.nextOfKinEmail?.message}>
            <Input {...form.register("nextOfKinEmail")} placeholder="nextofkin@example.com" type="email" />
          </Field>
          <Field label="Relationship with next of kin" required error={form.formState.errors.nextOfKinRelationship?.message}>
            <Input {...form.register("nextOfKinRelationship")} placeholder="Parent, guardian, spouse, sibling..." />
          </Field>
          <Field label="Next of kin telephone" required error={form.formState.errors.nextOfKinPhone?.message}>
            <PhoneInput
              countryProps={form.register("nextOfKinPhoneCountryCode")}
              numberProps={form.register("nextOfKinPhone")}
              placeholder="Next of kin telephone"
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        eyebrow="Programme details"
        title="Study choice"
        description="Select the level, intake, study mode, and programme admissions should review."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Preferred award level" required error={form.formState.errors.preferredLevel?.message}>
            <Select
              {...form.register("preferredLevel")}
              options={[
                "Undecided / I need guidance",
                "Short Course",
                "Certificate",
                "Diploma",
                "Bachelor's",
              ]}
            />
          </Field>
          <Field label="Intake" required error={form.formState.errors.preferredIntake?.message}>
            <Select {...form.register("preferredIntake")} options={intakeChoices} />
          </Field>
          <Field label="First programme choice" required error={form.formState.errors.firstChoice?.message} className="md:col-span-2">
            <Select {...form.register("firstChoice")} options={programOptions} />
          </Field>
          <Field label="Second programme choice" error={form.formState.errors.secondChoice?.message} className="md:col-span-2">
            <Select {...form.register("secondChoice")} options={["", ...programOptions]} />
          </Field>
          <Field label="Preferred study mode" required error={form.formState.errors.studyMode?.message}>
            <Select {...form.register("studyMode")} options={["Day", "Evening", "Weekend", "Blended", "Online"]} />
          </Field>
          <Field label="Credit transfer" required error={form.formState.errors.creditTransfer?.message}>
            <RadioGroup
              options={["Yes", "No"]}
              name="creditTransfer"
              register={form.register("creditTransfer")}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        eyebrow="Education background"
        title="Previous studies"
        description="Tell admissions what you studied before and the result/class to review entry readiness."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="State your previous degree/diploma programme"
            required
            error={form.formState.errors.previousDegreeProgramme?.message}
            className="md:col-span-2"
          >
            <Input
              {...form.register("previousDegreeProgramme")}
              placeholder="Previous degree, diploma, certificate, school programme, or relevant qualification"
            />
          </Field>
          <Field label="Class of degree/diploma" required error={form.formState.errors.classOfDegree?.message}>
            <Input {...form.register("classOfDegree")} placeholder="Class, grade, division, CGPA, or result level" />
          </Field>
          <Field label="Highest qualification" required error={form.formState.errors.highestQualification?.message}>
            <Select
              {...form.register("highestQualification")}
              options={[
                "Not sure / to be reviewed",
                "UCE",
                "UACE",
                "Certificate",
                "Diploma",
                "Bachelor's",
                "International qualification",
                "Work experience / CV",
              ]}
            />
          </Field>
          <Field label="Goals and study context (optional)" error={form.formState.errors.goals?.message} className="md:col-span-2">
            <Textarea
              {...form.register("goals")}
              className="min-h-28"
              placeholder="Optional: write two or three lines about your interest, current situation, or what admissions should review."
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        eyebrow="Referral"
        title="How did you get to know Ruguna?"
        description="This helps admissions understand which outreach channels are working."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="How did you get to know Ruguna?" required error={form.formState.errors.referralSource?.message} className="md:col-span-2">
            <Select {...form.register("referralSource")} options={["", ...referralOptions]} />
          </Field>
        </div>
      </FormSection>

      <section className="rounded-[28px] border border-black/8 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              Supporting documents
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Upload results slips, certificates, ID/passport photos, CVs, resumes, or other files
              if they are ready. You can still submit without documents.
            </p>
          </div>
          <span className="rounded-full bg-[#fff5ad] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-ink)]">
            Optional
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <RadioCard
            label="Upload now"
            detail="Attach PDF, picture, Word, Excel, PowerPoint, text, or CV files."
            name="documentUploadChoice"
            value="now"
            checked={documentUploadChoice === "now"}
            onChange={() => chooseDocumentUploadChoice("now")}
          />
          <RadioCard
            label="Submit without files"
            detail="Admissions can follow up later if documents are still being prepared."
            name="documentUploadChoice"
            value="later"
            checked={documentUploadChoice === "later"}
            onChange={() => chooseDocumentUploadChoice("later")}
          />
        </div>

        {documentUploadChoice === "now" ? (
          <div className="mt-5 rounded-[22px] border border-dashed border-black/16 bg-[var(--color-surface-alt)] p-5">
            <input
              key={fileInputKey}
              type="file"
              multiple
              accept={acceptedApplicationFiles}
              onChange={onFilesSelected}
              className="block w-full text-sm text-[var(--color-muted)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--color-ink)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-black"
            />
            <p className="mt-3 text-xs leading-6 text-[var(--color-muted)]">
              Maximum file size: 20 MB each. Accepted: PDF, images, Word, Excel, PowerPoint,
              text, and CSV.
            </p>
            {selectedFiles.length ? (
              <div className="mt-4 grid gap-2">
                {selectedFiles.map((file) => (
                  <p key={`${file.name}-${file.size}`} className="rounded-2xl bg-white px-4 py-2 text-sm text-[var(--color-ink)]">
                    {file.name} - {Math.max(Math.round(file.size / 1024), 1)} KB
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {uploadedDocuments.length ? (
          <div className="mt-4 grid gap-2">
            {uploadedDocuments.map((document) => (
              <p key={document.path} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
                Uploaded: {document.originalName}
              </p>
            ))}
          </div>
        ) : null}
        {uploadMessage ? <p className="mt-3 text-sm text-[var(--color-muted)]">{uploadMessage}</p> : null}
      </section>

      <FormSection
        eyebrow="Confirmation"
        title="Please confirm"
        description="This simple check helps protect the form from automated spam."
      >
        <Field label="9 + 15 =" required error={form.formState.errors.confirmationAnswer?.message}>
          <Input {...form.register("confirmationAnswer")} inputMode="numeric" placeholder="Enter answer" />
        </Field>
      </FormSection>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit application"}
        </Button>
        {reference ? (
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            Reference: {reference}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function RadioCard({
  label,
  detail,
  ...props
}: {
  label: string;
  detail: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-sm transition hover:bg-white">
      <input type="radio" className="mt-1 h-4 w-4 accent-[var(--color-ink)]" {...props} />
      <span>
        <span className="block font-semibold text-[var(--color-ink)]">{label}</span>
        <span className="mt-1 block leading-6 text-[var(--color-muted)]">{detail}</span>
      </span>
    </label>
  );
}

function FormSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-black/8 bg-white p-5 shadow-[0_22px_70px_-62px_rgba(17,17,17,0.55)] sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {eyebrow}
        </p>
        <h2 className="font-heading mt-2 text-2xl font-bold tracking-tight text-[var(--color-ink)]">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function RadioGroup({
  options,
  name,
  register,
}: {
  options: string[];
  name: string;
  register: UseFormRegisterReturn;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <label
          key={`${name}-${option}`}
          className="inline-flex min-h-12 flex-1 cursor-pointer items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:border-black/20 hover:bg-[var(--color-soft-accent)]"
        >
          <input
            {...register}
            type="radio"
            value={option}
            className="h-4 w-4 accent-[var(--color-ink)]"
          />
          {option}
        </label>
      ))}
    </div>
  );
}

function PhoneInput({
  countryProps,
  numberProps,
  placeholder,
}: {
  countryProps: UseFormRegisterReturn;
  numberProps: UseFormRegisterReturn;
  placeholder: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(118px,0.38fr)_minmax(0,1fr)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white focus-within:border-[var(--color-ink)]/25 focus-within:ring-4 focus-within:ring-[var(--color-soft-accent)]">
      <select
        {...countryProps}
        className="h-12 min-w-0 border-0 border-r border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 text-sm font-semibold text-[var(--color-ink)] outline-none"
      >
        {dialingCodeOptions.map((country) => (
          <option
            key={`${country.iso2}-${country.dialCode}`}
            value={country.dialCode}
          >
            {country.name} {country.dialCode}
          </option>
        ))}
      </select>
      <input
        {...numberProps}
        className="h-12 min-w-0 border-0 bg-white px-4 text-sm text-[var(--color-ink)] outline-none"
        inputMode="tel"
        placeholder={placeholder}
      />
    </div>
  );
}

function Field({
  label,
  children,
  error,
  className,
  required = false,
}: {
  label: string;
  children: ReactNode;
  error?: string;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={`grid gap-2 text-sm font-medium text-[var(--color-ink)] ${className ?? ""}`}>
      <span>
        {label}
        {required ? <span className="ml-1 text-rose-600">*</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

function Select(
  props: SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }
) {
  const { options, ...rest } = props;

  return (
    <select
      {...rest}
      className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-ink)]/25 focus:ring-4 focus:ring-[var(--color-soft-accent)]"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
