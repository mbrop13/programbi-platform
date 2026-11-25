import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Info } from "lucide-react";
import { CtaDatosAr } from "@/components/datos-ar/CtaDatosAr";
import { GraficoDesempleoAr } from "@/components/datos-ar/GraficoDesempleoAr";
import { periodoTrimestreAr, tasaAr } from "@/lib/datos-ar/formato";
import { getDesempleoArLive } from "@/lib/datos-ar/macro";
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
  { label: "Desempleo", path: "/ar/datos/desempleo" },
];

const FAQS: readonly PreguntaAr[] = [
  {
    pregunta: "¿Qué mide la tasa de desocupación de la EPH del INDEC?",
    respuesta:
      "Mide el porcentaje de la Población Económicamente Activa (personas que tienen trabajo o lo buscan activamente) que no tiene ocupación y busca empleo de forma activa en los 31 aglomerados urbanos relevados por la Encuesta Permanente de Hogares (EPH).",
  },
  {
    pregunta: "¿La tasa de desempleo incluye zonas rurales o todo el país?",
    respuesta:
      "No. La EPH continua del INDEC releva 31 aglomerados urbanos (aproximadamente el 62 % de la población total del país) y no incluye localidades pequeñas ni áreas rurales.",
  },
  {
    pregunta: "¿Cada cuánto se publica este dato?",
    respuesta:
      "El INDEC publica los resultados de mercado de trabajo de la EPH de forma trimestral. Esta página consulta la serie nacional 45.2_ECTDT_0_T_33 en datos.gob.ar con respaldo local.",
  },
];

export async function metadataArDesempleo({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "ar") return {};
  return metadataDatosAr({
    subpath: "desempleo",
    title: "Desempleo en Argentina 2026: tasa del INDEC por aglomerado",
    description:
      "Último dato oficial de desocupación en Argentina (EPH INDEC, 31 aglomerados urbanos). Serie trimestral, alcance metodológico y descarga CSV.",
  });
}

export async function PageArDesempleo({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "ar") notFound();

  const desempleo = await getDesempleoArLive();
  const serieDesc = [...desempleo.serie].reverse();
  const anterior = desempleo.serie[desempleo.serie.length - 2] ?? null;
  const difPp =
    anterior !== null
      ? Number((desempleo.actual.tasaPct - anterior.tasaPct).toFixed(1))
      : null;

  const jsonLd = [
    breadcrumbJsonLdAr(MIGAS),
    faqJsonLdAr(FAQS),
    datasetFuenteOficialJsonLd({
      subpath: "desempleo",
      idSuffix: "dataset-eph-desempleo",
      name: "Tasa de desocupación en Argentina — EPH continua INDEC (31 aglomerados)",
      description:
        "Serie nacional trimestral de la tasa de desocupación de la Encuesta Permanente de Hogares (serie 45.2_ECTDT_0_T_33).",
      organismoNombre: desempleo.fuente.organismo,
      organismoUrl: desempleo.fuente.url,
      temporalCoverage: `${desempleo.serie[0]?.fecha ?? "2025-04-01"}/${desempleo.actual.fecha}`,
      dateModified: desempleo.actual.fecha,
      csvPath: "/ar/datos/desempleo/csv/desempleo-argentina-indec.csv",
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
              Desempleo
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Desempleo en Argentina: último dato del INDEC
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Serie nacional trimestral de la Encuesta Permanente de Hogares (EPH continua,{" "}
              <code>{desempleo.serieIdDatosGobAr}</code>). Último trimestre publicado:{" "}
              <strong className="font-semibold text-foreground">
                {periodoTrimestreAr(desempleo.actual.fecha)}
              </strong>
              .
            </p>
          </div>

          <a
            href="/ar/datos/desempleo/csv/desempleo-argentina-indec.csv"
            download
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
          >
            <Download className="size-4" aria-hidden="true" />
            Descargar serie EPH (CSV)
          </a>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">
              Tasa de desocupación ({periodoTrimestreAr(desempleo.actual.fecha)})
            </p>
            <p className="mt-1 text-3xl font-bold text-foreground tabular-nums">
              {tasaAr(desempleo.actual.tasaPct)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Variación vs. trimestre anterior</p>
            <p className="mt-1 text-3xl font-bold text-foreground tabular-nums">
              {difPp !== null
                ? `${difPp > 0 ? "+" : difPp < 0 ? "−" : ""}${Math.abs(difPp).toFixed(1).replace(".", ",")} pp`
                : "s/d"}
            </p>
            {anterior ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {periodoTrimestreAr(anterior.fecha)}: {tasaAr(anterior.tasaPct)}
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Cobertura geográfica</p>
            <p className="mt-1 text-xl font-bold text-foreground">31 aglomerados urbanos</p>
            <p className="mt-1 text-xs text-muted-foreground">EPH continua · INDEC</p>
          </div>
        </div>

        <div
          role="note"
          className="flex items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-950 dark:text-blue-200"
        >
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong className="font-semibold">Nota de cobertura EPH:</strong> esta serie
            representa el total de los 31 aglomerados urbanos relevados por el INDEC (no
            incluye población rural ni localidades menores) y se expresa sobre la Población
            Económicamente Activa (PEA).
          </p>
        </div>
      </header>

      {/* Gráfico trimestral */}
      <GraficoDesempleoAr serie={desempleo.serie} />

      {/* Tabla trimestral */}
      <section aria-labelledby="tabla-eph-titulo" className="rounded-2xl border border-border bg-card shadow-xs">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 id="tabla-eph-titulo" className="text-base font-semibold text-foreground sm:text-lg">
            Serie trimestral de desocupación (INDEC EPH)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-4 py-3 sm:px-6">Trimestre</th>
                <th className="px-4 py-3">Fecha de referencia</th>
                <th className="px-4 py-3 text-right sm:px-6">Tasa de desocupación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border tabular-nums">
              {serieDesc.map((p) => (
                <tr key={p.fecha} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground sm:px-6">
                    {p.trimestre}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.fecha}</td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground sm:px-6">
                    {tasaAr(p.tasaPct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-eph-titulo" className="space-y-4">
        <h2 id="faq-eph-titulo" className="text-xl font-bold text-foreground">
          Preguntas frecuentes sobre la tasa de desempleo
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

      <CtaDatosAr page="/ar/datos/desempleo" ctaPosition="datos_ar_desempleo" />
    </div>
  );
}
