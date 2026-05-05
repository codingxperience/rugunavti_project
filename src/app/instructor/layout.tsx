import type { ReactNode } from "react";

import { PortalLayout } from "@/components/platform/portal-layout";
import { resolveDisplayName } from "@/lib/platform/display-name";
import { instructorNavItems } from "@/lib/platform/portal-nav";
import { requireRole } from "@/lib/platform/session";
import { getPortalUserForSession } from "@/lib/platform/users";

export const dynamic = "force-dynamic";

export default async function InstructorLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["instructor", "super_admin"], "/instructor/dashboard");
  const user = await getPortalUserForSession(session);
  const userName = resolveDisplayName({
    firstName: user.profile?.firstName,
    lastName: user.profile?.lastName,
    name: session.name,
    email: user.email || session.email,
    fallback: "Instructor",
  });

  return (
    <PortalLayout
      heading="Instructor workspace"
      caption="Courses, grading, publishing, and learner support."
      userName={userName}
      userAvatarUrl={user.profile?.avatarUrl ?? session.avatarUrl}
      navItems={instructorNavItems}
      searchHref="/instructor/courses"
      searchPlaceholder="Search courses or submissions"
    >
      {children}
    </PortalLayout>
  );
}
