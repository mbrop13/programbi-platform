import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Download,
  GraduationCap,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { EnResumen } from "@/components/datos/EnResumen";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { KpiCard } from "@/components/datos/KpiCard";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { GraficoDesempleoCo } from "@/components/datos-co/macro/GraficoDesempleoCo";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tasaCo } from "@/lib/datos-co/formato";
import {
  getDesempleoAgregadosCo,
  getDesempleoCiudadesCo,
  getDesempleoCo,
} from "@/lib/datos-co/macro";
import {
  breadcrumbJsonLdCo,
  datasetJsonLdCo,
  faqJsonLdCo,
  metadataDatosCo,
  MIGAS_BASE_CO,
} from "@/lib/datos-co/seo";
import { jsonLdString } from "@/lib/seo";
import { cn } from "@/lib/utils";


type Params = { pais: string };


const PATH = "/co/datos/desempleo";
const CSV_PATH = "/co/datos/desempleo/csv/desempleo-colombia-dane.csv";

const MIGAS = [
  ...MIGAS_BASE_CO,
  { label: "Desempleo", path: PATH },
] as const;

const FAQS = [
  {
    pregunta: "¿Cuál es la tasa de desempleo actual en Colombia?",
    respuesta:
      "Según la Gran Encuesta Integrada de Hogares (GEIH) del DANE, la tasa de desocupación total nacional en septiembre de 2026 fue de 8,0 %.",
  },
  {
    pregunta: "¿Por qué el dato nacional (8,0 %) es diferente al de 23 ciudades (8,9 %)?",
    respuesta:
      "El 8,0 % corresponde a la medición mensual total nacional de septiembre de 2026. En cambio, el 8,9 % corresponde al trimestre móvil julio–septiembre de 2026 para el agregado de las 23 ciudades y áreas metropolitanas. Son coberturas y períodos distintos y no deben mezclarse.",
  },
  {
    pregunta: "¿Qué ciudades tienen el menor y mayor desempleo en Colombia?",
    respuesta:
      "En el trimestre móvil jul–sep 2026, Bogotá D.C. registró la menor tasa de desocupación entre las 23 ciudades (7,6 %), seguida de Villavicencio (7,7 %) y Medellín A.M. (7,8 %). La tasa más alta se observó en Quibdó (23,4 %).",
  },
  {
    pregunta: "¿Dónde descargar la serie histórica de desempleo del DANE?",
    respuesta:
      "Puedes descargar el archivo CSV con la serie nacional mensual (2001–sep-2026) y el detalle por ciudades directamente desde esta página.",
  },
] as const;

export async function metadataCoDesempleo({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "co") return {};
  return metadataDatosCo({
    title: "Desempleo en Colombia: tasa actual (8,0 %) y 23 ciudades",
    description:
      "Tasa de desempleo en Colombia según DANE GEIH: 8,0 % nacional en septiembre 2026, serie histórica 2001–2026 y ranking de 23 ciudades (jul–sep 2026).",
    path: PATH,
    rutaHreflang: "/datos/desempleo",
    keywords: [
      "desempleo colombia 2026",
      "tasa de desocupacion dane",
      "desempleo por ciudades colombia",
      "geih dane septiembre 2026",
    ],
  });
}

export async function PageCoDesempleo({
  params,
}: {
  params: Promise<Params>;
}) {
  const { pais } = await params;
  if (pais !== "co") notFound();

  const data = getDesempleoCo();
  const ciudades = getDesempleoCiudadesCo();
  const agregados = getDesempleoAgregadosCo();

  const ciudadesAsc = ciudades
    .slice()
    .sort((a, b) => a.tasa_desocupacion_pct - b.tasa_desocupacion_pct);
  const menor = ciudadesAsc[0];
  const mayor = ciudadesAsc.at(-1);
  const agg23 =
    agregados.find((a) => a.ciudad.includes("23"))?.tasa_desocupacion_pct ?? 8.9;

  const resumenFrases = [
    `En septiembre de 2026, la tasa de desocupación total nacional en Colombia fue de ${tasaCo(data.meta.tasa_nacional_actual_pct)} según la GEIH del DANE.`,
    `Para el trimestre móvil ${data.meta.periodo_ciudades}, el agregado de 23 ciudades y áreas metropolitanas marcó ${tasaCo(agg23)} (no mezclar esta cifra trimestral urbana con el ${tasaCo(data.meta.tasa_nacional_actual_pct)} nacional mensual).`,
    menor && mayor
      ? `Entre las 23 ciudades medidas, ${menor.ciudad} registró la menor tasa (${tasaCo(menor.tasa_desocupacion_pct)}) y ${mayor.ciudad} la más alta (${tasaCo(mayor.tasa_desocupacion_pct)}).`
      : "La serie histórica cubre desde enero de 2001 hasta septiembre de 2026.",
  ];

  const jsonLd = [
    breadcrumbJsonLdCo(MIGAS),
    datasetJsonLdCo({
      id: "dataset-desempleo-co",
      name: "Tasa de desocupación en Colombia (2001–sep-2026) y 23 ciudades — DANE GEIH",
      description:
        "Serie nacional mensual de desempleo en Colombia (2001–sep-2026) y ranking trimestral móvil de 23 ciudades y áreas metropolitanas (jul–sep 2026), según la GEIH del DANE.",
      path: PATH,
      isBasedOn: {
        name: data.meta.fuente,
        url: data.meta.fuente_url,
      },
      variableMeasured: [
        "Tasa de desocupación nacional mensual (%)",
        "Tasa de desocupación por ciudad trimestre móvil (%)",
      ],
      temporalCoverage: "2001-01/2026-09",
      dateModified: "2026-10-30",
      distributions: [
        {
          name: "desempleo-colombia-dane.csv",
          encodingFormat: "text/csv",
          path: CSV_PATH,
        },
      ],
    }),
    faqJsonLdCo(FAQS),
  ];

  return (
    <div className="mx-auto max-w-[1180px] space-y-10 px-4 py-6 sm:px-6 lg:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <div className="space-y-4">
        <MigasDatos migas={MIGAS} />

        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2.5">
            <p className="text-sm font-semibold text-emerald-700">
              DANE · Gran Encuesta Integrada de Hogares (GEIH)
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Desempleo en Colombia: tasa nacional y por ciudad (DANE GEIH)
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              Evolución histórica de la tasa de desocupación nacional desde 2001 hasta septiembre de
              2026 y comparación entre las 23 ciudades y áreas metropolitanas en {data.meta.periodo_ciudades}.
            </p>
          </div>

          <a
            href={CSV_PATH}
            download
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "h-10 shrink-0 gap-2 rounded-lg px-4 text-sm font-medium"
            )}
          >
            <Download className="size-4" aria-hidden="true" />
            Descargar CSV DANE
          </a>
        </header>
      </div>

      <section aria-label="Indicadores principales de desempleo" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          valor={tasaCo(data.meta.tasa_nacional_actual_pct)}
          etiqueta="Nacional mensual (sep-2026)"
          fuente="DANE GEIH · Total nacional"
          icono={<BarChart3 className="size-4" aria-hidden="true" />}
          variante="primary"
        />
        <KpiCard
          valor={tasaCo(agg23)}
          etiqueta="Total 23 ciudades (jul–sep 2026)"
          fuente="Trimestre móvil urbano"
          icono={<MapPin className="size-4" aria-hidden="true" />}
        />
        {menor ? (
          <KpiCard
            valor={tasaCo(menor.tasa_desocupacion_pct)}
            etiqueta={`Menor tasa: ${menor.ciudad}`}
            fuente={`Trimestre ${data.meta.periodo_ciudades}`}
          />
        ) : null}
        {mayor ? (
          <KpiCard
            valor={tasaCo(mayor.tasa_desocupacion_pct)}
            etiqueta={`Mayor tasa: ${mayor.ciudad}`}
            fuente={`Trimestre ${data.meta.periodo_ciudades}`}
          />
        ) : null}
      </section>

      <div
        role="note"
        className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3.5 text-sm text-amber-950"
      >
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong>Nota metodológica:</strong> {data.meta.nota_metodologica}
        </p>
      </div>

      <GraficoDesempleoCo
        serieNacional={data.nacional}
        ciudades={ciudades}
        tasaAgregado23={agg23}
        periodoCiudades={data.meta.periodo_ciudades}
      />

      <section aria-labelledby="totales-ciudades-titulo" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-xl border border-border bg-card shadow-xs ring-0">
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle id="totales-ciudades-titulo" className="text-base font-semibold">
              3 totales oficiales de ciudades ({data.meta.periodo_ciudades})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/70">
              {agregados.map((agg) => (
                <div
                  key={agg.ciudad}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm"
                >
                  <span className="font-medium text-foreground">{agg.ciudad}</span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {tasaCo(agg.tasa_desocupacion_pct)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card shadow-xs ring-0">
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle className="text-base font-semibold">
              Tabla de las 23 ciudades ({data.meta.periodo_ciudades})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[340px] overflow-y-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-muted/90 text-xs text-muted-foreground backdrop-blur">
                <tr>
                  <th className="px-5 py-2.5 font-medium">#</th>
                  <th className="px-3 py-2.5 font-medium">Ciudad / A.M.</th>
                  <th className="px-5 py-2.5 text-right font-medium">Tasa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {ciudadesAsc.map((c, idx) => (
                  <tr key={c.ciudad} className="hover:bg-muted/40">
                    <td className="px-5 py-2.5 tabular-nums text-muted-foreground">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-medium text-foreground">{c.ciudad}</td>
                    <td className="px-5 py-2.5 text-right font-semibold tabular-nums text-foreground">
                      {tasaCo(c.tasa_desocupacion_pct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      <EnResumen
        frases={resumenFrases}
        fuente={`Fuente: ${data.meta.fuente}`}
      />

      <Card className="rounded-xl border border-border bg-card shadow-xs ring-0">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <GraduationCap className="size-4 text-blue-600" aria-hidden="true" />
              <span>Aprende a construir tableros con datos reales</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              ¿Quieres analizar indicadores laborales en Power BI?
            </h2>
            <p className="text-sm text-muted-foreground">
              Domina modelado, DAX y visualización ejecutiva en nuestro curso en vivo de Power BI.
              Disponible en 3 cuotas sin interés y con clase gratis.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Link
              href="/co/cursos/power-bi"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 gap-1.5 rounded-lg px-4 text-sm font-medium"
              )}
            >
              Ver curso Power BI
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <WhatsAppCta
              page={PATH}
              country="co"
              intent="curso"
              course="Power BI"
              courseSlug="power-bi"
              ctaPosition="desempleo_co_cta"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "min-h-11 gap-2 rounded-lg px-4 text-sm font-medium"
              )}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp
            </WhatsAppCta>
          </div>
        </CardContent>
      </Card>

      <FaqDatos faqs={FAQS} />

      <p className="text-xs text-muted-foreground">
        Fuente oficial:{" "}
        <a
          href={data.meta.fuente_url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          {data.meta.fuente}
        </a>
        .
      </p>
    </div>
  );
}
