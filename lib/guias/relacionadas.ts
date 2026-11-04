import { GUIAS } from "@/lib/guias/generado";
import type { Guia } from "@/lib/guias/tipos";

/**
 * Países con ruta de guía generada: la raíz (Chile y transversales) y las
 * carpetas de app/(pais)/[pais]/guias. El resto de las guías del generado
 * todavía no tiene página y no debe enlazarse.
 */
const PAISES_CON_RUTA_DE_GUIA = new Set([
  "cl",
  "transversal",
  "ar",
  "mx",
  "pe",
  "co",
  "uy",
  "py",
]);

export function esGuiaPublicada(guia: Guia): boolean {
  return PAISES_CON_RUTA_DE_GUIA.has(guia.country);
}

/**
 * Guías relacionadas para el bloque de enlazado interno de una guía.
 *
 * Orden determinista, sin duplicados:
 *  1. mismo curso en otros países (excluye la guía actual);
 *  2. mismo país con otros cursos;
 *  3. transversales del mismo curso.
 *
 * El resultado conserva el orden de `GUIAS`, que es estable porque el archivo
 * se genera a partir de fuentes ordenadas.
 */
export function guiasRelacionadas(guia: Guia, limite = 6): Guia[] {
  const max = Math.max(0, Math.trunc(limite));
  if (max === 0) return [];

  const vistos = new Set<string>([guia.path]);
  const salida: Guia[] = [];

  const agregar = (items: Guia[]) => {
    for (const item of items) {
      if (salida.length >= max) return;
      if (vistos.has(item.path)) continue;
      vistos.add(item.path);
      salida.push(item);
    }
  };

  const publicadas = GUIAS.filter(esGuiaPublicada);
  const mismoCurso = publicadas.filter(
    (item) => item.course === guia.course && item.path !== guia.path
  );

  agregar(
    mismoCurso.filter((item) => item.country !== guia.country && item.country !== "transversal")
  );
  agregar(
    publicadas.filter((item) => item.country === guia.country && item.course !== guia.course)
  );
  agregar(mismoCurso.filter((item) => item.country === "transversal"));

  return salida;
}
