#!/usr/bin/env node
/**
 * Suite de verificación del brochure v2.
 *
 * Comprueba, contra el repo y un servidor Next ya levantado, que el visor
 * estudio del brochure está completo y usa activos locales reales:
 *
 *   A. Activos en disco: fotos de los profesores (JPEG > 10 KB), logos de
 *      marca, los 12 logos de empresas, galerías de capturas y los 13 heroes
 *      del catálogo.
 *   B. Los mismos activos por HTTP: status 200 y `content-type` de imagen.
 *   C. Las 4 rutas de brochure del contrato: visor v2, 6 hojas fijas A4,
 *      tipografía legible (>= 10.5px en cada hoja), logo, fotos, cero
 *      `mail.programbi.com`, logos de empresas, capturas, certificado, precio
 *      local, cuotas, horario local, calendario, temario completo y llamadas
 *      a la acción.
 *   D. Consistencia de país: Chile y Perú no pueden mostrar el mismo monto.
 *
 * Uso: node scripts/verificar-brochure-v2.mjs [baseUrl]
 * Por defecto apunta a http://127.0.0.1:3220.
 *
 * Sin dependencias: solo `node:fs`, `node:path` y el `fetch` global de Node 18+.
 * Debe ejecutarse desde la raíz del repo (`process.cwd()`).
 */

import { readFileSync, statSync } from "node:fs";
import path from "node:path";

const base = (process.argv[2] || "http://127.0.0.1:3220").replace(/\/+$/, "");
const RAIZ = process.cwd();

/** Los 3 profesores del brochure, con su foto local en alta resolución. */
const MENTORES = ["manuel-oliva", "emanuel-berrocal", "rodrigo-vega"];

/** Wordmarks de marca: horizontal, barra de navegación y sello cuadrado. */
const LOGOS_MARCA = [
  "public/images/logo.png",
  "public/images/logo-nav.webp",
  "public/logo.png",
];

/** Los 12 logos reales de empresas que ya capacitaron equipos. */
const EMPRESAS = [
  "anglo-american",
  "deloitte",
  "banco-chile",
  "sqm",
  "cencosud",
  "bci",
  "tottus",
  "midea",
  "pucobre",
  "bridgestone",
  "verisure",
  "fonasa",
];

/** Cursos con galería propia de capturas de clases. */
const GALERIAS = ["power-bi", "python", "sql-server", "analisis-de-datos"];

/** Heroes oficiales (`<slug>.jpg`) de todo el catálogo. */
const HEROES = [
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

/** Las 4 rutas del contrato del brochure v2. */
const PAGINAS = [
  "/cursos/power-bi/brochure",
  "/pe/cursos/power-bi/brochure",
  "/mx/cursos/python/brochure",
  "/co/cursos/analisis-de-datos/brochure",
];

/** Títulos del temario estático de Power BI: basta con 3 de esta lista. */
const TITULOS_POWER_BI = [
  "Introducción",
  "DAX",
  "Power Query",
  "Visualizaciones",
  "Inteligencia de Tiempo",
  "Botones",
];

/**
 * Monto con símbolo de moneda local: $169.000, S/ 349, MX$ 2,390, COP 299.900…
 * Los símbolos compuestos van primero para no perder el prefijo al hacer match.
 */
const MONTO = /(MX\$|US\$|S\/|COP|ARS|₡|\$)\s?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/gi;

const resultados = [];

function mensajeDe(error) {
  return error instanceof Error ? error.message : String(error);
}

/** Registra un PASS o un FAIL de una comprobación síncrona y sigue. */
function check(nombre, fn) {
  try {
    fn();
    resultados.push({ ok: true, nombre, motivo: "" });
  } catch (error) {
    resultados.push({ ok: false, nombre, motivo: mensajeDe(error) });
  }
}

/** Registra un PASS o un FAIL de una comprobación asíncrona y sigue. */
async function checkAsync(nombre, fn) {
  try {
    await fn();
    resultados.push({ ok: true, nombre, motivo: "" });
  } catch (error) {
    resultados.push({ ok: false, nombre, motivo: mensajeDe(error) });
  }
}

/** ¿Existe el archivo dentro del repo? */
function existeArchivo(rutaRel) {
  try {
    return statSync(path.resolve(RAIZ, rutaRel)).isFile();
  } catch {
    return false;
  }
}

/** Tamaño en bytes de un archivo del repo. Lanza si no existe. */
function tamanioArchivo(rutaRel) {
  return statSync(path.resolve(RAIZ, rutaRel)).size;
}

/** Exige que existan todos los archivos y que no estén vacíos. */
function exigirArchivos(rutas, minimo = 1) {
  const faltan = rutas.filter(
    (ruta) => !existeArchivo(ruta) || tamanioArchivo(ruta) < minimo
  );
  if (faltan.length > 0) {
    throw new Error(`faltan o están vacíos: ${faltan.join(", ")}`);
  }
}

/** Trae una ruta del servidor y devuelve status + HTML. Lanza si no responde. */
async function traerHtml(ruta) {
  const res = await fetch(base + ruta, { redirect: "follow" });
  return { status: res.status, html: await res.text() };
}

/** Convierte el HTML en texto plano para chequear frases que pueden ir en tags. */
function textoPlano(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Pasa a minúsculas y quita tildes para comparar textos de forma robusta. */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Extrae cada hoja A4 (desde data-brochure-sheet="N" hasta su </footer>)
 * y devuelve el fontSize mínimo encontrado en estilos inline.
 */
function tamanosPorHoja(html) {
  const hojas = [];
  const re = /data-brochure-sheet="(\d+)"[\s\S]*?<\/footer>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const bloque = m[0];
    const valores = [...bloque.matchAll(/font-size:\s*([\d.]+)px/g)].map((x) =>
      parseFloat(x[1])
    );
    if (valores.length > 0) {
      hojas.push({ numero: Number(m[1]), minimo: Math.min(...valores) });
    }
  }
  return hojas;
}

/** Cuenta las apariciones de «módulo» sin importar mayúsculas ni acentos. */
function contarModulos(html) {
  return (html.match(/m[óo]dulo/gi) || []).length;
}

/** Extrae todos los montos con símbolo de moneda del HTML, en orden. */
function extraerMontos(html) {
  // Sin scripts ni estilos: los nombres de chunk (`...s/7289.js`) parecen
  // montos en soles y arruinaban la comparación Chile vs Perú.
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ");
  const salida = [];
  for (const coincidencia of visible.matchAll(MONTO)) {
    const bruto = coincidencia[0];
    const simbolo = coincidencia[1].toUpperCase();
    const digitos = bruto.replace(/[^\d]/g, "");
    if (!digitos) continue;
    salida.push({
      bruto,
      simbolo,
      valor: Number(digitos),
      tieneSeparador: /[.,]\d{3}/.test(bruto),
    });
  }
  return salida;
}

/** ¿La ruta es la del curso Power BI? (solo ahí exigimos títulos conocidos). */
function esPowerBi(ruta) {
  return /\/power-bi\/brochure$/.test(ruta);
}

// ---------------------------------------------------------------------------
// A. Activos en disco
// ---------------------------------------------------------------------------

/** Fotos de los profesores: existen, pesan > 10.240 bytes y son JPEG. */
function revisarFotosProfesores() {
  for (const slug of MENTORES) {
    const ruta = `public/images/mentors/${slug}.jpg`;
    check(`Activo ${ruta} (JPEG > 10 KB)`, () => {
      if (!existeArchivo(ruta)) throw new Error("no existe");
      const tamano = tamanioArchivo(ruta);
      if (tamano <= 10240) {
        throw new Error(`pesa ${tamano} bytes (se esperan más de 10.240)`);
      }
      const cabecera = readFileSync(path.resolve(RAIZ, ruta)).subarray(0, 3);
      const esJpeg =
        cabecera[0] === 0xff && cabecera[1] === 0xd8 && cabecera[2] === 0xff;
      if (!esJpeg) {
        throw new Error(
          `no empieza con bytes JPEG (${[...cabecera]
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join(" ")})`
        );
      }
    });
  }
}

/** Logos de marca, logos de empresas, galerías y heroes del catálogo. */
function revisarActivosDeMarca() {
  check("Activos de marca (logo.png, logo-nav.webp, logo.png raíz)", () => {
    exigirArchivos(LOGOS_MARCA, 1024);
  });

  check(`Los ${EMPRESAS.length} logos de empresas en disco`, () => {
    exigirArchivos(
      EMPRESAS.map((nombre) => `public/images/logos/${nombre}.webp`),
      1024
    );
  });

  check(`Galerías ${GALERIAS.length} × 2 capturas en disco`, () => {
    const rutas = GALERIAS.flatMap((slug) => [
      `public/images/courses/galeria/${slug}/01.webp`,
      `public/images/courses/galeria/${slug}/02.webp`,
    ]);
    exigirArchivos(rutas, 1024);
  });

  check(`Los ${HEROES.length} heroes del catálogo en disco`, () => {
    exigirArchivos(
      HEROES.map((slug) => `public/images/courses/${slug}.jpg`),
      1024
    );
  });
}

// ---------------------------------------------------------------------------
// B. Activos por HTTP
// ---------------------------------------------------------------------------

/** Rutas públicas equivalentes a los activos de disco (sin duplicados). */
function rutasPublicas() {
  const rutas = [
    ...MENTORES.map((slug) => `/images/mentors/${slug}.jpg`),
    "/images/logo.png",
    "/images/logo-nav.webp",
    "/logo.png",
    ...EMPRESAS.map((nombre) => `/images/logos/${nombre}.webp`),
    ...GALERIAS.flatMap((slug) => [
      `/images/courses/galeria/${slug}/01.webp`,
      `/images/courses/galeria/${slug}/02.webp`,
    ]),
    ...HEROES.map((slug) => `/images/courses/${slug}.jpg`),
  ];
  return [...new Set(rutas)];
}

/** Cada activo debe responder 200 con `content-type` de imagen y cuerpo. */
async function revisarActivosHttp() {
  for (const ruta of rutasPublicas()) {
    await checkAsync(`Activo HTTP ${ruta}`, async () => {
      const res = await fetch(base + ruta, { redirect: "follow" });
      if (res.status !== 200) throw new Error(`status ${res.status}`);
      const tipo = (res.headers.get("content-type") || "").toLowerCase();
      if (!tipo.startsWith("image/")) {
        throw new Error(`content-type "${tipo || "sin content-type"}"`);
      }
      const cuerpo = await res.arrayBuffer();
      if (cuerpo.byteLength === 0) throw new Error("cuerpo vacío");
    });
  }
}

// ---------------------------------------------------------------------------
// C. HTML de las 4 rutas del brochure
// ---------------------------------------------------------------------------

/** Verifica una ruta del brochure ya descargada. */
function revisarBrochure(ruta, html) {
  check(`Brochure ${ruta} usa el visor estudio v2`, () => {
    if (!html.includes('data-brochure-studio="v2"')) {
      throw new Error('falta data-brochure-studio="v2"');
    }
  });

  check(`Brochure ${ruta} tiene las 6 hojas fijas A4`, () => {
    const faltan = [1, 2, 3, 4, 5, 6].filter(
      (numero) => !html.includes(`data-brochure-sheet="${numero}"`)
    );
    if (faltan.length > 0) {
      throw new Error(`faltan las hojas ${faltan.join(", ")}`);
    }
  });

  check(`Brochure ${ruta} usa tipografía >= 10.5px en todas las hojas`, () => {
    const hojas = tamanosPorHoja(html);
    if (hojas.length === 0) {
      throw new Error("no se pudieron medir las hojas");
    }
    const pequenas = hojas.filter((hoja) => hoja.minimo < 10.5);
    if (pequenas.length > 0) {
      const detalle = pequenas
        .map((hoja) => `hoja ${hoja.numero}: ${hoja.minimo}px`)
        .join(", ");
      throw new Error(`hay tipografía menor a 10.5px (${detalle})`);
    }
  });

  check(`Brochure ${ruta} muestra el logo de marca`, () => {
    if (
      !html.includes("/images/logo.png") &&
      !html.includes("/images/logo-nav.webp")
    ) {
      throw new Error("no aparece /images/logo.png ni /images/logo-nav.webp");
    }
  });

  check(`Brochure ${ruta} usa las 3 fotos locales de profesores`, () => {
    const faltan = MENTORES.map((slug) => `/images/mentors/${slug}.jpg`).filter(
      (foto) => !html.includes(foto)
    );
    if (faltan.length > 0) throw new Error(`faltan ${faltan.join(", ")}`);
  });

  check(`Brochure ${ruta} no filtra mail.programbi.com`, () => {
    const fugas = html.split("mail.programbi.com").length - 1;
    if (fugas > 0) {
      throw new Error(`${fugas} ocurrencia(s) de mail.programbi.com`);
    }
  });

  check(`Brochure ${ruta} muestra logos reales de empresas`, () => {
    const encontrados = new Set(
      [...html.matchAll(/\/images\/logos\/([a-z0-9-]+)\.webp/gi)].map(
        (coincidencia) => coincidencia[1].toLowerCase()
      )
    );
    const obligatorios = ["anglo-american", "deloitte", "banco-chile", "sqm"];
    const faltanObligatorios = obligatorios.filter(
      (nombre) => !encontrados.has(nombre)
    );
    if (faltanObligatorios.length > 0) {
      throw new Error(`faltan ${faltanObligatorios.join(", ")}`);
    }
    if (encontrados.size < 8) {
      throw new Error(`solo ${encontrados.size} logos distintos (mínimo 8)`);
    }
  });

  check(`Brochure ${ruta} incluye capturas de clases`, () => {
    const capturas = new Set(
      [...html.matchAll(/\/images\/courses\/galeria\/[a-z0-9-]+\/\d{2}\.webp/gi)].map(
        (coincidencia) => coincidencia[0].toLowerCase()
      )
    );
    if (capturas.size < 2) {
      throw new Error(
        `solo ${capturas.size} captura(s) de /images/courses/galeria/ (mínimo 2)`
      );
    }
  });

  check(`Brochure ${ruta} muestra el certificado`, () => {
    const texto = textoPlano(html);
    if (!texto.includes("CERTIFICADO DE FINALIZACIÓN")) {
      throw new Error('falta el texto "CERTIFICADO DE FINALIZACIÓN"');
    }
  });

  check(`Brochure ${ruta} muestra el precio local`, () => {
    const montos = extraerMontos(html);
    // Los mercados con precios de 3 dígitos (Perú: S/ 349) no llevan separador
    // de miles; aceptamos cualquier monto plausible (100+) o con separador.
    const validos = montos.filter(
      (monto) => monto.tieneSeparador || monto.valor >= 100
    );
    if (validos.length === 0) {
      const muestra = montos
        .slice(0, 3)
        .map((monto) => monto.bruto)
        .join(", ");
      throw new Error(
        montos.length > 0
          ? `solo hay montos no plausibles: ${muestra}`
          : "no aparece ningún monto con símbolo de moneda local"
      );
    }
  });

  check(`Brochure ${ruta} ofrece 3 cuotas sin interés`, () => {
    if (!/3\s*cuotas/i.test(html) && !/cuotas sin inter[ée]s/i.test(html)) {
      throw new Error('no aparece "3 cuotas" ni "cuotas sin interés"');
    }
  });

  check(`Brochure ${ruta} muestra la hora local del país`, () => {
    if (!html.includes("Hora de")) throw new Error('falta "Hora de"');
  });

  check(`Brochure ${ruta} incluye la hoja de calendario`, () => {
    const texto = normalizar(textoPlano(html));
    const frases = [
      "Próximas fechas de inicio",
      "La misma clase en vivo en cada país",
    ];
    const faltan = frases.filter((frase) => !texto.includes(normalizar(frase)));
    if (faltan.length > 0) {
      throw new Error(`falta ${faltan.map((frase) => `"${frase}"`).join(", ")}`);
    }
  });

  check(`Brochure ${ruta} incluye el temario detallado`, () => {
    if (
      !normalizar(textoPlano(html)).includes(
        normalizar("Programa Académico Detallado")
      )
    ) {
      throw new Error('falta el texto "Programa Académico Detallado"');
    }
  });

  check(`Brochure ${ruta} trae el temario completo`, () => {
    const modulos = contarModulos(html);
    if (modulos < 10) {
      throw new Error(`solo ${modulos} ocurrencias de "MÓDULO" (mínimo 10)`);
    }
    if (esPowerBi(ruta)) {
      const normalizado = html.toLowerCase();
      const titulos = TITULOS_POWER_BI.filter((titulo) =>
        normalizado.includes(titulo.toLowerCase())
      );
      if (titulos.length < 3) {
        throw new Error(
          `solo ${titulos.length} título(s) conocido(s) de Power BI: ${
            titulos.join(", ") || "ninguno"
          }`
        );
      }
    }
  });

  check(`Brochure ${ruta} ofrece Descargar PDF`, () => {
    if (!textoPlano(html).includes("Descargar PDF")) {
      throw new Error('falta el texto "Descargar PDF"');
    }
  });

  check(`Brochure ${ruta} ofrece Inscribirme`, () => {
    if (!/inscribirme/i.test(html)) throw new Error('falta "Inscribirme"');
  });
}

/** Descarga una ruta y, si responde 200, corre sus verificaciones. */
async function revisarPagina(ruta) {
  let pagina;
  try {
    pagina = await traerHtml(ruta);
  } catch (error) {
    check(`Brochure ${ruta} responde 200`, () => {
      throw new Error(`sin respuesta (${mensajeDe(error)})`);
    });
    return;
  }

  check(`Brochure ${ruta} responde 200`, () => {
    if (pagina.status !== 200) throw new Error(`status ${pagina.status}`);
  });

  // Un solo fallo por ruta caída: no repetimos el mismo error 12 veces.
  if (pagina.status !== 200) return;

  revisarBrochure(ruta, pagina.html);
}

// ---------------------------------------------------------------------------
// D. Consistencia de país
// ---------------------------------------------------------------------------

/** Chile y Perú deben mostrar montos distintos en el mismo curso. */
async function revisarPreciosPorPais() {
  await checkAsync("Precio distinto entre Chile y Perú (país aplicado)", async () => {
    const chile = await traerHtml("/cursos/power-bi/brochure");
    const peru = await traerHtml("/pe/cursos/power-bi/brochure");
    if (chile.status !== 200) throw new Error(`Chile status ${chile.status}`);
    if (peru.status !== 200) throw new Error(`Perú status ${peru.status}`);

    const montoChile = extraerMontos(chile.html)[0];
    const montoPeru = extraerMontos(peru.html)[0];
    if (!montoChile) throw new Error("Chile no muestra ningún monto");
    if (!montoPeru) throw new Error("Perú no muestra ningún monto");

    const mismos =
      montoChile.bruto === montoPeru.bruto ||
      (montoChile.valor === montoPeru.valor &&
        montoChile.simbolo === montoPeru.simbolo);
    if (mismos) {
      throw new Error(
        `ambos muestran "${montoChile.bruto}"; el país no se está aplicando`
      );
    }
  });
}

// ---------------------------------------------------------------------------

async function main() {
  console.log(`Verificando el brochure v2 en ${base}`);
  console.log(`Raíz del repo: ${RAIZ}`);

  // Puerta de entrada: sin servidor no tiene sentido seguir.
  try {
    await fetch(`${base}/`, { redirect: "follow" });
  } catch {
    console.error(
      `No hay servidor en ${base}. Levanta \`npx next start -p 3220\` primero.`
    );
    process.exit(1);
  }

  // A. Disco.
  revisarFotosProfesores();
  revisarActivosDeMarca();

  // B. HTTP de activos.
  await revisarActivosHttp();

  // C. Rutas del brochure.
  for (const ruta of PAGINAS) {
    await revisarPagina(ruta);
  }

  // D. Consistencia de país.
  await revisarPreciosPorPais();

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
