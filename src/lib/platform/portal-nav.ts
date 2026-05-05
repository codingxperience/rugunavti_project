import type { PlatformRole } from "@/lib/platform/auth";

export type PortalNavItem = {
  href: string;
  label: string;
};

export const learnerNavItems: PortalNavItem[] = [
  { href: "/learn/dashboard", label: "Dashboard" },
  { href: "/learn/program", label: "Program" },
  { href: "/learn/my-courses", label: "Courses" },
  { href: "/learn/calendar", label: "Calendar" },
  { href: "/learn/assignments", label: "Assignments" },
  { href: "/learn/quizzes", label: "Quizzes" },
  { href: "/learn/payments", label: "Payments" },
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

export const registrarNavItems: PortalNavItem[] = [
  { href: "/registrar", label: "Dashboard" },
  { href: "/registrar/applications", label: "Applications" },
  { href: "/registrar/learners", label: "Learners" },
  { href: "/registrar/records", label: "Records" },
  { href: "/account/settings", label: "Settings" },
];

export const financeNavItems: PortalNavItem[] = [
  { href: "/finance", label: "Dashboard" },
  { href: "/finance/invoices", label: "Invoices" },
  { href: "/finance/payments", label: "Payments" },
  { href: "/finance/holds", label: "Holds" },
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

  if (role === "registrar_admin") {
    return registrarNavItems;
  }

  if (role === "finance_admin") {
    return financeNavItems;
  }

  if (role === "super_admin") {
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

  if (role === "registrar_admin") {
    return {
      heading: "Registrar workspace",
      caption: "Applications, admissions decisions, enrollment records, and certificates.",
      searchHref: "/registrar/applications",
      searchPlaceholder: "Search applicants or references",
    };
  }

  if (role === "finance_admin") {
    return {
      heading: "Finance workspace",
      caption: "Invoices, payment references, account holds, and finance follow-up.",
      searchHref: "/finance/invoices",
      searchPlaceholder: "Search invoices or references",
    };
  }

  if (role === "super_admin") {
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
