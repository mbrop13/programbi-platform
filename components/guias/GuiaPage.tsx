import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import Bloque30Segundos from "@/components/guias/Bloque30Segundos";
import CursoShowcaseGuia from "@/components/guias/CursoShowcaseGuia";
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
import { miembroPorCurso, rutaPerfil } from "@/lib/data/equipo";
import { fichaCurso } from "@/lib/guias/curso";
import { ilustracionDeGuia, tiempoLecturaMinutos } from "@/lib/guias/ilustraciones";
import { buildGuiaJsonLd } from "@/lib/guias/jsonld";
import { nombreCurso } from "@/lib/guias/opciones";
import { fechaActualizado, resolverPrecios } from "@/lib/guias/precio";
import type { Guia } from "@/lib/guias/tipos";
import { courseBrochurePath } from "@/lib/pricing-gate";
import { jsonLdString } from "@/lib/seo";

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
  const actualizado = fechaActualizado(guia.updated);
  const encabezados = encabezadosVisibles(body);
  const faqs = guia.faqs.map((faq) => ({ q: faq.q, a: resolverPrecios(faq.a, guia) }));
  const ficha = fichaCurso(guia.course);
  const esCursoConocido = ficha.horas != null;
  const variante = elegirVariante(guia);
  const ilustracion = ilustracionDeGuia(guia);
  const lecturaMin = tiempoLecturaMinutos(body);
  const instructor = miembroPorCurso(guia.course === "general" ? "power-bi" : guia.course);
  const cursoEtiqueta = guia.course === "general" ? "Guía práctica" : nombreCurso(guia.course);

  // El Markdown trae marcadores <!-- CTA-TOP|MID|END --> para intercalar los CTA.
  const partes = body.split(/<!--\s*CTA-(TOP|MID|END)\s*-->/g);

  // Las guías declaran Article + FAQPage + BreadcrumbList (nunca Course/Offer:
  // eso vive solo en la ficha del curso, para no duplicar el Course en 113 URLs).
  const jsonLd = buildGuiaJsonLd(guia, rutaIndice, nombreMercado, body);

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
            <div className="min-w-0 max-w-[760px] lg:col-start-2 lg:row-start-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-paper px-3 py-1 font-bold uppercase tracking-[0.12em] text-ink">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: ficha.accentColor }}
                    aria-hidden="true"
                  />
                  {cursoEtiqueta}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-wash px-2.5 py-1 font-medium text-mute">
                  <Clock size={12} aria-hidden /> {lecturaMin} min de lectura
                </span>
                <span className="text-faint">Actualizado el {actualizado} · {nombreMercado}</span>
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                {guia.h1}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-mute">
                {instructor.imageUrl ? (
                  <Image
                    src={instructor.imageUrl}
                    alt={instructor.nombre}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border border-line object-cover object-[center_18%]"
                  />
                ) : null}
                <span>
                  Revisado por{" "}
                  <Link href={rutaPerfil(instructor.slug)} className="font-semibold text-ink underline underline-offset-4">
                    {instructor.nombre}
                  </Link>{" "}
                  · {instructor.cargo}
                </span>
              </div>

              <figure className="mt-6 overflow-hidden rounded-[24px] border border-line-strong bg-paper shadow-sm">
                <Image
                  src={ilustracion.src}
                  alt={ilustracion.alt}
                  width={ilustracion.width}
                  height={ilustracion.height}
                  preload={true}
                  sizes="(max-width: 1024px) calc(100vw - 32px), 760px"
                  className="aspect-video h-auto w-full object-cover"
                />
                <figcaption className="border-t border-line bg-wash/60 px-4 py-2 text-xs text-mute">
                  {ilustracion.caption}
                </figcaption>
              </figure>

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

              <CursoShowcaseGuia courseSlug={guia.course} iso={iso} guiaSlug={guia.slug} />

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

            <div className="hidden lg:col-start-1 lg:row-start-1 lg:block">
              <IndiceGuiaNav items={encabezados} />
            </div>
          </div>
        </div>
      </article>
      <GuiaStickyCta iso={iso} course={guia.course} />
    </>
  );
}
