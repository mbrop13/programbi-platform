#!/usr/bin/env node
/**
 * Genera `lib/guias/generado.ts` a partir de los Markdown de `content/guias/`.
 *
 * El Markdown es la fuente editable (Radar puede corregir textos sin tocar
 * React). Este script extrae el frontmatter, separa las preguntas frecuentes
 * (para el FAQPage) y deja el cuerpo listo para el renderizador.
 *
 * Uso: node scripts/build-guias.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const CONTENT = join(ROOT, "content", "guias");
const OUT = join(ROOT, "lib", "guias", "generado.ts");

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : full.endsWith(".md") ? [full] : [];
  });
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) throw new Error("Frontmatter ausente");
  const data = {};
  for (const line of match[1].split("\n")) {
    const at = line.indexOf(":");
    if (at < 0) continue;
    const key = line.slice(0, at).trim();
    const value = line.slice(at + 1).trim();
    if (key) data[key] = value;
  }
  return { data, body: raw.slice(match[0].length) };
}

function extraerFaq(body) {
  const marker = "##### Preguntas frecuentes";
  const at = body.indexOf(marker);
  if (at < 0) return { body: body.trim(), faqs: [] };
  const block = body.slice(at + marker.length).trim();
  // Las guías usan dos formatos: pregunta en negrita y respuesta en el párrafo
  // siguiente, o pregunta y respuesta en la misma línea. Se corta por el signo
  // de interrogación en negrita y la respuesta es lo que viene después.
  const re = /\*\*([^*]{4,160}\?)\*\*/g;
  const hits = [];
  let m;
  while ((m = re.exec(block))) {
    hits.push({ q: m[1].replace(/\s+/g, " ").trim(), start: m.index, end: re.lastIndex });
  }
  const faqs = hits
    .map((hit, index) => {
      const next = hits[index + 1]?.start ?? block.length;
      const a = block.slice(hit.end, next).replace(/\s+/g, " ").trim();
      return a ? { q: hit.q, a } : null;
    })
    .filter(Boolean);
  return { body: body.slice(0, at).trimEnd(), faqs };
}

const files = walk(CONTENT).sort();
const guias = files.map((file) => {
  const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const { data, body } = parseFrontmatter(raw);
  const parsed = extraerFaq(body);
  return {
    source: relative(ROOT, file).replace(/\\/g, "/"),
    slug: data.slug,
    path: data.path,
    country: data.country,
    lang: data.lang,
    title: data.title,
    description: data.description,
    h1: data.h1,
    updated: data.updated,
    course: data.course || "power-bi",
    body: parsed.body,
    faqs: parsed.faqs,
  };
});

for (const guia of guias) {
  for (const key of ["slug", "path", "country", "lang", "title", "description", "h1", "updated"]) {
    if (!guia[key]) throw new Error(`${guia.source}: falta ${key}`);
  }
  if (guia.faqs.length < 6) throw new Error(`${guia.source}: solo ${guia.faqs.length} FAQ`);
}

const header = `// ARCHIVO GENERADO por scripts/build-guias.mjs. No lo edites a mano.
// Fuente: content/guias/**/*.md
import type { Guia } from "@/lib/guias/tipos";

export const GUIAS: Guia[] = `;

writeFileSync(OUT, `${header}${JSON.stringify(guias, null, 2)};\n`, "utf8");
console.log(`OK ${guias.length} guías → ${relative(ROOT, OUT)}`);
for (const g of guias) console.log(`  ${g.path.padEnd(62)} ${String(g.faqs.length).padStart(2)} FAQ  ${g.body.split(/\s+/).length} palabras`);
