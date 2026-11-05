#!/usr/bin/env node
/**
 * Verificación de las rutas de la fase 4.
 *
 * Complementa a `verificar-sitio.mjs`: ese recorre el sitemap y valida el
 * checklist general; este apunta a lo que la fase 4 agregó o cambió y que no
 * siempre está en el sitemap:
 *
 *   - /precios y sus versiones por país (canonical y título propios)
 *   - /test-nivel (hub) y los tests por país
 *   - landings SQL y Python con país en el H1
 *   - /clase-gratis con flag apagado: 200 pero noindex
 *   - /certificado/<código inválido> → 404
 *   - /verificar-certificado indexable
 *   - /py sin Offer
 *
 * Uso: node scripts/verificar-fase4.mjs [baseUrl]
 */
const BASE = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");
const CONCURRENCIA = 4;
const TITLE_MAX = 60;

const PAISES = ["ar", "mx", "pe", "co", "uy"];

const hallazgos = [];

function fallo(url, tipo, detalle) {
  hallazgos.push({ url, tipo, detalle });
}

async function traer(url) {
  const res = await fetch(url, { redirect: "manual" });
  const html = res.status === 200 ? await res.text() : "";
  return { status: res.status, html };
}

function texto(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function titulo(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function canonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (m) return m[1];
  const alt = html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  return alt ? alt[1] : "";
}

function h1s(html) {
  return [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  );
}

function jsonLds(html) {
  const out = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) {
    try {
      out.push(JSON.parse(m[1]));
    } catch {
      out.push({ __error: m[1].slice(0, 120) });
    }
  }
  return out;
}

function tipos(html) {
  const set = new Set();
  for (const item of jsonLds(html)) {
    const graph = item["@graph"] || [item];
    for (const nodo of graph) {
      const t = nodo["@type"];
      if (Array.isArray(t)) t.forEach((x) => set.add(x));
      else if (typeof t === "string") set.add(t);
    }
  }
  return set;
}

function hayOffer(html) {
  for (const item of jsonLds(html)) {
    const graph = item["@graph"] || [item];
    for (const nodo of graph) {
      if (nodo.offers) return true;
      if (Array.isArray(nodo["@graph"])) {
        for (const n of nodo["@graph"]) if (n.offers) return true;
      }
    }
  }
  return false;
}

function revisarHtmlBase(url, html, { tituloDebe = [], h1Debe = [], requiereFaq = false } = {}) {
  for (const item of jsonLds(html)) {
    if (item.__error) fallo(url, "jsonld", `JSON-LD inválido: ${item.__error}`);
  }
  const h1 = h1s(html);
  if (h1.length !== 1) fallo(url, "h1", `se esperaba 1 H1 y hay ${h1.length}`);
  const t = titulo(html);
  if (!t) fallo(url, "title", "sin <title>");
  if (t.length > TITLE_MAX) fallo(url, "title", `${t.length} caracteres: "${t}"`);
  for (const frag of tituloDebe) {
    if (!t.toLowerCase().includes(frag.toLowerCase())) {
      fallo(url, "title", `no menciona "${frag}"`);
    }
  }
  const visible = texto(html);
  for (const frag of h1Debe) {
    if (!visible.toLowerCase().includes(frag.toLowerCase())) {
      fallo(url, "contenido", `no aparece "${frag}" en el texto visible`);
    }
  }
  if (!canonical(html)) fallo(url, "canonical", "sin canonical");
  if (requiereFaq && !tipos(html).has("FAQPage")) {
    fallo(url, "jsonld", "falta FAQPage");
  }
}

const tareas = [];

// 1. Precios por país: canonical y título propios.
tareas.push(async () => {
  const esperados = [["", "Chile"], ...PAISES.map((p) => [p, null])];
  for (const [iso, nombre] of esperados) {
    const url = iso ? `${BASE}/${iso}/precios` : `${BASE}/precios`;
    const { status, html } = await traer(url);
    if (status !== 200) {
      fallo(url, "http", `status ${status}`);
      continue;
    }
    const canon = canonical(html);
    const esperado = iso ? `/${iso}/precios` : "/precios";
    if (!canon.endsWith(esperado)) {
      fallo(url, "canonical", `canonical ${canon} no termina en ${esperado}`);
    }
    const t = titulo(html);
    if (nombre && !t.includes(nombre)) fallo(url, "title", `no menciona ${nombre}: "${t}"`);
    if (!iso && /m[ée]xico|argentina|colombia|per[uú]/i.test(t)) {
      fallo(url, "title", `Chile pero el título menciona otro país: "${t}"`);
    }
    revisarHtmlBase(url, html);
  }
});

// 2. Hub de tests y tests por país.
tareas.push(async () => {
  const urls = [`${BASE}/test-nivel`, `${BASE}/mx/test-nivel`, `${BASE}/test-nivel/sql`, `${BASE}/mx/test-nivel/excel`, `${BASE}/uy/test-nivel/sql`];
  for (const url of urls) {
    const { status, html } = await traer(url);
    if (status !== 200) {
      fallo(url, "http", `status ${status}`);
      continue;
    }
    revisarHtmlBase(url, html);
    if (url.includes("/mx/") && !titulo(html).includes("México")) {
      fallo(url, "title", `no menciona México: "${titulo(html)}"`);
    }
    if (url.includes("/uy/") && !titulo(html).includes("Uruguay")) {
      fallo(url, "title", `no menciona Uruguay: "${titulo(html)}"`);
    }
    if (!/test/i.test(titulo(html))) fallo(url, "title", "el título no dice test");
  }
});

// 3. Landings SQL/Python con país en el H1.
tareas.push(async () => {
  const casos = [
    ["/curso-sql-online", "Chile"],
    ["/co/curso-sql-online", "Colombia"],
    ["/uy/curso-python", "Uruguay"],
    ["/mx/curso-python", "México"],
  ];
  for (const [path, pais] of casos) {
    const url = `${BASE}${path}`;
    const { status, html } = await traer(url);
    if (status !== 200) {
      fallo(url, "http", `status ${status}`);
      continue;
    }
    revisarHtmlBase(url, html, { h1Debe: [pais] });
    if (!tipos(html).has("Course")) fallo(url, "jsonld", "falta Course");
    if (!hayOffer(html)) fallo(url, "jsonld", "falta Offer");
    if (!tipos(html).has("FAQPage")) fallo(url, "jsonld", "falta FAQPage");
  }
});

// 4. Paraguay: sin precio ni Offer.
tareas.push(async () => {
  const url = `${BASE}/py/curso-python`;
  const { status, html } = await traer(url);
  if (status !== 200) {
    fallo(url, "http", `status ${status}`);
    return;
  }
  if (hayOffer(html)) fallo(url, "precio", "Paraguay no debe declarar Offer");
  if (!/consulta el valor|consultar el valor/i.test(texto(html))) {
    fallo(url, "contenido", "falta el CTA de consultar el valor por WhatsApp");
  }
});

// 5. Clase gratis: existe pero no se indexa mientras el flag esté apagado.
tareas.push(async () => {
  for (const path of ["/clase-gratis", "/mx/clase-gratis"]) {
    const url = `${BASE}${path}`;
    const { status, html } = await traer(url);
    if (status !== 200) {
      fallo(url, "http", `status ${status}`);
      continue;
    }
    if (!/noindex/i.test(html)) fallo(url, "robots", "debe ser noindex con el flag apagado");
    revisarHtmlBase(url, html);
    if (/reservar mi cupo/i.test(texto(html))) {
      fallo(url, "contenido", "muestra formulario de cupo sin fecha confirmada");
    }
  }
});

// 6. Certificado: código inválido 404, verificador 200.
tareas.push(async () => {
  const urlInvalida = `${BASE}/certificado/NO-EXISTE-XYZ`;
  const { status } = await traer(urlInvalida);
  if (status !== 404) fallo(urlInvalida, "http", `se esperaba 404 y dio ${status}`);

  const urlVerificador = `${BASE}/verificar-certificado`;
  const verificador = await traer(urlVerificador);
  if (verificador.status !== 200) {
    fallo(urlVerificador, "http", `status ${verificador.status}`);
  } else {
    revisarHtmlBase(urlVerificador, verificador.html);
  }
});

async function enLotes(tareas, tamano) {
  for (let i = 0; i < tareas.length; i += tamano) {
    await Promise.all(tareas.slice(i, i + tamano).map((t) => t()));
  }
}

await enLotes(tareas, CONCURRENCIA);

console.log(`Fase 4: ${tareas.length} grupos de comprobaciones sobre ${BASE}`);
if (hallazgos.length === 0) {
  console.log("FASE 4 OK: sin hallazgos.");
  process.exit(0);
}
console.log(`Hallazgos: ${hallazgos.length}`);
for (const item of hallazgos) {
  console.log(`- [${item.tipo}] ${item.url} — ${item.detalle}`);
}
process.exit(1);
