import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const shellLinks = [
  { href: "/elearning/login", label: "Sign in", key: "sign-in" },
  { href: "/elearning/register", label: "Create account", key: "sign-up" },
] as const;

type AuthShellProps = {
  activeKey: "sign-in" | "sign-up" | "recovery" | "verify";
  title: string;
  description?: string;
  eyebrow?: string;
  children: ReactNode;
};

export function AuthShell({
  activeKey,
  title,
  description,
  eyebrow = "Ruguna eLearning",
  children,
}: AuthShellProps) {
  return (
    <section className="min-h-[calc(100vh-120px)] bg-[#f6f5ef] px-4 py-7 sm:py-10">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-7">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/elearning" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/8 bg-white shadow-[0_18px_50px_-38px_rgba(17,17,17,0.55)]">
              <Image
                src="/brand/ruguna-logo.png"
                alt="Ruguna logo"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            </span>
            <span>
              <span className="font-heading block text-xl font-bold text-[var(--color-ink)]">
                Ruguna eLearning
              </span>
              <span className="block text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Secure classroom access
              </span>
            </span>
          </Link>

          <nav className="flex w-fit rounded-full border border-black/8 bg-white p-1 shadow-[0_18px_45px_-40px_rgba(17,17,17,0.7)]">
            {shellLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  item.key === activeKey
                    ? "border border-[#e4c92e] bg-[#fde047] text-[var(--color-ink)] shadow-[0_12px_24px_-20px_rgba(17,17,17,0.7)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="mx-auto w-full max-w-[450px]">
          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              {eyebrow}
            </p>
            <h1 className="font-heading mt-3 text-3xl font-bold leading-tight text-[var(--color-ink)] sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mx-auto mt-3 max-w-[360px] text-sm leading-6 text-[var(--color-muted)]">
                {description}
              </p>
            ) : null}
          </div>

          {children}

          <div className="mt-4 text-center text-sm text-[var(--color-muted)]">
            Need help?{" "}
            <Link href="/elearning/contact" className="font-semibold text-[var(--color-ink)]">
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
