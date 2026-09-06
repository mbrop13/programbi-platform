import type { Metadata } from "next";
import { ReferidosLanding } from "@/components/referrals/referidos-landing";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import { PACK } from "@/lib/data/pack-adopcion";

export const metadata: Metadata = {
  title: { absolute: "Referidos Pack Adopción BI | Gana 15% | ProgramBI" },
  description:
    "Gana 15% por cada Pack Adopción que cierres con tu intro. Presentas un Controller con dolor Excel; ProgramBI vende y entrega. Pago al cobro. Chile.",
  alternates: { canonical: "/referidos" },
  openGraph: {
    title: "Referidos Pack Adopción BI | Gana 15%",
    description:
      "Intros calificadas a mano. 15% del neto cobrado del primer Pack. Pago al cobro. Clawback 60 días.",
    url: absoluteUrl("/referidos"),
    type: "website",
  },
};

export default function ReferidosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Programa de referidos ProgramBI",
    url: absoluteUrl("/referidos"),
    description:
      "15% del Pack Adopción BI atribuido, pagado al cobro. Intros validadas por el equipo.",
    isPartOf: { "@type": "WebSite", url: SITE_URL, name: "ProgramBI" },
    about: {
      "@type": "Service",
      name: PACK.name,
      provider: { "@type": "Organization", name: "ProgramBI SPA" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReferidosLanding />
    </>
  );
}
