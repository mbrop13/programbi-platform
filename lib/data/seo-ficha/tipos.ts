import type { EnlaceCurso } from "@/lib/seo/enlaces/tipos";

/**
 * Bloque editorial extra de una ficha de curso.
 *
 * Vive fuera de `COURSE_SEO` porque es contenido largo de una sola ficha: se
 * renderiza en el servidor, debajo del bloque de país, y suma materia única
 * (temario por clase, proyecto, ruta laboral) sin repetir lo que ya muestran
 * el temario y las preguntas frecuentes.
 *
 * Todo lo que afirme el bloque debe salir del repo (syllabus, precios,
 * horarios, guías). No inventar métricas de empleo, sueldos ni testimonios.
 */
export type BloqueSeoFicha = {
  /** Etiqueta corta sobre el título («Temario por clase», «Ruta laboral»). */
  eyebrow?: string;
  titulo: string;
  /** Párrafos de entrada, en orden de lectura. */
  parrafos?: string[];
  /** Lista de puntos concretos (una clase, un módulo, un entregable). */
  bullets?: string[];
  /** Enlaces ya publicados que amplían el bloque. */
  enlaces?: EnlaceCurso[];
};
