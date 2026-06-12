import type { Metadata } from "next";
import AsesoriasClient from "./AsesoriasClient";

export const metadata: Metadata = {
  title: "Asesorías Corporativas y Consultoría de Datos | ProgramBI",
  description:
    "Servicios de consultoría a medida en Power BI, SQL, Python y automatización de procesos. Soluciones avanzadas de Business Intelligence y automatizaciones para empresas en Chile y Latinoamérica.",
  alternates: {
    canonical: "/asesorias",
  },
  openGraph: {
    title: "Asesorías Corporativas y Consultoría de Datos | ProgramBI",
    description:
      "Desarrollo de dashboards interactivos, procesos ETL y automatizaciones con Python para optimizar el rendimiento y la toma de decisiones en tu empresa.",
    url: "https://programbi.com/asesorias",
    type: "website",
  },
};

export default function AsesoriasPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Consultoría de Business Intelligence y Automatización de Procesos",
    provider: {
      "@type": "Organization",
      name: "ProgramBI SPA",
      url: "https://programbi.com",
      "@id": "https://programbi.com/#organization",
    },
    serviceType: "Data Analytics, Business Intelligence & Automation Consulting",
    areaServed: [
      { "@type": "Country", name: "Chile" },
      { "@type": "Country", name: "Colombia" },
      { "@type": "Country", name: "México" },
      { "@type": "Country", name: "Perú" },
    ],
    description:
      "Desarrollo de tableros de control en Power BI, integración de bases de datos relacionales en SQL Server, scripts de automatización con Python y modelamiento de analítica predictiva.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <AsesoriasClient />
    </>
  );
}
