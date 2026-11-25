import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import CtaDatosMx from "@/components/datos-mx/CtaDatosMx";
import {
  getCarreraMxPorSlug,
  getMetaCarrerasMx,
  getSlugsCarrerasMx,
} from "@/lib/datos-mx/carreras";
import { cursosAfinesCarreraMx } from "@/lib/datos-mx/cursos-afines";
import { enteroMx, pesosMx, porcentajeMx } from "@/lib/datos-mx/formato";
import {
  jsonLdFichaCarreraMx,
  metadataFichaCarreraMx,
} from "@/lib/datos-mx/seo";
import {
  faqsFichaMx,
  h1FichaMx,
  narrativaUnicaFichaMx,
  relacionadasFichaMx,
} from "@/lib/datos-mx/textos";
import { jsonLdString } from "@/lib/seo";


type Params = { pais: string; slug: string };


export async function metadataMxFicha({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pais, slug } = await params;
  if (pais !== "mx") return {};

  const carrera = getCarreraMxPorSlug(slug);
  if (!carrera) return {};

  return metadataFichaCarreraMx(carrera);
}

export async function PageMxFicha({
  params,
}: {
  params: Promise<Params>;
}) {
  const { pais, slug } = await params;
  if (pais !== "mx") notFound();

  const carrera = getCarreraMxPorSlug(slug);
  if (!carrera) notFound();

  const meta = getMetaCarrerasMx();
  const h1 = h1FichaMx(carrera);
  const narrativa = narrativaUnicaFichaMx(carrera);
  const relacionadas = relacionadasFichaMx(carrera, 4);
  const cursosAfines = cursosAfinesCarreraMx(carrera);
  const faqs = faqsFichaMx(carrera);
  const jsonLd = jsonLdFichaCarreraMx(carrera, faqs);

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-10 sm:px-6 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <nav aria-label="Ruta de navegación" className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/mx" className="hover:text-foreground">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/mx/datos" className="hover:text-foreground">
              Datos de México
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/mx/datos/carreras" className="hover:text-foreground">
              Carreras
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-foreground">{carrera.carrera}</li>
        </ol>
      </nav>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border bg-surface px-3 py-1 font-medium">
            Lugar #{carrera.posicionIngreso} de {meta.totalPublicables} en
            México
          </span>
          {carrera.esTsu ? (
            <span className="rounded-full border border-border bg-surface px-3 py-1 font-medium">
              Técnico Superior Universitario (TSU)
            </span>
          ) : null}
          <span>
            Fuente:{" "}
            <a
              href={meta.fuenteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-4 hover:text-foreground"
            >
              {meta.fuente}
            </a>
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {h1}
        </h1>

        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          {narrativa}
        </p>
      </header>

      {/* KPIs principales (si es carrera 125 sin desocupación, omite ese KPI) */}
      <section aria-labelledby="kpis-heading" className="space-y-3">
        <h2 id="kpis-heading" className="sr-only">
          Indicadores principales
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Ingreso mensual promedio
            </p>
            <p className="mt-1.5 text-2xl font-bold text-foreground tabular-nums">
              {pesosMx(carrera.ingreso)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Mediana (Q50): {pesosMx(carrera.ingresoQ50)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Rango salarial P25–P75
            </p>
            <p className="mt-1.5 text-xl font-bold text-foreground tabular-nums">
              {carrera.ingresoQ25 !== null && carrera.ingresoQ75 !== null
                ? `${pesosMx(carrera.ingresoQ25)} – ${pesosMx(carrera.ingresoQ75)}`
                : "s/i"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              50 % central de profesionistas
            </p>
          </div>

          {carrera.tasaDesocupacion !== null ? (
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-xs font-medium text-muted-foreground">
                Tasa de desocupación
              </p>
              <p className="mt-1.5 text-2xl font-bold text-foreground tabular-nums">
                {porcentajeMx(carrera.tasaDesocupacion)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ocupación: {porcentajeMx(carrera.tasaOcupacion)}
              </p>
            </div>
          ) : null}

          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Tasa de informalidad
            </p>
            <p className="mt-1.5 text-2xl font-bold text-foreground tabular-nums">
              {porcentajeMx(carrera.tasaInformalidad)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {enteroMx(carrera.ocupado)} personas ocupadas
            </p>
          </div>
        </div>
      </section>

      {/* Desglose salarial y educación */}
      <section
        aria-labelledby="detalle-carrera-heading"
        className="grid gap-6 md:grid-cols-2"
      >
        <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
          <h2
            id="detalle-carrera-heading"
            className="text-lg font-bold text-foreground"
          >
            Distribución del ingreso en México
          </h2>
          <dl className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2.5">
              <dt className="text-muted-foreground">Empleo formal</dt>
              <dd className="font-semibold text-foreground tabular-nums">
                {pesosMx(carrera.ingresoFormal)}
              </dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-muted-foreground">Empleo informal</dt>
              <dd className="font-semibold text-foreground tabular-nums">
                {pesosMx(carrera.ingresoInformal)}
              </dd>
            </div>
            {carrera.ingresoLic !== null ? (
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Nivel licenciatura</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {pesosMx(carrera.ingresoLic)}
                </dd>
              </div>
            ) : null}
            {carrera.ingresoPosgrado !== null ? (
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Con posgrado</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {pesosMx(carrera.ingresoPosgrado)}
                </dd>
              </div>
            ) : null}
            {carrera.ingresoMujer !== null && carrera.ingresoHombre !== null ? (
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Mujeres / Hombres</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {pesosMx(carrera.ingresoMujer)} /{" "}
                  {pesosMx(carrera.ingresoHombre)}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <GraduationCap className="size-5" />
            Matrícula, egresados y admisión (ANUIES)
          </h2>
          <dl className="divide-y divide-border text-sm">
            {carrera.matricula !== null ? (
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Matrícula total</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {enteroMx(carrera.matricula)}
                </dd>
              </div>
            ) : null}
            {carrera.egresados !== null ? (
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Egresados anuales</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {enteroMx(carrera.egresados)}
                </dd>
              </div>
            ) : null}
            {carrera.solicitudes !== null ? (
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Solicitudes de ingreso</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {enteroMx(carrera.solicitudes)}
                </dd>
              </div>
            ) : null}
            {carrera.lugares !== null ? (
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Lugares disponibles</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {enteroMx(carrera.lugares)}
                </dd>
              </div>
            ) : null}
            {carrera.tasaAceptacion !== null ? (
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Tasa de aceptación</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {porcentajeMx(carrera.tasaAceptacion, 0)}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      {/* Cursos afines + CTA Excel México */}
      <CtaDatosMx
        page={`/mx/datos/carreras/${carrera.slug}`}
        cursosAfines={cursosAfines}
        ctaPosition="datos_mx_ficha_cta"
      />

      {/* Carreras relacionadas SSR */}
      <section aria-labelledby="relacionadas-heading" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="relacionadas-heading"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              Carreras con ingreso similar en México
            </h2>
            <p className="text-sm text-muted-foreground">
              Compara sueldos y campo laboral con otras carreras del ranking IMCO
              2026.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold">
            <Link
              href="/mx/datos/carreras"
              className="inline-flex items-center gap-1 text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Todas las {meta.totalPublicables} carreras
            </Link>
            <Link
              href="/mx/datos/carreras-mejor-pagadas"
              className="inline-flex items-center gap-1 text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Ver ranking completo
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {relacionadas.map((rel) => (
            <Link
              key={rel.cveCarrera}
              href={`/mx/datos/carreras/${rel.slug}`}
              className="group rounded-xl border border-border bg-surface p-4 transition-colors hover:border-foreground/30 hover:bg-surface-hover/50"
            >
              <p className="text-xs font-semibold text-muted-foreground tabular-nums">
                Lugar #{rel.posicionIngreso}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:underline">
                {rel.carrera}
              </h3>
              <p className="mt-2 text-sm font-bold text-foreground tabular-nums">
                {pesosMx(rel.ingreso)}/mes
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                Informalidad: {porcentajeMx(rel.tasaInformalidad)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section aria-labelledby="faq-ficha-heading" className="space-y-4">
        <h2
          id="faq-ficha-heading"
          className="text-xl font-bold tracking-tight text-foreground"
        >
          Preguntas frecuentes sobre {carrera.carrera}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.pregunta}
              className="rounded-xl border border-border bg-surface p-5"
              open
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-foreground">
                {faq.pregunta}
              </summary>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {faq.respuesta}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
