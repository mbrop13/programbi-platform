import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const base = (process.argv[2] ?? "http://localhost:3093").replace(/\/$/, "");
const host = "https://www.programbi.com";
const ruta = "/datos/desempleo";
const cargar = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const [meta, catalogo, ranking] = await Promise.all([
  cargar("../../data/desempleo/meta.json"),
  cargar("../../lib/datos/regiones-catalogo.json"),
  cargar("../../data/desempleo/ranking.json"),
]);
const paginas = [
  { slug: "nacional", path: "/datos" },
  { slug: "nacional", path: ruta },
  ...catalogo.map(({ slug }) => ({ slug, path: `${ruta}/${slug}` })),
];
const limpiar = (html) => html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&")
  .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const fecha = meta.fetched_at.slice(0, 10);
const sitemaps = await fetch(`${base}/sitemap.xml`);
assert.equal(sitemaps.status, 200, "sitemap disponible");
const sitemap = await sitemaps.text();
const entradas = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entrada]) => ({
  loc: entrada.match(/<loc>(.*?)<\/loc>/)?.[1],
  lastmod: entrada.match(/<lastmod>(.*?)<\/lastmod>/)?.[1],
}));
const entradasDatos = entradas.filter(({ loc }) => loc === `${host}/datos` || loc?.startsWith(`${host}${ruta}`));
assert.equal(entradasDatos.length, paginas.length, "sitemap: conjunto de URLs del observatorio");

function enlaces(html) {
  return new Set([...html.matchAll(/href="([^"]+)"/g)].map(([, href]) => {
    try {
      const url = new URL(href, host);
      return url.origin === host ? url.pathname : "";
    } catch {
      return "";
    }
  }));
}

function obtenerScripts(html) {
  return new Set([...html.matchAll(/<script[^>]+src="([^"]+\.js(?:\?[^"]*)?)"/g)].map(([, src]) => src));
}

const get = (path) => fetch(`${base}${path}`, { redirect: "manual" });
const inicio = await get("/");
assert.equal(inicio.status, 200);
const htmlInicio = await inicio.text();
const baseJs = obtenerScripts(htmlInicio);
const formato = new Intl.NumberFormat("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const resultados = await Promise.all(paginas.map(async ({ slug, path }) => {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const title = limpiar(html.match(/<title>(.*?)<\/title>/)?.[1] ?? "");
  const description = limpiar(html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "");
  const h1 = [...html.matchAll(/<h1(?:\s[^>]*)?>(.*?)<\/h1>/gs)].map(([, contenido]) => limpiar(contenido));
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap(([, json]) => JSON.parse(json)["@graph"]);
  const dataset = schemas.find((schema) => schema["@type"] === "Dataset");
  const crumbs = schemas.find((schema) => schema["@type"] === "BreadcrumbList");
  assert.equal(canonical, `${host}${path}`, path);
  assert.equal(robots, "index, follow", path);
  assert.ok(!/noindex/i.test(response.headers.get("x-robots-tag") ?? ""), path);
  assert.ok(!/hreflang=/i.test(html), path);
  assert.ok(title.length && title.length <= 60, `${path} · title (${title.length})`);
  assert.ok(description.length >= 140 && description.length <= 155, `${path} · description (${description.length})`);
  assert.equal(h1.length, 1, path);
  assert.ok(crumbs?.itemListElement.length >= 2, path);
  for (const campo of ["distribution", "license", "isBasedOn", "dateModified", "temporalCoverage", "variableMeasured"]) {
    assert.ok(dataset?.[campo], `${path} · Dataset.${campo}`);
  }
  assert.equal(dataset.dateModified, fecha, path);
  assert.equal(dataset.temporalCoverage, `2010-02/${meta.ultimo_periodo.codigo}`, path);
  assert.equal(dataset.distribution.length, 2, path);
  if (path !== "/datos") assert.ok(schemas.some((schema) => schema["@type"] === "FAQPage"), path);
  if (path === ruta) assert.equal(schemas.find((schema) => schema["@type"] === "ItemList")?.itemListElement.length, catalogo.length);
  assert.ok(html.includes("En resumen") && html.includes(`dateTime="${fecha}"`), path);
  assert.equal(entradasDatos.find(({ loc }) => loc === canonical)?.lastmod?.slice(0, 10), fecha, path);

  const esperado = ranking.find((fila) => fila.slug === slug);
  const hero = html.match(/data-tasa-hero="([^"]+)"[^>]*>(.*?)<\/p>/s);
  const yoy = html.match(/data-yoy-hero="([^"]+)"[^>]*>(.*?)<\/(?:p|span)>/s);
  assert.equal(Number(hero?.[1]), esperado.tasa, path);
  assert.ok(limpiar(hero?.[2] ?? "").includes(formato.format(esperado.tasa)), path);
  assert.equal(Number(yoy?.[1]), esperado.yoy_pp, path);
  assert.ok(limpiar(yoy?.[2] ?? "").includes(formato.format(Math.abs(esperado.yoy_pp))), path);

  const texto = limpiar(html.match(/data-lectura-regional="[^"]*"[^>]*>(.*?)<\/div>/s)?.[1] ?? "");
  const palabras = texto.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  if (slug !== "nacional") assert.ok(palabras.length >= 250, `${path} · ${palabras.length} palabras`);
  const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  assert.ok(og, path);
  const ogLocal = new URL(og.replace(/&amp;/g, "&"));
  const imagen = await get(ogLocal.pathname + ogLocal.search);
  assert.equal(imagen.status, 200, `${path} · imagen social`);
  assert.match(imagen.headers.get("content-type") ?? "", /^image\/png/);
  const png = Buffer.from(await imagen.arrayBuffer());
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1200, 630], path);

  const jsExtra = [...obtenerScripts(html)].filter((src) => !baseJs.has(src));
  const pesos = await Promise.all(jsExtra.map(async (src) => {
    const chunk = await get(src);
    assert.equal(chunk.status, 200, src);
    return gzipSync(Buffer.from(await chunk.arrayBuffer())).length;
  }));
  return { path, title, description: description.length, h1: h1[0], canonical, robots,
    schemas: schemas.map((schema) => schema["@type"]).flat().filter((tipo) =>
      ["Dataset", "BreadcrumbList", "FAQPage", "ItemList"].includes(tipo)),
    htmlBytes: Buffer.byteLength(html), jsExtra: pesos.reduce((suma, peso) => suma + peso, 0),
    enlaces: enlaces(html), palabras: palabras.length,
    shingles: new Set(palabras.slice(0, -4).map((_, i) => palabras.slice(i, i + 5).join(" "))),
  };
}));

assert.equal(new Set(resultados.map(({ h1 }) => h1)).size, resultados.length, "H1 únicos");
const enlazadores = [{ path: "/", enlaces: enlaces(htmlInicio) }, ...resultados];
let similitud = 0;
let par = [];
for (const [i, a] of resultados.entries()) {
  assert.ok(enlazadores.some((origen) => origen.path !== a.path && origen.enlaces.has(a.path)), `Página huérfana: ${a.path}`);
  if (!a.palabras) continue;
  for (const b of resultados.slice(i + 1).filter((r) => r.palabras)) {
    const compartidos = [...a.shingles].filter((x) => b.shingles.has(x)).length;
    const jaccard = compartidos / (a.shingles.size + b.shingles.size - compartidos);
    if (jaccard > similitud) {
      similitud = jaccard;
      par = [a.path, b.path];
    }
  }
}
assert.ok(similitud < 0.6, `Similitud editorial máxima: ${similitud}`);
const variante = await get(`${ruta}?comparar=rm,biobio&a=2026-08&b=2025-08`);
assert.ok((await variante.text()).includes(`rel="canonical" href="${host}${ruta}"`));
assert.equal((await get(`${ruta}/no-existe`)).status, 404);
assert.equal((await get(`${ruta}/og/no-existe`)).status, 404);

console.log(JSON.stringify({ similitud, par, minPalabras: Math.min(...resultados.filter((r) => r.palabras).map((r) => r.palabras)),
  paginas: resultados.map(({ enlaces: salientes, shingles: segmentos, ...datos }) => ({
    ...datos, entrantes: enlazadores.filter((origen) => origen.path !== datos.path && origen.enlaces.has(datos.path)).length,
    salientes: salientes.size, segmentos: segmentos.size,
  })),
}, null, 2));
