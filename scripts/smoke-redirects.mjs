#!/usr/bin/env node
/**
 * Smoke de redirecciones legacy (WS2) — sin dependencias.
 *
 * Uso:
 *   node scripts/smoke-redirects.mjs                      # http://localhost:3107
 *   node scripts/smoke-redirects.mjs http://localhost:3107
 *   node scripts/smoke-redirects.mjs https://www.programbi.com   # solo lectura
 *
 * Para cada fila de la tabla:
 *   1. pide la URL con `redirect: "manual"` y exige 301 (o 308);
 *   2. compara el `Location` con el destino esperado (path + #ancla);
 *   3. pide el destino con `redirect: "manual"` y exige 200 —así se detecta
 *      cualquier cadena de redirecciones, no solo el primer salto—.
 *
 * Sale con código 1 si alguna fila falla. La tabla es la misma que rige en
 * `vercel.json` (fuente de verdad) y en `next.config.ts` (réplica para
 * `next start` local).
 *
 * Única excepción documentada: `/pages/` con barra final. La plataforma
 * (Vercel y también `next start`) normaliza la barra final con un 308 a
 * `/pages` ANTES de evaluar la tabla de redirects; desde ahí la regla 301
 * lleva a `/cursos`. Son dos saltos de plataforma, no una cadena de reglas:
 * se marca como "normalización" y se acepta solo en esa fila.
 */

const BASE = (process.argv[2] || "http://localhost:3107").replace(/\/+$/, "");
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 20000);

/**
 * Tabla URL → destino esperado.
 * `pais` recuerda de dónde salió la URL (GSC / Shopify / WordPress).
 * `barraFinal` marca la única fila donde se tolera la normalización 308.
 */
const TABLA = [
  // ── Las 11 URLs 404 de Search Console ────────────────────────────────
  { url: "/pages/", destino: "/cursos", origen: "GSC 404", barraFinal: true },
  { url: "/consultorias", destino: "/empresas", origen: "GSC 404" },
  { url: "/campus", destino: "/login", origen: "GSC 404" },
  { url: "/pages/cursos", destino: "/cursos", origen: "GSC 404" },
  { url: "/pages/contact", destino: "/empresas#contacto", origen: "GSC 404" },
  { url: "/pages/cursos-1", destino: "/cursos", origen: "GSC 404" },
  { url: "/pages/bootcamp", destino: "/cursos/analisis-de-datos", origen: "GSC 404" },
  { url: "/apps/ecomposer-visual-page-builder", destino: "/cursos", origen: "GSC 404" },
  {
    url: "/products/machine-learning-program-bi",
    destino: "/cursos/machine-learning",
    origen: "GSC 404",
  },
  { url: "/pages/bootcamps", destino: "/cursos/analisis-de-datos", origen: "GSC 404" },
  { url: "/products/big-data-program-bi", destino: "/cursos", origen: "GSC 404" },

  // ── Reglas nuevas/corregidas del encargo ─────────────────────────────
  { url: "/pages/contacto", destino: "/empresas#contacto", origen: "WS2" },
  { url: "/contacto", destino: "/empresas#contacto", origen: "WS2" },
  { url: "/pages/empresas", destino: "/empresas", origen: "WS2" },
  { url: "/blogs/news", destino: "/blog", origen: "WS2" },
  { url: "/blogs/noticias", destino: "/blog", origen: "WS2" },
  { url: "/blogs/news/cualquier-post", destino: "/blog", origen: "WS2" },
  { url: "/pages/bootcamps/talento", destino: "/cursos/analisis-de-datos", origen: "WS2" },
  { url: "/account", destino: "/login", origen: "WS2" },
  { url: "/account/perfil", destino: "/login", origen: "WS2" },
  { url: "/auth/login", destino: "/login", origen: "WS2" },
  { url: "/checkout", destino: "/cursos", origen: "WS2" },
  { url: "/search", destino: "/cursos", origen: "WS2" },

  // ── /products/* de Shopify (específicas antes que el comodín) ────────
  { url: "/products/curso-power-bi", destino: "/cursos/power-bi", origen: "Shopify" },
  { url: "/products/curso-de-power-bi", destino: "/cursos/power-bi", origen: "Shopify" },
  { url: "/products/curso-power-bi-online", destino: "/cursos/power-bi", origen: "Shopify" },
  { url: "/products/power-bi-program-bi", destino: "/cursos/power-bi", origen: "Shopify" },
  { url: "/products/curso-analisis-de-datos", destino: "/cursos/analisis-de-datos", origen: "Shopify" },
  { url: "/products/curso-sql", destino: "/cursos/sql-server", origen: "Shopify" },
  { url: "/products/sql-server-program-bi", destino: "/cursos/sql-server", origen: "Shopify" },
  { url: "/products/python-program-bi", destino: "/cursos/python", origen: "Shopify" },
  { url: "/products/excel-avanzado", destino: "/cursos/excel", origen: "Shopify" },
  { url: "/products/curso-power-automate", destino: "/cursos/power-automate", origen: "Shopify" },
  { url: "/products/machine-learning", destino: "/cursos/machine-learning", origen: "Shopify" },
  {
    url: "/products/curso-analisis-de-datos-para-la-mineria",
    destino: "/cursos/analitica-mineria",
    origen: "Shopify",
  },
  {
    url: "/products/curso-de-analisis-de-datos-para-el-sector-financiero",
    destino: "/cursos/mercado-financiero",
    origen: "Shopify",
  },
  { url: "/products/big-data", destino: "/cursos", origen: "comodín" },
  { url: "/products/handle-inventado-xyz", destino: "/cursos", origen: "comodín" },

  // ── Reglas que ya existían y se mantienen ────────────────────────────
  { url: "/pages", destino: "/cursos", origen: "legacy" },
  { url: "/pages/webinar", destino: "/cursos", origen: "legacy" },
  { url: "/cart", destino: "/cursos", origen: "legacy" },
  { url: "/collections/all", destino: "/cursos", origen: "legacy" },
  { url: "/recommendations/products?producto=1", destino: "/cursos", origen: "legacy" },
  { url: "/programa-bi", destino: "/cursos", origen: "legacy" },
  { url: "/programa-bi/power-bi", destino: "/cursos", origen: "legacy" },
  { url: "/cursos/copilot-studio", destino: "/cursos/copilot", origen: "legacy" },
  { url: "/cursos/analitica-financiera", destino: "/cursos/mercado-financiero", origen: "legacy" },
  {
    url: "/co/cursos/analitica-financiera",
    destino: "/co/cursos/mercado-financiero",
    origen: "legacy",
  },
];

/**
 * Rutas que deben responder 200 sin redirigir. Detecta loops y reglas que se
 * comen páginas reales. No se incluyen las que exigen sesión (/ai,
 * /comunidad/ajustes) porque su 307 a /login es intencional.
 */
const DIRECTAS = [
  "/cursos",
  "/cursos/power-bi",
  "/cursos/analisis-de-datos",
  "/cursos/analitica-mineria",
  "/cursos/machine-learning",
  "/empresas",
  "/blog",
  "/login",
];

function unir(base, ruta) {
  return `${base}${ruta.startsWith("/") ? ruta : `/${ruta}`}`;
}

/** Devuelve { pathname, hash } de un Location, resolviéndolo contra la URL pedida. */
function partesLocation(location, pedida) {
  const resuelta = new URL(location, pedida);
  return { pathname: resuelta.pathname.replace(/\/+$/, "") || "/", hash: resuelta.hash };
}

function partesDestino(destino) {
  const [pathname, hash = ""] = destino.split("#");
  return { pathname: pathname.replace(/\/+$/, "") || "/", hash: hash ? `#${hash}` : "" };
}

async function pedir(url) {
  const res = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "user-agent": "ProgramBI-SmokeRedirects/1.0 (+SEO WS2)" },
  });
  await res.text().catch(() => {});
  return res;
}

async function comprobarFila(fila) {
  const pedida = unir(BASE, fila.url);
  const esperado = partesDestino(fila.destino);
  let res;
  try {
    res = await pedir(pedida);
  } catch (err) {
    return { ...fila, estado: "ERROR", location: err.message, final: "—", ok: false, saltos: 0 };
  }

  const location = res.headers.get("location") || "";
  const estado = res.status;

  // Normalización de barra final: 308 a la misma ruta sin la barra.
  if (fila.barraFinal && estado === 308) {
    const sinBarra = fila.url.replace(/\/+$/, "").replace(/\/+$/, "") || "/";
    const paso = partesLocation(location, pedida);
    if (paso.pathname !== sinBarra) {
      return { ...fila, estado: String(estado), location, final: "—", ok: false, saltos: 1 };
    }
    let res2;
    try {
      res2 = await pedir(unir(BASE, sinBarra));
    } catch (err) {
      return { ...fila, estado: "ERROR", location: err.message, final: "—", ok: false, saltos: 1 };
    }
    const location2 = res2.headers.get("location") || "";
    const destino2 = partesLocation(location2, unir(BASE, sinBarra));
    const coincide2 = destino2.pathname === esperado.pathname && destino2.hash === esperado.hash;
    const ok2 = (res2.status === 301 || res2.status === 308) && coincide2;
    if (!ok2) {
      return {
        ...fila,
        estado: `${estado}→${res2.status}`,
        location: location2 || location,
        final: "—",
        ok: false,
        saltos: 2,
      };
    }
    return comprobarDestino(fila, esperado, `${estado}→${res2.status}`, location2, 2);
  }

  const permitido = estado === 301 || estado === 308;
  const destino = partesLocation(location, pedida);
  const coincide = destino.pathname === esperado.pathname && destino.hash === esperado.hash;

  if (!permitido || !coincide) {
    return { ...fila, estado: String(estado), location: location || "(sin Location)", final: "—", ok: false, saltos: 1 };
  }

  return comprobarDestino(fila, esperado, String(estado), location, 1);
}

async function comprobarDestino(fila, esperado, estado, location, saltos) {
  let res;
  try {
    res = await pedir(unir(BASE, esperado.pathname));
  } catch (err) {
    return { ...fila, estado, location, final: `ERROR: ${err.message}`, ok: false, saltos };
  }
  const final = String(res.status);
  return {
    ...fila,
    estado,
    location,
    final,
    ok: res.status === 200,
    saltos,
  };
}

async function comprobarDirecta(ruta) {
  const pedida = unir(BASE, ruta);
  let res;
  try {
    res = await pedir(pedida);
  } catch (err) {
    return { ruta, estado: "ERROR", ok: false, detalle: err.message };
  }
  const ok = res.status === 200;
  const location = res.headers.get("location");
  return {
    ruta,
    estado: String(res.status),
    ok,
    detalle: location ? `→ ${location}` : "",
  };
}

function tabla(filas) {
  const columnas = ["URL", "ORIGEN", "ESPERADO", "STATUS", "FINAL", "SALTOS", "OK"];
  const datos = filas.map((f) => [
    f.url,
    f.origen,
    f.destino,
    f.estado,
    f.final,
    String(f.saltos),
    f.ok ? "✓" : "✗",
  ]);
  const anchos = columnas.map((c, i) =>
    Math.max(c.length, ...datos.map((fila) => String(fila[i]).length))
  );
  const linea = (valores) =>
    valores.map((valor, i) => String(valor).padEnd(anchos[i])).join("  ");
  console.log(linea(columnas));
  console.log(anchos.map((ancho) => "─".repeat(ancho)).join("  "));
  for (const fila of datos) console.log(linea(fila));
}

async function main() {
  console.log(`Smoke de redirecciones WS2 · base: ${BASE}\n`);

  const resultados = [];
  for (const fila of TABLA) {
    resultados.push(await comprobarFila(fila));
  }

  tabla(resultados);

  const fallos = resultados.filter((r) => !r.ok);
  const conSaltoDoble = resultados.filter((r) => r.ok && r.saltos > 1);
  console.log(
    `\n${resultados.length - fallos.length}/${resultados.length} redirecciones correctas (301/308 → 200, sin cadena).`
  );
  if (conSaltoDoble.length) {
    console.log(
      `Nota: ${conSaltoDoble.length} fila(s) con normalización de barra final de la plataforma: ` +
        conSaltoDoble.map((r) => r.url).join(", ")
    );
  }

  const directas = [];
  for (const ruta of DIRECTAS) {
    directas.push(await comprobarDirecta(ruta));
  }
  console.log("\nRutas reales que no deben redirigir:");
  for (const d of directas) {
    console.log(`  ${d.ok ? "✓" : "✗"} ${d.ruta.padEnd(32)} ${d.estado} ${d.detalle}`);
  }
  const fallosDirectas = directas.filter((d) => !d.ok);

  if (fallos.length || fallosDirectas.length) {
    console.error("\nFallos:");
    for (const f of fallos) {
      console.error(
        `  ✗ ${f.url} → status ${f.estado}, Location «${f.location}», final ${f.final} (esperado ${f.destino})`
      );
    }
    for (const f of fallosDirectas) {
      console.error(`  ✗ ${f.ruta} debería dar 200 y dio ${f.estado} ${f.detalle}`);
    }
    process.exit(1);
  }

  console.log("\n✓ Todas las URLs legacy llegan a su destino con 200 en un salto. Sin cadenas ni loops.");
}

main().catch((err) => {
  console.error(`\n✗ ${err?.stack || err}\n`);
  process.exit(1);
});
