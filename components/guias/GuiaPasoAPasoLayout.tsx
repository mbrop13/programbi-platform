import Link from "next/link";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import CapturaPendiente from "@/components/guias/CapturaPendiente";
import {
  GuiaBreadcrumbs,
  GuiaEditorialNote,
  GuiaScope,
} from "@/components/guias/GuiaEditorialPrimitives";
import GuiaPasoAPasoCodeBlock from "@/components/guias/GuiaPasoAPasoCodeBlock";
import GuiaPasoAPasoCursoCard from "@/components/guias/GuiaPasoAPasoCursoCard";
import GuiaPasoAPasoFaq from "@/components/guias/GuiaPasoAPasoFaq";
import GuiaPasoAPasoRuta from "@/components/guias/GuiaPasoAPasoRuta";
import GuiaPasoAPasoStickyWa from "@/components/guias/GuiaPasoAPasoStickyWa";
import {
  GuiaPasoAPasoTocDesktop,
  GuiaPasoAPasoTocMobile,
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
    <div className="guias-table-wrap my-6 overflow-x-auto rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)]">
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
  const jsonLd = jsonLdDeGuiaPasoAPaso(guia);

  return (
    <GuiaScope>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <article className="px-4 pb-24 pt-10 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-[1320px]">
          <GuiaBreadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Guías", href: "/guias" },
              { label: curso.nombre, href: `/cursos/${guia.curso}` },
              { label: guia.h1 },
            ]}
          />

          <div className="mt-8 lg:grid lg:grid-cols-[200px_minmax(0,1fr)_270px] lg:gap-8 xl:grid-cols-[220px_minmax(0,68ch)_290px] xl:gap-10">
            {/* Columna central editorial */}
            <div className="min-w-0 max-w-[68ch] lg:col-start-2 lg:row-start-1">
              {/* Cabecera editorial sin eyebrow pill */}
              <header>
                <h1 className="text-[clamp(1.85rem,3.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--g-ink)]">
                  {guia.h1}
                </h1>
                <p className="mt-4 max-w-[65ch] text-base leading-[1.65] text-[var(--g-muted)] sm:text-lg">
                  {guia.subtitle}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-y border-[var(--g-border)] py-2.5 text-xs tabular-nums text-[var(--g-subtle)]">
                  <span className="font-medium text-[var(--g-ink)]">{guia.herramienta}</span>
                  <span aria-hidden="true">·</span>
                  <span>Nivel {guia.nivel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lecturaMin} min de lectura</span>
                  <span aria-hidden="true">·</span>
                  <span>Actualizado el {actualizado}</span>
                </div>
              </header>

              {/* Resumen ejecutivo en 30 segundos */}
              <GuiaEditorialNote label="En 30 segundos" tone="neutral" className="mt-6">
                <p className="font-semibold text-[var(--g-ink)]">
                  {guia.en30Segundos.queLogras}
                </p>
                <p className="text-xs text-[var(--g-subtle)]">
                  <strong className="text-[var(--g-ink)]">Herramienta:</strong>{" "}
                  {guia.en30Segundos.herramienta} ·{" "}
                  <strong className="text-[var(--g-ink)]">Tiempo estimado:</strong>{" "}
                  {guia.en30Segundos.tiempo}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-[var(--g-muted)]">
                  {guia.en30Segundos.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </GuiaEditorialNote>

              {/* TOC móvil */}
              <GuiaPasoAPasoTocMobile items={tocItems} />

              {/* Ruta paso a paso */}
              <GuiaPasoAPasoRuta pasos={guia.rutaVisual} />

              {/* Prerrequisitos */}
              <section
                id="lo-que-necesitas"
                aria-labelledby="lo-que-necesitas-titulo"
                className="mt-10 scroll-mt-24"
              >
                <GuiaEditorialNote label="Prerrequisitos" tone="neutral" className="my-0">
                  <h2
                    id="lo-que-necesitas-titulo"
                    className="text-lg font-bold tracking-[-0.015em] text-[var(--g-ink)]"
                  >
                    Lo que necesitas
                  </h2>
                  <p className="text-sm text-[var(--g-muted)]">
                    <strong className="text-[var(--g-ink)]">Versión recomendada:</strong>{" "}
                    {guia.requisitos.version}
                  </p>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--g-muted)]">
                    {guia.requisitos.lista.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                  <p className="text-xs leading-relaxed text-[var(--g-subtle)]">
                    <strong className="text-[var(--g-ink)]">Mac y Web:</strong>{" "}
                    {guia.requisitos.compatibilidadMacWeb}
                  </p>
                </GuiaEditorialNote>

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

              {/* Secciones paso a paso */}
              <div className="mt-10 space-y-10">
                {guia.secciones.map((sec, idx) => {
                  const numeroPaso = String(idx + 1).padStart(2, "0");
                  return (
                    <section
                      key={sec.id}
                      id={sec.id}
                      aria-labelledby={`${sec.id}-titulo`}
                      className="scroll-mt-24 border-t border-[var(--g-border)] pt-8"
                    >
                      <p className="mb-1.5 font-mono text-xs font-medium tabular-nums text-[var(--g-subtle)]">
                        {numeroPaso}
                      </p>
                      <h2
                        id={`${sec.id}-titulo`}
                        className="text-xl font-bold tracking-[-0.02em] text-[var(--g-ink)] sm:text-2xl"
                      >
                        {sec.titulo}
                      </h2>

                      <div className="mt-3 space-y-3 text-base leading-[1.7] text-[var(--g-muted)]">
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
                                ? "accent"
                                : "neutral"
                          }
                        >
                          <p>{sec.alerta.texto}</p>
                        </GuiaEditorialNote>
                      ) : null}

                      {sec.codigos?.map((bloque, bIdx) => (
                        <GuiaPasoAPasoCodeBlock key={`${sec.id}-code-${bIdx}`} bloque={bloque} />
                      ))}

                      {sec.tabla ? <TablaRender tabla={sec.tabla} /> : null}

                      {sec.captura ? <CapturaPendiente captura={sec.captura} /> : null}

                      {sec.subsecciones && sec.subsecciones.length > 0 ? (
                        <div className="mt-6 space-y-6">
                          {sec.subsecciones.map((sub) => (
                            <div
                              key={sub.id}
                              id={sub.id}
                              className="scroll-mt-24 border-l-2 border-[var(--g-border-strong)] pl-4"
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
                              {sub.captura ? <CapturaPendiente captura={sub.captura} /> : null}
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {sec.verificaResultado ? (
                        <GuiaEditorialNote label="Verifica el resultado" tone="accent">
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
                  <h2
                    id="errores-comunes-titulo"
                    className="text-2xl font-bold tracking-[-0.02em] text-[var(--g-ink)]"
                  >
                    Errores comunes y cómo resolverlos
                  </h2>
                  <div className="mt-5 divide-y divide-[var(--g-border)] rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)]">
                    {guia.erroresComunes.map((item) => (
                      <div key={item.error} className="p-4">
                        <p className="text-sm font-bold text-[var(--g-ink)]">{item.error}</p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--g-muted)]">
                          <strong className="text-[var(--g-ink)]">Causa:</strong> {item.causa}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--g-muted)]">
                          <strong className="text-[var(--g-ink)]">Solución:</strong>{" "}
                          {item.solucion}
                        </p>
                      </div>
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
                <GuiaEditorialNote label="Plantilla descargable" tone="neutral" className="my-0">
                  <h2
                    id="descarga-plantilla-titulo"
                    className="text-lg font-bold tracking-[-0.015em] text-[var(--g-ink)]"
                  >
                    {guia.plantilla.titulo}
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--g-muted)]">
                    {guia.plantilla.descripcion}
                  </p>
                  <p className="font-mono text-xs text-[var(--g-subtle)]">
                    Próximamente disponible para descarga.
                  </p>
                </GuiaEditorialNote>
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
                    <ul className="mt-4 divide-y divide-[var(--g-border)] border-y border-[var(--g-border)]">
                      {guia.enlacesInternosExtra.map((int) => (
                        <li key={int.href}>
                          <Link
                            href={int.href}
                            className="group block py-3 no-underline transition-colors hover:bg-[var(--g-surface)] sm:px-2"
                          >
                            <span className="block text-sm font-semibold text-[var(--g-ink)] transition-colors group-hover:text-[var(--g-accent)]">
                              {int.label}
                            </span>
                            {int.descripcion ? (
                              <span className="mt-0.5 block text-xs text-[var(--g-muted)]">
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

              {/* Guías relacionadas */}
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
                <ol className="mt-4 divide-y divide-[var(--g-border)] border-y border-[var(--g-border)]">
                  {guia.relacionadas.map((relSlug, relIdx) => {
                    const rel = relacionadasMap[relSlug];
                    return (
                      <li key={relSlug}>
                        <Link
                          href={`/guias/${relSlug}`}
                          className="group flex min-h-[44px] items-baseline gap-4 py-3.5 no-underline transition-colors hover:bg-[var(--g-surface)] sm:px-2"
                        >
                          <span className="shrink-0 font-mono text-xs font-medium tabular-nums text-[var(--g-subtle)]">
                            {String(relIdx + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold leading-snug text-[var(--g-ink)] transition-colors group-hover:text-[var(--g-accent)]">
                              {rel?.h1 ?? relSlug.replace(/-/g, " ")}
                            </span>
                            {rel?.subtitle ? (
                              <span className="mt-0.5 block line-clamp-2 text-xs leading-relaxed text-[var(--g-muted)]">
                                {rel.subtitle}
                              </span>
                            ) : null}
                            {rel?.herramienta ? (
                              <span className="mt-1 block font-mono text-[11px] text-[var(--g-subtle)]">
                                {rel.herramienta}
                                {rel.nivel ? ` · ${rel.nivel}` : ""}
                              </span>
                            ) : null}
                          </div>
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
              <div className="mt-10 hidden rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] p-6 lg:flex lg:items-center lg:justify-between lg:gap-6">
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
                    className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[var(--g-ink)] px-5 text-xs font-semibold text-[var(--g-surface)] no-underline transition-opacity hover:opacity-90"
                  >
                    Solicitar clase gratis
                  </WhatsAppCta>
                  <Link
                    href={`/cursos/${guia.curso}`}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-4 text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-ink)]"
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

            {/* Rail izquierdo: TOC Desktop */}
            <div className="hidden lg:col-start-1 lg:row-start-1 lg:block">
              <GuiaPasoAPasoTocDesktop items={tocItems} />
            </div>

            {/* Rail derecho: Tarjeta Sticky Curso Desktop */}
            <div className="hidden lg:col-start-3 lg:row-start-1 lg:block">
              <GuiaPasoAPasoCursoCard
                guia={guia}
                curso={curso}
                cursoSecundario={cursoSecundario}
                sticky
                ctaPosition="guia_paso_a_paso_lateral"
              />
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
