"use client";

/**
 * Vista imprimible del brochure (dossier ejecutivo).
 *
 * Los precios llegan ya formateados desde el servidor: esta ruta es uno de los
 * pocos lugares donde un monto puede estar en el HTML inicial. La barra de
 * acciones se oculta al imprimir y el cuerpo queda en A4.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  Building2,
  CalendarDays,
  Check,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Infinity as InfinityIcon,
  MonitorPlay,
  Printer,
} from "lucide-react";
import { COUNTRIES } from "@/lib/context/CountryContext";
import { esIsoPais } from "@/config/paises";
import { courseBrochureUrl } from "@/lib/pricing-gate";
import { generateCoursePdf } from "@/lib/brochure/generate-course-pdf";
import type {
  BrochureProfesor,
  CourseBrochureData,
} from "@/lib/brochure/brochure-data";

const PAISES_DISPONIBLES = COUNTRIES.filter((pais) => esIsoPais(pais.iso));

/**
 * Equipo docente fijo del brochure: Manuel Oliva, Emanuel Berrocal y
 * Rodrigo Vega (los tres primeros mentores por `sortOrder`). Los datos llegan
 * desde `getCourseBrochureData`, que los lee de `lib/data/mentors.ts`.
 */

function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

function RetratoProfesor({ profesor }: { profesor: BrochureProfesor }) {
  const [rota, setRota] = useState(false);

  if (!profesor.imageUrl || rota) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-wash">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-canvas text-3xl font-semibold text-mute">
          {iniciales(profesor.name)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={profesor.imageUrl}
      alt={`Retrato de ${profesor.name}`}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setRota(true)}
      className="aspect-[4/5] w-full object-cover"
    />
  );
}

function ImagenCurso({ data }: { data: CourseBrochureData }) {
  const [rota, setRota] = useState(false);

  if (rota) {
    return (
      <div
        className="flex aspect-[4/3] w-full flex-col justify-end gap-3 p-8"
        style={{
          background: `linear-gradient(140deg, ${data.accentColor}26, ${data.accentColor}05)`,
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mute">
          {data.categoryLabel}
        </p>
        <p className="text-3xl font-semibold tracking-tight text-ink">
          {data.title}
        </p>
        <div className="flex flex-wrap gap-2">
          {data.techStack.map((herramienta) => (
            <span
              key={herramienta}
              className="rounded-full border border-line-strong bg-paper px-3 py-1 text-xs font-medium text-mute"
            >
              {herramienta}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <img
      src={data.imageUrl}
      alt={`${data.title} — ProgramBI`}
      referrerPolicy="no-referrer"
      onError={() => setRota(true)}
      className="aspect-[4/3] w-full object-cover"
    />
  );
}

export function CourseBrochureClient({ data }: { data: CourseBrochureData }) {
  const router = useRouter();
  const [generando, setGenerando] = useState(false);
  const [errorPdf, setErrorPdf] = useState<string | null>(null);

  const descargar = async () => {
    if (generando) return;
    setGenerando(true);
    setErrorPdf(null);
    try {
      await generateCoursePdf(data);
    } catch {
      setErrorPdf(
        "No pudimos generar el PDF en este navegador. Usa «Imprimir / Guardar PDF» y elige «Guardar como PDF»."
      );
    } finally {
      setGenerando(false);
    }
  };

  const equivalencias: { mercado: string; hora: string }[] = [
    { mercado: data.paisNombre, hora: data.equivalencias.inicio },
  ];
  for (const tramo of data.equivalencias.cadenaMercados.split(" = ")) {
    const partes = tramo.match(/^(\d{1,2}:\d{2})\s+en\s+(.+)$/);
    if (partes && partes[2] !== data.paisNombre) {
      equivalencias.push({ mercado: partes[2], hora: partes[1] });
    }
  }

  return (
    <div className="brochure-page bg-paper text-ink">
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white !important; }
          .brochure-no-print { display: none !important; }
          .brochure-page { background: white !important; }
          .brochure-card { box-shadow: none !important; break-inside: avoid; }
        }
      `}</style>

      {/* Barra de acciones */}
      <div className="brochure-no-print sticky top-[72px] z-40 border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-3 px-5 py-3 md:px-8">
          <div className="mr-auto flex min-w-0 items-center gap-3">
            <span className="text-lg font-semibold tracking-tight text-ink">
              ProgramBI
            </span>
            <span className="hidden h-4 w-px bg-line-strong sm:block" />
            <span className="hidden truncate text-sm text-mute sm:block">
              {data.title}
            </span>
          </div>

          <label className="sr-only" htmlFor="brochure-pais">
            Cambiar país
          </label>
          <select
            id="brochure-pais"
            value={data.pais}
            onChange={(event) =>
              router.push(courseBrochureUrl(data.slug, event.target.value))
            }
            className="h-10 rounded-full border border-line-strong bg-canvas px-3 text-sm font-medium text-ink"
          >
            {PAISES_DISPONIBLES.map((pais) => (
              <option key={pais.iso} value={pais.iso}>
                {pais.name} · {pais.currency.code}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={descargar}
            disabled={generando}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-canvas disabled:cursor-wait disabled:opacity-60"
          >
            <Download size={16} />
            {generando ? "Generando…" : "Descargar PDF"}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-semibold text-ink"
          >
            <Printer size={16} />
            Imprimir / Guardar PDF
          </button>

          {data.customPdfUrl ? (
            <a
              href={data.customPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-semibold text-ink"
            >
              <FileText size={16} />
              PDF oficial
            </a>
          ) : null}

          <a
            href={data.inscripcionUrl}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-canvas"
          >
            Inscribirme Ahora
            <ArrowRight size={16} />
          </a>
        </div>
        {errorPdf ? (
          <div className="mx-auto max-w-[1180px] px-5 pb-3 text-sm text-mute md:px-8">
            {errorPdf}
          </div>
        ) : null}
      </div>

      <div className="mx-auto max-w-[1180px] px-5 pb-20 md:px-8">
        {/* Hero */}
        <section className="grid gap-10 pt-12 md:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-mute">
              Brochure oficial · {data.categoryLabel}
            </span>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-ink md:text-6xl">
              {data.title}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mute">
              {data.shortDescription}
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {data.insignia.split(" · ").map((beneficio) => (
                <li
                  key={beneficio}
                  className="flex items-center gap-2 text-sm font-medium text-ink"
                >
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: data.accentColor }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {beneficio}
                </li>
              ))}
            </ul>
          </div>

          <div className="brochure-card overflow-hidden rounded-[26px] border border-line bg-white">
            <ImagenCurso data={data} />
            <div className="border-t border-line px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mute">
                Programa en vivo · {data.paisNombre}
              </p>
              <p className="mt-1 text-sm text-ink">
                {data.techStack.join(" · ")}
              </p>
            </div>
          </div>
        </section>

        {/* Métricas */}
        <section className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {[
            { icono: Clock, valor: `${data.hours} h`, etiqueta: data.levelsCount > 1 ? "por nivel" : "en vivo" },
            { icono: FileText, valor: `${data.modulesCount}`, etiqueta: "módulos" },
            { icono: GraduationCap, valor: `${data.levelsCount}`, etiqueta: "niveles" },
            { icono: MonitorPlay, valor: "Zoom", etiqueta: "clases en vivo" },
            { icono: InfinityIcon, valor: "De por vida", etiqueta: "grabaciones" },
            { icono: Award, valor: "Digital", etiqueta: "certificado verificable" },
          ].map((metrica) => {
            const Icono = metrica.icono;
            return (
              <div
                key={metrica.etiqueta}
                className="brochure-card rounded-2xl border border-line bg-white px-5 py-5"
              >
                <Icono size={18} className="text-mute" />
                <p className="mt-3 text-xl font-semibold tracking-tight text-ink">
                  {metrica.valor}
                </p>
                <p className="text-xs text-mute">{metrica.etiqueta}</p>
              </div>
            );
          })}
        </section>

        {/* Inversión */}
        <section id="inversion" className="brochure-section mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mute">
            Inversión
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Precio oficial en {data.paisNombre}
          </h2>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="brochure-card rounded-[26px] border border-line bg-white p-7 md:p-10">
              <div className="flex flex-wrap items-end gap-4">
                <p className="text-5xl font-semibold tracking-tight text-ink md:text-6xl">
                  {data.precioFormateado}
                </p>
                {data.precioListaFormateado ? (
                  <p className="pb-1 text-xl text-mute line-through">
                    {data.precioListaFormateado}
                  </p>
                ) : null}
                {data.descuentoPct > 0 ? (
                  <span
                    className="mb-1 rounded-full px-3 py-1 text-sm font-semibold"
                    style={{
                      backgroundColor: `${data.accentColor}1f`,
                      color: data.accentColor,
                    }}
                  >
                    −{data.descuentoPct}%
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-sm text-mute">
                Moneda: {data.moneda} ({data.simbolo}) · Actualizado{" "}
                {data.actualizado}
              </p>

              <div className="mt-7 rounded-2xl bg-wash px-6 py-5">
                <p className="text-sm font-semibold text-ink">
                  {data.cuotaTexto}
                </p>
                <p className="mt-1 text-sm text-mute">{data.notaCuotas}</p>
              </div>

              <p className="mt-6 text-sm text-mute">{data.notaPago}</p>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mute">
                  Medios de pago
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {data.mediosPago.map((medio) => (
                    <li
                      key={medio}
                      className="rounded-full border border-line-strong px-3 py-1.5 text-xs font-medium text-ink"
                    >
                      {medio}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-[26px] bg-ink p-8 text-canvas">
              <div>
                <Award size={22} />
                <p className="mt-5 text-2xl font-semibold leading-tight tracking-tight">
                  Inscríbete en línea y asegura tu cupo.
                </p>
                <p className="mt-3 text-sm text-canvas/70">
                  Recibes el enlace de las clases, el material y el acceso al
                  campus el mismo día de la inscripción.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={data.inscripcionUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-canvas px-5 py-3 text-sm font-semibold text-ink"
                >
                  Inscribirme Ahora
                  <ArrowRight size={16} />
                </a>
                {data.whatsappUrl ? (
                  <a
                    href={data.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-canvas/30 px-5 py-3 text-sm font-semibold text-canvas"
                  >
                    Hablar por WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* Fechas y horarios */}
        <section className="brochure-section mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mute">
                Calendario
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                Próximas fechas
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-ink">
              <CalendarDays size={16} />
              Hora de {data.paisNombre}
            </span>
          </div>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-mute">
            Las clases se dictan desde Chile y cada horario está convertido a la
            hora local de {data.paisNombre}. Si no puedes asistir en vivo, la
            grabación queda disponible en el campus.
          </p>

          {data.schedules.length === 0 ? (
            <div className="mt-8 rounded-[26px] border border-line bg-white px-7 py-8">
              <p className="text-2xl font-semibold tracking-tight text-ink">
                Cupos abiertos — consulta fecha
              </p>
              <p className="mt-2 max-w-2xl text-sm text-mute">
                La próxima cohorte se confirma por WhatsApp o al inscribirte en
                línea. Escríbenos y te avisamos con la fecha exacta y el horario
                de tu país.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {data.schedules.map((cohorte) => (
                <div
                  key={cohorte.id}
                  className="brochure-card rounded-2xl border border-line bg-white px-6 py-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mute">
                        {cohorte.nivel}
                      </p>
                      <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
                        {cohorte.fecha}
                      </p>
                      <p className="mt-1 text-sm text-mute">
                        {cohorte.dias}
                        {cohorte.hours ? ` · ${cohorte.hours} horas` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-base font-semibold"
                        style={{ color: data.accentColor }}
                      >
                        {cohorte.horario}
                      </p>
                      <p className="mt-1 text-xs text-faint">
                        {cohorte.horaChile}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 overflow-hidden rounded-[26px] border border-line bg-white">
            <div className="border-b border-line px-6 py-5">
              <p className="text-sm font-semibold text-ink">
                La misma clase en cada mercado
              </p>
              <p className="mt-1 text-xs text-mute">
                Hora de inicio local · {data.equivalencias.offset} en{" "}
                {data.paisNombre} · término {data.equivalencias.fin}
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-wash text-left text-xs uppercase tracking-[0.14em] text-mute">
                  <th className="px-6 py-3 font-semibold">Mercado</th>
                  <th className="px-6 py-3 text-right font-semibold">
                    Hora de inicio
                  </th>
                </tr>
              </thead>
              <tbody>
                {equivalencias.map((fila) => (
                  <tr key={fila.mercado} className="border-t border-line">
                    <td className="px-6 py-3 text-ink">{fila.mercado}</td>
                    <td className="px-6 py-3 text-right font-semibold text-ink">
                      {fila.hora}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Equipo docente */}
        <section className="brochure-section mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mute">
            Equipo docente
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Quién te enseña
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-mute">
            Profesionales en ejercicio que dictan lo mismo que aplican en banca,
            minería y retail. Clases en vivo, con espacio para preguntas y
            revisión de tus proyectos.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {data.profesores.map((profesor) => (
              <article
                key={profesor.name}
                className="brochure-card overflow-hidden rounded-[26px] border border-line bg-white"
              >
                <RetratoProfesor profesor={profesor} />
                <div className="p-6">
                  <h3 className="text-xl font-semibold tracking-tight text-ink">
                    {profesor.name}
                  </h3>
                  <p
                    className="mt-1 text-sm font-semibold"
                    style={{ color: data.accentColor }}
                  >
                    {profesor.role}
                  </p>
                  <p className="text-sm text-mute">{profesor.title}</p>

                  <ul className="mt-4 space-y-2">
                    {profesor.credentials.map((credencial) => (
                      <li
                        key={credencial}
                        className="flex gap-2 text-sm leading-snug text-mute"
                      >
                        <Check
                          size={14}
                          className="mt-0.5 shrink-0"
                          style={{ color: data.accentColor }}
                        />
                        {credencial}
                      </li>
                    ))}
                  </ul>

                  {profesor.founderCareer.length > 0 ? (
                    <p className="mt-4 text-xs leading-relaxed text-faint">
                      {profesor.founderCareer.join(" · ")}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[26px] border border-line bg-wash px-6 py-6">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-mute">
              <Building2 size={14} />
              Empresas que capacitaron a sus equipos con ProgramBI
            </p>
            <p className="mt-3 text-sm font-medium leading-relaxed text-ink">
              {data.empresas.join(" · ")}
            </p>
          </div>
        </section>

        {/* Programa académico */}
        <section className="brochure-section mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mute">
            Programa académico
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Todo lo que vas a dominar
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-mute">
            {data.modulesCount} módulos organizados por nivel. Cada módulo
            combina clase en vivo, práctica guiada y proyecto.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {data.whatYouLearn.map((resultado) => (
              <div
                key={resultado}
                className="flex gap-3 rounded-2xl border border-line bg-white px-5 py-4"
              >
                <Check
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: data.accentColor }}
                />
                <p className="text-sm leading-relaxed text-ink">{resultado}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-10">
            {data.temario.map((nivel) => (
              <div key={nivel.label}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-strong pb-3">
                  <h3 className="text-xl font-semibold tracking-tight text-ink">
                    {nivel.label}
                  </h3>
                  {nivel.shortLabel ? (
                    <span className="rounded-full bg-wash px-3 py-1 text-xs font-semibold text-mute">
                      {nivel.shortLabel}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {nivel.modules.map((modulo) => (
                    <article
                      key={`${nivel.label}-${modulo.title}`}
                      className="brochure-card rounded-2xl border border-line bg-white p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-base font-semibold leading-snug text-ink">
                          {modulo.title}
                        </h4>
                        {modulo.hours ? (
                          <span
                            className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                            style={{
                              backgroundColor: `${data.accentColor}1f`,
                              color: data.accentColor,
                            }}
                          >
                            {modulo.hours} h
                          </span>
                        ) : null}
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {modulo.topics.map((tema) => (
                          <li
                            key={tema}
                            className="flex gap-2 text-sm leading-snug text-mute"
                          >
                            <span
                              className="mt-2 h-1 w-1 shrink-0 rounded-full"
                              style={{ backgroundColor: data.accentColor }}
                            />
                            {tema}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cierre */}
        <section className="brochure-section mt-16">
          <div className="rounded-[26px] bg-ink px-8 py-10 text-canvas md:px-12 md:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-canvas/60">
              Certificado digital verificable
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Termina el programa con un certificado que puedes mostrar.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-canvas/70">
              Al completar los módulos recibes tu certificado digital con código
              de verificación, además del acceso permanente a las grabaciones y
              al material del curso.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={data.inscripcionUrl}
                className="inline-flex items-center gap-2 rounded-full bg-canvas px-5 py-3 text-sm font-semibold text-ink"
              >
                Inscribirme Ahora
                <ArrowRight size={16} />
              </a>
              {data.whatsappUrl ? (
                <a
                  href={data.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-canvas/30 px-5 py-3 text-sm font-semibold text-canvas"
                >
                  Hablar por WhatsApp
                </a>
              ) : null}
            </div>
            <p className="mt-8 text-xs text-canvas/50">
              Brochure actualizado {data.actualizado} · Precios en {data.moneda}{" "}
              para {data.paisNombre} · programbi.com
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
