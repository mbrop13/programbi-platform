import type { Metadata } from "next";
import { courses } from "@/lib/data/courses";
import CursosPageClient from "./CursosPageClient";
import { ogImageUrl } from "@/lib/og/url";
import { PAGE_SEO } from "@/lib/seo/money";
import { absoluteUrl, jsonLdString } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: PAGE_SEO.cursos.title },
  description: PAGE_SEO.cursos.description,
  alternates: {
    canonical: "/cursos",
  },
  openGraph: {
    title: PAGE_SEO.cursos.title,
    description: PAGE_SEO.cursos.description,
    url: absoluteUrl("/cursos"),
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
      url: absoluteUrl(`/cursos/${course.slug}`),
      name: course.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(itemListJsonLd) }}
      />
      <CursosPageClient />
    </>
  );
}
