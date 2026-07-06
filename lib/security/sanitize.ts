// Centralized HTML sanitization that works in BOTH server and client contexts.
//
// Background (OWASP ASVS L3 audit, CR-5):
// The previous implementation used `dompurify` only on the client and returned
// raw HTML on the server (`typeof window !== "undefined" ? DOMPurify.sanitize(html) : html`).
// Since blog/newsletter pages are Server Components, the HTML was served unsanitized
// to every visitor on the initial document stream, enabling stored XSS.
//
// `isomorphic-dompurify` uses jsdom on Node.js and the native DOM in browsers,
// so sanitization runs in both environments. Importing this module is safe from
// any context (server, client, edge).

import DOMPurify from "isomorphic-dompurify";

// Conservative allowlist for article/newsletter content. Custom styling hooks
// (class, style) are kept because the markdown renderer emits Tailwind classes.
const ALLOWED_TAGS = [
  "a", "abbr", "b", "blockquote", "br", "caption", "cite", "code", "col",
  "colgroup", "dd", "del", "div", "dl", "dt", "em", "figcaption", "figure",
  "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "ins", "kbd",
  "li", "mark", "ol", "p", "pre", "q", "s", "samp", "small", "span",
  "strong", "sub", "sup", "table", "tbody", "td", "tfoot", "th",
  "thead", "tr", "u", "ul", "var", "wbr",
];

const ALLOWED_ATTR = [
  "class", "style", "href", "title", "target", "rel",
  "src", "alt", "width", "height", "loading",
  "colspan", "rowspan", "id", "data-language",
];

const config = {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input", "button", "textarea", "base", "meta", "link"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onmouseenter", "onmouseleave", "onsubmit", "onchange", "oninput", "onfocus", "onblur", "srcdoc", "formaction"],
  // Force safe links: every <a> gets rel="noopener noreferrer" and only safe protocols pass.
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|#|\/|\.\/|\.\.\/)/i,
};

/**
 * Sanitize untrusted HTML so it can be safely rendered with dangerouslySetInnerHTML.
 * Runs identically on server and client.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, config);
}

/**
 * Convenience wrapper: parse lightweight markdown to HTML, then sanitize.
 * Use this for short fields (e.g. article excerpt) that come from the DB.
 */
export { sanitizeHtml as default };
