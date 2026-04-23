"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";

const chromeLessPrefixes = [
  "/learn",
  "/student",
  "/instructor",
  "/admin",
  "/finance",
  "/elearning/login",
  "/elearning/register",
  "/elearning/auth-complete",
  "/elearning/verify-email",
  "/elearning/forgot-password",
  "/sign-in",
  "/sign-up",
  "/e-learning-login",
];

export function RouteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isChromeLess = chromeLessPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isChromeLess) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <WhatsAppFloat />
      <SiteFooter />
    </>
  );
}
