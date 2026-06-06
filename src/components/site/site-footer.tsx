import Link from "next/link";

import { navItems, schools, siteConfig } from "@/data";

const footerGroups = [
  {
    title: "Explore",
    links: navItems.slice(1, 6),
  },
  {
    title: "Admissions",
    links: [
      { href: "/admissions", label: "How to apply" },
      { href: "/fees-funding", label: "Fees & funding" },
      { href: "/verification", label: "Verification" },
      { href: "/contact", label: "Speak to admissions" },
    ],
  },
  {
    title: "Top schools",
    links: schools.slice(0, 4).map((school) => ({
      href: `/schools/${school.slug}`,
      label: school.shortName,
    })),
  },
];

export function SiteFooter() {
  return (
    <footer className="section-padding pb-8">
      <div className="container-width relative overflow-hidden rounded-[36px] border border-[var(--color-border)] bg-[var(--color-ink)] px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="max-w-xl">
            <p className="eyebrow border-white/10 bg-white/6 text-white/72">{siteConfig.name}</p>
            <h2 className="font-heading mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Skills for work, enterprise, and opportunity beyond borders.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/72">
              Ruguna College supports programme discovery, admissions, learning, records,
              and career preparation from one trusted digital home.
            </p>
            <p className="mt-4 font-heading text-xl font-bold text-[var(--color-accent)]">
              {siteConfig.motto}
            </p>
            <div className="mt-8 grid gap-2 text-sm text-white/72">
              <p>{siteConfig.address}</p>
              <p>{siteConfig.phone}</p>
              <p>{siteConfig.whatsapp}</p>
              <p>{siteConfig.email}</p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="font-heading text-sm font-bold uppercase tracking-[0.22em] text-white/72">
                  {group.title}
                </h3>
                <div className="mt-5 grid gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-white transition hover:text-[var(--color-accent)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/56 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 {siteConfig.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/verification">Certificate Verification</Link>
            <Link href="/student-portal">Student Portal</Link>
            <Link href="/staff-portal">Staff Portal</Link>
          </div>
        </div>

        <span
          aria-hidden
          className="footer-wordmark pointer-events-none absolute inset-x-0 -bottom-4 z-0 text-center text-[23vw] sm:-bottom-8 sm:text-[15rem]"
        >
          RUGUNA
        </span>
      </div>
    </footer>
  );
}
