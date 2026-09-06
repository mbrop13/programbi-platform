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
          title: "Formamos a tu equipo en datos.",
          description:
            "Capacitación in-company de Power BI, SQL, Python y automatización. En vivo, con factura.",
          tags: ["Capacitación", "Power BI", "In-company"],
          path: "empresas",
        }),
        width: 1200,
        height: 630,
        alt: "Capacitación de datos para empresas — ProgramBI",
      },
    ],
  },
};

export default function EmpresasPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Capacitación corporativa de datos",
    provider: {
      "@type": "Organization",
      name: "ProgramBI SPA",
      url: SITE_URL,
      "@id": `${SITE_URL}/#organization`,
    },
    serviceType: "Corporate training in Power BI, SQL, Python and automation",
    areaServed: [
      { "@type": "Country", name: "Chile" },
      { "@type": "Country", name: "Colombia" },
      { "@type": "Country", name: "México" },
      { "@type": "Country", name: "Perú" },
    ],
    description:
      "Capacitación in-company para equipos en Chile: Power BI, SQL Server, Python, Excel, Power Automate e IA. Programas en vivo, con los datos de la empresa y factura corporativa.",
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
