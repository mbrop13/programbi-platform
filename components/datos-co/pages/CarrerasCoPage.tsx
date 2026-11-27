import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Download,
  GitCompare,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { KpiCard } from "@/components/datos/KpiCard";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { CtaDatosCo } from "@/components/datos-co/CtaDatosCo";
import { TablaCarrerasCo } from "@/components/datos-co/carreras/TablaCarrerasCo";
import { RankingTopPais, type GrupoTopPais } from "@/components/datos/RankingTopPais";
import {
  getFichasCarrerasCo,
  getMetaCarrerasCo,
  getProgramasCo,
  getRankingCarrerasCo,
  medianaNivelCo,
} from "@/lib/datos-co/carreras";
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
import { cn } from "@/lib/utils";



const TITLE = "Carreras mejor pagadas en Colombia: salida laboral y sueldos";
const DESCRIPTION =
  "Explora 445 carreras en Colombia con datos del OLE y SNIES: sueldos en COP 2026, porcentaje con 4+ SMMLV, graduados cotizantes y comparador por nivel.";

export async function metadataCoCarreras({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "co") notFound();

  return metadataDatosCo({
    title: TITLE,
    description: DESCRIPTION,
    path: "/co/datos/carreras",
    rutaHreflang: "/datos/carreras",
    keywords: [
      "carreras mejor pagadas en colombia",
      "sueldos carreras colombia ole",
      "salida laboral colombia",
      "que estudiar en colombia",
    ],
  });
}

const FAQS_HUB: readonly PreguntaFaqCo[] = [
  {
    pregunta: "¿De dónde salen los datos de sueldos y salida laboral en Colombia?",
    respuesta:
      "Los ingresos y cotizantes provienen del Observatorio Laboral para la Educación (OLE) del Ministerio de Educación Nacional (cohorte 2020–2022, seguimiento 2023 en Base IBC). Los graduados 2025 provienen del registro SNIES.",
  },
  {
    pregunta: "¿Cómo se calculan los pesos colombianos (COP 2026)?",
    respuesta:
      "El OLE reporta 7 rangos en Salarios Mínimos Mensuales Legales Vigentes (SMMLV). Interpolamos la mediana dentro del tramo correspondiente y la multiplicamos por el SMMLV 2026 oficial ($1.750.905).",
  },
  {
    pregunta: "¿Qué significa «graduados cotizantes en seguridad social»?",
    respuesta:
      "Son los egresados observados por el OLE que registraron cotizaciones formales al sistema de seguridad social en el año de seguimiento (2023). No incluye informalidad ni ingresos no cotizados.",
  },
  {
    pregunta: "¿Puedo comparar carreras o descargar los datos en CSV?",
    respuesta:
      "Sí. Puedes usar el comparador interactivo de hasta 3 programas, consultar el desglose por institución cuando hay 30 o más cotizantes, y descargar las tablas completas en formato CSV sin registro.",
  },
];

const ACCESOS_RAPIDOS = [
  {
    href: "/co/datos/carreras/mejor-pagadas",
    titulo: "Top mejor pagadas",
    desc: "Rankings separados: 99 universitarias, 210 tecnológicas y 26 técnicas.",
    icono: TrophyIcon,
  },
  {
    href: "/co/datos/carreras/tecnologicas-mejor-pagadas",
    titulo: "Tecnológicas y técnicas",
    desc: "Programas cortos en software, sistemas, datos y su brecha vs. pregrado.",
    icono: BarChart3,
  },
  {
    href: "/co/datos/carreras/cuanto-gana-un-analista-de-datos",
    titulo: "Analista de datos en Colombia",
    desc: "Sueldos de carreras afines en sistemas, estadística, economía y datos.",
    icono: TrendingUp,
  },
  {
    href: "/co/datos/carreras/comparar",
    titulo: "Comparador de carreras",
    desc: "Enfrenta hasta 3 programas lado a lado en COP 2026 y % ≥4 SMMLV.",
    icono: GitCompare,
  },
  {
    href: "/co/datos/carreras/metodologia",
    titulo: "Metodología OLE y SNIES",
    desc: "7 tramos SMMLV, interpolación lineal, SMMLV 2026 y límites de la fuente.",
    icono: BookOpen,
  },
] as const;

function TrophyIcon({ className }: { className?: string }) {
  return <GraduationCap className={className} aria-hidden="true" />;
}

export async function PageCoCarreras({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "co") notFound();

  const meta = getMetaCarrerasCo();
  const programas = getProgramasCo();
  const fichas = getFichasCarrerasCo();
  const rankingTop = getRankingCarrerasCo()
    .slice()
    .sort((a, b) => b.mediana_cop_2026 - a.mediana_cop_2026)
    .slice(0, 20);

  // Top 10 por nivel (solo programas con ficha, para que cada fila lleve a su página).
  const gruposTop: GrupoTopPais[] = (
    [
      { id: "Universitario", label: "Universitarias" },
      { id: "Tecnológico", label: "Tecnológicas" },
      { id: "Formación técnica profesional", label: "Técnicas profesionales" },
    ] as const
  ).map((g) => ({
    id: g.id,
    label: g.label,
    filas: fichas
      .filter((p) => p.nivel_formacion === g.id)
      .sort((a, b) => b.mediana_cop_2026 - a.mediana_cop_2026)
      .slice(0, 10)
      .map((p) => ({
        href: `/co/datos/carreras/${p.slug}`,
        nombre: nombreProgramaCo(p.programa),
        detalle: `${smmlvCo(p.mediana_smmlv)} · ${porcentajeCo(p.pct_4plus_smmlv)} gana 4 SMMLV o más`,
        valor: p.mediana_cop_2026,
        texto: pesosCo(p.mediana_cop_2026),
      })),
  }));

  const medUniv = medianaNivelCo("Universitario");
  const medTec = medianaNivelCo("Tecnológico");
  const totalCotizantes = programas.reduce((acc, p) => acc + p.graduados_cotizantes, 0);

  const jsonLd = [
    breadcrumbJsonLdCo(MIGAS_CARRERAS_CO),
    datasetJsonLdCo({
      id: "dataset-carreras-co",
      name: "Carreras y sueldos en Colombia (OLE y SNIES)",
      description: DESCRIPTION,
      path: "/co/datos/carreras",
      isBasedOn: {
        name: meta.fuente_ole,
        url: meta.fuente_ole_url,
      },
      variableMeasured: [
        "Mediana salarial interpolada (SMMLV y COP 2026)",
        "Porcentaje de graduados cotizantes con 4 SMMLV o más",
        "Graduados cotizantes en seguridad social",
        "Graduados SNIES 2025",
      ],
      temporalCoverage: `${meta.cohorte}/${meta.anio_seguimiento}`,
      distributions: [
        {
          name: "Ranking de carreras en Colombia (OLE)",
          encodingFormat: "text/csv",
          path: "/co/datos/carreras/csv/ranking-carreras-colombia-ole.csv",
        },
        {
          name: "Carreras por institución de educación superior en Colombia (OLE)",
          encodingFormat: "text/csv",
          path: "/co/datos/carreras/csv/carreras-ies-colombia-ole.csv",
        },
      ],
    }),
    itemListJsonLdCo(
      "Top 20 carreras mejor pagadas en Colombia (OLE)",
      rankingTop.map((p) => ({
        name: p.programa_normalizado,
        path: p.sugerido_ficha ? `/co/datos/carreras/${p.slug}` : "/co/datos/carreras/mejor-pagadas",
      }))
    ),
    faqJsonLdCo(FAQS_HUB),
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
        <MigasDatos migas={MIGAS_CARRERAS_CO} />

        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-medium">
              Observatorio Laboral (OLE) · Cohorte {meta.cohorte}
            </Badge>
            <Badge variant="outline" className="font-normal">
              SMMLV 2026: {pesosCo(meta.smmlv_2026_cop)}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Qué estudiar en Colombia: sueldos y salida laboral con datos del OLE
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            Consulta los ingresos reales de{" "}
            <strong className="text-foreground">{enteroCo(programas.length)}</strong> programas
            publicados ({enteroCo(fichas.length)} con ficha detallada) y{" "}
            <strong className="text-foreground">{enteroCo(totalCotizantes)}</strong> graduados
            cotizantes en seguridad social. Filtra por nivel de formación, área de conocimiento,
            sector oficial o privado y compara antes de elegir carrera.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Indicadores clave">
          <KpiCard
            variante="primary"
            etiqueta="Programas publicados"
            valor={enteroCo(programas.length)}
            subtitulo={`${enteroCo(fichas.length)} fichas individuales · ${enteroCo(meta.conteos.rankings)} en rankings`}
            fuente="OLE Base IBC 2023"
          />
          <KpiCard
            etiqueta="Mediana universitaria"
            valor={pesosCo(medUniv.mediana_cop_2026)}
            delta={smmlvCo(medUniv.mediana_smmlv)}
            subtitulo="Mediana entre 209 fichas universitarias"
            fuente="SMMLV 2026"
          />
          <KpiCard
            etiqueta="Mediana tecnológica"
            valor={pesosCo(medTec.mediana_cop_2026)}
            delta={smmlvCo(medTec.mediana_smmlv)}
            subtitulo="Mediana entre 131 fichas tecnológicas"
            fuente="SMMLV 2026"
          />
          <KpiCard
            etiqueta="Cotizantes observados"
            valor={enteroCo(totalCotizantes)}
            subtitulo="Graduados cotizantes en seguridad social (cohorte 2020–2022)"
            fuente="Ministerio de Educación Nacional"
          />
        </section>

        <section aria-label="Herramientas y rankings" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ACCESOS_RAPIDOS.map((item) => {
            const Icon = item.icono;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/20"
              >
                <div className="space-y-2">
                  <Icon className="size-5 text-blue-700" />
                  <h2 className="text-sm font-semibold text-foreground group-hover:text-blue-700">
                    {item.titulo}
                  </h2>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-700">
                  Explorar
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </section>

        <RankingTopPais
          titulo="Las carreras mejor pagadas de Colombia"
          descripcion={`Mediana mensual de graduados que cotizan en seguridad social (OLE, cohorte ${meta.cohorte}), en pesos de 2026.`}
          grupos={gruposTop}
          verTodasHref="#buscador-carreras-co"
          verTodasTexto={`Explorar los ${enteroCo(programas.length)} programas con filtros`}
        />

        <section aria-labelledby="buscador-carreras-co" className="scroll-mt-24 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="buscador-carreras-co" className="text-xl font-semibold tracking-tight text-foreground">
                Explorar los {enteroCo(programas.length)} programas en Colombia
              </h2>
              <p className="text-sm text-muted-foreground">
                Busca por nombre, filtra por nivel, área o sector IES y ordena por mediana COP 2026, % ≥4 SMMLV o cotizantes.
              </p>
            </div>
          </div>

          <TablaCarrerasCo
            programas={programas}
            niveles={meta.niveles}
            areas={meta.areas}
          />

          <details className="rounded-xl border border-border bg-card p-4">
            <summary className="cursor-pointer text-sm font-semibold text-foreground">
              Índice alfabético completo de las {enteroCo(fichas.length)} fichas de carreras en Colombia
            </summary>
            <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2 lg:grid-cols-3">
              {fichas
                .slice()
                .sort((a, b) => a.programa_normalizado.localeCompare(b.programa_normalizado, "es"))
                .map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={`/co/datos/carreras/${f.slug}`}
                      prefetch={false}
                      className="text-muted-foreground underline-offset-4 hover:text-blue-700 hover:underline"
                    >
                      {f.programa_normalizado}
                    </Link>
                  </li>
                ))}
            </ul>
          </details>
        </section>

        <Card className="gap-4 rounded-xl border border-border bg-card py-5 shadow-xs ring-0">
          <CardHeader className="px-6 pb-0">
            <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
              <Download className="size-4 text-blue-700" aria-hidden="true" />
              Descargar datos abiertos en CSV (sin registro)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-6 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="/co/datos/carreras/csv/ranking-carreras-colombia-ole.csv"
              download
              className={cn(buttonVariants({ variant: "outline", size: "default" }), "gap-2")}
            >
              <Download className="size-4" aria-hidden="true" />
              Ranking de carreras OLE (.csv)
            </a>
            <a
              href="/co/datos/carreras/csv/carreras-ies-colombia-ole.csv"
              download
              className={cn(buttonVariants({ variant: "outline", size: "default" }), "gap-2")}
            >
              <Download className="size-4" aria-hidden="true" />
              Carreras por institución IES (.csv)
            </a>
            <span className="text-xs text-muted-foreground">
              Fuente:{" "}
              <a
                href={meta.fuente_ole_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                OLE Mineduc
              </a>{" "}
              y{" "}
              <a
                href={meta.fuente_snies_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                SNIES
              </a>
              .
            </span>
          </CardContent>
        </Card>

        <CtaDatosCo pagina="/co/datos/carreras" ctaPosition="carreras_co_hub" />

        <FaqDatos faqs={FAQS_HUB} />

        <footer className="border-t border-border/80 pt-5 text-xs leading-relaxed text-muted-foreground">
          <p>
            Fuentes oficiales: {meta.fuente_ole} ({meta.fuente_ole_url}) y {meta.fuente_snies} (
            {meta.fuente_snies_url}). ProgramBI no está afiliado al Ministerio de Educación Nacional.
          </p>
        </footer>
      </div>
    </div>
  );
}
