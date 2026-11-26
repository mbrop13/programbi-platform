import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Bloque30Segundos from "@/components/guias/Bloque30Segundos";
import CursoShowcaseGuia from "@/components/guias/CursoShowcaseGuia";
import ElementoVisual, { elegirVariante } from "@/components/guias/ElementoVisual";
import FuentesGuia from "@/components/guias/FuentesGuia";
import GuiaCTA from "@/components/guias/GuiaCTA";
import GuiaCursoLateral from "@/components/guias/GuiaCursoLateral";
import {
  GuiaBreadcrumbs,
  GuiaFaqList,
  GuiaReadingProgress,
  GuiaScope,
  GuiaToolVisual,
  GuiaVisualBadge,
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
import { ilustracionDeGuia, tiempoLecturaMinutos } from "@/lib/guias/ilustraciones";
import { proximoInicioDeCurso } from "@/lib/guias/inicio";
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
 * Render de una guía: barra de progreso, Hero Card editorial con ilustración,
 * bloque «Resumen en 30 segundos» renderizado en servidor, cuerpo Markdown con
 * CTA en sus marcadores, ruta de aprendizaje, FAQ visible (la misma del
 * JSON-LD), fuentes y tarjetas de enlazado interno.
 */
export default async function GuiaPage({ guia, rutaIndice, nombreMercado, relacionadas }: Props) {
  const [inicio, promotionsRaw] = await Promise.all([
    proximoInicioDeCurso(guia.course),
    getActivePromotions(),
  ]);
  const iso = guia.country === "transversal" ? ISO_CHILE : guia.country;
  const promotions = iso === ISO_CHILE ? promotionsRaw : [];
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
  const tieneIlustracion = Boolean(ilustracion?.src);
  const lecturaMin = tiempoLecturaMinutos(body);
  const instructor = miembroPorCurso(guia.course === "general" ? "power-bi" : guia.course);
  const cursoEtiqueta = guia.course === "general" ? "Guía práctica" : nombreCurso(guia.course);
  const conLateral = guia.course !== "general";

  const partes = body.split(/<!--\s*CTA-(TOP|MID|END)\s*-->/g);
  const jsonLd = buildGuiaJsonLd(guia, rutaIndice, nombreMercado, body, promotions);
  const inicioHref = guia.country === "cl" || guia.country === "transversal" ? "/" : `/${guia.country}`;

  return (
    <GuiaScope>
      <GuiaReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <article className="pb-28 pt-8 lg:pb-20 lg:pt-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div
            className={`lg:grid lg:items-start lg:gap-10 xl:gap-14 ${
              conLateral
                ? "lg:grid-cols-[336px_minmax(0,1fr)] xl:grid-cols-[376px_minmax(0,1fr)]"
                : "lg:grid-cols-[240px_minmax(0,1fr)]"
            }`}
          >
            <div className="min-w-0 max-w-[900px] lg:col-start-2 lg:row-start-1">
              <header
                className={`overflow-hidden rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] shadow-[var(--g-card-shadow)] ${
                  tieneIlustracion ? "lg:grid lg:grid-cols-12" : ""
                }`}
              >
                <div
                  className={`flex flex-col justify-between p-6 sm:p-8 ${
                    tieneIlustracion ? "lg:col-span-7" : ""
                  }`}
                >
                  <div>
                    <GuiaBreadcrumbs
                      items={[
                        { label: "Inicio", href: inicioHref },
                        { label: "Guías", href: rutaIndice },
                        { label: guia.h1 },
                      ]}
                    />

                    <h1 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.03em] text-[var(--g-ink)]">
                      {guia.h1}
                    </h1>

                    {guia.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-[var(--g-muted)] sm:text-base">
                        {guia.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <GuiaToolVisual tool={guia.course} course={guia.course} size="sm" />
                      <GuiaVisualBadge tone="accent">{cursoEtiqueta}</GuiaVisualBadge>
                      <GuiaVisualBadge tone="neutral">{nombreMercado}</GuiaVisualBadge>
                      <GuiaVisualBadge tone="neutral" className="tabular-nums">
                        {lecturaMin} min de lectura
                      </GuiaVisualBadge>
                      <GuiaVisualBadge tone="neutral" className="tabular-nums">
                        Actualizado el {actualizado}
                      </GuiaVisualBadge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-[var(--g-border)] pt-4 text-xs text-[var(--g-muted)]">
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
                  </div>
                </div>

                {tieneIlustracion ? (
                  <figure className="flex flex-col justify-between border-t border-[var(--g-border)] bg-[var(--g-wash)] lg:col-span-5 lg:border-l lg:border-t-0">
                    <div className="flex flex-1 items-center justify-center p-4 sm:p-5">
                      <div className="w-full overflow-hidden rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] shadow-[var(--g-card-shadow)]">
                        <Image
                          src={ilustracion.src}
                          alt={ilustracion.alt}
                          width={ilustracion.width}
                          height={ilustracion.height}
                          preload={true}
                          sizes="(max-width: 1024px) calc(100vw - 64px), 360px"
                          className="aspect-video h-auto w-full object-cover"
                        />
                      </div>
                    </div>
                    <figcaption className="border-t border-[var(--g-border)] bg-[var(--g-wash)] px-4 py-2.5 text-xs leading-relaxed text-[var(--g-muted)]">
                      {ilustracion.caption}
                    </figcaption>
                  </figure>
                ) : null}
              </header>

              {guia.slug === "curso-claude-chile" ? (
                <div
                  data-testid="guia-claude-cta-oficial"
                  className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--g-border-strong)] bg-[var(--g-surface)] p-5 shadow-[var(--g-card-shadow)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <p className="text-sm font-medium leading-relaxed text-[var(--g-ink)] sm:text-base">
                    La inscripción y el temario oficial están en la ficha del curso de Claude en Chile.
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
                    <Link
                      href="/cursos/claude"
                      className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--g-ink)] px-5 text-sm font-semibold text-[var(--g-surface)] no-underline transition-opacity hover:opacity-90"
                    >
                      Ver ficha oficial de inscripción
                    </Link>
                    <Link
                      href="/cursos/claude#inscripcion"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--g-border-strong)] bg-[var(--g-wash)] px-4 text-sm font-semibold text-[var(--g-ink)] no-underline hover:opacity-90"
                    >
                      Temario y precios
                    </Link>
                  </div>
                </div>
              ) : null}

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
                        ctaPosition={parte === "TOP" ? "guia_top" : parte === "MID" ? "guia_mid" : "guia_end"}
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
                  <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {relacionadas.slice(0, 6).map((otra, idx) => (
                      <li key={otra.path}>
                        <Link
                          href={otra.path}
                          className="group flex h-full min-h-[44px] items-start justify-between gap-3 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-4 no-underline shadow-[var(--g-card-shadow)] transition-all hover:-translate-y-0.5 hover:border-[var(--g-border-strong)] hover:shadow-[var(--g-card-shadow-hover)]"
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <GuiaToolVisual tool={otra.course} course={otra.course} size="sm" className="mt-0.5" />
                            <div className="min-w-0">
                              <span className="font-mono text-[11px] font-semibold tabular-nums text-[var(--g-subtle)]">
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              <span className="mt-0.5 block text-sm font-semibold leading-snug text-[var(--g-ink)] group-hover:text-[var(--g-accent)]">
                                {otra.h1}
                              </span>
                            </div>
                          </div>
                          <ArrowUpRight
                            size={15}
                            aria-hidden
                            className="mt-1 shrink-0 text-[var(--g-subtle)] transition-colors group-hover:text-[var(--g-accent)]"
                          />
                        </Link>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}
            </div>

            <div className="hidden lg:sticky lg:top-24 lg:col-start-1 lg:row-start-1 lg:flex lg:max-h-[calc(100vh-7rem)] lg:flex-col lg:gap-6 lg:overflow-y-auto lg:pr-1">
              {conLateral ? (
                <GuiaCursoLateral
                  iso={iso}
                  course={guia.course}
                  inicio={inicio}
                  promotions={promotions}
                  guiaSlug={guia.slug}
                  sticky={false}
                />
              ) : null}
              {encabezados.length >= 3 ? (
                <div className={conLateral ? "border-t border-[var(--g-border)] pt-5" : undefined}>
                  <IndiceGuiaNav items={encabezados} sticky={false} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </article>
      <GuiaStickyCta iso={iso} course={guia.course} guiaSlug={guia.slug} />
    </GuiaScope>
  );
}
