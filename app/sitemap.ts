import type { MetadataRoute } from "next";
import { courses } from "@/lib/data/courses";
import { casesOfUse } from "@/lib/data/cases";
import { comparisons } from "@/lib/data/comparisons";
import { sitemapLoc } from "@/lib/seo";
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
      .select("slug, title, excerpt, published_at")
      .eq("status", "published");
    if (error || !data) return [];
    return data.flatMap((row) => {
      const slug = typeof row.slug === "string" ? blogSlug(row.slug) : null;
      if (!slug) return [];
      if (isVanityBlogPost(row.title, row.excerpt, slug)) return [];
      return [
        {
          url: loc(`/blog/${slug}`),
          lastModified: row.published_at ? new Date(row.published_at) : now,
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
      url: loc("/curso-power-bi-vs-pack-adopcion"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
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
      url: loc("/gran-partido"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.1,
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

  const versusPages: MetadataRoute.Sitemap = comparisons.map((comp) => ({
    url: loc(`/versus/${comp.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  const blogPages = await publishedBlogUrls(now);

  return uniqueEntries([...staticPages, ...coursePages, ...casePages, ...versusPages, ...blogPages]);
}
