import Link from "next/link";
import Bloque30Segundos from "@/components/guias/Bloque30Segundos";
import ElementoVisual, { elegirVariante } from "@/components/guias/ElementoVisual";
import FuentesGuia from "@/components/guias/FuentesGuia";
import GuiaCTA from "@/components/guias/GuiaCTA";
import GuiaStickyCta from "@/components/guias/GuiaStickyCta";
import GuiaMarkdown from "@/components/guias/GuiaMarkdown";
import { IndiceGuiaMobile, IndiceGuiaNav } from "@/components/guias/IndiceGuia";
import RutaAprendizaje from "@/components/guias/RutaAprendizaje";
import TablaComparativa from "@/components/guias/TablaComparativa";
import { filasComparativa } from "@/components/guias/comparativa";
import { encabezadosVisibles } from "@/components/guias/indice";
import { ISO_CHILE } from "@/config/paises";
import { fichaCurso } from "@/lib/guias/curso";
import { fechaActualizado, resolverPrecios, sinMontosDeCurso } from "@/lib/guias/precio";
import type { Guia } from "@/lib/guias/tipos";
import { courseBrochurePath } from "@/lib/pricing-gate";
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
 * Render de una guía: breadcrumb, H1, bloque «En 30 segundos» renderizado en
 * servidor, cuerpo Markdown con los CTA en sus marcadores, ruta de
 * aprendizaje, FAQ visible (la misma del JSON-LD), fuentes y enlazado interno.
 *
 * El precio sale de config/pricing.ts, así que el texto publicado y el JSON-LD
 * no pueden contradecir a la ficha.
 */
export default function GuiaPage({ guia, rutaIndice, nombreMercado, relacionadas }: Props) {
  const iso = guia.country === "transversal" ? ISO_CHILE : guia.country;
  const brochureHref = guia.course === "general" ? undefined : courseBrochurePath(guia.course, iso);
  const body = resolverPrecios(guia.body, guia)
    // El cuerpo repite el H1 del frontmatter: se quita para no duplicar el H1.
    .replace(/^#\s+.*\n+/, "");
  const canonical = absoluteUrl(guia.path);
  const actualizado = fechaActualizado(guia.updated);
  const encabezados = encabezadosVisibles(body);
  const faqs = guia.faqs.map((faq) => ({ q: faq.q, a: resolverPrecios(faq.a, guia) }));
  const ficha = fichaCurso(guia.course);
  const esCursoConocido = ficha.horas != null;
  const variante = elegirVariante(guia);

  // El Markdown trae marcadores <!-- CTA-TOP|MID|END --> para intercalar los CTA.
  const partes = body.split(/<!--\s*CTA-(TOP|MID|END)\s*-->/g);

  // Las guías declaran Article + FAQPage + BreadcrumbList (nunca Course/Offer:
  // eso vive solo en la ficha del curso, para no duplicar el Course en 113 URLs).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonical}#article`,
        headline: guia.h1,
        description: sinMontosDeCurso(guia.description),
        inLanguage: guia.lang,
        datePublished: guia.updated,
        dateModified: guia.updated,
        articleSection: nombreMercado,
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        author: { "@type": "Organization", name: "ProgramBI", url: SITE_URL },
        publisher: { "@type": "Organization", name: "ProgramBI", url: SITE_URL },
        ...(guia.sources && guia.sources.length > 0 ? { citation: guia.sources } : {}),
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <article className="bg-canvas px-4 pb-28 pt-10 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-[1120px]">
          <nav aria-label="Migas de pan" className="text-xs text-mute">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link
                  href={guia.country === "cl" || guia.country === "transversal" ? "/" : `/${guia.country}`}
                  className="no-underline hover:text-ink"
                >
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

          <div className="mt-6 lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
            <div className="min-w-0 max-w-[760px]">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">{guia.h1}</h1>
              <p className="mt-3 text-sm text-faint">
                Actualizado el {actualizado} · Guía de ProgramBI · {nombreMercado}
              </p>

              <Bloque30Segundos guia={guia} />

              <IndiceGuiaMobile items={encabezados} />

              <ElementoVisual guia={guia} />

              <div className="mt-8">
                {partes.map((parte, index) => {
                  if (parte === "TOP" || parte === "MID" || parte === "END") {
                    return (
                      <GuiaCTA
                        key={`cta-${parte}-${index}`}
                        variant={parte === "TOP" ? "top" : parte === "MID" ? "mid" : "end"}
                        iso={iso}
                        course={guia.course}
                        guiaSlug={guia.slug}
                      />
                    );
                  }
                  if (!parte.trim()) return null;
                  return <GuiaMarkdown key={`md-${index}`} content={parte} />;
                })}
              </div>

              {variante !== "ruta" ? <RutaAprendizaje iso={iso} cursoActual={guia.course} /> : null}

              {esCursoConocido ? (
                <TablaComparativa
                  filas={filasComparativa(guia.course)}
                  brochureHref={brochureHref}
                  nota="Comparación cualitativa: no incluye precios de terceros. El precio del curso en vivo sale de la lista vigente de ProgramBI."
                />
              ) : null}

              {faqs.length > 0 ? (
                <section aria-labelledby="faq-guia" className="mt-12 border-t border-line pt-8">
                  <h2 id="faq-guia" className="text-2xl font-bold tracking-tight text-ink">
                    Preguntas frecuentes
                  </h2>
                  <dl className="mt-6 space-y-5">
                    {faqs.map((faq) => (
                      <div key={faq.q} className="rounded-2xl border border-line bg-paper px-4 py-3">
                        <dt className="text-sm font-semibold text-ink">{faq.q}</dt>
                        <dd className="mt-1.5 text-sm leading-relaxed text-mute">{faq.a}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}

              <FuentesGuia sources={guia.sources} updated={guia.updated} />

              {relacionadas.length > 0 ? (
                <nav aria-labelledby="otras-guias" className="mt-12 border-t border-line pt-8">
                  <h2 id="otras-guias" className="text-lg font-bold tracking-tight text-ink">
                    Sigue con estas guías de {nombreMercado}
                  </h2>
                  <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {relacionadas.slice(0, 6).map((otra) => (
                      <li key={otra.path}>
                        <Link
                          href={otra.path}
                          className="block rounded-xl border border-line bg-paper px-4 py-3 text-sm font-medium text-ink no-underline transition-colors hover:border-ink/25"
                        >
                          {otra.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}
            </div>

            <div className="hidden lg:order-first lg:block">
              <IndiceGuiaNav items={encabezados} />
            </div>
          </div>
        </div>
      </article>
      <GuiaStickyCta iso={iso} course={guia.course} />
    </>
  );
}
