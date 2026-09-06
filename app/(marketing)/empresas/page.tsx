import type { Metadata } from "next";
import EmpresasClient from "./EmpresasClient";
import { ogImageUrl } from "@/lib/og/url";
import { SITE_URL, ORG_ID, absoluteUrl, jsonLdString } from "@/lib/seo";
import { PACK, PACK_FAQS, PACK_VARIANT_COPY } from "@/lib/data/pack-adopcion";

const copy = PACK_VARIANT_COPY.empresas;

export const metadata: Metadata = {
  title: { absolute: copy.title },
  description: copy.description,
  alternates: { canonical: "/empresas" },
  openGraph: {
    title: copy.title,
    description: copy.description,
    url: absoluteUrl("/empresas"),
    type: "website",
    images: [
      {
        url: ogImageUrl({
          kicker: "Pack Adopción BI",
          title: PACK.headline,
          description: PACK.tagline,
          tags: ["Power BI", "Adopción", "Chile"],
          path: "empresas",
        }),
        width: 1200,
        height: 630,
        alt: "Pack Adopción BI — ProgramBI",
      },
    ],
  },
};

export default function EmpresasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Pack Adopción Power BI para empresas Chile",
        url: absoluteUrl("/empresas"),
        provider: { "@type": "Organization", name: "ProgramBI SPA", url: SITE_URL, "@id": ORG_ID },
        serviceType: "Business Intelligence implementation and team adoption",
        areaServed: { "@type": "Country", name: "Chile" },
        description: copy.description,
        offers: {
          "@type": "Offer",
          priceCurrency: "CLP",
          price: String(PACK.priceFromClp),
          description: `${PACK.priceLabel} (${PACK.priceFromLabel})`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: PACK_FAQS.map((faq) => ({
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
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <EmpresasClient variant="empresas" />
    </>
  );
}
