import type { Metadata } from "next";
import SeoGuide from "@/components/marketing/SeoGuide";
import CountryContext from "@/components/marketing/CountryContext";
import { getContenidoPais } from "@/lib/data/contenido-paises";
import { SITE_URL, absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOg } from "@/lib/seo";
import { getPais, normalizarPais } from "@/config/paises";
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

const faqsBase = [
  {
    q: "¿Puedo aprender Power BI en un curso y migrar yo?",
    a: "Sí: el curso abierto de Power BI es formación individual. Si el área necesita el tablero con datos propios, eso es un proyecto empresas.",
  },
];

const COPY_UY = {
  headline: "Migrar Excel a Power BI para empresas de Uruguay",
  h1: "Migrar Excel a Power BI para empresas de Uruguay",
  lead: "Pasamos planillas de campo, faena, facturación electrónica DGI y reportes de servicios a tableros Power BI, con capacitación en vivo para tu equipo en horario de Montevideo.",
  sections: [
    {
      h2: "Cuándo un curso alcanza y cuándo conviene proyecto empresas",
      paragraphs: [
        "Si buscas dominar DAX, Power Query y modelado estrella para automatizar tus propios reportes en Uruguay, el curso Power BI en vivo en horario de Montevideo es el camino directo.",
        "Cuando el cierre mensual del área —stock, margen por potrero o destino de exportación, cobranza o reservas— depende de planillas paralelas, conviene un tablero in-company construido con tus fuentes y entrenamiento del equipo.",
      ],
    },
  ],
  faqs: [
    {
      q: "¿Puedo aprender Power BI en un curso y migrar las planillas de mi empresa en Uruguay?",
      a: "Sí: el curso abierto de Power BI se dicta en vivo en horario de Montevideo y admite pago en pesos uruguayos (UYU). Si el área necesita el tablero armado con datos propios y práctica grupal, se cotiza como proyecto in-company.",
    },
    {
      q: "¿Trabajan con datos locales como facturación electrónica DGI, agro o frigoríficos?",
      a: "Sí. En programas para Uruguay se integran extractos de facturación electrónica DGI, planillas de campo o DICOSE, sistemas de faena y bases de cobranza en un modelo común que el equipo pueda mantener.",
    },
  ],
};

export default async function Page({
  params,
}: {
  params: Promise<{ pais?: string }>;
}) {
  const pais = normalizarPais((await params).pais);
  const paisInfo = getPais(pais);
  const contenido = getContenidoPais(pais);
  const L = (texto: string) => localizarMercado(texto, pais);
  const href = (destino: string) => rutaLocal(pais, destino);
  const esUy = pais === "uy";
  const headline = esUy ? COPY_UY.headline : "Migrar Excel a Power BI en control de gestión";
  const lead = esUy
    ? COPY_UY.lead
    : "Pasamos reportes eternos a tableros y formamos al equipo para mantenerlos. Curso abierto o proyecto in-company, según si eres persona o empresa.";
  const sections = esUy
    ? COPY_UY.sections
    : [
        {
          h2: "Cuándo un curso alcanza y cuándo no",
          paragraphs: [
            "Si tú quieres DAX y Power Query, el curso Power BI en vivo es el camino.",
            "Si el cierre del área vive en planillas que nadie más entiende, hace falta un tablero con esos datos y práctica del equipo — eso se cotiza en empresas.",
          ],
        },
      ];
  const faqs = esUy ? COPY_UY.faqs : faqsBase;
  const related = esUy
    ? [
        { href: href("/cursos/power-bi"), label: "Curso Power BI en vivo Uruguay" },
        { href: href("/empresas"), label: "Capacitación in-company Uruguay" },
        { href: href("/implementacion-power-bi"), label: "Implementación Power BI en Uruguay" },
      ]
    : [
        { href: href("/cursos/power-bi"), label: L("Curso Power BI en vivo Chile") },
        { href: href("/empresas"), label: "Soluciones para empresas" },
        { href: href("/implementacion-power-bi"), label: "Implementación Power BI" },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline,
        url: absoluteUrl(href(path)),
        inLanguage: paisInfo.idioma,
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
        h1={headline}
        lead={lead}
        pagePath={href(path)}
        empresasHref={href("/empresas")}
        nota={pais === "cl" ? undefined : contenido?.mercado.facturacion}
        crumbs={[
          { href: href("/"), label: "Inicio" },
          { href: href("/empresas"), label: "Empresas" },
          { href: href(path), label: "Migrar Excel a Power BI" },
        ]}
        sections={sections}
        faqs={faqs}
        related={related}
      />
      {contenido ? (
        <CountryContext
          contenido={contenido}
          titulo={`Migrar Excel a Power BI en ${paisInfo.nombre}`}
        />
      ) : null}
    </>
  );
}
