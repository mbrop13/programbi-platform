#!/usr/bin/env node
/**
 * Smoke de canonicales WS3 (canibalización Power BI + /pago).
 *
 * Uso:
 *   node scripts/smoke-canonicales.mjs [baseUrl]
 *   BASE_URL=https://www.programbi.com node scripts/smoke-canonicales.mjs
 *
 * Verifica, sin dependencias:
 *   1. /curso-power-bi → 301/308 → /cursos/power-bi → 200 en 1 salto.
 *   2. /co/curso-power-bi → 301/308 → /co/cursos/power-bi → 200 en 1 salto.
 *   3. /pago con exactamente una meta robots `noindex, nofollow` (si la página
 *      responde 200; sin sesión el checkout redirige a "/" y se avisa). Para
 *      verificarla con sesión, exporta la cookie de Supabase en SMOKE_COOKIE.
 *   4. Que las páginas de entrada no sirvan hrefs internos a /curso-power-bi.
 *
 * Sale con código ≠ 0 si alguna comprobación falla.
 */

const BASE = (process.argv[2] || process.env.BASE_URL || "http://localhost:3107").replace(/\/+$/, "");
const COOKIE = process.env.SMOKE_COOKIE || "";

const fallos = [];
const ok = [];
const avisos = [];

function absoluta(path) {
  return new URL(path, `${BASE}/`).toString();
}

async function pedir(path) {
  return fetch(absoluta(path), {
    redirect: "manual",
    headers: {
      "user-agent": "ProgramBI-smoke-canonicales/1.0 (+https://www.programbi.com)",
      ...(COOKIE ? { cookie: COOKIE } : {}),
    },
  });
}

function destino(res) {
  const location = res.headers.get("location");
  if (!location) return null;
  const url = new URL(location, `${BASE}/`);
  return `${url.pathname}${url.search}`;
}

function normalizar(path) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

async function revisarRedirect(origen, esperado) {
  let res;
  try {
    res = await pedir(origen);
  } catch (error) {
    fallos.push(`${origen}: no se pudo consultar (${error.message})`);
    return;
  }

  if (res.status !== 301 && res.status !== 308) {
    fallos.push(`${origen}: se esperaba 301/308 y llegó ${res.status}`);
    return;
  }

  const location = destino(res);
  if (!location) {
    fallos.push(`${origen}: ${res.status} sin cabecera Location`);
    return;
  }
  if (normalizar(location) !== normalizar(esperado)) {
    fallos.push(`${origen}: redirige a ${location}, se esperaba ${esperado}`);
    return;
  }
  ok.push(`${origen} → ${res.status} → ${location}`);

  let final;
  try {
    final = await pedir(esperado);
  } catch (error) {
    fallos.push(`${esperado}: no se pudo consultar el destino (${error.message})`);
    return;
  }
  if (final.status !== 200) {
    fallos.push(`${esperado}: el destino respondió ${final.status} (se esperaba 200 en 1 salto)`);
    return;
  }
  ok.push(`${esperado} → 200`);
}

function metaRobots(html) {
  const etiquetas = html.match(/<meta\b[^>]*>/gi) || [];
  const robots = etiquetas.filter((tag) => /\bname\s*=\s*["']robots["']/i.test(tag));
  const googlebot = etiquetas.filter((tag) => /\bname\s*=\s*["']googlebot["']/i.test(tag));
  return { robots, googlebot };
}

async function revisarEnlacesInternos() {
  const paginas = ["/", "/cursos", "/cursos/power-bi", "/por-que-fallan-proyectos-power-bi"];
  const enlaceViejo = /href\s*=\s*["'][^"']*\/curso-power-bi(?=["'#?/])/i;

  for (const pagina of paginas) {
    let res;
    try {
      res = await pedir(pagina);
    } catch (error) {
      avisos.push(`${pagina}: no se pudo revisar el HTML (${error.message})`);
      continue;
    }
    if (res.status !== 200) {
      avisos.push(`${pagina}: ${res.status}, no se revisó el HTML`);
      continue;
    }
    const html = await res.text();
    if (enlaceViejo.test(html)) {
      fallos.push(`${pagina}: el HTML sirve un href interno a /curso-power-bi (debe apuntar a /cursos/power-bi)`);
    } else {
      ok.push(`${pagina} → sin hrefs a /curso-power-bi`);
    }
  }
}

async function revisarPago() {
  let res;
  try {
    res = await pedir("/pago");
  } catch (error) {
    fallos.push(`/pago: no se pudo consultar (${error.message})`);
    return;
  }

  if (res.status >= 300 && res.status < 400) {
    const location = destino(res);
    avisos.push(
      `/pago: ${res.status} → ${location ?? "?"} (checkout con sesión). No se puede leer la meta robots sin login; revisar en el build o con una cookie válida.`
    );
    return;
  }

  if (res.status !== 200) {
    fallos.push(`/pago: respondió ${res.status}`);
    return;
  }

  const html = await res.text();
  const { robots, googlebot } = metaRobots(html);

  if (robots.length !== 1) {
    fallos.push(`/pago: ${robots.length} metas robots (se esperaba exactamente 1)`);
    return;
  }

  const contenido = (robots[0].match(/\bcontent\s*=\s*["']([^"']*)["']/i) || [])[1] || "";
  const valores = contenido.toLowerCase();
  if (!valores.includes("noindex") || !valores.includes("nofollow")) {
    fallos.push(`/pago: meta robots "${contenido}" (se esperaba noindex, nofollow)`);
    return;
  }
  ok.push(`/pago → 200 · meta robots "${contenido}"`);

  if (googlebot.length > 0) {
    avisos.push("/pago: además hay una meta googlebot; la especificación pide una sola meta robots.");
  }
}

async function principal() {
  console.log(`Smoke de canonicales WS3 contra ${BASE}\n`);

  await revisarRedirect("/curso-power-bi", "/cursos/power-bi");
  await revisarRedirect("/co/curso-power-bi", "/co/cursos/power-bi");
  await revisarPago();
  await revisarEnlacesInternos();

  for (const linea of ok) console.log(`  OK   ${linea}`);
  for (const linea of avisos) console.log(`  WARN ${linea}`);
  for (const linea of fallos) console.log(`  FAIL ${linea}`);

  console.log(
    `\n${ok.length} comprobaciones OK · ${avisos.length} avisos · ${fallos.length} fallos`
  );

  if (fallos.length > 0) {
    process.exitCode = 1;
  }
}

principal().catch((error) => {
  console.error(`Smoke abortado: ${error.stack || error.message}`);
  process.exitCode = 1;
});
