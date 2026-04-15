import Link from "next/link";

import { AuthShell } from "@/components/platform/auth-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      activeKey="recovery"
      title="Recover access to your Ruguna account"
      description="Use password reset and verification support to regain secure access to your classroom."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardContent>
            <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
              Reset your password
            </h2>
            <div className="mt-6 grid gap-3">
              {[
                "Open the sign-in page and choose the password recovery option inside the Clerk form.",
                "Use the email address linked to your Ruguna learning account.",
                "Complete the reset and return to sign in.",
                "If you still cannot access the account, contact learner support for manual help.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
                >
                  <div className="font-heading flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-bold text-[var(--color-ink)]">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-[var(--color-muted)]">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="bg-[var(--color-ink)] text-white">
            <CardContent>
              <h3 className="font-heading text-2xl font-bold">Security note</h3>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Password reset protects private learner records, submissions, and
                certificate access. Always use a password that you do not reuse elsewhere.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-3">
              <Button asChild>
                <Link href="/elearning/login">Open sign in</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/elearning/verify-email">Verification help</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/elearning/contact">Contact support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthShell>
  );
}
