import type { ReactNode } from "react";

import { PortalLayout } from "@/components/platform/portal-layout";
import { resolveDisplayName } from "@/lib/platform/display-name";
import { adminNavItems } from "@/lib/platform/portal-nav";
import { requireRole } from "@/lib/platform/session";
import { ensureUserForSession } from "@/lib/platform/users";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["registrar_admin", "super_admin"], "/admin/elearning");
  const user = await ensureUserForSession(session);
  const userName = resolveDisplayName({
    firstName: user.profile?.firstName,
    lastName: user.profile?.lastName,
    name: session.name,
    email: user.email || session.email,
    fallback: "Administrator",
  });

  return (
    <PortalLayout
      heading="eLearning administration"
      caption="Courses, categories, users, announcements, settings, and audit visibility."
      userName={userName}
      userAvatarUrl={user.profile?.avatarUrl ?? session.avatarUrl}
      navItems={adminNavItems}
      searchHref="/admin/elearning/courses"
      searchPlaceholder="Search courses or users"
    >
      {children}
    </PortalLayout>
  );
}
