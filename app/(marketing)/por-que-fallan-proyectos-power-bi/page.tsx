import type { Metadata } from "next";
import SeoGuide from "@/components/marketing/SeoGuide";
import { SITE_URL, absoluteUrl, jsonLdString } from "@/lib/seo";
import { GUIDE_SEO } from "@/lib/seo/money";

const copy = GUIDE_SEO["por-que-fallan-proyectos-power-bi"];

export const metadata: Metadata = {
  title: { absolute: copy.title },
  description: copy.description,
  alternates: { canonical: copy.path },
  openGraph: {
    title: copy.title,
    description: copy.description,
    url: absoluteUrl(copy.path),
    type: "article",
  },
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

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: copy.h1,
        description: copy.description,
        url: absoluteUrl(copy.path),
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
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Empresas", item: absoluteUrl("/empresas") },
          { "@type": "ListItem", position: 3, name: copy.h1, item: absoluteUrl(copy.path) },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <SeoGuide
        kicker="Adopción Power BI · Chile"
        h1={copy.h1}
        lead="El .pbix se ve bien en la demo. A las tres semanas el área volvió a Excel. Eso no es un problema de DAX: es un problema de adopción."
        pagePath={copy.path}
        crumbs={[
          { href: "/", label: "Inicio" },
          { href: "/empresas", label: "Empresas" },
          { href: copy.path, label: "Proyectos Power BI" },
        ]}
        sections={[
          {
            h2: "Qué suele pasar en empresas chilenas",
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
          { href: "/empresas", label: "Soluciones para empresas" },
          { href: "/curso-power-bi-vs-pack-adopcion", label: "Curso Power BI vs Pack Adopción" },
          { href: "/migrar-excel-a-power-bi", label: "Migrar Excel a Power BI en control de gestión" },
          { href: "/cursos/power-bi", label: "Curso Power BI en vivo (particulares)" },
        ]}
      />
    </>
  );
}
