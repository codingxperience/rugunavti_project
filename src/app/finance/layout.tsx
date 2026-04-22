import type { ReactNode } from "react";

import { PortalLayout } from "@/components/platform/portal-layout";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/finance", label: "Overview" },
];

export default async function FinanceLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["finance_admin", "super_admin"], "/finance");

  return (
    <PortalLayout
      heading="Finance workspace"
      caption="Invoices, payment references, holds, and finance follow-up."
      userName={session.name ?? "Finance administrator"}
      navItems={navItems}
      searchHref="/finance"
      searchPlaceholder="Search invoices or payment refs"
    >
      {children}
    </PortalLayout>
  );
}
