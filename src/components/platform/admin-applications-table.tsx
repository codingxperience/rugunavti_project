"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/platform/data-table";
import { StatusBadge } from "@/components/platform/status-badge";
import type { AdminApplicationRow } from "@/lib/platform/admissions-records";

const columns: ColumnDef<AdminApplicationRow>[] = [
  { accessorKey: "reference", header: "Reference" },
  {
    accessorKey: "applicant",
    header: "Applicant",
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-[var(--color-ink)]">{row.original.applicant}</p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">{row.original.email}</p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">{row.original.phone}</p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          {row.original.gender} | DOB {row.original.dateOfBirth} | Disability: {row.original.disability}
        </p>
      </div>
    ),
  },
  { accessorKey: "program", header: "Programme" },
  { accessorKey: "preferredLevel", header: "Award level" },
  { accessorKey: "intake", header: "Intake" },
  {
    accessorKey: "education",
    header: "Education",
    cell: ({ row }) => (
      <div>
        <p className="text-sm text-[var(--color-ink)]">{row.original.education}</p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Credit transfer: {row.original.creditTransfer}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "nextOfKin",
    header: "Next of kin",
    cell: ({ row }) => (
      <div>
        <p className="text-sm text-[var(--color-ink)]">{row.original.nextOfKin}</p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Source: {row.original.referralSource}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "documents",
    header: "Documents",
    cell: ({ row }) => {
      const documents = row.original.documents;

      if (!documents.length) {
        return <span className="text-sm text-[var(--color-muted)]">No files</span>;
      }

      return (
        <div className="grid gap-1">
          {documents.slice(0, 2).map((document, index) => (
            <a
              key={document.path}
              href={`/api/admin/applications/documents?applicationId=${row.original.id}&index=${index}`}
              className="text-sm font-semibold text-[#0b74aa] hover:underline"
            >
              {document.originalName}
            </a>
          ))}
          {documents.length > 2 ? (
            <span className="text-xs text-[var(--color-muted)]">
              +{documents.length - 2} more file{documents.length - 2 === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const normalized = status.toLowerCase();
      const tone = normalized.includes("accepted") || normalized.includes("offered")
        ? "success"
        : normalized.includes("document") || normalized.includes("review")
          ? "warning"
          : "neutral";
      return <StatusBadge value={status} tone={tone} />;
    },
  },
];

export function AdminApplicationsTable({ data }: { data: AdminApplicationRow[] }) {
  return <DataTable columns={columns} data={data} />;
}
