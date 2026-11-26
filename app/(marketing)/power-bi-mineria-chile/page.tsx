import type { Metadata } from "next";
import SeoGuide from "@/components/marketing/SeoGuide";
import { ISO_CHILE } from "@/config/paises";
import { textoCuotas } from "@/config/cuotas";
import { courseDurationHours, getCourseBySlug } from "@/lib/data/courses";
import { OPEN_COHORT_LABEL } from "@/lib/data/course-schedules";
import { SITE_URL, absoluteUrl, jsonLdString, pageOg } from "@/lib/seo";
import { getCourseJsonLd } from "@/lib/seo/course-jsonld";
import { GUIDE_SEO } from "@/lib/seo/money";

const copy = GUIDE_SEO["power-bi-mineria-chile"];
const mineriaCourse = getCourseBySlug("analitica-mineria");
const mineriaHours = courseDurationHours("analitica-mineria");

const share = pageOg({
  title: copy.title,
  description: copy.description,
  path: copy.path,
  kicker: "Power BI · Minería Chile",
  tags: ["Power BI", "Minería", "Chile"],
});

export const metadata: Metadata = {
  title: { absolute: copy.title },
  description: copy.description,
  alternates: { canonical: copy.path },
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
    q: "¿Hay un curso Power BI para minería en Chile?",
    a: `Sí: el programa Análisis de Datos para la Minería cuenta con nivel básico-intermedio de ${mineriaHours} horas y nivel avanzado de ${mineriaHours} horas en vivo, integrando Power BI, SQL Server y Python aplicados a gestión de turnos, flota, OEE y mantenimiento en faena.`,
  },
  {
    q: "¿Y si la operación minera necesita implementar tableros en producción?",
    a: "Para equipos corporativos ofrecemos el Pack Adopción BI: desarrollamos de 1 a 3 dashboards conectados a los datos del área y acompañamos la adopción técnica del equipo durante 4 a 6 semanas.",
  },
];

export default function Page() {
  const courseNode = mineriaCourse
    ? getCourseJsonLd(mineriaCourse, "publico", ISO_CHILE)
    : null;

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
      ...(courseNode ? [courseNode] : []),
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
        lead="Integra reportes de turno, disponibilidad de flota, consumo de combustible y mantenimiento en un modelo único de datos. Power BI genera impacto en faena cuando se conecta a tus fuentes operativas y el equipo del área domina su actualización."
        pagePath={copy.path}
        courseHero={{
          courseHref: "/cursos/analitica-mineria",
          courseSlug: "analitica-mineria",
          whatsappLabel: "Pedir clase gratis por WhatsApp",
          whatsappText:
            "Hola, vengo de /power-bi-mineria-chile y quiero la clase gratis del curso de Análisis de Datos para la Minería [ref:power-bi-mineria-chile]",
          fichaLabel: "Ver fechas y precio",
          temarioLabel: "Temario y precios",
          claseGratisText: "Clase gratis: coordínala por WhatsApp",
          cuotasText: textoCuotas(ISO_CHILE),
          cohortNote: OPEN_COHORT_LABEL,
        }}
        crumbs={[
          { href: "/", label: "Inicio" },
          { href: "/cursos/analitica-mineria", label: "Curso minería" },
          { href: copy.path, label: "Power BI minería" },
        ]}
        sections={[
          {
            h2: "Desafíos operativos en faena",
            paragraphs: [
              "Partes de turno consolidados manualmente, indicadores de disponibilidad y OEE dispersos en planillas independientes, y cruces de flota, combustible y dotación que tardan días en llegar a jefatura.",
              "Una reportería minera confiable conecta las fuentes de la operación (SQL Server, PI System, SCADA o extractos de gestión), estructura un modelo estrella auditable y estandariza el seguimiento semanal por área.",
            ],
          },
          {
            h2: "Dos modalidades según tu objetivo",
            paragraphs: [
              `Profesionales y analistas de faena: curso Análisis de Datos para la Minería en vivo (Power BI, SQL Server y Python), con niveles básico-intermedio y avanzado de ${mineriaHours} horas cada uno, enfocados en reportería de turnos, cálculo de OEE y mantenimiento predictivo.`,
              "Empresas mineras y contratistas: Pack Adopción BI. Construimos de 1 a 3 dashboards productivos con los datos de tu operación y capacitamos al equipo durante 4 a 6 semanas, junto a especialistas con experiencia formando equipos en compañías como CAP, Anglo American, Pucobre y SQM.",
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
