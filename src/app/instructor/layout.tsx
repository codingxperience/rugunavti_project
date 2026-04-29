import type { ReactNode } from "react";

import { PortalLayout } from "@/components/platform/portal-layout";
import { resolveDisplayName } from "@/lib/platform/display-name";
import { instructorNavItems } from "@/lib/platform/portal-nav";
import { requireRole } from "@/lib/platform/session";
import { ensureUserForSession } from "@/lib/platform/users";

export const dynamic = "force-dynamic";

export default async function InstructorLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["instructor", "super_admin"], "/instructor/dashboard");
  const user = await ensureUserForSession(session);
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
      caption="Assigned courses, grading, publishing, and learner engagement."
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
