import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEV_SESSION_COOKIE, canAccessRole, decodeDevSession, type PlatformRole } from "@/lib/platform/auth";
import { hasClerk, platformEnv } from "@/lib/platform/env";

export async function getCurrentSession() {
  if (hasClerk) {
    try {
      const clerk = await import("@clerk/nextjs/server");
      const authResult = await clerk.auth({ treatPendingAsSignedOut: false });

      if (authResult.userId) {
        let user: Awaited<ReturnType<typeof clerk.currentUser>> | null = null;

        try {
          user = await clerk.currentUser();
        } catch (error) {
          console.error("Clerk currentUser lookup failed; falling back to auth() claims.", error);
        }

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
          email:
            user?.primaryEmailAddress?.emailAddress ??
            (typeof authResult.sessionClaims?.email === "string" ? authResult.sessionClaims.email : null),
          name:
            [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
            user?.username ||
            (typeof authResult.sessionClaims?.fullName === "string"
              ? authResult.sessionClaims.fullName
              : "Ruguna User"),
          sessionStatus: (authResult.sessionStatus === "pending" ? "pending" : "active") as
            | "active"
            | "pending",
          source: "clerk" as const,
        };
      }
    } catch (error) {
      console.error("Clerk auth lookup failed; falling back to dev/guest mode.", error);
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
      sessionStatus: "active" as const,
      source: "dev" as const,
    };
  }

  return {
    isAuthenticated: false,
    role: null,
    roles: [] as PlatformRole[],
    email: null,
    name: null,
    sessionStatus: null,
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
