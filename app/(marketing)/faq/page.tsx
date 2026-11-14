import type { Metadata } from "next";
import FaqClient from "./FaqClient";
import { ogImageUrl } from "@/lib/og/url";
import { absoluteUrl, jsonLdString, tituloSeo, twitterShare } from "@/lib/seo";
import { getContenidoPais } from "@/lib/data/contenido-paises";
import { ISO_CHILE, normalizarPais } from "@/config/paises";
import { MEDIOS_CUOTAS, textoCuotas } from "@/config/cuotas";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";

const FAQ_PATH = "/faq";
const FAQ_TITLE = "Preguntas frecuentes: soporte, SENCE y empresas";
const FAQ_FULL_TITLE = tituloSeo(FAQ_TITLE);
const FAQ_DESCRIPTION =
  "Respuestas sobre metodología en vivo, proyectos finales, campus virtual, SENCE, medios de pago y capacitaciones para empresas en Chile.";
const FAQ_OG_IMAGE = ogImageUrl({
  kicker: "Soporte",
  title: "Preguntas frecuentes",
  description:
    "Metodología en vivo, proyectos finales, SENCE, medios de pago y capacitaciones para empresas.",
  path: "faq",
});

export const metadata: Metadata = {
  title: FAQ_TITLE,
  description: FAQ_DESCRIPTION,
  alternates: {
    canonical: absoluteUrl(FAQ_PATH),
    languages: hreflangDe(FAQ_PATH),
  },
  openGraph: {
    title: FAQ_FULL_TITLE,
    description: FAQ_DESCRIPTION,
    url: absoluteUrl(FAQ_PATH),
    type: "website",
    images: [
      {
        url: FAQ_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: FAQ_FULL_TITLE,
      },
    ],
  },
  twitter: twitterShare(FAQ_FULL_TITLE, FAQ_DESCRIPTION, FAQ_OG_IMAGE),
};

const FAQ_DATA = [
  {
    question: "¿Qué es ProgramBI y a quién va dirigido?",
    answer: "ProgramBI es la plataforma de capacitación profesional líder en análisis de datos, Power BI, SQL, Python y Machine Learning en Chile y Latinoamérica. Va dirigido a profesionales de administración, finanzas, ingeniería, logística y marketing que quieren automatizar sus tareas, armar dashboards profesionales y tomar decisiones basadas en datos.",
    category: "general"
  },
  {
    question: "¿Cuáles son los requisitos previos para hacer los cursos?",
    answer: "El Curso de Análisis de Datos parte desde cero absoluto, enseñando bases de datos antes de programar o diseñar. Para el curso de Power BI, se recomienda tener nociones básicas de Excel. Para el curso de Machine Learning, es aconsejable conocer sintaxis básica de Python.",
    category: "cursos"
  },
  {
    question: "¿Cómo funcionan el campus virtual y las clases?",
    answer: "Todas las clases online en vivo por Zoom se complementan con acceso al campus virtual con las clases y el material usado (datasets, scripts y guías) para que puedas practicar durante el curso.",
    category: "cursos"
  },
  {
    question: "¿Entregan un certificado al terminar?",
    answer: "Sí. Al completar satisfactoriamente los proyectos de cada módulo del curso, recibirás un certificado oficial digital emitido por ProgramBI SPA con firma del CEO Manuel Oliva y un código de verificación único para validación de empleadores y LinkedIn.",
    category: "general"
  },
  {
    question: "¿Tienen capacitaciones SENCE o Franquicia Tributaria en Chile?",
    answer: "No. En ProgramBI nos enfocamos al 100% en habilidades de aplicación corporativa real e inmediata. Al no operar bajo franquicia burocrática SENCE, podemos actualizar el temario mensualmente con últimas tecnologías (como Inteligencia Artificial aplicada), contratar instructores senior de primer nivel activos en la industria y ofrecer precios significativamente más competitivos.",
    category: "pagos"
  },
  {
    question: "¿Cómo funcionan los Capstone Projects o proyectos finales?",
    answer: "Cada curso finaliza con un proyecto final práctico donde aplicas las tecnologías del módulo a un set de datos corporativo real (por ejemplo, consolidación financiera, reportes de retail o predicción de churn). Estos proyectos te sirven para tu portafolio profesional en GitHub o Power BI Service.",
    category: "cursos"
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: `Aceptamos pagos a través de ${MEDIOS_CUOTAS.join(" y ")} (tarjetas de crédito y débito) y transferencias bancarias directas en pesos chilenos. En el checkout puedes pagar en ${textoCuotas(ISO_CHILE)} con ${MEDIOS_CUOTAS.join(" o ")}, según disponibilidad de la pasarela.`,
    category: "pagos"
  },
  {
    question: "¿Tienen opciones de pago en cuotas?",
    answer: `Sí. Todos los cursos se pueden pagar en ${textoCuotas(ISO_CHILE)} con ${MEDIOS_CUOTAS.join(" o ")}; la disponibilidad final por país la confirma la pasarela en el checkout.`,
    category: "pagos"
  },
  {
    question: "¿Ofrecen capacitaciones cerradas para empresas?",
    answer: "Sí, diseñamos planes de formación in-company adaptados a las necesidades y datos de tu empresa. Podemos dictar clases privadas y enfocarlas en resolver desafíos específicos de tu negocio. Escríbenos a través de nuestra sección de asesorías.",
    category: "empresa"
  },
  {
    question: "¿Cómo coordinar una asesoría de datos o consultoría a medida?",
    answer: "Puedes rellenar el formulario en nuestra sección de /empresas o contactarnos vía WhatsApp. Agendamos una reunión de diagnóstico gratuita de 30 minutos con nuestro CEO Manuel Oliva para evaluar el problema de tu empresa, el estado de tus datos y proponerte una solución.",
    category: "empresa"
  }
];

function preguntasDe(pais: string) {
  const contenido = getContenidoPais(pais);
  if (contenido) {
    return contenido.faqs.map((faq) => ({
      question: faq.q,
      answer: faq.a,
      category: faq.categoria,
    }));
  }
  if (pais === "cl") return FAQ_DATA;
  return FAQ_DATA.map((item) => {
    if (item.question.startsWith("¿Tienen capacitaciones SENCE")) {
      return {
        ...item,
        question: `¿Cómo se factura una capacitación en ${localizarMercado("Chile", pais)}?`,
        answer:
          "La facturación y las condiciones de la capacitación se confirman con el equipo de admisiones antes de la inscripción.",
      };
    }
    if (item.question.startsWith("¿Qué métodos de pago")) {
      return {
        ...item,
        answer: `El pago del curso se hace con ${MEDIOS_CUOTAS[0]} y puedes pagar en ${textoCuotas(pais)} con ${MEDIOS_CUOTAS.join(" o ")}, según disponibilidad de la pasarela en el checkout.`,
      };
    }
    return {
      ...item,
      question: localizarMercado(item.question, pais),
      answer: localizarMercado(item.answer, pais),
    };
  });
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ pais?: string }>;
}) {
  const pais = normalizarPais((await params).pais);
  const preguntas = preguntasDe(pais);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((item) => ({
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
      { "@type": "ListItem", position: 1, name: "Inicio", item: `https://www.programbi.com${rutaLocal(pais, "/") === "/" ? "" : rutaLocal(pais, "/")}` },
      { "@type": "ListItem", position: 2, name: "Preguntas Frecuentes", item: `https://www.programbi.com${rutaLocal(pais, "/faq")}` }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }}
      />

      <FaqClient faqItems={preguntas} />
    </>
  );
}
