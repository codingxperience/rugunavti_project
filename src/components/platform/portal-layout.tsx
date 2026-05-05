"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpenText,
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  CircleHelp,
  FileBadge2,
  FolderCheck,
  House,
  LayoutDashboard,
  Menu,
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
  userAvatarUrl?: string | null;
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
    href === "/registrar" ||
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

  if (href.includes("applications") || href.includes("records") || label.toLowerCase().includes("grading")) {
    return FolderCheck;
  }

  if (href.includes("finance") || href.includes("invoices") || href.includes("payments") || href.includes("holds")) {
    return Wallet;
  }

  if (href.includes("cms")) {
    return Settings2;
  }

  return LayoutDashboard;
}

function getUserInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "R";
}

function UserAvatar({
  name,
  avatarUrl,
  className,
}: {
  name: string;
  avatarUrl?: string | null;
  className?: string;
}) {
  const initials = getUserInitials(name);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-ink)] text-sm font-semibold text-white",
        className
      )}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={`${name} profile photo`} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}

export function PortalLayout({
  heading,
  caption,
  userName,
  userAvatarUrl,
  navItems,
  actions,
  searchHref,
  searchPlaceholder,
  children,
}: PortalLayoutProps) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const accountHref = "/account/settings";

  return (
    <div className="min-h-dvh bg-[#edece6] lg:h-dvh lg:overflow-hidden">
      <div
        className={cn(
          "relative mx-auto w-full overflow-x-hidden bg-[#fbfbf7] lg:grid lg:h-dvh lg:max-w-none lg:items-start lg:overflow-hidden",
          sidebarCollapsed ? "lg:grid-cols-[92px_minmax(0,1fr)]" : "lg:grid-cols-[188px_minmax(0,1fr)]"
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
            "fixed inset-y-2 left-2 z-40 flex w-[220px] max-w-[calc(100vw-1rem)] flex-col overflow-y-auto rounded-[32px] border border-black/6 bg-[#f6f5ef] px-4 py-4 shadow-[0_32px_80px_-50px_rgba(17,17,17,0.45)] transition-[transform,width,padding] duration-300 lg:sticky lg:top-0 lg:inset-auto lg:z-auto lg:h-dvh lg:min-h-dvh lg:w-auto lg:max-w-none lg:translate-x-0 lg:rounded-none lg:border-0 lg:px-4 lg:py-5 lg:shadow-none",
            sidebarCollapsed ? "lg:px-3" : "lg:px-4",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-[108%] lg:translate-x-0"
          )}
        >
          <div className="relative flex flex-col items-center gap-3">
            <div className="flex min-w-0 flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white">
                <Image
                  src="/brand/ruguna-college-logo.jpeg"
                  alt="Ruguna College logo"
                  width={38}
                  height={38}
                  className="h-9 w-9 object-contain"
                />
              </div>
              <div className={cn("min-w-0", sidebarCollapsed && "lg:hidden")}>
                <p className="font-heading truncate text-lg font-bold text-[var(--color-ink)]">
                  Ruguna College
                </p>
                <p className="truncate text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  One Who Prevails
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-5 grid content-start gap-2">
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
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "group flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-center text-[11px] font-semibold leading-tight transition",
                    sidebarCollapsed && "lg:min-h-14 lg:px-1 lg:py-2",
                    active
                      ? "border border-black/6 bg-white text-[var(--color-ink)] shadow-[0_18px_35px_-28px_rgba(17,17,17,0.6)]"
                      : "text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-ink)]"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
                  <span className={cn("max-w-full text-center", sidebarCollapsed && "lg:hidden")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto grid gap-3 pt-4">
            <button
              type="button"
              aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
              onClick={() => setSidebarCollapsed((current) => !current)}
              className="hidden h-11 items-center justify-center rounded-2xl bg-white text-[var(--color-ink)] shadow-[0_18px_35px_-30px_rgba(17,17,17,0.55)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)] lg:flex"
            >
              {sidebarCollapsed ? (
                <ChevronsRight className="h-4 w-4" />
              ) : (
                <ChevronsLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          <div
            className={cn(
              "mt-3 shrink-0 rounded-[26px] bg-white p-2 shadow-[0_18px_40px_-32px_rgba(17,17,17,0.55)]",
              sidebarCollapsed && "lg:rounded-3xl lg:p-1.5"
            )}
          >
            <div className="grid gap-2">
              <Link
                href={accountHref}
                className="flex flex-col items-center gap-2 rounded-2xl px-2 py-2 text-center transition hover:-translate-y-0.5 hover:bg-[#f6f5ef]"
              >
                <UserAvatar name={userName} avatarUrl={userAvatarUrl} className="h-12 w-12" />
                <span className={cn("max-w-full truncate text-xs font-bold text-[var(--color-ink)]", sidebarCollapsed && "lg:hidden")}>
                  {userName}
                </span>
              </Link>
              <div className={cn("grid grid-cols-2 gap-2", sidebarCollapsed && "lg:grid-cols-1")}>
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
        </aside>

        <div className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden lg:h-dvh lg:overflow-y-auto">
          <header className="sticky top-0 z-20 bg-white/58 px-4 py-2 shadow-[0_1px_0_rgba(17,17,17,0.045)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/52 sm:px-5 lg:px-6">
            <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Open navigation"
                  onClick={() => setMobileSidebarOpen(true)}
                  className="rounded-2xl border border-black/6 bg-[#f6f5ef] p-2.5 lg:hidden"
                >
                  <Menu className="h-4 w-4 text-[var(--color-ink)]" />
                </button>
                <div>
                  <p className="font-heading text-lg font-bold leading-tight text-[var(--color-ink)]">
                    {heading}
                  </p>
                  <p className="max-w-xl text-xs leading-5 text-[var(--color-muted)]">{caption}</p>
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center xl:min-w-[500px] xl:justify-end">
                {searchHref ? (
                  <form action={searchHref} method="get" className="relative w-full sm:max-w-[300px]">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                    <Input
                      name="query"
                      placeholder={searchPlaceholder}
                      className="h-10 bg-[#f6f5ef] pl-11"
                    />
                  </form>
                ) : null}
                <div className="flex items-center gap-3">
                  {actions}
                  <Link
                    href={accountHref}
                    className="flex items-center gap-2 rounded-full border border-black/6 bg-[#f6f5ef] py-1 pl-1 pr-3 text-sm font-semibold text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <UserAvatar name={userName} avatarUrl={userAvatarUrl} className="h-7 w-7 text-xs" />
                    <span className="max-w-[180px] truncate">{userName}</span>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
