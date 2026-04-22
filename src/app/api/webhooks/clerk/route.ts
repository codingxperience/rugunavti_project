import crypto from "node:crypto";

import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";
import { hasDatabase, platformEnv } from "@/lib/platform/env";
import { normalizeRole, type PlatformRole } from "@/lib/platform/auth";
import { attachUserRole } from "@/lib/platform/users";

type ClerkEmail = {
  id: string;
  email_address: string;
};

type ClerkUserData = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: ClerkEmail[];
  public_metadata?: Record<string, unknown>;
};

type ClerkWebhookEvent = {
  type: "user.created" | "user.updated" | "user.deleted" | string;
  data: ClerkUserData;
};

function verifyClerkSignature(rawBody: string, headers: Headers) {
  const secret = platformEnv.clerkWebhookSecret;
  const svixId = headers.get("svix-id");
  const svixTimestamp = headers.get("svix-timestamp");
  const svixSignature = headers.get("svix-signature");

  if (!secret || !svixId || !svixTimestamp || !svixSignature) {
    return false;
  }

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
  const expectedSignature = crypto.createHmac("sha256", secretBytes).update(signedContent).digest("base64");

  return svixSignature.split(" ").some((signaturePart) => {
    const signature = signaturePart.replace(/^v1,/, "").trim();
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    return (
      signatureBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    );
  });
}

function getPrimaryEmail(data: ClerkUserData) {
  const primary = data.email_addresses?.find((email) => email.id === data.primary_email_address_id);
  return primary?.email_address ?? data.email_addresses?.[0]?.email_address ?? null;
}

function getRole(data: ClerkUserData): PlatformRole {
  const rawRole =
    typeof data.public_metadata?.role === "string" ? data.public_metadata.role : "student";
  return normalizeRole(rawRole) ?? "student";
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!verifyClerkSignature(rawBody, request.headers)) {
    return NextResponse.json({ success: false, message: "Invalid Clerk webhook signature." }, { status: 401 });
  }

  if (!platformEnv.useDatabase || !hasDatabase) {
    return NextResponse.json(
      { success: false, message: "Database is not configured for Clerk webhook sync." },
      { status: 503 }
    );
  }

  const event = JSON.parse(rawBody) as ClerkWebhookEvent;
  const db = getDb();

  try {
    if (event.type === "user.deleted") {
      await db.user.updateMany({
        where: { clerkId: event.data.id },
        data: { isActive: false },
      });

      await writeAuditLog({
        action: AuditAction.UPDATE,
        entityType: "User",
        entityId: event.data.id,
        summary: "Clerk user deletion synced to Ruguna eLearning.",
        payload: { clerkId: event.data.id },
      });

      return NextResponse.json({ success: true });
    }

    if (event.type !== "user.created" && event.type !== "user.updated") {
      return NextResponse.json({ success: true, ignored: true });
    }

    const email = getPrimaryEmail(event.data);

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Clerk user has no primary email address." },
        { status: 400 }
      );
    }

    const firstName = event.data.first_name || event.data.username || "Ruguna";
    const lastName = event.data.last_name || "Learner";
    const user = await db.user.upsert({
      where: { email: email.toLowerCase() },
      update: {
        clerkId: event.data.id,
        email: email.toLowerCase(),
        isActive: true,
        profile: {
          upsert: {
            update: { firstName, lastName },
            create: { firstName, lastName },
          },
        },
      },
      create: {
        clerkId: event.data.id,
        email: email.toLowerCase(),
        isActive: true,
        profile: {
          create: { firstName, lastName },
        },
      },
    });

    await attachUserRole(user.id, getRole(event.data));

    await writeAuditLog({
      actorId: user.id,
      action: AuditAction.UPDATE,
      entityType: "User",
      entityId: user.id,
      summary: `Clerk ${event.type} synced for ${email}.`,
      payload: {
        clerkId: event.data.id,
        eventType: event.type,
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error("Clerk webhook sync failed", error);

    return NextResponse.json(
      { success: false, message: "Clerk webhook could not be synced." },
      { status: 500 }
    );
  }
}
