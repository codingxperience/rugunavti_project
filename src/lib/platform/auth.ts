export const DEV_SESSION_COOKIE = "ruguna-platform-session";

export const platformRoles = [
  "applicant",
  "student",
  "instructor",
  "registrar_admin",
  "finance_admin",
  "super_admin",
] as const;

export type PlatformRole = (typeof platformRoles)[number];

export type PlatformSession = {
  isAuthenticated: boolean;
  role: PlatformRole | null;
  roles: PlatformRole[];
  email: string | null;
  name: string | null;
  clerkUserId?: string | null;
  avatarUrl?: string | null;
  sessionStatus: "active" | "pending" | null;
  source: "guest" | "dev" | "clerk" | "bridge";
};

export const protectedRouteRules: {
  prefix: string;
  roles: PlatformRole[];
  label: string;
}[] = [
  { prefix: "/learn", roles: ["student", "super_admin"], label: "Learning dashboard" },
  { prefix: "/student", roles: ["student", "super_admin"], label: "Student dashboard" },
  { prefix: "/instructor", roles: ["instructor", "super_admin"], label: "Instructor dashboard" },
  { prefix: "/admin", roles: ["registrar_admin", "super_admin"], label: "Admin console" },
  { prefix: "/finance", roles: ["finance_admin", "super_admin"], label: "Finance console" },
];

export function normalizeRole(value: string | null | undefined): PlatformRole | null {
  if (!value) return null;
  return platformRoles.find((role) => role === value) ?? null;
}

export function encodeDevSession(input: {
  role: PlatformRole;
  email: string;
  name: string;
}) {
  return encodeURIComponent(JSON.stringify(input));
}

export function decodeDevSession(value: string | undefined) {
  if (!value) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as {
      role?: string;
      email?: string;
      name?: string;
    };
    const role = normalizeRole(parsed.role);

    if (!role) return null;

    return {
      role,
      email: parsed.email ?? `${role}@ruguna.local`,
      name: parsed.name ?? role.replace(/_/g, " "),
    };
  } catch {
    return null;
  }
}

export function getRouteRule(pathname: string) {
  return protectedRouteRules.find((rule) => pathname.startsWith(rule.prefix));
}

export function canAccessRole(session: PlatformSession, roles: PlatformRole[]) {
  return session.roles.some((role) => roles.includes(role));
}
