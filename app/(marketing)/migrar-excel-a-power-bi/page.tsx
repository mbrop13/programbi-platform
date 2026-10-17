import type { Metadata } from "next";
import SeoGuide from "@/components/marketing/SeoGuide";
import { SITE_URL, absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOg } from "@/lib/seo";
import { normalizarPais } from "@/config/paises";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";

const path = "/migrar-excel-a-power-bi";
const title = "Migrar Excel a Power BI Chile | Control de gestión";
const description =
  "Migrar Excel a Power BI en Chile: tableros para control de gestión y capacitación del equipo. Cotiza in-company o el curso abierto.";
const share = pageOg({
  title,
  description,
  path,
  kicker: "Excel → Power BI · Chile",
  tags: ["Excel", "Power BI", "Chile"],
});

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path, languages: hreflangDe(path) },
  openGraph: {
    title: "Migrar Excel a Power BI Chile | ProgramBI",
    description: "De planillas eternas a dashboards. Capacitación e implementación en Chile.",
    url: absoluteUrl(path),
    type: "article",
    images: share.images,
  },
  twitter: share.twitter,
};

const faqs = [
  {
    q: "¿Puedo aprender Power BI en un curso y migrar yo?",
    a: "Sí: el curso abierto de Power BI es formación individual. Si el área necesita el tablero con datos propios, eso es un proyecto empresas.",
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
        "@type": "Article",
        headline: "Migrar Excel a Power BI en control de gestión",
        url: absoluteUrl(href(path)),
        inLanguage: "es-CL",
        author: { "@type": "Organization", name: "ProgramBI", url: SITE_URL },
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
        { name: "Migrar Excel a Power BI", path: href(path) },
      ]),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <SeoGuide
        kicker={L("Excel → Power BI · Chile")}
        h1="Migrar Excel a Power BI en control de gestión"
        lead="Pasamos reportes eternos a tableros y formamos al equipo para mantenerlos. Curso abierto o proyecto in-company, según si eres persona o empresa."
        pagePath={href(path)}
        empresasHref={href("/empresas")}
        nota={pais === "cl" ? undefined : `[PENDIENTE CONTENIDO ${pais.toUpperCase()}]`}
        crumbs={[
          { href: href("/"), label: "Inicio" },
          { href: href("/empresas"), label: "Empresas" },
          { href: href(path), label: "Migrar Excel a Power BI" },
        ]}
        sections={[
          {
            h2: "Cuándo un curso alcanza y cuándo no",
            paragraphs: [
              "Si tú quieres DAX y Power Query, el curso Power BI en vivo es el camino.",
              "Si el cierre del área vive en planillas que nadie más entiende, hace falta un tablero con esos datos y práctica del equipo — eso se cotiza en empresas.",
            ],
          },
        ]}
        faqs={faqs}
        related={[
          { href: href("/cursos/power-bi"), label: L("Curso Power BI en vivo Chile") },
          { href: href("/empresas"), label: "Soluciones para empresas" },
          { href: href("/implementacion-power-bi"), label: "Implementación Power BI" },
        ]}
      />
    </>
  );
}
