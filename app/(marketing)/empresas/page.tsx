import type { Metadata } from "next";
import EmpresasClient from "./EmpresasClient";
import { ogImageUrl } from "@/lib/og/url";

export const metadata: Metadata = {
  title: "Soluciones de Datos para Empresas | Capacitación, Sistemas a Medida y Consultoría",
  description:
    "Capacitación corporativa, consultoría de Business Intelligence y desarrollo de sistemas a la medida: paneles de gestión, automatización de procesos, inventario y flujos internos. Dashboards en Power BI, Python, SQL Server. Clientes como CAP y AngloAmerican.",
  alternates: {
    canonical: "/empresas",
  },
  openGraph: {
    title: "Soluciones de Datos para Empresas | ProgramBI",
    description:
      "Transformamos tu operación con dashboards, automatización, sistemas de gestión a la medida y capacitación en datos, IA y Machine Learning.",
    url: "https://programbi.com/empresas",
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
      url: "https://programbi.com",
      "@id": "https://programbi.com/#organization",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <EmpresasClient />
    </>
  );
}
