#!/usr/bin/env node
/**
 * Verificador del sitemap + hreflang (WS10).
 *
 * Uso:
 *   node scripts/check-sitemap.mjs http://localhost:3107
 *   node scripts/check-sitemap.mjs https://www.programbi.com
 *   node scripts/check-sitemap.mjs http://localhost:3110 --limit 20 --timeout 180000
 *
 * Sin dependencias (Node >= 18, fetch nativo). Para cada <loc> del sitemap:
 *   - responde 200 sin redirección;
 *   - sin `noindex`; meta robots opcional (index/follow es el valor por defecto);
 *   - <link rel="canonical"> = la propia URL;
 *   - hreflang recíproco: mismo juego de alternates en todas las versiones,
 *     con `x-default` y autorreferencia;
 *   - ninguna alternate apunta a una URL fuera del sitemap, 3xx, 404 o noindex.
 *
 * `--limit N` revisa solo las primeras N URLs del sitemap (humo local sobre
 * `next dev`, que compila cada ruta). Sin `--limit` revisa todo: es el modo que
 * usa la aceptación. Con límite, las reciprocidades cuyo destino quedó fuera
 * se informan como "omitidas", no como fallo.
 * `--timeout MS` sube el timeout por request (default 15 s); en `next dev`
 * conviene 180000 porque la primera visita compila la ruta.
 *
 * Sale con código != 0 si hay cualquier fallo.
 */

const CONCURRENCIA = 6;
const TIMEOUT_DEFECTO_MS = 15_000;
const UA = "ProgramBI-Sitemap-Checker/1.0 (+https://www.programbi.com)";

const args = process.argv.slice(2);
function quitarOpcion(nombre) {
  const idx = args.findIndex((a) => a === nombre || a.startsWith(`${nombre}=`));
  if (idx < 0) return null;
  const conIgual = args[idx].includes("=");
  const valor = conIgual ? args[idx].split("=")[1] : args[idx + 1];
  args.splice(idx, conIgual ? 1 : 2);
  return valor ?? "";
}
const limiteRaw = quitarOpcion("--limit");
const timeoutRaw = quitarOpcion("--timeout");
const limite = Math.max(0, Number.parseInt(limiteRaw ?? "", 10) || 0);
const TIMEOUT_MS = Math.max(1000, Number.parseInt(timeoutRaw ?? "", 10) || TIMEOUT_DEFECTO_MS);
const BASE = (args[0] || process.env.SITEMAP_BASE_URL || "http://localhost:3000").replace(
  /\/+$/,
  ""
);

function decodeEntities(texto) {
  return texto
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&#x0*27;/gi, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function parseAttrs(tag) {
  const cuerpo = tag.replace(/^<\s*\/?\s*[a-z0-9:-]+/i, "").replace(/\/?\s*>$/, "");
  const attrs = {};
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(cuerpo))) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

function metaRobots(html, name = "robots") {
  return [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((m) => parseAttrs(m[0]))
    .filter((a) => (a.name || "").toLowerCase() === name)
    .map((a) => (a.content || "").trim());
}

function links(html, rel) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((m) => parseAttrs(m[0]))
    .filter((a) => (a.rel || "").toLowerCase().split(/\s+/).includes(rel));
}

/** Resuelve cualquier URL del sitemap contra la base que se está probando. */
function aBase(raw) {
  const u = new URL(raw, `${BASE}/`);
  return new URL(`${u.pathname}${u.search}`, `${BASE}/`).toString();
}

function normalizar(raw) {
  const u = new URL(raw);
  let pathname = u.pathname.replace(/\/+$/, "");
  if (!pathname) pathname = "/";
  return `${u.origin.toLowerCase()}${pathname}${u.search}`;
}

async function pedir(url) {
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return { status: res.status, text: await res.text(), robotsHeader: res.headers.get("x-robots-tag") || "" };
  } catch (err) {
    return { status: 0, error: err?.message || String(err) };
  }
}

async function enParalelo(items, limiteConcurrencia, fn) {
  const salida = new Array(items.length);
  let siguiente = 0;
  async function trabajador() {
    while (true) {
      const i = siguiente++;
      if (i >= items.length) return;
      salida[i] = await fn(items[i], i);
    }
  }
  const n = Math.max(1, Math.min(limiteConcurrencia, items.length));
  await Promise.all(Array.from({ length: n }, trabajador));
  return salida;
}

async function cargarSitemap(urlSitemap) {
  const res = await pedir(urlSitemap);
  if (res.status !== 200) {
    throw new Error(`No se pudo descargar ${urlSitemap}: status ${res.status}`);
  }
  const xml = res.text;
  const locs = [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((m) =>
    decodeEntities(m[1].trim())
  );
  if (/<sitemapindex\b/i.test(xml)) {
    const hijos = [];
    for (const hijo of locs) {
      const parcial = await cargarSitemap(aBase(hijo));
      hijos.push(...parcial);
    }
    return hijos;
  }
  if (!/<urlset\b/i.test(xml)) {
    throw new Error("El XML no es un <urlset> ni un <sitemapindex>.");
  }
  return locs;
}

function validarPagina(rec) {
  if (rec.error) return [`error de red: ${rec.error}`];
  if (rec.status !== 200) {
    return [
      rec.status >= 300 && rec.status < 400
        ? `status ${rec.status} (redirección)`
        : `status ${rec.status}`,
    ];
  }
  const fallos = [];
  // https://developers.google.com/search/docs/crawling-indexing/special-tags
  // The absence of this tag is index/follow, not an indexing failure.
  if (rec.robots.length > 1) {
    fallos.push(`${rec.robots.length} meta robots (debe haber como máximo 1)`);
  }
  const indexingRules = [...rec.robots, ...(rec.googlebot || []), rec.robotsHeader || ""];
  if (indexingRules.some((c) => /\b(noindex|none)\b/i.test(c))) {
    fallos.push(`noindex (${indexingRules.filter(Boolean).join(" | ")})`);
  }
  if (rec.canons.length !== 1) {
    fallos.push(`${rec.canons.length} canonical (debe haber exactamente 1)`);
  } else if (normalizar(rec.canons[0]) !== normalizar(rec.url)) {
    fallos.push(`canonical ${rec.canons[0]} ≠ ${rec.url}`);
  }
  if (rec.alternates.length > 0) {
    if (!rec.alternates.some((a) => a.lang.toLowerCase() === "x-default")) {
      fallos.push("tiene hreflang pero le falta x-default");
    }
    const propia = normalizar(rec.url);
    if (!rec.alternates.some((a) => a.href === propia)) {
      fallos.push("hreflang sin autorreferencia a la propia URL");
    }
  }
  return fallos;
}

async function main() {
  const urlSitemap = `${BASE}/sitemap.xml`;
  console.log(`Sitemap: ${urlSitemap}`);
  const locsRaw = await cargarSitemap(urlSitemap);

  const duplicadas = locsRaw.length - new Set(locsRaw).size;
  let locs = [...new Set(locsRaw)];
  if (limite > 0) locs = locs.slice(0, limite);

  const fallos = new Map();
  const agregarFallo = (url, motivo) => {
    const set = fallos.get(url) || new Set();
    set.add(motivo);
    fallos.set(url, set);
  };

  const registros = await enParalelo(locs, CONCURRENCIA, async (loc) => {
    const url = aBase(loc);
    const res = await pedir(url);
    const rec = {
      loc,
      url,
      status: res.status,
      error: res.error,
      robots: res.text ? metaRobots(res.text) : [],
      googlebot: res.text ? metaRobots(res.text, "googlebot") : [],
      robotsHeader: res.robotsHeader,
      canons: res.text ? links(res.text, "canonical").map((a) => aBase(a.href || "")) : [],
      alternates: res.text
        ? links(res.text, "alternate")
            .filter((a) => a.hreflang && a.href)
            .map((a) => ({ lang: a.hreflang.trim(), href: normalizar(aBase(a.href)) }))
        : [],
    };
    for (const motivo of validarPagina(rec)) agregarFallo(url, motivo);
    return rec;
  });

  const enSitemap = new Set(registros.map((r) => normalizar(r.url)));
  const porUrl = new Map(registros.map((r) => [normalizar(r.url), r]));

  // Alternates que apuntan fuera de la lista revisada: se descargan aparte
  // para comprobar status/robots/canonical antes de juzgar la reciprocidad.
  const pendientes = new Set();
  for (const rec of registros) {
    for (const alt of rec.alternates) {
      if (!porUrl.has(alt.href)) pendientes.add(alt.href);
    }
  }
  const extras = await enParalelo([...pendientes], CONCURRENCIA, async (url) => {
    const res = await pedir(url);
    const rec = {
      loc: url,
      url,
      status: res.status,
      error: res.error,
      robots: res.text ? metaRobots(res.text) : [],
      canons: res.text ? links(res.text, "canonical").map((a) => aBase(a.href || "")) : [],
      googlebot: res.text ? metaRobots(res.text, "googlebot") : [],
      robotsHeader: res.robotsHeader,
      alternates: res.text
        ? links(res.text, "alternate")
            .filter((a) => a.hreflang && a.href)
            .map((a) => ({ lang: a.hreflang.trim(), href: normalizar(aBase(a.href)) }))
        : [],
    };
    porUrl.set(url, rec);
    for (const motivo of validarPagina(rec)) agregarFallo(url, `alternate: ${motivo}`);
    return rec;
  });

  let omitidas = 0;
  const claves = (alts) =>
    alts
      .map((a) => `${a.lang.toLowerCase()}|${a.href}`)
      .sort()
      .join("\n");

  for (const rec of registros) {
    if (rec.alternates.length === 0) continue;
    for (const alt of rec.alternates) {
      if (!enSitemap.has(alt.href)) {
        agregarFallo(rec.url, `alternate ${alt.href} no está en el sitemap`);
        continue;
      }
      const destino = porUrl.get(alt.href);
      if (!destino) {
        omitidas += 1;
        continue;
      }
      if (destino.alternates.length === 0) {
        agregarFallo(rec.url, `alternate ${alt.href} no devuelve hreflang`);
        continue;
      }
      if (claves(destino.alternates) !== claves(rec.alternates)) {
        agregarFallo(
          rec.url,
          `hreflang no recíproco con ${alt.href}: ${destino.alternates
            .map((a) => a.lang)
            .join(", ")}`
        );
      }
    }
  }

  const total = locs.length;
  console.log(`URLs en sitemap: ${locsRaw.length} (únicas: ${new Set(locsRaw).size})`);
  console.log(`Revisadas: ${total}${limite > 0 ? ` (límite ${limite})` : ""}`);
  if (duplicadas > 0) console.log(`Duplicadas en el XML: ${duplicadas}`);
  if (extras.length > 0) console.log(`Alternates fuera del sitemap revisadas: ${extras.length}`);
  if (omitidas > 0) console.log(`Reciprocidades omitidas por el límite: ${omitidas}`);

  if (fallos.size === 0) {
    console.log(`OK: ${total} URLs sin fallos (status 200, sin noindex, canonical propio, hreflang recíproco).`);
    return 0;
  }

  let mostrados = 0;
  for (const [url, motivos] of fallos) {
    if (mostrados >= 60) break;
    console.log(`\n✗ ${url}`);
    for (const motivo of motivos) console.log(`   - ${motivo}`);
    mostrados += 1;
  }
  const restantes = fallos.size - mostrados;
  if (restantes > 0) console.log(`\n… y ${restantes} URL(s) más con fallos.`);
  console.log(`\nFALLOS: ${fallos.size} URL(s) de ${total} revisadas.`);
  return 1;
}

main()
  .then((codigo) => {
    process.exitCode = codigo;
  })
  .catch((err) => {
    console.error(`\nERROR: ${err?.message || err}`);
    process.exitCode = 1;
  });
