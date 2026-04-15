import { NextResponse, type NextRequest } from "next/server";

import { DEV_SESSION_COOKIE, getRouteRule } from "@/lib/platform/auth";

export function proxy(request: NextRequest) {
  const rule = getRouteRule(request.nextUrl.pathname);

  if (!rule) {
    return NextResponse.next();
  }

  const hasDevSession = request.cookies.has(DEV_SESSION_COOKIE);
  const hasClerkSession = request.cookies.has("__session");

  if (hasDevSession || hasClerkSession) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/elearning/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/learn/:path*", "/student/:path*", "/instructor/:path*", "/admin/:path*", "/finance/:path*"],
};
