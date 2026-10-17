import type { Metadata } from "next";
import SeoGuide from "@/components/marketing/SeoGuide";
import { SITE_URL, absoluteUrl, jsonLdString, pageOg } from "@/lib/seo";
import { GUIDE_SEO } from "@/lib/seo/money";
import { normalizarPais } from "@/config/paises";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";

const copy = GUIDE_SEO["por-que-fallan-proyectos-power-bi"];

const share = pageOg({
  title: copy.title,
  description: copy.description,
  path: copy.path,
  kicker: "Adopción Power BI · Chile",
  tags: ["Power BI", "Adopción", "Chile"],
});

export const metadata: Metadata = {
  title: { absolute: copy.title },
  description: copy.description,
  alternates: { canonical: copy.path, languages: hreflangDe(copy.path) },
  openGraph: {
    title: copy.title,
    description: copy.description,
    url: absoluteUrl(copy.path),
    type: "article",
    images: share.images,
  },
  twitter: share.twitter,
};

const faqs = [
  {
    q: "¿Por qué un dashboard Power BI queda sin uso?",
    a: "Porque se entregó el archivo y no hubo adopción: el equipo no sabe actualizar el modelo, el KPI no es el del directorio y Excel sigue siendo la fuente de verdad.",
  },
  {
    q: "¿Un curso Power BI arregla un proyecto que ya falló?",
    a: "El curso forma a una persona. El Pack Adopción construye 1–3 tableros con los datos del área y deja al equipo operándolos 4–6 semanas + post go-live.",
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
        headline: L(copy.h1),
        description: L(copy.description),
        url: absoluteUrl(href(copy.path)),
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
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl(href("/")) },
          { "@type": "ListItem", position: 2, name: "Empresas", item: absoluteUrl(href("/empresas")) },
          { "@type": "ListItem", position: 3, name: L(copy.h1), item: absoluteUrl(href(copy.path)) },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <SeoGuide
        kicker={L("Adopción Power BI · Chile")}
        h1={L(copy.h1)}
        lead="El .pbix se ve bien en la demo. A las tres semanas el área volvió a Excel. Eso no es un problema de DAX: es un problema de adopción."
        pagePath={href(copy.path)}
        empresasHref={href("/empresas")}
        nota={pais === "cl" ? undefined : `[PENDIENTE CONTENIDO ${pais.toUpperCase()}]`}
        crumbs={[
          { href: href("/"), label: "Inicio" },
          { href: href("/empresas"), label: "Empresas" },
          { href: href(copy.path), label: "Proyectos Power BI" },
        ]}
        sections={[
          {
            h2: pais === "cl" ? "Qué suele pasar en empresas chilenas" : "Qué suele pasar en las empresas",
            paragraphs: [
              "Control de gestión pide un tablero. TI o una consultora arma un dashboard. Lo presentan. Aplausos. El lunes el analista héroe sigue pegando planillas porque el modelo no habla el idioma del cierre, nadie sabe refrescar el gateway y cada filtro nuevo es un ticket.",
              "Power BI no falló. Falló el traspaso: no hay dueño del modelo, no hay práctica sobre datos reales y no hay las 2–4 semanas post go-live donde se caen la mayoría de los proyectos BI.",
            ],
          },
          {
            h2: "Curso, consultora o Pack Adopción",
            paragraphs: [
              "Un curso Power BI (el nuestro u otro) sirve si una persona necesita DAX y Power Query. No entrega el tablero del área ni deja al equipo autónomo.",
              "Una consultora que entrega y se va deja un activo que nadie mantiene. El Pack Adopción BI de ProgramBI es construcción de 1–3 dashboards con tus datos + capacitación 4–6 semanas + handoff y acompañamiento post go-live. Factura directa.",
            ],
          },
          {
            h2: "Señales de que no es un curso lo que necesitas",
            paragraphs: [
              "El directorio mira datos de hace 2–4 semanas. El cierre depende de una sola persona. Ya pagaron un curso y el equipo volvió a la planilla. Si reconoces eso, parte por el diagnóstico de 30 minutos en /empresas, no por otra ficha de curso.",
            ],
          },
        ]}
        faqs={faqs}
        related={[
          { href: href("/empresas"), label: "Soluciones para empresas" },
          { href: href("/curso-power-bi-vs-pack-adopcion"), label: "Curso Power BI vs Pack Adopción" },
          { href: href("/migrar-excel-a-power-bi"), label: "Migrar Excel a Power BI en control de gestión" },
          { href: href("/cursos/power-bi"), label: "Curso Power BI en vivo (particulares)" },
        ]}
      />
    </>
  );
}
