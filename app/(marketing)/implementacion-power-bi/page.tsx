import type { Metadata } from "next";
import EmpresasClient from "../empresas/EmpresasClient";
import { ogImageUrl } from "@/lib/og/url";
import { SITE_URL, ORG_ID, absoluteUrl, jsonLdString } from "@/lib/seo";
import { PACK, PACK_FAQS, PACK_VARIANT_COPY } from "@/lib/data/pack-adopcion";

const copy = PACK_VARIANT_COPY.implementacion;

export const metadata: Metadata = {
  title: { absolute: copy.title },
  description: copy.description,
  alternates: { canonical: "/implementacion-power-bi" },
  openGraph: {
    title: copy.title,
    description: copy.description,
    url: absoluteUrl("/implementacion-power-bi"),
    type: "website",
    images: [
      {
        url: ogImageUrl({
          kicker: "Implementación Power BI Chile",
          title: copy.h1,
          description: PACK.tagline,
          tags: ["Power BI", "Control de gestión", "Chile"],
          path: "implementacion-power-bi",
        }),
        width: 1200,
        height: 630,
        alt: "Implementación Power BI Chile — ProgramBI",
      },
    ],
  },
};

export default function ImplementacionPowerBiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Implementación Power BI Chile — Pack Adopción BI",
        url: absoluteUrl("/implementacion-power-bi"),
        provider: { "@type": "Organization", name: "ProgramBI SPA", url: SITE_URL, "@id": ORG_ID },
        areaServed: { "@type": "Country", name: "Chile" },
        description: copy.description,
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
          {
            "@type": "ListItem",
            position: 3,
            name: "Implementación Power BI",
            item: absoluteUrl("/implementacion-power-bi"),
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <EmpresasClient variant="implementacion" />
    </>
  );
}
