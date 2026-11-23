import Link from "next/link";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import CapturaPendiente from "@/components/guias/CapturaPendiente";
import {
  GuiaBreadcrumbs,
  GuiaEditorialNote,
  GuiaReadingProgress,
  GuiaScope,
  GuiaToolVisual,
  GuiaVisualBadge,
} from "@/components/guias/GuiaEditorialPrimitives";
import GuiaPasoAPasoCodeBlock from "@/components/guias/GuiaPasoAPasoCodeBlock";
import GuiaPasoAPasoCursoCard from "@/components/guias/GuiaPasoAPasoCursoCard";
import GuiaPasoAPasoFaq from "@/components/guias/GuiaPasoAPasoFaq";
import GuiaPasoAPasoRuta from "@/components/guias/GuiaPasoAPasoRuta";
import GuiaPasoAPasoStickyWa from "@/components/guias/GuiaPasoAPasoStickyWa";
import {
  GuiaPasoAPasoTocDesktop,
  GuiaPasoAPasoTocMobile,
  GuiaPasoProgressWidget,
  GuiaPasoStepHeader,
  type ItemTocPasoAPaso,
} from "@/components/guias/GuiaPasoAPasoToc";
import { datosCursoParaGuia } from "@/lib/guias/paso-a-paso-curso";
import {
  jsonLdDeGuiaPasoAPaso,
  tiempoLecturaPasoAPaso,
} from "@/lib/guias/paso-a-paso-seo";
import type { GuiaPasoAPaso, TablaGuia } from "@/lib/guias/paso-a-paso-tipos";
import { fechaActualizado } from "@/lib/guias/precio";
import { jsonLdString } from "@/lib/seo";

export interface RelacionadaResumen {
  slug: string;
  h1: string;
  subtitle?: string;
  herramienta?: string;
  nivel?: string;
}

function TablaRender({ tabla }: { tabla: TablaGuia }) {
  return (
    <div className="guias-table-wrap my-6 overflow-x-auto rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] shadow-[var(--g-card-shadow)]">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        {tabla.caption ? (
          <caption className="border-b border-[var(--g-border)] bg-[var(--g-wash)] px-4 py-2.5 text-left text-xs font-semibold text-[var(--g-muted)]">
            {tabla.caption}
          </caption>
        ) : null}
        <thead>
          <tr className="border-b border-[var(--g-border-strong)] bg-[var(--g-wash)]">
            {tabla.encabezados.map((enc, idx) => (
              <th
                key={`${enc}-${idx}`}
                scope="col"
                className="px-4 py-2.5 text-xs font-semibold text-[var(--g-ink)]"
              >
                {enc}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--g-border)]">
          {tabla.filas.map((fila, rIdx) => (
            <tr key={rIdx} className="transition-colors hover:bg-[var(--g-wash)]/50">
              {fila.map((celda, cIdx) => (
                <td
                  key={cIdx}
                  className={`px-4 py-2.5 align-top leading-relaxed ${
                    cIdx === 0 ? "font-semibold text-[var(--g-ink)]" : "text-[var(--g-muted)]"
                  }`}
                >
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function construirToc(guia: GuiaPasoAPaso): ItemTocPasoAPaso[] {
  const items: ItemTocPasoAPaso[] = [
    { id: "lo-que-necesitas", texto: "Lo que necesitas", nivel: 2 },
  ];
  for (const sec of guia.secciones) {
    items.push({ id: sec.id, texto: sec.titulo, nivel: 2 });
    if (sec.subsecciones) {
      for (const sub of sec.subsecciones) {
        items.push({ id: sub.id, texto: sub.titulo, nivel: 3 });
      }
    }
  }
  if (guia.erroresComunes.length > 0) {
    items.push({ id: "errores-comunes", texto: "Errores comunes", nivel: 2 });
  }
  items.push({ id: "descarga-plantilla", texto: "Plantilla descargable", nivel: 2 });
  if (guia.faqs.length > 0) {
    items.push({ id: "preguntas-frecuentes", texto: "Preguntas frecuentes", nivel: 2 });
  }
  return items;
}

const AVISO_PRIVACIDAD_ESTANDAR =
  "No subas datos personales ni sensibles (RUT, sueldos con nombre, correos o bases reales de clientes) a herramientas de IA sin un contrato empresarial aprobado. Anonimiza nombres, reemplaza identificadores por códigos ficticios y trabaja sobre muestras agregadas.";

export default function GuiaPasoAPasoLayout({
  guia,
  relacionadasMap,
}: {
  guia: GuiaPasoAPaso;
  relacionadasMap: Record<string, RelacionadaResumen>;
}) {
  const curso = datosCursoParaGuia(guia.curso);
  const cursoSecundarioData = guia.cursoSecundario
    ? datosCursoParaGuia(guia.cursoSecundario)
    : null;
  const cursoSecundario = cursoSecundarioData
    ? { slug: cursoSecundarioData.slug, nombre: cursoSecundarioData.nombre }
    : null;
  const lecturaMin = tiempoLecturaPasoAPaso(guia);
  const actualizado = fechaActualizado(guia.updated);
  const tocItems = construirToc(guia);
  const stepIds = guia.secciones.map((s) => s.id);
  const jsonLd = jsonLdDeGuiaPasoAPaso(guia);

  return (
    <GuiaScope>
      <GuiaReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <article className="pb-24 pt-8 lg:pb-16 lg:pt-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="lg:grid lg:grid-cols-[336px_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[376px_minmax(0,1fr)] xl:gap-14">
            {/* Columna principal editorial */}
            <div className="min-w-0 max-w-[840px] lg:col-start-2 lg:row-start-1">
              {/* Hero Card visual de la guía */}
              <header className="rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-6 shadow-[var(--g-card-shadow)] sm:p-8 lg:p-9">
                <GuiaBreadcrumbs
                  items={[
                    { label: "Inicio", href: "/" },
                    { label: "Guías", href: "/guias" },
                    { label: curso.nombre, href: `/cursos/${guia.curso}` },
                    { label: guia.h1 },
                  ]}
                />

                <h1 className="mt-5 text-[clamp(1.85rem,3.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--g-ink)]">
                  {guia.h1}
                </h1>

                <p className="mt-4 max-w-[72ch] text-base leading-[1.65] text-[var(--g-muted)] sm:text-lg">
                  {guia.subtitle}
                </p>

                {/* Tira de metadatos visuales */}
                <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-[var(--g-border)] pt-4">
                  <div className="flex items-center gap-2">
                    <GuiaToolVisual tool={guia.herramienta} course={guia.curso} size="sm" />
                    <GuiaVisualBadge tone="accent">{guia.herramienta}</GuiaVisualBadge>
                  </div>
                  <GuiaVisualBadge tone="neutral">Nivel {guia.nivel}</GuiaVisualBadge>
                  <GuiaVisualBadge tone="neutral">{lecturaMin} min de lectura</GuiaVisualBadge>
                  <GuiaVisualBadge tone="neutral">Actualizado {actualizado}</GuiaVisualBadge>
                </div>

                {/* Panel visual "En 30 segundos" */}
                <div className="mt-6 rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)]/70 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-accent)]">
                      En 30 segundos
                    </span>
                    <span className="font-mono text-xs text-[var(--g-subtle)]">
                      {guia.en30Segundos.herramienta} · {guia.en30Segundos.tiempo}
                    </span>
                  </div>

                  <p className="mt-2 text-base font-semibold leading-snug text-[var(--g-ink)]">
                    {guia.en30Segundos.queLogras}
                  </p>

                  <ul className="mt-3.5 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                    {guia.en30Segundos.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 text-sm leading-relaxed text-[var(--g-muted)]"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                          className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--g-accent)]"
                        >
                          <path
                            d="M3.5 8.5l3 3 6-6.5"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </header>

              {/* TOC móvil y progreso móvil */}
              <GuiaPasoAPasoTocMobile items={tocItems} />
              <GuiaPasoProgressWidget
                slug={guia.slug}
                stepIds={stepIds}
                className="mt-4 lg:hidden"
              />

              {/* Mapa visual de pasos interactivo */}
              <GuiaPasoAPasoRuta pasos={guia.rutaVisual} />

              {/* Prerrequisitos */}
              <section
                id="lo-que-necesitas"
                aria-labelledby="lo-que-necesitas-titulo"
                className="mt-10 scroll-mt-24"
              >
                <div className="rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5 shadow-[var(--g-card-shadow)] sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2
                      id="lo-que-necesitas-titulo"
                      className="text-lg font-bold tracking-[-0.015em] text-[var(--g-ink)] sm:text-xl"
                    >
                      Lo que necesitas
                    </h2>
                    <GuiaVisualBadge tone="neutral">Prerrequisitos</GuiaVisualBadge>
                  </div>

                  <p className="mt-3 text-sm text-[var(--g-muted)]">
                    <strong className="text-[var(--g-ink)]">Versión recomendada:</strong>{" "}
                    {guia.requisitos.version}
                  </p>

                  <ul className="mt-3 space-y-2">
                    {guia.requisitos.lista.map((req) => (
                      <li
                        key={req}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--g-muted)]"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                          className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--g-accent)]"
                        >
                          <path
                            d="M3.5 8.5l3 3 6-6.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)]/60 px-3.5 py-2.5 text-xs leading-relaxed text-[var(--g-muted)]">
                    <strong className="text-[var(--g-ink)]">Mac y Web:</strong>{" "}
                    {guia.requisitos.compatibilidadMacWeb}
                  </p>
                </div>

                {guia.requisitos.avisoEducativo ? (
                  <GuiaEditorialNote label="Nota de compatibilidad" tone="caution" className="mt-4">
                    <p>{guia.requisitos.avisoEducativo}</p>
                  </GuiaEditorialNote>
                ) : null}
              </section>

              {guia.esGuiaIA || guia.avisoPrivacidad ? (
                <GuiaEditorialNote
                  label="Privacidad y anonimización"
                  tone="caution"
                  className="mt-4"
                >
                  <p>{guia.avisoPrivacidad || AVISO_PRIVACIDAD_ESTANDAR}</p>
                </GuiaEditorialNote>
              ) : null}

              {/* Tarjetas de Paso Interactivas */}
              <div className="mt-10 space-y-6">
                {guia.secciones.map((sec, idx) => {
                  const numeroPaso = String(idx + 1).padStart(2, "0");
                  return (
                    <section
                      key={sec.id}
                      id={sec.id}
                      aria-labelledby={`${sec.id}-titulo`}
                      className="scroll-mt-24 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5 shadow-[var(--g-card-shadow)] sm:p-7"
                    >
                      <GuiaPasoStepHeader
                        slug={guia.slug}
                        stepId={sec.id}
                        numeroPaso={numeroPaso}
                        titulo={sec.titulo}
                      />

                      <div className="mt-4 space-y-3 text-base leading-[1.7] text-[var(--g-muted)]">
                        {sec.parrafos.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>

                      {sec.lista && sec.lista.length > 0 ? (
                        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-base leading-[1.7] text-[var(--g-muted)]">
                          {sec.lista.map((item, lIdx) => (
                            <li key={lIdx}>{item}</li>
                          ))}
                        </ul>
                      ) : null}

                      {sec.listaOrdenada && sec.listaOrdenada.length > 0 ? (
                        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-base leading-[1.7] text-[var(--g-muted)]">
                          {sec.listaOrdenada.map((item, lIdx) => (
                            <li key={lIdx}>{item}</li>
                          ))}
                        </ol>
                      ) : null}

                      {sec.alerta ? (
                        <GuiaEditorialNote
                          label={sec.alerta.titulo}
                          tone={
                            sec.alerta.tipo === "warning"
                              ? "caution"
                              : sec.alerta.tipo === "tip"
                                ? "success"
                                : "accent"
                          }
                        >
                          <p>{sec.alerta.texto}</p>
                        </GuiaEditorialNote>
                      ) : null}

                      {sec.codigos?.map((bloque, bIdx) => (
                        <GuiaPasoAPasoCodeBlock key={`${sec.id}-code-${bIdx}`} bloque={bloque} />
                      ))}

                      {sec.tabla ? <TablaRender tabla={sec.tabla} /> : null}

                      {sec.captura ? (
                        <CapturaPendiente
                          captura={sec.captura}
                          herramienta={guia.herramienta}
                          curso={guia.curso}
                        />
                      ) : null}

                      {sec.subsecciones && sec.subsecciones.length > 0 ? (
                        <div className="mt-6 space-y-6">
                          {sec.subsecciones.map((sub) => (
                            <div
                              key={sub.id}
                              id={sub.id}
                              className="scroll-mt-24 rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)]/45 p-4 sm:p-5"
                            >
                              <h3 className="text-lg font-bold tracking-[-0.015em] text-[var(--g-ink)]">
                                {sub.titulo}
                              </h3>
                              <div className="mt-2 space-y-2.5 text-base leading-[1.7] text-[var(--g-muted)]">
                                {sub.parrafos.map((p, pIdx) => (
                                  <p key={pIdx}>{p}</p>
                                ))}
                              </div>
                              {sub.lista && sub.lista.length > 0 ? (
                                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[var(--g-muted)]">
                                  {sub.lista.map((item, lIdx) => (
                                    <li key={lIdx}>{item}</li>
                                  ))}
                                </ul>
                              ) : null}
                              {sub.codigo ? (
                                <GuiaPasoAPasoCodeBlock bloque={sub.codigo} />
                              ) : null}
                              {sub.tabla ? <TablaRender tabla={sub.tabla} /> : null}
                              {sub.captura ? (
                                <CapturaPendiente
                                  captura={sub.captura}
                                  herramienta={guia.herramienta}
                                  curso={guia.curso}
                                />
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {sec.verificaResultado ? (
                        <GuiaEditorialNote label="Verifica tu resultado" tone="success">
                          <p>{sec.verificaResultado}</p>
                        </GuiaEditorialNote>
                      ) : null}
                    </section>
                  );
                })}
              </div>

              {/* Errores comunes y cómo resolverlos */}
              {guia.erroresComunes.length > 0 ? (
                <section
                  id="errores-comunes"
                  aria-labelledby="errores-comunes-titulo"
                  className="mt-12 scroll-mt-24 border-t border-[var(--g-border)] pt-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2
                      id="errores-comunes-titulo"
                      className="text-2xl font-bold tracking-[-0.02em] text-[var(--g-ink)]"
                    >
                      Errores comunes y cómo resolverlos
                    </h2>
                    <GuiaVisualBadge tone="warn">Diagnóstico rápido</GuiaVisualBadge>
                  </div>

                  <div className="mt-5 space-y-3.5">
                    {guia.erroresComunes.map((item) => (
                      <article
                        key={item.error}
                        className="rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5 shadow-[var(--g-card-shadow)]"
                      >
                        <div className="flex flex-wrap items-start gap-2.5">
                          <GuiaVisualBadge tone="warn">Problema</GuiaVisualBadge>
                          <h3 className="text-base font-bold leading-snug text-[var(--g-ink)]">
                            {item.error}
                          </h3>
                        </div>

                        <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)]/65 p-3.5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
                              Causa
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-[var(--g-muted)]">
                              {item.causa}
                            </p>
                          </div>

                          <div className="rounded-xl border border-[var(--g-ok)]/25 bg-[var(--g-ok-soft)]/55 p-3.5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--g-ok)]">
                              Cómo resolverlo
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-[var(--g-ink)]">
                              {item.solucion}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Plantilla descargable */}
              {/* TODO: Enlazar a URL real de descarga cuando el archivo de práctica esté publicado */}
              <section
                id="descarga-plantilla"
                aria-labelledby="descarga-plantilla-titulo"
                className="mt-10 scroll-mt-24"
              >
                <div className="rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5 shadow-[var(--g-card-shadow)] sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-accent)]">
                      Plantilla descargable
                    </span>
                    <GuiaVisualBadge tone="neutral">Próximamente</GuiaVisualBadge>
                  </div>
                  <h2
                    id="descarga-plantilla-titulo"
                    className="mt-2 text-lg font-bold tracking-[-0.015em] text-[var(--g-ink)]"
                  >
                    {guia.plantilla.titulo}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--g-muted)]">
                    {guia.plantilla.descripcion}
                  </p>
                </div>
              </section>

              {/* Preguntas frecuentes */}
              <GuiaPasoAPasoFaq faqs={guia.faqs} />

              {/* Fuentes oficiales y recursos */}
              {guia.enlacesExternos.length > 0 ||
              (guia.enlacesInternosExtra && guia.enlacesInternosExtra.length > 0) ? (
                <section
                  aria-labelledby="fuentes-oficiales"
                  className="mt-10 border-t border-[var(--g-border)] pt-8"
                >
                  <h2
                    id="fuentes-oficiales"
                    className="text-lg font-bold tracking-[-0.015em] text-[var(--g-ink)]"
                  >
                    Fuentes oficiales y recursos
                  </h2>

                  {guia.enlacesExternos.length > 0 ? (
                    <ul className="mt-3 space-y-2 text-sm">
                      {guia.enlacesExternos.map((ext) => (
                        <li key={ext.url}>
                          <a
                            href={ext.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-4 transition-colors hover:text-[var(--g-ink)]"
                          >
                            {ext.label}
                          </a>
                          <span className="ml-2 text-xs text-[var(--g-subtle)]">
                            ({ext.fuente})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {guia.enlacesInternosExtra && guia.enlacesInternosExtra.length > 0 ? (
                    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {guia.enlacesInternosExtra.map((int) => (
                        <li key={int.href}>
                          <Link
                            href={int.href}
                            className="group block rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] p-4 no-underline shadow-[var(--g-card-shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--g-accent)]"
                          >
                            <span className="block text-sm font-semibold text-[var(--g-ink)] transition-colors group-hover:text-[var(--g-accent)]">
                              {int.label}
                            </span>
                            {int.descripcion ? (
                              <span className="mt-1 block text-xs leading-relaxed text-[var(--g-muted)]">
                                {int.descripcion}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ) : null}

              {/* Guías relacionadas (3 tarjetas visuales) */}
              <nav
                aria-labelledby="guias-relacionadas-titulo"
                className="mt-10 border-t border-[var(--g-border)] pt-8"
              >
                <h2
                  id="guias-relacionadas-titulo"
                  className="text-lg font-bold tracking-[-0.015em] text-[var(--g-ink)]"
                >
                  Guías relacionadas
                </h2>
                <ol className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {guia.relacionadas.map((relSlug) => {
                    const rel = relacionadasMap[relSlug];
                    return (
                      <li key={relSlug} className="min-w-0">
                        <Link
                          href={`/guias/${relSlug}`}
                          className="group flex h-full min-h-[44px] flex-col justify-between rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5 no-underline shadow-[var(--g-card-shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--g-accent)] hover:shadow-[var(--g-card-shadow-hover)]"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <GuiaToolVisual tool={rel?.herramienta} size="sm" />
                              {rel?.nivel ? (
                                <GuiaVisualBadge tone="neutral">{rel.nivel}</GuiaVisualBadge>
                              ) : null}
                            </div>

                            <span className="mt-3.5 block text-sm font-bold leading-snug text-[var(--g-ink)] transition-colors group-hover:text-[var(--g-accent)]">
                              {rel?.h1 ?? relSlug.replace(/-/g, " ")}
                            </span>

                            {rel?.subtitle ? (
                              <span className="mt-1.5 block line-clamp-2 text-xs leading-relaxed text-[var(--g-muted)]">
                                {rel.subtitle}
                              </span>
                            ) : null}
                          </div>

                          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--g-accent)]">
                            <span>Leer guía</span>
                            <svg
                              viewBox="0 0 16 16"
                              fill="none"
                              aria-hidden="true"
                              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                            >
                              <path
                                d="M3.5 8h9M8.5 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              {/* Tarjeta de curso en móvil: una sola vez al final del artículo */}
              <div className="mt-10 lg:hidden">
                <GuiaPasoAPasoCursoCard
                  guia={guia}
                  curso={curso}
                  cursoSecundario={cursoSecundario}
                  ctaPosition="guia_paso_a_paso_final_mobile"
                />
              </div>

              {/* Cierre de curso en escritorio */}
              <div className="mt-10 hidden rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-6 shadow-[var(--g-card-shadow)] lg:flex lg:items-center lg:justify-between lg:gap-6">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-accent)]">
                    Clase gratis disponible
                  </p>
                  <p className="mt-1.5 text-lg font-bold tracking-[-0.015em] text-[var(--g-ink)]">
                    Domina {curso.nombre} con clases prácticas en vivo
                  </p>
                  <p className="mt-1 font-mono text-xs tabular-nums text-[var(--g-subtle)]">
                    {curso.horas} horas prácticas ·{" "}
                    {curso.textoCuotas || "Inscripción abierta"}
                    {curso.precioFormateado ? ` · ${curso.precioFormateado}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                  <WhatsAppCta
                    page={`/guias/${guia.slug}`}
                    intent="curso"
                    course={curso.nombre}
                    courseSlug={guia.curso}
                    country="cl"
                    ctaPosition="guia_paso_a_paso_final_desktop"
                    customText={`Hola, vengo de la guía ${guia.h1} y quiero la clase gratis del curso de ${curso.nombre} [${guia.slug}]`}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--g-ink)] px-5 text-xs font-semibold text-[var(--g-surface)] no-underline transition-opacity hover:opacity-90"
                  >
                    Solicitar clase gratis
                  </WhatsAppCta>
                  <Link
                    href={`/cursos/${guia.curso}`}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-4 text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-ink)]"
                  >
                    Ver temario del curso
                  </Link>
                  <Link
                    href={`/registro?from=/guias/${guia.slug}`}
                    className="inline-flex min-h-[44px] items-center justify-center px-2 text-xs font-semibold text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-4 hover:text-[var(--g-ink)]"
                  >
                    Inscribirme
                  </Link>
                </div>
              </div>
            </div>

            {/* Rail izquierdo sticky: Curso arriba + Progreso medio + En esta guía abajo */}
            <div className="hidden lg:sticky lg:top-24 lg:col-start-1 lg:row-start-1 lg:flex lg:max-h-[calc(100vh-7rem)] lg:flex-col lg:gap-5 lg:overflow-y-auto lg:pr-1">
              <GuiaPasoAPasoCursoCard
                guia={guia}
                curso={curso}
                cursoSecundario={cursoSecundario}
                ctaPosition="guia_paso_a_paso_lateral"
              />
              <GuiaPasoProgressWidget slug={guia.slug} stepIds={stepIds} />
              {tocItems.length > 0 ? (
                <div className="border-t border-[var(--g-border)] pt-5">
                  <GuiaPasoAPasoTocDesktop items={tocItems} sticky={false} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </article>

      <GuiaPasoAPasoStickyWa
        slug={guia.slug}
        h1={guia.h1}
        cursoSlug={guia.curso}
        cursoNombre={curso.nombre}
      />
    </GuiaScope>
  );
}
