import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Briefcase,
  Calculator,
  FileSpreadsheet,
  GraduationCap,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { KpiCard } from "@/components/datos/KpiCard";
import { MigasDatos } from "@/components/datos/MigasDatos";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { getFichasCarrerasCo, getMetaCarrerasCo } from "@/lib/datos-co/carreras";
import { enteroCo, pesosCo, tasaCo } from "@/lib/datos-co/formato";
import { getParametrosLaborales2026Co } from "@/lib/datos-co/macro";
import {
  breadcrumbJsonLdCo,
  faqJsonLdCo,
  itemListJsonLdCo,
  metadataDatosCo,
  MIGAS_BASE_CO,
} from "@/lib/datos-co/seo";
import { GUIAS_PASO_A_PASO_CO } from "@/lib/guias/paso-a-paso-co";
import { jsonLdString } from "@/lib/seo";
import { cn } from "@/lib/utils";


type Params = { pais: string };


const PATH = "/co/datos";
const TITULO = "Datos de Colombia: empleo, inflación y carreras";
const DESCRIPCION =
  "Cifras oficiales de Colombia: desempleo (8,0 % sep-2026), inflación IPC (6,30 % oct-2026), SMMLV 2026 ($1.750.905), salarios de carreras OLE y guías laborales.";

const FAQS = [
  {
    pregunta: "¿Qué fuentes oficiales respaldan los datos de Colombia en ProgramBI?",
    respuesta:
      "Usamos exclusivamente fuentes públicas oficiales: DANE (GEIH para desempleo e IPC para inflación), Ministerio de Educación Nacional (OLE y SNIES para ingresos de graduados), Ministerio del Trabajo (decretos de SMMLV y auxilio de transporte), Banco de la República (tasa de intervención) y Superfinanciera / datos.gov.co (TRM).",
  },
  {
    pregunta: "¿Por qué no se mezclan el 8,0 % nacional de desempleo y el 8,9 % de las 23 ciudades?",
    respuesta:
      "Porque corresponden a coberturas y ventanas temporales distintas del DANE: el 8,0 % es la tasa mensual total nacional de septiembre de 2026, mientras que el 8,9 % es el agregado del trimestre móvil julio–septiembre de 2026 para 23 ciudades y áreas metropolitanas.",
  },
  {
    pregunta: "¿Cómo se expresan los salarios de carreras universitarias y tecnológicas?",
    respuesta:
      "El Observatorio Laboral para la Educación (OLE) reporta ingresos de graduados cotizantes en rangos de SMMLV. Aquí los convertimos a pesos colombianos de 2026 usando el SMMLV vigente ($1.750.905).",
  },
] as const;

export async function metadataCoHub({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "co") return {};
  return metadataDatosCo({
    title: TITULO,
    description: DESCRIPCION,
    path: PATH,
    rutaHreflang: "/datos",
    keywords: [
      "datos de colombia",
      "desempleo colombia 2026",
      "inflacion colombia 2026",
      "salario minimo colombia 2026",
      "salarios carreras colombia ole",
    ],
  });
}

export async function PageCoHub({
  params,
}: {
  params: Promise<Params>;
}) {
  const { pais } = await params;
  if (pais !== "co") notFound();

  const p2026 = getParametrosLaborales2026Co();
  const metaCarreras = getMetaCarrerasCo();
  const totalFichas = getFichasCarrerasCo().length;

  const tarjetasCarreras = [
    {
      href: "/co/datos/carreras",
      etiqueta: `${enteroCo(totalFichas)} programas`,
      titulo: "Explorador de carreras y salarios",
      desc: "Consulta ingresos en SMMLV y pesos de 2026 de programas universitarios, tecnológicos y técnicos según el OLE.",
    },
    {
      href: "/co/datos/carreras/mejor-pagadas",
      etiqueta: "Ranking oficial",
      titulo: "Carreras mejor pagadas",
      desc: "Los programas profesionales con mayor mediana salarial y mayor proporción de cotizantes con 4+ SMMLV.",
    },
    {
      href: "/co/datos/carreras/tecnologicas-mejor-pagadas",
      etiqueta: "Nivel tecnológico",
      titulo: "Tecnológicas mejor pagadas",
      desc: "Ranking de programas tecnológicos con mejores ingresos en la cohorte 2020–2022.",
    },
    {
      href: "/co/datos/carreras/cuanto-gana-un-analista-de-datos",
      etiqueta: "Perfil en demanda",
      titulo: "Cuánto gana un analista de datos",
      desc: "Referencia salarial en Colombia para perfiles de analítica, BI y datos según datos oficiales.",
    },
  ] as const;

  const tarjetasMacro = [
    {
      href: "/co/datos/desempleo",
      etiqueta: "DANE GEIH · sep-2026",
      titulo: `Desempleo en Colombia (${tasaCo(p2026.desempleo_nacional_sep_2026_pct)})`,
      desc: "Serie nacional 2001–sep-2026 y ranking de las 23 ciudades y áreas metropolitanas (jul–sep 2026), con CSV descargable.",
    },
    {
      href: "/co/datos/inflacion",
      etiqueta: "DANE IPC · oct-2026",
      titulo: `Inflación (${tasaCo(p2026.ipc_var_12m_oct_2026_pct, 2)}) y calculadora IPC`,
      desc: "Ajusta cualquier monto en pesos colombianos desde 2003, revisa la tasa BanRep (12,25 %) y la TRM de referencia.",
    },
    {
      href: "/co/datos/salario-minimo",
      etiqueta: "MinTrabajo · 2026",
      titulo: `Salario mínimo 2026 (${pesosCo(p2026.smmlv_2026_cop)})`,
      desc: "Valor del SMMLV, auxilio de transporte ($249.095), aportes a salud y pensión, FSP, prima y cesantías.",
    },
  ] as const;

  const jsonLd = [
    breadcrumbJsonLdCo(MIGAS_BASE_CO),
    itemListJsonLdCo("Observatorio de datos de Colombia", [
      ...tarjetasMacro.map((t) => ({ name: t.titulo, path: t.href })),
      ...tarjetasCarreras.map((t) => ({ name: t.titulo, path: t.href })),
    ]),
    faqJsonLdCo(FAQS),
  ];

  return (
    <div className="mx-auto max-w-[1180px] space-y-10 px-4 py-6 sm:px-6 lg:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <div className="space-y-4">
        <MigasDatos migas={MIGAS_BASE_CO} />

        <header className="space-y-3">
          <p className="text-sm font-semibold text-emerald-700">
            Observatorio abierto de Colombia · DANE, OLE, SNIES y MinTrabajo
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem]">
            Datos de Colombia, explicados en simple
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Consulta las cifras oficiales de desempleo, inflación, salario mínimo 2026 y
            salarios de {enteroCo(totalFichas)} carreras en Colombia. Sin registro, con fuentes
            verificadas y series descargables.
          </p>
        </header>
      </div>

      <section aria-labelledby="cifras-control-titulo" className="space-y-4">
        <h2 id="cifras-control-titulo" className="text-xl font-semibold tracking-tight text-foreground">
          Cifras de control vigentes
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/co/datos/desempleo" className="group block">
            <KpiCard
              valor={tasaCo(p2026.desempleo_nacional_sep_2026_pct)}
              etiqueta="Desempleo nacional (sep-2026)"
              delta="Ver 23 ciudades"
              subtitulo="Tasa mensual total nacional. Agregado 23 ciudades jul–sep 2026: 8,9 %."
              fuente="DANE · GEIH"
              icono={<BarChart3 className="size-4" aria-hidden="true" />}
              variante="primary"
              className="h-full transition-colors group-hover:border-blue-400"
            />
          </Link>

          <Link href="/co/datos/inflacion" className="group block">
            <KpiCard
              valor={tasaCo(p2026.ipc_var_12m_oct_2026_pct, 2)}
              etiqueta="Inflación anual IPC (oct-2026)"
              delta={`Índice ${p2026.ipc_indice_oct_2026.toFixed(2).replace(".", ",")}`}
              subtitulo={`Base ${p2026.ipc_base}. Tasa BanRep: ${tasaCo(p2026.tasa_intervencion_pct_2026_11_24, 2)}.`}
              fuente="DANE · IPC"
              icono={<TrendingUp className="size-4" aria-hidden="true" />}
              className="h-full transition-colors group-hover:border-amber-400"
            />
          </Link>

          <Link href="/co/datos/salario-minimo" className="group block sm:col-span-2 lg:col-span-1">
            <KpiCard
              valor={pesosCo(p2026.smmlv_2026_cop)}
              etiqueta="Salario mínimo 2026 (SMMLV)"
              delta={`Total ${pesosCo(p2026.total_smmlv_mas_auxilio_2026_cop)}`}
              subtitulo={`Incluye auxilio de transporte de ${pesosCo(p2026.auxilio_transporte_2026_cop)} (hasta 2 SMMLV).`}
              fuente="MinTrabajo · Decretos 1469/2025 y 1470/2025"
              icono={<Briefcase className="size-4" aria-hidden="true" />}
              className="h-full transition-colors group-hover:border-emerald-400"
            />
          </Link>
        </div>
      </section>

      <section aria-labelledby="macro-titulo" className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="macro-titulo" className="text-xl font-semibold tracking-tight text-foreground">
              Indicadores macroeconómicos y salario mínimo
            </h2>
            <p className="text-sm text-muted-foreground">
              Series históricas interactivas, calculadora de poder adquisitivo y parámetros laborales 2026.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {tarjetasMacro.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-emerald-500/70"
            >
              <div className="space-y-2">
                <span className="inline-block rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                  {item.etiqueta}
                </span>
                <h3 className="text-base font-semibold text-foreground group-hover:text-emerald-800">
                  {item.titulo}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                Explorar datos
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="carreras-titulo" className="space-y-4">
        <div>
          <h2 id="carreras-titulo" className="text-xl font-semibold tracking-tight text-foreground">
            Carreras y salarios en Colombia ({metaCarreras.cohorte})
          </h2>
          <p className="text-sm text-muted-foreground">
            Datos del Observatorio Laboral para la Educación (OLE) y SNIES expresados en SMMLV y pesos de 2026.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {tarjetasCarreras.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-blue-500/70"
            >
              <div className="space-y-2">
                <span className="inline-block rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {item.etiqueta}
                </span>
                <h3 className="text-base font-semibold text-foreground group-hover:text-blue-700">
                  {item.titulo}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700">
                Ver ranking y fichas
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="guias-co-titulo" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="guias-co-titulo" className="text-xl font-semibold tracking-tight text-foreground">
              Guías y plantillas de Excel laboral en Colombia
            </h2>
            <p className="text-sm text-muted-foreground">
              5 guías paso a paso con plantillas descargables actualizadas con el SMMLV 2026.
            </p>
          </div>
          <Link
            href="/co/guias"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
          >
            Ver todas las guías
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIAS_PASO_A_PASO_CO.map((guia) => (
            <Link
              key={guia.slug}
              href={`/co/guias/${guia.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-slate-400"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <FileSpreadsheet className="size-4 text-emerald-700" aria-hidden="true" />
                  <span>Plantilla Excel 2026</span>
                </div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-blue-700">
                  {guia.h1}
                </h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{guia.meta}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-blue-700">
                Abrir guía
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Card className="rounded-xl border border-border bg-card shadow-xs ring-0">
        <CardContent className="flex flex-col gap-6 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <GraduationCap className="size-4 text-blue-600" aria-hidden="true" />
              <span>Formación aplicada en Colombia · ProgramBI</span>
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Lleva el análisis de datos y Power BI a tu trabajo
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Aprende con clases en vivo y proyectos reales en Power BI, Análisis de Datos y Excel.
              Disponible en 3 cuotas sin interés; cotiza por WhatsApp y averigua cómo podríamos ayudarte.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href="/co/cursos/power-bi"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "h-8 gap-1 rounded-md px-3 text-xs font-medium"
                )}
              >
                Curso de Power BI
                <ArrowUpRight className="size-3 text-muted-foreground" aria-hidden="true" />
              </Link>
              <Link
                href="/co/cursos/analisis-de-datos"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "h-8 gap-1 rounded-md px-3 text-xs font-medium"
                )}
              >
                Análisis de Datos
                <ArrowUpRight className="size-3 text-muted-foreground" aria-hidden="true" />
              </Link>
              <Link
                href="/co/datos/inflacion"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-8 gap-1 rounded-md px-3 text-xs font-medium"
                )}
              >
                <Calculator className="size-3 text-muted-foreground" aria-hidden="true" />
                Calculadora IPC
              </Link>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col">
            <WhatsAppCta
              page={PATH}
              country="co"
              intent="pack"
              course="Power BI y Análisis de Datos"
              courseSlug="power-bi"
              ctaPosition="datos_co_hub"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "min-h-11 justify-center gap-2 rounded-lg px-5 text-sm font-medium"
              )}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Consultar por WhatsApp
            </WhatsAppCta>
          </div>
        </CardContent>
      </Card>

      <FaqDatos faqs={FAQS} />
    </div>
  );
}
