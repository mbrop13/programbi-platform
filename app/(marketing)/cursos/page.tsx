import type { Metadata } from "next";
import { courses } from "@/lib/data/courses";
import CursosPageClient from "./CursosPageClient";
import { ogImageUrl } from "@/lib/og/url";

export const metadata: Metadata = {
  title: "Cursos de Análisis de Datos Online — Power BI, SQL, Python | ProgramBI",
  description:
    "Capacitaciones profesionales en Power BI, Python, SQL y Machine Learning. Cursos online en vivo con expertos de la industria. Formación para profesionales y empresas en Chile y Latinoamérica.",
  alternates: {
    canonical: "/cursos",
  },
  openGraph: {
    title: "Cursos de Análisis de Datos Online — Power BI, SQL, Python | ProgramBI",
    description:
      "Capacitaciones profesionales en Power BI, Python, SQL y Machine Learning. Cursos online en vivo con expertos de la industria en Chile y Latinoamérica.",
    url: "https://programbi.com/cursos",
    type: "website",
    images: [
      {
        url: ogImageUrl({
          kicker: "Catálogo de cursos",
          title: "Aprende análisis de datos con expertos de la industria",
          description:
            "Cursos online en vivo: Power BI, SQL Server, Python, Machine Learning y más.",
          tags: ["Power BI", "SQL", "Python", "IA"],
          path: "cursos",
        }),
        width: 1200,
        height: 630,
        alt: "Cursos de análisis de datos de ProgramBI",
      },
    ],
  },
};

export default function CursosPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: courses.length,
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://programbi.com/cursos/${course.slug}`,
      name: course.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <CursosPageClient />
    </>
  );
}
