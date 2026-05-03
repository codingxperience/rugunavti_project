import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getAuthorizedPartyOrigins, platformEnv } from "@/lib/platform/env";

const hasClerkKeys = Boolean(platformEnv.clerkPublishableKey) && Boolean(platformEnv.clerkSecretKey);

function applySecurityHeaders(response: NextResponse, request: NextRequest) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );

  if (request.nextUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  return response;
}

const clerkProxy = clerkMiddleware(
  (_auth, request) => applySecurityHeaders(NextResponse.next(), request),
  {
    authorizedParties: getAuthorizedPartyOrigins(),
    proxyUrl: platformEnv.clerkProxyUrl,
    signInUrl: "/elearning/login",
    signUpUrl: "/elearning/register",
  }
);

const passthroughProxy = (request: NextRequest) =>
  applySecurityHeaders(NextResponse.next(), request);

export default hasClerkKeys ? clerkProxy : passthroughProxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc|__clerk)(.*)",
  ],
};
