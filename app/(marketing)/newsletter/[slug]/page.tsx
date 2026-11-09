import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticuloPorSlug, getPublishedArticles } from "@/lib/blog/data";
import ContenidoNoDisponible from "@/components/blog/ContenidoNoDisponible";
import { getOptimizedShareImage } from "@/lib/utils";
import { ogImageUrl } from "@/lib/og/url";
import { tituloSeo } from "@/lib/seo";
import ArticleClient from "./ArticleClient";

export const revalidate = 3600; // Cache on CDN for 1 hour

type Params = Promise<{ slug: string }>;

interface PageProps {
  params: Params;
}

type ArticlePoster = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image?: string | null;
};

function getArticlePoster(article: ArticlePoster | null): string {
  if (!article) return "/default-og.png";
  
  if (article.content) {
    const match = article.content.match(/^(?:#\s*)?(?:poster|thumbnail|thumbnail_url|cover_poster|imagen_compartido|imagen|image)\s*:\s*(https?:\/\/[^\s\n]+)/im);
    if (match) {
      return match[1].trim();
    }
  }

  if (article.cover_image) {
    return article.cover_image;
  }

  return ogImageUrl({
    kicker: "Newsletter",
    title: article.title,
    description: article.excerpt || undefined,
    path: `newsletter/${article.slug}`,
  });
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resultado = await getArticuloPorSlug(slug);

  if (resultado.estado === "no_disponible") {
    // Supabase no respondió: no indexar el estado de respaldo.
    return {
      title: "Artículo no disponible",
      robots: { index: false, follow: false },
    };
  }

  if (resultado.estado === "no_encontrado") {
    return { title: "Artículo no encontrado" };
  }

  const article = resultado.articulo;

  const rawShareImage = getArticlePoster(article);
  const shareImage = getOptimizedShareImage(rawShareImage);

  return {
    title: { absolute: tituloSeo(`${article.title} — Newsletter`) },
    description: article.excerpt || article.title,
    alternates: { canonical: `/newsletter/${slug}` },
    openGraph: {
      title: `${article.title} | ProgramBI`,
      description: article.excerpt || article.title,
      url: `https://www.programbi.com/newsletter/${slug}`,
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

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const resultado = await getArticuloPorSlug(slug);

  // Slug inexistente o no publicado: 404 limpio (nunca 500).
  if (resultado.estado === "no_encontrado") notFound();

  // Supabase caído o lento: 200 con estado de respaldo, sin stacktrace.
  if (resultado.estado === "no_disponible") {
    return <ContenidoNoDisponible seccion="newsletter" />;
  }

  const article = resultado.articulo;

  // Fetch related articles (limit to 3, excluding current)
  const allArticles = await getPublishedArticles(article.category ?? undefined);
  const related = allArticles.filter((a) => a.slug !== slug).slice(0, 3);

  return <ArticleClient slug={slug} initialArticle={article} initialRelated={related} />;
}
