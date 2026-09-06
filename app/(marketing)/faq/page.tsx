import type { Metadata } from "next";
import FaqClient from "./FaqClient";
import { ogImageUrl } from "@/lib/og/url";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { PACK } from "@/lib/data/pack-adopcion";

export const metadata: Metadata = {
  title: { absolute: "FAQ Pack Adopción BI y cursos Power BI Chile | ProgramBI" },
  description:
    "¿El Pack es un curso? ¿SENCE? ¿Online o presencial? Cursos en vivo vs tablero en producción. Diagnóstico 30 min. Factura directa.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ Pack Adopción BI y cursos | ProgramBI",
    description:
      "Dudas de empresas (Pack Adopción) y de cursos abiertos Power BI, SQL y Python en Chile.",
    url: absoluteUrl("/faq"),
    type: "website",
    images: [
      {
        url: ogImageUrl({
          kicker: "Ayuda",
          title: "Preguntas frecuentes",
          description:
            "Pack Adopción BI vs cursos abiertos. SENCE, diagnóstico 30 min y factura directa.",
          path: "faq",
        }),
        width: 1200,
        height: 630,
        alt: "Preguntas frecuentes — ProgramBI",
      },
    ],
  },
};

const FAQ_DATA = [
  {
    question: "¿El Pack Adopción BI es un curso?",
    answer: `No. ${PACK.headline} Construimos ${PACK.dashboards} dashboards con los datos de tu área y capacitamos al equipo ${PACK.trainingWeeks} semanas para que los mantenga. El curso abierto de Power BI es formación individual, otra oferta. Detalle: ${SITE_URL}/empresas`,
    category: "empresa",
  },
  {
    question: "¿Puedo franquiciarlo con SENCE?",
    answer: PACK.senceLine,
    category: "empresa",
  },
  {
    question: "¿Cuánto cuesta el Pack y qué incluye?",
    answer: `Referencial ${PACK.priceLabel} (${PACK.priceFromLabel}), según fuentes, tableros y tamaño del equipo. Incluye construcción, adopción ${PACK.trainingWeeks} semanas, handoff y ${PACK.postGoLiveWeeks} semanas post go-live. El diagnóstico de ${PACK.diagnosisMinutes} minutos no tiene costo.`,
    category: "empresa",
  },
  {
    question: "¿Cómo agendo el diagnóstico?",
    answer: `Formulario en ${SITE_URL}/empresas (nombre, empresa, cargo, WhatsApp, área) o WhatsApp +56 9 3540 9699. Propuesta en menos de ${PACK.proposalSlaHours} h.`,
    category: "empresa",
  },
  {
    question: "¿Qué es ProgramBI?",
    answer: "ProgramBI (Chile) implementa Business Intelligence con adopción para empresas y dicta cursos en vivo de Power BI, SQL y Python para particulares. Mentores con experiencia en banca, retail y minería.",
    category: "general",
  },
  {
    question: "¿Los cursos abiertos son lo mismo que el Pack?",
    answer: "No. Los cursos son clases en vivo por Zoom para particulares o cupos sueltos. El Pack es tablero en producción + autonomía del equipo. Si eres Controller o jefe de área, parte por /empresas.",
    category: "cursos",
  },
  {
    question: "¿Necesito saber programar para un curso?",
    answer: "No. Partimos desde cero. Pensado para finanzas, operaciones, minería y administración.",
    category: "cursos",
  },
  {
    question: "¿Las clases de los cursos son grabadas?",
    answer: "Sí. En vivo por Zoom y quedan grabadas de por vida en el campus, con material y datos de práctica.",
    category: "cursos",
  },
  {
    question: "¿Hay certificado en los cursos abiertos?",
    answer: "Sí, certificado digital al completar. El Pack empresas entrega el tablero, la transferencia y el acompañamiento post go-live, no un diploma de curso.",
    category: "general",
  },
  {
    question: "¿Qué métodos de pago aceptan en cursos?",
    answer: "Cursos abiertos: Webpay y transferencia. Pack empresas: factura directa. Los valores vigentes están en cada ficha de curso o en la propuesta del diagnóstico.",
    category: "pagos",
  },
];

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Preguntas Frecuentes", item: absoluteUrl("/faq") }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <FaqClient faqItems={FAQ_DATA} />
    </>
  );
}
