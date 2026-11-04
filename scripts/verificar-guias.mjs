#!/usr/bin/env node
/**
 * Mide cuánto texto comparten las guías de país (shingles de 5 palabras).
 *
 * Sirve para evitar contenido casi duplicado entre /ar /mx /pe /co /uy /py:
 * si dos guías comparten más del 30 % de sus shingles, Google puede tratarlas
 * como la misma página con distinto país. El objetivo del encargo es < 30 %.
 *
 * Mide dos fuentes sin cambiar el modo histórico:
 *   1. content/guias/pais/*.md — una guía por mercado (comportamiento original).
 *   2. guias/*.md — variantes de país del mismo curso y tema (incluye bo, cr,
 *      ec, sv, gt, do, ve y los cursos access, excel, sql-server…).
 *
 * Uso: node scripts/verificar-guias.mjs
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DIR_PAIS = join(ROOT, "content", "guias", "pais");
const DIR_GUIAS = join(ROOT, "guias");
const N = 5;
const MAX = 30;

function cuerpo(raw) {
  const limpio = raw.replace(/\r\n/g, "\n");
  const sinFront = limpio.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const corte = sinFront.indexOf("##### Preguntas frecuentes");
  const texto = corte >= 0 ? sinFront.slice(0, corte) : sinFront;
  return texto
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/[#*_>`|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function shingles(texto) {
  const palabras = texto.split(" ").filter(Boolean);
  const set = new Set();
  for (let i = 0; i + N <= palabras.length; i += 1) {
    set.add(palabras.slice(i, i + N).join(" "));
  }
  return set;
}

function comparar(a, b) {
  let comunes = 0;
  const [chico, grande] = a.set.size <= b.set.size ? [a, b] : [b, a];
  for (const s of chico.set) if (grande.set.has(s)) comunes += 1;
  const pct = chico.set.size ? (comunes / chico.set.size) * 100 : 0;
  return { pct, comunes };
}

function medirPais() {
  if (!existsSync(DIR_PAIS)) return { peor: 0, fallos: 0 };
  const archivos = readdirSync(DIR_PAIS).filter((f) => f.endsWith(".md")).sort();
  const datos = archivos.map((archivo) => {
    const texto = cuerpo(readFileSync(join(DIR_PAIS, archivo), "utf8"));
    const set = shingles(texto);
    return { archivo, palabras: texto.split(" ").length, set };
  });

  let peor = 0;
  let fallos = 0;
  for (let i = 0; i < datos.length; i += 1) {
    for (let j = i + 1; j < datos.length; j += 1) {
      const a = datos[i];
      const b = datos[j];
      const { pct, comunes } = comparar(a, b);
      peor = Math.max(peor, pct);
      const estado = pct <= MAX ? "OK" : "ALTO";
      if (pct > MAX) fallos += 1;
      console.log(
        `${estado.padEnd(4)} ${a.archivo.replace(".md", "")} ↔ ${b.archivo.replace(".md", "")}: ${pct.toFixed(1)}% (${comunes} shingles)`
      );
    }
  }

  for (const dato of datos) {
    console.log(`     ${dato.archivo}: ${dato.palabras} palabras, ${dato.set.size} shingles`);
  }

  console.log(`\nPeor par: ${peor.toFixed(1)}% · límite ${MAX}% · ${fallos === 0 ? "OK" : `${fallos} pares sobre el límite`}`);
  return { peor, fallos };
}

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Nombres de país desde config/paises.ts, para quitar el sufijo del slug. */
function sufijosPais() {
  const raw = readFileSync(join(ROOT, "config", "paises.ts"), "utf8");
  const nombres = [...raw.matchAll(/nombre:\s*"([^"]+)"/g)].map((m) => normalizar(m[1]));
  return [...new Set(nombres)].sort((a, b) => b.length - a.length);
}

function frontmatter(raw) {
  const match = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split("\n")) {
    if (!line || /^\s/.test(line)) continue;
    const at = line.indexOf(":");
    if (at < 0) continue;
    const key = line.slice(0, at).trim();
    let value = line.slice(at + 1).trim();
    if (!key || !value || value === "|" || value === ">") continue;
    value = value.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    data[key] = value;
  }
  return data;
}

function tema(slug, sufijos) {
  for (const sufijo of sufijos) {
    if (slug.endsWith(`-${sufijo}`)) return slug.slice(0, -(sufijo.length + 1));
  }
  return slug;
}

function medirGuias() {
  if (!existsSync(DIR_GUIAS)) return { peor: 0, fallos: 0 };
  const sufijos = sufijosPais();
  const archivos = readdirSync(DIR_GUIAS)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .sort();

  const datos = [];
  for (const archivo of archivos) {
    const raw = readFileSync(join(DIR_GUIAS, archivo), "utf8");
    const data = frontmatter(raw);
    if (!data || !data.slug) continue;
    const paisCrudo = String(data.pais || data.country || "").toLowerCase();
    const pais = paisCrudo === "latam" ? "transversal" : paisCrudo;
    const curso = data.curso || data.course;
    if (!curso || !pais || pais === "transversal") continue;
    const texto = cuerpo(raw);
    const set = shingles(texto);
    datos.push({
      archivo,
      pais,
      curso,
      grupo: `${curso}::${tema(data.slug, sufijos)}`,
      palabras: texto.split(" ").length,
      set,
    });
  }

  const grupos = new Map();
  for (const dato of datos) {
    const grupo = grupos.get(dato.grupo);
    if (grupo) grupo.push(dato);
    else grupos.set(dato.grupo, [dato]);
  }

  let peor = 0;
  let fallos = 0;
  let pares = 0;
  const altos = [];

  console.log(`\n=== Variantes de país en guias/*.md (mismo curso y tema) ===`);
  for (const [clave, grupo] of [...grupos].sort()) {
    if (grupo.length < 2) continue;
    let peorGrupo = 0;
    let paresGrupo = 0;
    for (let i = 0; i < grupo.length; i += 1) {
      for (let j = i + 1; j < grupo.length; j += 1) {
        const a = grupo[i];
        const b = grupo[j];
        if (a.pais === b.pais) continue;
        const { pct, comunes } = comparar(a, b);
        peor = Math.max(peor, pct);
        peorGrupo = Math.max(peorGrupo, pct);
        pares += 1;
        paresGrupo += 1;
        if (pct > MAX) {
          fallos += 1;
          altos.push(
            `ALTO ${a.archivo.replace(".md", "")} ↔ ${b.archivo.replace(".md", "")}: ${pct.toFixed(1)}% (${comunes} shingles)`
          );
        }
      }
    }
    console.log(
      `${peorGrupo <= MAX ? "OK  " : "ALTO"} ${clave}: ${paresGrupo} pares · peor ${peorGrupo.toFixed(1)}%`
    );
  }

  if (altos.length) {
    console.log("\nParejas sobre el límite:");
    for (const linea of altos) console.log(`  ${linea}`);
  } else {
    console.log("\nSin parejas sobre el límite.");
  }

  console.log(
    `Peor par guias/*.md: ${peor.toFixed(1)}% · límite ${MAX}% · ${pares} pares · ${
      fallos === 0 ? "OK" : `${fallos} pares sobre el límite`
    }`
  );
  return { peor, fallos };
}

const pais = medirPais();
const guias = medirGuias();
process.exit(pais.fallos + guias.fallos === 0 ? 0 : 1);
