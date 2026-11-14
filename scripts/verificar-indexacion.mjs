#!/usr/bin/env node
/**
 * WS11 · Verificador de indexación de ProgramBI.
 *
 * Uso:
 *   node scripts/verificar-indexacion.mjs [baseUrl] [--solo-fallos] [--estricto-robots]
 *   node scripts/verificar-indexacion.mjs --self-check
 *
 * `baseUrl` por defecto es http://localhost:3107 (next start local). También
 * acepta https://www.programbi.com para sacar una foto del sitio publicado.
 * `--solo-fallos` oculta las filas OK de la tabla del sitemap.
 * `--estricto-robots` exige exactamente 1 meta robots en cada URL del sitemap;
 * por defecto 0 metas se acepta como `index, follow` (default de Next).
 * `--self-check` valida los parsers contra HTML sintético, sin red ni servidor.
 *
 * Qué valida:
 *   1. Todas las URLs del sitemap: 200 sin redirect, sin noindex ni metas
 *      robots duplicadas (0 metas = index por defecto; `--estricto-robots`
 *      exige exactamente 1), canonical propio, hreflang recíproco con
 *      x-default, JSON-LD parseable, Person en profesores, Course en fichas
 *      y cero LocalBusiness.
 *   2. Lista fija del encargo (§1): profesores, 404 legacy, redirects de
 *      Shopify/WordPress, Power BI dual, /pago, test-nivel por país, blog,
 *      newsletter y precios de Paraguay.
 *   3. Similitud de países prioritarios (shingles de 5 palabras, Jaccard)
 *      contra la versión chilena de la misma ruta.
 *   4. Enlaces internos desde / y /cursos hacia las páginas «descubiertas».
 *
 * Salida: tablas por bloque + resumen. Exit code 1 si falla cualquier check.
 * Sin dependencias: solo Node (fetch nativo, Node >= 18).
 */

const RAW_BASE = process.argv.slice(2).find((arg) => !arg.startsWith("--")) || "http://localhost:3107";
const SOLO_FALLOS = process.argv.includes("--solo-fallos");
const SELF_CHECK = process.argv.includes("--self-check");
const ROBOTS_ESTRICTO = process.argv.includes("--estricto-robots");
const BASE = normalizarBase(RAW_BASE);
const BASE_URL = new URL(BASE);
const SITE_HOSTS = new Set(["www.programbi.com", "programbi.com"]);
const TIMEOUT_MS = 15_000;
const REINTENTOS = 1;
const CONCURRENCIA = 6;
const UMBRAL_SIMILITUD = 50;

const RUTAS_DESCUBIERTAS = [
  "/cursos/machine-learning",
  "/cursos/mercado-financiero",
  "/glosario",
  "/empleos/para-empresas",
  "/empleos/talento",
  "/empleos/vacantes",
];

const PAISES_SIMILITUD = ["pe", "mx", "ar", "co"];
const RUTAS_SIMILITUD = [
  "/cursos/power-bi",
  "/cursos/analisis-de-datos",
  "/cursos/python",
  "/empresas",
  "/precios",
];

// ---------------------------------------------------------------------------
// Utilidades generales
// ---------------------------------------------------------------------------

function normalizarBase(raw) {
  const conEsquema = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;
  const url = new URL(conEsquema);
  url.hash = "";
  url.search = "";
  return url.href.replace(/\/+$/, "");
}

function dormir(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function truncar(texto, ancho) {
  const valor = String(texto ?? "");
  return valor.length <= ancho ? valor : `${valor.slice(0, Math.max(0, ancho - 1))}…`;
}

function imprimirTabla(encabezados, filas, anchos) {
  const linea = (celdas) =>
    celdas
      .map((celda, i) => truncar(celda, anchos[i]).padEnd(anchos[i]))
      .join("  ");
  console.log(linea(encabezados));
  console.log(anchos.map((ancho) => "-".repeat(ancho)).join("  "));
  for (const fila of filas) console.log(linea(fila));
}

function esHostDelSitio(host) {
  return host === BASE_URL.host || SITE_HOSTS.has(host);
}

/** Reescribe URLs de producción al host base cuando se verifica en local. */
function urlDeFetch(valor) {
  const url = new URL(valor, `${BASE}/`);
  url.hash = "";
  if (url.host !== BASE_URL.host && esHostDelSitio(url.host)) {
    return new URL(`${url.pathname}${url.search}`, `${BASE}/`).href;
  }
  return url.href;
}

/** Ruta normalizada (sin slash final, sin query) para comparar páginas. */
function clavePagina(valor) {
  try {
    const url = new URL(valor, `${BASE}/`);
    const path = url.pathname.replace(/\/+$/, "");
    return path === "" ? "/" : path;
  } catch {
    return null;
  }
}

function claveCanonica(valor) {
  try {
    const url = new URL(valor, `${BASE}/`);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    return `${path}${url.search}`;
  } catch {
    return null;
  }
}

function decodificarHtml(texto) {
  const entidades = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    hellip: "…",
    mdash: "—",
    ndash: "–",
    laquo: "«",
    raquo: "»",
  };
  return texto.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (completo, codigo) => {
    if (codigo[0] === "#") {
      const hex = codigo[1]?.toLowerCase() === "x";
      const numero = Number.parseInt(codigo.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(numero) ? String.fromCodePoint(numero) : completo;
    }
    return entidades[codigo.toLowerCase()] ?? completo;
  });
}

function parsearAtributos(etiqueta) {
  const atributos = {};
  const cuerpo = etiqueta
    .replace(/^<\s*[a-z0-9:-]+\b/i, "")
    .replace(/\/?>\s*$/, "");
  const re = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;
  while ((match = re.exec(cuerpo))) {
    const nombre = match[1].toLowerCase();
    if (!nombre || nombre in atributos) continue;
    atributos[nombre] = decodificarHtml(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return atributos;
}

function extraerEtiquetas(html, nombre) {
  const re = new RegExp(`<${nombre}\\b[^>]*>`, "gi");
  return html.match(re) ?? [];
}

function listaTokens(valor) {
  return String(valor ?? "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function metasRobots(html) {
  return extraerEtiquetas(html, "meta")
    .map(parsearAtributos)
    .filter((atributos) => (atributos.name ?? "").toLowerCase() === "robots");
}

function tokensRobots(contenido) {
  return String(contenido ?? "")
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);
}

function tieneNoindex(html) {
  return metasRobots(html).some((meta) => tokensRobots(meta.content).includes("noindex"));
}

function canonicals(html) {
  return extraerEtiquetas(html, "link")
    .map(parsearAtributos)
    .filter((atributos) => listaTokens(atributos.rel).includes("canonical"));
}

function alternates(html) {
  return extraerEtiquetas(html, "link")
    .map(parsearAtributos)
    .filter(
      (atributos) =>
        listaTokens(atributos.rel).includes("alternate") && Boolean(atributos.hreflang)
    )
    .map((atributos) => ({
      hreflang: String(atributos.hreflang).toLowerCase(),
      href: atributos.href ?? "",
    }));
}

function bloquesJsonLd(html) {
  const re = /<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const bloques = [];
  let match;
  while ((match = re.exec(html))) bloques.push(match[1]);
  return bloques;
}

function parsearJsonLd(html) {
  const bloques = bloquesJsonLd(html);
  const objetos = [];
  const errores = [];
  for (const bloque of bloques) {
    try {
      objetos.push(JSON.parse(bloque));
    } catch (error) {
      errores.push(`JSON-LD inválido: ${error.message}`);
    }
  }
  return { bloques, objetos, errores };
}

function acumularTipos(valor, tipos) {
  if (Array.isArray(valor)) {
    for (const item of valor) acumularTipos(item, tipos);
    return;
  }
  if (!valor || typeof valor !== "object") return;
  const tipo = valor["@type"];
  if (typeof tipo === "string") tipos.add(tipo);
  else if (Array.isArray(tipo)) {
    for (const item of tipo) if (typeof item === "string") tipos.add(item);
  }
  for (const [clave, hijo] of Object.entries(valor)) {
    if (clave === "@context") continue;
    acumularTipos(hijo, tipos);
  }
}

function tiposJsonLd(html) {
  const tipos = new Set();
  const { objetos, errores } = parsearJsonLd(html);
  for (const objeto of objetos) acumularTipos(objeto, tipos);
  return { tipos, errores };
}

function esProfesor(path) {
  return path === "/profesores" || path.startsWith("/profesores/");
}

function esFichaCurso(path) {
  return /^\/(?:[a-z]{2}\/)?cursos\/[^/]+$/.test(path);
}

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

const cacheFetch = new Map();

async function pedir(url) {
  let ultimoError = "";
  for (let intento = 0; intento <= REINTENTOS; intento++) {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS);
    try {
      const respuesta = await fetch(url, {
        redirect: "manual",
        signal: controlador.signal,
        headers: {
          "user-agent": "ProgramBI-SEO-Verifier/1.0 (+https://www.programbi.com)",
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        },
      });
      const cuerpo = await respuesta.text();
      if ((respuesta.status >= 500 || respuesta.status === 429) && intento < REINTENTOS) {
        ultimoError = `HTTP ${respuesta.status}`;
        await dormir(500 * (intento + 1));
        continue;
      }
      return {
        ok: true,
        status: respuesta.status,
        headers: respuesta.headers,
        body: cuerpo,
        url,
      };
    } catch (error) {
      ultimoError =
        error?.name === "AbortError"
          ? `timeout de ${TIMEOUT_MS / 1000} s`
          : error?.message || String(error);
      if (intento < REINTENTOS) await dormir(400);
    } finally {
      clearTimeout(temporizador);
    }
  }
  return {
    ok: false,
    status: 0,
    headers: new Headers(),
    body: "",
    url,
    error: ultimoError || "sin respuesta",
  };
}

/** Cachea por URL resuelta: el sitemap y las páginas fijas comparten descargas. */
function obtener(valor) {
  const url = urlDeFetch(valor);
  if (!cacheFetch.has(url)) cacheFetch.set(url, pedir(url));
  return cacheFetch.get(url);
}

async function mapaLimitado(items, limite, fn) {
  const resultados = new Array(items.length);
  let indice = 0;
  const trabajadores = Array.from({ length: Math.min(limite, items.length) }, async () => {
    while (true) {
      const actual = indice++;
      if (actual >= items.length) return;
      resultados[actual] = await fn(items[actual], actual);
    }
  });
  await Promise.all(trabajadores);
  return resultados;
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

function extraerLocs(xml) {
  const locs = [];
  const re = /<loc>\s*([\s\S]*?)\s*<\/loc>/gi;
  let match;
  while ((match = re.exec(xml))) {
    const valor = decodificarHtml(match[1].trim());
    if (valor) locs.push(valor);
  }
  return [...new Set(locs)];
}

async function leerSitemap() {
  const errores = [];
  const raiz = await obtener("/sitemap.xml");
  if (!raiz.ok) return { urls: [], errores: [`sitemap.xml sin respuesta: ${raiz.error}`] };
  if (raiz.status !== 200) {
    return { urls: [], errores: [`sitemap.xml status ${raiz.status} (esperado 200)`] };
  }

  if (/<sitemapindex\b/i.test(raiz.body)) {
    const hijos = extraerLocs(raiz.body);
    const urls = [];
    for (const hijo of hijos) {
      const respuesta = await obtener(hijo);
      if (!respuesta.ok || respuesta.status !== 200) {
        errores.push(
          `sitemap hijo ${hijo}: ${respuesta.ok ? `status ${respuesta.status}` : respuesta.error}`
        );
        continue;
      }
      urls.push(...extraerLocs(respuesta.body));
    }
    return { urls: [...new Set(urls)], errores };
  }

  return { urls: extraerLocs(raiz.body), errores };
}

function filaSitemap(base) {
  return {
    ...base,
    hreflang: "—",
    errores: [...(base.errores ?? [])],
  };
}

async function revisarPaginaSitemap(url) {
  const path = clavePagina(url);
  const respuesta = await obtener(path);
  const fila = filaSitemap({
    path,
    status: respuesta.ok ? String(respuesta.status) : "ERROR",
    robots: "—",
    canonical: "—",
    jsonld: "—",
    schema: "—",
    respuesta,
  });

  if (!respuesta.ok) {
    fila.errores.push(`sin respuesta: ${respuesta.error}`);
    return fila;
  }
  if (respuesta.status !== 200) {
    const location = respuesta.headers.get("location");
    fila.errores.push(
      `status ${respuesta.status}${location ? ` → ${location}` : ""} (esperado 200 sin redirect)`
    );
  }

  const robots = metasRobots(respuesta.body);
  // 0 metas equivale a `index, follow` (default de Next): se acepta salvo
  // `--estricto-robots`. Lo que nunca se acepta es un noindex ni dos metas
  // que se contradigan (el bug de `/clase-gratis` antes de WS4).
  fila.robots = robots.length === 0 ? "0 (def)" : String(robots.length);
  if (robots.length > 1) {
    fila.errores.push(`meta robots: ${robots.length} (máximo 1)`);
  } else if (robots.length === 0 && ROBOTS_ESTRICTO) {
    fila.errores.push("meta robots: 0 (se esperaba exactamente 1)");
  }
  if (robots.some((meta) => tokensRobots(meta.content).includes("noindex"))) {
    fila.errores.push(`robots contiene noindex (${robots.map((m) => m.content).join(" | ")})`);
  }

  const canon = canonicals(respuesta.body);
  if (canon.length !== 1) {
    fila.errores.push(`canonical: ${canon.length} (se esperaba exactamente 1)`);
  } else {
    const destino = claveCanonica(canon[0].href);
    fila.canonical = destino ?? "inválido";
    const host = (() => {
      try {
        return new URL(canon[0].href, `${BASE}/`).host;
      } catch {
        return null;
      }
    })();
    if (destino !== claveCanonica(path)) {
      fila.errores.push(`canonical → ${destino ?? "inválido"} (propia: ${path})`);
    }
    if (!host || !esHostDelSitio(host)) {
      fila.errores.push(`canonical con host ajeno: ${host ?? "inválido"}`);
    }
  }

  const ld = parsearJsonLd(respuesta.body);
  fila.jsonld = ld.errores.length ? `${ld.errores.length} error(es)` : `${ld.bloques.length} OK`;
  for (const error of ld.errores) fila.errores.push(error);

  const tipos = new Set();
  for (const objeto of ld.objetos) acumularTipos(objeto, tipos);
  const interesantes = ["Person", "ProfilePage", "Course", "LocalBusiness", "Organization"].filter(
    (tipo) => tipos.has(tipo)
  );
  fila.schema = interesantes.length ? interesantes.join(",") : "—";

  if (tipos.has("LocalBusiness")) fila.errores.push("LocalBusiness prohibido en el sitio");
  if (esProfesor(path)) {
    if (!tipos.has("Person")) fila.errores.push("falta Person en profesor");
    if (path !== "/profesores" && !tipos.has("ProfilePage")) {
      fila.errores.push("falta ProfilePage en ficha de profesor");
    }
  }
  if (esFichaCurso(path) && !tipos.has("Course")) {
    fila.errores.push("falta Course en ficha de curso");
  }

  return fila;
}

async function revisarHreflang(filas) {
  const porPath = new Map();
  for (const fila of filas) {
    if (fila.respuesta?.ok && fila.respuesta.status === 200) {
      porPath.set(fila.path, fila.respuesta);
    }
  }

  for (const fila of filas) {
    if (!fila.respuesta?.ok || fila.respuesta.status !== 200) continue;
    const alts = alternates(fila.respuesta.body);
    if (alts.length === 0) continue;

    const errores = [];
    const destinos = new Map();
    for (const alt of alts) {
      if (!alt.href) {
        errores.push(`hreflang ${alt.hreflang} sin href`);
        continue;
      }
      const destino = clavePagina(alt.href);
      if (!destino) {
        errores.push(`hreflang ${alt.hreflang} con href inválido`);
        continue;
      }
      if (destino === fila.path) continue;
      if (!destinos.has(destino)) destinos.set(destino, new Set());
      destinos.get(destino).add(alt.hreflang);
    }

    if (!alts.some((alt) => alt.hreflang === "x-default")) {
      errores.push("alternates sin x-default");
    }

    for (const [destino, idiomas] of destinos) {
      let respuestaDestino = porPath.get(destino);
      if (!respuestaDestino) {
        const descargada = await obtener(destino);
        if (descargada.ok && descargada.status === 200) respuestaDestino = descargada;
      }
      if (!respuestaDestino) {
        errores.push(`${[...idiomas].join("/")} → ${destino}: no responde 200`);
        continue;
      }
      const altsDestino = alternates(respuestaDestino.body);
      const reciproco = altsDestino.some((alt) => clavePagina(alt.href) === fila.path);
      if (!reciproco) {
        errores.push(`${[...idiomas].join("/")} → ${destino}: hreflang no recíproco`);
      }
      if (altsDestino.length && !altsDestino.some((alt) => alt.hreflang === "x-default")) {
        errores.push(`${destino}: alternates sin x-default`);
      }
    }

    if (errores.length) {
      fila.errores.push(...errores);
      fila.hreflang = errores[0];
    } else {
      fila.hreflang = `${destinos.size} recíprocos`;
    }
  }
}

async function bloqueSitemap() {
  console.log("\n[1] SITEMAP — status, robots, canonical, hreflang, JSON-LD y schema");
  const { urls, errores: erroresSitemap } = await leerSitemap();
  if (!urls.length) {
    for (const error of erroresSitemap) console.log(`  ✗ ${error}`);
    return { ok: 0, fallos: Math.max(1, erroresSitemap.length), total: 0 };
  }

  const filas = await mapaLimitado(urls, CONCURRENCIA, revisarPaginaSitemap);
  await revisarHreflang(filas);

  const visibles = SOLO_FALLOS ? filas.filter((fila) => fila.errores.length) : filas;
  imprimirTabla(
    ["URL", "STATUS", "ROBOTS", "CANONICAL", "HREFLANG", "JSON-LD", "SCHEMA", "RESULTADO"],
    visibles.map((fila) => [
      fila.path,
      fila.status,
      fila.robots,
      fila.canonical,
      fila.hreflang,
      fila.jsonld,
      fila.schema,
      fila.errores.length ? "FALLA" : "OK",
    ]),
    [58, 7, 6, 10, 12, 8, 16, 9]
  );

  for (const fila of filas) {
    if (!fila.errores.length) continue;
    console.log(`  ✗ ${fila.path}`);
    for (const error of fila.errores) console.log(`      - ${error}`);
  }
  for (const error of erroresSitemap) console.log(`  ✗ ${error}`);

  const fallos = filas.filter((fila) => fila.errores.length).length + erroresSitemap.length;
  return { ok: Math.max(0, filas.length - fallos), fallos, total: filas.length };
}

// ---------------------------------------------------------------------------
// Lista fija de URLs
// ---------------------------------------------------------------------------

async function estadoBasico(path, opciones = {}) {
  const respuesta = await obtener(path);
  if (!respuesta.ok) return { actual: "ERROR", issues: [`sin respuesta: ${respuesta.error}`] };
  const issues = [];
  const actual = [`status ${respuesta.status}`];

  if (opciones.status != null && respuesta.status !== opciones.status) {
    issues.push(`status ${respuesta.status} (esperado ${opciones.status})`);
  }

  const robots = metasRobots(respuesta.body);
  actual.push(`robots ${robots.length}`);
  if (opciones.robotsCount != null && robots.length !== opciones.robotsCount) {
    issues.push(`meta robots ${robots.length} (esperado ${opciones.robotsCount})`);
  }
  if (opciones.robotsMax != null && robots.length > opciones.robotsMax) {
    issues.push(`meta robots ${robots.length} (máximo ${opciones.robotsMax})`);
  }

  const tokens = robots.flatMap((meta) => tokensRobots(meta.content));
  if (opciones.index === true && tokens.includes("noindex")) {
    issues.push(`noindex inesperado (${robots.map((m) => m.content).join(" | ")})`);
  }
  if (opciones.noindex === true && !tokens.includes("noindex")) {
    issues.push(`falta noindex (${robots.map((m) => m.content).join(" | ") || "sin meta"})`);
  }
  if (opciones.follow === true && !tokens.includes("follow")) {
    issues.push("falta follow");
  }
  if (opciones.nofollow === true && !tokens.includes("nofollow")) {
    issues.push("falta nofollow");
  }
  if (opciones.sinFollow === true && tokens.includes("follow")) {
    issues.push("incluye follow (se esperaba nofollow)");
  }
  if (opciones.sinIndex === true && tokens.includes("index")) {
    issues.push("incluye index (se esperaba noindex)");
  }

  if (opciones.canonical === true) {
    const canon = canonicals(respuesta.body);
    if (canon.length !== 1) {
      issues.push(`canonical ${canon.length} (esperado 1)`);
    } else {
      const destino = clavePagina(canon[0].href);
      actual.push(`canonical ${destino}`);
      if (destino !== clavePagina(path)) issues.push(`canonical → ${destino} (propia: ${path})`);
    }
  }

  if (opciones.person === true || opciones.profilePage === true || opciones.coleccion === true) {
    const { tipos, errores } = tiposJsonLd(respuesta.body);
    for (const error of errores) issues.push(error);
    if (opciones.person === true && !tipos.has("Person")) issues.push("falta Person");
    if (opciones.profilePage === true && !tipos.has("ProfilePage")) issues.push("falta ProfilePage");
    if (
      opciones.coleccion === true &&
      !["CollectionPage", "ItemList", "ProfilePage"].some((tipo) => tipos.has(tipo))
    ) {
      issues.push("falta CollectionPage/ItemList en el listado");
    }
    actual.push(
      ["Person", "ProfilePage", "CollectionPage", "ItemList"]
        .filter((tipo) => tipos.has(tipo))
        .join("+") || "sin schema"
    );
  }

  return { actual: actual.join(" · "), issues };
}

async function estadoRedirect(path, destinoEsperado) {
  const primera = await obtener(path);
  if (!primera.ok) return { actual: "ERROR", issues: [`sin respuesta: ${primera.error}`] };
  if (![301, 308].includes(primera.status)) {
    return {
      actual: `status ${primera.status}`,
      issues: [`status ${primera.status} (esperado 301/308)`],
    };
  }
  const location = primera.headers.get("location");
  if (!location) return { actual: `${primera.status} sin Location`, issues: ["redirect sin Location"] };

  const segunda = await obtener(location);
  const destino = clavePagina(location);
  const actual = `${primera.status} → ${destino ?? location} → ${segunda.ok ? segunda.status : "ERROR"}`;
  const issues = [];
  if (!segunda.ok) {
    issues.push(`destino sin respuesta: ${segunda.error}`);
  } else if (segunda.status !== 200) {
    issues.push(`destino status ${segunda.status} (esperado 200 en 1 salto)`);
  }
  if (destinoEsperado && destino !== destinoEsperado) {
    issues.push(`destino ${destino} (esperado ${destinoEsperado})`);
  }
  return { actual, issues };
}

async function bloqueFijo() {
  console.log("\n[2] URLs FIJAS — resultado esperado por frente (§1 del encargo)");
  const filas = [];

  async function revisar(path, esperado, fn) {
    try {
      const resultado = await fn();
      filas.push({
        path,
        esperado,
        actual: resultado.actual,
        issues: resultado.issues,
      });
    } catch (error) {
      filas.push({ path, esperado, actual: "ERROR", issues: [error.message] });
    }
  }

  for (const path of [
    "/profesores",
    "/profesores/manuel-oliva",
    "/profesores/emanuel-berrocal",
    "/profesores/rodrigo-vega",
  ]) {
    await revisar(path, "200 · index · canonical · Person", () =>
      estadoBasico(path, {
        status: 200,
        robotsMax: 1,
        index: true,
        canonical: true,
        person: true,
        profilePage: path !== "/profesores",
        coleccion: path === "/profesores",
      })
    );
  }

  await revisar("/clase-gratis", "404 · 1 robots noindex", () =>
    estadoBasico("/clase-gratis", { status: 404, robotsCount: 1, noindex: true })
  );

  for (const path of ["/pages/contacto", "/pages/empresas", "/blogs/news", "/pages/bootcamp"]) {
    await revisar(path, "301/308 → 200 en 1 salto", () => estadoRedirect(path));
  }

  // Resto de la lista 404 de §1: WS2 los redirige a una página viva.
  for (const path of [
    "/pages/cursos",
    "/pages/cursos-1",
    "/pages/contact",
    "/pages/bootcamps",
    "/consultorias",
    "/campus",
    "/apps/ecomposer-visual-page-builder",
  ]) {
    await revisar(path, "301/308 → 200 en 1 salto", () => estadoRedirect(path));
  }

  for (const path of [
    "/products/curso-power-bi",
    "/products/curso-de-power-bi",
    "/products/curso-power-bi-online",
    "/products/curso-analisis-de-datos",
    "/products/curso-sql",
    "/products/machine-learning-program-bi",
    "/products/big-data-program-bi",
  ]) {
    await revisar(path, "301/308 → 200 en 1 salto", () => estadoRedirect(path));
  }

  for (const [path, destino] of [
    ["/curso-power-bi", "/cursos/power-bi"],
    ["/co/curso-power-bi", "/co/cursos/power-bi"],
  ]) {
    await revisar(path, `301 → ${destino} → 200`, () => estadoRedirect(path, destino));
  }

  await revisar("/cursos/power-bi", "200 · index · canonical propio", () =>
    estadoBasico("/cursos/power-bi", {
      status: 200,
      robotsMax: 1,
      index: true,
      canonical: true,
    })
  );

  await revisar("/pago", "200 · 1 robots noindex, nofollow", () =>
    estadoBasico("/pago", {
      status: 200,
      robotsCount: 1,
      noindex: true,
      nofollow: true,
      sinFollow: true,
      sinIndex: true,
    })
  );

  await revisar("/ve/test-nivel/sql", "200 · noindex, follow", () =>
    estadoBasico("/ve/test-nivel/sql", {
      status: 200,
      robotsCount: 1,
      noindex: true,
      follow: true,
      sinIndex: true,
    })
  );
  await revisar("/test-nivel/sql", "200 · index", () =>
    estadoBasico("/test-nivel/sql", { status: 200, robotsMax: 1, index: true })
  );

  await revisar("/blog", "200 (no 500)", async () => {
    const respuesta = await obtener("/blog");
    if (!respuesta.ok) return { actual: "ERROR", issues: [respuesta.error] };
    return {
      actual: `status ${respuesta.status}`,
      issues: respuesta.status === 200 ? [] : [`status ${respuesta.status} (esperado 200)`],
    };
  });
  await revisar("/newsletter", "301 → /blog → 200", () =>
    estadoRedirect("/newsletter", "/blog")
  );

  for (const pais of ["pe", "mx", "ar", "co"]) {
    const path = `/${pais}/cursos/power-bi`;
    await revisar(path, "200 · index · canonical propio", () =>
      estadoBasico(path, {
        status: 200,
        robotsMax: 1,
        index: true,
        canonical: true,
      })
    );
  }

  await revisar("/py/precios", "200 · noindex, follow", () =>
    estadoBasico("/py/precios", {
      status: 200,
      robotsCount: 1,
      noindex: true,
      follow: true,
      sinIndex: true,
    })
  );

  imprimirTabla(
    ["URL", "ESPERADO", "OBTENIDO", "RESULTADO"],
    filas.map((fila) => [
      fila.path,
      fila.esperado,
      fila.actual,
      fila.issues.length ? "FALLA" : "OK",
    ]),
    [40, 34, 40, 9]
  );

  for (const fila of filas) {
    if (!fila.issues.length) continue;
    console.log(`  ✗ ${fila.path}`);
    for (const issue of fila.issues) console.log(`      - ${issue}`);
  }

  const fallos = filas.filter((fila) => fila.issues.length).length;
  return { ok: filas.length - fallos, fallos, total: filas.length };
}

// ---------------------------------------------------------------------------
// Similitud de países
// ---------------------------------------------------------------------------

function textoVisible(html) {
  return decodificarHtml(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function shingles5(texto) {
  const palabras = texto.match(/[\p{L}\p{N}]+/gu) ?? [];
  const conjunto = new Set();
  for (let i = 0; i + 5 <= palabras.length; i++) {
    conjunto.add(palabras.slice(i, i + 5).join(" "));
  }
  return conjunto;
}

function jaccardConjuntos(a, b) {
  if (a.size === 0 || b.size === 0) return null;
  let interseccion = 0;
  for (const shingle of a) if (b.has(shingle)) interseccion++;
  const union = a.size + b.size - interseccion;
  return union === 0 ? 0 : (interseccion / union) * 100;
}

async function jaccard(pathPais, pathChile) {
  const [pais, chile] = await Promise.all([obtener(pathPais), obtener(pathChile)]);
  if (!pais.ok) return { error: `${pathPais}: ${pais.error}` };
  if (!chile.ok) return { error: `${pathChile}: ${chile.error}` };
  if (pais.status !== 200) return { error: `${pathPais}: status ${pais.status}` };
  if (chile.status !== 200) return { error: `${pathChile}: status ${chile.status}` };

  const a = shingles5(textoVisible(pais.body));
  const b = shingles5(textoVisible(chile.body));
  const porcentaje = jaccardConjuntos(a, b);
  if (porcentaje == null) return { error: "texto insuficiente para shingles" };
  return { porcentaje };
}

async function bloqueSimilitud() {
  console.log("\n[3] SIMILITUD DE PAÍSES — Jaccard de shingles de 5 palabras vs Chile");
  const filas = [];
  for (const pais of PAISES_SIMILITUD) {
    for (const ruta of RUTAS_SIMILITUD) {
      const pathPais = `/${pais}${ruta}`;
      const resultado = await jaccard(pathPais, ruta);
      const falla = resultado.error != null || resultado.porcentaje >= UMBRAL_SIMILITUD;
      filas.push({
        pais,
        ruta,
        valor: resultado.error ?? `${resultado.porcentaje.toFixed(1)} %`,
        issues: resultado.error ? [resultado.error] : falla ? [`≥ ${UMBRAL_SIMILITUD} %`] : [],
        falla,
      });
    }
  }

  imprimirTabla(
    ["PAÍS", "RUTA", "SIMILITUD VS CHILE", "RESULTADO"],
    filas.map((fila) => [fila.pais, fila.ruta, fila.valor, fila.falla ? "FALLA" : "OK"]),
    [6, 30, 20, 9]
  );

  for (const fila of filas) {
    if (!fila.falla) continue;
    console.log(`  ✗ /${fila.pais}${fila.ruta}: ${fila.valor}`);
  }

  const fallos = filas.filter((fila) => fila.falla).length;
  return { ok: filas.length - fallos, fallos, total: filas.length };
}

// ---------------------------------------------------------------------------
// Enlazado interno de «descubiertas»
// ---------------------------------------------------------------------------

function contarEnlaces(html, pagina) {
  const conteo = new Map(RUTAS_DESCUBIERTAS.map((ruta) => [ruta, 0]));
  for (const etiqueta of extraerEtiquetas(html, "a")) {
    const atributos = parsearAtributos(etiqueta);
    const href = atributos.href;
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) continue;
    let url;
    try {
      url = new URL(href, urlDeFetch(pagina));
    } catch {
      continue;
    }
    if (!esHostDelSitio(url.host)) continue;
    const path = clavePagina(url.href);
    if (conteo.has(path)) conteo.set(path, conteo.get(path) + 1);
  }
  return conteo;
}

async function bloqueEnlazado() {
  console.log("\n[4] ENLAZADO INTERNO — / y /cursos hacia páginas «descubiertas»");
  const paginas = ["/", "/cursos"];
  const porPagina = new Map();
  const errores = [];
  for (const pagina of paginas) {
    const respuesta = await obtener(pagina);
    if (!respuesta.ok || respuesta.status !== 200) {
      errores.push(`${pagina}: ${respuesta.ok ? `status ${respuesta.status}` : respuesta.error}`);
      porPagina.set(pagina, new Map(RUTAS_DESCUBIERTAS.map((ruta) => [ruta, 0])));
      continue;
    }
    porPagina.set(pagina, contarEnlaces(respuesta.body, pagina));
  }

  const filas = [];
  for (const ruta of RUTAS_DESCUBIERTAS) {
    const enHome = porPagina.get("/")?.get(ruta) ?? 0;
    const enCursos = porPagina.get("/cursos")?.get(ruta) ?? 0;
    const total = enHome + enCursos;
    const issues = [];
    if (total < 2) issues.push(`${total} enlace(s); mínimo 2 entre / y /cursos`);

    // Enlazar una página rota o noindex sería peor que no enlazarla.
    const destino = await estadoBasico(ruta, {
      status: 200,
      robotsMax: 1,
      index: true,
      canonical: true,
    });
    issues.push(...destino.issues);

    filas.push({
      ruta,
      status: destino.actual.split(" · ")[0]?.replace("status ", "") ?? "—",
      robots: destino.actual.match(/robots (\d+)/)?.[1] ?? "—",
      canonical: destino.actual.match(/canonical (\S+)/)?.[1] ?? "—",
      enHome,
      enCursos,
      total,
      issues,
    });
  }

  imprimirTabla(
    ["RUTA", "STATUS", "ROBOTS", "CANONICAL", "/", "/CURSOS", "TOTAL", "RESULTADO"],
    filas.map((fila) => [
      fila.ruta,
      fila.status,
      fila.robots,
      fila.canonical,
      String(fila.enHome),
      String(fila.enCursos),
      String(fila.total),
      fila.issues.length ? "FALLA" : "OK",
    ]),
    [36, 7, 6, 10, 5, 8, 6, 9]
  );

  for (const error of errores) console.log(`  ✗ ${error}`);
  for (const fila of filas) {
    if (!fila.issues.length) continue;
    console.log(`  ✗ ${fila.ruta}`);
    for (const issue of fila.issues) console.log(`      - ${issue}`);
  }

  const fallos = filas.filter((fila) => fila.issues.length).length + errores.length;
  return { ok: Math.max(0, filas.length - fallos), fallos, total: filas.length };
}

// ---------------------------------------------------------------------------
// Self-check offline (sin red)
// ---------------------------------------------------------------------------

/**
 * Valida los parsers y helpers contra HTML/XML sintético. No descarga nada:
 * sirve para comprobar el script en un worktree sin servidor levantado.
 */
function selfCheck() {
  console.log("WS11 · self-check offline de parsers (sin red)\n");
  const resultados = [];

  const check = (nombre, fn) => {
    try {
      fn();
      resultados.push({ nombre, ok: true, detalle: "" });
    } catch (error) {
      resultados.push({ nombre, ok: false, detalle: error.message });
    }
  };
  const igual = (actual, esperado, etiqueta) => {
    if (actual !== esperado) {
      throw new Error(
        `${etiqueta}: ${JSON.stringify(actual)} ≠ ${JSON.stringify(esperado)}`
      );
    }
  };
  const cierto = (condicion, etiqueta) => {
    if (!condicion) throw new Error(etiqueta);
  };

  check("normalizarBase agrega esquema y quita slash final", () => {
    igual(normalizarBase("localhost:3107/"), "http://localhost:3107", "local");
    igual(normalizarBase("https://www.programbi.com/"), "https://www.programbi.com", "prod");
  });

  check("metasRobots detecta duplicados y noindex", () => {
    const html = `<meta name="robots" content="noindex"><meta name="ROBOTS" content="index, follow">`;
    igual(metasRobots(html).length, 2, "cantidad");
    cierto(tieneNoindex(html), "noindex no detectado");
    cierto(!tieneNoindex(`<meta name="robots" content="index, follow">`), "falso noindex");
  });

  check("canonicals decodifica entidades y reconoce rel múltiple", () => {
    const html = `<link rel="canonical" href="https://www.programbi.com/cursos/power-bi?x=1&amp;y=2">`;
    const canon = canonicals(html);
    igual(canon.length, 1, "cantidad");
    igual(canon[0].href, "https://www.programbi.com/cursos/power-bi?x=1&y=2", "href");
  });

  check("alternates extrae hreflang y x-default", () => {
    const html =
      `<link rel="alternate" hreflang="es-CL" href="/a">` +
      `<link rel="alternate" hreflang="x-default" href="https://www.programbi.com/a">` +
      `<link rel="stylesheet" href="/x.css">`;
    const alts = alternates(html);
    igual(alts.length, 2, "cantidad");
    igual(alts[1].hreflang, "x-default", "x-default");
  });

  check("bloquesJsonLd separa bloques y detecta JSON inválido", () => {
    const html =
      `<script type="application/ld+json">{"@type":"Person"}</script>` +
      `<script type="application/ld+json">{"@type":}</script>` +
      `<script type="application/ld+json">{"@graph":[{"@type":"Course"}]}</script>`;
    const ld = parsearJsonLd(html);
    igual(ld.bloques.length, 3, "bloques");
    igual(ld.errores.length, 1, "errores");
  });

  check("acumularTipos recorre @graph y arrays anidados", () => {
    const tipos = new Set();
    acumularTipos(
      {
        "@context": "https://schema.org",
        "@graph": [{ "@type": ["ProfilePage", "WebPage"] }, { "@type": "Person" }],
      },
      tipos
    );
    cierto(tipos.has("ProfilePage") && tipos.has("WebPage") && tipos.has("Person"), "faltan tipos");
  });

  check("extraerLocs lee sitemap index con entidades", () => {
    const xml =
      `<sitemapindex><sitemap><loc> https://www.programbi.com/sitemap-1.xml </loc></sitemap>` +
      `<sitemap><loc>https://www.programbi.com/sitemap-2.xml?a=1&amp;b=2</loc></sitemap></sitemapindex>`;
    const locs = extraerLocs(xml);
    igual(locs.length, 2, "cantidad");
    igual(locs[1], "https://www.programbi.com/sitemap-2.xml?a=1&b=2", "entidad");
  });

  check("clavePagina normaliza slash final y conserva la ruta", () => {
    igual(clavePagina("https://www.programbi.com/cursos/power-bi/"), "/cursos/power-bi", "URL");
    igual(clavePagina("/pe/cursos/power-bi?x=1"), "/pe/cursos/power-bi", "ruta país");
    igual(clavePagina("https://www.programbi.com/"), "/", "raíz");
  });

  check("textoVisible elimina scripts, estilos y etiquetas", () => {
    const texto = textoVisible(
      `<style>.x{}</style><script>var x="hola"</script><h1>Cursos &amp; datos</h1>`
    );
    igual(texto, "cursos & datos", "texto");
  });

  check("shingles5 y Jaccard", () => {
    const a = shingles5("uno dos tres cuatro cinco seis");
    igual(a.size, 2, "shingles");
    igual(jaccardConjuntos(a, a), 100, "idénticos");
    igual(jaccardConjuntos(a, shingles5("siete ocho nueve diez once doce")), 0, "disjuntos");
    igual(jaccardConjuntos(new Set(), a), null, "vacío");
  });

  check("esFichaCurso distingue ficha de listado", () => {
    cierto(esFichaCurso("/cursos/power-bi"), "/cursos/power-bi");
    cierto(esFichaCurso("/pe/cursos/python"), "/pe/cursos/python");
    cierto(!esFichaCurso("/cursos"), "/cursos no es ficha");
    cierto(!esFichaCurso("/cursos/power-bi/nivel"), "subruta no es ficha");
  });

  check("parsearAtributos acepta comillas simples, dobles y sin comillas", () => {
    const attrs = parsearAtributos(`<link rel='canonical' href=/a?b data-x="ok">`);
    igual(attrs.rel, "canonical", "rel");
    igual(attrs.href, "/a?b", "href");
    igual(attrs["data-x"], "ok", "data-x");
  });

  check("contarEnlaces cuenta solo rutas internas exactas", () => {
    const html =
      `<a href="/cursos/machine-learning">A</a>` +
      `<a href="https://www.programbi.com/cursos/machine-learning#x">B</a>` +
      `<a href="/cursos/machine-learning-avanzado">C</a>` +
      `<a href="mailto:x@y.cl">D</a>`;
    const conteo = contarEnlaces(html, "/");
    igual(conteo.get("/cursos/machine-learning"), 2, "conteo");
    igual(conteo.get("/glosario"), 0, "otra ruta");
  });

  for (const fila of resultados) {
    console.log(`  ${fila.ok ? "✓" : "✗"} ${fila.nombre}${fila.detalle ? ` — ${fila.detalle}` : ""}`);
  }
  const fallos = resultados.filter((fila) => !fila.ok).length;
  console.log(`\n  ${resultados.length - fallos} OK / ${fallos} fallos`);
  return fallos;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(96));
  console.log("WS11 · VERIFICADOR DE INDEXACIÓN — ProgramBI");
  console.log(`Base: ${BASE}`);
  console.log(`Sitemap: ${new URL("/sitemap.xml", `${BASE}/`).href}`);
  console.log("=".repeat(96));

  const sitemap = await bloqueSitemap();
  const fijo = await bloqueFijo();
  const similitud = await bloqueSimilitud();
  const enlazado = await bloqueEnlazado();

  const bloques = [
    ["Sitemap", sitemap],
    ["URLs fijas", fijo],
    ["Similitud países", similitud],
    ["Enlazado interno", enlazado],
  ];
  const ok = bloques.reduce((total, [, bloque]) => total + bloque.ok, 0);
  const fallos = bloques.reduce((total, [, bloque]) => total + bloque.fallos, 0);

  console.log(`\n${"=".repeat(96)}`);
  console.log("RESUMEN");
  for (const [nombre, bloque] of bloques) {
    const marca = bloque.fallos ? "FALLA" : "OK";
    console.log(
      `  ${nombre.padEnd(18)} ${String(bloque.ok).padStart(4)} OK / ${String(bloque.fallos).padStart(3)} fallos · ${marca}`
    );
  }
  console.log("-".repeat(96));
  console.log(`  ${"TOTAL".padEnd(18)} ${String(ok).padStart(4)} OK / ${String(fallos).padStart(3)} fallos`);
  console.log(`  Exit code: ${fallos ? 1 : 0}`);
  console.log("=".repeat(96));

  terminar(fallos ? 1 : 0);
}

/** Deja que stdout se vacíe antes de salir (en Windows, por pipe, es async). */
function terminar(codigo) {
  process.exitCode = codigo;
  process.stdout.write("", () => process.exit(codigo));
}

if (SELF_CHECK) {
  terminar(selfCheck() ? 1 : 0);
} else {
  main().catch((error) => {
    console.error(`Error fatal: ${error?.stack || error}`);
    terminar(1);
  });
}
