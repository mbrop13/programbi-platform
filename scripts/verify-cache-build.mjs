import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const [beforeDir, afterDir = ".next"] = process.argv.slice(2);
assert(beforeDir, "Usage: node scripts/verify-cache-build.mjs <baseline .next> [new .next]");
const manifest = (dir) => JSON.parse(fs.readFileSync(path.join(dir, "prerender-manifest.json"), "utf8"));
const before = manifest(beforeDir);
const after = manifest(afterDir);
const counts = (m) => {
  const out = {};
  for (const entry of Object.values(m.routes)) {
    const key = String(entry.initialRevalidateSeconds);
    out[key] = (out[key] || 0) + 1;
  }
  return out;
};
function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
}
function seo(html) {
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attrs(tag));
  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attrs(tag));
  return {
    title: html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "",
    description: meta.find((m) => m.name === "description")?.content ?? "",
    social: meta.filter((m) => /^(og:|twitter:)/.test(m.property || m.name || "")),
    robots: meta.filter((m) => ["robots", "googlebot"].includes(m.name)),
    canonical: links.filter((l) => l.rel === "canonical"),
    hreflang: links.filter((l) => l.hreflang || l.hrefLang).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
    h1: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()),
    jsonLd: [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])),
  };
}
const htmlFile = (dir, route) => path.join(dir, "server", "app", `${route === "/" ? "index" : route.slice(1)}.html`);
let compared = 0;
const failures = [];
const restoredArticles = [];
for (const route of Object.keys(before.routes)) {
  assert(Object.hasOwn(after.routes, route), `Previously prerendered route missing: ${route}`);
  const oldFile = htmlFile(beforeDir, route);
  const newFile = htmlFile(afterDir, route);
  if (!fs.existsSync(oldFile) || !fs.existsSync(newFile)) continue;
  const oldSeo = seo(fs.readFileSync(oldFile, "utf8"));
  const newSeo = seo(fs.readFileSync(newFile, "utf8"));
  assert(!newSeo.title.includes("Artículo no disponible"), `A transient failure was cached: ${route}`);
  if (oldSeo.title.includes("Artículo no disponible") && /^\/(blog|newsletter)\//.test(route)) {
    // The baseline build cached an outage as noindex. Accept recovery only
    // with the real article, its own canonical and no outage/noindex output.
    assert(newSeo.h1.length > 0, `Recovered article has no H1: ${route}`);
    assert.equal(newSeo.canonical[0]?.href, `https://www.programbi.com${route}`);
    assert(!newSeo.robots.some((m) => m.content.includes("noindex")));
    restoredArticles.push(route);
    compared++;
    continue;
  }
  const differences = Object.keys(oldSeo).filter((key) => {
    try { assert.deepEqual(newSeo[key], oldSeo[key]); return false; } catch { return true; }
  });
  if (differences.length) failures.push({ route, fields: differences });
  compared++;
}
assert(compared > 800, `Insufficient SEO coverage: ${compared} pages`);
assert.deepEqual(failures, [], `SEO differences: ${JSON.stringify(failures)}`);
const ttl = (route) => after.routes[route]?.initialRevalidateSeconds;
for (const [route, entry] of Object.entries(after.routes)) {
  if (/\/guias(?:\/|$)|\/versus(?:\/|$)/.test(route)) {
    assert.equal(entry.initialRevalidateSeconds, false, `Editorial route still regenerates: ${route}`);
  }
  if (/\/cursos\/[^/]+(?:\/brochure)?$/.test(route)) {
    assert.equal(entry.initialRevalidateSeconds, 86400, `Course TTL unexpected: ${route}`);
  }
}
assert.equal(ttl("/llms.txt"), false);
assert.equal(ttl("/llms-full.txt"), false);
assert.equal(ttl("/empleos/vacantes"), 60, "Job expiry freshness must remain unchanged");

const sitemapFile = (dir) => path.join(dir, "server", "app", "sitemap.xml.body");
const sitemapUrls = (dir) => [...fs.readFileSync(sitemapFile(dir), "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]).sort();
const beforeUrls = sitemapUrls(beforeDir);
const afterUrls = sitemapUrls(afterDir);
assert.deepEqual(afterUrls, beforeUrls, "Sitemap URL set changed");
const hourlyBefore = counts(before)[3600] || 0;
const hourlyAfter = counts(after)[3600] || 0;
const report = { result: "PASS", seoPagesCompared: compared, sitemapUrls: afterUrls.length,
  restoredArticles, before: counts(before), after: counts(after), hourlyRoutesRemoved: hourlyBefore - hourlyAfter };
console.log(JSON.stringify(report, null, 2));
