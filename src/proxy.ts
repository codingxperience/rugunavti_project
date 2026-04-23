import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { platformEnv } from "@/lib/platform/env";

const hasClerkKeys = Boolean(platformEnv.clerkPublishableKey) && Boolean(platformEnv.clerkSecretKey);

const clerkProxy = clerkMiddleware(
  () => {},
  {
    proxyUrl: platformEnv.clerkProxyUrl,
    signInUrl: "/elearning/login",
    signUpUrl: "/elearning/register",
  }
);

const passthroughProxy = () => NextResponse.next();

export default hasClerkKeys ? clerkProxy : passthroughProxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc|__clerk)(.*)",
  ],
};
