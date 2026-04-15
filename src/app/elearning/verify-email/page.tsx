import Link from "next/link";

import { AuthShell } from "@/components/platform/auth-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <AuthShell
      activeKey="verify"
      title="Verify your Ruguna learning email"
      description="Email verification protects learner access, certificate records, and course communication."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardContent>
            <h2 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
              Verification steps
            </h2>
            <div className="mt-6 grid gap-3">
              {[
                "Open the verification email sent after registration.",
                "Select the confirmation link or enter the code if prompted by Clerk.",
                "Return to sign in and continue into your learner workspace.",
                "If the email is delayed, check spam or request a resend from the sign-up flow.",
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
              <h3 className="font-heading text-2xl font-bold">Common verification issues</h3>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-white/72">
                <p>Email delivered to spam or promotions.</p>
                <p>Registration completed with a mistyped address.</p>
                <p>Expired link after waiting too long before opening.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-3">
              <Button asChild>
                <Link href="/elearning/register">Return to registration</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/elearning/login">Go to sign in</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/elearning/contact">Contact learner support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthShell>
  );
}
