import type { ReactNode } from "react";

import { PortalLayout } from "@/components/platform/portal-layout";
import { resolveDisplayName } from "@/lib/platform/display-name";
import { learnerNavItems } from "@/lib/platform/portal-nav";
import { requireRole } from "@/lib/platform/session";
import { getPortalUserForSession } from "@/lib/platform/users";

export const dynamic = "force-dynamic";

export default async function LearnLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["student", "super_admin"], "/learn/dashboard");
  const user = await getPortalUserForSession(session);
  const userName = resolveDisplayName({
    firstName: user.profile?.firstName,
    lastName: user.profile?.lastName,
    name: session.name,
    email: user.email || session.email,
    fallback: "Learner",
  });

  return (
    <PortalLayout
      heading="Learning dashboard"
      caption="Courses, lessons, grades, certificates, and support."
      userName={userName}
      userAvatarUrl={user.profile?.avatarUrl ?? session.avatarUrl}
      navItems={learnerNavItems}
      searchHref="/learn/my-courses"
      searchPlaceholder="Search courses or lessons"
    >
      {children}
    </PortalLayout>
  );
}
