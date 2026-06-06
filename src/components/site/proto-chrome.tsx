"use client";

/* The prototype chrome is rendered with plain anchors to stay consistent with the
   injected prototype page content (which also uses <a>); full-page navigation is
   intentional here. */
/* eslint-disable @next/next/no-html-link-for-pages */

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* Icons (verbatim from the prototype site.js) */
const I: Record<string, string> = {
  chev: '<path d="M6 9l6 6 6-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  phone:
    '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
};
function Svg({ d, w = 13 }: { d: string; w?: number }) {
  return (
    <svg
      width={w}
      height={w}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: I[d] }}
    />
  );
}

const PHONE = "+256 700 123 456";
const EMAIL = "admissions@ruguna.ac.ug";

const UTIL = [
  { h: "/fees-funding", l: "Fees & Funding" },
  { h: "/prospectus", l: "Prospectus" },
  { h: "/blog", l: "Blog" },
  { h: "/elearning", l: "E-Learning" },
  { h: "/verification", l: "Verification" },
  { h: "/student-portal", l: "Student Portal" },
  { h: "/staff-portal", l: "Staff Portal" },
];

type MegaLink = { t: string; d?: string; href: string };
type Mega = {
  cols: { h: string; links: MegaLink[] }[];
  feature: { eb: string; title: string; body: string; cta: string; href: string; img?: string };
};

const ACADEMICS: Mega = {
  cols: [
    {
      h: "Award levels",
      links: [
        { t: "Short Courses", d: "Focused upskilling, 6–12 weeks", href: "/academics#levels" },
        { t: "Certificate", d: "Job-ready entry pathways", href: "/academics#levels" },
        { t: "Diploma", d: "Technical & supervisory depth", href: "/academics#levels" },
        { t: "Bachelor's", d: "Leadership & specialisation", href: "/academics#levels" },
      ],
    },
    {
      h: "Featured schools",
      links: [
        { t: "Digital Technology, AI & Cyber", href: "/schools" },
        { t: "Health & Allied Services", href: "/schools" },
        { t: "Engineering & Construction", href: "/schools" },
        { t: "Automotive & Mechanical", href: "/schools" },
      ],
    },
    {
      h: "Quick actions",
      links: [
        { t: "Browse all programmes", href: "/academics#programmes" },
        { t: "Explore all 13 schools", href: "/schools" },
        { t: "Compare study modes", href: "/academics#modes" },
        { t: "Speak to admissions", href: "/contact" },
      ],
    },
  ],
  feature: {
    eb: "Academics",
    title: "Thirteen schools. One standard of practice.",
    body: "Workshop, studio, clinic, and field learning mapped to real employer outcomes.",
    cta: "Browse programmes",
    href: "/academics#programmes",
    img: "/brand/home_illustration.jpg",
  },
};

const ADMISSIONS: Mega = {
  cols: [
    {
      h: "Admissions",
      links: [
        { t: "Entry requirements", d: "Documents & eligibility", href: "/admissions#requirements" },
        { t: "Apply online", d: "Start a new application", href: "/apply" },
        { t: "Fees & funding", d: "Guidance & instalments", href: "/fees-funding" },
        { t: "Verify documents", d: "Confirm certificates", href: "/verification" },
      ],
    },
    {
      h: "International students",
      links: [
        { t: "Apply from abroad", href: "/admissions#international" },
        { t: "English & equivalency", href: "/admissions#international" },
        { t: "Online & blended study", href: "/academics#modes" },
        { t: "Talk to an advisor", href: "/contact" },
      ],
    },
    {
      h: "Related",
      links: [
        { t: "Programme directory", href: "/academics#programmes" },
        { t: "Intake calendar", href: "/news-events#calendar" },
        { t: "Student life", href: "/student-life" },
        { t: "Contact admissions", href: "/contact" },
      ],
    },
  ],
  feature: {
    eb: "Admissions 2026",
    title: "Interest to enrolment in five clear steps.",
    body: "Intakes in May and September. Apply from any device, anywhere in the world.",
    cta: "Begin application",
    href: "/apply",
    img: "/brand/hero_illustration.jpg",
  },
};

const NEWS: Mega = {
  cols: [
    {
      h: "Newsroom",
      links: [
        { t: "Latest news", d: "Campus stories & updates", href: "/news-events" },
        { t: "Upcoming events", d: "Open days, webinars, showcases", href: "/news-events#calendar" },
        { t: "Intake announcements", d: "Deadlines & dates", href: "/news-events" },
      ],
    },
    {
      h: "Insights & Blog",
      links: [
        { t: "All articles", d: "Guidance & student stories", href: "/news-events" },
        { t: "Choosing a programme", href: "/news-events" },
        { t: "Studying from abroad", href: "/news-events" },
        { t: "Careers in solar energy", href: "/news-events" },
      ],
    },
    {
      h: "Quick actions",
      links: [
        { t: "Subscribe to updates", href: "/news-events" },
        { t: "Download prospectus", href: "/prospectus" },
        { t: "Visit on an open day", href: "/news-events#calendar" },
        { t: "Contact the newsroom", href: "/contact" },
      ],
    },
  ],
  feature: {
    eb: "Read & explore",
    title: "Stories, guidance, and campus life.",
    body: "Practical advice for applicants and fresh news from across the institute.",
    cta: "Open the blog",
    href: "/blog",
    img: "/brand/elearning_home_illustration.png",
  },
};

const NAV: { label: string; href: string; mega?: Mega }[] = [
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics", mega: ACADEMICS },
  { label: "Admissions", href: "/admissions", mega: ADMISSIONS },
  { label: "Student Life", href: "/student-life" },
  { label: "News & Events", href: "/news-events", mega: NEWS },
  { label: "Contact", href: "/contact" },
];

function MegaMenu({ m }: { m: Mega }) {
  return (
    <div className="mega">
      <div className="mega-grid">
        {m.cols.map((c) => (
          <div className="mega-col" key={c.h}>
            <h4>{c.h}</h4>
            {c.links.map((l) => (
              <a className="mega-link" href={l.href} key={l.t}>
                <span className="ml-t">{l.t}</span>
                {l.d ? <span className="ml-d">{l.d}</span> : null}
              </a>
            ))}
          </div>
        ))}
        <div className="mega-feature">
          <div>
            <div className="mf-eb">{m.feature.eb}</div>
            <h3>{m.feature.title}</h3>
            <p>{m.feature.body}</p>
          </div>
          {m.feature.img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="mf-illus" src={m.feature.img} alt="" />
          ) : null}
          <a className="btn btn-primary btn-sm" href={m.feature.href}>
            {m.feature.cta} <Svg d="arrow" />
          </a>
        </div>
      </div>
    </div>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function ProtoHeader() {
  const pathname = usePathname() || "/";
  const isElearning = pathname === "/elearning" || pathname.startsWith("/elearning/");
  const ctaHref = isElearning ? "/elearning/login" : "/apply";
  const ctaLabel = isElearning ? "Sign In" : "Apply Now";

  useEffect(() => {
    const header = document.getElementById("protoHeader");
    const bar = document.getElementById("protoProgress");
    const panel = document.getElementById("protoMobile");
    const burger = document.getElementById("protoBurger");
    const close = document.getElementById("protoClose");

    const onScroll = () => {
      if (header) header.classList.toggle("scrolled", window.scrollY > 20);
      if (bar) {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight || 1;
        bar.style.transform = `scaleX(${Math.min((h.scrollTop || 0) / max, 1).toFixed(4)})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const open = () => {
      panel?.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const shut = () => {
      panel?.classList.remove("open");
      document.body.style.overflow = "";
    };
    burger?.addEventListener("click", open);
    close?.addEventListener("click", shut);
    const onPanelClick = (e: Event) => {
      if ((e.target as HTMLElement).tagName === "A") shut();
    };
    panel?.addEventListener("click", onPanelClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      burger?.removeEventListener("click", open);
      close?.removeEventListener("click", shut);
      panel?.removeEventListener("click", onPanelClick);
    };
  }, []);

  const brand = (
    <a className="brand" href="/">
      <span className="mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/ruguna_logo_v2.jpeg" alt="Ruguna College" />
      </span>
      <span className="bt">
        <span className="nm">Ruguna College</span>
        <span className="sub">Vocational Training Institute</span>
      </span>
    </a>
  );

  return (
    <>
      <header className="site-header" id="protoHeader">
        <div className="utility">
          <div className="wrap">
            <div className="u-left">
              {UTIL.map((u, i) => (
                <span key={u.l} style={{ display: "inline-flex", alignItems: "center", gap: 13 }}>
                  <a href={u.h}>{u.l}</a>
                  {i < UTIL.length - 1 ? <span className="sep" /> : null}
                </span>
              ))}
            </div>
            <div className="u-right">
              <a className="u-contact" href="/contact">
                <Svg d="phone" />
                <span>{PHONE}</span>
              </a>
              <span className="sep" />
              <a className="u-contact" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="wrap">
          <div className="nav-main">
            {brand}
            <nav className="nav-links">
              {NAV.map((n) => (
                <div className={`nav-item${n.mega ? " has-mega" : ""}`} key={n.label}>
                  <a
                    className={`nav-link${isActive(pathname, n.href) ? " active" : ""}`}
                    href={n.href}
                  >
                    {n.label}
                    {n.mega ? (
                      <span className="chev">
                        <Svg d="chev" />
                      </span>
                    ) : null}
                  </a>
                  {n.mega ? <MegaMenu m={n.mega} /> : null}
                </div>
              ))}
            </nav>
            <div className="nav-cta">
              <a className="btn btn-primary btn-sm" href={ctaHref}>
                {ctaLabel} <Svg d="arrow" />
              </a>
              <button className="burger" id="protoBurger" aria-label="Open menu" type="button">
                <Svg d="menu" w={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="scroll-progress" id="protoProgress" />

      <div className="mobile-panel" id="protoMobile">
        <div className="mobile-head">
          {brand}
          <button className="burger" id="protoClose" style={{ display: "grid" }} aria-label="Close" type="button">
            <Svg d="close" w={22} />
          </button>
        </div>
        <div className="mobile-links">
          {NAV.map((n) =>
            n.mega ? (
              <details className="m-acc" key={n.label}>
                <summary className="m-acc-sum">
                  {n.label}
                  <span style={{ width: 22, height: 22, display: "grid", placeItems: "center" }}>
                    <Svg d="chev" />
                  </span>
                </summary>
                <div className="m-acc-body">
                  {n.mega.cols
                    .flatMap((c) => c.links)
                    .slice(0, 6)
                    .map((l) => (
                      <a href={l.href} key={l.t}>
                        {l.t}
                      </a>
                    ))}
                </div>
              </details>
            ) : (
              <a href={n.href} key={n.label}>
                {n.label}
              </a>
            )
          )}
        </div>
        <div className="mobile-cta">
          <a className="btn btn-primary btn-lg" href={ctaHref}>
            {ctaLabel} <Svg d="arrow" />
          </a>
          <a className="btn btn-outline btn-lg" href={isElearning ? "/elearning/register" : "/academics"}>
            {isElearning ? "Sign Up" : "Explore Programmes"}
          </a>
        </div>
        <div className="mobile-quick">
          <h5>Quick links</h5>
          <div className="mq-grid">
            {UTIL.map((u) => (
              <a href={u.h} key={u.l}>
                {u.l}
              </a>
            ))}
          </div>
          <a className="mq-contact" href={`tel:${PHONE.replace(/\s/g, "")}`}>
            <Svg d="phone" />
            <span>{PHONE}</span>
          </a>
          <a className="mq-contact" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </div>
      </div>
    </>
  );
}

const FOOT_COLS: { h: string; links: [string, string][] }[] = [
  {
    h: "Academics",
    links: [
      ["Schools", "/schools"],
      ["Programmes", "/academics#programmes"],
      ["School pages", "/schools"],
      ["Study modes", "/academics#modes"],
    ],
  },
  {
    h: "Admissions",
    links: [
      ["Requirements", "/admissions#requirements"],
      ["Apply online", "/apply"],
      ["Fees & funding", "/fees-funding"],
      ["Download prospectus", "/prospectus"],
    ],
  },
  {
    h: "Institute",
    links: [
      ["About", "/about"],
      ["Student life", "/student-life"],
      ["News & events", "/news-events"],
      ["E-Learning", "/elearning"],
      ["Verification", "/verification"],
      ["Contact", "/contact"],
    ],
  },
];

export function ProtoFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="f-brand">
            <div className="f-mark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/ruguna-college-logo.jpeg" alt="Ruguna College crest" />
              </div>
              <div className="nm">Ruguna College</div>
              <div className="mt">One Who Prevails</div>
              <p>
                Practical academic pathways, short courses, and learner support — from inquiry to
                completion, for learners across Uganda and beyond.
              </p>
            </div>
            {FOOT_COLS.map((col) => (
              <div key={col.h}>
                <h5>{col.h}</h5>
                {col.links.map(([label, href]) => (
                  <a href={href} key={label}>
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© 2026 Ruguna College. All rights reserved.</span>
            <span style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Accessibility</a>
            </span>
          </div>
        </div>
        <div className="neg-word" aria-hidden>
          RUGUNA
        </div>
      </footer>
  );
}
