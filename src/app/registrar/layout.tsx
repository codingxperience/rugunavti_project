import type { ReactNode } from "react";

import { PortalLayout } from "@/components/platform/portal-layout";
import { resolveDisplayName } from "@/lib/platform/display-name";
import { registrarNavItems } from "@/lib/platform/portal-nav";
import { requireRole } from "@/lib/platform/session";
import { getPortalUserForSession } from "@/lib/platform/users";

export const dynamic = "force-dynamic";

export default async function RegistrarLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["registrar_admin", "super_admin"], "/registrar");
  const user = await getPortalUserForSession(session);
  const userName = resolveDisplayName({
    firstName: user.profile?.firstName,
    lastName: user.profile?.lastName,
    name: session.name,
    email: user.email || session.email,
    fallback: "Registrar",
  });

  return (
    <PortalLayout
      heading="Registrar workspace"
      caption="Applications, admissions decisions, learner records, and certificate records."
      userName={userName}
      userAvatarUrl={user.profile?.avatarUrl ?? session.avatarUrl}
      navItems={registrarNavItems}
      searchHref="/registrar/applications"
      searchPlaceholder="Search applicants or references"
    >
      {children}
    </PortalLayout>
  );
}
