import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDb } from "@/lib/db";
import { DEV_SESSION_COOKIE, canAccessRole, decodeDevSession, type PlatformRole } from "@/lib/platform/auth";
import { CLERK_BRIDGE_SESSION_COOKIE, decodeClerkBridgeSession } from "@/lib/platform/bridge-session";
import { hasClerk, hasDatabase, platformEnv } from "@/lib/platform/env";
import { resolveEffectiveSessionRoles } from "@/lib/platform/role-bootstrap";

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

async function getPersistedUserSnapshot(input: {
  clerkId?: string | null;
  email?: string | null;
}) {
  if (!platformEnv.useDatabase || !hasDatabase) {
    return {
      roleSlugs: [] as string[],
      profileName: null as string | null,
      avatarUrl: null as string | null,
    };
  }

  const email = input.email?.trim().toLowerCase();
  const filters = [
    input.clerkId ? { clerkId: input.clerkId } : null,
    email ? { email } : null,
  ].filter((filter): filter is { clerkId: string } | { email: string } => Boolean(filter));

  if (!filters.length) {
    return {
      roleSlugs: [] as string[],
      profileName: null as string | null,
      avatarUrl: null as string | null,
    };
  }

  try {
    const user = await getDb().user.findFirst({
      where: { OR: filters },
      select: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        userRoles: {
          select: {
            role: {
              select: { slug: true },
            },
          },
        },
      },
    });

    return {
      roleSlugs: user?.userRoles.map((item) => item.role.slug) ?? [],
      profileName: user?.profile
        ? [user.profile.firstName, user.profile.lastName].filter(Boolean).join(" ") || null
        : null,
      avatarUrl: user?.profile?.avatarUrl ?? null,
    };
  } catch (error) {
    console.error("Persisted role lookup failed; using session role only.", error);
    return {
      roleSlugs: [] as string[],
      profileName: null,
      avatarUrl: null,
    };
  }
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

        const email =
          user?.primaryEmailAddress?.emailAddress ??
          (typeof authResult.sessionClaims?.email === "string" ? authResult.sessionClaims.email : null);
        const persistedUser = await getPersistedUserSnapshot({
          clerkId: authResult.userId,
          email,
        });
        const effectiveRoles = resolveEffectiveSessionRoles(rawRole, email, persistedUser.roleSlugs);
        const name = resolveReadableName(
          persistedUser.profileName ||
            [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
            user?.username ||
            (typeof authResult.sessionClaims?.fullName === "string"
              ? authResult.sessionClaims.fullName
              : null),
          email
        );

        return {
          isAuthenticated: true,
          role: effectiveRoles.role,
          roles: effectiveRoles.roles,
          email,
          name,
          clerkUserId: authResult.userId,
          avatarUrl: persistedUser.avatarUrl ?? user?.imageUrl ?? null,
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
    const persistedUser = await getPersistedUserSnapshot({
      clerkId: bridgeSession.userId,
      email: bridgeSession.email,
    });
    const effectiveRoles = resolveEffectiveSessionRoles(
      bridgeSession.role,
      bridgeSession.email,
      persistedUser.roleSlugs
    );

    return {
      isAuthenticated: true,
      role: effectiveRoles.role,
      roles: effectiveRoles.roles,
      email: bridgeSession.email,
      name: resolveReadableName(persistedUser.profileName || bridgeSession.name, bridgeSession.email),
      clerkUserId: bridgeSession.userId,
      avatarUrl: persistedUser.avatarUrl,
      sessionStatus: "active" as const,
      source: "bridge" as const,
    };
  }

  const devSession = decodeDevSession(cookieStore.get(DEV_SESSION_COOKIE)?.value);

  if (platformEnv.allowDevAuth && devSession) {
    const effectiveRoles = resolveEffectiveSessionRoles(devSession.role, devSession.email);

    return {
      isAuthenticated: true,
      role: effectiveRoles.role,
      roles: effectiveRoles.roles,
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

  if (!session.isAuthenticated) {
    const next = encodeURIComponent(redirectTo ?? "/elearning/login");
    redirect(`/elearning/login?next=${next}`);
  }

  if (!canAccessRole(session, roles)) {
    const next = encodeURIComponent(redirectTo ?? "/learn/dashboard");
    redirect(`/elearning/access-denied?next=${next}`);
  }

  return session;
}
