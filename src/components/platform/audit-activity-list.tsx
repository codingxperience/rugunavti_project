import {
  BookOpenText,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  GraduationCap,
  Megaphone,
  Sparkles,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ActivityActor = {
  email: string;
  profile?: {
    firstName: string;
    lastName: string;
  } | null;
} | null;

export type AuditActivityRecord = {
  id: string;
  summary: string;
  action: string;
  entityType: string;
  payload: unknown;
  createdAt: Date | string;
  actor: ActivityActor;
};

function readRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function activityLabel(summary: string) {
  return summary
    .replace(/^Clerk\s+/i, "Clerk ")
    .replace(/\.$/, "")
    .replace(/Learner updated profile and learning preferences/i, "Learner profile updated")
    .replace(/student@ruguna\.local/i, "Learner")
    .replace(/write2fredokorio@gmail\.com/i, "Fred Okorio")
    .replace(/([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})/gi, "$1");
}

function actorLabel(actor: ActivityActor) {
  if (!actor) {
    return "System";
  }

  const name = [actor.profile?.firstName, actor.profile?.lastName]
    .filter(Boolean)
    .join(" ");

  return name || actor.email;
}

function entityLabel(value: string) {
  const labels: Record<string, string> = {
    Application: "Application",
    Assignment: "Assignment",
    Certificate: "Certificate",
    CertificateVerification: "Certificate check",
    Course: "Course",
    CourseWeek: "Week plan",
    DiscussionReply: "Reply",
    DiscussionThread: "Discussion",
    Enrollment: "Enrollment",
    Lesson: "Lesson",
    LessonProgress: "Progress",
    LessonResource: "Resource",
    Module: "Module",
    Quiz: "Quiz",
    QuizAttempt: "Quiz attempt",
    StorageUploadUrl: "Upload",
    Submission: "Submission",
    SupportTicket: "Support",
    User: "User",
  };

  return labels[value] ?? titleCase(value);
}

function actionLabel(value: string) {
  const labels: Record<string, string> = {
    CREATE: "Created",
    UPDATE: "Updated",
    DELETE: "Deleted",
    PUBLISH: "Published",
    ISSUE: "Issued",
    VERIFY: "Verified",
  };

  return labels[value] ?? titleCase(value);
}

function formatActivityDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-UG", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Kampala",
  }).format(new Date(value));
}

function activityIcon(entityType: string) {
  switch (entityType) {
    case "Application":
      return FileText;
    case "Enrollment":
      return GraduationCap;
    case "Announcement":
      return Megaphone;
    case "User":
      return UserRound;
    case "LessonProgress":
      return CheckCircle2;
    case "Submission":
    case "Assignment":
    case "QuizAttempt":
    case "Quiz":
      return ClipboardList;
    case "Course":
    case "Module":
    case "Lesson":
    case "CourseWeek":
      return BookOpenText;
    default:
      return Sparkles;
  }
}

function payloadDetails(payload: unknown) {
  const record = readRecord(payload);
  const details: string[] = [];

  const reference = readText(record.reference);
  const ticketNumber = readText(record.ticketNumber);
  const firstChoice = readText(record.firstChoice);
  const preferredLevel = readText(record.preferredLevel);
  const preferredIntake = readText(record.preferredIntake);
  const courseSlug = readText(record.courseSlug);
  const status = readText(record.status);
  const documentCount = readNumber(record.documentCount);
  const progressPercent = readNumber(record.progressPercent);
  const score = readNumber(record.score);
  const weekNumber = readNumber(record.weekNumber);

  if (reference) details.push(`Ref: ${reference}`);
  if (ticketNumber) details.push(`Ticket: ${ticketNumber}`);
  if (firstChoice) details.push(firstChoice);
  if (preferredLevel) details.push(`Level: ${preferredLevel}`);
  if (preferredIntake) details.push(`Intake: ${preferredIntake}`);
  if (courseSlug) details.push(`Course: ${courseSlug}`);
  if (weekNumber) details.push(`Week ${weekNumber}`);
  if (status) details.push(`Status: ${titleCase(status)}`);
  if (documentCount !== null) details.push(`${documentCount} document${documentCount === 1 ? "" : "s"}`);
  if (progressPercent !== null) details.push(`${progressPercent}% progress`);
  if (score !== null) details.push(`Score: ${score}`);

  return details.slice(0, 5);
}

export function AuditActivityList({
  records,
  compact = false,
  showAuditId = false,
}: {
  records: AuditActivityRecord[];
  compact?: boolean;
  showAuditId?: boolean;
}) {
  if (!records.length) {
    return (
      <div className="p-6">
        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
            <Clock3 className="h-5 w-5 text-[var(--color-ink)]" />
          </div>
          <p className="mt-4 font-heading text-xl font-bold text-[var(--color-ink)]">
            No activity yet
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            Activity will appear here as staff and learners use the platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      {records.map((item) => {
        const Icon = activityIcon(item.entityType);
        const details = payloadDetails(item.payload);

        return (
          <article
            key={item.id}
            className={cn(
              "grid gap-4 border-b border-[var(--color-border)] last:border-b-0",
              compact
                ? "px-5 py-4 sm:grid-cols-[36px_minmax(0,1fr)]"
                : "px-6 py-5 sm:grid-cols-[42px_minmax(0,1fr)]"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-2xl bg-[var(--color-soft-accent)]",
                compact ? "h-9 w-9" : "h-10 w-10"
              )}
            >
              <Icon className="h-4 w-4 text-[var(--color-ink)]" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-6 text-[var(--color-ink)]">
                    {activityLabel(item.summary)}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
                    <span>{actorLabel(item.actor)}</span>
                    <span className="h-1 w-1 rounded-full bg-black/20" />
                    <span>{formatActivityDate(item.createdAt)}</span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <span className="rounded-full bg-[var(--color-ink)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    {actionLabel(item.action)}
                  </span>
                  {!compact ? (
                    <span className="rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                      {entityLabel(item.entityType)}
                    </span>
                  ) : null}
                </div>
              </div>

              {details.length ? (
                compact ? (
                  <p className="mt-2 truncate text-xs text-[var(--color-muted)]">
                    {details.slice(0, 2).join(" · ")}
                  </p>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {details.map((detail) => (
                      <span
                        key={`${item.id}-${detail}`}
                        className="rounded-full bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--color-muted)]"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                )
              ) : null}

              {showAuditId ? (
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  Audit ID {item.id.slice(0, 8)}
                </p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
