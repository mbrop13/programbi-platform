import { esIndexable, esIsoPais, ISO_CHILE } from "@/config/paises";

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

/**
 * Rutas noindex para TODOS los países con carpeta (Chile nunca entra aquí).
 *
 * PUNTO DE INSERCIÓN WS9 (único): WS9 decide con GSC + similitud qué variantes
 * thin (`/precios`, `/preguntas-frecuentes`, `/faq`, landings `curso-*`, etc.)
 * pasan a `noindex, follow`. Al integrar:
 *
 *   1. Si WS9 exporta su helper desde `lib/paises/`, reemplazar el cuerpo de
 *      `esRutaNoindexPais()` por un re-export de ese helper (misma firma).
 *   2. Si no, volcar aquí las rutas decididas para todos los países y en
 *      `RUTAS_NOINDEX_PAIS` las excepciones por país.
 *
 * Con eso, sitemap, hreflang y `metadataLocal()` quedan coherentes sin tocar
 * una por una las páginas.
 */
export const RUTAS_NOINDEX_PAIS_TODOS: readonly string[] = [
  // Vacío a propósito: WS9 aún no está integrado y no se inventan decisiones.
  // Ejemplo de entrada: "/precios".
];

/** Rutas noindex solo para ciertos países (excepciones de WS9). */
export const RUTAS_NOINDEX_PAIS: Readonly<Record<string, readonly string[]>> = {
  // Vacío a propósito. Ejemplo: { ve: ["/implementacion-power-bi"] } (NO: esa
  // URL tiene 1 clic en GSC y debe seguir indexable).
};

/**
 * Firma compatible con el helper que entregará WS9:
 * `esRutaNoindexPais(iso, path)`. Acepta la ruta con o sin prefijo de país.
 */
export function esRutaNoindexPais(
  iso: string | null | undefined,
  path: string
): boolean {
  if (!esIsoPais(iso) || iso === ISO_CHILE) return false;
  const ruta = normalizarRutaIndexabilidad(path);
  if (esRutaNoindexGlobal(ruta)) return true;
  if (PREFIJOS_NOINDEX_PAIS.some((patron) => coincide(ruta, patron))) return true;
  if (RUTAS_NOINDEX_PAIS_TODOS.some((patron) => coincide(ruta, patron))) return true;
  return (RUTAS_NOINDEX_PAIS[iso] ?? []).some((patron) => coincide(ruta, patron));
}

/** ¿La versión de esa ruta en ese país puede indexarse, anunciarse y llevar hreflang? */
export function esRutaIndexablePais(
  iso: string | null | undefined,
  path: string
): boolean {
  if (!esIsoPais(iso) || !esIndexable(iso)) return false;
  return !esRutaNoindexPais(iso, path);
}

/* ──────────────────────────────────────────────────────────────────────────
 * WS1 · Profesores indexables
 *
 * PUNTO DE INSERCIÓN ÚNICO. Cuando WS1 esté integrado, `lib/data/equipo.ts`
 * exportará `perfilIndexable(miembro)` y `/profesores` será siempre indexable.
 * Ese día, reemplazar este bloque por:
 *
 *   import { EQUIPO, perfilIndexable, rutaPerfil } from "@/lib/data/equipo";
 *   export const LISTADO_PROFESORES_INDEXABLE = true;
 *   export const PROFESORES_INDEXABLES = EQUIPO
 *     .filter(perfilIndexable)
 *     .map((miembro) => rutaPerfil(miembro.slug));
 *
 * Hoy WS1 no está en esta rama y `/profesores` responde `noindex, follow`
 * (flag `EQUIPO_PUBLICADO` apagado): anunciarlo en el sitemap sería anunciar
 * una URL noindex. Por eso la lista va vacía y el listado queda fuera.
 * ────────────────────────────────────────────────────────────────────────── */

/** ¿El listado `/profesores` puede anunciarse? (WS1 lo pondrá en `true`). */
export const LISTADO_PROFESORES_INDEXABLE: boolean = false;

/** Rutas de fichas `/profesores/<slug>` que cumplen `perfilIndexable`. */
export const PROFESORES_INDEXABLES: readonly string[] = [];
