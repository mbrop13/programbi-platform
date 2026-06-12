import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getPublishedArticles } from "@/lib/supabase/comunidad-ai";
import BlogArticleClient from "./BlogArticleClient";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

interface PageProps {
  params: Params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artículo no encontrado" };

  return {
    title: article.title,
    description: article.excerpt || article.title,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: `${article.title} | ProgramBI`,
      description: article.excerpt || article.title,
      url: `https://programbi.com/blog/${slug}`,
      type: "article",
      publishedTime: article.published_at,
      authors: [article.author_name || "ProgramBI"],
      images: article.cover_image ? [{ url: article.cover_image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || article.title,
      images: article.cover_image ? [article.cover_image] : [],
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  // Fetch related articles (limit to 3, excluding current)
  const allArticles = await getPublishedArticles(article.category);
  const related = allArticles.filter((a: any) => a.slug !== slug).slice(0, 3);

  // JSON-LD for BlogPosting
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    url: `https://programbi.com/blog/${slug}`,
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      "@type": "Person",
      name: article.author_name || "Manuel Oliva",
      url: "https://programbi.com",
    },
    publisher: { "@id": "https://programbi.com/#organization" },
    mainEntityOfPage: `https://programbi.com/blog/${slug}`,
    image: article.cover_image || undefined,
    inLanguage: "es",
    keywords: article.tags?.join(", "),
    wordCount: article.reading_time_min ? article.reading_time_min * 200 : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://programbi.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://programbi.com/blog" },
      { "@type": "ListItem", position: 3, name: article.title, item: `https://programbi.com/blog/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <BlogArticleClient article={article} related={related} />
    </>
  );
}
