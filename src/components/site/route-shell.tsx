"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ProtoFooter, ProtoHeader } from "@/components/site/proto-chrome";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";

const chromeLessPrefixes = [
  "/learn",
  "/student",
  "/instructor",
  "/admin",
  "/registrar",
  "/finance",
  "/account",
  "/elearning/login",
  "/elearning/register",
  "/elearning/auth-complete",
  "/elearning/access-denied",
  "/elearning/session-expired",
  "/elearning/tasks",
  "/elearning/verify-email",
  "/elearning/forgot-password",
  "/sign-in",
  "/sign-up",
  "/e-learning-login",
];

export function RouteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Match on path boundaries so "/student-life" is NOT treated as the "/student" dashboard.
  const isChromeLess = chromeLessPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (isChromeLess) {
    return <>{children}</>;
  }

  return (
    <div className="rg">
      <ProtoHeader />
      <main>{children}</main>
      <WhatsAppFloat />
      <ProtoFooter />
    </div>
  );
}
