import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { KpiCard } from "@/components/datos/KpiCard";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { CtaDatosCo } from "@/components/datos-co/CtaDatosCo";
import { getCarreraPorSlugCo, getMetaCarrerasCo } from "@/lib/datos-co/carreras";
import {
  enteroCo,
  nombreProgramaCo,
  pesosCo,
  porcentajeCo,
  smmlvCo,
} from "@/lib/datos-co/formato";
import {
  MIGAS_CARRERAS_CO,
  breadcrumbJsonLdCo,
  datasetJsonLdCo,
  faqJsonLdCo,
  itemListJsonLdCo,
  metadataDatosCo,
} from "@/lib/datos-co/seo";
import type { PreguntaFaqCo } from "@/lib/datos-co/textos";
import type { CarreraCo } from "@/lib/datos-co/types";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ pais: "co" }];
}

const TITLE = "Cuánto gana un analista de datos en Colombia (datos OLE)";
const DESCRIPTION =
  "El OLE no publica un programa llamado «Analista de datos». Revisa sueldos reales en COP 2026 de carreras afines: Sistemas y Computación, Estadística, Software, Economía e Industrial.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "co") notFound();

  return metadataDatosCo({
    title: TITLE,
    description: DESCRIPTION,
    path: "/co/datos/carreras/cuanto-gana-un-analista-de-datos",
    keywords: [
      "cuanto gana un analista de datos en colombia",
      "salario analista de datos colombia",
      "sueldo analista de datos ole",
    ],
  });
}

const SLUGS_AFINES_ANALISTA = [
  "ingenieria-de-sistemas-y-computacion",
  "ingenieria-informatica",
  "estadistica",
  "ingenieria-de-software",
  "ingenieria-de-sistemas",
  "tecnologia-en-sistematizacion-de-datos",
  "economia",
  "ingenieria-industrial",
  "tecnologia-en-analisis-y-desarrollo-de-sistemas-de-informacion",
] as const;

const FAQS: readonly PreguntaFaqCo[] = [
  {
    pregunta: "¿Por qué no aparece «Analista de datos» como carrera exacta en el OLE?",
    respuesta:
      "El Observatorio Laboral para la Educación (OLE) agrupa los salarios por programas de pregrado y tecnología registrados en el SNIES, no por cargos laborales. Quienes trabajan como analistas de datos en Colombia suelen provenir de carreras afines como Estadística, Ingeniería de Sistemas, Ingeniería Industrial, Economía o tecnologías en datos y desarrollo.",
  },
  {
    pregunta: "¿Qué carreras afines a análisis de datos tienen mayor porcentaje con 4 SMMLV o más?",
    respuesta:
      "Dentro de las carreras afines observadas en la cohorte 2020–2022 del OLE, Ingeniería de Sistemas y Computación, Ingeniería Informática, Estadística e Ingeniería de Software superan el 40 % de graduados cotizantes con 4 SMMLV o más.",
  },
  {
    pregunta: "¿Qué herramientas se requieren para dar el salto a analista de datos?",
    respuesta:
      "Además de la base cuantitativa o de sistemas de la carrera, el mercado exige dominio práctico de SQL Server, modelado y DAX en Power BI, Excel avanzado y análisis exploratorio de datos.",
  },
];

export default async function CuantoGanaAnalistaDatosCoPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "co") notFound();

  const meta = getMetaCarrerasCo();
  const carrerasAfines = SLUGS_AFINES_ANALISTA.map((s) => getCarreraPorSlugCo(s))
    .filter((c): c is CarreraCo => Boolean(c))
    .sort((a, b) => b.mediana_cop_2026 - a.mediana_cop_2026);

  const topMediana = carrerasAfines[0];
  const minMediana = carrerasAfines[carrerasAfines.length - 1];

  const migas = [
    ...MIGAS_CARRERAS_CO,
    {
      label: "Analista de datos en Colombia",
      path: "/co/datos/carreras/cuanto-gana-un-analista-de-datos",
    },
  ] as const;

  const cursos = [
    {
      slug: "analisis-de-datos" as const,
      href: "/co/cursos/analisis-de-datos",
      titulo: "Análisis de Datos (60 h)",
      descripcion: "60 horas en vivo por nivel: SQL Server, Power BI y Python.",
    },
    {
      slug: "power-bi" as const,
      href: "/co/cursos/power-bi",
      titulo: "Power BI",
      descripcion: "Tableros gerenciales con DAX y modelos estrella.",
    },
    {
      slug: "sql-server" as const,
      href: "/co/cursos/sql-server",
      titulo: "SQL Server",
      descripcion: "Consultas, modelado y automatización en SQL.",
    },
  ];

  const jsonLd = [
    breadcrumbJsonLdCo(migas),
    datasetJsonLdCo({
      id: "dataset-analista-datos-co",
      name: "Sueldos de carreras afines a analista de datos en Colombia (OLE)",
      description: DESCRIPTION,
      path: "/co/datos/carreras/cuanto-gana-un-analista-de-datos",
      isBasedOn: { name: meta.fuente_ole, url: meta.fuente_ole_url },
      variableMeasured: [
        "Mediana salarial COP 2026",
        "Porcentaje >= 4 SMMLV",
        "Graduados cotizantes en seguridad social",
      ],
      temporalCoverage: `${meta.cohorte}/${meta.anio_seguimiento}`,
    }),
    itemListJsonLdCo(
      "Carreras afines a analista de datos en Colombia (OLE)",
      carrerasAfines.map((c) => ({
        name: c.programa_normalizado,
        path: c.sugerido_ficha ? `/co/datos/carreras/${c.slug}` : "/co/datos/carreras",
      }))
    ),
    faqJsonLdCo(FAQS),
  ];

  return (
    <div className="bg-background">
      {jsonLd.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
        <MigasDatos migas={migas} />

        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Datos oficiales OLE · Cohorte {meta.cohorte}</Badge>
            <Badge variant="outline">SMMLV 2026: {pesosCo(meta.smmlv_2026_cop)}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ¿Cuánto gana un analista de datos en Colombia? Datos oficiales de carreras afines
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            El Observatorio Laboral para la Educación (OLE) no registra un programa titulado
            «Analista de datos», porque mide egresados por título oficial SNIES y no por cargo.
            Para estimar con rigor el ingreso de entrada, reunimos las 9 carreras y tecnologías
            colombianas que nutren los equipos de analítica e inteligencia de negocios.
          </p>
        </header>

        <Card className="rounded-xl border border-amber-200 bg-amber-50/50 py-4 shadow-xs ring-0">
          <CardContent className="flex items-start gap-3 px-5 text-sm text-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Nota de transparencia:</strong> las cifras corresponden a graduados cotizantes
              en seguridad social de programas oficiales del SNIES en su seguimiento 2023 (expresadas
              en SMMLV 2026). No representan encuestas salariales privadas por cargo.
            </p>
          </CardContent>
        </Card>

        {topMediana && minMediana ? (
          <section className="grid gap-4 sm:grid-cols-3" aria-label="Resumen de rango salarial">
            <KpiCard
              variante="primary"
              etiqueta="Mediana más alta (afines)"
              valor={pesosCo(topMediana.mediana_cop_2026)}
              delta={smmlvCo(topMediana.mediana_smmlv)}
              subtitulo={nombreProgramaCo(topMediana.programa)}
            />
            <KpiCard
              etiqueta="Mediana tecnológica de entrada"
              valor={pesosCo(minMediana.mediana_cop_2026)}
              delta={smmlvCo(minMediana.mediana_smmlv)}
              subtitulo={nombreProgramaCo(minMediana.programa)}
            />
            <KpiCard
              etiqueta="Carreras afines analizadas"
              valor={String(carrerasAfines.length)}
              subtitulo="7 universitarias y 2 tecnológicas del OLE"
              fuente="Cohorte 2020–2022"
            />
          </section>
        ) : null}

        <Card className="gap-3 rounded-xl border border-border bg-card py-5 shadow-xs ring-0">
          <CardHeader className="px-6 pb-0">
            <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
              Sueldos y salida laboral de carreras afines en Colombia
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[660px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                    <th className="py-2.5 pr-3">Programa OLE / SNIES</th>
                    <th className="px-3 py-2.5">Nivel</th>
                    <th className="px-3 py-2.5 text-right">Mediana COP 2026</th>
                    <th className="px-3 py-2.5 text-right">SMMLV</th>
                    <th className="px-3 py-2.5 text-right">% ≥ 4 SMMLV</th>
                    <th className="pl-3 py-2.5 text-right">Cotizantes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {carrerasAfines.map((c) => (
                    <tr key={c.slug} className="hover:bg-muted/35">
                      <td className="py-3 pr-3">
                        <Link
                          href={`/co/datos/carreras/${c.slug}`}
                          prefetch={false}
                          className="font-medium text-blue-700 hover:underline"
                        >
                          {nombreProgramaCo(c.programa)}
                        </Link>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant="secondary" className="text-[11px] font-normal">
                          {c.nivel_formacion}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums text-foreground">
                        {pesosCo(c.mediana_cop_2026)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                        {smmlvCo(c.mediana_smmlv, false)}
                      </td>
                      <td className="px-3 py-3 text-right font-medium tabular-nums text-emerald-700">
                        {porcentajeCo(c.pct_4plus_smmlv)}
                      </td>
                      <td className="pl-3 py-3 text-right tabular-nums text-muted-foreground">
                        {enteroCo(c.graduados_cotizantes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/co/datos/carreras/comparar"
                prefetch={false}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
              >
                Comparar estas carreras lado a lado
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <CtaDatosCo
          pagina="/co/datos/carreras/cuanto-gana-un-analista-de-datos"
          cursos={cursos}
          titulo="¿Quieres prepararte para trabajar como analista de datos?"
          subtitulo="Curso de Análisis de Datos de 60 horas en vivo (SQL Server, Power BI y Python), con proyectos reales y 3 cuotas sin interés. Revisa la ficha o coordina una clase gratis por WhatsApp."
          ctaPosition="co_analista_sueldos"
          whatsappLabel="Coordinar clase gratis por WhatsApp"
          whatsappText="Hola, vengo de /co/datos/carreras/cuanto-gana-un-analista-de-datos y quiero coordinar una clase gratis del curso de Análisis de Datos (60 h) en Colombia."
        />

        <FaqDatos faqs={FAQS} />
      </div>
    </div>
  );
}
