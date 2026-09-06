import type { Metadata } from "next";
import SeoGuide from "@/components/marketing/SeoGuide";
import { SITE_URL, absoluteUrl, jsonLdString } from "@/lib/seo";

const path = "/migrar-excel-a-power-bi";

export const metadata: Metadata = {
  title: { absolute: "Migrar Excel a Power BI Chile | Control de gestión" },
  description:
    "Migrar Excel a Power BI en Chile: tableros para control de gestión y capacitación del equipo. Cotiza in-company o el curso abierto.",
  alternates: { canonical: path },
  openGraph: {
    title: "Migrar Excel a Power BI Chile | ProgramBI",
    description: "De planillas eternas a dashboards. Capacitación e implementación en Chile.",
    url: absoluteUrl(path),
    type: "article",
  },
};

const faqs = [
  {
    q: "¿Puedo aprender Power BI en un curso y migrar yo?",
    a: "Sí: el curso abierto de Power BI es formación individual. Si el área necesita el tablero con datos propios, eso es un proyecto empresas.",
  },
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Migrar Excel a Power BI en control de gestión",
        url: absoluteUrl(path),
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
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <SeoGuide
        kicker="Excel → Power BI · Chile"
        h1="Migrar Excel a Power BI en control de gestión"
        lead="Pasamos reportes eternos a tableros y formamos al equipo para mantenerlos. Curso abierto o proyecto in-company, según si eres persona o empresa."
        pagePath={path}
        crumbs={[
          { href: "/", label: "Inicio" },
          { href: "/empresas", label: "Empresas" },
          { href: path, label: "Migrar Excel a Power BI" },
        ]}
        sections={[
          {
            h2: "Cuándo un curso alcanza y cuándo no",
            paragraphs: [
              "Si tú quieres DAX y Power Query, el curso Power BI en vivo es el camino.",
              "Si el cierre del área vive en planillas que nadie más entiende, hace falta un tablero con esos datos y práctica del equipo — eso se cotiza en empresas.",
            ],
          },
        ]}
        faqs={faqs}
        related={[
          { href: "/cursos/power-bi", label: "Curso Power BI en vivo Chile" },
          { href: "/empresas", label: "Soluciones para empresas" },
          { href: "/implementacion-power-bi", label: "Implementación Power BI" },
        ]}
      />
    </>
  );
}
