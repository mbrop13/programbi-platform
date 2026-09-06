import type { Metadata } from "next";
import SeoGuide from "@/components/marketing/SeoGuide";
import { SITE_URL, absoluteUrl, jsonLdString } from "@/lib/seo";
import { GUIDE_SEO } from "@/lib/seo/money";
import { PACK } from "@/lib/data/pack-adopcion";

const copy = GUIDE_SEO["curso-power-bi-vs-pack-adopcion"];

export const metadata: Metadata = {
  title: { absolute: copy.title },
  description: copy.description,
  alternates: { canonical: copy.path },
  openGraph: {
    title: copy.title,
    description: copy.description,
    url: absoluteUrl(copy.path),
    type: "article",
  },
};

const faqs = [
  {
    q: "¿El curso Power BI incluye el dashboard de mi empresa?",
    a: "No. El curso es formación individual en vivo. El tablero con tus datos y la autonomía del equipo son el Pack Adopción.",
  },
  {
    q: "¿Puedo mandar al equipo al curso en vez del Pack?",
    a: "Puedes. Muchos vuelven a Excel porque el tablero no es el de ellos. El Pack construye 1–3 dashboards del área y practica sobre ese modelo 4–6 semanas.",
  },
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: copy.h1,
        description: copy.description,
        url: absoluteUrl(copy.path),
        inLanguage: "es-CL",
        author: { "@type": "Organization", name: "ProgramBI", url: SITE_URL },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Empresas", item: absoluteUrl("/empresas") },
          { "@type": "ListItem", position: 3, name: copy.h1, item: absoluteUrl(copy.path) },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <SeoGuide
        kicker="Curso vs Pack · Chile"
        h1={copy.h1}
        lead="Si buscas “curso Power BI Chile”, hay una ficha para eso. Si eres Controller y el área vive en Excel, el producto correcto es el Pack Adopción — tablero en producción, no una clase."
        pagePath={copy.path}
        crumbs={[
          { href: "/", label: "Inicio" },
          { href: "/cursos/power-bi", label: "Curso Power BI" },
          { href: copy.path, label: "vs Pack Adopción" },
        ]}
        sections={[
          {
            h2: "Curso Power BI (particulares)",
            paragraphs: [
              "Formación en vivo por Zoom: Power Query, modelo, DAX y publicación. Niveles de 16 horas. Sirve si tú quieres la herramienta. Cupos abiertos; consulta fecha. Certificado al completar.",
              "No incluye construir el reporte de tu empresa ni capacitar al equipo sobre ese reporte.",
            ],
          },
          {
            h2: "Pack Adopción BI (empresas)",
            paragraphs: [
              `${PACK.headline} Construimos ${PACK.dashboards} dashboards con los datos del área, capacitamos ${PACK.trainingWeeks} semanas y nos quedamos ${PACK.postGoLiveWeeks} semanas post go-live. Inversión referencial ${PACK.priceLabel} (${PACK.priceFromLabel}). Factura directa, sin SENCE por ahora.`,
              "Diagnóstico 30 minutos. Propuesta en menos de 24 h. WhatsApp +56 9 3540 9699.",
            ],
          },
          {
            h2: "Cómo elegir en 20 segundos",
            paragraphs: [
              "Eres tú y quieres aprender Power BI → curso. Eres el área (control de gestión, finanzas, ops, minería) y necesitas dejar de pegar Excel → Pack. Los dos existen en este sitio a propósito; no mezclamos la ficha.",
            ],
          },
        ]}
        faqs={faqs}
        related={[
          { href: "/empresas", label: "Pack Adopción para empresas" },
          { href: "/cursos/power-bi", label: "Curso Power BI en vivo Chile" },
          { href: "/cursos/analisis-de-datos", label: "Cursos de análisis de datos (SQL + Power BI + Python)" },
          { href: "/por-que-fallan-proyectos-power-bi", label: "Por qué fallan los proyectos Power BI" },
        ]}
      />
    </>
  );
}
