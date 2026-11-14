/**
 * Indexabilidad de las rutas con versión por país.
 *
 * Fuente única para decidir qué variantes por país se consolidan como
 * `noindex, follow`. La consumen los `generateMetadata` de país (vía
 * `metadataLocal`) y la usará el sitemap/hreflang (WS10) para no anunciar
 * URLs que no deben indexarse.
 *
 * Regla (encargo SEO 9 nov 2026):
 * - Si la URL no tiene clics en GSC (28 d) y su texto es > 70 % igual a la
 *   versión raíz de Chile → `noindex, follow`, fuera del sitemap y del hreflang.
 * - Si tiene clics → se deja indexable y se documenta la excepción.
 * - Prohibido canonical cruzado entre países: se usa noindex o 301, nunca un
 *   canonical que apunte a otro país.
 *
 * Solo aplica a los países secundarios de WS9. Chile (raíz) y los países
 * prioritarios (ar, mx, pe, co) no entran en esta lista; los países no
 * indexables (hn, ni, pa, py) ya quedan fuera por `config/paises.ts`.
 */

import { esIndexable, esIsoPais, ISO_CHILE, normalizarPais } from "@/config/paises";

/** Países secundarios del frente WS9 (los que hoy sí se indexan). */
export const PAISES_SECUNDARIOS = [
  "ec",
  "uy",
  "cr",
  "do",
  "gt",
  "ve",
  "bo",
  "sv",
] as const;

export type PaisSecundario = (typeof PAISES_SECUNDARIOS)[number];

/**
 * Países secundarios sin contenido editorial propio en rutas informativas:
 * comparten copia raíz de Chile y solo cambian moneda/horario.
 */
export const PAISES_SIN_CONTENIDO_LOCAL: readonly PaisSecundario[] = [
  "bo",
  "cr",
  "do",
  "ec",
  "gt",
  "sv",
  "ve",
];

/**
 * Rutas (sin prefijo de país) que se consolidan como noindex en cada país.
 * El valor es la lista de países afectados; permite excepciones por país sin
 * duplicar la regla.
 *
 * `/curso-power-bi` NO está aquí: WS3 lo resuelve con un 301 a
 * `/{pais}/cursos/power-bi`. Tampoco están las rutas que se mantienen
 * indexables: hub, `/cursos`, `/cursos/<curso>` y `/empresas`.
 */
export const RUTAS_NOINDEX_PAIS: Readonly<Record<string, readonly PaisSecundario[]>> = {
  "/precios": PAISES_SECUNDARIOS,
  // Uruguay queda indexable: su FAQ usa contenido propio (agro, frigoríficos,
  // horario de Montevideo, pago en UYU) y mide 7,1 % de similitud con /faq.
  "/preguntas-frecuentes": PAISES_SECUNDARIOS,
  "/faq": PAISES_SIN_CONTENIDO_LOCAL,
  "/curso-sql-online": PAISES_SECUNDARIOS,
  "/curso-python": PAISES_SECUNDARIOS,
  "/curso-power-bi-vs-pack-adopcion": PAISES_SECUNDARIOS,
  // Venezuela queda indexable: /ve/implementacion-power-bi tiene 1 clic en GSC
  // (28 d) y la regla manda no tocarla. Uruguay también: 38,9 % de similitud
  // con la raíz (contenido propio de agro/frigoríficos), bajo el umbral 70 %.
  "/implementacion-power-bi": ["ec", "cr", "do", "gt", "bo", "sv"],
  // Uruguay queda indexable: 38,7 % de similitud con la raíz.
  "/migrar-excel-a-power-bi": PAISES_SIN_CONTENIDO_LOCAL,
  "/nosotros": PAISES_SIN_CONTENIDO_LOCAL,
  "/por-que-fallan-proyectos-power-bi": PAISES_SECUNDARIOS,
  // Hoy estas URLs no existen para los países secundarios (el segmento
  // /[pais]/versus solo genera mx, co y ar, y el layout fija
  // dynamicParams = false). Se declaran para que, si se publican, nazcan
  // noindex y no se cuelen en el sitemap.
  "/versus/*": PAISES_SECUNDARIOS,
};

/**
 * Motivo editorial de cada bloque, para el reporte y para que la decisión no
 * se pierda con el tiempo. Los datos GSC son los del encargo (28 días).
 */
export const MOTIVOS_NOINDEX_PAIS: Readonly<Record<string, string>> = {
  "/precios":
    "Mismo listado y copy que /precios; solo cambian moneda y medios de pago. Similitud 84,5–86,4 % y sin clics GSC por URL.",
  "/preguntas-frecuentes":
    "Reexporta la página de Chile; mismas respuestas y JSON-LD. Similitud 94,6–95,1 %.",
  "/faq":
    "Duplicado de /faq (y de /{pais}/preguntas-frecuentes). Similitud 89,1–89,5 %; sin clics GSC. Uruguay se exceptúa (7,1 %).",
  "/curso-sql-online":
    "Landing que reexporta la raíz. Similitud 88,3–89,8 %; sin clics GSC.",
  "/curso-python":
    "Landing que reexporta la raíz. Similitud 89,6–90,4 %; sin clics GSC.",
  "/curso-power-bi-vs-pack-adopcion":
    "Comparativa idéntica a la raíz. Similitud 85,3–94,2 %. /sv suma 17 impresiones y 0 clics: se consolida igual.",
  "/implementacion-power-bi":
    "Reexporta la raíz (92,8–93,9 %). Excepciones: /ve con 1 clic se mantiene index; /uy con 38,9 % de similitud y contenido propio también.",
  "/migrar-excel-a-power-bi":
    "Reexporta la raíz (92,7–93,9 %). Excepción: /uy con 38,7 % de similitud y contenido propio se mantiene index.",
  "/nosotros":
    "Declara sede en Santiago de Chile sin contenido local propio en países secundarios sin contexto propio. Uruguay se exceptúa.",
  "/por-que-fallan-proyectos-power-bi":
    "Guía idéntica a la raíz. Similitud 90,6–97,2 %; sin clics GSC por URL.",
  "/versus/*":
    "Sin página publicada para países secundarios (404 por dynamicParams=false); si se publica, nace noindex.",
};

/**
 * Excepciones documentadas: rutas que la regla marcaría noindex pero que se
 * mantienen indexables por clics en GSC o por texto propio (< 70 %).
 */
export const EXCEPCIONES_INDEX_PAIS: Readonly<
  Record<string, readonly { ruta: string; motivo: string }[]>
> = {
  ve: [
    {
      ruta: "/implementacion-power-bi",
      motivo:
        "/ve/implementacion-power-bi tiene 1 clic en GSC (28 d): la regla prohíbe noindexar URLs con clics.",
    },
  ],
  uy: [
    {
      ruta: "/faq",
      motivo:
        "/uy/faq usa FAQ propia (agro, frigoríficos, Montevideo, pago en UYU) y mide 7,1 % de similitud con /faq.",
    },
    {
      ruta: "/implementacion-power-bi",
      motivo:
        "/uy/implementacion-power-bi tiene contenido propio y 38,9 % de similitud con la raíz (bajo el umbral 70 %).",
    },
    {
      ruta: "/migrar-excel-a-power-bi",
      motivo:
        "/uy/migrar-excel-a-power-bi tiene contenido propio y 38,7 % de similitud con la raíz (bajo el umbral 70 %).",
    },
  ],
};

function limpiarRuta(pathname: string): string {
  const sinQuery = (pathname || "/").split("?")[0]?.split("#")[0] || "/";
  const conBarra = sinQuery.startsWith("/") ? sinQuery : `/${sinQuery}`;
  if (conBarra.length > 1 && conBarra.endsWith("/")) return conBarra.slice(0, -1);
  return conBarra;
}

/**
 * Quita el prefijo de país de una ruta completa.
 * `/ec/precios` → `/precios`; `/precios` → `/precios`; `/` → `/`.
 */
export function rutaSinPais(pathname: string): string {
  const ruta = limpiarRuta(pathname);
  const partes = ruta.split("/").filter(Boolean);
  if (partes.length === 0) return "/";
  if (!esIsoPais(partes[0]) || partes[0] === ISO_CHILE) return ruta;
  const resto = partes.slice(1).join("/");
  return resto ? `/${resto}` : "/";
}

/** ¿La ruta (sin prefijo de país) coincide con el patrón declarado? */
export function coincidePatronRuta(patron: string, ruta: string): boolean {
  const limpio = limpiarRuta(ruta);
  if (patron.endsWith("/*")) {
    const base = patron.slice(0, -2);
    return limpio === base || limpio.startsWith(`${base}/`);
  }
  return limpio === patron;
}

/** Patrón de `RUTAS_NOINDEX_PAIS` que cubre la ruta, si existe. */
export function patronNoindexDeRuta(pathname: string): string | null {
  const ruta = rutaSinPais(pathname);
  for (const patron of Object.keys(RUTAS_NOINDEX_PAIS)) {
    if (coincidePatronRuta(patron, ruta)) return patron;
  }
  return null;
}

/**
 * ¿La variante `iso + path` debe salir con `noindex, follow`?
 *
 * Solo responde por la consolidación de rutas de países secundarios. La
 * indexabilidad global del país sigue viviendo en `esIndexable()`.
 */
export function esRutaNoindexPais(
  iso: string | null | undefined,
  pathname: string
): boolean {
  const pais = normalizarPais(iso);
  if (pais === ISO_CHILE || !esIsoPais(pais) || !esIndexable(pais)) return false;
  const patron = patronNoindexDeRuta(pathname);
  if (!patron) return false;
  return RUTAS_NOINDEX_PAIS[patron].includes(pais as PaisSecundario);
}

/**
 * Países afectados por una ruta. Si la ruta trae prefijo de país, devuelve
 * solo ese país (o [] si no está afectado); sin prefijo, devuelve la lista
 * completa del patrón. La usa WS10 para filtrar sitemap y hreflang.
 */
export function paisesDeRutaNoindex(pathname: string): string[] {
  const partes = limpiarRuta(pathname).split("/").filter(Boolean);
  const conPais = partes.length > 0 && esIsoPais(partes[0]) && partes[0] !== ISO_CHILE;
  const patron = patronNoindexDeRuta(pathname);
  if (!patron) return [];
  const paises = RUTAS_NOINDEX_PAIS[patron];
  if (!conPais) return [...paises];
  return paises.includes(partes[0] as PaisSecundario) ? [partes[0]] : [];
}

/** Rutas noindex declaradas para un país (patrones, sin prefijo). */
export function rutasNoindexDePais(iso: string | null | undefined): string[] {
  const pais = normalizarPais(iso);
  if (pais === ISO_CHILE || !esIsoPais(pais) || !esIndexable(pais)) return [];
  return Object.entries(RUTAS_NOINDEX_PAIS)
    .filter(([, paises]) => paises.includes(pais as PaisSecundario))
    .map(([ruta]) => ruta);
}

/**
 * Atajo para URLs absolutas o rutas completas: `/ec/precios` → true,
 * `/precios` → false (la raíz chilena se mantiene indexable).
 */
export function esUrlNoindexPais(url: string): boolean {
  let pathname = url;
  try {
    pathname = new URL(url).pathname;
  } catch {
    // Ya es una ruta relativa.
  }
  const partes = limpiarRuta(pathname).split("/").filter(Boolean);
  if (partes.length === 0) return false;
  const iso = partes[0];
  if (!esIsoPais(iso) || iso === ISO_CHILE) return false;
  return esRutaNoindexPais(iso, pathname);
}
