import type { Metadata } from "next";
import Link from "next/link";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes — Soporte y Consultas | ProgramBI",
  description:
    "Resuelve tus dudas sobre los cursos de análisis de datos en vivo, metodologías, grabaciones de clases, certificados oficiales y asesorías corporativas de ProgramBI.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Preguntas Frecuentes — Soporte y Consultas | ProgramBI",
    description:
      "Información detallada sobre requisitos de cursos, certificaciones, cuotas de pago y capacitaciones corporativas en Latinoamérica.",
    url: "https://programbi.com/faq",
    type: "website",
  },
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
    question: "¿Las clases son grabadas? ¿Tengo acceso permanente?",
    answer: "Sí. Todas las clases online en vivo se graban y se cargan al portal LMS del alumno al día siguiente. Conservas el acceso de por vida a todas las grabaciones, códigos, sets de datos y diapositivas de tu curso para que repases cuando quieras.",
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
    answer: "Aceptamos pagos a través de Webpay (tarjetas de crédito, débito), transferencias bancarias directas nacionales y pagos internacionales mediante plataformas seguras como PayPal y Stripe.",
    category: "pagos"
  },
  {
    question: "¿Tienen opciones de pago en cuotas?",
    answer: "Sí. Puedes pagar con tus tarjetas de crédito bancarias en las cuotas que estimes conveniente según tu entidad bancaria. También contamos con convenios de cuotas directas por transferencia coordinando con nuestro equipo de admisiones.",
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
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://programbi.com" },
      { "@type": "ListItem", position: 2, name: "Preguntas Frecuentes", item: "https://programbi.com/faq" }
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
