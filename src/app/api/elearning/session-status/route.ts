import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/platform/session";
import { resolveSafeRedirectTarget, resolveWorkspaceRoute } from "@/lib/platform/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedTarget = resolveSafeRedirectTarget(
    searchParams.get("target"),
    "/learn/dashboard"
  );
  const session = await getCurrentSession();

  return NextResponse.json(
    {
      authenticated: session.isAuthenticated,
      source: session.source,
      role: session.role,
      sessionStatus: session.sessionStatus,
      requestedTarget,
      destination: session.isAuthenticated ? resolveWorkspaceRoute(session, requestedTarget) : null,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
