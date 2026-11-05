import { guiasDePais, indiceGuias } from "@/lib/guias";
import { esGuiaPublicada } from "@/lib/guias/relacionadas";
import type { Guia } from "@/lib/guias/tipos";

/**
 * Guía publicada de un curso en un mercado concreto.
 *
 * Orden de preferencia:
 *  1. la guía del curso (`curso-<slug>-<pais>` o `curso-<tema>-<pais>`);
 *  2. cualquier guía del curso en ese país (por ejemplo `como-aprender-power-bi-en-chile`);
 *  3. otra guía del mismo mercado, si el curso no tiene una propia.
 *
 * Solo devuelve guías con ruta real (`esGuiaPublicada`), porque el bloque se
 * monta en HTML indexable y un 404 interno no se arregla con un redirect.
 */
export function guiaLocalDeCurso(iso: string, curso: string): Guia | undefined {
  const delPais = guiasDePais(iso).filter(esGuiaPublicada);
  const delCurso = delPais.filter((guia) => guia.course === curso);

  // El slug manda sobre el campo `course`: hay guías de una especialización
  // (por ejemplo `curso-analitica-mineria-chile`) que el generador etiqueta
  // con el curso base, y sin esta búsqueda la ficha se quedaría sin guía.
  const porSlug = delPais.filter((guia) => guia.slug.startsWith(`curso-${curso}-`));

  const candidatas = [
    ...porSlug,
    ...delCurso.filter((guia) => !porSlug.includes(guia)),
    ...delCurso.filter((guia) => guia.slug.startsWith(`curso-${curso}-`)),
    ...delCurso.filter((guia) => guia.slug.includes(curso)),
    ...delCurso.filter((guia) => guia.slug.startsWith("curso-")),
    ...delCurso.filter((guia) => guia.slug.startsWith("como-aprender-")),
    ...delCurso,
  ];

  return candidatas[0];
}

/** Ruta del índice de guías del mercado, para cuando el curso no tiene guía. */
export function hubGuiasDe(iso: string): string {
  return indiceGuias(iso);
}
