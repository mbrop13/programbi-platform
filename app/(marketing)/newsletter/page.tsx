import type { Metadata } from "next";
import { getPublishedArticles, getNewsletterCategories } from "@/lib/supabase/comunidad-ai";
import NewsletterClient from "./NewsletterClient";
import { absoluteUrl, DEFAULT_OG_IMAGE, twitterShare } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Artículos, tutoriales y tendencias sobre análisis de datos, Power BI, SQL, Python e Inteligencia Artificial para profesionales.",
  alternates: { canonical: "/newsletter" },
  openGraph: {
    title: "Newsletter",
    description:
      "Artículos, tutoriales y tendencias sobre análisis de datos, Power BI, SQL, Python e Inteligencia Artificial para profesionales.",
    url: absoluteUrl("/newsletter"),
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: twitterShare(
    "Newsletter",
    "Artículos, tutoriales y tendencias sobre análisis de datos, Power BI, SQL, Python e Inteligencia Artificial para profesionales."
  ),
};

export default async function NewsletterPage() {
  const articles = await getPublishedArticles();
  const categories = await getNewsletterCategories();

  return <NewsletterClient initialArticles={articles} initialCategories={categories} />;
}
