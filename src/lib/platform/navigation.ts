import { canAccessRole, getRouteRule, type PlatformRole, type PlatformSession } from "@/lib/platform/auth";

const roleDestinations: Record<PlatformRole, string> = {
  applicant: "/elearning",
  student: "/learn/dashboard",
  instructor: "/instructor/dashboard",
  registrar_admin: "/admin/elearning",
  finance_admin: "/finance",
  super_admin: "/admin/elearning",
};

export function getDefaultWorkspaceRoute(role: PlatformRole | null | undefined) {
  return role ? roleDestinations[role] : "/elearning";
}

export function resolveSafeRedirectTarget(value: string | null | undefined, fallback = "/learn/dashboard") {
  if (!value) {
    return fallback;
  }

  const target = value.trim();

  if (!target.startsWith("/") || target.startsWith("//")) {
    return fallback;
  }

  return target;
}

export function resolveWorkspaceRoute(session: PlatformSession, requestedTarget?: string | null) {
  const fallback = getDefaultWorkspaceRoute(session.role);
  const target = resolveSafeRedirectTarget(requestedTarget, fallback);
  const rule = getRouteRule(target);

  if (!rule || canAccessRole(session, rule.roles)) {
    return target;
  }

  return fallback;
}

export function resolveWorkspaceAccess(session: PlatformSession, requestedTarget?: string | null) {
  const fallback = getDefaultWorkspaceRoute(session.role);
  const target = resolveSafeRedirectTarget(requestedTarget, fallback);
  const rule = getRouteRule(target);

  if (!rule || canAccessRole(session, rule.roles)) {
    return {
      allowed: true,
      target,
      destination: target,
      fallback,
      requiredRoles: rule?.roles ?? [],
    };
  }

  return {
    allowed: false,
    target,
    destination: `/elearning/access-denied?next=${encodeURIComponent(target)}`,
    fallback,
    requiredRoles: rule.roles,
  };
}
