export const productionSiteUrl = "https://ruguna.ac.ug";

export const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteOrigin = new URL(configuredSiteUrl || productionSiteUrl).origin;

export function absoluteSiteUrl(path: `/${string}`) {
  return new URL(path, siteOrigin).href;
}
