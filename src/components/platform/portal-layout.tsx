"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpenText,
  CircleHelp,
  FileBadge2,
  FolderCheck,
  LayoutDashboard,
  Menu,
  PenSquare,
  ScrollText,
  Search,
  Settings2,
  UserRound,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

type PortalLayoutProps = {
  heading: string;
  caption: string;
  userName: string;
  navItems: NavItem[];
  actions?: ReactNode;
  searchHref?: string;
  searchPlaceholder?: string;
  children: ReactNode;
};

function getNavIcon(href: string, label: string) {
  if (
    href === "/student" ||
    href === "/learn/dashboard" ||
    href === "/instructor" ||
    href === "/instructor/dashboard" ||
    href === "/admin" ||
    href === "/admin/elearning" ||
    href === "/finance"
  ) {
    return LayoutDashboard;
  }

  if (href.includes("courses")) {
    return BookOpenText;
  }

  if (href.includes("certificates")) {
    return FileBadge2;
  }

  if (href.includes("announcements")) {
    return Bell;
  }

  if (href.includes("assignments") || href.includes("submissions")) {
    return PenSquare;
  }

  if (href.includes("quizzes") || href.includes("downloads")) {
    return ScrollText;
  }

  if (href.includes("profile")) {
    return UserRound;
  }

  if (href.includes("support")) {
    return CircleHelp;
  }

  if (href.includes("applications") || label.toLowerCase().includes("grading")) {
    return FolderCheck;
  }

  if (href.includes("cms")) {
    return Settings2;
  }

  if (href.includes("finance")) {
    return Wallet;
  }

  return LayoutDashboard;
}

export function PortalLayout({
  heading,
  caption,
  userName,
  navItems,
  actions,
  searchHref,
  searchPlaceholder,
  children,
}: PortalLayoutProps) {
  const pathname = usePathname();
  const supportHref = pathname.startsWith("/student")
    ? "/student/support"
    : pathname.startsWith("/learn")
      ? "/learn/help"
      : "/elearning/contact";

  return (
    <div className="min-h-screen bg-[#edece6] p-3 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[38px] border border-black/6 bg-[#fbfbf7] shadow-[0_40px_120px_-78px_rgba(17,17,17,0.5)] lg:grid lg:min-h-[calc(100vh-2.5rem)] lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="hidden border-r border-black/6 bg-[#f6f5ef] px-6 py-8 lg:flex lg:flex-col">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white">
              <Image
                src="/brand/ruguna-logo.png"
                alt="Ruguna logo"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="font-heading truncate text-xl font-bold text-[var(--color-ink)]">
                Ruguna
              </p>
              <p className="truncate text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                eLearning platform
              </p>
            </div>
          </div>

          <nav className="mt-8 grid gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = getNavIcon(item.href, item.label);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    active
                      ? "border border-black/6 bg-white text-[var(--color-ink)] shadow-[0_18px_35px_-28px_rgba(17,17,17,0.6)]"
                      : "text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-ink)]"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[28px] border border-black/6 bg-[var(--color-ink)] p-5 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/56">
              Signed in as
            </p>
            <p className="font-heading mt-3 text-xl font-bold">{userName}</p>
            <p className="mt-3 text-sm leading-7 text-white/72">
              Keep learning records, submissions, certificates, and support in one secure workspace.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                asChild
                variant="secondary"
                className="border-white/12 bg-white/8 text-white hover:bg-white/12 hover:text-white"
              >
                <Link href={supportHref}>Get support</Link>
              </Button>
              <Button asChild>
                <Link href="/">Public website</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="border-white/12 bg-white/8 text-white hover:bg-white/12 hover:text-white"
              >
                <Link href="/elearning/logout">Sign out</Link>
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-black/6 bg-white/82 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-black/6 bg-[#f6f5ef] p-2.5 lg:hidden">
                  <Menu className="h-4 w-4 text-[var(--color-ink)]" />
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                    {heading}
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">{caption}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:min-w-[520px] xl:justify-end">
                {searchHref ? (
                  <form action={searchHref} method="get" className="relative w-full sm:max-w-[320px]">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                    <Input
                      name="query"
                      placeholder={searchPlaceholder}
                      className="bg-[#f6f5ef] pl-11"
                    />
                  </form>
                ) : null}
                <div className="flex items-center gap-3">
                  {actions}
                  <div className="rounded-full border border-black/6 bg-[#f6f5ef] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
                    {userName}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
