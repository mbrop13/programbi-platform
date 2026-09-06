import type { Metadata } from "next";
import SeoGuide from "@/components/marketing/SeoGuide";
import { SITE_URL, absoluteUrl, jsonLdString } from "@/lib/seo";
import { GUIDE_SEO } from "@/lib/seo/money";

const copy = GUIDE_SEO["power-bi-mineria-chile"];

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
    q: "¿Hay un curso Power BI para minería en Chile?",
    a: "Sí: Análisis de datos para la minería (48 h en vivo) con Power BI, SQL y Python aplicados a faena. Es cupo individual.",
  },
  {
    q: "¿Y si la minera necesita el tablero en producción?",
    a: "Eso es el Pack Adopción BI: 1–3 dashboards con los datos del área + adopción 4–6 semanas. No es el curso abierto.",
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
          { "@type": "ListItem", position: 2, name: "Minería", item: absoluteUrl("/cursos/analitica-mineria") },
          { "@type": "ListItem", position: 3, name: copy.h1, item: absoluteUrl(copy.path) },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <SeoGuide
        kicker="Power BI · Minería Chile"
        h1={copy.h1}
        lead="Turnos, flota, combustible y mantenimiento siguen en planillas que no se hablan. Power BI sirve en minería cuando el tablero es el de la faena — no un demo — y alguien del área lo puede mantener."
        pagePath={copy.path}
        crumbs={[
          { href: "/", label: "Inicio" },
          { href: "/cursos/analitica-mineria", label: "Curso minería" },
          { href: copy.path, label: "Power BI minería" },
        ]}
        sections={[
          {
            h2: "Qué duele en faena (sin inventar KPIs de cliente)",
            paragraphs: [
              "Reportes de turno que se arman a mano. OEE en un Excel que nadie audita. Cruce de flota, combustible y personal en tres archivos. El jefe de área pide “el número de ayer” y llega pasado mañana.",
              "No publicamos métricas de clientes ni logos que no estén en este sitio. El patrón es el mismo: dato nativo (SQL, PI, SCADA o extractos) + modelo + hábito de uso.",
            ],
          },
          {
            h2: "Dos caminos",
            paragraphs: [
              "Persona / analista de mina: curso Análisis de datos para la minería (Power BI, SQL, Python, 48 h en vivo). Temario de turnos, OEE y predictivo a nivel de formación.",
              "Empresa minera / área: Pack Adopción. Construimos 1–3 dashboards con tus datos y capacitamos al equipo 4–6 semanas. Mentores con experiencia en minería citada en el sitio (CAP, AngloAmerican, Pucobre, SQM en el contexto de instructores y logos reales).",
            ],
          },
        ]}
        faqs={faqs}
        related={[
          { href: "/cursos/analitica-mineria", label: "Curso Power BI / análisis de datos para minería" },
          { href: "/empresas", label: "Soluciones para empresas (minería)" },
          { href: "/cursos/power-bi", label: "Curso Power BI genérico en vivo" },
          { href: "/por-que-fallan-proyectos-power-bi", label: "Por qué fallan los proyectos Power BI" },
        ]}
      />
    </>
  );
}
