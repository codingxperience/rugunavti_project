"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpenText,
  CalendarDays,
  CircleHelp,
  FileBadge2,
  FolderCheck,
  House,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PenSquare,
  ScrollText,
  Search,
  Settings2,
  UserRound,
  Wallet,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { PortalSignOutButton } from "@/components/platform/portal-sign-out-button";
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

  if (href.includes("program")) {
    return FolderCheck;
  }

  if (href.includes("calendar")) {
    return CalendarDays;
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

  if (href.includes("profile") || label.toLowerCase().includes("settings")) {
    return label.toLowerCase().includes("settings") ? Settings2 : UserRound;
  }

  if (href.includes("support") || href.includes("help")) {
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

function getUserInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const userInitials = getUserInitials(userName);
  const accountHref = pathname.startsWith("/learn") ? "/learn/profile" : "/elearning/contact";

  return (
    <div className="min-h-screen bg-[#edece6] p-3 sm:p-4 lg:p-5">
      <div
        className={cn(
          "relative mx-auto max-w-[1600px] overflow-hidden rounded-[38px] border border-black/6 bg-[#fbfbf7] shadow-[0_40px_120px_-78px_rgba(17,17,17,0.5)] lg:grid lg:min-h-[calc(100vh-2.5rem)]",
          sidebarCollapsed
            ? "lg:grid-cols-[112px_minmax(0,1fr)]"
            : "lg:grid-cols-[290px_minmax(0,1fr)]"
        )}
      >
        {mobileSidebarOpen ? (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/22 lg:hidden"
          />
        ) : null}

        <aside
          className={cn(
            "fixed inset-y-3 left-3 z-40 flex w-[290px] max-w-[calc(100vw-1.5rem)] flex-col rounded-[34px] border border-black/6 bg-[#f6f5ef] px-5 py-6 shadow-[0_32px_80px_-50px_rgba(17,17,17,0.45)] transition-transform duration-300 lg:static lg:inset-auto lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:rounded-none lg:border-0 lg:border-r lg:border-black/6 lg:px-6 lg:py-8 lg:shadow-none",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-[108%] lg:translate-x-0",
            sidebarCollapsed ? "lg:px-3" : "lg:px-6"
          )}
        >
          <div className={cn("flex items-center gap-3", sidebarCollapsed && "lg:justify-center")}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white">
              <Image
                src="/brand/ruguna-logo.png"
                alt="Ruguna logo"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            </div>
            <div className={cn("min-w-0", sidebarCollapsed && "lg:hidden")}>
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
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`) ||
                (item.href === "/learn/my-courses" && pathname.startsWith("/learn/course/"));
              const Icon = getNavIcon(item.href, item.label);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    sidebarCollapsed && "lg:h-11 lg:w-11 lg:self-center lg:justify-center lg:px-0",
                    active
                      ? "border border-black/6 bg-white text-[var(--color-ink)] shadow-[0_18px_35px_-28px_rgba(17,17,17,0.6)]"
                      : "text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-ink)]"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
                  <span className={cn(sidebarCollapsed && "lg:hidden")}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {sidebarCollapsed ? (
            <div className="mt-auto rounded-[26px] border border-black/6 bg-white p-2 text-[var(--color-ink)] shadow-[0_18px_40px_-32px_rgba(17,17,17,0.55)]">
              <div className="flex justify-center">
                <Link
                  href={accountHref}
                  title="Account settings"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  {userInitials}
                </Link>
              </div>
              <div className="mt-4 grid gap-2">
                <Link
                  href="/"
                  title="Public website"
                  className="flex h-10 items-center justify-center rounded-2xl border border-black/6 bg-[#f6f5ef] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <House className="h-4 w-4" />
                </Link>
                <PortalSignOutButton
                  compact
                  className="border-black/6 bg-[#f6f5ef] text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-ink)]"
                />
              </div>
            </div>
          ) : (
            <div className="mt-auto rounded-[26px] border border-black/6 bg-white p-3 shadow-[0_18px_40px_-32px_rgba(17,17,17,0.55)]">
              <div className="flex items-center gap-3">
                <Link
                  href={accountHref}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  {userInitials}
                </Link>
                <Link href={accountHref} className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[var(--color-ink)]">{userName}</p>
                  <p className="truncate text-xs text-[var(--color-muted)]">Account settings</p>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href="/"
                    title="Public website"
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/6 bg-[#f6f5ef] text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <House className="h-4 w-4" />
                  </Link>
                  <PortalSignOutButton
                    compact
                    className="border-black/6 bg-[#f6f5ef] text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-ink)]"
                  />
                </div>
              </div>
            </div>
          )}
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-black/6 bg-white/82 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Open navigation"
                  onClick={() => setMobileSidebarOpen(true)}
                  className="rounded-2xl border border-black/6 bg-[#f6f5ef] p-2.5 lg:hidden"
                >
                  <Menu className="h-4 w-4 text-[var(--color-ink)]" />
                </button>
                <button
                  type="button"
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  onClick={() => setSidebarCollapsed((value) => !value)}
                  className="hidden rounded-2xl border border-black/6 bg-[#f6f5ef] p-2.5 transition hover:bg-white lg:inline-flex"
                >
                  {sidebarCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4 text-[var(--color-ink)]" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4 text-[var(--color-ink)]" />
                  )}
                </button>
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
