import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

import { isProduction } from "@/lib/platform/env";

export const WORKSPACE_SESSION_COOKIE = "ruguna-workspace-session";
export const DEFAULT_WORKSPACE_IDLE_MINUTES = 3;

function readIdleMinutes() {
  const rawValue =
    process.env.RUGUNA_WORKSPACE_IDLE_MINUTES ||
    process.env.NEXT_PUBLIC_RUGUNA_WORKSPACE_IDLE_MINUTES;
  const value = Number(rawValue);

  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_WORKSPACE_IDLE_MINUTES;
  }

  return Math.max(3, Math.min(Math.floor(value), 60));
}

export const workspaceIdleTimeoutMinutes = readIdleMinutes();
export const workspaceIdleTimeoutSeconds = workspaceIdleTimeoutMinutes * 60;
export const workspaceIdleTimeoutMs = workspaceIdleTimeoutSeconds * 1000;

function getWorkspaceCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: workspaceIdleTimeoutSeconds,
  };
}

function createWorkspaceCookieValue() {
  return String(Date.now());
}

export async function hasActiveWorkspaceSession() {
  const cookieStore = await cookies();

  return Boolean(cookieStore.get(WORKSPACE_SESSION_COOKIE)?.value);
}

export async function setWorkspaceSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set(
    WORKSPACE_SESSION_COOKIE,
    createWorkspaceCookieValue(),
    getWorkspaceCookieOptions()
  );
}

export async function clearWorkspaceSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(WORKSPACE_SESSION_COOKIE);
}

export function attachWorkspaceSessionCookie(response: NextResponse) {
  response.cookies.set(
    WORKSPACE_SESSION_COOKIE,
    createWorkspaceCookieValue(),
    getWorkspaceCookieOptions()
  );

  return response;
}
