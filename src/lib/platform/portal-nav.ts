import type { PlatformRole } from "@/lib/platform/auth";

export type PortalNavItem = {
  href: string;
  label: string;
};

export const learnerNavItems: PortalNavItem[] = [
  { href: "/learn/dashboard", label: "Dashboard" },
  { href: "/learn/program", label: "My Program" },
  { href: "/learn/my-courses", label: "My Courses" },
  { href: "/learn/continue", label: "Continue Learning" },
  { href: "/learn/calendar", label: "Calendar" },
  { href: "/learn/assignments", label: "Assignments" },
  { href: "/learn/quizzes", label: "Quizzes" },
  { href: "/learn/certificates", label: "Certificates" },
  { href: "/learn/downloads", label: "Downloads" },
  { href: "/account/settings", label: "Settings" },
];

export const instructorNavItems: PortalNavItem[] = [
  { href: "/instructor/dashboard", label: "Dashboard" },
  { href: "/instructor/courses", label: "Courses" },
  { href: "/instructor/submissions", label: "Submissions" },
  { href: "/account/settings", label: "Settings" },
];

export const adminNavItems: PortalNavItem[] = [
  { href: "/admin/elearning", label: "Dashboard" },
  { href: "/admin/elearning/courses", label: "Courses" },
  { href: "/admin/elearning/categories", label: "Categories" },
  { href: "/admin/elearning/users", label: "Users" },
  { href: "/admin/elearning/announcements", label: "Announcements" },
  { href: "/admin/elearning/settings", label: "Settings" },
  { href: "/account/settings", label: "Profile" },
];

export function getPortalNavForRole(role: PlatformRole | null | undefined) {
  if (role === "instructor") {
    return instructorNavItems;
  }

  if (role === "registrar_admin" || role === "finance_admin" || role === "super_admin") {
    return adminNavItems;
  }

  return learnerNavItems;
}

export function getPortalHeadingForRole(role: PlatformRole | null | undefined) {
  if (role === "instructor") {
    return {
      heading: "Instructor workspace",
      caption: "Courses, submissions, grading, announcements, and teaching activity.",
      searchHref: "/instructor/courses",
      searchPlaceholder: "Search courses or submissions",
    };
  }

  if (role === "registrar_admin" || role === "finance_admin" || role === "super_admin") {
    return {
      heading: "eLearning administration",
      caption: "Courses, users, announcements, settings, and audit visibility.",
      searchHref: "/admin/elearning/courses",
      searchPlaceholder: "Search courses or users",
    };
  }

  return {
    heading: "Learning dashboard",
    caption: "Courses, lessons, assignments, quizzes, certificates, and support in one classroom.",
    searchHref: "/learn/my-courses",
    searchPlaceholder: "Search courses or lessons",
  };
}
