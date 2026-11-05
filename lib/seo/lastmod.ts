import { esIsoPais } from "@/config/paises";

/**
 * Fechas reales de última modificación para el sitemap.
 *
 * Cada fecha es el día del último commit que tocó el archivo de la página:
 *
 *   git log -1 --format=%cs -- "app/(marketing)/precios/page.tsx"
 *
 * Las páginas de país usan la plantilla de `app/(pais)/[pais]/...`, que es el
 * archivo que de verdad se renderiza en `/{iso}/...`. Los cursos comparten
 * `lib/data/courses.ts`.
 *
 * No se usa `new Date()` como lastModified: una fecha que cambia en cada
 * request le dice a Google que todo el sitio se modificó y le resta valor a la
 * señal. Cuando una ruta no tiene fecha propia (por ejemplo una landing recién
 * integrada), se devuelve `SITE_ACTUALIZADO`, una constante estable que solo se
 * sube a mano cuando se revisa el sitio completo.
 */

/** Última revisión global del sitio. Se actualiza a mano, nunca por request. */
export const SITE_ACTUALIZADO = "2026-11-05";

/** Fecha de `lib/data/courses.ts`: contenido de todas las fichas de curso. */
const LASTMOD_CURSOS = "2026-11-04";

/** Fecha de `lib/data/cases.ts`: las ocho fichas de caso de uso. */
const LASTMOD_CASOS = "2026-11-04";

/** Rutas de Chile y páginas compartidas. */
const LASTMOD: Record<string, string> = {
  "/": "2026-11-03",
  "/empresas": "2026-11-04",
  "/implementacion-power-bi": "2026-11-03",
  "/migrar-excel-a-power-bi": "2026-11-03",
  "/por-que-fallan-proyectos-power-bi": "2026-11-03",
  "/curso-power-bi": "2026-11-03",
  "/curso-power-bi-vs-pack-adopcion": "2026-11-03",
  "/curso-sql-online": "2026-11-03",
  "/curso-python": "2026-11-03",
  "/power-bi-mineria-chile": "2026-09-25",
  "/cursos": "2026-11-04",
  "/precios": "2026-11-04",
  "/verificar-certificado": "2026-11-04",
  "/test-nivel": "2026-11-04",
  "/test-nivel/sql": "2026-11-04",
  "/test-nivel/excel": "2026-11-04",
  "/nosotros": "2026-11-03",
  "/referidos": "2026-09-27",
  "/referidos/terminos": "2026-09-27",
  "/faq": "2026-11-03",
  "/glosario": "2026-09-12",
  "/blog": "2026-11-03",
  "/empleos": "2026-09-12",
  "/empleos/vacantes": "2026-09-12",
  "/empleos/para-empresas": "2026-08-22",
  "/empleos/talento": "2026-08-22",
  "/versus": "2026-11-04",
  "/newsletter": "2026-09-12",
  "/privacidad": "2026-09-12",
  "/terminos": "2026-11-03",
  "/guias": "2026-11-04",
  "/preguntas-frecuentes": "2026-11-04",
};

/** Versiones por país: ruta sin el prefijo `/{iso}`, fecha de su plantilla. */
const LASTMOD_PAIS: Record<string, string> = {
  "/": "2026-11-03",
  "/empresas": "2026-10-21",
  "/implementacion-power-bi": "2026-11-03",
  "/migrar-excel-a-power-bi": "2026-11-03",
  "/por-que-fallan-proyectos-power-bi": "2026-11-03",
  "/curso-power-bi": "2026-11-03",
  "/curso-power-bi-vs-pack-adopcion": "2026-10-21",
  "/curso-sql-online": "2026-11-03",
  "/curso-python": "2026-11-03",
  "/cursos": "2026-11-03",
  "/precios": "2026-11-03",
  "/test-nivel": "2026-11-04",
  "/test-nivel/sql": "2026-11-03",
  "/test-nivel/excel": "2026-11-03",
  "/nosotros": "2026-11-03",
  "/faq": "2026-11-03",
  "/guias": "2026-11-04",
  "/preguntas-frecuentes": "2026-11-04",
};

function normalizarRuta(path: string): string {
  const sinQuery = (path.split("?")[0] ?? "/").split("#")[0] ?? "/";
  const limpio = sinQuery.replace(/^\/+|\/+$/g, "");
  return limpio ? `/${limpio}` : "/";
}

function fechaDeRuta(ruta: string): string | undefined {
  const propia = LASTMOD[ruta];
  if (propia) return propia;
  // Cualquier ficha de curso: /cursos/<slug>.
  if (ruta.startsWith("/cursos/")) return LASTMOD_CURSOS;
  // Fichas de caso de uso: /casos/<slug>.
  if (ruta.startsWith("/casos/")) return LASTMOD_CASOS;
  return undefined;
}

/**
 * Devuelve la fecha ISO `YYYY-MM-DD` de una ruta del sitemap.
 * Acepta la ruta con o sin prefijo de país (`/mx/precios` o `/precios`).
 */
export function lastmodDe(path: string): string {
  const ruta = normalizarRuta(path);
  const propia = fechaDeRuta(ruta);
  if (propia) return propia;

  const [primero, ...resto] = ruta.slice(1).split("/");
  if (esIsoPais(primero)) {
    const sinPais = resto.length ? `/${resto.join("/")}` : "/";
    const pais = LASTMOD_PAIS[sinPais] ?? fechaDeRuta(sinPais);
    if (pais) return pais;
  }

  return SITE_ACTUALIZADO;
}
