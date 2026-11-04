import Link from "next/link";
import GuiaCTA, { GuiaStickyCta } from "@/components/guias/GuiaCTA";
import GuiaMarkdown from "@/components/guias/GuiaMarkdown";
import { fechaActualizado, resolverPrecios } from "@/lib/guias/precio";
import type { Guia } from "@/lib/guias/tipos";
import { absoluteUrl, jsonLdString, SITE_URL } from "@/lib/seo";

type Props = {
  guia: Guia;
  /** Ruta del índice de guías del mercado (ej. /guias o /ar/guias). */
  rutaIndice: string;
  /** Nombre del mercado para el breadcrumb visible. */
  nombreMercado: string;
  /** Otras guías del mismo mercado, para el bloque de enlaces internos. */
  relacionadas: Guia[];
};

/**
 * Render de una guía: breadcrumb visible, H1, cuerpo Markdown con los CTA en
 * sus marcadores, FAQ visible (la misma del JSON-LD) y enlazado interno.
 *
 * El precio del placeholder `{{precio}}` sale de config/pricing.ts, así que el
 * texto publicado y el JSON-LD no pueden contradecir a la ficha.
 */
export default function GuiaPage({ guia, rutaIndice, nombreMercado, relacionadas }: Props) {
  const body = resolverPrecios(guia.body, guia);
  const canonical = absoluteUrl(guia.path);
  const actualizado = fechaActualizado(guia.updated);

  // El Markdown trae marcadores <!-- CTA-TOP|MID|END --> para intercalar los CTA.
  const partes = body.split(/<!--\s*CTA-(TOP|MID|END)\s*-->/g);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonical}#article`,
        headline: guia.h1,
        description: guia.description,
        inLanguage: guia.lang,
        datePublished: guia.updated,
        dateModified: guia.updated,
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        author: { "@type": "Organization", name: "ProgramBI", url: SITE_URL },
        publisher: { "@type": "Organization", name: "ProgramBI", url: SITE_URL },
      },
      ...(guia.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${canonical}#faq`,
              mainEntity: guia.faqs.map((faq) => ({
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
          { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl(guia.country === "cl" || guia.country === "transversal" ? "/" : `/${guia.country}`) },
          { "@type": "ListItem", position: 2, name: `Guías de ${nombreMercado}`, item: absoluteUrl(rutaIndice) },
          { "@type": "ListItem", position: 3, name: guia.h1, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <article className="bg-canvas px-4 pb-28 pt-10 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-[820px]">
          <nav aria-label="Migas de pan" className="text-xs text-mute">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={guia.country === "cl" || guia.country === "transversal" ? "/" : `/${guia.country}`} className="no-underline hover:text-ink">
                  Inicio
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={rutaIndice} className="no-underline hover:text-ink">
                  Guías
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink">{guia.h1}</li>
            </ol>
          </nav>

          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            {guia.h1}
          </h1>
          <p className="mt-3 text-sm text-faint">
            Actualizado el {actualizado} · Guía de ProgramBI
          </p>

          <div className="mt-8">
            {partes.map((parte, index) => {
              if (parte === "TOP" || parte === "MID" || parte === "END") {
                return (
                  <GuiaCTA
                    key={`cta-${parte}-${index}`}
                    variant={parte === "TOP" ? "top" : parte === "MID" ? "mid" : "end"}
                    iso={guia.country}
                    course={guia.course}
                    guiaSlug={guia.slug}
                  />
                );
              }
              if (!parte.trim()) return null;
              return <GuiaMarkdown key={`md-${index}`} content={parte} />;
            })}
          </div>

          {guia.faqs.length > 0 ? (
            <section aria-labelledby="faq-guia" className="mt-12 border-t border-line pt-8">
              <h2 id="faq-guia" className="text-2xl font-bold tracking-tight text-ink">
                Preguntas frecuentes
              </h2>
              <dl className="mt-6 space-y-6">
                {guia.faqs.map((faq) => (
                  <div key={faq.q}>
                    <dt className="font-semibold text-ink">{faq.q}</dt>
                    <dd className="mt-2 leading-relaxed text-mute">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {relacionadas.length > 0 ? (
            <nav aria-labelledby="otras-guias" className="mt-12 border-t border-line pt-8">
              <h2 id="otras-guias" className="text-lg font-bold tracking-tight text-ink">
                Otras guías de {nombreMercado}
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {relacionadas.map((otra) => (
                  <li key={otra.path}>
                    <Link href={otra.path} className="font-medium text-ink underline underline-offset-4">
                      {otra.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </article>
      <GuiaStickyCta iso={guia.country === "transversal" ? "cl" : guia.country} course={guia.course} />
    </>
  );
}
