"use client";

import { useEffect } from "react";

/**
 * Ports the prototype's site.js progressive-enhancement behaviours (scroll
 * reveals, count-up stats, parallax, accordions, tabs) and applies them to the
 * server-rendered prototype markup inside `.rg` containers. Icons are already
 * inlined at build time, so this is purely enhancement — content is fully
 * visible without it.
 */
export function PrototypeRuntime() {
  useEffect(() => {
    const roots = Array.from(document.querySelectorAll<HTMLElement>(".rg"));
    if (!roots.length) return;
    const q = (sel: string) =>
      roots.flatMap((r) => Array.from(r.querySelectorAll<HTMLElement>(sel)));
    const cleanups: Array<() => void> = [];

    // ---- reveals ----
    const revEls = q(".reveal, .reveal-scale");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
      );
      revEls.forEach((e) => io.observe(e));
      cleanups.push(() => io.disconnect());
      const t = window.setTimeout(() => {
        q(".reveal:not(.in), .reveal-scale:not(.in)").forEach((e) => {
          if (e.getBoundingClientRect().top < window.innerHeight * 1.15) e.classList.add("in");
        });
      }, 800);
      cleanups.push(() => window.clearTimeout(t));
    } else {
      revEls.forEach((e) => e.classList.add("in"));
    }

    // ---- count-up ----
    const nums = q("[data-count]");
    if (nums.length && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target as HTMLElement;
            const target = parseFloat(el.getAttribute("data-count") || "0");
            const sfx = el.getAttribute("data-suffix") || "";
            const dur = 1400;
            let start: number | null = null;
            const step = (ts: number) => {
              if (!start) start = ts;
              const p = Math.min((ts - start) / dur, 1);
              const e = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.round(target * e) + sfx;
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.unobserve(el);
          });
        },
        { threshold: 0.5 }
      );
      nums.forEach((n) => io.observe(n));
      cleanups.push(() => io.disconnect());
    }

    // ---- parallax ----
    const pxEls = q("[data-parallax]");
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (pxEls.length && !reduce) {
      let ticking = false;
      const update = () => {
        const vh = window.innerHeight;
        pxEls.forEach((el) => {
          const r = el.getBoundingClientRect();
          const speed = parseFloat(el.getAttribute("data-parallax") || "0.12") || 0.12;
          const off = (r.top + r.height / 2 - vh / 2) * -speed;
          el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`;
        });
        ticking = false;
      };
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", update, { passive: true });
      update();
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", update);
      });
    }

    // ---- accordions ----
    q(".acc-q").forEach((qBtn) => {
      const handler = () => {
        const item = qBtn.closest(".acc-item");
        if (!item) return;
        const a = item.querySelector<HTMLElement>(".acc-a");
        const open = item.classList.contains("open");
        const parent = item.closest(".acc");
        if (parent) {
          parent.querySelectorAll(".acc-item.open").forEach((o) => {
            if (o !== item) {
              o.classList.remove("open");
              const oa = o.querySelector<HTMLElement>(".acc-a");
              if (oa) oa.style.maxHeight = "";
            }
          });
        }
        if (open) {
          item.classList.remove("open");
          if (a) a.style.maxHeight = "";
        } else {
          item.classList.add("open");
          if (a) a.style.maxHeight = a.scrollHeight + "px";
        }
      };
      qBtn.addEventListener("click", handler);
      cleanups.push(() => qBtn.removeEventListener("click", handler));
    });

    // ---- programme level filter (Academics: .filter-chip[data-f] -> .prog[data-level]) ----
    roots.forEach((root) => {
      const chips = Array.from(root.querySelectorAll<HTMLElement>(".filter-chip[data-f]"));
      if (!chips.length) return;
      const progs = Array.from(root.querySelectorAll<HTMLElement>(".prog[data-level]"));
      chips.forEach((chip) => {
        const handler = () => {
          chips.forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          const f = chip.getAttribute("data-f");
          progs.forEach((p) => {
            const show = f === "all" || p.getAttribute("data-level") === f;
            p.style.display = show ? "" : "none";
          });
        };
        chip.addEventListener("click", handler);
        cleanups.push(() => chip.removeEventListener("click", handler));
      });
    });

    // ---- tabs ----
    roots.forEach((root) => {
      root.querySelectorAll<HTMLElement>("[data-tabs]").forEach((group) => {
        const tabs = Array.from(group.querySelectorAll<HTMLElement>(".tab"));
        const panels = Array.from(group.querySelectorAll<HTMLElement>(".tab-panel"));
        tabs.forEach((t, i) => {
          const handler = () => {
            tabs.forEach((x) => x.classList.remove("active"));
            panels.forEach((x) => x.classList.remove("active"));
            t.classList.add("active");
            const target = t.getAttribute("data-tab");
            const panel = target
              ? group.querySelector<HTMLElement>(`.tab-panel[data-panel="${target}"]`)
              : panels[i];
            if (panel) panel.classList.add("active");
          };
          t.addEventListener("click", handler);
          cleanups.push(() => t.removeEventListener("click", handler));
        });
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
