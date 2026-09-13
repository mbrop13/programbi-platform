import type { Metadata } from "next";
import EmpresasClient from "./EmpresasClient";
import { ogImageUrl } from "@/lib/og/url";
import { SITE_URL, absoluteUrl, jsonLdString, twitterShare } from "@/lib/seo";
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
          title: "De Excel a Power BI en tu empresa.",
          description:
            "Adopción de BI in-company: Power BI, SQL y Python con los datos de la empresa. En vivo, con factura.",
          tags: ["Capacitación", "Power BI", "In-company"],
          path: "empresas",
        }),
        width: 1200,
        height: 630,
        alt: "De Excel a Power BI para empresas en Chile — ProgramBI",
      },
    ],
  },
  twitter: twitterShare(
    PAGE_SEO.empresas.title,
    PAGE_SEO.empresas.description,
    ogImageUrl({
      kicker: "Para empresas",
      title: "De Excel a Power BI en tu empresa.",
      description:
        "Adopción de BI in-company: Power BI, SQL y Python con los datos de la empresa. En vivo, con factura.",
      tags: ["Capacitación", "Power BI", "In-company"],
      path: "empresas",
    })
  ),
};

export default function EmpresasPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Adopción de Power BI y capacitación in-company",
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
      "Adopción de Power BI en empresas de Chile: de Excel a tableros, con SQL, Python y automatización. Programas in-company en vivo, con los datos de la empresa y factura corporativa.",
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
