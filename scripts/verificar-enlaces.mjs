#!/usr/bin/env node
/**
 * Verifica el enlazado interno de las guías sin levantar el servidor.
 *
 * Por cada guía de lib/guias/generado.ts:
 *  - su `cursoUrl` debe apuntar a un curso real de lib/data/courses.ts;
 *  - su `body` debe tener al menos un enlace interno de ProgramBI.
 *
 * Sale con código 1 si hay fallos. Los avisos (por ejemplo, guías antiguas sin
 * `cursoUrl`) no cambian el código de salida.
 *
 * Uso: node scripts/verificar-enlaces.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = process.cwd();
const SITE = /^https?:\/\/(?:www\.)?programbi\.com(?:\/|$)/i;

function leerGuias() {
  const raw = readFileSync(join(RAIZ, "lib/guias/generado.ts"), "utf8");
  const match = raw.match(/export const GUIAS: Guia\[\]\s*=\s*(\[[\s\S]*\]);/);
  if (!match) throw new Error("No encontré el arreglo GUIAS en lib/guias/generado.ts");
  return JSON.parse(match[1]);
}

function leerCursos() {
  const raw = readFileSync(join(RAIZ, "lib/data/courses.ts"), "utf8");
  return new Set([...raw.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]));
}

function enlacesDelBody(body) {
  const enlaces = [];
  for (const m of body.matchAll(/\[[^\]]*\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g)) {
    enlaces.push(m[1]);
  }
  for (const m of body.matchAll(/<((?:https?:\/\/|\/)[^>\s]+)>/g)) {
    enlaces.push(m[1]);
  }
  for (const m of body.matchAll(/href=["']([^"']+)["']/gi)) {
    enlaces.push(m[1]);
  }
  return enlaces.filter((href) => href.startsWith("/") || SITE.test(href));
}

function revisarCursoUrl(guia, cursos) {
  if (!guia.cursoUrl) return { estado: "aviso", detalle: "sin cursoUrl" };

  let url;
  try {
    url = new URL(guia.cursoUrl);
  } catch {
    return { estado: "fallo", detalle: `cursoUrl inválida: ${guia.cursoUrl}` };
  }

  if (!SITE.test(guia.cursoUrl)) {
    return { estado: "fallo", detalle: `cursoUrl fuera de ProgramBI: ${guia.cursoUrl}` };
  }

  const partes = url.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  const indice = partes.indexOf("cursos");

  if (indice === -1) {
    return { estado: "fallo", detalle: `cursoUrl sin /cursos: ${guia.cursoUrl}` };
  }

  const resto = partes.slice(indice + 1);

  if (resto.length === 0) {
    if (guia.course === "general") return { estado: "ok", detalle: "índice de cursos" };
    return { estado: "fallo", detalle: `cursoUrl apunta al índice, no a un curso: ${guia.cursoUrl}` };
  }

  const slug = resto[0];
  if (!cursos.has(slug)) {
    return { estado: "fallo", detalle: `curso inexistente «${slug}»: ${guia.cursoUrl}` };
  }

  if (resto.length > 1 && resto[resto.length - 1] !== "empresas") {
    return { estado: "fallo", detalle: `ruta de curso no esperada: ${guia.cursoUrl}` };
  }

  return { estado: "ok", detalle: slug };
}

const guias = leerGuias();
const cursos = leerCursos();

const fallos = [];
const avisos = [];

const fichaCurso = join(RAIZ, "app/(marketing)/cursos/[slug]/page.tsx");
if (!existsSync(fichaCurso)) {
  fallos.push({ path: "-", tipo: "ruta-curso", detalle: "falta app/(marketing)/cursos/[slug]/page.tsx" });
}

for (const guia of guias) {
  const revision = revisarCursoUrl(guia, cursos);
  if (revision.estado === "fallo") {
    fallos.push({ path: guia.path, tipo: "cursoUrl", detalle: revision.detalle });
  } else if (revision.estado === "aviso") {
    avisos.push({ path: guia.path, tipo: "cursoUrl", detalle: revision.detalle });
  }

  const internos = enlacesDelBody(guia.body || "");
  if (internos.length === 0) {
    fallos.push({ path: guia.path, tipo: "enlace-interno", detalle: "el body no tiene enlaces internos" });
  }
}

const conCursoUrl = guias.filter((guia) => Boolean(guia.cursoUrl)).length;

console.log(`Guías revisadas: ${guias.length}`);
console.log(`Cursos reconocidos: ${cursos.size}`);
console.log(`Con cursoUrl: ${conCursoUrl}`);
console.log(`Avisos: ${avisos.length}`);
console.log("");

for (const aviso of avisos.slice(0, 20)) {
  console.log(`- [aviso:${aviso.tipo}] ${aviso.path} — ${aviso.detalle}`);
}
if (avisos.length > 20) console.log(`… y ${avisos.length - 20} avisos más`);

if (fallos.length === 0) {
  console.log("ENLACES OK: sin fallos.");
  process.exit(0);
}

console.log(`Fallos: ${fallos.length}`);
for (const fallo of fallos) {
  console.log(`- [${fallo.tipo}] ${fallo.path} — ${fallo.detalle}`);
}
process.exit(1);
