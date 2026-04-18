import type { Metadata } from "next";
import NewsletterClient from "./NewsletterClient";

export const metadata: Metadata = {
  title: "Newsletter — ProgramBI",
  description: "Artículos, tutoriales y tendencias sobre análisis de datos, Power BI, SQL, Python e Inteligencia Artificial para profesionales.",
};

export default function NewsletterPage() {
  return <NewsletterClient />;
}
