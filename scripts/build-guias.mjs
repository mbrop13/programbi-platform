#!/usr/bin/env node
/**
 * Genera `lib/guias/generado.ts` a partir de los Markdown de guías.
 *
 * Fuentes (en este orden):
 *   1. `content/guias/**\/*.md` — guías históricas (Power BI por país, transversales).
 *   2. `guias/*.md`             — guías nuevas por curso × país que entrega el bot de
 *                                 contenido (frontmatter: slug, pais, curso, title, meta,
 *                                 h1, sources, nota_hermes).
 *
 * El Markdown es la fuente editable (Radar/Pluma pueden corregir textos sin tocar
 * React). Este script extrae el frontmatter, separa las preguntas frecuentes (para
 * el FAQPage), normaliza los marcadores de CTA y de precio, y deja el cuerpo listo
 * para el renderizador.
 *
 * Reglas de publicación:
 *   - Solo se publican rutas `/guias/<slug>` (Chile y transversales) y
 *     `/<pais>/guias/<slug>` (resto de países de config/paises.ts).
 *   - El curso debe existir en `SLUGS_CURSO` de config/paises.ts.
 *   - Los archivos que empiezan con `_` son plantillas y no se leen.
 *   - Los archivos fuera de esas reglas se omiten con un aviso: no rompen el build.
 *   - Un duplicado, un frontmatter incompleto o una ruta incoherente sí son error.
 *
 * Uso:
 *   node scripts/build-guias.mjs          # regenera lib/guias/generado.ts
 *   node scripts/build-guias.mjs --check  # no escribe; exit 1 si está desactualizado
 *                                         # o si hay errores de ruta o duplicados
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, basename } from "node:path";

const ROOT = process.cwd();
const FUENTES = [join(ROOT, "content", "guias"), join(ROOT, "guias")];
const OUT = join(ROOT, "lib", "guias", "generado.ts");
const CHECK = process.argv.includes("--check");

const LAYOUTS = new Set(["comparativa", "certificacion", "sueldos", "curso"]);

/** Rutas que el sitio sabe renderizar: /guias/<slug> y /<pais>/guias/<slug>. */
const RUTA_RAIZ = /^\/guias\/[^/?#\s]+$/;
const RUTA_PAIS = /^\/([a-z]{2})\/guias\/[^/?#\s]+$/;

/**
 * Lee `config/paises.ts` para no duplicar la lista de países ni de cursos.
 * El build no puede importar TypeScript, así que se extraen los pares
 * iso/idioma de cada objeto y los valores de `SLUGS_CURSO`.
 */
function leerConfig() {
  const raw = readFileSync(join(ROOT, "config", "paises.ts"), "utf8");

  const paises = new Map();
  const rePais = /iso:\s*"([a-z]{2})"[\s\S]*?nombre:\s*"([^"]+)"[\s\S]*?idioma:\s*"([a-zA-Z-]+)"/g;
  let match;
  while ((match = rePais.exec(raw))) {
    if (!paises.has(match[1])) paises.set(match[1], match[3]);
  }
  if (paises.size === 0) throw new Error("config/paises.ts: no se pudo leer la lista de países");

  const bloque = raw.match(/export const SLUGS_CURSO\s*=\s*\[([\s\S]*?)\]\s*as const/);
  if (!bloque) throw new Error("config/paises.ts: no se encontró SLUGS_CURSO");
  const cursos = new Set([...bloque[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
  if (cursos.size === 0) throw new Error("config/paises.ts: SLUGS_CURSO está vacío");

  return { paises, cursos };
}

const { paises: LANG_POR_PAIS, cursos: CURSOS_VALIDOS } = leerConfig();

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    // Los archivos que empiezan con "_" son plantillas y no se publican.
    if (!full.endsWith(".md") || basename(full).startsWith("_")) return [];
    return [full];
  });
}

/** Frontmatter YAML simple: escalares, listas (`sources:`) y bloques (`nota_hermes: |`). */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return null;
  const data = {};
  let actual = null;
  let bloque = false;
  for (const line of match[1].split("\n")) {
    if (!line.trim()) continue;
    if (/^\s+-\s+/.test(line) && actual && !bloque) {
      if (!Array.isArray(data[actual])) data[actual] = [];
      data[actual].push(line.replace(/^\s+-\s+/, "").trim());
      continue;
    }
    if (/^\s{2,}/.test(line) && actual) {
      if (typeof data[actual] === "string") {
        data[actual] = `${data[actual]}\n${line.trim()}`.trim();
      }
      continue;
    }
    const at = line.indexOf(":");
    if (at < 0) continue;
    const key = line.slice(0, at).trim();
    let value = line.slice(at + 1).trim();
    if (!key) continue;
    if (value === "" || value === "|" || value === ">") {
      data[key] = "";
      actual = key;
      bloque = value === "|" || value === ">";
      continue;
    }
    value = value.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    data[key] = value;
    actual = null;
    bloque = false;
  }
  return { data, body: raw.slice(match[0].length) };
}

/** Texto plano para el JSON-LD: sin negritas ni enlaces Markdown. */
function limpiarTexto(texto) {
  return texto
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\*\*|__/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Preguntas frecuentes: encabezado H2–H5 y pregunta en negrita. */
function extraerFaq(body) {
  const heading = body.match(/\n#{2,5}\s+Preguntas frecuentes\s*\n/i);
  if (!heading) return { body: body.trim(), faqs: [] };
  const at = heading.index;
  const block = body.slice(at + heading[0].length).trim();
  const re = /\*\*([^*]{4,200}\?)\*\*/g;
  const hits = [];
  let m;
  while ((m = re.exec(block))) {
    hits.push({ q: m[1].replace(/\s+/g, " ").trim(), start: m.index, end: re.lastIndex });
  }
  const faqs = hits
    .map((hit, index) => {
      const next = hits[index + 1]?.start ?? block.length;
      const a = limpiarTexto(block.slice(hit.end, next));
      return a ? { q: limpiarTexto(hit.q), a } : null;
    })
    .filter(Boolean);
  return { body: body.slice(0, at).trimEnd(), faqs };
}

/** Normaliza los marcadores que escribe el bot de contenido. */
function normalizarCuerpo(body) {
  return body
    // **[CTA-TOP]** — copy de apoyo  →  <!-- CTA-TOP -->
    .replace(/^\*\*\[CTA-(TOP|MID|END)\]\*\*.*$/gm, (_, variante) => `<!-- CTA-${variante} -->`)
    // {precio_local} y {{precio}} son el mismo placeholder.
    .replace(/\{\{\s*precio\s*\}\}|\{precio_local\}/gi, "{{precio}}")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Elemento visual sugerido por el bot de contenido (campo `nota_hermes`). */
function extraerVisual(nota) {
  if (!nota) return undefined;
  const m = nota.match(/ELEMENTO VISUAL:\s*(.+)/i);
  return m ? m[1].trim() : undefined;
}

function texto(valor) {
  return valor == null ? "" : String(valor).trim();
}

/** Conteo por curso/país para el resumen, de mayor a menor. */
function contarPor(items, clave) {
  const mapa = new Map();
  for (const item of items) mapa.set(clave(item), (mapa.get(clave(item)) ?? 0) + 1);
  return [...mapa.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function main() {
  const archivos = FUENTES.flatMap((dir) => walk(dir)).sort();
  const guias = [];
  const omitidas = [];
  const avisos = [];
  const errores = [];

  const error = (file, mensaje) => errores.push(`${relative(ROOT, file)}: ${mensaje}`);
  const omitir = (file, motivo) => omitidas.push({ archivo: relative(ROOT, file), motivo });

  for (const file of archivos) {
    const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    const parsed = parseFrontmatter(raw);
    if (!parsed) {
      omitir(file, "sin frontmatter");
      continue;
    }

    const { data } = parsed;
    if (data.publicar === false || String(data.publicar).toLowerCase() === "false") {
      omitir(file, "publicar: false");
      continue;
    }

    const slug = texto(data.slug);
    const paisCrudo = texto(data.pais || data.country).toLowerCase();
    // `latam` es el país que usa el bot de contenido para las guías sin variante
    // por mercado; el resto del sitio las llama `transversal`.
    const pais = paisCrudo === "latam" ? "transversal" : paisCrudo;
    const curso = texto(data.curso || data.course).toLowerCase();
    const rutaDeclarada = texto(data.ruta_sugerida || data.path);
    const derivada =
      slug && pais ? (pais === "cl" || pais === "transversal" ? `/guias/${slug}` : `/${pais}/guias/${slug}`) : "";
    const path = (rutaDeclarada || derivada).replace(/\/+$/, "");

    // Archivos que el sitio no puede renderizar: se omiten, no rompen el build.
    if (!path) {
      error(file, "no se puede calcular la ruta: faltan slug, pais o ruta_sugerida");
      continue;
    }
    if (!RUTA_RAIZ.test(path) && !RUTA_PAIS.test(path)) {
      omitir(
        file,
        `ruta ${path} fuera de /guias/<slug> o /<pais>/guias/<slug>; ninguna página del sitio la renderiza`
      );
      continue;
    }
    if (!curso) {
      error(file, "frontmatter incompleto: falta curso");
      continue;
    }
    if (!CURSOS_VALIDOS.has(curso)) {
      omitir(file, `curso "${curso}" no existe en SLUGS_CURSO de config/paises.ts`);
      continue;
    }

    // Coherencia ruta ↔ país ↔ slug.
    if (pais !== "transversal" && !LANG_POR_PAIS.has(pais)) {
      error(file, `país desconocido (${pais || "vacío"}); agrégalo a config/paises.ts`);
      continue;
    }
    const ultimo = path.slice(path.lastIndexOf("/") + 1);
    if (ultimo !== slug) {
      error(file, `la ruta ${path} no coincide con slug "${slug}"; la página se genera con el slug`);
      continue;
    }
    if (pais === "cl" || pais === "transversal") {
      if (!path.startsWith("/guias/")) {
        error(file, `${pais === "cl" ? "Chile" : "una guía transversal"} debe vivir en /guias/ (${path})`);
        continue;
      }
    } else if (!path.startsWith(`/${pais}/guias/`)) {
      error(file, `${pais} debe vivir en /${pais}/guias/ (${path})`);
      continue;
    }

    const lang =
      data.hreflang || data.lang || LANG_POR_PAIS.get(pais) || (pais === "transversal" ? "es" : "es-CL");
    const layout = data.layout ? String(data.layout).toLowerCase() : undefined;
    const faq = extraerFaq(parsed.body);
    const body = normalizarCuerpo(faq.body);

    const guia = {
      source: relative(ROOT, file).replace(/\\/g, "/"),
      slug,
      path,
      country: pais,
      lang,
      title: data.title,
      description: data.meta || data.description,
      h1: data.h1,
      updated: data.updated,
      course: curso,
      body,
      faqs: faq.faqs,
    };
    const sources = Array.isArray(data.sources) ? data.sources.filter(Boolean) : [];
    if (sources.length) guia.sources = sources;
    const visual = extraerVisual(data.nota_hermes);
    if (visual) guia.visual = visual;
    if (data.url_curso) guia.cursoUrl = data.url_curso;
    if (layout) guia.layout = layout;

    // Validaciones de forma: sin esto el sitemap o el JSON-LD quedan rotos.
    const faltan = ["slug", "path", "country", "course", "lang", "title", "description", "h1", "updated"].filter(
      (key) => !guia[key]
    );
    if (faltan.length) {
      error(file, `frontmatter incompleto, falta ${faltan.join(", ")}`);
      continue;
    }
    if (guia.layout && !LAYOUTS.has(guia.layout)) {
      error(file, `layout inválido (${guia.layout}); usa ${[...LAYOUTS].join(" | ")}`);
      continue;
    }

    guias.push(guia);
    if (guia.faqs.length < 4) avisos.push(`${guia.source}: solo ${guia.faqs.length} FAQ (mínimo recomendado: 4)`);
    if (guia.title.length > 60) avisos.push(`${guia.source}: title de ${guia.title.length} caracteres (máximo: 60)`);
  }

  // Duplicados: dos archivos no pueden pelear por la misma URL.
  const vistos = new Map();
  for (const guia of guias) {
    if (vistos.has(guia.path)) {
      errores.push(`ruta duplicada ${guia.path}: ${vistos.get(guia.path)} y ${guia.source}`);
    } else {
      vistos.set(guia.path, guia.source);
    }
  }

  const publicadas = guias.length;
  console.log(
    `${CHECK ? "build-guias --check" : "build-guias"}: ${publicadas} guías publicadas, ` +
      `${omitidas.length} omitidas, ${avisos.length} avisos`
  );
  if (publicadas) {
    const cursos = contarPor(guias, (guia) => guia.course)
      .map(([curso, total]) => `${curso} ${total}`)
      .join(" · ");
    const paises = contarPor(guias, (guia) => guia.country)
      .map(([pais, total]) => `${pais} ${total}`)
      .join(" · ");
    console.log(`  por curso: ${cursos}`);
    console.log(`  por país:  ${paises}`);
  }
  if (omitidas.length) {
    console.log(`  omitidas (${omitidas.length}):`);
    for (const item of omitidas) console.log(`    - ${item.archivo} — ${item.motivo}`);
  }
  if (avisos.length) {
    console.log(`  avisos (${avisos.length}):`);
    for (const aviso of avisos) console.log(`    - ${aviso}`);
  }

  if (errores.length) {
    console.error(`\nERROR: ${errores.length} problema(s) de validación:`);
    for (const item of errores) console.error(`  - ${item}`);
    console.error(
      CHECK
        ? "\n--check: falla por errores de ruta/duplicados; no se escribió nada."
        : "\nNo se escribió lib/guias/generado.ts. Corrige los .md o config/paises.ts y vuelve a intentar."
    );
    process.exitCode = 1;
    return;
  }

  const header = `// ARCHIVO GENERADO por scripts/build-guias.mjs. No lo edites a mano.
// Fuente: content/guias/**/*.md y guias/*.md
import type { Guia } from "@/lib/guias/tipos";

export const GUIAS: Guia[] = `;
  const contenido = `${header}${JSON.stringify(guias, null, 2)};\n`;

  if (CHECK) {
    const actual = existsSync(OUT) ? readFileSync(OUT, "utf8").replace(/\r\n/g, "\n").replace(/^\uFEFF/, "") : "";
    if (actual !== contenido) {
      const enDisco = (actual.match(/^\s*"path":/gm) ?? []).length;
      console.error(
        `\n--check: lib/guias/generado.ts está desactualizado ` +
          `(en disco: ${enDisco} guías; esperado: ${publicadas}).`
      );
      console.error("Ejecuta `node scripts/build-guias.mjs` y commitea el archivo generado.");
      process.exitCode = 1;
      return;
    }
    console.log(`\n--check: OK · lib/guias/generado.ts está al día (${publicadas} guías).`);
    return;
  }

  writeFileSync(OUT, contenido, "utf8");
  console.log(`\nOK → ${relative(ROOT, OUT)}`);
}

try {
  main();
} catch (error) {
  console.error(`build-guias: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
