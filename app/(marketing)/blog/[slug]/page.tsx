import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getPublishedArticles } from "@/lib/supabase/comunidad-ai";
import BlogArticleClient from "./BlogArticleClient";
import { isVideoUrl, getOptimizedShareImage } from "@/lib/utils";
import { ogImageUrl } from "@/lib/og/url";

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

interface PageProps {
  params: Params;
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

function getArticlePoster(article: any): string {
  if (!article) return "/default-og.png";
  
  // 1. Try to find poster/thumbnail/cover_poster in the content markdown first
  if (article.content) {
    const match = article.content.match(/^(?:#\s*)?(?:poster|thumbnail|thumbnail_url|cover_poster|imagen_compartido|imagen|image)\s*:\s*(https?:\/\/[^\s\n]+)/im);
    if (match) {
      return match[1].trim();
    }
  }

  // 2. If no poster, check if cover image is not a video
  if (article.cover_image && !isVideoUrl(article.cover_image)) {
    return article.cover_image;
  }

  // 3. Fallback: tarjeta OG de marca con el título del artículo
  return ogImageUrl({
    kicker: "Blog",
    title: article.title,
    description: article.excerpt || undefined,
    path: `blog/${article.slug}`,
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artículo no encontrado" };

  const rawShareImage = getArticlePoster(article);
  const shareImage = getOptimizedShareImage(rawShareImage);

  return {
    title: article.title,
    description: article.excerpt || article.title,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: `${article.title} | ProgramBI`,
      description: article.excerpt || article.title,
      url: `https://www.programbi.com/blog/${slug}`,
      type: "article",
      publishedTime: article.published_at,
      authors: [article.author_name || "ProgramBI"],
      images: [{ url: shareImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || article.title,
      images: [shareImage],
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

  const rawShareImage = getArticlePoster(article);
  const shareImage = getOptimizedShareImage(rawShareImage);

  // JSON-LD for BlogPosting
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    url: `https://www.programbi.com/blog/${slug}`,
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      "@type": "Person",
      name: article.author_name || "Manuel Oliva",
      url: "https://www.programbi.com",
    },
    publisher: { "@id": "https://www.programbi.com/#organization" },
    mainEntityOfPage: `https://www.programbi.com/blog/${slug}`,
    image: shareImage,
    inLanguage: "es",
    keywords: article.tags?.join(", "),
    wordCount: article.reading_time_min ? article.reading_time_min * 200 : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.programbi.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.programbi.com/blog" },
      { "@type": "ListItem", position: 3, name: article.title, item: `https://www.programbi.com/blog/${slug}` },
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
