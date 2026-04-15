import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Manrope, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { PostHogProvider } from "@/components/providers/posthog-provider";
import { RouteShell } from "@/components/site/route-shell";
import { siteConfig } from "@/data";
import { hasClerk } from "@/lib/platform/env";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
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
        className={`${manrope.variable} ${spaceGrotesk.variable} site-shell min-h-screen antialiased`}
        suppressHydrationWarning
      >
        {hasClerk ? <ClerkProvider>{app}</ClerkProvider> : app}
      </body>
    </html>
  );
}
