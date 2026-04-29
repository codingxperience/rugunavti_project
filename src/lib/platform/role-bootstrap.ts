import "server-only";

import { normalizeRole, type PlatformRole } from "@/lib/platform/auth";
import { platformEnv } from "@/lib/platform/env";

const rolePriority: PlatformRole[] = [
  "super_admin",
  "registrar_admin",
  "finance_admin",
  "instructor",
  "student",
  "applicant",
];

function getBootstrapRolesForEmail(email: string | null | undefined) {
  const normalizedEmail = email?.trim().toLowerCase();
  const roles: PlatformRole[] = [];

  if (!normalizedEmail) {
    return roles;
  }

  if (platformEnv.bootstrapRoleEmails.superAdmin.has(normalizedEmail)) {
    roles.push("super_admin");
  }

  if (platformEnv.bootstrapRoleEmails.registrarAdmin.has(normalizedEmail)) {
    roles.push("registrar_admin");
  }

  if (platformEnv.bootstrapRoleEmails.financeAdmin.has(normalizedEmail)) {
    roles.push("finance_admin");
  }

  if (platformEnv.bootstrapRoleEmails.instructor.has(normalizedEmail)) {
    roles.push("instructor");
  }

  return roles;
}

export function resolveEffectiveSessionRoles(
  claimedRole: string | null | undefined,
  email: string | null | undefined,
  persistedRoles: Array<string | null | undefined> = []
) {
  const normalizedClaimedRole = normalizeRole(claimedRole) ?? "student";
  const roles = new Set<PlatformRole>([normalizedClaimedRole]);

  for (const role of persistedRoles) {
    const normalizedRole = normalizeRole(role);

    if (normalizedRole) {
      roles.add(normalizedRole);
    }
  }

  for (const role of getBootstrapRolesForEmail(email)) {
    roles.add(role);
  }

  const orderedRoles = rolePriority.filter((role) => roles.has(role));
  const primaryRole = orderedRoles[0] ?? normalizedClaimedRole;

  return {
    role: primaryRole,
    roles: orderedRoles.length ? orderedRoles : [primaryRole],
  };
}
