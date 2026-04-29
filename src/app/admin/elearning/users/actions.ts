"use server";

import { AuditAction } from "@prisma/client";
import { createClerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getDb } from "@/lib/db";
import { platformRoles, type PlatformRole } from "@/lib/platform/auth";
import { hasClerk, platformEnv } from "@/lib/platform/env";
import { requireApiUser } from "@/lib/platform/users";

const assignableRoles = platformRoles.filter((role) => role !== "applicant");

const updateUserRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(assignableRoles as [PlatformRole, ...PlatformRole[]]),
});

async function syncClerkPublicRole(clerkId: string | null, role: PlatformRole) {
  if (!hasClerk || !platformEnv.clerkSecretKey || !clerkId) {
    return;
  }

  const clerkClient = createClerkClient({
    secretKey: platformEnv.clerkSecretKey,
    publishableKey: platformEnv.clerkPublishableKey ?? undefined,
  });
  const user = await clerkClient.users.getUser(clerkId);

  await clerkClient.users.updateUserMetadata(clerkId, {
    publicMetadata: {
      ...user.publicMetadata,
      role,
    },
  });
}

export async function updateUserRoleAction(formData: FormData) {
  const auth = await requireApiUser(["super_admin"]);

  if (!auth.ok) {
    redirect("/elearning/access-denied?next=/admin/elearning/users");
  }

  const parsed = updateUserRoleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    redirect("/admin/elearning/users?status=invalid-role");
  }

  const db = getDb();
  const targetUser = await db.user.findUnique({
    where: { id: parsed.data.userId },
    include: { userRoles: { include: { role: true } } },
  });

  if (!targetUser) {
    redirect("/admin/elearning/users?status=user-not-found");
  }

  if (targetUser.id === auth.user.id && parsed.data.role !== "super_admin") {
    redirect("/admin/elearning/users?status=cannot-demote-self");
  }

  const role = await db.role.upsert({
    where: { slug: parsed.data.role },
    update: {},
    create: {
      slug: parsed.data.role,
      name: parsed.data.role
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
      description: `${parsed.data.role.replace(/_/g, " ")} access for Ruguna eLearning.`,
    },
  });

  await db.$transaction([
    db.userRole.deleteMany({
      where: { userId: targetUser.id },
    }),
    db.userRole.create({
      data: {
        userId: targetUser.id,
        roleId: role.id,
      },
    }),
    db.auditLog.create({
      data: {
        actorId: auth.user.id,
        action: AuditAction.UPDATE,
        entityType: "UserRole",
        entityId: targetUser.id,
        summary: `Changed ${targetUser.email} role to ${parsed.data.role}.`,
        payload: {
          email: targetUser.email,
          role: parsed.data.role,
        },
      },
    }),
  ]);

  try {
    await syncClerkPublicRole(targetUser.clerkId, parsed.data.role);
  } catch (error) {
    console.error("Clerk public role sync failed", error);
    redirect("/admin/elearning/users?status=db-updated-clerk-sync-failed");
  }

  revalidatePath("/admin/elearning/users");
  redirect("/admin/elearning/users?status=role-updated");
}
