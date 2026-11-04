#!/usr/bin/env node
/**
 * Verificación final del sitio (checklist §8 del encargo de Radar).
 *
 * Recorre el sitemap de una instancia local ya construida (`next start`) y
 * comprueba, por URL: estado 200, `<title>` único y de 60 caracteres o menos,
 * un solo H1, JSON-LD parseable, enlaces wa.me con `?text=`, canonical presente,
 * y reciprocidad de hreflang. Además revisa los precios (visible vs Offer) de
 * las fichas y que no quede «Se cobra en CLP» ni `_dbg` en el HTML.
 *
 * Uso: node scripts/verificar-sitio.mjs [baseUrl]
 */
const BASE = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");
const CONCURRENCIA = 6;
const TITLE_MAX = 60;

const resultados = [];
const titulos = new Map();

function texto(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function meta(html, name) {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
    "i"
  );
  return html.match(re)?.[1] ?? html.match(alt)?.[1] ?? null;
}

function canonical(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] ?? null;
}

function alternates(html) {
  const out = {};
  const re = /<link[^>]+rel=["']alternate["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const tag = m[0];
    const hreflang = tag.match(/hreflang=["']([^"']+)["']/i)?.[1];
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
    if (hreflang && href) out[hreflang] = href;
  }
  return out;
}

function jsonLds(html) {
  const out = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      out.push(JSON.parse(m[1]));
    } catch (error) {
      out.push({ __error: String(error), __raw: m[1].slice(0, 120) });
    }
  }
  return out;
}

async function traer(url) {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "ProgramBI-verify/1.0" } });
  const body = res.status >= 200 && res.status < 400 ? await res.text() : "";
  return { status: res.status, body, location: res.headers.get("location") };
}

async function mapa(items, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCIA, items.length) }, worker));
  return out;
}

function fallo(url, tipo, detalle) {
  resultados.push({ url, tipo, detalle });
}

const sitemap = await traer(`${BASE}/sitemap.xml`);
if (sitemap.status !== 200) {
  console.error(`No pude leer el sitemap (${sitemap.status}). ¿Está corriendo next start?`);
  process.exit(2);
}
const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`Sitemap: ${urls.length} URLs\n`);

const htmlPorUrl = new Map();

await mapa(urls, async (url) => {
  const local = url.replace("https://www.programbi.com", BASE);
  let res;
  try {
    res = await traer(local);
  } catch (error) {
    fallo(url, "fetch", String(error));
    return;
  }
  if (res.status !== 200) {
    fallo(url, "status", `HTTP ${res.status}`);
    return;
  }
  const html = res.body;
  htmlPorUrl.set(url, html);

  const titulo = texto(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  if (!titulo) fallo(url, "title", "vacío");
  else {
    if (titulo.length > TITLE_MAX) fallo(url, "title", `${titulo.length} caracteres: ${titulo}`);
    if (titulos.has(titulo)) fallo(url, "title", `duplicado con ${titulos.get(titulo)}`);
    else titulos.set(titulo, url);
  }

  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1s !== 1) fallo(url, "h1", `${h1s} etiquetas H1`);

  const ld = jsonLds(html);
  for (const item of ld) {
    if (item.__error) fallo(url, "json-ld", `no parsea: ${item.__error}`);
  }

  const canon = canonical(html);
  if (!canon) fallo(url, "canonical", "ausente");

  const alternatesPagina = alternates(html);
  if (Object.keys(alternatesPagina).length > 0) {
    const self = Object.entries(alternatesPagina).find(([, href]) =>
      href.replace(/\/$/, "") === canon?.replace(/\/$/, "")
    );
    if (!self) fallo(url, "hreflang", "ningún alternate apunta al canonical propio");
  }

  for (const m of html.matchAll(/href=["'](https?:\/\/[^"']*wa\.me[^"']*)["']/gi)) {
    if (!/[?&]text=/.test(m[1])) fallo(url, "wa.me", `sin text=: ${m[1]}`);
  }

  if (/Se cobra en (CLP|pesos chilenos)/i.test(html)) fallo(url, "precio-texto", "aparece «Se cobra en CLP»");
  if (/_dbg/.test(html)) fallo(url, "debug", "aparece _dbg en el HTML");
  if (/\[PENDIENTE/i.test(html)) fallo(url, "contenido", "queda un marcador [PENDIENTE]");
});

// Reciprocidad de hreflang: cada alternate debe volver a esta URL.
let revisados = 0;
for (const [url, html] of htmlPorUrl) {
  const alternatesPagina = alternates(html);
  for (const [lang, href] of Object.entries(alternatesPagina)) {
    if (lang === "x-default") continue;
    const objetivo = href.replace("https://www.programbi.com", BASE);
    let res = htmlPorUrl.get(href);
    if (!res) {
      try {
        const traido = await traer(objetivo);
        if (traido.status !== 200) {
          fallo(url, "hreflang", `${lang} → ${href} responde ${traido.status}`);
          continue;
        }
        res = traido.body;
      } catch {
        fallo(url, "hreflang", `${lang} → ${href} no responde`);
        continue;
      }
    }
    const vuelta = alternates(res);
    const canonObjetivo = canonical(res);
    const idaVuelta =
      vuelta[Object.keys(alternatesPagina).find((k) => alternatesPagina[k] === canonical(html)) || "es-CL"];
    if (!idaVuelta || idaVuelta.replace(/\/$/, "") !== canonical(html)?.replace(/\/$/, "")) {
      // Acepta también que el alternate de vuelta incluya el canonical propio.
      const valores = Object.values(vuelta).map((v) => v.replace(/\/$/, ""));
      if (!valores.includes(canonical(html)?.replace(/\/$/, ""))) {
        fallo(url, "hreflang", `${lang} → ${href} no vuelve (${canonObjetivo})`);
      }
    }
    revisados += 1;
  }
}

// Precios: ficha visible vs JSON-LD Offer.
let fichasConOffer = 0;
for (const [url, html] of htmlPorUrl) {
  if (!/\/cursos\/[^/]+$/.test(url)) continue;
  const offers = [];
  for (const item of jsonLds(html)) {
    const graph = item["@graph"] || [item];
    for (const nodo of graph) {
      const lista = Array.isArray(nodo.offers) ? nodo.offers : nodo.offers ? [nodo.offers] : [];
      for (const offer of lista) if (typeof offer.price !== "undefined") offers.push(offer.price);
    }
  }
  if (offers.length === 0) continue;
  fichasConOffer += 1;
  const visible = texto(html);
  // Cada país formatea distinto (2.190 en Chile, 2,190 en México). Se prueban
  // los locales del sitio antes de acusar un precio que no aparece.
  const locales = [
    "es-CL", "es-MX", "es-CO", "es-AR", "es-PE", "es-UY",
    "es-BO", "es-CR", "es-EC", "es-SV", "es-GT", "es-DO", "es-VE", "en-US",
  ];
  for (const precio of offers) {
    const numero = Number(precio);
    if (!Number.isFinite(numero)) continue;
    const candidatos = new Set([String(numero)]);
    for (const locale of locales) {
      try {
        candidatos.add(numero.toLocaleString(locale));
        candidatos.add(numero.toLocaleString(locale, { maximumFractionDigits: 0 }));
      } catch {
        /* locale no soportado en este Node: se ignora */
      }
    }
    if (![...candidatos].some((valor) => visible.includes(valor))) {
      fallo(url, "precio", `Offer ${numero} no aparece en el texto visible`);
    }
  }
}

const porTipo = resultados.reduce((acc, item) => {
  acc[item.tipo] = (acc[item.tipo] || 0) + 1;
  return acc;
}, {});

console.log(`URLs revisadas: ${htmlPorUrl.size}/${urls.length}`);
console.log(`Alternates comprobados: ${revisados}`);
console.log(`Fichas con Offer: ${fichasConOffer}`);
console.log(`Títulos únicos: ${titulos.size}`);
console.log("");
if (resultados.length === 0) {
  console.log("VERIFICACIÓN OK: sin hallazgos.");
  process.exit(0);
}
console.log(`Hallazgos: ${resultados.length} (${Object.entries(porTipo).map(([k, v]) => `${k}: ${v}`).join(", ")})`);
for (const item of resultados.slice(0, 80)) {
  console.log(`- [${item.tipo}] ${item.url} — ${item.detalle}`);
}
if (resultados.length > 80) console.log(`… y ${resultados.length - 80} más`);
process.exit(1);
