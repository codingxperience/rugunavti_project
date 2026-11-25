import type { MetadataRoute } from "next";

import { elearningCourses, programs, schools } from "@/data";
import { publicPagePaths } from "@/lib/site-metadata";
import { absoluteSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...publicPagePaths,
    ...schools.map(({ slug }) => `/schools/${slug}` as const),
    ...programs.map(({ slug }) => `/programs/${slug}` as const),
    ...elearningCourses.map(({ slug }) => `/elearning/courses/${slug}` as const),
  ].map((path) => ({ url: absoluteSiteUrl(path) }));
}
