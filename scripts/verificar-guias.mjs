#!/usr/bin/env node
/**
 * Mide cuánto texto comparten las guías de país (shingles de 5 palabras).
 *
 * Sirve para evitar contenido casi duplicado entre /ar /mx /pe /co /uy /py:
 * si dos guías comparten más del 30 % de sus shingles, Google puede tratarlas
 * como la misma página con distinto país. El objetivo del encargo es < 30 %.
 *
 * Uso: node scripts/verificar-guias.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "content", "guias", "pais");
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

const archivos = readdirSync(DIR).filter((f) => f.endsWith(".md")).sort();
const datos = archivos.map((archivo) => {
  const texto = cuerpo(readFileSync(join(DIR, archivo), "utf8"));
  const set = shingles(texto);
  return { archivo, palabras: texto.split(" ").length, set };
});

let peor = 0;
let fallos = 0;
for (let i = 0; i < datos.length; i += 1) {
  for (let j = i + 1; j < datos.length; j += 1) {
    const a = datos[i];
    const b = datos[j];
    let comunes = 0;
    const [chico, grande] = a.set.size <= b.set.size ? [a, b] : [b, a];
    for (const s of chico.set) if (grande.set.has(s)) comunes += 1;
    const pct = chico.set.size ? (comunes / chico.set.size) * 100 : 0;
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
process.exit(fallos === 0 ? 0 : 1);
