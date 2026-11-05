import { esIndexable, esIsoPais, getPais, type Pais } from "@/config/paises";

/**
 * Mapa estático de mercados vecinos para el enlazado entre fichas.
 *
 * Cada entrada lista 2 o 3 países con los que tiene sentido comparar horario,
 * moneda y medios de pago. Es un mapa editorial, no geográfico: sigue el orden
 * en que se publicaron las versiones por país y los vínculos comerciales que ya
 * existen en `config/paises.ts`.
 *
 * Paraguay aparece como vecino de Argentina y Uruguay porque comparte guías y
 * frontera, pero su versión todavía no se indexa: `vecinosDe` lo filtra.
 */
export const VECINOS: Record<string, string[]> = {
  cl: ["ar", "pe", "uy"],
  ar: ["cl", "uy", "py"],
  mx: ["co", "pe"],
  co: ["mx", "pe"],
  pe: ["cl", "co"],
  uy: ["ar", "cl", "py"],
  py: ["ar", "uy"],
};

/**
 * Vecinos con ficha de curso real e indexable.
 *
 * Todas las versiones con carpeta tienen ficha (`app/(pais)/[pais]/cursos/[slug]`
 * reexporta la de marketing y el layout fija `dynamicParams = false`), así que el
 * único filtro necesario es `indexable`: deja fuera a Paraguay y a los mercados
 * que hoy van en noindex.
 */
export function vecinosDe(iso: string | null | undefined): Pais[] {
  if (!esIsoPais(iso)) return [];
  const propios = VECINOS[iso] ?? [];
  return propios
    .filter((vecino) => vecino !== iso && esIsoPais(vecino) && esIndexable(vecino))
    .map((vecino) => getPais(vecino));
}

/** ¿Los dos mercados se enlazan como vecinos? Útil para tests y para el sitemap interno. */
export function sonVecinos(a: string, b: string): boolean {
  return (VECINOS[a] ?? []).includes(b);
}
