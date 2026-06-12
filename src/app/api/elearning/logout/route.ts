import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { DEV_SESSION_COOKIE } from "@/lib/platform/auth";
import { clearClerkBridgeSession } from "@/lib/platform/bridge-session";
import { platformEnv } from "@/lib/platform/env";
import { clearWorkspaceSessionCookie } from "@/lib/platform/session-security";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOGOUT_DESTINATION = "/";

async function clearPlatformSessions() {
  const cookieStore = await cookies();
  cookieStore.delete(DEV_SESSION_COOKIE);
  await clearClerkBridgeSession();
  await clearWorkspaceSessionCookie();
}

function resolveLogoutDestination(request: Request) {
  const requestUrl = new URL(request.url);
  const requestedDestination = requestUrl.searchParams.get("next") || LOGOUT_DESTINATION;
  const destination =
    requestedDestination.startsWith("/") && !requestedDestination.startsWith("//")
      ? requestedDestination
      : LOGOUT_DESTINATION;
  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProtocol =
    request.headers.get("x-forwarded-proto") ?? requestUrl.protocol.replace(":", "");
  const forwardedOrigin = forwardedHost ? `${forwardedProtocol}://${forwardedHost}` : null;
  const origin =
    platformEnv.siteOrigin && !platformEnv.siteOrigin.includes("0.0.0.0")
      ? platformEnv.siteOrigin
      : forwardedOrigin && !forwardedOrigin.includes("0.0.0.0")
        ? forwardedOrigin
        : requestUrl.origin;

  return new URL(destination, origin);
}

export async function GET(request: Request) {
  await clearPlatformSessions();

  return NextResponse.redirect(resolveLogoutDestination(request));
}

export async function POST() {
  await clearPlatformSessions();

  return NextResponse.json({
    success: true,
    redirectTo: LOGOUT_DESTINATION,
  });
}
