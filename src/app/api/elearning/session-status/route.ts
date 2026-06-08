import { NextResponse } from "next/server";

import { CLERK_BRIDGE_SESSION_COOKIE } from "@/lib/platform/bridge-session";
import { hasClerk, platformEnv } from "@/lib/platform/env";
import {
  getDefaultWorkspaceRoute,
  resolveSafeRedirectTarget,
  resolveWorkspaceAccess,
} from "@/lib/platform/navigation";
import { getCurrentSession } from "@/lib/platform/session";
import {
  attachWorkspaceSessionCookie,
  hasActiveWorkspaceSession,
  workspaceIdleTimeoutSeconds,
} from "@/lib/platform/session-security";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const workspaceSessionActive = await hasActiveWorkspaceSession();
  const hasSessionTokenCookie = cookieHeader.includes("__session=");
  const hasClientUatCookie = cookieHeader.includes("__client_uat=");
  const hasBridgeCookie = cookieHeader.includes(`${CLERK_BRIDGE_SESSION_COOKIE}=`);
  const diagnostics = {
    host: request.headers.get("host"),
    origin: request.headers.get("origin"),
    hasClerkConfigured: hasClerk,
    expectedProxyUrl: platformEnv.clerkProxyUrl ?? null,
    hasCookieHeader: Boolean(cookieHeader),
    hasAnyClerkCookie: hasSessionTokenCookie || hasClientUatCookie,
    hasSessionTokenCookie,
    hasClientUatCookie,
    hasBridgeCookie,
    workspaceSessionActive,
    workspaceIdleTimeoutSeconds,
    serverUserId: null as string | null,
    serverSessionId: null as string | null,
    serverSessionStatus: null as string | null,
    authError: null as string | null,
  };

  if (hasClerk) {
    try {
      const clerk = await import("@clerk/nextjs/server");
      const authResult = await clerk.auth({ treatPendingAsSignedOut: false });

      diagnostics.serverUserId = authResult.userId ?? null;
      diagnostics.serverSessionId =
        typeof authResult.sessionId === "string" ? authResult.sessionId : null;
      diagnostics.serverSessionStatus =
        typeof authResult.sessionStatus === "string" ? authResult.sessionStatus : null;
    } catch (error) {
      diagnostics.authError =
        error instanceof Error ? error.message : "Unknown Clerk auth error";
    }
  }

  const { searchParams } = new URL(request.url);
  const session = await getCurrentSession();
  const authenticated = session.isAuthenticated && workspaceSessionActive;
  const requestedTarget = resolveSafeRedirectTarget(
    searchParams.get("target"),
    authenticated ? getDefaultWorkspaceRoute(session.role) : "/learn/dashboard"
  );
  const access = authenticated
    ? resolveWorkspaceAccess(session, requestedTarget)
    : null;

  const response = NextResponse.json(
    {
      authenticated,
      source: session.source,
      role: authenticated ? session.role : null,
      roles: authenticated ? session.roles : [],
      email: authenticated ? session.email : null,
      name: authenticated ? session.name : null,
      avatarUrl: authenticated ? session.avatarUrl : null,
      sessionStatus: authenticated ? session.sessionStatus : null,
      workspaceSessionActive,
      workspaceIdleTimeoutSeconds,
      requestedTarget,
      destination: access?.destination ?? null,
      access,
      diagnostics,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );

  if (authenticated) {
    attachWorkspaceSessionCookie(response);
  }

  return response;
}
