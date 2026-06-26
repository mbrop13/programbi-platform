import type { Metadata } from "next";
import { getPublishedArticles, getNewsletterCategories } from "@/lib/supabase/comunidad-ai";
import NewsletterClient from "./NewsletterClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Newsletter — ProgramBI",
  description: "Artículos, tutoriales y tendencias sobre análisis de datos, Power BI, SQL, Python e Inteligencia Artificial para profesionales.",
};

export default async function NewsletterPage() {
  const articles = await getPublishedArticles();
  const categories = await getNewsletterCategories();

  return <NewsletterClient initialArticles={articles} initialCategories={categories} />;
}
