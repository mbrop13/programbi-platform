#!/usr/bin/env node
/**
 * WS6 — Test de nivel por país: comprueba la consolidación en la raíz.
 *
 * Uso:
 *   node scripts/check-test-nivel.mjs
 *   node scripts/check-test-nivel.mjs http://localhost:3116
 *   node scripts/check-test-nivel.mjs --base=http://127.0.0.1:3116
 *   node scripts/check-test-nivel.mjs --paises=ve,uy,pe   # muestra acotada
 *
 * Contra la base indicada (por defecto http://127.0.0.1:3116) exige:
 *   - variantes por país de /test-nivel y /test-nivel/<tema>:
 *       200, exactamente 1 meta robots `noindex, follow`, 0 hreflang,
 *       canonical = su propia URL y enlace visible a la versión general;
 *   - raíz /test-nivel y /test-nivel/<tema>:
 *       200, indexable (sin `noindex`), canonical propio y 0 hreflang
 *       (no debe apuntar a variantes noindex).
 *
 * Sale con código 1 si alguna comprobación falla. Sin dependencias.
 */

const args = process.argv.slice(2);

function arg(nombre, porDefecto = "") {
  const prefijo = `--${nombre}=`;
  const encontrado = args.find((a) => a.startsWith(prefijo));
  if (encontrado) return encontrado.slice(prefijo.length).trim();
  const posicional = args.find((a) => !a.startsWith("--"));
  return posicional || porDefecto;
}

const base = arg("base", process.env.BASE_URL || "http://127.0.0.1:3116").replace(/\/+$/, "");

const PAISES = [
  "ar", "bo", "co", "cr", "do", "ec", "gt", "hn",
  "mx", "ni", "pa", "pe", "py", "sv", "uy", "ve",
];
const TEMAS = ["sql", "excel"];
const RUTAS = ["/test-nivel", ...TEMAS.map((tema) => `/test-nivel/${tema}`)];

const filtroPaises = arg("paises", "")
  .split(",")
  .map((iso) => iso.trim())
  .filter(Boolean);
const desconocidos = filtroPaises.filter((iso) => !PAISES.includes(iso));
if (desconocidos.length) {
  console.error(`País no reconocido: ${desconocidos.join(", ")}. Válidos: ${PAISES.join(", ")}.`);
  process.exit(2);
}
const paises = filtroPaises.length ? PAISES.filter((iso) => filtroPaises.includes(iso)) : PAISES;

const TIMEOUT_MS = 60_000;

/** Devuelve las etiquetas HTML de un tipo (<meta ...>, <link ...>). */
function etiquetas(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].map((m) => m[0]);
}

/** Valor de un atributo dentro de una etiqueta; null si no está. */
function atributo(etiqueta, nombre) {
  const m = etiqueta.match(new RegExp(`${nombre}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3] ?? "") : null;
}

/** Normaliza el path de un href absoluto o relativo. */
function pathDe(href) {
  try {
    return new URL(href, base).pathname;
  } catch {
    return href;
  }
}

async function pedir(url) {
  const respuesta = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "user-agent": "ProgramBI-WS6-check/1.0" },
  });
  return { status: respuesta.status, html: await respuesta.text() };
}

/** Comprueba una URL y devuelve la lista de errores (vacía = OK). */
async function revisar(url, esperado) {
  const errores = [];
  let pagina;
  try {
    pagina = await pedir(`${base}${url}`);
  } catch (error) {
    return [`no responde: ${error?.message || error}`];
  }

  if (pagina.status !== 200) {
    errores.push(`status ${pagina.status} (se esperaba 200)`);
  }

  const robots = etiquetas(pagina.html, "meta").filter(
    (tag) => (atributo(tag, "name") || "").toLowerCase() === "robots",
  );
  const links = etiquetas(pagina.html, "link");
  const hreflang = links.filter((tag) => atributo(tag, "hreflang") !== null);
  const canonicos = links.filter(
    (tag) => (atributo(tag, "rel") || "").toLowerCase() === "canonical",
  );

  if (esperado.noindex) {
    if (robots.length !== 1) {
      errores.push(`${robots.length} meta robots (se esperaba exactamente 1)`);
    }
    for (const tag of robots) {
      const contenido = (atributo(tag, "content") || "").toLowerCase();
      if (!/\bnoindex\b/.test(contenido)) errores.push(`robots sin noindex: "${contenido}"`);
      if (!/\bfollow\b/.test(contenido) || /\bnofollow\b/.test(contenido)) {
        errores.push(`robots sin follow: "${contenido}"`);
      }
    }
  } else {
    if (robots.length > 1) errores.push(`${robots.length} meta robots (máximo 1)`);
    for (const tag of robots) {
      const contenido = (atributo(tag, "content") || "").toLowerCase();
      if (/\bnoindex\b/.test(contenido)) errores.push(`raíz con noindex: "${contenido}"`);
    }
  }

  if (hreflang.length !== 0) {
    const destinos = hreflang.map((tag) => atributo(tag, "href")).join(", ");
    errores.push(`${hreflang.length} hreflang (se esperaban 0): ${destinos}`);
  }

  if (canonicos.length !== 1) {
    errores.push(`${canonicos.length} canonical (se esperaba exactamente 1)`);
  } else {
    const canonical = atributo(canonicos[0], "href") || "";
    const propio = pathDe(canonical);
    if (propio !== esperado.canonical) {
      errores.push(`canonical ${propio} (se esperaba ${esperado.canonical})`);
    }
  }

  if (esperado.enlace) {
    const patron = new RegExp(`href="${esperado.enlace.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
    if (!patron.test(pagina.html)) {
      errores.push(`sin enlace a ${esperado.enlace}`);
    }
  }

  return errores;
}

async function principal() {
  console.log(`WS6 · test de nivel por país contra ${base}`);
  console.log(`Raíz indexable: ${RUTAS.join(", ")}`);
  console.log(`Variantes noindex: ${paises.length} países × ${RUTAS.length} rutas\n`);

  const resultados = [];

  for (const ruta of RUTAS) {
    resultados.push({
      url: ruta,
      esperado: "index",
      errores: await revisar(ruta, { noindex: false, canonical: ruta }),
    });
  }

  for (const iso of paises) {
    for (const ruta of RUTAS) {
      const url = `/${iso}${ruta}`;
      resultados.push({
        url,
        esperado: "noindex",
        errores: await revisar(url, {
          noindex: true,
          canonical: url,
          enlace: ruta,
        }),
      });
    }
  }

  for (const resultado of resultados) {
    const estado = resultado.errores.length ? "FALLA" : "OK";
    const detalle = resultado.errores.length ? ` — ${resultado.errores.join("; ")}` : "";
    console.log(`[${estado}] ${resultado.esperado.padEnd(7)} ${resultado.url}${detalle}`);
  }

  const fallos = resultados.filter((resultado) => resultado.errores.length);
  console.log(`\n${resultados.length - fallos.length}/${resultados.length} OK · ${fallos.length} fallas`);

  if (fallos.length) {
    console.error("\nWS6 falló: revisa las URLs marcadas arriba.");
    process.exit(1);
  }
  console.log("WS6 OK: raíz indexable, variantes de país noindex/follow sin hreflang.");
}

principal().catch((error) => {
  console.error("WS6: error inesperado", error);
  process.exit(1);
});
