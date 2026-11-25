import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { CalculadoraInflacionAr } from "@/components/datos-ar/CalculadoraInflacionAr";
import { CtaDatosAr } from "@/components/datos-ar/CtaDatosAr";
import { GraficoInflacionAr } from "@/components/datos-ar/GraficoInflacionAr";
import { periodoMesAr, tasaAr } from "@/lib/datos-ar/formato";
import { getMacroArResumen } from "@/lib/datos-ar/macro";
import {
  breadcrumbJsonLdAr,
  datasetFuenteOficialJsonLd,
  faqJsonLdAr,
  metadataDatosAr,
  type MigajaAr,
  type PreguntaAr,
} from "@/lib/datos-ar/seo";
import { jsonLdString } from "@/lib/seo";



const MIGAS: readonly MigajaAr[] = [
  { label: "Inicio", path: "/ar" },
  { label: "Datos de Argentina", path: "/ar/datos" },
  { label: "Inflación", path: "/ar/datos/inflacion" },
];

const FAQS: readonly PreguntaAr[] = [
  {
    pregunta: "¿Cómo se calcula la inflación acumulada del año en Argentina?",
    respuesta:
      "La variación acumulada del año compara el índice IPC del último mes disponible contra el índice de diciembre del año anterior: (IPC_mes / IPC_diciembre_anterior - 1) × 100.",
  },
  {
    pregunta: "¿Cómo se calcula la variación interanual del IPC?",
    respuesta:
      "Compara el índice IPC de un mes contra el mismo mes del año anterior. Por ejemplo, octubre 2026 contra octubre 2025.",
  },
  {
    pregunta: "¿Cuál es la fuente de los datos?",
    respuesta:
      "El Índice de Precios al Consumidor (IPC) Nivel General Nacional (Base diciembre 2016 = 100) publicado por el INDEC, consultado a través de la API oficial de datos.gob.ar y las variables monetarias del BCRA (v4.0) con respaldo local.",
  },
];

export async function metadataArInflacion({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "ar") return {};
  return metadataDatosAr({
    subpath: "inflacion",
    title: "Inflación en Argentina 2026 mes a mes: IPC del INDEC",
    description:
      "Consultá la inflación mensual, interanual y acumulada 2026 en Argentina según el IPC del INDEC. Incluye gráfico de los últimos 24 meses, calculadora de ajuste y CSV.",
  });
}

export async function PageArInflacion({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "ar") notFound();

  const { inflacion, bcra } = await getMacroArResumen();
  const serie2026 = [...inflacion.serie]
    .filter((p) => p.mes.startsWith("2026-"))
    .reverse();

  const jsonLd = [
    breadcrumbJsonLdAr(MIGAS),
    faqJsonLdAr(FAQS),
    datasetFuenteOficialJsonLd({
      subpath: "inflacion",
      idSuffix: "dataset-ipc-indec",
      name: "Inflación en Argentina — Serie mensual del IPC Nacional (INDEC)",
      description:
        "Índice de Precios al Consumidor (IPC) Nivel General Nacional, variación mensual, interanual y acumulada del año.",
      organismoNombre: inflacion.fuente.organismo,
      organismoUrl: inflacion.fuente.url,
      temporalCoverage: `2016-12/${inflacion.actual.mes}`,
      dateModified: `${inflacion.actual.mes}-01`,
      csvPath: "/ar/datos/inflacion/csv/ipc-argentina-indec.csv",
    }),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <header className="space-y-4">
        <nav aria-label="Ruta de navegación" className="text-xs text-muted-foreground sm:text-sm">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/ar" className="hover:text-foreground">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/ar/datos" className="hover:text-foreground">
                Datos de Argentina
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-foreground">
              Inflación
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Inflación en Argentina: IPC mes a mes 2026
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Último dato oficial del INDEC ({periodoMesAr(inflacion.actual.mes)},{" "}
              {inflacion.base}). Actualización automática diaria vía datos.gob.ar y BCRA
              v4.0 con respaldo local.
            </p>
          </div>

          <a
            href="/ar/datos/inflacion/csv/ipc-argentina-indec.csv"
            download
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
          >
            <Download className="size-4" aria-hidden="true" />
            Descargar serie IPC (CSV)
          </a>
        </div>

        {/* KPIs principales */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">
              Inflación mensual ({periodoMesAr(inflacion.actual.mes)})
            </p>
            <p className="mt-1 text-3xl font-bold text-foreground tabular-nums">
              {tasaAr(inflacion.actual.variacionMensual)}
            </p>
            {bcra.variable27 ? (
              <p className="mt-1 text-xs text-muted-foreground">
                BCRA var. 27 ({bcra.variable27.fecha}): {tasaAr(bcra.variable27.valor)}
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">
              Variación interanual ({periodoMesAr(inflacion.actual.mes)})
            </p>
            <p className="mt-1 text-3xl font-bold text-foreground tabular-nums">
              {tasaAr(inflacion.actual.variacionInteranual)}
            </p>
            {bcra.variable28 ? (
              <p className="mt-1 text-xs text-muted-foreground">
                BCRA var. 28 ({bcra.variable28.fecha}): {tasaAr(bcra.variable28.valor)}
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Acumulada 2026 (hasta {periodoMesAr(inflacion.actual.mes, true)})</p>
            <p className="mt-1 text-3xl font-bold text-foreground tabular-nums">
              {tasaAr(inflacion.actual.variacionAcumuladaAnio)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Índice Nivel General: {inflacion.actual.indice.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>
      </header>

      {/* Gráfico 24 meses */}
      <GraficoInflacionAr serie={inflacion.serie} />

      {/* Calculadora de ajuste por inflación */}
      <CalculadoraInflacionAr serie={inflacion.serie} />

      {/* Tabla mes a mes 2026 */}
      <section aria-labelledby="tabla-2026-titulo" className="rounded-2xl border border-border bg-card shadow-xs">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 id="tabla-2026-titulo" className="text-base font-semibold text-foreground sm:text-lg">
            Inflación 2026 mes a mes (INDEC)
          </h2>
          <p className="text-xs text-muted-foreground">
            Nivel General Nacional · {inflacion.base}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-4 py-3 sm:px-6">Mes</th>
                <th className="px-4 py-3 text-right">Variación mensual</th>
                <th className="px-4 py-3 text-right">Acumulada 2026</th>
                <th className="px-4 py-3 text-right">Interanual</th>
                <th className="px-4 py-3 text-right sm:px-6">Índice IPC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border tabular-nums">
              {serie2026.map((p) => (
                <tr key={p.mes} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium capitalize text-foreground sm:px-6">
                    {periodoMesAr(p.mes)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    {tasaAr(p.variacionMensual)}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {tasaAr(p.variacionAcumuladaAnio)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {tasaAr(p.variacionInteranual)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground sm:px-6">
                    {p.indice.toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-ipc-titulo" className="space-y-4">
        <h2 id="faq-ipc-titulo" className="text-xl font-bold text-foreground">
          Preguntas frecuentes sobre el IPC
        </h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQS.map((item) => (
            <details key={item.pregunta} className="p-5">
              <summary className="cursor-pointer list-none font-semibold text-foreground">
                {item.pregunta}
              </summary>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {item.respuesta}
              </p>
            </details>
          ))}
        </div>
      </section>

      <CtaDatosAr page="/ar/datos/inflacion" ctaPosition="datos_ar_inflacion" />
    </div>
  );
}
