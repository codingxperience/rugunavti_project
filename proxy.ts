import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/learn/:path*", "/student/:path*", "/instructor/:path*", "/admin/:path*", "/finance/:path*"],
};
