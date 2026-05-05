import type { ReactNode } from "react";

import { PortalLayout } from "@/components/platform/portal-layout";
import { resolveDisplayName } from "@/lib/platform/display-name";
import { financeNavItems } from "@/lib/platform/portal-nav";
import { requireRole } from "@/lib/platform/session";
import { getPortalUserForSession } from "@/lib/platform/users";

export const dynamic = "force-dynamic";

export default async function FinanceLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["finance_admin", "super_admin"], "/finance");
  const user = await getPortalUserForSession(session);
  const userName = resolveDisplayName({
    firstName: user.profile?.firstName,
    lastName: user.profile?.lastName,
    name: session.name,
    email: user.email || session.email,
    fallback: "Finance officer",
  });

  return (
    <PortalLayout
      heading="Finance workspace"
      caption="Invoices, payment references, holds, and finance follow-up."
      userName={userName}
      userAvatarUrl={user.profile?.avatarUrl ?? session.avatarUrl}
      navItems={financeNavItems}
      searchHref="/finance/invoices"
      searchPlaceholder="Search invoices or payment refs"
    >
      {children}
    </PortalLayout>
  );
}
