"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, PhoneCall } from "lucide-react";

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

export function SiteHeader() {
  const pathname = usePathname();
  const isElearning = pathname.startsWith("/elearning");
  const logoHref = isElearning ? "/elearning" : "/";
  const logoAlt = isElearning
    ? "Ruguna eLearning logo"
    : "Ruguna Vocational Training Institute logo";
  const logoTitle = isElearning ? "Ruguna eLearning" : "Ruguna";
  const logoSubtitle = isElearning ? "Online Learning Platform" : "Vocational Training Institute";
  const primaryCtaHref = isElearning ? "/elearning/login" : "/apply";
  const primaryCtaLabel = isElearning ? "Log In" : "Apply Now";

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[rgba(252,252,252,0.92)] backdrop-blur-xl">
      <div className="hidden border-b border-white/8 bg-[var(--color-ink)] text-white lg:block">
        <div className="container-width flex items-center justify-between gap-5 px-5 py-2.5 text-[11px] sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-white/72">
            {utilityLinks.map((item, index) => (
              <div key={item.href} className="flex items-center gap-3">
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
      </div>

      <div className="container-width flex items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <Link href={logoHref} className="flex min-w-0 flex-1 items-center gap-3 xl:flex-none">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
            <Image
              src="/brand/ruguna-logo.png"
              alt={logoAlt}
              width={30}
              height={30}
              className="h-7 w-7 object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="font-heading truncate text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] sm:text-sm">
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
            panelNote="Explore schools, award levels, and learning pathways shaped for modern vocational relevance."
            ctaLabel="Browse All Programs"
            ctaHref="/programs"
          />
          <DesktopMegaMenu
            label="Admissions"
            groups={admissionsMenuGroups}
            panelNote="Move from inquiry to enrollment with clear requirements, fees guidance, and a guided application journey."
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
          <div className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Intakes
            </p>
            <p className="text-sm font-semibold text-[var(--color-ink)]">Jan | May | Sep</p>
          </div>
          <Button asChild>
            <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
          </Button>
        </div>

        <details className="group shrink-0 xl:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white text-sm font-semibold text-[var(--color-ink)] marker:hidden">
            Menu
          </summary>
          <div className="absolute inset-x-4 top-[calc(100%+0.75rem)] rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-[0_24px_70px_-48px_rgba(17,17,17,0.8)]">
            <div className="grid gap-2 border-b border-[var(--color-border)] pb-4">
              {utilityLinks.map((item) => (
                <Link
                  key={item.href}
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
              <Button asChild>
                <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
              </Button>
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
                Built for clarity and confidence.
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
