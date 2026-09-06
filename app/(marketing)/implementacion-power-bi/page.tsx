import type { Metadata } from "next";
import SeoGuide from "@/components/marketing/SeoGuide";
import { SITE_URL, absoluteUrl, jsonLdString } from "@/lib/seo";

const path = "/implementacion-power-bi";

export const metadata: Metadata = {
  title: { absolute: "Implementación Power BI Chile | ProgramBI" },
  description:
    "Implementación Power BI en Chile para control de gestión: dashboards, capacitación in-company y acompañamiento. Diagnóstico por WhatsApp.",
  alternates: { canonical: path },
  openGraph: {
    title: "Implementación Power BI Chile | ProgramBI",
    description:
      "Dashboards Power BI con los datos de tu área y capacitación del equipo. Chile.",
    url: absoluteUrl(path),
    type: "article",
  },
};

const faqs = [
  {
    q: "¿Hacen implementación Power BI in-company?",
    a: "Sí. Capacitación corporativa e implementación de tableros con los datos del área. Cotiza en /empresas o por WhatsApp.",
  },
  {
    q: "¿Es un curso abierto?",
    a: "No. El curso Power BI abierto es otra ficha. Esto es trabajo con empresas.",
  },
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Implementación Power BI Chile",
        url: absoluteUrl(path),
        provider: { "@type": "Organization", name: "ProgramBI SPA", url: SITE_URL },
        areaServed: { "@type": "Country", name: "Chile" },
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
        kicker="Implementación Power BI · Chile"
        h1="Implementación Power BI en Chile, con el equipo usando el tablero"
        lead="No entregamos un archivo y desaparecemos. Armamos dashboards con tus datos y capacitamos al área para mantenerlos."
        pagePath={path}
        crumbs={[
          { href: "/", label: "Inicio" },
          { href: "/empresas", label: "Empresas" },
          { href: path, label: "Implementación Power BI" },
        ]}
        sections={[
          {
            h2: "Para control de gestión, finanzas y ops",
            paragraphs: [
              "Cierres en Excel, versiones cruzadas y un analista héroe. Power BI sirve cuando el modelo es el de tu área y alguien del equipo lo puede actualizar.",
              "Trabajamos con fuentes reales (Excel, ERP, SQL) y dejamos práctica sobre el reporte vivo.",
            ],
          },
        ]}
        faqs={faqs}
        related={[
          { href: "/empresas", label: "Soluciones para empresas" },
          { href: "/cursos/power-bi", label: "Curso Power BI en vivo" },
          { href: "/migrar-excel-a-power-bi", label: "Migrar Excel a Power BI" },
        ]}
      />
    </>
  );
}
