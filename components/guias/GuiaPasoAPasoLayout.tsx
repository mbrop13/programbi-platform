import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import PlantillaDescarga from "@/components/marketing/PlantillaDescarga";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { OFERTA_CLASE_GRATIS_WHATSAPP } from "@/config/flags";
import {
  GuiaBreadcrumbs,
  GuiaEditorialNote,
  GuiaReadingProgress,
  GuiaScope,
  GuiaToolVisual,
} from "@/components/guias/GuiaEditorialPrimitives";
import GuiaPasoAPasoCodeBlock from "@/components/guias/GuiaPasoAPasoCodeBlock";
import GuiaPasoAPasoFaq from "@/components/guias/GuiaPasoAPasoFaq";
import GuiaPasoAPasoStickyWa from "@/components/guias/GuiaPasoAPasoStickyWa";
import { GuiaCursoCierre, GuiaCursoLateral } from "@/components/guias/GuiaCursoCompacto";
import {
  IndiceEscritorio,
  IndiceMovil,
  PasoBotonHecho,
  PasoLinea,
  PasoMarcador,
  type ItemIndice,
} from "@/components/guias/GuiaPasoProgreso";
import { datosCursoParaGuia } from "@/lib/guias/paso-a-paso-curso";
import {
  jsonLdDeGuiaPasoAPaso,
  tiempoLecturaPasoAPaso,
} from "@/lib/guias/paso-a-paso-seo";
import type {
  CapturaGuia,
  EsquemaGuia,
  GuiaPasoAPaso,
  TablaGuia,
} from "@/lib/guias/paso-a-paso-tipos";
import { fechaActualizado } from "@/lib/guias/precio";
import { jsonLdString } from "@/lib/seo";

export interface RelacionadaResumen {
  slug: string;
  path?: string;
  h1: string;
  subtitle?: string;
  herramienta?: string;
  nivel?: string;
}

const AVISO_PRIVACIDAD_ESTANDAR =
  "No subas datos personales ni sensibles (RUT, sueldos con nombre, correos o bases reales de clientes) a herramientas de IA sin un contrato empresarial aprobado. Anonimiza nombres, reemplaza identificadores por códigos ficticios y trabaja sobre muestras agregadas.";

/** Los títulos de sección traen «1. », pero el número ya lo muestra el marcador del paso. */
function sinNumero(titulo: string): string {
  return titulo.replace(/^\d+\.\s*/, "");
}

const CLASE_ENLACE =
  "font-semibold text-[var(--g-accent)] underline decoration-[var(--g-accent)]/30 underline-offset-4 transition-colors hover:decoration-[var(--g-accent)]";

function renderTextoConEnlaces(texto: string): ReactNode {
  const regex = /\[([^\]]+)\]\((\/(?!\/)[^)\s]*|https?:\/\/[^)\s]+)\)/g;
  const partes: ReactNode[] = [];
  let ultimoIndice = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(texto)) !== null) {
    if (match.index > ultimoIndice) partes.push(texto.slice(ultimoIndice, match.index));
    const [, ancla, url] = match;
    partes.push(
      url.startsWith("http") ? (
        <a
          key={`${match.index}-${url}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={CLASE_ENLACE}
        >
          {ancla}
        </a>
      ) : (
        <Link key={`${match.index}-${url}`} href={url} className={CLASE_ENLACE}>
          {ancla}
        </Link>
      )
    );
    ultimoIndice = match.index + match[0].length;
  }

  if (ultimoIndice === 0) return texto;
  if (ultimoIndice < texto.length) partes.push(texto.slice(ultimoIndice));
  return partes;
}

function TablaRender({ tabla }: { tabla: TablaGuia }) {
  return (
    <figure className="my-7">
      <div className="overflow-x-auto rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)]">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--g-border-strong)]">
              {tabla.encabezados.map((enc, idx) => (
                <th
                  key={`${enc}-${idx}`}
                  scope="col"
                  className="px-4 py-3 text-sm font-semibold text-[var(--g-ink)]"
                >
                  {enc}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--g-border)]">
            {tabla.filas.map((fila, rIdx) => (
              <tr key={rIdx}>
                {fila.map((celda, cIdx) =>
                  cIdx === 0 ? (
                    <th
                      key={cIdx}
                      scope="row"
                      className="px-4 py-3 align-top text-sm leading-relaxed font-semibold text-[var(--g-ink)]"
                    >
                      {celda}
                    </th>
                  ) : (
                    <td key={cIdx} className="px-4 py-3 align-top leading-relaxed text-[var(--g-muted)]">
                      {celda}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tabla.caption ? (
        <figcaption className="mt-2.5 text-sm leading-relaxed text-[var(--g-subtle)]">
          {tabla.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Solo se muestra cuando la captura real existe; las pendientes viven en CAPTURAS.md. */
function Captura({ captura }: { captura: CapturaGuia }) {
  if (!captura.src) return null;
  const ancho = captura.ancho ?? 1600;
  const alto = captura.alto ?? 900;
  return (
    <figure className="my-8" data-capture-id={captura.id}>
      <Image
        src={captura.src}
        alt={captura.alt}
        width={ancho}
        height={alto}
        sizes="(min-width: 1024px) 720px, 100vw"
        className="h-auto w-full rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)]"
      />
      <figcaption className="mt-2.5 text-sm leading-relaxed text-[var(--g-subtle)]">
        {captura.caption}
      </figcaption>
    </figure>
  );
}

/** Esquema de paneles: explica dónde está cada cosa antes de entrar a la herramienta. */
function Esquema({ esquema }: { esquema: EsquemaGuia }) {
  return (
    <figure className="rounded-3xl border border-[var(--g-border)] bg-[var(--g-surface)] p-4 sm:p-6">
      <div
        className="grid gap-2.5 sm:gap-3 sm:[grid-template-columns:var(--cols)]"
        style={{
          // Con tres paneles el del centro (el chat) es el más ancho, como en la herramienta.
          ["--cols" as string]:
            esquema.paneles.length === 3
              ? "minmax(0,1fr) minmax(0,1.3fr) minmax(0,1fr)"
              : `repeat(${esquema.paneles.length}, minmax(0,1fr))`,
        }}
      >
        {esquema.paneles.map((panel, i) => (
          <div
            key={panel.nombre}
            className="flex flex-col rounded-2xl border border-[var(--g-border)] bg-[var(--g-bg)] p-4"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--g-ink)]">
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--g-accent-soft)] text-xs font-semibold text-[var(--g-accent)] tabular-nums"
              >
                {String.fromCharCode(65 + i)}
              </span>
              {panel.nombre}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--g-muted)]">{panel.texto}</p>
          </div>
        ))}
      </div>
      <figcaption className="mt-4 text-sm leading-relaxed text-[var(--g-subtle)]">
        <strong className="font-semibold text-[var(--g-ink)]">{esquema.titulo}.</strong>{" "}
        {esquema.nota ?? "Esquema simplificado: muestra el orden de los paneles, no es una captura."}
      </figcaption>
    </figure>
  );
}

function ListaConCheck({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[var(--g-muted)]">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="mt-1 h-4 w-4 shrink-0 text-[var(--g-ok)]"
          >
            <path
              d="M3.5 8.5l3 3 6-6.5"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const PROSA = "space-y-4 text-[17px] leading-[1.75] text-[var(--g-muted)]";

export default function GuiaPasoAPasoLayout({
  guia,
  relacionadasMap,
}: {
  guia: GuiaPasoAPaso;
  relacionadasMap: Record<string, RelacionadaResumen>;
}) {
  const pais = guia.pais ?? "cl";
  const prefijo = pais === "cl" ? "" : `/${pais}`;
  const rutaGuia = `${prefijo}/guias/${guia.slug}`;
  const curso = datosCursoParaGuia(guia.curso, pais);
  const secundarios = [guia.cursoSecundario, ...(guia.cursosSecundarios ?? [])]
    .filter((s): s is NonNullable<typeof s> => Boolean(s) && s !== guia.curso)
    .filter((s, i, arr) => arr.indexOf(s) === i)
    .map((s) => {
      const d = datosCursoParaGuia(s, pais);
      return { slug: d.slug, nombre: d.nombre };
    });
  const lecturaMin = tiempoLecturaPasoAPaso(guia);
  const actualizado = fechaActualizado(guia.updated);
  const jsonLd = jsonLdDeGuiaPasoAPaso(guia);
  const conPlantilla = Boolean(guia.plantillaArchivo);
  const pasos = guia.secciones;

  const indice: ItemIndice[] = [
    { id: "antes-de-empezar", texto: "Antes de empezar" },
    ...pasos.map((s, i) => ({ id: s.id, texto: sinNumero(s.titulo), numero: i + 1 })),
    ...(guia.erroresComunes.length > 0 ? [{ id: "errores-comunes", texto: "Errores comunes" }] : []),
    ...(conPlantilla ? [{ id: "descarga-plantilla", texto: "Plantilla descargable" }] : []),
    ...(guia.faqs.length > 0 ? [{ id: "preguntas-frecuentes", texto: "Preguntas frecuentes" }] : []),
  ];

  const propsCurso = {
    slugGuia: guia.slug,
    h1: guia.h1,
    cursoSlug: guia.curso,
    curso,
    pais,
  };

  return (
    <GuiaScope>
      <GuiaReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />

      <article className="pb-28 lg:pb-20">
        {/* Encabezado */}
        <header className="border-b border-[var(--g-border)] bg-[var(--g-surface)]">
          <div className="mx-auto max-w-[1320px] px-4 pt-8 pb-10 sm:px-6 lg:px-8 lg:pt-10 lg:pb-14">
            <GuiaBreadcrumbs
              items={[
                { label: "Inicio", href: prefijo || "/" },
                { label: "Guías", href: `${prefijo}/guias` },
                { label: curso.nombre, href: `${prefijo}/cursos/${guia.curso}` },
                { label: guia.h1 },
              ]}
            />

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-12">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 text-sm font-medium text-[var(--g-muted)]">
                  <GuiaToolVisual tool={guia.herramienta} course={guia.curso} size="sm" />
                  Guía paso a paso · {guia.herramienta}
                </div>
                <h1 className="mt-4 max-w-[22ch] text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.06] font-bold tracking-[-0.035em] text-balance text-[var(--g-ink)]">
                  {guia.h1}
                </h1>
                <p className="mt-5 max-w-[62ch] text-lg leading-[1.65] text-pretty text-[var(--g-muted)]">
                  {renderTextoConEnlaces(guia.subtitle)}
                </p>
                <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--g-muted)]">
                  <div className="flex gap-1.5">
                    <dt>Nivel</dt>
                    <dd className="font-semibold text-[var(--g-ink)]">{guia.nivel}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt>Lectura</dt>
                    <dd className="font-semibold text-[var(--g-ink)] tabular-nums">{lecturaMin} min</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt>Práctica</dt>
                    <dd className="font-semibold text-[var(--g-ink)]">{guia.en30Segundos.tiempo}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt>Actualizada</dt>
                    <dd className="font-semibold text-[var(--g-ink)]">
                      <time dateTime={guia.updated}>{actualizado}</time>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Resumen: qué te llevas, para decidir en segundos si es la guía correcta */}
              <aside
                aria-labelledby="resumen-guia-titulo"
                className="rounded-3xl border border-[var(--g-border)] bg-[var(--g-bg)] p-5 sm:p-6"
              >
                <p id="resumen-guia-titulo" className="text-sm font-semibold text-[var(--g-ink)]">
                  Al terminar vas a saber
                </p>
                <div className="mt-4">
                  <ListaConCheck items={guia.en30Segundos.bullets} />
                </div>
              </aside>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_272px]">
            {/* Índice con progreso */}
            <div className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pt-10 pb-6">
                <IndiceEscritorio slug={guia.slug} items={indice} />
              </div>
            </div>

            {/* Contenido */}
            <div className="min-w-0 pt-8 lg:pt-10">
              <div className="mx-auto max-w-[720px]">
                <div className="lg:hidden">
                  <IndiceMovil slug={guia.slug} items={indice} />
                </div>

                {/* Antes de empezar */}
                <section
                  id="antes-de-empezar"
                  aria-labelledby="antes-de-empezar-titulo"
                  className="mt-8 scroll-mt-24 lg:mt-0"
                >
                  <h2
                    id="antes-de-empezar-titulo"
                    className="text-2xl font-bold tracking-[-0.02em] text-[var(--g-ink)]"
                  >
                    Antes de empezar
                  </h2>
                  <div className="mt-5 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5 sm:p-6">
                    <ListaConCheck items={guia.requisitos.lista} />
                    <p className="mt-5 border-t border-[var(--g-border)] pt-4 text-sm leading-relaxed text-[var(--g-muted)]">
                      <strong className="font-semibold text-[var(--g-ink)]">Dónde funciona:</strong>{" "}
                      {guia.requisitos.compatibilidadMacWeb}
                    </p>
                  </div>
                  {guia.esGuiaIA || guia.avisoPrivacidad ? (
                    <GuiaEditorialNote label="Cuida tus datos" tone="caution">
                      <p>{guia.avisoPrivacidad || AVISO_PRIVACIDAD_ESTANDAR}</p>
                    </GuiaEditorialNote>
                  ) : null}
                  {guia.requisitos.avisoEducativo ? (
                    <p className="mt-4 text-sm leading-relaxed text-[var(--g-subtle)]">
                      {guia.requisitos.avisoEducativo}
                    </p>
                  ) : null}
                </section>

                {/* Pasos: línea numerada que se pinta a medida que avanzas */}
                <ol className="mt-14">
                  {pasos.map((sec, idx) => {
                    const numero = idx + 1;
                    const ultimo = idx === pasos.length - 1;
                    return (
                      <li
                        key={sec.id}
                        id={sec.id}
                        aria-labelledby={`${sec.id}-titulo`}
                        className="relative scroll-mt-24 sm:grid sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-x-6"
                      >
                        <div className="relative hidden sm:block">
                          <PasoMarcador slug={guia.slug} stepId={sec.id} numero={numero} />
                          {!ultimo ? <PasoLinea slug={guia.slug} stepId={sec.id} /> : null}
                        </div>

                        <div className={`min-w-0 ${ultimo ? "pb-4" : "pb-16"}`}>
                          <div className="flex items-start gap-3">
                            <span className="sm:hidden">
                              <PasoMarcador slug={guia.slug} stepId={sec.id} numero={numero} size="sm" />
                            </span>
                            <h2
                              id={`${sec.id}-titulo`}
                              className="pt-0.5 text-[1.65rem] leading-tight font-bold tracking-[-0.025em] text-balance text-[var(--g-ink)] sm:pt-1 sm:text-[1.9rem]"
                            >
                              <span className="sr-only">Paso {numero}: </span>
                              {sinNumero(sec.titulo)}
                            </h2>
                          </div>

                          <div className={`mt-5 ${PROSA}`}>
                            {sec.parrafos.map((p, pIdx) => (
                              <p key={pIdx}>{renderTextoConEnlaces(p)}</p>
                            ))}
                          </div>

                          {/* El esquema de la pantalla acompaña al primer paso, que explica qué es la herramienta. */}
                          {idx === 0 && guia.esquema ? (
                            <div className="my-8">
                              <Esquema esquema={guia.esquema} />
                            </div>
                          ) : null}

                          {sec.lista && sec.lista.length > 0 ? (
                            <ul className="mt-5 list-disc space-y-2 pl-5 text-[17px] leading-[1.7] text-[var(--g-muted)] marker:text-[var(--g-subtle)]">
                              {sec.lista.map((item, lIdx) => (
                                <li key={lIdx}>{renderTextoConEnlaces(item)}</li>
                              ))}
                            </ul>
                          ) : null}

                          {sec.listaOrdenada && sec.listaOrdenada.length > 0 ? (
                            <ol className="mt-5 list-decimal space-y-2 pl-5 text-[17px] leading-[1.7] text-[var(--g-muted)] marker:font-semibold marker:text-[var(--g-ink)]">
                              {sec.listaOrdenada.map((item, lIdx) => (
                                <li key={lIdx}>{renderTextoConEnlaces(item)}</li>
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

                          {sec.tabla ? <TablaRender tabla={sec.tabla} /> : null}

                          {sec.codigos?.map((bloque, bIdx) => (
                            <GuiaPasoAPasoCodeBlock key={`${sec.id}-code-${bIdx}`} bloque={bloque} />
                          ))}

                          {sec.captura ? <Captura captura={sec.captura} /> : null}

                          {sec.subsecciones && sec.subsecciones.length > 0 ? (
                            <div className="mt-10 space-y-10">
                              {sec.subsecciones.map((sub) => (
                                <div key={sub.id} id={sub.id} className="scroll-mt-24">
                                  <h3 className="text-xl font-bold tracking-[-0.015em] text-[var(--g-ink)]">
                                    {sub.titulo}
                                  </h3>
                                  <div className={`mt-3 ${PROSA}`}>
                                    {sub.parrafos.map((p, pIdx) => (
                                      <p key={pIdx}>{renderTextoConEnlaces(p)}</p>
                                    ))}
                                  </div>
                                  {sub.lista && sub.lista.length > 0 ? (
                                    <ul className="mt-4 list-disc space-y-2 pl-5 text-[17px] leading-[1.7] text-[var(--g-muted)]">
                                      {sub.lista.map((item, lIdx) => (
                                        <li key={lIdx}>{renderTextoConEnlaces(item)}</li>
                                      ))}
                                    </ul>
                                  ) : null}
                                  {sub.codigo ? <GuiaPasoAPasoCodeBlock bloque={sub.codigo} /> : null}
                                  {sub.tabla ? <TablaRender tabla={sub.tabla} /> : null}
                                  {sub.captura ? <Captura captura={sub.captura} /> : null}
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {sec.verificaResultado ? (
                            <GuiaEditorialNote label="Comprueba que funcionó" tone="success">
                              <p>{sec.verificaResultado}</p>
                            </GuiaEditorialNote>
                          ) : null}

                          <PasoBotonHecho
                            slug={guia.slug}
                            stepId={sec.id}
                            numero={numero}
                            siguienteId={pasos[idx + 1]?.id}
                          />

                          {pasos.length >= 2 && idx === Math.floor(pasos.length / 2) - 1 ? (
                            <aside
                              aria-label={`Aplica ${curso.nombre} en vivo`}
                              className="mt-8 rounded-2xl border border-[var(--g-border-strong)] bg-[var(--g-surface)] p-5 sm:p-6"
                            >
                              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
                                Siguiente paso práctico
                              </p>
                              <p className="mt-1 text-lg font-bold tracking-[-0.015em] text-[var(--g-ink)]">
                                Practica {curso.nombre} en vivo con casos reales
                              </p>
                              <p className="mt-1.5 text-sm leading-relaxed text-[var(--g-muted)]">
                                {curso.horas} horas en vivo por Zoom
                                {curso.textoCuotas ? ` · ${curso.textoCuotas}` : ""}. Revisa el programa completo o coordina tu clase gratis por WhatsApp.
                              </p>
                              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                                <Link
                                  href={`${prefijo}/cursos/${guia.curso}`}
                                  className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--g-ink)] px-5 text-sm font-semibold text-[var(--g-surface)] no-underline transition-opacity hover:opacity-90"
                                >
                                  Ver temario y precios
                                </Link>
                                <WhatsAppCta
                                  page={rutaGuia}
                                  intent="curso"
                                  course={curso.nombre}
                                  courseSlug={guia.curso}
                                  country={pais}
                                  ctaPosition="guia_mid"
                                  customText={
                                    OFERTA_CLASE_GRATIS_WHATSAPP
                                      ? `Hola, vengo de la guía ${guia.h1} y quiero la clase gratis del curso de ${curso.nombre} [${guia.slug}]`
                                      : `Hola, vengo de la guía ${guia.h1} y quiero información del curso de ${curso.nombre} [${guia.slug}]`
                                  }
                                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-5 text-sm font-semibold text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-ink)]"
                                >
                                  {OFERTA_CLASE_GRATIS_WHATSAPP ? "Pedir clase gratis" : "Consultar por WhatsApp"}
                                </WhatsAppCta>
                              </div>
                            </aside>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {/* Errores comunes */}
                {guia.erroresComunes.length > 0 ? (
                  <section
                    id="errores-comunes"
                    aria-labelledby="errores-comunes-titulo"
                    className="mt-16 scroll-mt-24"
                  >
                    <h2
                      id="errores-comunes-titulo"
                      className="text-2xl font-bold tracking-[-0.02em] text-[var(--g-ink)]"
                    >
                      Si algo no funciona
                    </h2>
                    <p className="mt-2 text-base text-[var(--g-muted)]">
                      Los tropiezos más comunes, por qué pasan y cómo salir de ellos.
                    </p>
                    <div className="mt-6 divide-y divide-[var(--g-border)] rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)]">
                      {guia.erroresComunes.map((item) => (
                        <article key={item.error} className="p-5 sm:p-6">
                          <h3 className="text-lg leading-snug font-bold text-[var(--g-ink)]">{item.error}</h3>
                          <dl className="mt-3 grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div>
                              <dt className="text-sm font-semibold text-[var(--g-subtle)]">Por qué pasa</dt>
                              <dd className="mt-1 text-[15px] leading-relaxed text-[var(--g-muted)]">
                                {item.causa}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-semibold text-[var(--g-ok)]">Qué hacer</dt>
                              <dd className="mt-1 text-[15px] leading-relaxed text-[var(--g-ink)]">
                                {item.solucion}
                              </dd>
                            </div>
                          </dl>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null}

                {/* Plantilla o recurso descargable al final del artículo */}
                {guia.plantillaArchivo ? (
                  <section
                    id="descarga-plantilla"
                    aria-labelledby="descarga-plantilla-titulo"
                    className="mt-16 scroll-mt-24 rounded-3xl border border-[var(--g-border)] bg-[var(--g-surface)] p-6 sm:p-8"
                  >
                    <p className="text-sm font-medium text-[var(--g-muted)]">Plantilla gratis · Excel (.xlsx)</p>
                    <h2
                      id="descarga-plantilla-titulo"
                      className="mt-1 text-2xl font-bold tracking-[-0.02em] text-[var(--g-ink)]"
                    >
                      {guia.plantilla.titulo}
                    </h2>
                    <p className="mt-2 text-base leading-relaxed text-[var(--g-muted)]">
                      {guia.plantilla.descripcion}
                    </p>
                    <div className="mt-5">
                      <PlantillaDescarga
                        pais={pais}
                        country={pais}
                        location={`guia:${guia.slug}`}
                        page={rutaGuia}
                        label="Descargar plantilla Excel (.xlsx)"
                        recurso={guia.plantillaArchivo.recurso}
                        archivoUrl={guia.plantillaArchivo.archivoUrl}
                        nombreArchivo={guia.plantillaArchivo.nombreArchivo}
                        course={curso.nombre}
                        courseSlug={guia.curso}
                        mostrarWhatsappAlternativo
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--g-ink)] px-6 text-sm font-semibold text-[var(--g-surface)] transition-opacity hover:opacity-90 disabled:opacity-60"
                      />
                    </div>
                  </section>
                ) : (
                  <section
                    id="descarga-temario"
                    aria-labelledby="descarga-temario-titulo"
                    className="mt-16 scroll-mt-24 rounded-3xl border border-[var(--g-border)] bg-[var(--g-surface)] p-6 sm:p-8"
                  >
                    <p className="text-sm font-medium text-[var(--g-muted)]">Recurso descargable · PDF</p>
                    <h2
                      id="descarga-temario-titulo"
                      className="mt-1 text-2xl font-bold tracking-[-0.02em] text-[var(--g-ink)]"
                    >
                      Descarga el PDF «Temario y precios» de {curso.nombre}
                    </h2>
                    <p className="mt-2 text-base leading-relaxed text-[var(--g-muted)]">
                      Accede al programa módulo por módulo, horarios locales y valores vigentes en la ficha del curso.
                    </p>
                    <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                      <Link
                        href={`${prefijo}/cursos/${guia.curso}#inscripcion`}
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--g-ink)] px-6 text-sm font-semibold text-[var(--g-surface)] no-underline transition-opacity hover:opacity-90"
                      >
                        Descargar Temario y precios (PDF)
                      </Link>
                      <WhatsAppCta
                        page={rutaGuia}
                        intent="curso"
                        course={curso.nombre}
                        courseSlug={guia.curso}
                        country={pais}
                        ctaPosition="guia_end"
                        customText={
                          OFERTA_CLASE_GRATIS_WHATSAPP
                            ? `Hola, vengo de la guía ${guia.h1} y quiero la clase gratis del curso de ${curso.nombre} [${guia.slug}]`
                            : `Hola, vengo de la guía ${guia.h1} y quiero información del curso de ${curso.nombre} [${guia.slug}]`
                        }
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-6 text-sm font-semibold text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-ink)]"
                      >
                        {OFERTA_CLASE_GRATIS_WHATSAPP ? "Pedir clase gratis por WhatsApp" : "Consultar por WhatsApp"}
                      </WhatsAppCta>
                    </div>
                  </section>
                )}

                <GuiaPasoAPasoFaq faqs={guia.faqs} />

                {/* Fuentes */}
                {guia.enlacesExternos.length > 0 ||
                (guia.enlacesInternosExtra && guia.enlacesInternosExtra.length > 0) ? (
                  <section aria-labelledby="fuentes-oficiales" className="mt-16">
                    <h2
                      id="fuentes-oficiales"
                      className="text-2xl font-bold tracking-[-0.02em] text-[var(--g-ink)]"
                    >
                      Fuentes
                    </h2>
                    {guia.fuentesConsultadas ? (
                      <p className="mt-2 text-sm text-[var(--g-subtle)]">
                        Revisadas el <time dateTime={guia.fuentesConsultadas}>{fechaActualizado(guia.fuentesConsultadas)}</time>.
                      </p>
                    ) : null}
                    {guia.enlacesExternos.length > 0 ? (
                      <ul className="mt-4 divide-y divide-[var(--g-border)] border-y border-[var(--g-border)]">
                        {guia.enlacesExternos.map((ext) => (
                          <li key={ext.url}>
                            <a
                              href={ext.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex min-h-[52px] items-center justify-between gap-4 py-3 no-underline"
                            >
                              <span className="text-[15px] font-medium text-[var(--g-ink)] group-hover:text-[var(--g-accent)] group-hover:underline group-hover:underline-offset-4">
                                {ext.label}
                              </span>
                              <span className="shrink-0 text-sm text-[var(--g-subtle)]">{ext.fuente}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {guia.enlacesInternosExtra && guia.enlacesInternosExtra.length > 0 ? (
                      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                        {guia.enlacesInternosExtra.map((int) => (
                          <li key={int.href}>
                            <Link
                              href={int.href}
                              className="block h-full rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-4 no-underline transition-colors hover:border-[var(--g-ink)]"
                            >
                              <span className="block text-[15px] font-semibold text-[var(--g-ink)]">{int.label}</span>
                              {int.descripcion ? (
                                <span className="mt-1 block text-sm leading-relaxed text-[var(--g-muted)]">
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

                {/* Cierre con el curso */}
                <div className="mt-16">
                  <GuiaCursoCierre
                    {...propsCurso}
                    secundarios={secundarios}
                    ctaPosition="guia_end"
                  />
                </div>

                {/* Guías relacionadas */}
                <nav aria-labelledby="guias-relacionadas-titulo" className="mt-16">
                  <h2
                    id="guias-relacionadas-titulo"
                    className="text-2xl font-bold tracking-[-0.02em] text-[var(--g-ink)]"
                  >
                    Sigue con estas guías
                  </h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                    {guia.relacionadas.map((relSlug) => {
                      const rel = relacionadasMap[relSlug];
                      return (
                        <li key={relSlug} className="min-w-0">
                          <Link
                            href={rel?.path ?? `${prefijo}/guias/${relSlug}`}
                            className="group flex h-full flex-col rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5 no-underline transition-colors hover:border-[var(--g-ink)]"
                          >
                            <div className="flex items-center gap-2 text-sm text-[var(--g-muted)]">
                              <GuiaToolVisual tool={rel?.herramienta} size="sm" />
                              {rel?.nivel ?? "Guía"}
                            </div>
                            <span className="mt-3 block text-[15px] leading-snug font-semibold text-[var(--g-ink)] group-hover:underline group-hover:underline-offset-4">
                              {rel?.h1 ?? relSlug.replace(/-/g, " ")}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </div>

            {/* Curso en la columna derecha (pantallas anchas) */}
            <div className="hidden xl:block">
              <div className="sticky top-24 pt-10">
                <GuiaCursoLateral {...propsCurso} ctaPosition="guia_sidebar" />
              </div>
            </div>
          </div>
        </div>
      </article>

      <GuiaPasoAPasoStickyWa
        slug={guia.slug}
        h1={guia.h1}
        cursoSlug={guia.curso}
        cursoNombre={curso.nombre}
        pais={pais}
      />
    </GuiaScope>
  );
}
