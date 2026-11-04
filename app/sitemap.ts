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

async function publishedBlogUrls(now: Date): Promise<MetadataRoute.Sitemap> {
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
          lastModified: now,
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: loc("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: loc("/empresas"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: loc("/implementacion-power-bi"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: loc("/migrar-excel-a-power-bi"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: loc("/por-que-fallan-proyectos-power-bi"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: loc("/curso-power-bi"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: loc("/curso-power-bi-vs-pack-adopcion"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: loc("/curso-sql-online"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: loc("/curso-python"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: loc("/power-bi-mineria-chile"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: loc("/cursos"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: loc("/precios"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: loc("/test-nivel/sql"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: loc("/test-nivel/excel"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: loc("/nosotros"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: loc("/referidos"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: loc("/referidos/terminos"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: loc("/faq"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: loc("/glosario"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.45,
    },
    {
      url: loc("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.25,
    },
    {
      url: loc("/empleos"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: loc("/empleos/vacantes"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.45,
    },
    {
      url: loc("/empleos/para-empresas"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: loc("/empleos/talento"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.4,
    },
    {
      url: loc("/versus"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: loc("/newsletter"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.3,
    },
    {
      url: loc("/privacidad"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.1,
    },
    {
      url: loc("/terminos"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];

  const coursePriority = (slug: string) =>
    PRIMARY_COURSE_SLUGS.has(slug) ? 0.85 : 0.55;

  const coursePages: MetadataRoute.Sitemap = courses.map((course) => ({
    url: loc(`/cursos/${course.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: coursePriority(course.slug),
  }));

  const casePages: MetadataRoute.Sitemap = casesOfUse.map((c) => ({
    url: loc(`/casos/${c.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.45,
  }));

  const comparativasLastModified = new Date(`${COMPARATIVAS_ACTUALIZADO}T12:00:00-03:00`);

  const versusPages: MetadataRoute.Sitemap = [
    ...comparisons.map((comp) => ({
      url: loc(`/versus/${comp.slug}`),
      lastModified: now,
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

  const blogPages = await publishedBlogUrls(now);

  const localizedPaths: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
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
  // indexables: Argentina, México, Perú, Colombia y Uruguay. uniqueEntries()
  // descarta cualquier URL repetida.
  const countryPages: MetadataRoute.Sitemap = PAISES_CARPETA.filter((pais) => pais.indexable).flatMap(
    (pais) =>
      localizedPaths.map((item) => ({
        url: loc(rutaLocal(pais.iso, item.path)),
        lastModified: now,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
      }))
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
    lastModified: new Date(`${guia.updated}T12:00:00-03:00`),
    changeFrequency: "monthly" as const,
    priority: guia.country === "cl" || guia.country === "transversal" ? 0.7 : 0.6,
  }));

  const guideIndexPages: MetadataRoute.Sitemap = [
    { url: loc("/guias"), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    ...PAISES_CARPETA.filter((pais) => pais.indexable && guiasDePais(pais.iso).length > 0).map(
      (pais) => ({
        url: loc(`/${pais.iso}/guias`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    ),
    {
      url: loc("/preguntas-frecuentes"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
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
