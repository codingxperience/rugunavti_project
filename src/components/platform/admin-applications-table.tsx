"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/platform/data-table";
import { StatusBadge } from "@/components/platform/status-badge";

type ApplicationRow = {
  reference: string;
  applicant: string;
  program: string;
  intake: string;
  status: string;
};

const data: ApplicationRow[] = [
  {
    reference: "RUG-APP-2026-48211",
    applicant: "Amina N.",
    program: "Diploma in Software Engineering",
    intake: "May 2026",
    status: "In review",
  },
  {
    reference: "RUG-APP-2026-48307",
    applicant: "Brian T.",
    program: "Certificate in Solar PV Installation",
    intake: "June 2026",
    status: "Documents required",
  },
  {
    reference: "RUG-APP-2026-48462",
    applicant: "Catherine M.",
    program: "Diploma in Public Health Practice",
    intake: "September 2026",
    status: "Offered",
  },
];

const columns: ColumnDef<ApplicationRow>[] = [
  { accessorKey: "reference", header: "Reference" },
  { accessorKey: "applicant", header: "Applicant" },
  { accessorKey: "program", header: "Programme" },
  { accessorKey: "intake", header: "Intake" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const tone =
        status === "Offered" ? "success" : status === "Documents required" ? "warning" : "neutral";
      return <StatusBadge value={status} tone={tone} />;
    },
  },
];

export function AdminApplicationsTable() {
  return <DataTable columns={columns} data={data} />;
}
