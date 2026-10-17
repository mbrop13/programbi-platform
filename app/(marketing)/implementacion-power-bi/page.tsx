import type { Metadata } from "next";
import SeoGuide from "@/components/marketing/SeoGuide";
import { SITE_URL, absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOg } from "@/lib/seo";
import { normalizarPais } from "@/config/paises";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";

const path = "/implementacion-power-bi";
const title = "Implementación Power BI Chile | ProgramBI";
const description =
  "Implementación Power BI en Chile para control de gestión: dashboards, capacitación in-company y acompañamiento. Diagnóstico por WhatsApp.";
const share = pageOg({
  title,
  description,
  path,
  kicker: "Implementación Power BI · Chile",
  tags: ["Power BI", "Empresas", "Chile"],
});

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path, languages: hreflangDe(path) },
  openGraph: {
    title,
    description:
      "Dashboards Power BI con los datos de tu área y capacitación del equipo. Chile.",
    url: absoluteUrl(path),
    type: "article",
    images: share.images,
  },
  twitter: share.twitter,
};

const faqs = [
  {
    q: "¿Hacen implementación Power BI in-company?",
    a: "Sí. Capacitación corporativa e implementación de tableros con los datos del área. Cotiza en /empresas o por WhatsApp.",
  },
  {
    q: "¿Es un curso abierto?",
    a: "No. El curso Power BI abierto es otra ficha. Esto es trabajo con empresas.",
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ pais?: string }>;
}) {
  const pais = normalizarPais((await params).pais);
  const L = (texto: string) => localizarMercado(texto, pais);
  const href = (destino: string) => rutaLocal(pais, destino);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: L("Implementación Power BI Chile"),
        url: absoluteUrl(href(path)),
        provider: { "@type": "Organization", name: "ProgramBI SPA", url: SITE_URL },
        areaServed: { "@type": "Country", name: L("Chile") },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      breadcrumbJsonLd([
        { name: "Inicio", path: href("/") },
        { name: "Empresas", path: href("/empresas") },
        { name: "Implementación Power BI", path: href(path) },
      ]),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <SeoGuide
        kicker={L("Implementación Power BI · Chile")}
        h1={L("Implementación Power BI en Chile, con el equipo usando el tablero")}
        lead="No entregamos un archivo y desaparecemos. Armamos dashboards con tus datos y capacitamos al área para mantenerlos."
        pagePath={href(path)}
        empresasHref={href("/empresas")}
        nota={pais === "cl" ? undefined : `[PENDIENTE CONTENIDO ${pais.toUpperCase()}]`}
        crumbs={[
          { href: href("/"), label: "Inicio" },
          { href: href("/empresas"), label: "Empresas" },
          { href: href(path), label: "Implementación Power BI" },
        ]}
        sections={[
          {
            h2: "Para control de gestión, finanzas y ops",
            paragraphs: [
              "Cierres en Excel, versiones cruzadas y un analista héroe. Power BI sirve cuando el modelo es el de tu área y alguien del equipo lo puede actualizar.",
              "Trabajamos con fuentes reales (Excel, ERP, SQL) y dejamos práctica sobre el reporte vivo.",
            ],
          },
        ]}
        faqs={faqs}
        related={[
          { href: href("/empresas"), label: "Soluciones para empresas" },
          { href: href("/cursos/power-bi"), label: "Curso Power BI en vivo" },
          { href: href("/migrar-excel-a-power-bi"), label: "Migrar Excel a Power BI" },
        ]}
      />
    </>
  );
}
