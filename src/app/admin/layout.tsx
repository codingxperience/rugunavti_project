import type { ReactNode } from "react";

import { PortalLayout } from "@/components/platform/portal-layout";
import { requireRole } from "@/lib/platform/session";

const navItems = [
  { href: "/admin/elearning", label: "Dashboard" },
  { href: "/admin/elearning/courses", label: "Courses" },
  { href: "/admin/elearning/categories", label: "Categories" },
  { href: "/admin/elearning/users", label: "Users" },
  { href: "/admin/elearning/announcements", label: "Announcements" },
  { href: "/admin/elearning/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["registrar_admin", "super_admin"], "/admin/elearning");

  return (
    <PortalLayout
      heading="eLearning administration"
      caption="Courses, categories, users, announcements, settings, and audit visibility."
      userName={session.name ?? "Administrator"}
      navItems={navItems}
      searchHref="/admin/elearning/courses"
      searchPlaceholder="Search courses or users"
    >
      {children}
    </PortalLayout>
  );
}
