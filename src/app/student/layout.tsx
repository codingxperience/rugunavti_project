import type { ReactNode } from "react";

import { PortalLayout } from "@/components/platform/portal-layout";
import { requireRole } from "@/lib/platform/session";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/student", label: "Overview" },
  { href: "/student/courses", label: "My Courses" },
  { href: "/student/certificates", label: "Certificates" },
  { href: "/student/support", label: "Support Desk" },
];

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["student", "super_admin"], "/student");

  return (
    <PortalLayout
      heading="Student workspace"
      caption="Enrolled learning, deadlines, certificates, and student support."
      userName={session.name ?? "Student"}
      navItems={navItems}
      searchHref="/student/courses"
      searchPlaceholder="Search courses or lessons"
    >
      {children}
    </PortalLayout>
  );
}
