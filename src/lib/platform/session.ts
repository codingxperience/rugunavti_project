import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEV_SESSION_COOKIE, canAccessRole, decodeDevSession, type PlatformRole } from "@/lib/platform/auth";
import { CLERK_BRIDGE_SESSION_COOKIE, decodeClerkBridgeSession } from "@/lib/platform/bridge-session";
import { hasClerk, platformEnv } from "@/lib/platform/env";

function isPlaceholderIdentity(value: string | null | undefined) {
  if (!value) {
    return true;
  }

  const normalized = value.trim().toLowerCase();

  return (
    normalized === "ruguna learner" ||
    normalized === "ruguna user" ||
    normalized === "ruguna student" ||
    normalized === "learner" ||
    normalized === "student"
  );
}

function deriveNameFromEmail(email: string | null | undefined) {
  if (!email) {
    return null;
  }

  const localPart = email.split("@")[0]?.trim();
  const domain = email.split("@")[1]?.trim().toLowerCase();

  if (!localPart || domain === "ruguna.local") {
    return null;
  }

  const words = localPart
    .split(/[._-]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

  return words.length ? words.join(" ") : null;
}

function resolveReadableName(name: string | null | undefined, email: string | null | undefined) {
  if (!isPlaceholderIdentity(name)) {
    return name?.trim() || deriveNameFromEmail(email) || "Ruguna Student";
  }

  return deriveNameFromEmail(email) || "Ruguna Student";
}

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
        const email =
          user?.primaryEmailAddress?.emailAddress ??
          (typeof authResult.sessionClaims?.email === "string" ? authResult.sessionClaims.email : null);
        const name = resolveReadableName(
          [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
            user?.username ||
            (typeof authResult.sessionClaims?.fullName === "string"
              ? authResult.sessionClaims.fullName
              : null),
          email
        );

        return {
          isAuthenticated: true,
          role: role ?? "student",
          roles: [role ?? "student"],
          email,
          name,
          clerkUserId: authResult.userId,
          avatarUrl: user?.imageUrl ?? null,
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
  const bridgeSession = decodeClerkBridgeSession(
    cookieStore.get(CLERK_BRIDGE_SESSION_COOKIE)?.value
  );

  if (bridgeSession) {
    return {
      isAuthenticated: true,
      role: bridgeSession.role,
      roles: [bridgeSession.role],
      email: bridgeSession.email,
      name: resolveReadableName(bridgeSession.name, bridgeSession.email),
      clerkUserId: bridgeSession.userId,
      avatarUrl: null,
      sessionStatus: "active" as const,
      source: "bridge" as const,
    };
  }

  const devSession = decodeDevSession(cookieStore.get(DEV_SESSION_COOKIE)?.value);

  if (platformEnv.allowDevAuth && devSession) {
    return {
      isAuthenticated: true,
      role: devSession.role,
      roles: [devSession.role],
      email: devSession.email,
      name: resolveReadableName(devSession.name, devSession.email),
      clerkUserId: null,
      avatarUrl: null,
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
    clerkUserId: null,
    avatarUrl: null,
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
