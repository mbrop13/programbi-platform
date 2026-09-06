import type { Metadata } from "next";
import EmpresasClient from "../empresas/EmpresasClient";
import { ogImageUrl } from "@/lib/og/url";
import { SITE_URL, ORG_ID, absoluteUrl } from "@/lib/seo";
import { PACK, PACK_FAQS, PACK_VARIANT_COPY } from "@/lib/data/pack-adopcion";

const copy = PACK_VARIANT_COPY["migrar-excel"];

export const metadata: Metadata = {
  title: { absolute: copy.title },
  description: copy.description,
  alternates: { canonical: "/migrar-excel-a-power-bi" },
  openGraph: {
    title: copy.title,
    description: copy.description,
    url: absoluteUrl("/migrar-excel-a-power-bi"),
    type: "website",
    images: [
      {
        url: ogImageUrl({
          kicker: "Excel → Power BI Chile",
          title: copy.h1,
          description: PACK.tagline,
          tags: ["Excel", "Power BI", "Adopción"],
          path: "migrar-excel-a-power-bi",
        }),
        width: 1200,
        height: 630,
        alt: "Migrar Excel a Power BI Chile — ProgramBI",
      },
    ],
  },
};

export default function MigrarExcelPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Migrar Excel a Power BI — Pack Adopción BI",
        url: absoluteUrl("/migrar-excel-a-power-bi"),
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
            name: "Migrar Excel a Power BI",
            item: absoluteUrl("/migrar-excel-a-power-bi"),
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EmpresasClient variant="migrar-excel" />
    </>
  );
}
