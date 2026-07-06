// HTML escaping helpers for server-rendered email templates and other contexts
// where user-controlled strings are interpolated into HTML markup.
//
// Background (OWASP ASVS L3 audit, A-15 / V5.4.7):
// Email templates interpolated the lead's name/company/message directly into
// the HTML body, allowing HTML/CSS injection into the rendered email. Clients
// like Gmail web render CSS, so this is more than cosmetic.

/**
 * Escape a string for safe interpolation as HTML text content or attribute value.
 */
export function escapeHtml(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escape only quotes/backticks — useful when interpolating into a quoted HTML
 * attribute the caller has already placed, or into a JS template literal.
 */
export function escapeQuotes(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;");
}
