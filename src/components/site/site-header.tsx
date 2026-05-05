"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  ChevronDown,
  MessageSquare,
  PhoneCall,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  academicMenuGroups,
  admissionsMenuGroups,
  siteConfig,
  utilityLinks,
} from "@/data";

const primaryLinks = [
  { href: "/about", label: "About" },
  { href: "/student-life", label: "Student Life" },
  { href: "/news-events", label: "News & Events" },
  { href: "/verification", label: "Verification" },
  { href: "/contact", label: "Contact" },
];

type SessionStatusPayload = {
  authenticated?: boolean;
  destination?: string | null;
  role?: string | null;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

type HeaderNotification = {
  id: string;
  title: string;
  scope: string;
  date: string;
};

type HeaderNotificationsPayload = {
  count?: number;
  latest?: HeaderNotification[];
};

function getInitials(value: string | null | undefined) {
  const initials = (value ?? "Ruguna Learner")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "R";
}

export function SiteHeader() {
  const pathname = usePathname();
  const [dashboardDestination, setDashboardDestination] = useState<string | null>(null);
  const [sessionRole, setSessionRole] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);
  const isElearning = pathname.startsWith("/elearning");
  const isAuthed = Boolean(dashboardDestination);
  const dashboardHref =
    dashboardDestination ?? "/elearning/auth-complete?next=%2Flearn%2Fdashboard";
  const logoHref = isElearning ? "/elearning" : "/";
  const logoAlt = isElearning
    ? "Ruguna College eLearning logo"
    : "Ruguna College logo";
  const logoTitle = isElearning ? "Ruguna eLearning" : "Ruguna College";
  const logoSubtitle = isElearning ? "Online Learning" : siteConfig.motto;
  const primaryCtaHref = isElearning ? "/elearning/login" : "/apply";
  const primaryCtaLabel = isElearning ? "Sign In" : "Apply Now";

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/elearning/session-status", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: SessionStatusPayload | null) => {
        setDashboardDestination(
          payload?.authenticated ? payload.destination ?? "/learn/dashboard" : null
        );
        setSessionRole(payload?.authenticated ? payload.role ?? "student" : null);
        setProfileName(payload?.authenticated ? payload.name ?? payload.email ?? "Ruguna Learner" : null);
        setProfileAvatarUrl(payload?.authenticated ? payload.avatarUrl ?? null : null);

        if (payload?.authenticated) {
          return fetch("/api/elearning/notifications", {
            cache: "no-store",
            signal: controller.signal,
          });
        }

        setNotificationCount(0);
        setNotifications([]);
        return null;
      })
      .then((response) => (response?.ok ? response.json() : null))
      .then((payload: HeaderNotificationsPayload | null) => {
        if (!payload) return;
        setNotificationCount(payload.count ?? 0);
        setNotifications(payload.latest ?? []);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setDashboardDestination(null);
          setSessionRole(null);
          setProfileName(null);
          setProfileAvatarUrl(null);
          setNotificationCount(0);
          setNotifications([]);
        }
      });

    return () => {
      controller.abort();
    };
  }, [pathname]);

  if (isAuthed) {
    return (
      <header className="sticky top-0 z-40 bg-white shadow-[0_2px_16px_-12px_rgba(17,17,17,0.45)]">
        <div className="hidden bg-[var(--color-ink)] text-white lg:block">
          <div className="container-width grid grid-cols-[1fr_auto_1fr] items-center gap-5 px-5 py-2 text-[12px] sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 text-white/76">
              <Link href="/" className="font-medium transition hover:text-[var(--color-accent)]">
                Ruguna Website
              </Link>
              <Link href="/e-library" className="font-medium transition hover:text-[var(--color-accent)]">
                E-Library
              </Link>
              <Link href="/student-portal" className="font-medium transition hover:text-[var(--color-accent)]">
                Student Portal
              </Link>
            </div>
            <Link href={dashboardHref} className="font-bold tracking-[0.04em] text-white">
              Ruguna eLearning System
            </Link>
            <div className="flex items-center justify-end gap-4 text-white/76">
              <Link href="/learn/help" className="font-medium transition hover:text-[var(--color-accent)]">
                Help desk
              </Link>
              <Link href="/elearning/faq" className="font-medium transition hover:text-[var(--color-accent)]">
                FAQs
              </Link>
              <span>{siteConfig.email}</span>
            </div>
          </div>
        </div>

        <div className="container-width flex items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={dashboardHref}
              aria-label="Back to dashboard"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--color-soft-accent)] sm:flex"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link href="/elearning" className="flex min-w-0 items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/8 bg-white">
                <Image
                  src="/brand/ruguna-college-logo.jpeg"
                  alt="Ruguna College eLearning logo"
                  width={42}
                  height={42}
                  className="h-10 w-10 object-contain"
                />
              </span>
              <span className="min-w-0">
                <span className="font-heading block truncate text-base font-bold text-[var(--color-ink)]">
                  Ruguna eLearning
                </span>
                <span className="block truncate text-xs text-[var(--color-muted)]">
                  Ruguna College
                </span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/learn/catalog"
              aria-label="Search courses"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-[var(--color-muted)] transition hover:-translate-y-0.5 hover:text-[var(--color-ink)]"
            >
              <Search className="h-4 w-4" />
            </Link>

            <details className="group relative">
              <summary className="relative flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-black/8 bg-white text-[var(--color-muted)] transition hover:-translate-y-0.5 hover:text-[var(--color-ink)] marker:hidden">
                <Bell className="h-4 w-4" />
                {notificationCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e5484d] px-1 text-[10px] font-bold text-white">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                ) : null}
              </summary>
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(320px,calc(100vw-2rem))] rounded-[24px] border border-black/8 bg-white p-4 shadow-[0_24px_80px_-48px_rgba(17,17,17,0.65)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Notifications
                </p>
                <div className="mt-3 grid gap-2">
                  {notifications.length ? (
                    notifications.map((item) => (
                      <Link
                        key={item.id}
                        href="/learn/announcements"
                        className="rounded-2xl bg-[#f6f5ef] px-3 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-soft-accent)]"
                      >
                        {item.title}
                      </Link>
                    ))
                  ) : (
                    <p className="rounded-2xl bg-[#f6f5ef] px-3 py-2 text-sm text-[var(--color-muted)]">
                      No new learning notices.
                    </p>
                  )}
                </div>
                <Link
                  href="/learn/announcements"
                  className="mt-3 inline-flex text-sm font-bold text-[var(--color-ink)] underline-offset-4 hover:underline"
                >
                  View announcements
                </Link>
              </div>
            </details>

            <Link
              href="/learn/help"
              aria-label="Messages"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-[var(--color-muted)] transition hover:-translate-y-0.5 hover:text-[var(--color-ink)]"
            >
              <MessageSquare className="h-4 w-4" />
            </Link>

            <Link
              href="/account/settings"
              aria-label="Profile"
              className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-black/8 bg-[#f6f5ef] text-sm font-bold text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              {profileAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profileAvatarUrl} alt={`${profileName ?? "Profile"} photo`} className="h-full w-full object-cover" />
              ) : (
                getInitials(profileName)
              )}
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[rgba(252,252,252,0.92)] backdrop-blur-xl">
      <div className="hidden border-b border-white/8 bg-[var(--color-ink)] text-white lg:block">
        {isAuthed ? (
          <div className="container-width grid grid-cols-[1fr_auto_1fr] items-center gap-5 px-5 py-2.5 text-[11px] sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 text-white/72">
              <Link href="/" className="font-medium uppercase tracking-[0.1em] transition hover:text-[var(--color-accent)]">
                Ruguna Website
              </Link>
              <span className="h-3 w-px bg-white/18" aria-hidden="true" />
              <Link href="/e-library" className="font-medium uppercase tracking-[0.1em] transition hover:text-[var(--color-accent)]">
                E-Library
              </Link>
              <span className="h-3 w-px bg-white/18" aria-hidden="true" />
              <Link href={dashboardHref} className="font-medium uppercase tracking-[0.1em] transition hover:text-[var(--color-accent)]">
                Portal
              </Link>
            </div>
            <Link href={dashboardHref} className="font-semibold tracking-[0.08em] text-white">
              Ruguna eLearning System
            </Link>
            <div className="flex items-center justify-end gap-3 text-white/72">
              <Link href="/learn/help" className="font-medium transition hover:text-[var(--color-accent)]">
                Help desk
              </Link>
              <Link href="/elearning/faq" className="font-medium transition hover:text-[var(--color-accent)]">
                FAQs
              </Link>
              <span>{siteConfig.email}</span>
            </div>
          </div>
        ) : (
          <div className="container-width flex items-center justify-between gap-5 px-5 py-2.5 text-[11px] sm:px-8 lg:px-10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-white/72">
              {utilityLinks.map((item, index) => (
                <div key={`${item.href}-${item.label}`} className="flex items-center gap-3">
                  <Link
                    href={item.href}
                    className="font-medium uppercase tracking-[0.1em] transition hover:text-[var(--color-accent)]"
                  >
                    {item.label}
                  </Link>
                  {index < utilityLinks.length - 1 ? (
                    <span className="h-3 w-px bg-white/18" aria-hidden="true" />
                  ) : null}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/72">
              <span className="inline-flex items-center gap-2">
                <PhoneCall className="h-3.5 w-3.5" />
                {siteConfig.phone}
              </span>
              <span>{siteConfig.email}</span>
            </div>
          </div>
        )}
      </div>

      <div className="container-width flex items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-10">
        <Link href={logoHref} className="flex min-w-0 flex-1 items-center gap-3.5 xl:flex-none">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-[var(--color-border)] bg-white shadow-sm lg:h-16 lg:w-16">
            <Image
              src="/brand/ruguna-college-logo.jpeg"
              alt={logoAlt}
              width={58}
              height={58}
              className="h-12 w-12 object-contain lg:h-14 lg:w-14"
            />
          </div>
          <div className="min-w-0">
            <p className="font-heading truncate text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-ink)] sm:text-base">
              {logoTitle}
            </p>
            <p className="hidden truncate text-[11px] text-[var(--color-muted)] sm:block sm:text-xs">
              {logoSubtitle}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          <Link
            href="/about"
            className="text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
          >
            About
          </Link>
          <DesktopMegaMenu
            label="Academics"
            groups={academicMenuGroups}
            panelNote="Explore schools, award levels, and learning pathways."
            ctaLabel="Browse All Programs"
            ctaHref="/programs"
          />
          <DesktopMegaMenu
            label="Admissions"
            groups={admissionsMenuGroups}
            panelNote="Review requirements, fees guidance, and application steps."
            ctaLabel="Apply Now"
            ctaHref="/apply"
          />
          {primaryLinks.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          {isElearning ? (
            isAuthed ? (
              <>
                <Button asChild variant="secondary">
                  <Link href="/elearning/courses">Courses</Link>
                </Button>
                <Button asChild>
                  <Link href={dashboardHref}>Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="secondary">
                  <Link href="/elearning/register">Sign Up</Link>
                </Button>
                <Button asChild>
                  <Link href="/elearning/login">Sign In</Link>
                </Button>
              </>
            )
          ) : (
            isAuthed ? (
              <>
                <Button asChild variant="secondary">
                  <Link href={dashboardHref}>
                    {sessionRole === "finance_admin"
                      ? "Finance"
                      : sessionRole === "registrar_admin"
                        ? "Registrar"
                        : sessionRole === "instructor"
                          ? "Instructor"
                          : sessionRole === "super_admin"
                            ? "Admin"
                            : "Dashboard"}
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Intakes
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">May | Sep</p>
                </div>
                <Button asChild>
                  <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
                </Button>
              </>
            )
          )}
        </div>

        <details className="group shrink-0 xl:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white text-sm font-semibold text-[var(--color-ink)] marker:hidden">
            Menu
          </summary>
          <div className="absolute inset-x-4 top-[calc(100%+0.75rem)] rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-[0_24px_70px_-48px_rgba(17,17,17,0.8)]">
            <div className="grid gap-2 border-b border-[var(--color-border)] pb-4">
              {utilityLinks.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className="rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-border)] hover:bg-[var(--color-soft-accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              <MobileMenuGroup label="Academics" groups={academicMenuGroups} />
              <MobileMenuGroup label="Admissions" groups={admissionsMenuGroups} />
              {primaryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-border)] hover:bg-[var(--color-soft-accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-5 grid gap-3">
              {isElearning ? (
                isAuthed ? (
                  <div className="grid gap-3">
                    <Button asChild>
                      <Link href={dashboardHref}>Dashboard</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link href="/elearning/courses">Courses</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <Button asChild>
                      <Link href="/elearning/login">Sign In</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link href="/elearning/register">Sign Up</Link>
                    </Button>
                  </div>
                )
              ) : (
                <div className="grid gap-3">
                  {isAuthed ? (
                    <Button asChild variant="secondary">
                      <Link href={dashboardHref}>Dashboard</Link>
                    </Button>
                  ) : null}
                  <Button asChild>
                    <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
                  </Button>
                </div>
              )}
              <p className="text-xs leading-6 text-[var(--color-muted)]">
                {siteConfig.phone} | {siteConfig.email}
              </p>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}

type DesktopMegaMenuProps = {
  label: string;
  groups: {
    title: string;
    links: { href: string; label: string; detail?: string }[];
  }[];
  panelNote: string;
  ctaLabel: string;
  ctaHref: string;
};

function DesktopMegaMenu({
  label,
  groups,
  panelNote,
  ctaLabel,
  ctaHref,
}: DesktopMegaMenuProps) {
  return (
    <details className="group relative">
      <summary className="flex list-none cursor-pointer items-center gap-1 text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]">
        {label}
        <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
      </summary>
      <div className="absolute left-1/2 top-[calc(100%+1.1rem)] hidden w-[min(980px,calc(100vw-4rem))] -translate-x-1/2 overflow-hidden rounded-[34px] border border-[var(--color-border)] bg-white shadow-[0_40px_90px_-62px_rgba(17,17,17,0.95)] group-open:block">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="grid gap-8 p-8 lg:grid-cols-3">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {group.title}
                </p>
                <div className="mt-5 grid gap-4">
                  {group.links.map((link) => (
                    <Link
                      key={`${group.title}-${link.href}-${link.label}`}
                      href={link.href}
                      className="group/link rounded-2xl p-2 transition hover:bg-[var(--color-surface-alt)]"
                    >
                      <p className="text-sm font-semibold text-[var(--color-ink)] transition group-hover/link:text-black">
                        {link.label}
                      </p>
                      {link.detail ? (
                        <p className="mt-1 text-xs leading-6 text-[var(--color-muted)]">
                          {link.detail}
                        </p>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="accent-panel flex flex-col justify-between gap-6 p-8 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/56">{label}</p>
              <p className="font-heading mt-4 text-3xl font-bold tracking-tight">
                Clear paths to apply and study.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/72">{panelNote}</p>
            </div>
            <Button asChild size="lg" className="w-fit">
              <Link href={ctaHref}>
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </details>
  );
}

type MobileMenuGroupProps = {
  label: string;
  groups: {
    title: string;
    links: { href: string; label: string }[];
  }[];
};

function MobileMenuGroup({ label, groups }: MobileMenuGroupProps) {
  return (
    <details className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-1">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-[20px] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] marker:hidden">
        {label}
        <ChevronDown className="h-4 w-4" />
      </summary>
      <div className="grid gap-5 px-3 pb-3 pt-1">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              {group.title}
            </p>
            <div className="mt-2 grid gap-2">
              {group.links.map((link) => (
                <Link
                  key={`${group.title}-${link.href}-${link.label}`}
                  href={link.href}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[var(--color-ink)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
