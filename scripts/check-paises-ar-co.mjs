#!/usr/bin/env node
/**
 * Check de las 14 URLs de Argentina y Colombia (frente WS8).
 *
 * Por cada ruta comprueba:
 *   - HTTP 200 sin redirección;
 *   - meta robots indexable (sin `noindex`);
 *   - canonical propio (mismo path que la URL pedida);
 *   - un H1 único que nombre el país;
 *   - exactamente un FAQPage JSON-LD, parseable y con preguntas/respuestas;
 *   - bloque local visible (`data-testid="bloque-local-pais"`);
 *   - hreflang recíproco con Chile, Argentina y Colombia.
 *
 * Uso:
 *   node scripts/check-paises-ar-co.mjs [baseUrl]
 *
 * `baseUrl` por defecto es http://127.0.0.1:3000. Pensado para correr contra
 * una instancia local ya levantada (`next start` o `next dev`). Sin
 * dependencias: solo Node 18+ (fetch nativo). Exit code ≠ 0 si algo falla.
 */

const BASE = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/+$/, "");

const PAISES = [
  { iso: "ar", nombre: "Argentina", idioma: "es-AR" },
  { iso: "co", nombre: "Colombia", idioma: "es-CO" },
];

const RUTAS = [
  { path: "", etiqueta: "hub" },
  { path: "/cursos", etiqueta: "cursos" },
  { path: "/cursos/power-bi", etiqueta: "ficha Power BI" },
  { path: "/cursos/analisis-de-datos", etiqueta: "ficha Análisis de datos" },
  { path: "/cursos/python", etiqueta: "ficha Python" },
  { path: "/empresas", etiqueta: "empresas" },
  { path: "/precios", etiqueta: "precios" },
];

const PEDIDAS = PAISES.flatMap((pais) =>
  RUTAS.map((ruta) => ({
    pais,
    ruta,
    path: `/${pais.iso}${ruta.path}`,
    etiqueta: `${pais.iso} · ${ruta.etiqueta}`,
  }))
);

const cache = new Map();
const fallos = [];

function urlLocal(path) {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

function pathDe(href) {
  try {
    const url = new URL(href);
    return url.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return null;
  }
}

function normalizarPath(path) {
  return (path || "/").replace(/\/+$/, "") || "/";
}

async function pedir(path) {
  const url = urlLocal(path);
  if (cache.has(url)) return cache.get(url);
  const promesa = (async () => {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(30000),
      headers: { "user-agent": "ProgramBI-WS8-Check/1.0" },
    });
    const html = await res.text();
    return { res, html };
  })();
  cache.set(url, promesa);
  try {
    return await promesa;
  } catch (error) {
    cache.delete(url);
    throw error;
  }
}

function atributos(tag) {
  const salida = {};
  for (const match of tag.matchAll(/([a-zA-Z:-]+)\s*=\s*"([^"]*)"/g)) {
    salida[match[1].toLowerCase()] = match[2];
  }
  return salida;
}

function decodificar(texto) {
  return texto
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&#x27;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function textoPlano(html) {
  return decodificar(html.replace(/<[^>]*>/g, " "));
}

function metadatos(html) {
  const metas = [];
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    metas.push(atributos(match[0]));
  }
  return metas;
}

function enlaces(html) {
  const links = [];
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    links.push(atributos(match[0]));
  }
  return links;
}

function scriptsJsonLd(html) {
  const salida = [];
  for (const match of html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  )) {
    salida.push(match[1]);
  }
  return salida;
}

function nodosJsonLd(valor) {
  if (Array.isArray(valor)) return valor.flatMap(nodosJsonLd);
  if (!valor || typeof valor !== "object") return [];
  const propios = [valor];
  if (Array.isArray(valor["@graph"])) propios.push(...nodosJsonLd(valor["@graph"]));
  return propios;
}

function faqPages(html) {
  const nodos = [];
  for (const crudo of scriptsJsonLd(html)) {
    try {
      nodos.push(...nodosJsonLd(JSON.parse(crudo)));
    } catch (error) {
      return { error: `JSON-LD inválido: ${error.message}`, faqs: [] };
    }
  }
  const faqs = nodos.filter(
    (nodo) => nodo && (nodo["@type"] === "FAQPage" || (Array.isArray(nodo["@type"]) && nodo["@type"].includes("FAQPage")))
  );
  return { error: null, faqs };
}

function validarFaqPage(faq) {
  if (!Array.isArray(faq.mainEntity) || faq.mainEntity.length === 0) {
    return "FAQPage sin mainEntity";
  }
  for (const [indice, entidad] of faq.mainEntity.entries()) {
    if (!entidad || entidad["@type"] !== "Question") {
      return `mainEntity[${indice}] no es Question`;
    }
    if (typeof entidad.name !== "string" || !entidad.name.trim()) {
      return `mainEntity[${indice}] sin name`;
    }
    const respuesta = entidad.acceptedAnswer;
    if (!respuesta || respuesta["@type"] !== "Answer" || typeof respuesta.text !== "string" || !respuesta.text.trim()) {
      return `mainEntity[${indice}] sin acceptedAnswer.text`;
    }
  }
  return null;
}

/** Hrefs hreflang de la página, por idioma. */
function alternativas(links) {
  const mapa = new Map();
  for (const link of links) {
    const rel = (link.rel || "").toLowerCase();
    if (!rel.split(/\s+/).includes("alternate")) continue;
    if (!link.hreflang || !link.href) continue;
    mapa.set(link.hreflang.toLowerCase(), link.href);
  }
  return mapa;
}

/**
 * Comprueba que la página `destino` (href absoluto de producción) se sirve en
 * local con canonical propio y devuelve un alternate hacia `origen`.
 */
async function reciprocidad(destinoHref, origenPath, idiomaOrigen) {
  const destinoPath = pathDe(destinoHref);
  if (!destinoPath) return `alternate con href inválido: ${destinoHref}`;
  const { res, html } = await pedir(destinoPath);
  if (res.status !== 200) return `${destinoPath} responde ${res.status}`;

  const links = enlaces(html);
  const canonical = links.find((link) => (link.rel || "").toLowerCase().includes("canonical"));
  if (!canonical?.href || normalizarPath(pathDe(canonical.href)) !== normalizarPath(destinoPath)) {
    return `${destinoPath} no tiene canonical propio (${canonical?.href ?? "sin canonical"})`;
  }

  const alts = alternativas(links);
  for (const [idioma, href] of alts) {
    if (normalizarPath(pathDe(href)) === normalizarPath(origenPath) && idioma === idiomaOrigen.toLowerCase()) {
      return null;
    }
  }
  return `${destinoPath} no devuelve hreflang ${idiomaOrigen} hacia ${origenPath}`;
}

async function revisar(pedida) {
  const errores = [];
  let html = "";
  try {
    const { res, html: cuerpo } = await pedir(pedida.path);
    html = cuerpo;
    if (res.status !== 200) errores.push(`status ${res.status}`);
    if (res.redirected) errores.push(`redirige a ${res.url}`);
  } catch (error) {
    return { ...pedida, errores: [`no se pudo pedir: ${error.message}`], title: "", h1: "", faq: 0 };
  }

  const metas = metadatos(html);
  const robots = metas.filter((meta) => (meta.name || "").toLowerCase() === "robots");
  if (robots.length !== 1) {
    errores.push(`${robots.length} meta robots (se esperaba 1)`);
  } else if ((robots[0].content || "").toLowerCase().includes("noindex")) {
    errores.push(`meta robots noindex (${robots[0].content})`);
  }

  const links = enlaces(html);
  const canonicales = links.filter((link) => (link.rel || "").toLowerCase().includes("canonical"));
  if (canonicales.length !== 1) {
    errores.push(`${canonicales.length} canonical (se esperaba 1)`);
  } else if (normalizarPath(pathDe(canonicales[0].href)) !== normalizarPath(pedida.path)) {
    errores.push(`canonical ${canonicales[0].href} no corresponde a ${pedida.path}`);
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodificar(titleMatch[1]) : "";
  if (!title) errores.push("sin <title>");
  else if (title.length > 60) errores.push(`title de ${title.length} caracteres`);

  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => textoPlano(match[1]));
  if (h1s.length !== 1) errores.push(`${h1s.length} H1 (se esperaba 1)`);
  else if (!h1s[0].toLowerCase().includes(pedida.pais.nombre.toLowerCase())) {
    errores.push(`H1 sin el país: «${h1s[0]}»`);
  }

  const { error: errorJson, faqs } = faqPages(html);
  if (errorJson) {
    errores.push(errorJson);
  } else if (faqs.length !== 1) {
    errores.push(`${faqs.length} FAQPage JSON-LD (se esperaba 1)`);
  } else {
    const invalido = validarFaqPage(faqs[0]);
    if (invalido) errores.push(invalido);
  }

  if (!/data-testid="bloque-local-pais"/.test(html)) {
    errores.push("no se renderizó el bloque local");
  }

  const alts = alternativas(links);
  const propios = [pedida.pais.idioma, "es-AR", "es-CO", "es-CL", "x-default"];
  for (const idioma of propios) {
    if (!alts.has(idioma.toLowerCase())) errores.push(`falta hreflang ${idioma}`);
  }

  const esperadoPorIdioma = {
    "es-AR": `/ar${pedida.ruta.path}`,
    "es-CO": `/co${pedida.ruta.path}`,
  };
  for (const [idioma, esperado] of Object.entries(esperadoPorIdioma)) {
    if (!alts.has(idioma.toLowerCase())) continue;
    const obtenido = pathDe(alts.get(idioma.toLowerCase()));
    if (normalizarPath(obtenido) !== normalizarPath(esperado)) {
      errores.push(`alternate ${idioma} apunta a ${obtenido} (se esperaba ${esperado})`);
    }
  }

  const cl = alts.get("es-cl");
  const xdefault = alts.get("x-default");
  if (cl && normalizarPath(pathDe(cl)) !== normalizarPath(pathDe(xdefault || ""))) {
    errores.push("es-CL y x-default no apuntan a la misma versión chilena");
  }

  // Reciprocidad: la versión hermana (AR/CO) y la chilena deben devolver el
  // alternate hacia esta misma ruta.
  for (const idioma of ["es-AR", "es-CO"]) {
    const href = alts.get(idioma.toLowerCase());
    if (!href) continue;
    if (normalizarPath(pathDe(href)) === normalizarPath(pedida.path)) continue;
    const fallo = await reciprocidad(href, pedida.path, pedida.pais.idioma);
    if (fallo) errores.push(fallo);
  }
  if (xdefault) {
    const fallo = await reciprocidad(xdefault, pedida.path, pedida.pais.idioma);
    if (fallo) errores.push(fallo);
  }

  return {
    ...pedida,
    errores,
    title,
    h1: h1s[0] || "",
    faq: faqs.length,
  };
}

async function main() {
  console.log(`WS8 · check AR/CO contra ${BASE}`);
  console.log(`Rutas: ${PEDIDAS.length} (7 × ar,co)\n`);

  const resultados = [];
  for (const pedida of PEDIDAS) {
    try {
      resultados.push(await revisar(pedida));
    } catch (error) {
      resultados.push({ ...pedida, errores: [`excepción: ${error.message}`], title: "", h1: "", faq: 0 });
    }
  }

  for (const resultado of resultados) {
    const estado = resultado.errores.length === 0 ? "OK  " : "FALLA";
    console.log(`${estado} ${resultado.path.padEnd(36)} ${resultado.title || "(sin title)"}`);
    for (const error of resultado.errores) console.log(`      · ${error}`);
    if (resultado.errores.length > 0) fallos.push(resultado.path);
  }

  const titulos = new Map();
  let paginasOk = 0;
  for (const resultado of resultados) {
    if (resultado.errores.length === 0) paginasOk += 1;
    if (!resultado.title) continue;
    const previo = titulos.get(resultado.title);
    if (previo) fallos.push(`${resultado.path} repite title con ${previo}`);
    else titulos.set(resultado.title, resultado.path);
  }

  console.log(`\n${paginasOk}/${resultados.length} OK · ${fallos.length} fallo(s)`);
  if (fallos.length > 0) {
    console.log("\nFallos:");
    for (const fallo of fallos) console.log(` · ${fallo}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`Error fatal: ${error.stack || error.message}`);
  process.exitCode = 1;
});
