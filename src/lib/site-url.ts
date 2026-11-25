export const productionSiteUrl = "https://ruguna.ac.ug";

export const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export function absoluteSiteUrl(path: `/${string}`) {
  return new URL(path, productionSiteUrl).href;
}
