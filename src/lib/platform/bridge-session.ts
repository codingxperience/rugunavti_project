import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

import { normalizeRole, type PlatformRole } from "@/lib/platform/auth";
import { isProduction, platformEnv } from "@/lib/platform/env";

export const CLERK_BRIDGE_SESSION_COOKIE = "ruguna-clerk-bridge";

type ClerkBridgeSessionPayload = {
  userId: string;
  role: PlatformRole;
  email: string | null;
  name: string | null;
  exp: number;
};

function getBridgeSecret() {
  if (!platformEnv.clerkSecretKey) {
    return null;
  }

  return `${platformEnv.clerkSecretKey}:ruguna-clerk-bridge`;
}

function signPayload(payload: string) {
  const secret = getBridgeSecret();

  if (!secret) {
    return null;
  }

  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function encodeClerkBridgeSession(input: ClerkBridgeSessionPayload) {
  const payload = Buffer.from(JSON.stringify(input)).toString("base64url");
  const signature = signPayload(payload);

  if (!signature) {
    return null;
  }

  return `${payload}.${signature}`;
}

export function decodeClerkBridgeSession(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);

  if (!expectedSignature) {
    return null;
  }

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      userId?: string;
      role?: string;
      email?: string | null;
      name?: string | null;
      exp?: number;
    };
    const role = normalizeRole(parsed.role);

    if (!parsed.userId || !role || typeof parsed.exp !== "number") {
      return null;
    }

    if (parsed.exp * 1000 <= Date.now()) {
      return null;
    }

    return {
      userId: parsed.userId,
      role,
      email: typeof parsed.email === "string" ? parsed.email : null,
      name: typeof parsed.name === "string" ? parsed.name : null,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

export async function setClerkBridgeSession(input: ClerkBridgeSessionPayload) {
  const encoded = encodeClerkBridgeSession(input);

  if (!encoded) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(CLERK_BRIDGE_SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    expires: new Date(input.exp * 1000),
  });

  return true;
}

export async function clearClerkBridgeSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CLERK_BRIDGE_SESSION_COOKIE);
}
