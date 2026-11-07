#!/usr/bin/env node
/**
 * Verificación del gate de precios y del brochure PDF con precios.
 *
 * Comprueba contra un servidor Next ya levantado (`next start`) que:
 *   A. Las fichas de curso no expongan ningún precio en el HTML inicial y sí
 *      muestren el formulario de 3 campos que abre el brochure.
 *   B. Las rutas de brochure respondan 200 y traigan precio local, horario del
 *      país, los tres profesores, el temario y la acción de descarga.
 *   C. `/precios` muestre el gate antes de desbloquear y no filtre montos.
 *   D. El catálogo `/cursos` tampoco filtre montos.
 *
 * Uso: node scripts/verificar-gate-pdf.mjs [baseUrl]
 * Por defecto apunta a http://127.0.0.1:3220.
 *
 * Sin dependencias: solo `process` y el `fetch` global de Node 18+.
 */

const base = (process.argv[2] || "http://127.0.0.1:3220").replace(/\/$/, "");

/** Montos que jamás deben viajar en el HTML de una ruta pública. */
const PRECIOS_PROHIBIDOS = [
  "169.000",
  "338.000",
  "349.000",
  "159.900",
  "319.900",
  "236.000",
  "235.900",
  "169000",
  "338000",
  "349000",
];

const FICHAS = [
  "/cursos/power-bi",
  "/cursos/analisis-de-datos",
  "/pe/cursos/power-bi",
  "/mx/cursos/python",
];

const BROCHURES = [
  "/cursos/power-bi/brochure",
  "/cursos/analisis-de-datos/brochure",
  "/pe/cursos/power-bi/brochure",
  "/mx/cursos/python/brochure",
];

const PROFESORES = ["Manuel Oliva", "Emanuel Berrocal", "Rodrigo Vega"];

/** Cualquier monto con símbolo de moneda: $169.000, S/ 119, MX$ 2,390... */
const MONTO = /(\$|S\/|MX\$|US\$|ARS|COP|UYU)\s?[\d][\d.,]{2,}/;

const resultados = [];

function mensajeDe(error) {
  return error instanceof Error ? error.message : String(error);
}

/** Registra un PASS o un FAIL y sigue con la siguiente verificación. */
function check(nombre, fn) {
  try {
    fn();
    resultados.push({ ok: true, nombre, motivo: "" });
  } catch (error) {
    resultados.push({ ok: false, nombre, motivo: mensajeDe(error) });
  }
}

/** Trae una ruta y devuelve estado + HTML. Lanza si no hay respuesta. */
async function getHtml(path) {
  const res = await fetch(base + path, { redirect: "follow" });
  return { status: res.status, html: await res.text() };
}

function exigirStatus(pagina) {
  if (pagina.status !== 200) throw new Error(`status ${pagina.status}`);
}

function exigirSinPrecios(html) {
  const encontrado = PRECIOS_PROHIBIDOS.find((cadena) => html.includes(cadena));
  if (encontrado) throw new Error(`encontró "${encontrado}"`);
}

function exigirContiene(html, fragmentos) {
  const faltantes = fragmentos.filter((fragmento) => !html.includes(fragmento));
  if (faltantes.length > 0) {
    throw new Error(`falta ${faltantes.map((f) => `"${f}"`).join(", ")}`);
  }
}

/**
 * Corre las verificaciones de una ruta. Si la ruta no responde, deja un único
 * fallo claro en vez de repetir el mismo error en cada aserción.
 */
async function revisarRuta(etiqueta, path, revisar) {
  let pagina;
  try {
    pagina = await getHtml(path);
  } catch (error) {
    check(`${etiqueta} ${path} responde 200`, () => {
      throw new Error(`sin respuesta (${mensajeDe(error)})`);
    });
    return;
  }

  check(`${etiqueta} ${path} responde 200`, () => exigirStatus(pagina));
  if (pagina.status !== 200) return;
  revisar(pagina);
}

function revisarFicha(path) {
  return revisarRuta("Ficha", path, ({ html }) => {
    check(`Ficha ${path} no expone precios`, () => exigirSinPrecios(html));
    check(`Ficha ${path} tiene los 3 campos del formulario`, () =>
      exigirContiene(html, ['name="name"', 'name="email"', 'name="whatsapp"'])
    );
    check(`Ficha ${path} marca el formulario del gate`, () =>
      exigirContiene(html, ['data-gate-form="brochure"'])
    );
    check(`Ficha ${path} enlaza al brochure`, () => exigirContiene(html, ["/brochure"]));
  });
}

function revisarBrochure(path) {
  return revisarRuta("Brochure", path, ({ html }) => {
    check(`Brochure ${path} incluye a los 3 profesores`, () =>
      exigirContiene(html, PROFESORES)
    );
    check(`Brochure ${path} muestra la hora local del país`, () =>
      exigirContiene(html, ["Hora de"])
    );
    check(`Brochure ${path} muestra un monto en moneda local`, () => {
      if (!MONTO.test(html)) {
        throw new Error("no se encontró ningún monto con símbolo de moneda");
      }
    });
    check(`Brochure ${path} ofrece descargar el PDF`, () =>
      exigirContiene(html, ["Descargar", "PDF"])
    );
    check(`Brochure ${path} incluye el temario`, () => {
      if (!/m[óo]dulo/i.test(html)) {
        throw new Error("no aparece ningún título de módulo");
      }
    });
  });
}

async function main() {
  console.log(`Verificando gate de precios y brochure PDF en ${base}`);

  // Puerta de entrada: si no hay servidor, no tiene sentido seguir.
  try {
    await fetch(`${base}/`, { redirect: "follow" });
  } catch {
    console.error(
      `No hay servidor en ${base}. Levanta \`npx next start -p 3220\` primero.`
    );
    process.exit(1);
  }

  for (const path of FICHAS) {
    await revisarFicha(path);
  }

  for (const path of BROCHURES) {
    await revisarBrochure(path);
  }

  await revisarRuta("Precios", "/precios", ({ html }) => {
    check("Precios /precios no expone precios", () => exigirSinPrecios(html));
    check("Precios /precios muestra el gate de brochure", () =>
      exigirContiene(html, ["Desbloquear", "Brochure"])
    );
  });

  await revisarRuta("Catálogo", "/cursos", ({ html }) => {
    check("Catálogo /cursos no expone precios", () => exigirSinPrecios(html));
  });

  const fallos = resultados.filter((resultado) => !resultado.ok);
  for (const resultado of resultados) {
    const prefijo = resultado.ok ? "[OK]    " : "[FALLA] ";
    const sufijo = resultado.ok ? "" : ` — ${resultado.motivo}`;
    console.log(`${prefijo}${resultado.nombre}${sufijo}`);
  }

  const pasadas = resultados.length - fallos.length;
  console.log("");
  console.log(`${pasadas}/${resultados.length} verificaciones OK`);

  if (fallos.length > 0) {
    console.log("");
    console.log("Fallos:");
    for (const fallo of fallos) {
      console.log(`- ${fallo.nombre} — ${fallo.motivo}`);
    }
  }

  process.exit(fallos.length === 0 ? 0 : 1);
}

await main();
