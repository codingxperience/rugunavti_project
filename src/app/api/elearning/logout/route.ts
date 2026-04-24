import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { DEV_SESSION_COOKIE } from "@/lib/platform/auth";
import { clearClerkBridgeSession } from "@/lib/platform/bridge-session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOGIN_DESTINATION = "/elearning/login";

async function clearPlatformSessions() {
  const cookieStore = await cookies();
  cookieStore.delete(DEV_SESSION_COOKIE);
  await clearClerkBridgeSession();
}

export async function GET(request: Request) {
  await clearPlatformSessions();

  const url = new URL(request.url);
  const destination = url.searchParams.get("next") || LOGIN_DESTINATION;

  return NextResponse.redirect(new URL(destination, url.origin));
}

export async function POST() {
  await clearPlatformSessions();

  return NextResponse.json({
    success: true,
    redirectTo: LOGIN_DESTINATION,
  });
}
