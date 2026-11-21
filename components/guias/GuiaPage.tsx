import Image from "next/image";
import Link from "next/link";
import Bloque30Segundos from "@/components/guias/Bloque30Segundos";
import CursoShowcaseGuia from "@/components/guias/CursoShowcaseGuia";
import ElementoVisual, { elegirVariante } from "@/components/guias/ElementoVisual";
import FuentesGuia from "@/components/guias/FuentesGuia";
import GuiaCTA from "@/components/guias/GuiaCTA";
import GuiaCursoLateral from "@/components/guias/GuiaCursoLateral";
import {
  GuiaBreadcrumbs,
  GuiaFaqList,
  GuiaScope,
} from "@/components/guias/GuiaEditorialPrimitives";
import GuiaMarkdown from "@/components/guias/GuiaMarkdown";
import GuiaStickyCta from "@/components/guias/GuiaStickyCta";
import { IndiceGuiaMobile, IndiceGuiaNav } from "@/components/guias/IndiceGuia";
import RutaAprendizaje from "@/components/guias/RutaAprendizaje";
import TablaComparativa from "@/components/guias/TablaComparativa";
import { filasComparativa } from "@/components/guias/comparativa";
import { encabezadosVisibles } from "@/components/guias/indice";
import { ISO_CHILE } from "@/config/paises";
import { miembroPorCurso, rutaPerfil } from "@/lib/data/equipo";
import { fichaCurso } from "@/lib/guias/curso";
import { proximoInicioDeCurso } from "@/lib/guias/inicio";
import { ilustracionDeGuia, tiempoLecturaMinutos } from "@/lib/guias/ilustraciones";
import { buildGuiaJsonLd } from "@/lib/guias/jsonld";
import { nombreCurso } from "@/lib/guias/opciones";
import { fechaActualizado, resolverPrecios, resolverPreciosFaq } from "@/lib/guias/precio";
import type { Guia } from "@/lib/guias/tipos";
import { courseBrochurePath } from "@/lib/pricing-gate";
import { jsonLdString } from "@/lib/seo";
import { getActivePromotions } from "@/lib/supabase/comunidad-ai";

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
 * Render de una guía: breadcrumb, H1 editorial, bloque «En 30 segundos»
 * renderizado en servidor, cuerpo Markdown con CTA en sus marcadores, ruta de
 * aprendizaje, FAQ visible (la misma del JSON-LD), fuentes y enlazado interno.
 */
export default async function GuiaPage({ guia, rutaIndice, nombreMercado, relacionadas }: Props) {
  const [inicio, promotions] = await Promise.all([
    proximoInicioDeCurso(guia.course),
    getActivePromotions(),
  ]);
  const iso = guia.country === "transversal" ? ISO_CHILE : guia.country;
  const brochureHref = guia.course === "general" ? undefined : courseBrochurePath(guia.course, iso);
  const body = resolverPrecios(guia.body, guia, promotions).replace(/^#\s+.*\n+/, "");
  const actualizado = fechaActualizado(guia.updated);
  const encabezados = encabezadosVisibles(body);
  const faqs = guia.faqs.map((faq) => ({
    q: resolverPreciosFaq(faq.q, guia, promotions),
    a: resolverPreciosFaq(faq.a, guia, promotions),
  }));
  const ficha = fichaCurso(guia.course);
  const esCursoConocido = ficha.horas != null;
  const variante = elegirVariante(guia);
  const ilustracion = ilustracionDeGuia(guia);
  const lecturaMin = tiempoLecturaMinutos(body);
  const instructor = miembroPorCurso(guia.course === "general" ? "power-bi" : guia.course);
  const cursoEtiqueta = guia.course === "general" ? "Guía práctica" : nombreCurso(guia.course);
  const conLateral = guia.course !== "general";

  const partes = body.split(/<!--\s*CTA-(TOP|MID|END)\s*-->/g);
  const jsonLd = buildGuiaJsonLd(guia, rutaIndice, nombreMercado, body, promotions);
  const inicioHref = guia.country === "cl" || guia.country === "transversal" ? "/" : `/${guia.country}`;

  return (
    <GuiaScope>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <article className="px-4 pb-28 pt-10 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-[1280px]">
          <GuiaBreadcrumbs
            items={[
              { label: "Inicio", href: inicioHref },
              { label: "Guías", href: rutaIndice },
              { label: guia.h1 },
            ]}
          />

          <div
            className={`mt-6 lg:grid lg:gap-10 ${
              conLateral
                ? "lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(0,68ch)_280px] xl:justify-between"
                : "lg:grid-cols-[200px_minmax(0,68ch)] lg:gap-12"
            }`}
          >
            <div className="min-w-0 max-w-[68ch] lg:col-start-2 lg:row-start-1">
              <h1 className="text-[clamp(1.85rem,3.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--g-ink)]">
                {guia.h1}
              </h1>

              <p className="mt-3 text-xs tabular-nums text-[var(--g-subtle)]">
                {cursoEtiqueta} · {lecturaMin} min de lectura · Actualizado el {actualizado} · {nombreMercado}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--g-muted)]">
                {instructor.imageUrl ? (
                  <Image
                    src={instructor.imageUrl}
                    alt={instructor.nombre}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border border-[var(--g-border)] object-cover object-[center_18%]"
                  />
                ) : null}
                <span>
                  Revisado por{" "}
                  <Link
                    href={rutaPerfil(instructor.slug)}
                    className="font-semibold text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-4 hover:decoration-[var(--g-accent)]"
                  >
                    {instructor.nombre}
                  </Link>{" "}
                  · {instructor.cargo}
                </span>
              </div>

              <figure className="mt-6 overflow-hidden rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)]">
                <Image
                  src={ilustracion.src}
                  alt={ilustracion.alt}
                  width={ilustracion.width}
                  height={ilustracion.height}
                  preload={true}
                  sizes="(max-width: 1024px) calc(100vw - 32px), 680px"
                  className="aspect-video h-auto w-full object-cover"
                />
                <figcaption className="border-t border-[var(--g-border)] bg-[var(--g-wash)] px-4 py-2 text-xs text-[var(--g-muted)]">
                  {ilustracion.caption}
                </figcaption>
              </figure>

              <Bloque30Segundos guia={guia} inicio={inicio} promotions={promotions} />

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
                        inicio={inicio}
                      />
                    );
                  }
                  if (!parte.trim()) return null;
                  return <GuiaMarkdown key={`md-${index}`} content={parte} />;
                })}
              </div>

              <CursoShowcaseGuia courseSlug={guia.course} iso={iso} guiaSlug={guia.slug} inicio={inicio} />

              {variante !== "ruta" ? <RutaAprendizaje iso={iso} cursoActual={guia.course} /> : null}

              {esCursoConocido ? (
                <TablaComparativa
                  filas={filasComparativa(guia.course)}
                  brochureHref={brochureHref}
                  nota="Comparación cualitativa: no incluye precios de terceros. El precio del curso en vivo sale de la lista vigente de ProgramBI."
                />
              ) : null}

              {faqs.length > 0 ? (
                <div id="faq-guia" className="mt-12 border-t border-[var(--g-border)] pt-8">
                  <GuiaFaqList
                    heading="Preguntas frecuentes"
                    items={faqs.map((faq, idx) => ({
                      id: `faq-${idx}`,
                      question: faq.q,
                      answer: faq.a,
                    }))}
                  />
                </div>
              ) : null}

              <FuentesGuia sources={guia.sources} updated={guia.updated} />

              {relacionadas.length > 0 ? (
                <nav aria-labelledby="otras-guias" className="mt-12 border-t border-[var(--g-border)] pt-8">
                  <h2 id="otras-guias" className="text-lg font-bold tracking-tight text-[var(--g-ink)]">
                    Sigue con estas guías de {nombreMercado}
                  </h2>
                  <ol className="mt-4 divide-y divide-[var(--g-border)] border-y border-[var(--g-border)]">
                    {relacionadas.slice(0, 6).map((otra, idx) => (
                      <li key={otra.path}>
                        <Link
                          href={otra.path}
                          className="flex min-h-[44px] items-baseline gap-3 px-2 py-3 text-sm font-medium text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-surface)] hover:text-[var(--g-accent)]"
                        >
                          <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-[var(--g-subtle)]">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span>{otra.h1}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}
            </div>

            <div className="hidden lg:col-start-1 lg:row-start-1 lg:block">
              <IndiceGuiaNav items={encabezados} />
            </div>

            {conLateral ? (
              <div className="hidden xl:col-start-3 xl:row-start-1 xl:block">
                <GuiaCursoLateral
                  iso={iso}
                  course={guia.course}
                  inicio={inicio}
                  promotions={promotions}
                  guiaSlug={guia.slug}
                />
              </div>
            ) : null}
          </div>
        </div>
      </article>
      <GuiaStickyCta iso={iso} course={guia.course} guiaSlug={guia.slug} />
    </GuiaScope>
  );
}
