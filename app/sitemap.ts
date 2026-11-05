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
import { SITE_ACTUALIZADO, lastmodDe } from "@/lib/seo/lastmod";
import { PAISES_CARPETA, esIndexable } from "@/config/paises";
import { GUIAS } from "@/lib/guias/generado";
import { guiasDePais } from "@/lib/guias";
import { rutaLocal } from "@/lib/paises/rutas";
import { isVanityBlogPost } from "@/lib/seo/money";
import { createAdminClient } from "@/lib/supabase/server";

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

type EntradaSitemap = MetadataRoute.Sitemap[number];
type CambioFrecuencia = NonNullable<EntradaSitemap["changeFrequency"]>;

function loc(path: string): string {
  const url = sitemapLoc(path);
  if (!url) throw new Error(`sitemap: rejected loc ${path}`);
  return url;
}

function uniqueEntries(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];
  for (const entry of entries) {
    const url = sitemapLoc(entry.url);
    if (!url || seen.has(url)) continue;
    if (url !== SITE_URL && !url.startsWith(`${SITE_URL}/`)) continue;
    // Las imágenes generadas por ruta (/opengraph-image, /twitter-image) no son
    // páginas: fuera del sitemap aunque alguna lista las arrastre.
    if (/\/(opengraph-image|twitter-image)(\/|$)/.test(new URL(url).pathname)) continue;
    seen.add(url);
    out.push({ ...entry, url });
  }
  return out;
}

/**
 * Entrada del sitemap con la fecha real de su archivo. `lastmodDe` resuelve
 * también las rutas con prefijo de país; nunca devuelve la fecha del request.
 */
function entrada(
  path: string,
  priority: number,
  changeFrequency: CambioFrecuencia
): EntradaSitemap {
  return {
    url: loc(path),
    lastModified: lastmodDe(path),
    changeFrequency,
    priority,
  };
}

function blogSlug(raw: string): string | null {
  const slug = raw.trim().split("?")[0].split("#")[0].replace(/^\/+|\/+$/g, "");
  if (!slug || slug.includes("/") || slug.includes("://") || slug.includes("&")) return null;
  return slug;
}

async function publishedBlogUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("newsletter_articles")
      .select("slug, title, excerpt")
      .eq("status", "published");
    if (error || !data) return [];
    return data.flatMap((row) => {
      const slug = typeof row.slug === "string" ? blogSlug(row.slug) : null;
      if (!slug) return [];
      if (isVanityBlogPost(row.title, row.excerpt, slug)) return [];
      return [
        {
          url: loc(`/blog/${slug}`),
          // La tabla no expone fecha de publicación en esta consulta: se usa
          // una fecha estable, no la del render.
          lastModified: SITE_ACTUALIZADO,
          changeFrequency: "weekly" as const,
          priority: 0.4,
        },
      ];
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

/**
 * Sitemap completo del sitio. Las landings nuevas de la fase 5 no se declaran
 * aquí hasta que exista su ruta (un 404 en el sitemap es peor que una URL
 * ausente); las suma el frente que las publica.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    entrada("/", 1, "weekly"),
    entrada("/empresas", 0.95, "weekly"),
    entrada("/implementacion-power-bi", 0.9, "monthly"),
    entrada("/migrar-excel-a-power-bi", 0.9, "monthly"),
    entrada("/por-que-fallan-proyectos-power-bi", 0.8, "monthly"),
    entrada("/curso-power-bi", 0.85, "monthly"),
    entrada("/curso-power-bi-vs-pack-adopcion", 0.8, "monthly"),
    entrada("/curso-sql-online", 0.85, "weekly"),
    entrada("/curso-python", 0.85, "weekly"),
    entrada("/power-bi-mineria-chile", 0.8, "monthly"),
    entrada("/cursos", 0.85, "weekly"),
    entrada("/precios", 0.85, "monthly"),
    entrada("/verificar-certificado", 0.5, "monthly"),
    entrada("/test-nivel", 0.75, "monthly"),
    entrada("/test-nivel/sql", 0.7, "monthly"),
    entrada("/test-nivel/excel", 0.7, "monthly"),
    entrada("/nosotros", 0.5, "monthly"),
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

  const coursePages: MetadataRoute.Sitemap = courses.map((course) =>
    entrada(`/cursos/${course.slug}`, coursePriority(course.slug), "weekly")
  );

  // Casos de uso: páginas reales, con canonical propio y sin noindex.
  const casePages: MetadataRoute.Sitemap = casesOfUse.map((caso) =>
    entrada(`/casos/${caso.slug}`, 0.45, "monthly")
  );

  const comparativasLastModified = COMPARATIVAS_ACTUALIZADO;

  const versusPages: MetadataRoute.Sitemap = [
    ...comparisons.map((comp) => ({
      url: loc(`/versus/${comp.slug}`),
      lastModified: comparativasLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...RUTAS_COMPARATIVAS_ACADEMIA.map((path) => ({
      url: loc(path),
      lastModified: comparativasLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const blogPages = await publishedBlogUrls();

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

  // Chile (raíz) ya está en staticPages. Aquí solo se agregan las carpetas
  // indexables: Argentina, México, Perú, Colombia, Uruguay y los países con
  // precio propio. uniqueEntries() descarta cualquier URL repetida.
  const countryPages: MetadataRoute.Sitemap = PAISES_CARPETA.filter((pais) => pais.indexable).flatMap(
    (pais) =>
      localizedPaths.map((item) =>
        entrada(
          rutaLocal(pais.iso, item.path),
          prioridadPais(item.priority, pais.iso),
          item.changeFrequency
        )
      )
  );

  // Comparativa de Coderhouse en los países donde opera y tiene versión propia.
  const comparativaPaisPages: MetadataRoute.Sitemap = RUTAS_CODERHOUSE_PAIS.map((path) => ({
    url: loc(path),
    lastModified: comparativasLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Listicle de Power BI en Chile: página propia, hermana de la ruta [slug].
  const listiclePages: MetadataRoute.Sitemap = [
    {
      url: loc(RUTA_LISTICLE),
      lastModified: comparativasLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // Guías: las de país indexable, las transversales y la chilena. Paraguay
  // queda fuera porque su versión es noindex hasta que tenga precio publicado.
  const guidePages: MetadataRoute.Sitemap = GUIAS.filter(
    (guia) => guia.country === "transversal" || esIndexable(guia.country)
  ).map((guia) => ({
    url: loc(guia.path),
    lastModified: guia.updated,
    changeFrequency: "monthly" as const,
    priority: guia.country === "cl" || guia.country === "transversal" ? 0.7 : 0.6,
  }));

  const guideIndexPages: MetadataRoute.Sitemap = [
    entrada("/guias", 0.7, "weekly"),
    ...PAISES_CARPETA.filter((pais) => pais.indexable && guiasDePais(pais.iso).length > 0).map(
      (pais) => entrada(`/${pais.iso}/guias`, 0.6, "weekly")
    ),
    entrada("/preguntas-frecuentes", 0.6, "monthly"),
    // Preguntas frecuentes por país (mismo contenido, precio y hora local).
    ...PAISES_CARPETA.filter((pais) => pais.indexable).map((pais) =>
      entrada(`/${pais.iso}/preguntas-frecuentes`, 0.55, "monthly")
    ),
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
