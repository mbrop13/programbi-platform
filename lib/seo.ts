/** Canonical host for ProgramBI marketing. Always www. */
export const SITE_URL = "https://www.programbi.com";

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Safe JSON-LD payload (escapes `<` to avoid XSS in script tags). */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const MONEY_COURSE_SLUGS = [
  "power-bi",
  "analisis-de-datos",
  "analitica-mineria",
] as const;

export const HOME_COURSE_SLUGS = [
  "power-bi",
  "analisis-de-datos",
  "analitica-mineria",
  "sql-server",
  "python",
  "analitica-financiera",
] as const;
