import type { Metadata } from "next";
import EmpresasClient from "./EmpresasClient";
import BloqueLocalContenido from "@/components/paises/BloqueLocalContenido";
import { ogImageUrl } from "@/lib/og/url";
import { SITE_URL, absoluteUrl, jsonLdString, twitterShare } from "@/lib/seo";
import { PAGE_SEO } from "@/lib/seo/money";
import { EMPRESAS_FAQS } from "@/lib/data/empresas-faqs";
import { getPais, normalizarPais } from "@/config/paises";
import { hreflangDe } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";

export const metadata: Metadata = {
  title: { absolute: PAGE_SEO.empresas.title },
  description: PAGE_SEO.empresas.description,
  alternates: {
    canonical: absoluteUrl("/empresas"),
    languages: hreflangDe("/empresas"),
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

export default async function EmpresasPage({
  params,
  searchParams,
}: {
  params: Promise<{ pais?: string }>;
  searchParams: Promise<{ curso?: string; nivel?: string }>;
}) {
  const pais = normalizarPais((await params).pais);
  const { curso, nivel } = await searchParams;
  const serviceJsonLd = {
    "@type": "Service",
    name: "Adopción de Power BI y capacitación in-company",
    provider: {
      "@type": "Organization",
      name: "ProgramBI SPA",
      url: SITE_URL,
      "@id": `${SITE_URL}/#organization`,
    },
    serviceType: "Corporate training in Power BI, SQL, Python and automation",
    areaServed:
      pais === "cl"
        ? [
            { "@type": "Country", name: "Chile" },
            { "@type": "Country", name: "Colombia" },
            { "@type": "Country", name: "México" },
            { "@type": "Country", name: "Perú" },
          ]
        : [{ "@type": "Country", name: localizarMercado("Chile", pais) }],
    description: localizarMercado(
      "Adopción de Power BI en empresas de Chile: de Excel a tableros, con SQL, Python y automatización. Programas in-company en vivo, con los datos de la empresa y factura corporativa.",
      pais
    ),
  };

  // Mismo texto que el bloque visible de /empresas (components/empresas/empresas-faq.tsx).
  const faqJsonLd = {
    "@type": "FAQPage",
    mainEntity: EMPRESAS_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [serviceJsonLd, faqJsonLd],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <EmpresasClient curso={curso} nivel={nivel} paisNombre={getPais(pais).nombre} />
      <BloqueLocalContenido iso={pais} ruta="empresas" conFaqJsonLd={false} />
      {pais !== "cl" ? (
        <p className="mx-auto max-w-[1400px] px-4 pb-10 text-sm text-mute sm:px-6">
          {`Capacitación in-company en vivo para equipos de ${getPais(pais).nombre}, con los datos de tu empresa y factura corporativa.`}
        </p>
      ) : null}
    </>
  );
}
