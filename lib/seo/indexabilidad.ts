import { esIndexable, esIsoPais, ISO_CHILE, normalizarPais } from "@/config/paises";
import { RUTAS_PROFESORES_INDEXABLES } from "@/lib/data/equipo";
import { esRutaNoindexPais as esVarianteThinPais } from "@/lib/paises/indexabilidad";

// Fuente única (WS9) de las variantes thin por país. Se re-exportan con los
// mismos nombres para no romper a quien ya las importaba desde este archivo.
export { PAISES_SECUNDARIOS, RUTAS_NOINDEX_PAIS } from "@/lib/paises/indexabilidad";

/**
 * Fuente única (lado SEO) de qué rutas pueden anunciarse en el sitemap y
 * llevar hreflang.
 *
 * El sitemap y `hreflangDe()` consumen SOLO este archivo. Así una ruta noindex
 * no puede quedar anunciada por error y ninguna `alternate` apunta a una URL
 * que no se indexa.
 *
 * Regla de oro: si una URL no está en el sitemap, tampoco puede aparecer como
 * `alternate` de otra. Ambos lados salen de las mismas funciones.
 *
 * Las tablas de variantes thin por país viven en `@/lib/paises/indexabilidad`
 * (WS9) y la lista de profesores en `@/lib/data/equipo` (WS1): aquí solo se
 * agregan las capas globales (noindex de sitio y prefijos estructurales por
 * país).
 */

/** Quita query, hash, barra final y, si viene, el prefijo de país. */
export function normalizarRutaIndexabilidad(path: string): string {
  const limpio = (path.split("?")[0] ?? "/").split("#")[0] ?? "/";
  const conBarra = limpio.startsWith("/") ? limpio : `/${limpio}`;
  const partes = conBarra.split("/").filter(Boolean);
  if (partes.length > 0 && esIsoPais(partes[0]) && partes[0] !== ISO_CHILE) {
    const resto = partes.slice(1);
    return resto.length ? `/${resto.join("/")}` : "/";
  }
  const sinFinal = conBarra.replace(/\/+$/, "");
  return sinFinal || "/";
}

function coincide(ruta: string, patron: string): boolean {
  return ruta === patron || ruta.startsWith(`${patron}/`);
}

/**
 * Rutas que NUNCA se anuncian ni llevan hreflang, en ningún país.
 *
 * - `/pago`: noindex, follow + `Disallow: /pago` (WS3).
 * - `/curso-power-bi`: 301 a `/cursos/power-bi` (WS3). Sus variantes de país
 *   también son 301; se cubren con el prefijo de país de más abajo.
 *
 * `/curso-python` y `/curso-sql-online` NO entran aquí: por decisión de Radar
 * siguen indexables y anunciadas en Chile y en los países prioritarios porque
 * tienen contenido propio por país de la fase 4. En los países secundarios sí
 * se consolidan como variante thin vía `RUTAS_NOINDEX_PAIS` (WS9).
 */
export const RUTAS_NOINDEX_GLOBAL: readonly string[] = ["/pago", "/curso-power-bi"];

/** ¿La ruta es noindex/redirigida en todo el sitio (incluida Chile)? */
export function esRutaNoindexGlobal(path: string): boolean {
  const ruta = normalizarRutaIndexabilidad(path);
  return RUTAS_NOINDEX_GLOBAL.some((patron) => coincide(ruta, patron));
}

/**
 * Prefijos de país que son noindex por decisión estructural, no por datos:
 *
 * - `/test-nivel/**`: WS6. Las variantes por país son `noindex, follow`, fuera
 *   de sitemap y sin hreflang. La raíz chilena `/test-nivel` sigue indexable.
 * - `/curso-power-bi`: WS3. `/{pais}/curso-power-bi` es 301 a la ficha local.
 */
const PREFIJOS_NOINDEX_PAIS: readonly string[] = ["/test-nivel", "/curso-power-bi"];

/**
 * ¿La variante `iso + path` debe salir con `noindex, follow`?
 *
 * Acepta la ruta con o sin prefijo de país. Combina tres capas: noindex global,
 * prefijos estructurales por país (WS6/WS3) y la tabla thin de países
 * secundarios de `@/lib/paises/indexabilidad` (WS9), que es la fuente única de
 * esa consolidación. La indexabilidad global del país sigue en `esIndexable()`.
 */
export function esRutaNoindexPais(
  iso: string | null | undefined,
  path: string
): boolean {
  const pais = normalizarPais(iso);
  if (!esIsoPais(pais) || pais === ISO_CHILE || !esIndexable(pais)) return false;
  const ruta = normalizarRutaIndexabilidad(path);
  if (esRutaNoindexGlobal(ruta)) return true;
  if (PREFIJOS_NOINDEX_PAIS.some((patron) => coincide(ruta, patron))) return true;
  return esVarianteThinPais(pais, ruta);
}

/** ¿La versión de esa ruta en ese país puede indexarse, anunciarse y llevar hreflang? */
export function esRutaIndexablePais(
  iso: string | null | undefined,
  path: string
): boolean {
  if (!esIsoPais(iso) || !esIndexable(iso)) return false;
  return !esRutaNoindexPais(iso, path);
}

/**
 * Última red de seguridad para el sitemap: ¿esta URL (ruta o absoluta) puede
 * anunciarse? Devuelve `false` para noindex globales, países no indexables y
 * variantes thin de país. Es el ÚNICO punto que debe ajustarse si cambia una
 * decisión de indexabilidad.
 */
export function esRutaAnunciable(pathOrUrl: string): boolean {
  const raw = (pathOrUrl || "").trim();
  if (!raw) return false;
  let pathname = raw;
  if (/^https?:\/\//i.test(raw)) {
    try {
      pathname = new URL(raw).pathname;
    } catch {
      return false;
    }
  }
  const ruta = (pathname.split("?")[0] ?? "/").split("#")[0] ?? "/";
  if (esRutaNoindexGlobal(ruta)) return false;
  const primero = ruta.split("/").filter(Boolean)[0];
  if (primero && esIsoPais(primero) && primero !== ISO_CHILE) {
    return esRutaIndexablePais(primero, ruta);
  }
  return true;
}

/* ──────────────────────────────────────────────────────────────────────────
 * WS1 · Profesores indexables
 *
 * La lista sale de `RUTAS_PROFESORES_INDEXABLES` en `lib/data/equipo.ts`
 * (listado + fichas que cumplen `perfilIndexable`). Aquí solo se separa el
 * listado de las fichas para que el sitemap aplique prioridades distintas.
 * ────────────────────────────────────────────────────────────────────────── */

/** ¿El listado `/profesores` puede anunciarse? */
export const LISTADO_PROFESORES_INDEXABLE: boolean =
  RUTAS_PROFESORES_INDEXABLES.includes("/profesores");

/** Rutas de fichas `/profesores/<slug>` que cumplen `perfilIndexable`. */
export const PROFESORES_INDEXABLES: readonly string[] =
  RUTAS_PROFESORES_INDEXABLES.filter((p) => p !== "/profesores");
