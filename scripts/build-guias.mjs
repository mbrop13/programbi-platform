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
 * Uso: node scripts/build-guias.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, basename } from "node:path";

const ROOT = process.cwd();
const FUENTES = [join(ROOT, "content", "guias"), join(ROOT, "guias")];
const OUT = join(ROOT, "lib", "guias", "generado.ts");

const LANG_POR_PAIS = {
  cl: "es-CL",
  ar: "es-AR",
  mx: "es-MX",
  co: "es-CO",
  pe: "es-PE",
  uy: "es-UY",
  py: "es-PY",
  bo: "es-BO",
  ec: "es-EC",
  cr: "es-CR",
  pa: "es-PA",
  do: "es-DO",
  sv: "es-SV",
  gt: "es-GT",
  hn: "es-HN",
  ni: "es-NI",
};

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

const archivos = FUENTES.flatMap((dir) => walk(dir)).sort();
const guias = [];
const avisos = [];

for (const file of archivos) {
  const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const parsed = parseFrontmatter(raw);
  if (!parsed) {
    avisos.push(`${relative(ROOT, file)}: sin frontmatter, se omite`);
    continue;
  }
  const { data } = parsed;
  if (data.publicar === false || String(data.publicar).toLowerCase() === "false") {
    avisos.push(`${relative(ROOT, file)}: publicar: false, se omite`);
    continue;
  }
  const slug = data.slug;
  const paisCrudo = String(data.pais || data.country || "").toLowerCase();
  // `latam` es el país que usa el bot de contenido para las guías sin variante
  // por mercado; el resto del sitio las llama `transversal`.
  const pais = paisCrudo === "latam" || paisCrudo === "" ? "transversal" : paisCrudo;
  const curso = data.curso || data.course || "power-bi";
  const path =
    data.ruta_sugerida ||
    data.path ||
    (pais === "cl" || pais === "transversal" ? `/guias/${slug}` : `/${pais}/guias/${slug}`);
  const lang = data.hreflang || data.lang || LANG_POR_PAIS[pais] || "es-CL";
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

  guias.push(guia);
}

// Validaciones: lo que rompe el sitemap o el JSON-LD se corta acá.
const vistos = new Map();
for (const guia of guias) {
  for (const key of ["slug", "path", "country", "lang", "title", "description", "h1", "updated"]) {
    if (!guia[key]) throw new Error(`${guia.source}: falta ${key}`);
  }
  if (!guia.path.startsWith("/")) throw new Error(`${guia.source}: path inválido (${guia.path})`);
  if (guia.country === "cl" && !guia.path.startsWith("/guias/")) {
    throw new Error(`${guia.source}: Chile debe vivir en /guias/ (${guia.path})`);
  }
  if (
    guia.country !== "cl" &&
    guia.country !== "transversal" &&
    !guia.path.startsWith(`/${guia.country}/guias/`)
  ) {
    throw new Error(`${guia.source}: ${guia.country} debe vivir en /${guia.country}/guias/ (${guia.path})`);
  }
  if (vistos.has(guia.path)) {
    throw new Error(`Ruta duplicada ${guia.path}: ${vistos.get(guia.path)} y ${guia.source}`);
  }
  vistos.set(guia.path, guia.source);
  if (guia.faqs.length < 4) avisos.push(`${guia.source}: solo ${guia.faqs.length} FAQ`);
  if (guia.title.length > 60) avisos.push(`${guia.source}: title de ${guia.title.length} caracteres`);
}

const header = `// ARCHIVO GENERADO por scripts/build-guias.mjs. No lo edites a mano.
// Fuente: content/guias/**/*.md y guias/*.md
import type { Guia } from "@/lib/guias/tipos";

export const GUIAS: Guia[] = `;

writeFileSync(OUT, `${header}${JSON.stringify(guias, null, 2)};\n`, "utf8");
console.log(`OK ${guias.length} guías → ${relative(ROOT, OUT)}`);
for (const g of guias) {
  console.log(
    `  ${g.path.padEnd(58)} ${String(g.faqs.length).padStart(2)} FAQ  ${String(g.body.split(/\s+/).length).padStart(4)} palabras`
  );
}
for (const aviso of avisos) console.warn(`  aviso: ${aviso}`);
