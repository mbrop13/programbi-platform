import { absoluteUrl } from "@/lib/seo";
import { esIndexable } from "@/config/paises";
import { GUIAS } from "@/lib/guias/generado";
import type { Guia } from "@/lib/guias/tipos";

export type { Guia } from "@/lib/guias/tipos";

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

const CLUSTER_POWER_BI = GUIAS.filter(
  (guia) =>
    guia.course === "power-bi" &&
    guia.slug.startsWith("como-aprender-power-bi-en-") &&
    esIndexable(guia.country)
);

/**
 * Alternates del clúster de guías de país: es-CL…es-UY recíprocos y
 * x-default a Chile. Paraguay queda fuera porque su versión es noindex.
 * Son contenidos distintos sobre el mismo tema, por eso es válido enlazarlos
 * como alternates (cada uno con canonical propio).
 */
export function alternatesGuiaPais(guia: Guia): Record<string, string> | undefined {
  if (!CLUSTER_POWER_BI.some((item) => item.path === guia.path)) return undefined;
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(getGuia("/guias/como-aprender-power-bi-en-chile").path),
  };
  for (const item of CLUSTER_POWER_BI) languages[item.lang] = absoluteUrl(item.path);
  return languages;
}

/** Alternates del piloto Claude: CL ↔ MX, x-default a Chile. */
export function alternatesClaude(guia: Guia): Record<string, string> | undefined {
  if (!guia.slug.startsWith("como-usar-claude-para-analisis-de-datos")) return undefined;
  const cl = getGuia("/guias/como-usar-claude-para-analisis-de-datos");
  const mx = getGuia("/mx/guias/como-usar-claude-para-analisis-de-datos");
  return {
    "es-CL": absoluteUrl(cl.path),
    "es-MX": absoluteUrl(mx.path),
    "x-default": absoluteUrl(cl.path),
  };
}

/** Ruta del índice de guías de un país. */
export function indiceGuias(iso: string): string {
  return iso === "cl" ? "/guias" : `/${iso}/guias`;
}

/**
 * Guías nuevas por curso × país: el slug empieza con `curso-` y el curso viene
 * del frontmatter. Son las que llegan desde `guias/*.md`.
 */
export function esGuiaDeCurso(guia: Guia): boolean {
  return guia.slug.startsWith("curso-");
}

/** Todas las guías de un curso (una por país, más las que existan). */
export function guiasDelCurso(curso: string): Guia[] {
  return GUIAS.filter((guia) => esGuiaDeCurso(guia) && guia.course === curso);
}

/** Guía de un curso en un país concreto. */
export function guiaDeCurso(iso: string, curso: string): Guia | undefined {
  return guiasDelCurso(curso).find((guia) => guia.country === iso);
}

/** Cursos que tienen al menos una guía publicada. */
export function cursosConGuia(): string[] {
  const vistos = new Set<string>();
  for (const guia of GUIAS) {
    if (esGuiaDeCurso(guia)) vistos.add(guia.course);
  }
  return [...vistos];
}

/**
 * Alternates del clúster curso × país: la misma guía escrita para cada mercado,
 * recíprocas y con `x-default` a Chile. Paraguay queda fuera porque su versión
 * es noindex hasta que tenga precio publicado.
 */
export function alternatesCurso(guia: Guia): Record<string, string> | undefined {
  if (!esGuiaDeCurso(guia)) return undefined;
  const grupo = guiasDelCurso(guia.course).filter((item) => esIndexable(item.country));
  if (grupo.length < 2) return undefined;
  const cl = grupo.find((item) => item.country === "cl");
  const languages: Record<string, string> = {};
  if (cl) languages["x-default"] = absoluteUrl(cl.path);
  for (const item of grupo) languages[item.lang] = absoluteUrl(item.path);
  return languages;
}
