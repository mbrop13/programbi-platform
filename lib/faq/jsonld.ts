import { ORG_ID, SITE_URL, WEBSITE_ID, absoluteUrl } from "@/lib/seo";
import { preguntasDe, type FaqContenido } from "@/lib/faq/contenido";

/**
 * JSON-LD de la página de preguntas frecuentes.
 *
 * Nodos: FAQPage (todas las preguntas visibles, con el mismo texto que se
 * muestra), BreadcrumbList y Organization. Sin Course ni Offer: los precios
 * son datos de la página, no una oferta del curso, y repetirlos como Offer
 * ensucia la declaración de precios del catálogo.
 *
 * La Organization se declara por `@id` (el mismo que emite RootShell), así el
 * grafo cierra sin duplicar la entidad.
 */
export function faqJsonLd(contenido: FaqContenido) {
  const url = absoluteUrl(contenido.path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url,
        name: contenido.h1,
        description: contenido.intro[0],
        inLanguage: contenido.pais.idioma,
        dateModified: contenido.actualizadoIso,
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORG_ID },
        mainEntity: preguntasDe(contenido).map((item) => ({
          "@type": "Question",
          "@id": `${url}#${item.id}`,
          name: item.pregunta,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.respuesta,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: absoluteUrl(contenido.inicioHref),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Preguntas frecuentes",
            item: url,
          },
        ],
      },
      {
        "@type": ["Organization", "EducationalOrganization"],
        "@id": ORG_ID,
        name: "ProgramBI",
        legalName: "ProgramBI SPA",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/images/logo.png`,
          width: 600,
          height: 160,
        },
        sameAs: [
          "https://www.instagram.com/programbi_capacitaciones/",
          "https://www.tiktok.com/@programbi",
          "https://cl.linkedin.com/company/programbi",
          "https://www.youtube.com/@ProgramBi",
        ],
      },
    ],
  };
}
