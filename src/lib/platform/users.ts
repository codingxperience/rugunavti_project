import { Role } from "@prisma/client";

import { getDb } from "@/lib/db";
import { canAccessRole, type PlatformRole, type PlatformSession } from "@/lib/platform/auth";
import { splitResolvedDisplayName } from "@/lib/platform/display-name";
import { hasClerk, hasDatabase, platformEnv } from "@/lib/platform/env";
import { getCurrentSession } from "@/lib/platform/session";

type ClerkIdentitySource = {
  id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  imageUrl?: string | null;
  primaryEmailAddress?: { emailAddress?: string | null } | null;
};

function readClerkIdentity(user: ClerkIdentitySource | null | undefined) {
  return {
    clerkId: user?.id ?? null,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    name: [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || null,
    avatarUrl: user?.imageUrl ?? null,
  };
}

async function getClerkIdentity(session: PlatformSession) {
  if (!hasClerk) {
    return { clerkId: session.clerkUserId ?? null, email: null, name: null, avatarUrl: null };
  }

  try {
    const clerk = await import("@clerk/nextjs/server");
    const user = await clerk.currentUser();

    if (user) {
      return readClerkIdentity(user);
    }
  } catch {
    // The bridge flow can authenticate the browser before Clerk's Next helpers
    // can resolve the user on this Vercel domain. Use the backend API below.
  }

  if (session.clerkUserId && platformEnv.clerkSecretKey) {
    try {
      const { createClerkClient } = await import("@clerk/nextjs/server");
      const clerkClient = createClerkClient({
        secretKey: platformEnv.clerkSecretKey,
        publishableKey: platformEnv.clerkPublishableKey ?? undefined,
      });
      const user = await clerkClient.users.getUser(session.clerkUserId);

      return readClerkIdentity(user);
    } catch (error) {
      console.error("Clerk backend user lookup failed; keeping session identity.", error);
    }
  }

  return { clerkId: session.clerkUserId ?? null, email: null, name: null, avatarUrl: null };
}

export async function ensureRole(slug: PlatformRole) {
  const db = getDb();
  const roleNames: Record<PlatformRole, string> = {
    applicant: "Applicant",
    student: "Student",
    instructor: "Instructor",
    registrar_admin: "Registrar/Admin",
    finance_admin: "Finance/Admin",
    super_admin: "Super Admin",
  };

  return db.role.upsert({
    where: { slug },
    update: {},
    create: {
      slug,
      name: roleNames[slug],
      description: `${roleNames[slug]} access for Ruguna eLearning.`,
    },
  });
}

export async function attachUserRole(userId: string, role: Role | PlatformRole) {
  const db = getDb();
  const resolvedRole = typeof role === "string" ? await ensureRole(role) : role;

  await db.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: resolvedRole.id,
      },
    },
    update: {},
    create: {
      userId,
      roleId: resolvedRole.id,
    },
  });
}

export async function ensureUserForSession(session?: PlatformSession) {
  const currentSession = session ?? (await getCurrentSession());

  if (!currentSession.isAuthenticated) {
    throw new Error("Authentication is required.");
  }

  if (!platformEnv.useDatabase || !hasDatabase) {
    throw new Error("Database is not configured for authenticated eLearning actions.");
  }

  const db = getDb();
  const clerkIdentity =
    currentSession.source === "clerk" || currentSession.source === "bridge"
      ? await getClerkIdentity(currentSession)
      : null;
  const candidateEmail = (clerkIdentity?.email || currentSession.email)?.toLowerCase() ?? null;
  const existingByClerkId = clerkIdentity?.clerkId
    ? await db.user.findUnique({ where: { clerkId: clerkIdentity.clerkId } })
    : null;
  const email = candidateEmail || existingByClerkId?.email || `${currentSession.role}@ruguna.local`;
  const { firstName, lastName } = splitResolvedDisplayName(
    {
      name: clerkIdentity?.name || currentSession.name,
      email,
      fallback: "Learner",
    }
  );
  const avatarUrl = clerkIdentity?.avatarUrl || currentSession.avatarUrl || undefined;

  const user = existingByClerkId
    ? await db.user.update({
        where: { id: existingByClerkId.id },
        data: {
          email,
          isActive: true,
          lastLoginAt: new Date(),
          profile: {
            upsert: {
              update: { firstName, lastName, ...(avatarUrl ? { avatarUrl } : {}) },
              create: { firstName, lastName, ...(avatarUrl ? { avatarUrl } : {}) },
            },
          },
        },
        include: {
          profile: true,
          userRoles: { include: { role: true } },
        },
      })
    : await db.user.upsert({
        where: { email },
        update: {
          clerkId: clerkIdentity?.clerkId,
          isActive: true,
          lastLoginAt: new Date(),
          profile: {
            upsert: {
              update: { firstName, lastName, ...(avatarUrl ? { avatarUrl } : {}) },
              create: { firstName, lastName, ...(avatarUrl ? { avatarUrl } : {}) },
            },
          },
        },
        create: {
          clerkId: clerkIdentity?.clerkId,
          email,
          isActive: true,
          lastLoginAt: new Date(),
          profile: {
            create: { firstName, lastName, ...(avatarUrl ? { avatarUrl } : {}) },
          },
        },
        include: {
          profile: true,
          userRoles: { include: { role: true } },
        },
      });

  for (const role of currentSession.roles.length ? currentSession.roles : currentSession.role ? [currentSession.role] : []) {
    await attachUserRole(user.id, role);
  }

  return db.user.findUniqueOrThrow({
    where: { id: user.id },
    include: {
      profile: true,
      userRoles: { include: { role: true } },
    },
  });
}

export async function requireApiUser(roles: PlatformRole[]) {
  const session = await getCurrentSession();

  if (!session.isAuthenticated || !canAccessRole(session, roles)) {
    return {
      ok: false as const,
      status: 401,
      response: {
        success: false,
        message: "Sign in with the correct Ruguna eLearning role to continue.",
      },
    };
  }

  if (!platformEnv.useDatabase || !hasDatabase) {
    return {
      ok: false as const,
      status: 503,
      response: {
        success: false,
        message: "Database is not configured for this eLearning action.",
      },
    };
  }

  try {
    const user = await ensureUserForSession(session);

    return { ok: true as const, session, user };
  } catch (error) {
    console.error("Authenticated user sync failed", error);

    return {
      ok: false as const,
      status: 500,
      response: {
        success: false,
        message: "Your account could not be synced with Ruguna eLearning records.",
      },
    };
  }
}
