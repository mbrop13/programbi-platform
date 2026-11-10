import { esIndexable, esIsoPais, ISO_CHILE, normalizarPais } from "@/config/paises";

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
 * ──────────────────────────────────────────────────────────────────────────
 * ESTADO AL CIERRE DE WS10 (9 nov 2026): esta rama NO tiene mergeados WS1–WS9,
 * así que aquí viven las decisiones que el encargo (§3) ya conoce. Al integrar,
 * Hermes solo debe reemplazar los dos bloques marcados «PUNTO DE INSERCIÓN»:
 *   1. WS9: `RUTAS_NOINDEX_PAIS` / `esRutaNoindexPais` → re-exportar
 *      `@/lib/paises/indexabilidad` (misma firma; ese helper manda).
 *   2. WS1: `LISTADO_PROFESORES_INDEXABLE` / `PROFESORES_INDEXABLES` →
 *      importar `RUTAS_PROFESORES_INDEXABLES` desde `@/lib/data/equipo`.
 * El resto del archivo funciona sin cambios con ambos merges.
 * ──────────────────────────────────────────────────────────────────────────
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
 * PUNTO DE INSERCIÓN WS3: si la decisión final para `/curso-python` o
 * `/curso-sql-online` es 301, agregarlas aquí (una línea) y el sitemap y el
 * hreflang las dejan fuera automáticamente. Hoy siguen indexables y anunciadas
 * porque WS3 aún no cerró esa decisión.
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

/** Países secundarios del frente WS9 (los que hoy sí se indexan). */
export const PAISES_SECUNDARIOS: readonly string[] = [
  "ec",
  "uy",
  "cr",
  "do",
  "gt",
  "ve",
  "bo",
  "sv",
];

/**
 * Variantes por país que se consolidan como `noindex, follow` (WS9).
 *
 * Mapa `ruta sin prefijo de país → países afectados`, en espejo del helper de
 * WS9 (`lib/paises/indexabilidad.ts`). Solo se listan países secundarios:
 * Chile y los prioritarios (ar, mx, pe, co) no entran. Con esta sola tabla,
 * sitemap, hreflang y `metadataLocal()` quedan coherentes sin listas paralelas.
 *
 * Excepciones documentadas (por eso el array de cada patrón no es siempre el
 * mismo): Uruguay conserva `/faq`, `/implementacion-power-bi` y
 * `/migrar-excel-a-power-bi` por contenido propio y < 70 % de similitud;
 * Venezuela conserva `/implementacion-power-bi` porque tiene 1 clic en GSC.
 */
export const RUTAS_NOINDEX_PAIS: Readonly<Record<string, readonly string[]>> = {
  "/precios": PAISES_SECUNDARIOS,
  "/preguntas-frecuentes": PAISES_SECUNDARIOS,
  "/faq": ["ec", "cr", "do", "gt", "ve", "bo", "sv"],
  "/curso-sql-online": PAISES_SECUNDARIOS,
  "/curso-python": PAISES_SECUNDARIOS,
  "/curso-power-bi-vs-pack-adopcion": PAISES_SECUNDARIOS,
  "/implementacion-power-bi": ["ec", "cr", "do", "gt", "bo", "sv"],
  "/migrar-excel-a-power-bi": ["ec", "cr", "do", "gt", "ve", "bo", "sv"],
  "/por-que-fallan-proyectos-power-bi": PAISES_SECUNDARIOS,
  // Hoy no hay página publicada para países secundarios; se declara para que,
  // si se publica, nazca noindex y no se cuele en sitemap/hreflang.
  "/versus": PAISES_SECUNDARIOS,
};

/**
 * ¿La variante `iso + path` debe salir con `noindex, follow`?
 *
 * Acepta la ruta con o sin prefijo de país. Solo responde por la consolidación
 * de rutas de países secundarios; la indexabilidad global del país sigue
 * viviendo en `esIndexable()`.
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
  return Object.entries(RUTAS_NOINDEX_PAIS).some(
    ([patron, paises]) => paises.includes(pais) && coincide(ruta, patron)
  );
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
 * variantes thin de país. Es el ÚNICO punto que debe ajustar Hermes si al
 * integrar cambia una decisión de indexabilidad.
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
 * WS1 · Profesores indexables — PUNTO DE INSERCIÓN
 *
 * WS1 deja `perfilIndexable()` y `RUTAS_PROFESORES_INDEXABLES` en
 * `lib/data/equipo.ts`. Como esta rama no lo tiene mergeado, se declara la
 * lista que el encargo §3 ya conoce: el listado (siempre indexable) y las tres
 * fichas con datos verificables. Al integrar, reemplazar este bloque por:
 *
 *   import { RUTAS_PROFESORES_INDEXABLES } from "@/lib/data/equipo";
 *   export const LISTADO_PROFESORES_INDEXABLE = true;
 *   export const PROFESORES_INDEXABLES =
 *     RUTAS_PROFESORES_INDEXABLES.filter((p) => p !== "/profesores");
 *
 * (o simplemente hacer que el sitemap consuma `RUTAS_PROFESORES_INDEXABLES`).
 * ────────────────────────────────────────────────────────────────────────── */

/** ¿El listado `/profesores` puede anunciarse? (WS1 lo deja indexable). */
export const LISTADO_PROFESORES_INDEXABLE: boolean = true;

/** Rutas de fichas `/profesores/<slug>` que cumplen `perfilIndexable`. */
export const PROFESORES_INDEXABLES: readonly string[] = [
  "/profesores/manuel-oliva",
  "/profesores/emanuel-berrocal",
  "/profesores/rodrigo-vega",
];
