import type { ContenidoPais } from "./tipos";
import ar from "./ar";
import mx, { bloqueLocal as bloqueMx } from "./mx";
import pe, { bloqueLocal as bloquePe } from "./pe";
import co from "./co";
import uy from "./uy";
import us, { bloqueLocal as bloqueUs } from "./us";
import es, { bloqueLocal as bloqueEs } from "./es";
import bo from "./bo";
import cr from "./cr";
import ec from "./ec";
import sv from "./sv";
import gt from "./gt";
import hn from "./hn";
import ni from "./ni";
import pa from "./pa";
import py from "./py";
import dominicana from "./do";
import ve from "./ve";
import {
  construirBloque,
  type DatosBloqueLocal,
  type DefinicionBloqueLocal,
  type RutaSeoLocal,
} from "./bloque";
import type { SeoPagina } from "./tipos";

/**
 * Países con contenido propio. Chile (raíz) mantiene su home actual; desde el
 * 24 nov 2026 los 18 países con carpeta tienen entrada propia.
 */
const POR_ISO: Record<string, ContenidoPais> = {
  ar,
  mx,
  pe,
  co,
  uy,
  us,
  es,
  bo,
  cr,
  ec,
  sv,
  gt,
  hn,
  ni,
  pa,
  py,
  do: dominicana,
  ve,
};

export function getContenidoPais(iso: string | null | undefined): ContenidoPais | null {
  if (!iso) return null;
  return POR_ISO[iso] ?? null;
}

export const CONTENIDO_PAISES = POR_ISO;

/**
 * Países con bloque local de datos duros (precio, horario, pago, cuotas,
 * clase gratis y certificado). WS8 suma `ar` y `co` agregando su definición
 * a este registro; las páginas no cambian.
 */
const BLOQUES: Record<string, DefinicionBloqueLocal> = {
  pe: bloquePe,
  mx: bloqueMx,
  us: bloqueUs,
  es: bloqueEs,
};

/**
 * Bloque resuelto de un país, o `null` si no tiene definición.
 * `opciones.curso` cambia el precio y el título por el de una ficha.
 */
export function getBloqueLocal(
  iso: string | null | undefined,
  opciones: { curso?: string } = {}
): DatosBloqueLocal | null {
  if (!iso) return null;
  return construirBloque(BLOQUES[iso], opciones);
}

/** Title/description propios de una de las siete rutas del frente. */
export function getSeoBloque(
  iso: string | null | undefined,
  ruta: RutaSeoLocal
): SeoPagina | null {
  if (!iso) return null;
  return BLOQUES[iso]?.seo[ruta] ?? null;
}

export type {
  ClaveHechoLocal,
  DatosBloqueLocal,
  DefinicionBloqueLocal,
  EnlaceLocal,
  FaqLocal,
  HechoLocal,
  RutaSeoLocal,
} from "./bloque";

export { esRutaSeoLocal, RUTAS_SEO_LOCAL } from "./bloque";

export type {
  CategoriaFaqPais,
  CasoUsoPais,
  ContenidoPais,
  FaqPais,
  ReferenciaPais,
  SeoPagina,
  SeoPaginasPais,
} from "./tipos";
