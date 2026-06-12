import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/supabase/comunidad-ai";
import BlogClient from "./BlogClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Recursos y Artículos de Análisis de Datos | ProgramBI",
  description:
    "Artículos, tutoriales y guías prácticas sobre Power BI, SQL, Python, Machine Learning y análisis de datos. Contenido técnico y actualizado por expertos de ProgramBI.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Recursos de Análisis de Datos | ProgramBI",
    description:
      "Artículos, tutoriales y guías prácticas sobre Power BI, SQL, Python y análisis de datos por expertos de ProgramBI.",
    url: "https://programbi.com/blog",
    type: "website",
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
    url: "https://programbi.com/blog",
    inLanguage: "es",
    publisher: {
      "@type": "Organization",
      name: "ProgramBI",
      url: "https://programbi.com",
      "@id": "https://programbi.com/#organization",
    },
    blogPost: articles.map((a: any) => ({
      "@type": "BlogPosting",
      headline: a.title,
      description: a.excerpt,
      url: `https://programbi.com/blog/${a.slug}`,
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
        item: "https://programbi.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://programbi.com/blog",
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
