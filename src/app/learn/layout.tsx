import type { ReactNode } from "react";

import { PortalLayout } from "@/components/platform/portal-layout";
import { resolveDisplayName } from "@/lib/platform/display-name";
import { requireRole } from "@/lib/platform/session";
import { ensureUserForSession } from "@/lib/platform/users";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/learn/dashboard", label: "Dashboard" },
  { href: "/learn/program", label: "My Program" },
  { href: "/learn/my-courses", label: "My Courses" },
  { href: "/learn/continue", label: "Continue Learning" },
  { href: "/learn/calendar", label: "Calendar" },
  { href: "/learn/assignments", label: "Assignments" },
  { href: "/learn/quizzes", label: "Quizzes" },
  { href: "/learn/certificates", label: "Certificates" },
  { href: "/learn/downloads", label: "Downloads" },
  { href: "/learn/profile", label: "Settings" },
];

export default async function LearnLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["student", "super_admin"], "/learn/dashboard");
  const user = await ensureUserForSession(session);
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
      caption="Courses, lessons, assignments, quizzes, certificates, and support in one classroom."
      userName={userName}
      navItems={navItems}
      searchHref="/learn/my-courses"
      searchPlaceholder="Search courses or lessons"
    >
      {children}
    </PortalLayout>
  );
}
