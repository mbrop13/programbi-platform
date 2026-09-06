import type { MetadataRoute } from "next";
import { courses } from "@/lib/data/courses";
import { casesOfUse } from "@/lib/data/cases";
import { comparisons } from "@/lib/data/comparisons";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${baseUrl}/empresas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/implementacion-power-bi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/migrar-excel-a-power-bi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cursos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/glosario`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.45,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/empleos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/empleos/vacantes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.45,
    },
    {
      url: `${baseUrl}/empleos/para-empresas`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/empleos/talento`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/versus`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/gran-partido`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.1,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];

  const coursePriority = (slug: string) =>
    slug === "power-bi" || slug === "analisis-de-datos" ? 0.85 : 0.7;

  const coursePages: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${baseUrl}/cursos/${course.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: coursePriority(course.slug),
  }));

  const casePages: MetadataRoute.Sitemap = casesOfUse.map((c) => ({
    url: `${baseUrl}/casos/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.45,
  }));

  const versusPages: MetadataRoute.Sitemap = comparisons.map((comp) => ({
    url: `${baseUrl}/versus/${comp.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...staticPages, ...coursePages, ...casePages, ...versusPages];
}
