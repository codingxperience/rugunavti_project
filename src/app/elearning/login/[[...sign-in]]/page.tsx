import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { AuthShell } from "@/components/platform/auth-shell";
import { ClerkAuthFlow } from "@/components/platform/clerk-auth-flow";
import { Button } from "@/components/ui/button";
import {
  DEV_SESSION_COOKIE,
  encodeDevSession,
  normalizeRole,
  type PlatformRole,
} from "@/lib/platform/auth";
import { hasClerk, platformEnv } from "@/lib/platform/env";
import { resolveSafeRedirectTarget } from "@/lib/platform/navigation";

const devRoles: { role: PlatformRole; title: string; destination: string }[] = [
  { role: "student", title: "Student", destination: "/learn/dashboard" },
  { role: "instructor", title: "Instructor", destination: "/instructor/dashboard" },
  { role: "registrar_admin", title: "Admin", destination: "/admin/elearning" },
];

export const metadata: Metadata = {
  title: "Sign in to Ruguna eLearning",
  description: "Access the Ruguna eLearning classroom.",
};

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
  const redirectUrl = next ? resolveSafeRedirectTarget(next, "/learn/dashboard") : null;

  return (
    <AuthShell
      activeKey="sign-in"
      title="Sign in"
      description="Continue to your Ruguna classroom."
    >
      <div className="grid gap-5">
        {hasClerk ? (
          <ClerkAuthFlow mode="sign-in" redirectTarget={redirectUrl} />
        ) : platformEnv.allowDevAuth ? (
          <div className="rounded-[26px] border border-[var(--color-border)] bg-[#fbfbf7] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Local test mode
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
              Choose a workspace
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              Clerk is not connected locally yet. Use a test role below to review the platform.
            </p>
          </div>
        ) : (
          <div className="rounded-[26px] border border-amber-200 bg-amber-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
              Authentication setup required
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-ink)]">
              Sign in is not available yet
            </h2>
            <p className="mt-2 text-sm leading-7 text-amber-900/80">
              Ruguna eLearning is deployed, but Clerk keys are not available to this
              deployment environment. Add the Clerk publishable key and secret key in Vercel,
              then redeploy.
            </p>
          </div>
        )}

        {platformEnv.allowDevAuth ? (
          <details className="rounded-[24px] border border-dashed border-black/14 bg-white p-4">
            <summary className="cursor-pointer list-none text-center text-sm font-semibold text-[var(--color-ink)]">
              Development access only
            </summary>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {devRoles.map((item) => (
                <form key={item.role} action={startDevSession}>
                  <input type="hidden" name="role" value={item.role} />
                  <input type="hidden" name="destination" value={item.destination} />
                  <Button type="submit" variant="secondary" className="w-full">
                    {item.title}
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
