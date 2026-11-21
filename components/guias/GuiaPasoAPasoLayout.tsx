import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  ExternalLink,
  FileDown,
  Info,
  Lightbulb,
  MessageCircle,
} from "lucide-react";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import CapturaPendiente from "@/components/guias/CapturaPendiente";
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
    <div className="my-6 overflow-x-auto rounded-2xl border border-line bg-paper">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        {tabla.caption ? (
          <caption className="border-b border-line bg-wash/50 px-4 py-2.5 text-left text-xs font-semibold text-mute">
            {tabla.caption}
          </caption>
        ) : null}
        <thead>
          <tr className="border-b border-line bg-wash/70">
            {tabla.encabezados.map((enc, idx) => (
              <th
                key={`${enc}-${idx}`}
                scope="col"
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-ink"
              >
                {enc}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {tabla.filas.map((fila, rIdx) => (
            <tr key={rIdx} className="hover:bg-wash/30">
              {fila.map((celda, cIdx) => (
                <td
                  key={cIdx}
                  className={`px-4 py-2.5 align-top leading-relaxed ${
                    cIdx === 0 ? "font-semibold text-ink" : "text-mute"
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
  items.push({ id: "descarga-plantilla", texto: "Descarga la plantilla", nivel: 2 });
  if (guia.faqs.length > 0) {
    items.push({ id: "preguntas-frecuentes", texto: "Preguntas frecuentes", nivel: 2 });
  }
  return items;
}

export default function GuiaPasoAPasoLayout({
  guia,
  relacionadasMap,
}: {
  guia: GuiaPasoAPaso;
  relacionadasMap: Record<string, RelacionadaResumen>;
}) {
  const curso = datosCursoParaGuia(guia.curso);
  const lecturaMin = tiempoLecturaPasoAPaso(guia);
  const actualizado = fechaActualizado(guia.updated);
  const tocItems = construirToc(guia);
  const jsonLd = jsonLdDeGuiaPasoAPaso(guia);
  const primerPasoIdx = guia.secciones.findIndex((s) => s.esPasoHowTo);
  const insertMobileCardAfterIdx = primerPasoIdx >= 0 ? primerPasoIdx : 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <article className="bg-canvas px-4 pb-24 pt-10 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-[1320px]">
          {/* 1) Breadcrumb */}
          <nav aria-label="Migas de pan" className="text-xs text-mute">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="no-underline hover:text-ink">
                  Inicio
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/guias" className="no-underline hover:text-ink">
                  Guías
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink">{guia.h1}</li>
            </ol>
          </nav>

          <div className="mt-6 lg:grid lg:grid-cols-[200px_minmax(0,1fr)_270px] lg:gap-6 xl:grid-cols-[220px_minmax(0,740px)_290px] xl:gap-8">
            {/* Contenido principal */}
            <div className="min-w-0 lg:col-start-2 lg:row-start-1">
              {/* 2) H1, subtítulo, fecha, lectura, badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-paper px-3 py-1 font-bold uppercase tracking-[0.12em] text-ink">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: curso.accentColor }}
                    aria-hidden="true"
                  />
                  {guia.herramienta}
                </span>
                <span className="inline-flex items-center rounded-full border border-line bg-wash px-2.5 py-1 font-semibold text-ink">
                  {guia.nivel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-wash px-2.5 py-1 font-medium text-mute">
                  <Clock size={12} aria-hidden /> {lecturaMin} min de lectura
                </span>
                <span className="text-faint">Actualizado el {actualizado}</span>
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                {guia.h1}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-mute sm:text-lg">
                {guia.subtitle}
              </p>

              {/* 3) En 30 segundos */}
              <section
                aria-labelledby="en-30-segundos"
                className="mt-6 rounded-2xl border border-line-strong bg-paper p-5"
              >
                <p
                  id="en-30-segundos"
                  className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute"
                >
                  En 30 segundos
                </p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-ink">
                  {guia.en30Segundos.queLogras}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mute">
                  <span>
                    <strong className="text-ink">Herramienta:</strong>{" "}
                    {guia.en30Segundos.herramienta}
                  </span>
                  <span>
                    <strong className="text-ink">Tiempo estimado:</strong>{" "}
                    {guia.en30Segundos.tiempo}
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-mute">
                  {guia.en30Segundos.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink"
                        aria-hidden
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Acordeón móvil «En esta guía» */}
              <GuiaPasoAPasoTocMobile items={tocItems} />

              {/* 4) Ruta visual */}
              <GuiaPasoAPasoRuta pasos={guia.rutaVisual} />

              {/* 5) Lo que necesitas */}
              <section
                id="lo-que-necesitas"
                aria-labelledby="lo-que-necesitas-titulo"
                className="mt-10 scroll-mt-24 rounded-2xl border border-line bg-paper p-5"
              >
                <h2
                  id="lo-que-necesitas-titulo"
                  className="text-xl font-bold tracking-tight text-ink"
                >
                  Lo que necesitas
                </h2>
                <p className="mt-2 text-sm text-mute">
                  <strong className="text-ink">Versión recomendada:</strong>{" "}
                  {guia.requisitos.version}
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-mute">
                  {guia.requisitos.lista.map((req) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-mute">
                  <strong className="text-ink">Mac y Web:</strong>{" "}
                  {guia.requisitos.compatibilidadMacWeb}
                </p>
                {guia.requisitos.avisoEducativo ? (
                  <div
                    role="note"
                    className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-ink"
                  >
                    <AlertTriangle
                      size={16}
                      className="mt-0.5 shrink-0 text-amber-700"
                      aria-hidden
                    />
                    <span>{guia.requisitos.avisoEducativo}</span>
                  </div>
                ) : null}
              </section>

              {/* 6) Paso a paso (+ 7) Tabla comparativa dentro de su sección) */}
              <div className="mt-10 space-y-10">
                {guia.secciones.map((sec, idx) => (
                  <div key={sec.id}>
                    <section
                      id={sec.id}
                      aria-labelledby={`${sec.id}-titulo`}
                      className="scroll-mt-24"
                    >
                      <h2
                        id={`${sec.id}-titulo`}
                        className="text-2xl font-bold tracking-tight text-ink"
                      >
                        {sec.titulo}
                      </h2>

                      <div className="mt-3 space-y-3 text-base leading-relaxed text-mute">
                        {sec.parrafos.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>

                      {sec.lista && sec.lista.length > 0 ? (
                        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-mute">
                          {sec.lista.map((item, lIdx) => (
                            <li key={lIdx}>{item}</li>
                          ))}
                        </ul>
                      ) : null}

                      {sec.listaOrdenada && sec.listaOrdenada.length > 0 ? (
                        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-mute">
                          {sec.listaOrdenada.map((item, lIdx) => (
                            <li key={lIdx}>{item}</li>
                          ))}
                        </ol>
                      ) : null}

                      {sec.alerta ? (
                        <div
                          role="note"
                          className={`mt-5 flex items-start gap-2.5 rounded-2xl border px-4 py-3.5 text-sm leading-relaxed ${
                            sec.alerta.tipo === "warning"
                              ? "border-amber-500/30 bg-amber-500/10 text-ink"
                              : sec.alerta.tipo === "tip"
                                ? "border-emerald-600/25 bg-emerald-600/10 text-ink"
                                : "border-line-strong bg-wash/70 text-ink"
                          }`}
                        >
                          {sec.alerta.tipo === "warning" ? (
                            <AlertTriangle size={17} className="mt-0.5 shrink-0" aria-hidden />
                          ) : sec.alerta.tipo === "tip" ? (
                            <Lightbulb size={17} className="mt-0.5 shrink-0" aria-hidden />
                          ) : (
                            <Info size={17} className="mt-0.5 shrink-0" aria-hidden />
                          )}
                          <div>
                            <p className="font-semibold">{sec.alerta.titulo}</p>
                            <p className="mt-0.5 text-xs leading-relaxed text-mute">
                              {sec.alerta.texto}
                            </p>
                          </div>
                        </div>
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
                              className="scroll-mt-24 border-l-2 border-line pl-4"
                            >
                              <h3 className="text-lg font-bold tracking-tight text-ink">
                                {sub.titulo}
                              </h3>
                              <div className="mt-2 space-y-2.5 text-sm leading-relaxed text-mute">
                                {sub.parrafos.map((p, pIdx) => (
                                  <p key={pIdx}>{p}</p>
                                ))}
                              </div>
                              {sub.lista && sub.lista.length > 0 ? (
                                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-mute">
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
                    </section>

                    {idx === insertMobileCardAfterIdx ? (
                      <div className="mt-8 lg:hidden">
                        <GuiaPasoAPasoCursoCard
                          guia={guia}
                          curso={curso}
                          ctaPosition="guia_paso_a_paso_inline_mobile"
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* 8) Errores comunes y cómo resolverlos */}
              {guia.erroresComunes.length > 0 ? (
                <section
                  id="errores-comunes"
                  aria-labelledby="errores-comunes-titulo"
                  className="mt-12 scroll-mt-24 border-t border-line pt-8"
                >
                  <h2
                    id="errores-comunes-titulo"
                    className="text-2xl font-bold tracking-tight text-ink"
                  >
                    Errores comunes y cómo resolverlos
                  </h2>
                  <div className="mt-5 space-y-3">
                    {guia.erroresComunes.map((item) => (
                      <div
                        key={item.error}
                        className="rounded-2xl border border-line bg-paper p-4"
                      >
                        <p className="text-sm font-bold text-ink">{item.error}</p>
                        <p className="mt-1 text-xs leading-relaxed text-mute">
                          <strong className="text-ink">Causa:</strong> {item.causa}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-mute">
                          <strong className="text-ink">Solución:</strong> {item.solucion}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* 9) Bloque Descarga la plantilla */}
              <section
                id="descarga-plantilla"
                aria-labelledby="descarga-plantilla-titulo"
                className="mt-10 scroll-mt-24 rounded-2xl border border-dashed border-line-strong bg-wash/60 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
                      Archivo de práctica
                    </p>
                    <h2
                      id="descarga-plantilla-titulo"
                      className="mt-1 text-lg font-bold tracking-tight text-ink"
                    >
                      {guia.plantilla.titulo}
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-mute">
                      {guia.plantilla.descripcion}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-10 shrink-0 cursor-not-allowed items-center gap-2 rounded-full border border-line-strong bg-paper px-4 text-xs font-semibold text-mute opacity-75"
                  >
                    <FileDown size={15} aria-hidden />
                    Próximamente
                  </button>
                </div>
              </section>

              {/* 10) Preguntas frecuentes */}
              <GuiaPasoAPasoFaq faqs={guia.faqs} />

              {/* Enlaces oficiales / Fuentes citadas + internos extra */}
              {guia.enlacesExternos.length > 0 ||
              (guia.enlacesInternosExtra && guia.enlacesInternosExtra.length > 0) ? (
                <section
                  aria-labelledby="fuentes-oficiales"
                  className="mt-10 border-t border-line pt-8"
                >
                  <h2
                    id="fuentes-oficiales"
                    className="text-lg font-bold tracking-tight text-ink"
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
                            className="inline-flex items-center gap-1.5 font-medium text-ink underline underline-offset-4 hover:text-mute"
                          >
                            {ext.label}
                            <ExternalLink size={13} aria-hidden />
                          </a>
                          <span className="ml-2 text-xs text-faint">({ext.fuente})</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {guia.enlacesInternosExtra && guia.enlacesInternosExtra.length > 0 ? (
                    <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {guia.enlacesInternosExtra.map((int) => (
                        <li key={int.href}>
                          <Link
                            href={int.href}
                            className="block rounded-xl border border-line bg-paper px-4 py-3 no-underline transition-colors hover:border-ink/30"
                          >
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
                              {int.label}
                              <ArrowRight size={13} aria-hidden />
                            </span>
                            {int.descripcion ? (
                              <span className="mt-0.5 block text-xs text-mute">
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

              {/* 11) Guías relacionadas + CTA final */}
              <nav
                aria-labelledby="guias-relacionadas-titulo"
                className="mt-10 border-t border-line pt-8"
              >
                <h2
                  id="guias-relacionadas-titulo"
                  className="text-lg font-bold tracking-tight text-ink"
                >
                  Guías relacionadas
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {guia.relacionadas.map((relSlug) => {
                    const rel = relacionadasMap[relSlug];
                    return (
                      <li key={relSlug}>
                        <Link
                          href={`/guias/${relSlug}`}
                          className="flex h-full flex-col rounded-2xl border border-line bg-paper p-4 no-underline transition-colors hover:border-ink/35"
                        >
                          {rel?.herramienta ? (
                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">
                              {rel.herramienta}
                              {rel.nivel ? ` · ${rel.nivel}` : ""}
                            </span>
                          ) : null}
                          <span className="mt-1 text-sm font-bold leading-snug text-ink">
                            {rel?.h1 ?? relSlug.replace(/-/g, " ")}
                          </span>
                          <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-ink">
                            Leer guía <ArrowRight size={12} aria-hidden />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-10 lg:hidden">
                <GuiaPasoAPasoCursoCard
                  guia={guia}
                  curso={curso}
                  ctaPosition="guia_paso_a_paso_final_mobile"
                />
              </div>

              <div className="mt-10 hidden rounded-2xl border border-line-strong bg-paper p-6 lg:flex lg:items-center lg:justify-between lg:gap-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-canvas">
                      Clase gratis
                    </span>
                    {curso.textoCuotas ? (
                      <span className="inline-flex items-center rounded-full border border-line-strong bg-wash px-2.5 py-0.5 text-[11px] font-semibold text-ink">
                        {curso.textoCuotas}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-lg font-bold tracking-tight text-ink">
                    Domina {curso.nombre} con clases prácticas en vivo
                  </p>
                  <p className="mt-1 text-sm text-mute">
                    {curso.horas} horas prácticas · {curso.textoCuotas || "Inscripción abierta"}
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
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-ink px-5 text-xs font-semibold text-canvas no-underline"
                  >
                    <MessageCircle size={14} aria-hidden />
                    Quiero mi clase gratis
                  </WhatsAppCta>
                  <Link
                    href={`/cursos/${guia.curso}`}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-line-strong bg-canvas px-4 text-xs font-semibold text-ink no-underline hover:bg-wash"
                  >
                    Ver el curso
                  </Link>
                  <Link
                    href={`/registro?from=/guias/${guia.slug}`}
                    className="inline-flex h-10 items-center justify-center text-xs font-semibold text-ink underline underline-offset-4 hover:text-mute"
                  >
                    Inscribirme
                  </Link>
                </div>
              </div>
            </div>

            {/* TOC Desktop (columna izquierda) */}
            <div className="hidden lg:col-start-1 lg:row-start-1 lg:block">
              <GuiaPasoAPasoTocDesktop items={tocItems} />
            </div>

            {/* Tarjeta Sticky Curso Desktop (columna derecha) */}
            <div className="hidden lg:col-start-3 lg:row-start-1 lg:block">
              <GuiaPasoAPasoCursoCard
                guia={guia}
                curso={curso}
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
    </>
  );
}
