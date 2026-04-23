import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const hasClerkKeys =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) && Boolean(process.env.CLERK_SECRET_KEY);

const clerkProxy = clerkMiddleware(
  () => {},
  {
    signInUrl: "/elearning/login",
    signUpUrl: "/elearning/register",
  }
);

const passthroughProxy = () => NextResponse.next();

export default hasClerkKeys ? clerkProxy : passthroughProxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
