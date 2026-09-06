import type { Metadata } from "next";
import { courses } from "@/lib/data/courses";
import CursosPageClient from "./CursosPageClient";
import { ogImageUrl } from "@/lib/og/url";

export const metadata: Metadata = {
  title: { absolute: "Cursos Power BI, SQL y Python en vivo Chile | ProgramBI" },
  description:
    "Cursos abiertos en vivo: Power BI, SQL y Python. Formación individual, distinta al Pack Adopción para empresas. Cupos abiertos — consulta fecha.",
  alternates: {
    canonical: "/cursos",
  },
  openGraph: {
    title: "Cursos Power BI, SQL y Python en vivo Chile | ProgramBI",
    description:
      "Cursos abiertos en vivo de Power BI, SQL y Python en Chile. Si eres empresa, el Pack Adopción es otra oferta.",
    url: "https://www.programbi.com/cursos",
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
      url: `https://www.programbi.com/cursos/${course.slug}`,
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
