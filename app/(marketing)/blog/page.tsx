import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/supabase/comunidad-ai";
import BlogClient from "./BlogClient";
import { ogImageUrl } from "@/lib/og/url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — Recursos y Artículos de Análisis de Datos | ProgramBI",
  description:
    "Artículos, tutoriales y guías prácticas sobre Power BI, SQL, Python, Machine Learning y análisis de datos. Contenido técnico y actualizado por expertos de ProgramBI.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Recursos de Análisis de Datos | ProgramBI",
    description:
      "Artículos, tutoriales y guías prácticas sobre Power BI, SQL, Python y análisis de datos por expertos de ProgramBI.",
    url: "https://www.programbi.com/blog",
    type: "website",
    images: [
      {
        url: ogImageUrl({
          kicker: "Blog",
          title: "Recursos y artículos de análisis de datos",
          description:
            "Tutoriales y guías prácticas sobre Power BI, SQL y Python, escritos por expertos de la industria.",
          tags: ["Power BI", "SQL", "Python"],
          path: "blog",
        }),
        width: 1200,
        height: 630,
        alt: "Blog de ProgramBI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Recursos de Análisis de Datos | ProgramBI",
    description:
      "Artículos, tutoriales y guías prácticas sobre Power BI, SQL, Python y análisis de datos.",
  },
};

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog ProgramBI",
    description:
      "Artículos y tutoriales de análisis de datos, Power BI, SQL y Python",
    url: "https://www.programbi.com/blog",
    inLanguage: "es",
    publisher: {
      "@type": "Organization",
      name: "ProgramBI",
      url: "https://www.programbi.com",
      "@id": "https://www.programbi.com/#organization",
    },
    blogPost: articles.map((a: any) => ({
      "@type": "BlogPosting",
      headline: a.title,
      description: a.excerpt,
      url: `https://www.programbi.com/blog/${a.slug}`,
      datePublished: a.published_at,
      image: a.cover_image || undefined,
      author: {
        "@type": "Person",
        name: a.author_name || "ProgramBI",
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://www.programbi.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.programbi.com/blog",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogClient articles={articles} />
    </>
  );
}
