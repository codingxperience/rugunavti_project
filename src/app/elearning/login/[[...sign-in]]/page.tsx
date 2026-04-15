import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

import { AuthShell } from "@/components/platform/auth-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { clerkAppearance } from "@/lib/platform/clerk-appearance";
import {
  DEV_SESSION_COOKIE,
  encodeDevSession,
  normalizeRole,
  type PlatformRole,
} from "@/lib/platform/auth";
import { hasClerk, platformEnv } from "@/lib/platform/env";

const devRoles: { role: PlatformRole; title: string; destination: string }[] = [
  { role: "student", title: "Student", destination: "/learn/dashboard" },
  { role: "instructor", title: "Instructor", destination: "/instructor/dashboard" },
  { role: "registrar_admin", title: "Admin", destination: "/admin/elearning" },
];

async function startDevSession(formData: FormData) {
  "use server";

  if (!platformEnv.allowDevAuth) {
    redirect("/elearning/login");
  }

  const role = normalizeRole(formData.get("role")?.toString());
  const destination = formData.get("destination")?.toString() || "/learn/dashboard";

  if (!role) {
    redirect("/elearning/login");
  }

  const cookieStore = await cookies();
  cookieStore.set(
    DEV_SESSION_COOKIE,
    encodeDevSession({
      role,
      email: `${role}@ruguna.local`,
      name: role.replace(/_/g, " "),
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 8,
    }
  );

  redirect(destination);
}

export default async function ElearningLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectUrl = next ?? "/learn/dashboard";

  return (
    <AuthShell
      activeKey="sign-in"
      title="Sign in to Ruguna eLearning"
      description="Access your classroom, assignments, announcements, and certificates from one protected workspace."
    >
      <div className="grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Student and staff access
          </p>
          <h2 className="font-heading mt-4 text-4xl font-bold text-[var(--color-ink)]">
            Continue with email or Google
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            Sign in to continue learning or managing eLearning delivery. If you do not
            have an account yet, create one first and verify your email.
          </p>
        </div>

        <Card>
          <CardContent>
            {hasClerk ? (
              <SignIn
                appearance={clerkAppearance}
                path="/elearning/login"
                routing="path"
                signUpUrl="/elearning/register"
                forceRedirectUrl={redirectUrl}
              />
            ) : (
              <div className="grid gap-4">
                <h3 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  Local auth provider not configured
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                  Clerk powers email sign in, Google sign in, verification, and password
                  reset in production. For local development, use the development access
                  section below.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
          <Link href="/elearning/register" className="font-semibold text-[var(--color-ink)]">
            Create account
          </Link>
          <span>•</span>
          <Link href="/elearning/forgot-password">Forgot password</Link>
          <span>•</span>
          <Link href="/elearning/verify-email">Verification help</Link>
          <span>•</span>
          <Link href="/elearning/contact">Contact support</Link>
        </div>

        {platformEnv.allowDevAuth ? (
          <details className="rounded-[28px] border border-[var(--color-border)] bg-white p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-ink)]">
              Development access
            </summary>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              This is only for local testing while Clerk is not configured in the current environment.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {devRoles.map((item) => (
                <form key={item.role} action={startDevSession}>
                  <input type="hidden" name="role" value={item.role} />
                  <input type="hidden" name="destination" value={item.destination} />
                  <Button type="submit" variant="secondary">
                    Enter as {item.title}
                  </Button>
                </form>
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </AuthShell>
  );
}
