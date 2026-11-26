import type { Metadata } from "next";

import { siteConfig } from "@/data/site-config";
import { absoluteSiteUrl } from "@/lib/site-url";

const publicPageTitles = {
  "/": siteConfig.name,
  "/about": "About",
  "/academic-overview": "Academics",
  "/admissions": "Admissions",
  "/apply": "Register Study Interest",
  "/blog": "Blog & Insights",
  "/contact": "Contact",
  "/e-library": "E-Library",
  "/elearning": "E-Learning",
  "/elearning/about": "About E-Learning",
  "/elearning/categories": "Online Learning Categories",
  "/elearning/contact": "E-Learning Support",
  "/elearning/courses": "Online and Blended Courses",
  "/elearning/faq": "E-Learning FAQs",
  "/fees-funding": "Fees & Funding",
  "/news-events": "News & Events",
  "/programs": "Programmes",
  "/prospectus": "Prospectus",
  "/schools": "Schools",
  "/short-courses": "Short Courses",
  "/student-life": "Student Life",
  "/verification": "Verification",
} as const;

type PublicPagePath = keyof typeof publicPageTitles;

export const publicPagePaths = Object.keys(publicPageTitles) as PublicPagePath[];

export function publicPageMetadata(path: PublicPagePath) {
  return pageMetadata(path, publicPageTitles[path]);
}

export function pageMetadata(
  path: `/${string}`,
  title: string,
  description = siteConfig.description,
): Metadata {
  const url = absoluteSiteUrl(path);
  const shareTitle = path === "/" ? title : `${title} | ${siteConfig.shortName}`;
  const image = absoluteSiteUrl("/social-card");
  const imageAlt = "Ruguna College Vocational Training Institute, One Who Prevails";

  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: shareTitle,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}
