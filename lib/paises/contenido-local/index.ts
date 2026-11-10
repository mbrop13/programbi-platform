import type { DatosBloqueLocal, PaginaBloqueLocal, RutaBloqueLocal } from "./tipos";
import ar from "./ar";
import co from "./co";

/**
 * Registro del contenido local de WS8. Se mantiene separado de
 * `lib/data/contenido-paises/index.ts` (WS7) para que la integración pueda
 * mover estos datos al registro único sin reescribir el contenido.
 */
const POR_ISO: Record<string, DatosBloqueLocal> = { ar, co };

export function getBloqueLocalPais(iso: string | null | undefined): DatosBloqueLocal | null {
  if (!iso) return null;
  return POR_ISO[iso] ?? null;
}

export function getPaginaBloqueLocal(
  iso: string | null | undefined,
  ruta: RutaBloqueLocal
): PaginaBloqueLocal | null {
  return getBloqueLocalPais(iso)?.paginas[ruta] ?? null;
}

/** Clave de ruta para una ficha de curso: `curso:power-bi`. */
export function rutaCursoBloque(slug: string): RutaBloqueLocal {
  return `curso:${slug}` as RutaBloqueLocal;
}

export function tieneBloqueLocal(iso: string | null | undefined): boolean {
  return getBloqueLocalPais(iso) != null;
}

export type { DatosBloqueLocal, PaginaBloqueLocal, FaqBloqueLocal, RutaBloqueLocal } from "./tipos";
export { RUTAS_BLOQUE_LOCAL } from "./tipos";
