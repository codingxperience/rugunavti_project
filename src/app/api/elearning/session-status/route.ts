import { NextResponse } from "next/server";

import { CLERK_BRIDGE_SESSION_COOKIE } from "@/lib/platform/bridge-session";
import { hasClerk, platformEnv } from "@/lib/platform/env";
import {
  getDefaultWorkspaceRoute,
  resolveSafeRedirectTarget,
  resolveWorkspaceAccess,
} from "@/lib/platform/navigation";
import { getCurrentSession } from "@/lib/platform/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
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
  const requestedTarget = resolveSafeRedirectTarget(
    searchParams.get("target"),
    session.isAuthenticated ? getDefaultWorkspaceRoute(session.role) : "/learn/dashboard"
  );
  const access = session.isAuthenticated
    ? resolveWorkspaceAccess(session, requestedTarget)
    : null;

  return NextResponse.json(
    {
      authenticated: session.isAuthenticated,
      source: session.source,
      role: session.role,
      roles: session.roles,
      sessionStatus: session.sessionStatus,
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
}
