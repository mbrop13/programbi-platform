import type { ContenidoPais } from "./tipos";
import ar from "./ar";
import mx from "./mx";
import pe from "./pe";
import co from "./co";
import uy from "./uy";

/**
 * Países con contenido propio. Chile (raíz) mantiene su home actual y los
 * países sin entrada reciben la versión común, sin bloque local.
 */
const POR_ISO: Record<string, ContenidoPais> = { ar, mx, pe, co, uy };

export function getContenidoPais(iso: string | null | undefined): ContenidoPais | null {
  if (!iso) return null;
  return POR_ISO[iso] ?? null;
}

export const CONTENIDO_PAISES = POR_ISO;

export type {
  CategoriaFaqPais,
  CasoUsoPais,
  ContenidoPais,
  FaqPais,
  ReferenciaPais,
  SeoPagina,
  SeoPaginasPais,
} from "./tipos";
