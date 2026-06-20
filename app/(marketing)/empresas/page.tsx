import type { Metadata } from "next";
import EmpresasClient from "./EmpresasClient";

export const metadata: Metadata = {
  title: "Soluciones de Datos para Empresas | Capacitación y Consultoría | ProgramBI",
  description:
    "Capacitación corporativa y consultoría de Business Intelligence para empresas en Chile y Latinoamérica. Dashboards en Power BI, automatización con Python, SQL Server y Machine Learning. Clientes como CAP y AngloAmerican.",
  alternates: {
    canonical: "/empresas",
  },
  openGraph: {
    title: "Soluciones de Datos para Empresas | Capacitación y Consultoría | ProgramBI",
    description:
      "Transformamos la operación de tu empresa con dashboards, automatización y ciencia de datos. Capacitamos a tus equipos con más de 9 programas en Power BI, SQL, Python, IA y Machine Learning.",
    url: "https://programbi.com/empresas",
    type: "website",
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
