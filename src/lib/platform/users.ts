import { Role } from "@prisma/client";

import { getDb } from "@/lib/db";
import { canAccessRole, type PlatformRole, type PlatformSession } from "@/lib/platform/auth";
import { hasClerk, hasDatabase, platformEnv } from "@/lib/platform/env";
import { getCurrentSession } from "@/lib/platform/session";

function isPlaceholderIdentity(value: string | null | undefined) {
  if (!value) {
    return true;
  }

  const normalized = value.trim().toLowerCase();

  return normalized === "ruguna learner" || normalized === "ruguna user";
}

function deriveNameFromEmail(email: string | null | undefined) {
  if (!email) {
    return null;
  }

  const localPart = email.split("@")[0]?.trim();

  if (!localPart) {
    return null;
  }

  const parts = localPart
    .split(/[._-]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

  return parts.length ? parts.join(" ") : null;
}

function splitDisplayName(name: string | null | undefined, email?: string | null) {
  const resolvedName = isPlaceholderIdentity(name)
    ? deriveNameFromEmail(email) || "Ruguna Student"
    : name?.trim() || deriveNameFromEmail(email) || "Ruguna Student";
  const safeName = resolvedName.trim();
  const parts = safeName.split(/\s+/);
  const firstName = parts.shift() ?? "Ruguna";
  const lastName = parts.length ? parts.join(" ") : "Student";

  return { firstName, lastName };
}

async function getClerkIdentity() {
  if (!hasClerk) {
    return { clerkId: null, email: null, name: null };
  }

  try {
    const clerk = await import("@clerk/nextjs/server");
    const user = await clerk.currentUser();

    return {
      clerkId: user?.id ?? null,
      email: user?.primaryEmailAddress?.emailAddress ?? null,
      name: [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || null,
    };
  } catch {
    return { clerkId: null, email: null, name: null };
  }
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
  const clerkIdentity = currentSession.source === "clerk" ? await getClerkIdentity() : null;
  const email = (clerkIdentity?.email || currentSession.email || `${currentSession.role}@ruguna.local`).toLowerCase();
  const { firstName, lastName } = splitDisplayName(
    clerkIdentity?.name || currentSession.name,
    email
  );
  const existingByClerkId = clerkIdentity?.clerkId
    ? await db.user.findUnique({ where: { clerkId: clerkIdentity.clerkId } })
    : null;

  const user = existingByClerkId
    ? await db.user.update({
        where: { id: existingByClerkId.id },
        data: {
          email,
          isActive: true,
          lastLoginAt: new Date(),
          profile: {
            upsert: {
              update: { firstName, lastName },
              create: { firstName, lastName },
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
              update: { firstName, lastName },
              create: { firstName, lastName },
            },
          },
        },
        create: {
          clerkId: clerkIdentity?.clerkId,
          email,
          isActive: true,
          lastLoginAt: new Date(),
          profile: {
            create: { firstName, lastName },
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
