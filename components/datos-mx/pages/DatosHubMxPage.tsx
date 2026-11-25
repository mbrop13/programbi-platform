import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BarChart3, Calculator, FileSpreadsheet, Scale } from "lucide-react";
import CtaDatosMx from "@/components/datos-mx/CtaDatosMx";
import { getCarrerasPublicablesMx, getMetaCarrerasMx } from "@/lib/datos-mx/carreras";
import { pesosMx, pesosMxExacto } from "@/lib/datos-mx/formato";
import {
  PRESTACIONES_LFT_2026_MX,
  SALARIO_MINIMO_2026_MX,
  UMA_2026_MX,
} from "@/lib/datos-mx/parametros";
import {
  buildLanguagesMx,
  canonicalMxUrl,
  jsonLdBreadcrumbListMx,
} from "@/lib/datos-mx/seo";
import { GUIAS_PASO_A_PASO_MX } from "@/lib/guias/paso-a-paso-mx";
import { jsonLdString } from "@/lib/seo";



const TITLE =
  "Datos laborales de México: aguinaldo, ISR, PTU y carreras | ProgramBI";
const DESCRIPTION =
  "Guías y plantillas de Excel para calcular aguinaldo, finiquito, ISR 2026 y PTU en México, más parámetros oficiales (UMA y salario mínimo 2026) y sueldos de 75 carreras.";

export async function metadataMxHub({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "mx") return {};

  const canonical = canonicalMxUrl("/mx/datos");

  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: {
      canonical,
      languages: buildLanguagesMx(canonical),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "ProgramBI",
      locale: "es_MX",
      url: canonical,
      title: TITLE,
      description: DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export async function PageMxHub({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "mx") notFound();

  const metaCarreras = getMetaCarrerasMx();
  const topCarrera = getCarrerasPublicablesMx()[0];
  const breadcrumbs = [
    { label: "Inicio", path: "/mx" },
    { label: "Datos de México", path: "/mx/datos" },
  ];

  const jsonLd = jsonLdBreadcrumbListMx(breadcrumbs);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6 lg:py-14">
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
          <li className="font-medium text-foreground">Datos de México</li>
        </ol>
      </nav>

      <header className="max-w-3xl space-y-4">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          México · Parámetros 2026 y guías prácticas en Excel
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Datos y plantillas de Excel para tu sueldo en México
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          Calcula tu aguinaldo, finiquito, ISR mensual y PTU con fórmulas listas
          en Excel y consulta el sueldo y campo laboral de{" "}
          {metaCarreras.totalPublicables} carreras en México según IMCO 2026 e
          INEGI.
        </p>
      </header>

      <section aria-labelledby="guias-mx-heading" className="space-y-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="guias-mx-heading"
              className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
            >
              Guías y plantillas de Excel para México
            </h2>
            <p className="text-sm text-muted-foreground">
              Fórmulas paso a paso actualizadas con la Ley Federal del Trabajo y
              tablas del SAT 2026.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {GUIAS_PASO_A_PASO_MX.map((guia) => (
            <Link
              key={guia.slug}
              href={`/mx/guias/${guia.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 transition-colors hover:border-foreground/30 hover:bg-surface-hover/50"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <FileSpreadsheet className="size-4 text-emerald-600" />
                    {guia.herramienta}
                  </span>
                  <span>{guia.nivel}</span>
                </div>
                <h3 className="text-base font-semibold text-foreground group-hover:underline">
                  {guia.h1}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {guia.subtitle}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                Abrir guía y plantilla
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="carreras-mx-heading" className="space-y-5">
        <div>
          <h2
            id="carreras-mx-heading"
            className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
          >
            Sueldos y campo laboral por carrera en México (IMCO 2026)
          </h2>
          <p className="text-sm text-muted-foreground">
            Datos oficiales de{" "}
            <a
              href={metaCarreras.fuenteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-4 hover:text-foreground"
            >
              {metaCarreras.fuente}
            </a>
            .
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/mx/datos/carreras-mejor-pagadas"
            className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-6 transition-colors hover:border-foreground/30 hover:bg-surface-hover/50"
          >
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <BarChart3 className="size-4 text-foreground" />
                Ranking completo + CSV
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:underline">
                Carreras mejor pagadas en México 2026
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Top 10 por ingreso mensual (encabezado por{" "}
                {topCarrera?.carrera ?? "Medicina de especialidad"} con{" "}
                {pesosMx(topCarrera?.ingreso)}), tabla ordenable de las{" "}
                {metaCarreras.totalCarreras} carreras, carreras con más campo
                laboral y descarga en CSV.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              Ver ranking 2026
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link
            href="/mx/datos/carreras"
            className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-6 transition-colors hover:border-foreground/30 hover:bg-surface-hover/50"
          >
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <Calculator className="size-4 text-foreground" />
                Índice de {metaCarreras.totalPublicables} fichas
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:underline">
                Directorio de {metaCarreras.totalPublicables} carreras en México
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Busca cualquier carrera y consulta su ficha individual con ingreso
                promedio, rango P25–P75, tasa de desocupación, informalidad,
                matrícula y preguntas frecuentes.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              Explorar las {metaCarreras.totalPublicables} carreras
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="parametros-2026-heading"
        className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      >
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Scale className="size-4" />
            Referencia laboral y fiscal vigente
          </div>
          <h2
            id="parametros-2026-heading"
            className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
          >
            Parámetros 2026 en México
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-background p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Salario mínimo 2026
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-muted-foreground">General diario</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {pesosMxExacto(SALARIO_MINIMO_2026_MX.generalDiario)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-muted-foreground">
                  Zona Libre de la Frontera Norte (ZLFN)
                </dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {pesosMxExacto(SALARIO_MINIMO_2026_MX.zlfnDiario)}
                </dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground">
              Fuente: {SALARIO_MINIMO_2026_MX.fuente}.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">UMA 2026</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-muted-foreground">Diaria</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {pesosMxExacto(UMA_2026_MX.diaria)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-muted-foreground">Mensual</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {pesosMxExacto(UMA_2026_MX.mensual)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-muted-foreground">Anual</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {pesosMxExacto(UMA_2026_MX.anual)}
                </dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground">
              Fuente: {UMA_2026_MX.fuente}.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Prestaciones mínimas LFT 2026
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-muted-foreground">Aguinaldo mínimo</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {PRESTACIONES_LFT_2026_MX.aguinaldoDiasMinimo} días (exento{" "}
                  {pesosMxExacto(PRESTACIONES_LFT_2026_MX.aguinaldoExentoPesos)})
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-muted-foreground">PTU</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {PRESTACIONES_LFT_2026_MX.ptuPorcentajeUtilidades} % (exenta{" "}
                  {pesosMxExacto(PRESTACIONES_LFT_2026_MX.ptuExentaPesos)})
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-muted-foreground">Prima vacacional</dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {PRESTACIONES_LFT_2026_MX.primaVacacionalPorcentajeMinimo} % ·{" "}
                  {PRESTACIONES_LFT_2026_MX.vacacionesDiasPrimerAnio} días año 1
                </dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground">
              Fuente: {PRESTACIONES_LFT_2026_MX.fuente}.
            </p>
          </div>
        </div>
      </section>

      <CtaDatosMx page="/mx/datos" ctaPosition="datos_mx_hub_cta" />
    </div>
  );
}
