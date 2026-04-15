import Link from "next/link";
import { BookOpenText, GraduationCap, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const shellLinks = [
  { href: "/elearning/login", label: "Sign In", key: "sign-in" },
  { href: "/elearning/register", label: "Create Account", key: "sign-up" },
] as const;

const platformSignals = [
  {
    title: "Structured classroom access",
    detail: "Courses, lessons, assignments, and certificates stay in one protected learning flow.",
    icon: BookOpenText,
  },
  {
    title: "Built for practical learning",
    detail: "Ruguna supports online and blended study without losing vocational discipline.",
    icon: GraduationCap,
  },
  {
    title: "Verification and trust",
    detail: "Protected records, secure sign in, and completion access stay tied to the learner account.",
    icon: ShieldCheck,
  },
] as const;

type AuthShellProps = {
  activeKey: "sign-in" | "sign-up" | "recovery" | "verify";
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({
  activeKey,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <section className="section-padding pb-10 pt-10 sm:pt-14">
      <div className="container-width">
        <div className="overflow-hidden rounded-[40px] border border-black/6 bg-[#171715] shadow-[0_42px_130px_-82px_rgba(17,17,17,0.92)]">
          <div className="grid lg:grid-cols-[400px_minmax(0,1fr)]">
            <div className="bg-[#171715] px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
              <p className="inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                Ruguna eLearning
              </p>
              <h1 className="font-heading mt-6 text-4xl font-bold leading-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/72 sm:text-base">
                {description}
              </p>

              <div className="mt-8 grid gap-3">
                {platformSignals.map((signal) => (
                  <div
                    key={signal.title}
                    className="rounded-[24px] border border-white/10 bg-white/6 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <signal.icon className="h-5 w-5 text-[var(--color-accent)]" />
                      </div>
                      <p className="font-heading text-xl font-bold">{signal.title}</p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/68">{signal.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#fbfbf7] px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
              <div className="flex flex-wrap gap-2">
                {shellLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex rounded-full px-4 py-2 text-sm font-semibold transition",
                      item.key === activeKey
                        ? "bg-[var(--color-ink)] text-white"
                        : "border border-[var(--color-border)] bg-white text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mx-auto mt-8 w-full max-w-3xl">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
