#!/usr/bin/env node
/**
 * Comprueba las redirecciones 301 del frente WS4 contra un servidor levantado.
 *
 * Uso:
 *   node scripts/verificar-redirecciones.mjs
 *   node scripts/verificar-redirecciones.mjs --base=http://127.0.0.1:3112
 *
 * Por defecto apunta a http://127.0.0.1:3112 (el puerto que usa el orquestador
 * para `next start`). Para cada ruta exige:
 *   1. status 301 o 308 (Next usa 308 con `permanent: true`, Vercel 301);
 *   2. una cabecera Location cuyo path sea el destino esperado;
 *   3. que el destino responda 200.
 *
 * Sale con código 1 si alguna comprobación falla. No necesita dependencias.
 */

const args = process.argv.slice(2);

function arg(nombre, porDefecto = "") {
  const prefijo = `--${nombre}=`;
  const encontrado = args.find((a) => a.startsWith(prefijo));
  if (encontrado) return encontrado.slice(prefijo.length).trim();
  const posicional = args.find((a) => !a.startsWith("--"));
  return posicional || porDefecto;
}

const base = arg("base", "http://127.0.0.1:3112").replace(/\/+$/, "");

/**
 * Lista A del brief. `hacia` admite más de un destino solo en /pages/webinar:
 * next.config manda a /clase-gratis con NEXT_PUBLIC_CLASE_GRATIS=1 y a /cursos
 * en cualquier otro caso (y vercel.json siempre a /cursos).
 */
const REDIRECCIONES = [
  { desde: "/pages", hacia: ["/cursos"] },
  { desde: "/pages/cursos", hacia: ["/cursos"] },
  { desde: "/pages/cursos-1", hacia: ["/cursos"] },
  { desde: "/pages/bootcamp", hacia: ["/cursos/analisis-de-datos"] },
  { desde: "/pages/contact", hacia: ["/empresas"] },
  { desde: "/pages/webinar", hacia: ["/cursos", "/clase-gratis"] },
  { desde: "/campus", hacia: ["/login"] },
  { desde: "/cart", hacia: ["/cursos"] },
  { desde: "/recommendations/products", hacia: ["/cursos"] },
  { desde: "/recommendations/products/123", hacia: ["/cursos"] },
  { desde: "/apps/algo", hacia: ["/cursos"] },
  { desde: "/products/excel", hacia: ["/cursos/excel"] },
  {
    desde: "/products/curso-analisis-de-datos-para-la-mineria",
    hacia: ["/cursos/analitica-mineria"],
  },
  {
    desde: "/products/curso-de-analisis-de-datos-para-el-sector-financiero",
    hacia: ["/cursos/mercado-financiero"],
  },
  { desde: "/products/sql-server-program-bi", hacia: ["/cursos/sql-server"] },
  // Familia /products sin regla específica: cae en el comodín final (/cursos
  // en next.config.ts, ficha de machine learning en vercel.json).
  {
    desde: "/products/machine-learning-program-bi",
    hacia: ["/cursos/machine-learning", "/cursos"],
  },
  { desde: "/apps/ecomposer-visual-page-builder", hacia: ["/cursos"] },
  { desde: "/consultorias", hacia: ["/empresas"] },
  { desde: "/programa-bi", hacia: ["/cursos"] },
  { desde: "/programa-bi/power-bi", hacia: ["/cursos"] },
];

function pathDe(location, actual) {
  try {
    return new URL(location, `${base}${actual}`).pathname;
  } catch {
    return location;
  }
}

function pintarFilas(filas) {
  const columnas = ["RUTA", "ESPERADO", "ESTADO", "LOCATION", "FINAL"];
  const anchos = columnas.map((c, i) =>
    Math.max(c.length, ...filas.map((fila) => String(fila[i]).length))
  );
  const linea = (valores) =>
    valores.map((valor, i) => String(valor).padEnd(anchos[i])).join("  ");

  console.log(linea(columnas));
  console.log(anchos.map((ancho) => "─".repeat(ancho)).join("  "));
  for (const fila of filas) console.log(linea(fila));
}

async function comprobar({ desde, hacia }) {
  const esperado = hacia.join(" | ");
  let res;
  try {
    res = await fetch(`${base}${desde}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    return { desde, esperado, estado: "error", location: err.message, final: "—", ok: false };
  }

  const location = res.headers.get("location") || "";
  const estado = String(res.status);
  const permitido = res.status === 301 || res.status === 308;
  const destino = pathDe(location, desde);
  const destinoOk = hacia.includes(destino);

  if (!permitido || !destinoOk) {
    // Consumir el cuerpo evita dejar sockets colgados con keep-alive.
    await res.text().catch(() => {});
    return {
      desde,
      esperado,
      estado,
      location: location || "(sin Location)",
      final: "—",
      ok: false,
    };
  }

  await res.text().catch(() => {});

  let final;
  try {
    final = await fetch(`${base}${destino}`, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
  } catch (err) {
    return { desde, esperado, estado, location: destino, final: err.message, ok: false };
  }

  const cuerpo = await final.text().catch(() => "");
  return {
    desde,
    esperado,
    estado,
    location: destino,
    final: String(final.status),
    ok: final.status === 200 && cuerpo.length > 0,
  };
}

async function main() {
  console.log(`Base: ${base}\n`);

  const resultados = [];
  for (const redireccion of REDIRECCIONES) {
    resultados.push(await comprobar(redireccion));
  }

  pintarFilas(
    resultados.map((r) => [r.desde, r.esperado, r.estado, r.location, r.final])
  );

  const fallos = resultados.filter((r) => !r.ok);
  console.log(
    `\n${resultados.length - fallos.length}/${resultados.length} redirecciones correctas.`
  );

  if (fallos.length) {
    console.error("\nFallos:");
    for (const fallo of fallos) {
      console.error(
        `  ✗ ${fallo.desde} → estado ${fallo.estado}, Location «${fallo.location}», final ${fallo.final} (esperado ${fallo.esperado})`
      );
    }
    process.exit(1);
  }

  console.log("✓ Todas las redirecciones devuelven 301/308 y el destino responde 200.");
}

main().catch((err) => {
  console.error(`\n✗ ${err?.stack || err}\n`);
  process.exit(1);
});
