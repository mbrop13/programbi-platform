import type { Metadata } from "next";
import EmpresasClient from "./EmpresasClient";
import { ogImageUrl } from "@/lib/og/url";
import { SITE_URL, absoluteUrl, jsonLdString } from "@/lib/seo";
import { PAGE_SEO } from "@/lib/seo/money";

export const metadata: Metadata = {
  title: { absolute: PAGE_SEO.empresas.title },
  description: PAGE_SEO.empresas.description,
  alternates: {
    canonical: "/empresas",
  },
  openGraph: {
    title: PAGE_SEO.empresas.title,
    description: PAGE_SEO.empresas.description,
    url: absoluteUrl("/empresas"),
    type: "website",
    images: [
      {
        url: ogImageUrl({
          kicker: "Para empresas",
          title: "Tres formas de trabajar. Un mismo objetivo: autonomía con datos.",
          description:
            "Capacitación corporativa, implementación de soluciones y sistemas a la medida.",
          tags: ["Capacitación", "Dashboards", "Sistemas a medida"],
          path: "empresas",
        }),
        width: 1200,
        height: 630,
        alt: "Soluciones de datos para empresas — ProgramBI",
      },
    ],
  },
};

export default function EmpresasPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Consultoría de Business Intelligence, Automatización y Capacitación Corporativa",
    provider: {
      "@type": "Organization",
      name: "ProgramBI SPA",
      url: SITE_URL,
      "@id": `${SITE_URL}/#organization`,
    },
    serviceType: "Data Analytics, Business Intelligence, Automation & Corporate Training",
    areaServed: [
      { "@type": "Country", name: "Chile" },
      { "@type": "Country", name: "Colombia" },
      { "@type": "Country", name: "México" },
      { "@type": "Country", name: "Perú" },
    ],
    description:
      "Desarrollo de dashboards en Power BI, integración de bases de datos en SQL Server, automatización de procesos con Python y Power Automate, modelos predictivos de Machine Learning y capacitación corporativa para equipos.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(serviceJsonLd) }}
      />
      <EmpresasClient />
    </>
  );
}
