"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/platform/data-table";
import { StatusBadge } from "@/components/platform/status-badge";

type InvoiceRow = {
  invoice: string;
  student: string;
  amount: string;
  dueDate: string;
  status: string;
};

const invoices: InvoiceRow[] = [
  { invoice: "INV-2026-0041", student: "Amina N.", amount: "UGX 1,200,000", dueDate: "15 Apr 2026", status: "Partially paid" },
  { invoice: "INV-2026-0047", student: "Brian T.", amount: "UGX 550,000", dueDate: "12 Apr 2026", status: "Overdue" },
  { invoice: "INV-2026-0052", student: "Catherine M.", amount: "UGX 900,000", dueDate: "30 Apr 2026", status: "Issued" },
];

const columns: ColumnDef<InvoiceRow>[] = [
  { accessorKey: "invoice", header: "Invoice" },
  { accessorKey: "student", header: "Student" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "dueDate", header: "Due date" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const tone =
        status === "Issued" ? "neutral" : status === "Partially paid" ? "warning" : "danger";
      return <StatusBadge value={status} tone={tone} />;
    },
  },
];

export function FinanceInvoicesTable() {
  return <DataTable columns={columns} data={invoices} />;
}
