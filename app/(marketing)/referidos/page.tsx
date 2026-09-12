import type { Metadata } from "next";
import { ReferidosLanding } from "@/components/referrals/referidos-landing";
import { absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOg, SITE_URL } from "@/lib/seo";

const title = "Invita a amigos o empresas | Referidos ProgramBI";
const description =
  "Recomienda un curso o una capacitación para un equipo. Si se cierra y se cobra, ganas el 15%. Misma cuenta ProgramBI. Chile.";
const share = pageOg({
  title,
  description,
  path: "/referidos",
  kicker: "Programa de referidos",
  tags: ["Referidos", "Cursos", "Empresas"],
});

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/referidos" },
  openGraph: {
    title,
    description:
      "15% de cursos y capacitaciones a empresas, pagado al cobro. Intros calificadas a mano.",
    url: absoluteUrl("/referidos"),
    type: "website",
    images: share.images,
  },
  twitter: share.twitter,
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
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Inicio", path: "/" },
              { name: "Referidos", path: "/referidos" },
            ])
          ),
        }}
      />
      <ReferidosLanding />
    </>
  );
}
