import { miembroPorCurso } from "@/lib/data/equipo";
import { ilustracionDeGuia, palabrasDeGuia, tiempoLecturaMinutos } from "@/lib/guias/ilustraciones";
import { nombreCurso } from "@/lib/guias/opciones";
import { metaDescripcionGuia, resolverPrecios } from "@/lib/guias/precio";
import type { Guia } from "@/lib/guias/tipos";
import { CANONICAL_HOST, ORG_ID, WEBSITE_ID, absoluteUrl } from "@/lib/seo";
import { getPersonaJsonLd, idPersona } from "@/lib/seo/course-jsonld";

function externalCitations(sources: string[] | undefined) {
  if (!sources || sources.length === 0) return [];
  const urls: string[] = [];
  const seen = new Set<string>();

  for (const raw of sources) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    try {
      const parsed = new URL(trimmed);
      const host = parsed.hostname.toLowerCase();
      if (
        host === CANONICAL_HOST ||
        host === "programbi.com" ||
        host.endsWith(".programbi.com")
      ) {
        continue;
      }
      if (!seen.has(trimmed)) {
        seen.add(trimmed);
        urls.push(trimmed);
      }
    } catch {
      // Omit non-URL citation strings safely
    }
  }

  return urls.map((url) => ({
    "@type": "CreativeWork",
    url,
  }));
}

/**
 * Schema JSON-LD completo de cada guía:
 * - Article (con imagen 1280x720, author/reviewedBy Person real ligado por @id, wordCount, timeRequired y about)
 * - FAQPage (con precios limpios)
 * - BreadcrumbList
 * Nunca declara Course/Offer en guías (se reserva exclusivamente a /cursos/[slug]).
 */
export function buildGuiaJsonLd(
  guia: Guia,
  rutaIndice: string,
  nombreMercado: string,
  body: string
) {
  const canonical = absoluteUrl(guia.path);
  const ilustracion = ilustracionDeGuia(guia);
  const instructor = miembroPorCurso(guia.course === "general" ? "power-bi" : guia.course);
  const wordCount = palabrasDeGuia(body);
  const mins = tiempoLecturaMinutos(body);
  const faqs = guia.faqs.map((faq) => ({ q: faq.q, a: resolverPrecios(faq.a, guia) }));
  const topicName = guia.course === "general" ? "Analítica de datos e IA" : nombreCurso(guia.course);
  const citations = externalCitations(guia.sources);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonical}#article`,
        headline: guia.h1,
        description: metaDescripcionGuia(guia.description, 155),
        datePublished: guia.updated,
        dateModified: guia.updated,
        inLanguage: guia.lang,
        articleSection: nombreMercado,
        wordCount,
        timeRequired: `PT${mins}M`,
        about: {
          "@type": "Thing",
          name: topicName,
        },
        image: [
          {
            "@type": "ImageObject",
            url: absoluteUrl(ilustracion.src),
            width: ilustracion.width,
            height: ilustracion.height,
            caption: ilustracion.caption,
          },
        ],
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonical,
          isPartOf: { "@id": WEBSITE_ID },
          breadcrumb: { "@id": `${canonical}#breadcrumb` },
        },
        author: getPersonaJsonLd(instructor),
        reviewedBy: { "@id": idPersona(instructor.slug) },
        publisher: { "@id": ORG_ID },
        ...(citations.length > 0 ? { citation: citations } : {}),
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${canonical}#faq`,
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: absoluteUrl(guia.country === "cl" || guia.country === "transversal" ? "/" : `/${guia.country}`),
          },
          { "@type": "ListItem", position: 2, name: `Guías de ${nombreMercado}`, item: absoluteUrl(rutaIndice) },
          { "@type": "ListItem", position: 3, name: guia.h1, item: canonical },
        ],
      },
    ],
  };
}
