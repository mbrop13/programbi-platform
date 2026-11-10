#!/usr/bin/env node
/**
 * check-paises.mjs — verificación de indexabilidad de las versiones por país.
 *
 * Frente WS9: los países secundarios (ec, uy, cr, do, gt, ve, bo, sv) mantienen
 * indexables su hub, /cursos, las fichas /cursos/<curso> y /empresas. Las
 * variantes thin/duplicadas declaradas en `lib/paises/indexabilidad.ts` salen
 * con `noindex, follow`, fuera del sitemap y fuera del hreflang.
 *
 * Uso:
 *   node scripts/check-paises.mjs [baseUrl] [--solo-paginas] [--rapido] [--verbose]
 *
 *   baseUrl        Por defecto http://localhost:3119 (o BASE_URL).
 *   --solo-paginas Omite las comprobaciones de sitemap y hreflang (útiles
 *                  cuando WS10 todavía no integró la lista).
 *   --rapido       Revisa 4 fichas por país en vez de las 13.
 *   --verbose      Imprime también los checks que pasan.
 *
 * Sale con código ≠ 0 si algo falla. Node puro (fetch global), sin dependencias.
 *
 * IMPORTANTE: la tabla RUTAS_NOINDEX de abajo es el espejo en JS de
 * `lib/paises/indexabilidad.ts`. Si cambia la config, actualiza ambas.
 */

const BASE = (
  process.argv.slice(2).find((arg) => !arg.startsWith("--")) ||
  process.env.BASE_URL ||
  "http://localhost:3119"
).replace(/\/+$/, "");

const SOLO_PAGINAS = process.argv.includes("--solo-paginas");
const RAPIDO = process.argv.includes("--rapido");
const VERBOSE = process.argv.includes("--verbose");

const PAISES = ["ec", "uy", "cr", "do", "gt", "ve", "bo", "sv"];

const SLUGS = [
  "analisis-de-datos",
  "copilot",
  "claude",
  "power-automate",
  "analitica-mineria",
  "ia-productividad",
  "power-bi",
  "python",
  "sql-server",
  "excel",
  "access",
  "machine-learning",
  "mercado-financiero",
];

const FICHAS_RAPIDAS = ["power-bi", "analisis-de-datos", "python", "sql-server"];

/** Espejo de RUTAS_NOINDEX_PAIS en lib/paises/indexabilidad.ts. */
const RUTAS_NOINDEX = {
  "/precios": PAISES,
  "/preguntas-frecuentes": PAISES,
  // /uy/faq tiene FAQ propia (7,1 % de similitud): se queda indexable.
  "/faq": ["ec", "cr", "do", "gt", "ve", "bo", "sv"],
  "/curso-sql-online": PAISES,
  "/curso-python": PAISES,
  "/curso-power-bi-vs-pack-adopcion": PAISES,
  // Excepciones: /ve/implementacion-power-bi (1 clic GSC) y las dos de /uy
  // (38,9 % y 38,7 % de similitud, contenido propio).
  "/implementacion-power-bi": ["ec", "cr", "do", "gt", "bo", "sv"],
  "/migrar-excel-a-power-bi": ["ec", "cr", "do", "gt", "ve", "bo", "sv"],
  "/por-que-fallan-proyectos-power-bi": PAISES,
};

/** Variantes que la regla deja indexables y hay que verificar como tales. */
const EXCEPCIONES_INDEXABLES = [
  { pais: "ve", ruta: "/implementacion-power-bi" },
  { pais: "uy", ruta: "/faq" },
  { pais: "uy", ruta: "/implementacion-power-bi" },
  { pais: "uy", ruta: "/migrar-excel-a-power-bi" },
];

// ─── utilidades HTTP/HTML ────────────────────────────────────────────────────

const TIMEOUT_MS = Number(process.env.CHECK_TIMEOUT_MS || 120000);

async function get(url) {
  const intento = async () =>
    fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "ProgramBI-check-paises/1.0" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  try {
    return await intento();
  } catch {
    // Un segundo intento: el dev server compila en la primera visita.
    return await intento();
  }
}

function etiquetas(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].map((m) => m[0]);
}

function atributo(tag, nombre) {
  const conComillas = tag.match(
    new RegExp(`${nombre}\\s*=\\s*["']([^"']*)["']`, "i")
  );
  if (conComillas) return conComillas[1];
  const sinComillas = tag.match(new RegExp(`${nombre}\\s*=\\s*([^\\s>]+)`, "i"));
  return sinComillas ? sinComillas[1] : null;
}

function robotsDe(html) {
  return etiquetas(html, "meta")
    .filter((tag) => (atributo(tag, "name") || "").toLowerCase() === "robots")
    .map((tag) => (atributo(tag, "content") || "").toLowerCase());
}

function canonicalesDe(html) {
  return etiquetas(html, "link")
    .filter((tag) => (atributo(tag, "rel") || "").toLowerCase() === "canonical")
    .map((tag) => atributo(tag, "href"))
    .filter(Boolean);
}

function alternatesDe(html) {
  return etiquetas(html, "link")
    .filter((tag) =>
      (atributo(tag, "rel") || "").toLowerCase().split(/\s+/).includes("alternate")
    )
    .map((tag) => ({
      hreflang: atributo(tag, "hreflang") || "",
      href: atributo(tag, "href") || "",
    }))
    .filter((item) => item.href);
}

function rutaDe(href, base) {
  try {
    return new URL(href, base).pathname.replace(/\/+$/, "") || "/";
  } catch {
    return null;
  }
}

function locsDelSitemap(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) =>
    m[1].replace(/&amp;/g, "&")
  );
}

// ─── checks ─────────────────────────────────────────────────────────────────

const fallos = [];
let total = 0;

function ok(mensaje) {
  total += 1;
  if (VERBOSE) console.log(`  OK   ${mensaje}`);
}

function fallo(url, mensaje) {
  total += 1;
  fallos.push(`${url} — ${mensaje}`);
  console.log(`  FAIL ${url} — ${mensaje}`);
}

/**
 * Valida una página: status, una sola meta robots, canonical propio y, si
 * corresponde, noindex + ausencia de hreflang.
 */
async function revisarPagina(pais, ruta, esperaNoindex) {
  const path = ruta === "/" ? `/${pais}` : `/${pais}${ruta}`;
  const url = `${BASE}${path}`;
  let res;
  try {
    res = await get(url);
  } catch (err) {
    fallo(url, `sin respuesta (${err?.name || "error"})`);
    return;
  }

  if (res.status !== 200) {
    fallo(url, `status ${res.status} (se esperaba 200)`);
    return;
  }

  const html = await res.text();
  const robots = robotsDe(html);

  if (robots.length !== 1) {
    fallo(url, `${robots.length} meta robots (se esperaba exactamente 1)`);
  }

  const contenidoRobots = robots.join(" | ");
  const tieneNoindex = robots.some((valor) => valor.includes("noindex"));

  if (esperaNoindex) {
    if (!tieneNoindex) fallo(url, `se esperaba noindex, follow y tiene "${contenidoRobots || "sin meta"}"`);
    else if (!robots.some((valor) => valor.includes("follow"))) fallo(url, "noindex sin follow");
    else ok(`${url} → noindex, follow`);
  } else {
    if (tieneNoindex) fallo(url, `no debería ser noindex ("${contenidoRobots}")`);
    else ok(`${url} → indexable`);
  }

  const canon = canonicalesDe(html);
  if (canon.length !== 1) {
    fallo(url, `${canon.length} canonical (se esperaba exactamente 1)`);
  } else {
    const propia = rutaDe(canon[0], BASE);
    const esperada = rutaDe(path, BASE);
    if (propia !== esperada) {
      fallo(url, `canonical "${propia}" no es la propia ("${esperada}")`);
    } else {
      ok(`${url} → canonical propio`);
    }
  }

  if (esperaNoindex) {
    const alternates = alternatesDe(html);
    if (alternates.length > 0) {
      fallo(url, `${alternates.length} hreflang en una URL noindex`);
    } else {
      ok(`${url} → sin hreflang`);
    }
  }
}

function paresNoindex() {
  const pares = [];
  for (const [ruta, paises] of Object.entries(RUTAS_NOINDEX)) {
    for (const pais of paises) {
      pares.push({ pais, ruta });
    }
  }
  return pares;
}

async function revisarPaginas() {
  console.log(`\n== Páginas por país (${PAISES.length} países) ==`);
  const slugs = RAPIDO ? FICHAS_RAPIDAS : SLUGS;

  for (const pais of PAISES) {
    console.log(`\n-- ${pais} --`);
    // Indexables: hub, listado de cursos, empresas y fichas.
    for (const ruta of ["/", "/cursos", "/empresas"]) {
      await revisarPagina(pais, ruta, false);
    }
    for (const slug of slugs) {
      await revisarPagina(pais, `/cursos/${slug}`, false);
    }
  }

  console.log(`\n== Variantes consolidadas (noindex) ==`);
  for (const { pais, ruta } of paresNoindex()) {
    await revisarPagina(pais, ruta, true);
  }

  console.log(`\n== Excepciones que se mantienen indexables ==`);
  for (const { pais, ruta } of EXCEPCIONES_INDEXABLES) {
    await revisarPagina(pais, ruta, false);
  }
}

async function revisarSitemap() {
  console.log(`\n== Sitemap ==`);
  const url = `${BASE}/sitemap.xml`;
  let res;
  try {
    res = await get(url);
  } catch (err) {
    fallo(url, `sin respuesta (${err?.name || "error"})`);
    return;
  }
  if (res.status !== 200) {
    fallo(url, `status ${res.status} (se esperaba 200)`);
    return;
  }
  const locs = locsDelSitemap(await res.text());
  if (locs.length === 0) {
    fallo(url, "sitemap sin <loc>");
    return;
  }
  console.log(`  ${locs.length} URLs en sitemap`);

  const rutasNoindex = new Set(paresNoindex().map(({ pais, ruta }) => `/${pais}${ruta}`));
  let dentro = 0;
  for (const loc of locs) {
    const ruta = rutaDe(loc, BASE);
    if (ruta && rutasNoindex.has(ruta)) {
      dentro += 1;
      if (dentro <= 15) fallo(loc, "URL noindex presente en sitemap.xml");
    }
  }
  if (dentro > 15) {
    fallos.push(
      `sitemap.xml — ${dentro - 15} URLs noindex adicionales no listadas arriba`
    );
    console.log(`  FAIL ${dentro - 15} URLs noindex adicionales en sitemap.xml`);
  }
  if (dentro === 0) ok("sitemap.xml sin URLs noindex");

  return new Set(
    paresNoindex().map(({ pais, ruta }) => rutaDe(`/${pais}${ruta}`, BASE))
  );
}

async function revisarHreflang(noindexPaths) {
  console.log(`\n== Hreflang ==`);
  const rutas = [...new Set(paresNoindex().map(({ ruta }) => ruta))];
  for (const ruta of rutas) {
    const url = `${BASE}${ruta}`;
    let res;
    try {
      res = await get(url);
    } catch (err) {
      fallo(url, `sin respuesta (${err?.name || "error"})`);
      continue;
    }
    if (res.status !== 200) {
      // La raíz puede no existir para alguna ruta (p. ej. /versus): se avisa.
      fallo(url, `status ${res.status} al comprobar hreflang desde la raíz`);
      continue;
    }
    const alternates = alternatesDe(await res.text());
    let malos = 0;
    for (const alt of alternates) {
      const destino = rutaDe(alt.href, BASE);
      if (destino && noindexPaths.has(destino)) {
        malos += 1;
        if (malos <= 10) {
          fallo(url, `hreflang "${alt.hreflang}" apunta a noindex ${destino}`);
        }
      }
    }
    if (malos > 10) {
      fallos.push(`${url} — ${malos - 10} hreflang adicionales a noindex`);
      console.log(`  FAIL ${url} — ${malos - 10} hreflang adicionales a noindex`);
    }
    if (malos === 0) ok(`${url} → hreflang sin destinos noindex`);
  }
}

// ─── main ───────────────────────────────────────────────────────────────────

(async () => {
  console.log(`check-paises: ${BASE}${SOLO_PAGINAS ? " (solo páginas)" : ""}${RAPIDO ? " (rápido)" : ""}`);
  await revisarPaginas();

  if (!SOLO_PAGINAS) {
    const noindexPaths = await revisarSitemap();
    await revisarHreflang(noindexPaths);
  }

  console.log(`\nRESUMEN: ${total} comprobaciones, ${fallos.length} fallos`);
  if (fallos.length > 0) {
    console.log("\nFallos:");
    for (const item of fallos) console.log(` - ${item}`);
    process.exitCode = 1;
  }
})();
