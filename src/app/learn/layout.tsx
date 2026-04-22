import type { ReactNode } from "react";

import { PortalLayout } from "@/components/platform/portal-layout";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/learn/dashboard", label: "Dashboard" },
  { href: "/learn/my-courses", label: "My Courses" },
  { href: "/learn/continue", label: "Continue Learning" },
  { href: "/learn/calendar", label: "Calendar" },
  { href: "/learn/assignments", label: "Assignments" },
  { href: "/learn/quizzes", label: "Quizzes" },
  { href: "/learn/certificates", label: "Certificates" },
  { href: "/learn/downloads", label: "Downloads" },
  { href: "/learn/help", label: "Help" },
  { href: "/learn/profile", label: "Profile" },
];

export default async function LearnLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["student", "super_admin"], "/learn/dashboard");

  return (
    <PortalLayout
      heading="Learning dashboard"
      caption="Courses, lessons, assignments, quizzes, certificates, and support in one classroom."
      userName={session.name ?? "Student"}
      navItems={navItems}
      searchHref="/learn/my-courses"
      searchPlaceholder="Search courses or lessons"
    >
      {children}
    </PortalLayout>
  );
}
