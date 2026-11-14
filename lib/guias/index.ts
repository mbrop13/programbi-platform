import { absoluteUrl } from "@/lib/seo";
import { esIndexable, ISO_CHILE, PAISES } from "@/config/paises";
import { GUIAS } from "@/lib/guias/generado";
import type { Guia } from "@/lib/guias/tipos";

export type { Guia } from "@/lib/guias/tipos";
export type { GuiaLayout } from "@/lib/guias/tipos";

const POR_PATH = new Map(GUIAS.map((guia) => [guia.path, guia]));

/** Guía por su ruta canónica exacta (con prefijo de país si lo tiene). */
export function guiaPorPath(path: string): Guia | undefined {
  return POR_PATH.get(path);
}

export function getGuia(path: string): Guia {
  const guia = POR_PATH.get(path);
  if (!guia) throw new Error(`Guía no encontrada: ${path}`);
  return guia;
}

/** Guías de país (las que llevan un ISO, incluido Chile). */
export function guiasDePais(iso: string): Guia[] {
  return GUIAS.filter((guia) => guia.country === iso);
}

/** Guías sin variante por país. */
export function guiasTransversales(): Guia[] {
  return GUIAS.filter((guia) => guia.country === "transversal");
}

/** Guía de un país por slug corto. */
export function guiaDePais(iso: string, slug: string): Guia | undefined {
  return GUIAS.find((guia) => guia.country === iso && guia.slug === slug && guia.path.startsWith(`/${iso}/`));
}

/** Guías de la versión chilena y transversales viven en la raíz. */
export function guiasRaiz(): Guia[] {
  return GUIAS.filter((guia) => guia.path.startsWith("/guias/"));
}

const ORDEN_PAIS = new Map(PAISES.map((pais, indice) => [pais.iso, indice]));

function ordenPais(guia: Guia): number {
  return guia.country === "transversal" ? PAISES.length + 1 : ORDEN_PAIS.get(guia.country) ?? PAISES.length;
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Nombres de país tal como aparecen al final de los slugs. */
const SUFIJOS_PAIS = PAISES.map((pais) => normalizar(pais.nombre)).sort((a, b) => b.length - a.length);

/**
 * Tema de la guía: el slug sin el sufijo de país. `curso-excel-chile` y
 * `curso-excel-mexico` comparten tema `curso-excel`; `analitica-mineria-chile`
 * no se mezcla con `curso-analisis-de-datos-chile` aunque compartan curso.
 */
export function temaGuia(guia: Guia): string {
  for (const sufijo of SUFIJOS_PAIS) {
    if (guia.slug.endsWith(`-${sufijo}`)) return guia.slug.slice(0, -(sufijo.length + 1));
  }
  return guia.slug;
}

function claveGrupo(guia: Guia): string {
  return `${guia.course}::${temaGuia(guia)}`;
}

/** Variantes de la misma guía (mismo curso y mismo tema) por país. */
const GRUPOS = new Map<string, Guia[]>();
for (const guia of GUIAS) {
  const clave = claveGrupo(guia);
  const grupo = GRUPOS.get(clave);
  if (grupo) grupo.push(guia);
  else GRUPOS.set(clave, [guia]);
}

function grupoDeGuia(guia: Guia): Guia[] {
  return GRUPOS.get(claveGrupo(guia)) ?? [guia];
}

/**
 * Alternates de las variantes por país: recíprocos, solo con países indexables
 * y con `x-default` a Chile. Sirve para cualquier curso, no solo los `curso-*`.
 */
export function alternatesCurso(guia: Guia): Record<string, string> | undefined {
  const grupo = grupoDeGuia(guia)
    .filter((item) => item.country !== "transversal" && esIndexable(item.country))
    .sort((a, b) => ordenPais(a) - ordenPais(b));
  if (grupo.length < 2) return undefined;
  const cl = grupo.find((item) => item.country === ISO_CHILE);
  const languages: Record<string, string> = {};
  if (cl) languages["x-default"] = absoluteUrl(cl.path);
  for (const item of grupo) languages[item.lang] = absoluteUrl(item.path);
  return languages;
}

/** Alternates del clúster de guías de país (incluye aprender Power BI y cursos). */
export function alternatesGuiaPais(guia: Guia): Record<string, string> | undefined {
  return guia.country === "transversal" ? undefined : alternatesCurso(guia);
}

/** Alternates del piloto Claude: usa el mismo grupo general de variantes. */
export function alternatesClaude(guia: Guia): Record<string, string> | undefined {
  return guia.slug.startsWith("como-usar-claude-para-analisis-de-datos") ? alternatesCurso(guia) : undefined;
}

/** Alternates unificados de cualquier guía indexable (compartido por rutas y sitemap). */
export function alternatesDeGuia(guia: Guia): Record<string, string> | undefined {
  return alternatesGuiaPais(guia) ?? alternatesClaude(guia) ?? alternatesCurso(guia);
}

/** Ruta del índice de guías de un país. */
export function indiceGuias(iso: string): string {
  return iso === "cl" ? "/guias" : `/${iso}/guias`;
}

/** Guías nuevas por curso × país, identificadas por el prefijo `curso-`. */
export function esGuiaDeCurso(guia: Guia): boolean {
  return guia.slug.startsWith("curso-");
}

/** Todas las guías publicadas de un curso (país, transversales y comparativas). */
export function guiasPorCurso(curso: string): Guia[] {
  return GUIAS.filter((guia) => guia.course === curso).sort((a, b) => ordenPais(a) - ordenPais(b));
}

/** Guías de un curso escritas como `curso-*` (una por país, más las que existan). */
export function guiasDelCurso(curso: string): Guia[] {
  return GUIAS.filter((guia) => esGuiaDeCurso(guia) && guia.course === curso);
}

/** Guía de un curso en un país concreto. */
export function guiaDeCurso(iso: string, curso: string): Guia | undefined {
  return guiasDelCurso(curso).find((guia) => guia.country === iso);
}

/** Cursos que tienen al menos una guía publicada (sin la sección general). */
export function cursosConGuia(): string[] {
  const vistos = new Set<string>();
  for (const guia of GUIAS) {
    if (guia.course !== "general") vistos.add(guia.course);
  }
  return [...vistos];
}

/** Países de config/paises.ts que tienen al menos una guía, en su orden. */
export function paisesConGuias(): string[] {
  const vistos = new Set(GUIAS.filter((guia) => guia.country !== "transversal").map((guia) => guia.country));
  return PAISES.filter((pais) => vistos.has(pais.iso)).map((pais) => pais.iso);
}
