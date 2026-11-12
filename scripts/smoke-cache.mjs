import assert from "node:assert/strict";

const base = (process.argv[2] || "http://127.0.0.1:3113").replace(/\/$/, "");
const paths = [
  "/", "/guias", "/ar/guias/como-aprender-power-bi-en-argentina",
  "/cursos/power-bi", "/pe/cursos/power-bi",
  "/cursos/power-bi/brochure", "/pe/cursos/power-bi/brochure",
  "/precios", "/empresas", "/llms.txt", "/llms-full.txt",
];
const request = (p, options = {}) => fetch(`${base}${p}`, {
  redirect: "manual", signal: AbortSignal.timeout(30000), ...options,
});
const results = [];
for (const p of paths) {
  const first = await request(p);
  assert.equal(first.status, 200, p);
  await first.arrayBuffer();
  const second = await request(p);
  assert.equal(second.status, 200, p);
  const cacheControl = second.headers.get("cache-control") || "";
  const cache = second.headers.get("x-vercel-cache") || second.headers.get("x-nextjs-cache");
  assert(!/private|no-store/.test(cacheControl), `${p}: ${cacheControl}`);
  assert.equal(cache, "HIT", `${p}: second request must use the cache`);
  const body = await second.text();
  if (p.startsWith("/llms")) assert.match(second.headers.get("content-type"), /text\/plain/);
  else {
    assert.match(body, /<h1\b/, `${p}: missing server-rendered H1`);
    if (!p.endsWith("/brochure")) assert(!/<meta name="robots" content="[^"]*noindex/.test(body), `${p}: noindex`);
  }
  results.push({ path: p, status: second.status, cache, cacheControl });
}
const query = await request("/cursos/power-bi?para=empresas&nivel=basico");
assert.equal(query.status, 200);
assert(!/private|no-store/.test(query.headers.get("cache-control") || ""));
await query.arrayBuffer();
const missing = await request("/cursos/slug-inexistente-cache-check");
assert.equal(missing.status, 404);
await missing.arrayBuffer();
const admin = await request("/admin");
assert([307, 308].includes(admin.status));
assert(new URL(admin.headers.get("location"), base).pathname.startsWith("/login"));
await admin.arrayBuffer();
const write = await request("/api/courses/brochure", {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({}),
});
assert.equal(write.status, 403, "An anonymous caller must not be allowed to edit brochures");
await write.arrayBuffer();
console.log(JSON.stringify({ result: "PASS", base, pages: results, queryCacheable: true,
  unknownCourse: 404, protectedAdmin: admin.status, unauthorizedWrite: write.status }, null, 2));
