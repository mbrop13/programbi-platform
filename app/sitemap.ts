import type { MetadataRoute } from "next";
import { courses } from "@/lib/data/courses";
import { casesOfUse } from "@/lib/data/cases";
import { comparisons } from "@/lib/data/comparisons";
import {
  ACTUALIZADO as COMPARATIVAS_ACTUALIZADO,
  RUTA_LISTICLE,
  RUTAS_CODERHOUSE_PAIS,
  RUTAS_COMPARATIVAS_ACADEMIA,
} from "@/lib/data/comparativas";
import { SITE_URL, sitemapLoc } from "@/lib/seo";
import {
  LISTADO_PROFESORES_INDEXABLE,
  PROFESORES_INDEXABLES,
  esRutaAnunciable,
  esRutaIndexablePais,
  esRutaNoindexPais,
} from "@/lib/seo/indexabilidad";
import { TESTIMONIOS_PUBLICADOS } from "@/lib/data/testimonials";
import { SITE_ACTUALIZADO, lastmodDe } from "@/lib/seo/lastmod";
import { PAISES_CARPETA, esIndexable, esIsoPais } from "@/config/paises";
import { GUIAS } from "@/lib/guias/generado";
import { guiasDePais } from "@/lib/guias";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";
import { isVanityBlogPost } from "@/lib/seo/money";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Sitemap único del sitio.
 *
 * ¿Por qué no un sitemap index? Hoy son ~500 URLs: un solo `urlset` está muy
 * por debajo del límite de 50.000 de Google y evita rutas extra que habría que
 * mantener sincronizadas. Si algún día pasa de ~20.000, se divide con
 * `generateSitemaps()` sin cambiar las listas de abajo.
 *
 * Regla: aquí solo entra lo que responde 200, es indexable, tiene canonical
 * propio y sus alternates son recíprocas. La decisión vive en
 * `lib/seo/indexabilidad.ts` (misma fuente que `hreflangDe()`), nunca en una
 * lista duplicada dentro de este archivo.
 */

const PRIMARY_COURSE_SLUGS = new Set([
  "analisis-de-datos",
  "power-bi",
  "power-automate",
  "analitica-mineria",
]);

/**
 * Países con prioridad alta: mercado principal y precio propio en su moneda.
 * Paraguay entra en la lista aunque hoy siga `indexable: false` (sin precio
 * publicado): el día que se encienda hereda la prioridad alta sin tocar esto.
 * El resto de los indexables (Bolivia, Costa Rica, Ecuador, El Salvador,
 * Guatemala, Rep. Dominicana y Venezuela) baja un escalón. Chile va aparte,
 * en la raíz y con prioridad 1.
 */
const PAISES_DESTACADOS = new Set(["mx", "co", "ar", "pe", "uy", "py"]);

/** Tope de espera para Supabase: el sitemap nunca queda colgado por el blog. */
const BLOG_TIMEOUT_MS = 5000;

type EntradaSitemap = MetadataRoute.Sitemap[number];
type CambioFrecuencia = NonNullable<EntradaSitemap["changeFrequency"]>;
type EntradaPosible = EntradaSitemap | null | undefined;

async function conTimeout<T>(promesa: PromiseLike<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`sitemap: timeout de ${ms} ms`)), ms);
  });
  try {
    // `await` es obligatorio: con `return Promise.race(...)` el `finally`
    // correría antes de que la carrera termine y apagaría el timer en el acto.
    return await Promise.race([Promise.resolve(promesa), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Entrada del sitemap con la fecha real de su archivo y sus alternates.
 *
 * Devuelve `null` si la ruta no se puede anunciar (redirección, noindex o URL
 * inválida). Nunca lanza: una lista mal formada omite la entrada y sigue.
 */
function entrada(
  path: string,
  priority: number,
  changeFrequency: CambioFrecuencia,
  lastModified: string = lastmodDe(path)
): EntradaPosible {
  if (!esRutaAnunciable(path)) return null;
  const url = sitemapLoc(path);
  if (!url) return null;

  const languages = hreflangDe(path);
  const entry: EntradaSitemap = { url, lastModified, changeFrequency, priority };
  if (Object.keys(languages).length > 0) entry.alternates = { languages };
  return entry;
}

/**
 * Deduplica y aplica un último control de indexabilidad directamente sobre la
 * URL final. Es una red de seguridad: aunque una lista de arriba se equivoque,
 * una URL noindex/redirigida no sale en el XML.
 */
function uniqueEntries(entries: EntradaPosible[]): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];
  for (const entry of entries) {
    if (!entry) continue;
    const url = sitemapLoc(entry.url);
    if (!url) continue;
    if (url !== SITE_URL && !url.startsWith(`${SITE_URL}/`)) continue;
    const { pathname } = new URL(url);
    // Las imágenes generadas por ruta (/opengraph-image, /twitter-image) no
    // son páginas: fuera aunque alguna lista las arrastre.
    if (/\/(opengraph-image|twitter-image)(\/|$)/.test(pathname)) continue;
    // Una sola fuente para noindex global, país no indexable y variantes thin.
    if (!esRutaAnunciable(pathname)) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    out.push({ ...entry, url });
  }
  return out;
}

function blogSlug(raw: string): string | null {
  const slug = raw.trim().split("?")[0].split("#")[0].replace(/^\/+|\/+$/g, "");
  if (!slug || slug.includes("/") || slug.includes("://") || slug.includes("&")) return null;
  return slug;
}

/** `YYYY-MM-DD` estable a partir de la fecha publicada en Supabase. */
function fechaIso(valor: unknown): string | null {
  if (typeof valor !== "string" && !(valor instanceof Date)) return null;
  const fecha = valor instanceof Date ? valor : new Date(valor);
  if (Number.isNaN(fecha.getTime())) return null;
  return fecha.toISOString().slice(0, 10);
}

/**
 * Artículos publicados del blog. Si Supabase falla, tarda o devuelve basura,
 * devuelve `[]`: el sitemap se genera igual, sin esas entradas. Nunca lanza.
 */
async function publishedBlogUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const db = createAdminClient();
    const consulta = db
      .from("newsletter_articles")
      .select("slug, title, excerpt, published_at")
      .eq("status", "published");
    const { data, error } = await conTimeout(consulta, BLOG_TIMEOUT_MS);
    if (error || !data) return [];
    return data.flatMap((row) => {
      const slug = typeof row.slug === "string" ? blogSlug(row.slug) : null;
      if (!slug) return [];
      if (isVanityBlogPost(row.title, row.excerpt, slug)) return [];
      return [
        {
          url: sitemapLoc(`/blog/${slug}`) ?? "",
          // `published_at` es la fecha real del artículo; si viene vacía o
          // inválida se usa la constante estable del sitio, nunca `new Date()`.
          lastModified: fechaIso(row.published_at) ?? SITE_ACTUALIZADO,
          changeFrequency: "weekly" as const,
          priority: 0.4,
        },
      ].filter((entradaBlog) => Boolean(entradaBlog.url));
    });
  } catch (err) {
    console.error("sitemap blog posts:", err);
    return [];
  }
}

function prioridadPais(base: number, iso: string): number {
  const factor = PAISES_DESTACADOS.has(iso) ? 0.9 : 0.75;
  return Math.round(base * factor * 100) / 100;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: EntradaPosible[] = [
    entrada("/", 1, "weekly"),
    entrada("/empresas", 0.95, "weekly"),
    entrada("/implementacion-power-bi", 0.9, "monthly"),
    entrada("/migrar-excel-a-power-bi", 0.9, "monthly"),
    entrada("/por-que-fallan-proyectos-power-bi", 0.8, "monthly"),
    // `/curso-power-bi` ya no se anuncia: WS3 lo redirige 301 a /cursos/power-bi.
    // Se deja fuera también por `esRutaNoindexGlobal`, pero no se lista dos veces.
    entrada("/curso-power-bi-vs-pack-adopcion", 0.8, "monthly"),
    // WS3 aún evalúa si estas landings son 301. Si lo son, se agregan a
    // RUTAS_NOINDEX_GLOBAL y desaparecen solas del sitemap y del hreflang.
    entrada("/curso-sql-online", 0.85, "weekly"),
    entrada("/curso-python", 0.85, "weekly"),
    entrada("/power-bi-mineria-chile", 0.8, "monthly"),
    entrada("/cursos", 0.85, "weekly"),
    entrada("/precios", 0.85, "monthly"),
    entrada("/verificar-certificado", 0.5, "monthly"),
    // La raíz del test de nivel SÍ es indexable; las variantes país no (WS6)
    // y se filtran más abajo por `esRutaIndexablePais`.
    entrada("/test-nivel", 0.75, "monthly"),
    entrada("/test-nivel/sql", 0.7, "monthly"),
    entrada("/test-nivel/excel", 0.7, "monthly"),
    entrada("/nosotros", 0.5, "monthly"),
    // Fase 5: landings de nicho (SSR, contenido propio).
    entrada("/power-bi-para-finanzas", 0.8, "monthly"),
    entrada("/power-bi-sql-server-python", 0.8, "monthly"),
    entrada("/analisis-de-datos-mineria", 0.8, "monthly"),
    entrada("/capacitacion-empresas", 0.8, "monthly"),
    // /casos solo cuando hay testimonios publicables; /profesores es indexable
    // por decisión de WS1 (lista en lib/seo/indexabilidad.ts).
    ...(TESTIMONIOS_PUBLICADOS ? [entrada("/casos", 0.5, "monthly")] : []),
    ...(LISTADO_PROFESORES_INDEXABLE ? [entrada("/profesores", 0.6, "monthly")] : []),
    ...PROFESORES_INDEXABLES.map((path) => entrada(path, 0.5, "monthly")),
    entrada("/referidos", 0.7, "weekly"),
    entrada("/referidos/terminos", 0.2, "yearly"),
    entrada("/faq", 0.5, "monthly"),
    entrada("/glosario", 0.45, "weekly"),
    entrada("/blog", 0.25, "weekly"),
    entrada("/empleos", 0.5, "weekly"),
    entrada("/empleos/vacantes", 0.45, "daily"),
    entrada("/empleos/para-empresas", 0.4, "monthly"),
    entrada("/empleos/talento", 0.4, "daily"),
    entrada("/versus", 0.4, "monthly"),
    entrada("/newsletter", 0.3, "weekly"),
    entrada("/privacidad", 0.1, "yearly"),
    entrada("/terminos", 0.1, "yearly"),
  ];

  const coursePriority = (slug: string) =>
    PRIMARY_COURSE_SLUGS.has(slug) ? 0.85 : 0.55;

  const coursePages: EntradaPosible[] = courses.map((course) =>
    entrada(`/cursos/${course.slug}`, coursePriority(course.slug), "weekly")
  );

  // Casos de uso: páginas reales, con canonical propio y sin noindex.
  const casePages: EntradaPosible[] = casesOfUse.map((caso) =>
    entrada(`/casos/${caso.slug}`, 0.45, "monthly")
  );

  const comparativasLastModified = COMPARATIVAS_ACTUALIZADO;

  const versusPages: EntradaPosible[] = [
    ...comparisons.map((comp) =>
      entrada(`/versus/${comp.slug}`, 0.4, "monthly", comparativasLastModified)
    ),
    ...RUTAS_COMPARATIVAS_ACADEMIA.map((path) =>
      entrada(path, 0.5, "monthly", comparativasLastModified)
    ),
  ];

  const blogPages = await publishedBlogUrls();

  /**
   * Rutas con versión por país. Se mantienen TODAS aquí (incluidas las que hoy
   * son noindex/301) y el filtro real lo aplica `esRutaIndexablePais`: una
   * sola fuente, sin listas duplicadas. Así WS6 (`/test-nivel` país), WS3
   * (`curso-power-bi` país) y WS9 (variantes thin) se resuelven en el helper.
   */
  const localizedPaths: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly";
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/empresas", priority: 0.95, changeFrequency: "weekly" },
    { path: "/implementacion-power-bi", priority: 0.9, changeFrequency: "monthly" },
    { path: "/migrar-excel-a-power-bi", priority: 0.9, changeFrequency: "monthly" },
    { path: "/por-que-fallan-proyectos-power-bi", priority: 0.8, changeFrequency: "monthly" },
    { path: "/curso-power-bi", priority: 0.85, changeFrequency: "monthly" },
    { path: "/curso-power-bi-vs-pack-adopcion", priority: 0.8, changeFrequency: "monthly" },
    { path: "/curso-sql-online", priority: 0.85, changeFrequency: "weekly" },
    { path: "/curso-python", priority: 0.85, changeFrequency: "weekly" },
    { path: "/cursos", priority: 0.85, changeFrequency: "weekly" },
    { path: "/precios", priority: 0.85, changeFrequency: "monthly" },
    { path: "/test-nivel", priority: 0.75, changeFrequency: "monthly" },
    { path: "/test-nivel/sql", priority: 0.7, changeFrequency: "monthly" },
    { path: "/test-nivel/excel", priority: 0.7, changeFrequency: "monthly" },
    { path: "/nosotros", priority: 0.5, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
    ...courses.map((course) => ({
      path: `/cursos/${course.slug}`,
      priority: coursePriority(course.slug),
      changeFrequency: "weekly" as const,
    })),
  ];

  // Chile (raíz) ya está en staticPages. Aquí solo las carpetas indexables.
  const countryPages: EntradaPosible[] = PAISES_CARPETA.filter(
    (pais) => pais.indexable
  ).flatMap((pais) =>
    localizedPaths
      // Filtro por helper: país no indexable, ruta noindex en ese país o
      // redirección global. Nunca una lista hardcodeada paralela.
      .filter((item) => esRutaIndexablePais(pais.iso, item.path))
      .map((item) =>
        entrada(
          rutaLocal(pais.iso, item.path),
          prioridadPais(item.priority, pais.iso),
          item.changeFrequency
        )
      )
  );

  // Comparativa de Coderhouse en los países donde opera y tiene versión propia.
  const comparativaPaisPages: EntradaPosible[] = RUTAS_CODERHOUSE_PAIS.flatMap(
    (path) => {
      const iso = path.split("/").filter(Boolean)[0] ?? "";
      if (!esIsoPais(iso) || !esRutaIndexablePais(iso, path)) return [];
      return [entrada(path, 0.5, "monthly", comparativasLastModified)];
    }
  );

  // Listicle de Power BI en Chile: página propia, hermana de la ruta [slug].
  const listiclePages: EntradaPosible[] = [
    entrada(RUTA_LISTICLE, 0.7, "monthly", comparativasLastModified),
  ];

  // Guías: las transversales, la chilena y las de país indexable. Una guía de
  // país que WS9 pase a noindex se filtra aquí y sale del sitemap sola.
  const guidePages: EntradaPosible[] = GUIAS.flatMap((guia) => {
    if (guia.country !== "transversal") {
      if (!esIndexable(guia.country)) return [];
      if (esRutaNoindexPais(guia.country, guia.path)) return [];
    }
    return [
      entrada(
        guia.path,
        guia.country === "cl" || guia.country === "transversal" ? 0.7 : 0.6,
        "monthly",
        guia.updated
      ),
    ];
  });

  const guideIndexPages: EntradaPosible[] = [
    entrada("/guias", 0.7, "weekly"),
    ...PAISES_CARPETA.filter(
      (pais) =>
        pais.indexable &&
        guiasDePais(pais.iso).length > 0 &&
        esRutaIndexablePais(pais.iso, "/guias")
    ).map((pais) => entrada(`/${pais.iso}/guias`, 0.6, "weekly")),
    entrada("/preguntas-frecuentes", 0.6, "monthly"),
    // Preguntas frecuentes por país (mismo contenido, precio y hora local).
    ...PAISES_CARPETA.filter((pais) =>
      esRutaIndexablePais(pais.iso, "/preguntas-frecuentes")
    ).map((pais) => entrada(`/${pais.iso}/preguntas-frecuentes`, 0.55, "monthly")),
  ];

  return uniqueEntries([
    ...staticPages,
    ...coursePages,
    ...casePages,
    ...versusPages,
    ...blogPages,
    ...countryPages,
    ...comparativaPaisPages,
    ...listiclePages,
    ...guidePages,
    ...guideIndexPages,
  ]);
}
