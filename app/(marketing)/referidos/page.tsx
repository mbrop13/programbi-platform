import type { Metadata } from "next";
import { ReferidosLanding } from "@/components/referrals/referidos-landing";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Invita a amigos o empresas | Referidos ProgramBI" },
  description:
    "Recomienda un curso o una capacitación para un equipo. Si se cierra y se cobra, ganas el 15%. Misma cuenta ProgramBI. Chile.",
  alternates: { canonical: "/referidos" },
  openGraph: {
    title: "Invita a amigos o empresas | Referidos ProgramBI",
    description:
      "15% de cursos y capacitaciones a empresas, pagado al cobro. Intros calificadas a mano.",
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
      "Invita a amigos a un curso o a empresas a una capacitación. 15% del neto cobrado, pagado al cobro.",
    isPartOf: { "@type": "WebSite", url: SITE_URL, name: "ProgramBI" },
    about: [
      { "@type": "Course", name: "Cursos ProgramBI", provider: { "@type": "Organization", name: "ProgramBI SPA" } },
      {
        "@type": "Service",
        name: "Capacitación corporativa",
        provider: { "@type": "Organization", name: "ProgramBI SPA" },
      },
    ],
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
