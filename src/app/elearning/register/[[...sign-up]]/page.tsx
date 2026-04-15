import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

import { AuthShell } from "@/components/platform/auth-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { clerkAppearance } from "@/lib/platform/clerk-appearance";
import { hasClerk, platformEnv } from "@/lib/platform/env";

export default async function ElearningRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectUrl = next ?? "/learn/dashboard";

  return (
    <AuthShell
      activeKey="sign-up"
      title="Create your Ruguna learning account"
      description="Register once for course enrollment, secure classroom access, announcements, and certificate-ready learning records."
    >
      <div className="grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Learner registration
          </p>
          <h2 className="font-heading mt-4 text-4xl font-bold text-[var(--color-ink)]">
            Register with email or Google
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            Create your account, verify your email, then continue into the course catalog
            and classroom.
          </p>
        </div>

        <Card>
          <CardContent>
            {hasClerk ? (
              <SignUp
                appearance={clerkAppearance}
                path="/elearning/register"
                routing="path"
                signInUrl="/elearning/login"
                forceRedirectUrl={redirectUrl}
              />
            ) : (
              <div className="grid gap-4">
                <h3 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  Local registration provider not configured
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                  Production registration supports email, Google, verification, and secure
                  password management through Clerk.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/elearning/login">Go to sign in</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href={platformEnv.allowDevAuth ? "/elearning/login" : "/elearning/contact"}>
                      {platformEnv.allowDevAuth ? "Use local development access" : "Contact admissions"}
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
          <Link href="/elearning/login" className="font-semibold text-[var(--color-ink)]">
            Already have an account?
          </Link>
          <span>•</span>
          <Link href="/elearning/verify-email">Verification help</Link>
          <span>•</span>
          <Link href="/elearning/contact">Need assistance</Link>
        </div>
      </div>
    </AuthShell>
  );
}
