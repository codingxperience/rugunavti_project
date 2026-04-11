import type { MetadataRoute } from "next";

import { programs, schools } from "@/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ruguna.example";
  const staticRoutes = [
    "",
    "/about",
    "/schools",
    "/programs",
    "/short-courses",
    "/admissions",
    "/fees-funding",
    "/e-learning",
    "/e-library",
    "/student-life",
    "/news-events",
    "/prospectus",
    "/verification",
    "/contact",
    "/apply",
    "/student-portal",
    "/staff-portal",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })),
    ...schools.map((school) => ({
      url: `${baseUrl}/schools/${school.slug}`,
      lastModified: new Date(),
    })),
    ...programs.map((program) => ({
      url: `${baseUrl}/programs/${program.slug}`,
      lastModified: new Date(),
    })),
  ];
}
