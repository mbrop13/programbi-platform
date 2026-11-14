import { esIndexable } from "@/config/paises";
import { GUIAS } from "@/lib/guias/generado";
import type { Guia } from "@/lib/guias/tipos";

/**
 * Guías indexables y enlazables en todo el sitio: las transversales y las
 * de países con `indexable: true` en `config/paises.ts`. Las de países no
 * indexables (como Paraguay hoy) conservan su ruta propia con `noindex`, pero
 * no se promueven desde fichas ni hubs indexables.
 */
export function esGuiaPublicada(guia: Guia): boolean {
  return guia.country === "transversal" || esIndexable(guia.country);
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
