import type { ReactNode } from "react";

import { PortalLayout } from "@/components/platform/portal-layout";
import { requireRole } from "@/lib/platform/session";

const navItems = [
  { href: "/instructor/dashboard", label: "Dashboard" },
  { href: "/instructor/courses", label: "Courses" },
  { href: "/instructor/submissions", label: "Submissions" },
];

export default async function InstructorLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["instructor", "super_admin"], "/instructor/dashboard");

  return (
    <PortalLayout
      heading="Instructor workspace"
      caption="Assigned courses, grading, publishing, and learner engagement."
      userName={session.name ?? "Instructor"}
      navItems={navItems}
      searchHref="/instructor/courses"
      searchPlaceholder="Search courses or submissions"
    >
      {children}
    </PortalLayout>
  );
}
