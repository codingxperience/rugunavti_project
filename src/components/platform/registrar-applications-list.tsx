import { ApplicationStatus } from "@prisma/client";

import {
  activateProgramEnrollmentAction,
  updateApplicationStatusAction,
} from "@/app/registrar/actions";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import type { AdminApplicationRow } from "@/lib/platform/admissions-records";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Kampala",
  }).format(new Date(value));
}

function normalizeStatus(value: string) {
  return value.toUpperCase().replace(/\s+/g, "_") as ApplicationStatus;
}

function statusTone(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("offered")) return "success";
  if (normalized.includes("rejected") || normalized.includes("withdrawn")) return "danger";
  if (normalized.includes("review") || normalized.includes("document")) return "warning";
  return "neutral";
}

const statuses = [
  ApplicationStatus.SUBMITTED,
  ApplicationStatus.IN_REVIEW,
  ApplicationStatus.DOCUMENTS_REQUIRED,
  ApplicationStatus.OFFERED,
  ApplicationStatus.WAITLISTED,
  ApplicationStatus.REJECTED,
  ApplicationStatus.WITHDRAWN,
];

export function RegistrarApplicationsList({
  applications,
}: {
  applications: AdminApplicationRow[];
}) {
  if (!applications.length) {
    return (
      <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8">
        <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
          No applications yet
        </h2>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          Submitted applications will appear here for admissions review.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((application) => (
        <article
          key={application.id}
          className="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-[0_22px_60px_-52px_rgba(17,17,17,0.45)]"
        >
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {application.reference}
                  </p>
                  <h2 className="font-heading mt-2 text-2xl font-bold text-[var(--color-ink)]">
                    {application.applicant}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {application.email} | {application.phone}
                  </p>
                </div>
                <StatusBadge value={application.status} tone={statusTone(application.status)} />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl bg-[#f6f5ef] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    First choice
                  </p>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">{application.program}</p>
                </div>
                <div className="rounded-2xl bg-[#f6f5ef] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Level
                  </p>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">
                    {application.preferredLevel}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f6f5ef] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Intake
                  </p>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">{application.intake}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-[var(--color-muted)]">
                <p>
                  <span className="font-semibold text-[var(--color-ink)]">Education:</span>{" "}
                  {application.education}
                </p>
                <p>
                  <span className="font-semibold text-[var(--color-ink)]">Next of kin:</span>{" "}
                  {application.nextOfKin}
                </p>
                <p>
                  <span className="font-semibold text-[var(--color-ink)]">Submitted:</span>{" "}
                  {formatDate(application.submittedAt)}
                </p>
                <p>
                  <span className="font-semibold text-[var(--color-ink)]">Documents:</span>{" "}
                  {application.documents.length
                    ? `${application.documents.length} file${application.documents.length === 1 ? "" : "s"}`
                    : "Applicant will provide later"}
                </p>
              </div>

              {application.documents.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {application.documents.slice(0, 3).map((document, index) => (
                    <a
                      key={document.path}
                      href={`/api/admin/applications/documents?applicationId=${application.id}&index=${index}`}
                      className="rounded-full border border-black/8 bg-white px-4 py-2 text-xs font-semibold text-[var(--color-ink)] transition hover:bg-[#f6f5ef]"
                    >
                      {document.originalName}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid gap-3">
              <form action={updateApplicationStatusAction} className="rounded-[24px] border border-black/6 bg-[#fbfbf7] p-4">
                <input type="hidden" name="applicationId" value={application.id} />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Admissions decision
                </p>
                <label className="mt-3 block text-sm font-semibold text-[var(--color-ink)]" htmlFor={`status-${application.id}`}>
                  Application status
                </label>
                <select
                  id={`status-${application.id}`}
                  name="status"
                  defaultValue={normalizeStatus(application.status)}
                  className="mt-2 h-11 w-full rounded-full border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-ink)] outline-none"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <Button type="submit" size="sm" className="mt-4 w-full">
                  Save decision
                </Button>
              </form>

              <form action={activateProgramEnrollmentAction} className="rounded-[24px] border border-black/6 bg-white p-4">
                <input type="hidden" name="applicationId" value={application.id} />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Student record
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  Creates the learner programme record and enrolls the first-term course plan.
                </p>
                <Button type="submit" variant="secondary" size="sm" className="mt-4 w-full">
                  Activate learning plan
                </Button>
              </form>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
