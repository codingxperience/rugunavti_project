import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEV_SESSION_COOKIE, canAccessRole, decodeDevSession, type PlatformRole } from "@/lib/platform/auth";
import { hasClerk, platformEnv } from "@/lib/platform/env";

export async function getCurrentSession() {
  if (hasClerk) {
    try {
      const clerk = await import("@clerk/nextjs/server");
      const authResult = await clerk.auth();

      if (authResult.userId) {
        const user = await clerk.currentUser();
        const rawRole =
          typeof authResult.sessionClaims?.metadata === "object" &&
          authResult.sessionClaims?.metadata &&
          "role" in authResult.sessionClaims.metadata
            ? String(authResult.sessionClaims.metadata.role)
            : typeof user?.publicMetadata?.role === "string"
              ? user.publicMetadata.role
              : "student";

        const role = (["applicant", "student", "instructor", "registrar_admin", "finance_admin", "super_admin"] as const).find(
          (candidate) => candidate === rawRole
        );

        return {
          isAuthenticated: true,
          role: role ?? "student",
          roles: [role ?? "student"],
          email: user?.primaryEmailAddress?.emailAddress ?? null,
          name: [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "Ruguna User",
          source: "clerk" as const,
        };
      }
    } catch {
      // Fall back to dev/guest mode if Clerk is not fully configured yet.
    }
  }

  const cookieStore = await cookies();
  const devSession = decodeDevSession(cookieStore.get(DEV_SESSION_COOKIE)?.value);

  if (platformEnv.allowDevAuth && devSession) {
    return {
      isAuthenticated: true,
      role: devSession.role,
      roles: [devSession.role],
      email: devSession.email,
      name: devSession.name,
      source: "dev" as const,
    };
  }

  return {
    isAuthenticated: false,
    role: null,
    roles: [] as PlatformRole[],
    email: null,
    name: null,
    source: "guest" as const,
  };
}

export async function requireRole(roles: PlatformRole[], redirectTo?: string) {
  const session = await getCurrentSession();

  if (!session.isAuthenticated || !canAccessRole(session, roles)) {
    const next = encodeURIComponent(redirectTo ?? "/elearning/login");
    redirect(`/elearning/login?next=${next}`);
  }

  return session;
}
