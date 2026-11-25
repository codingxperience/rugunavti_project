import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

import { PostHogProvider } from "@/components/providers/posthog-provider";
import {
  ClerkSessionIdleGuard,
  LocalSessionIdleGuard,
} from "@/components/platform/session-idle-guard";
import { RouteShell } from "@/components/site/route-shell";
import { siteConfig } from "@/data";
import { hasClerk, platformEnv } from "@/lib/platform/env";
import { productionSiteUrl } from "@/lib/site-url";

import "./globals.css";
import "./fonts/fonts.css";
import "../styles/prototype.css";

export const metadata: Metadata = {
  metadataBase: new URL(productionSiteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
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
        className="site-shell min-h-screen antialiased"
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
