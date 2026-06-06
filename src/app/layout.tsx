import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { PostHogProvider } from "@/components/providers/posthog-provider";
import {
  ClerkSessionIdleGuard,
  LocalSessionIdleGuard,
} from "@/components/platform/session-idle-guard";
import { RouteShell } from "@/components/site/route-shell";
import { siteConfig } from "@/data";
import { hasClerk, platformEnv } from "@/lib/platform/env";

import "./globals.css";
import "../styles/prototype.css";

// Display face — characterful, premium headings (replaces Space Grotesk)
const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Body face — clean, confident sans (replaces Manrope)
const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ruguna.ac.ug"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const app = (
    <>
      <PostHogProvider />
      <RouteShell>{children}</RouteShell>
    </>
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sansFont.variable} ${displayFont.variable} site-shell min-h-screen antialiased`}
        suppressHydrationWarning
      >
        {hasClerk ? (
          <ClerkProvider
            dynamic
            proxyUrl={platformEnv.clerkProxyUrl}
            taskUrls={{
              "choose-organization": "/elearning/tasks/choose-organization",
              "reset-password": "/elearning/tasks/reset-password",
              "setup-mfa": "/elearning/tasks/setup-mfa",
            }}
          >
            <ClerkSessionIdleGuard />
            {app}
          </ClerkProvider>
        ) : (
          <>
            <LocalSessionIdleGuard />
            {app}
          </>
        )}
      </body>
    </html>
  );
}
