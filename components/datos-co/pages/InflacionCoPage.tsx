import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  DollarSign,
  Download,
  GraduationCap,
  Landmark,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { EnResumen } from "@/components/datos/EnResumen";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { KpiCard } from "@/components/datos/KpiCard";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { CalculadoraIpcCo } from "@/components/datos-co/macro/CalculadoraIpcCo";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { pesosCo, tasaCo } from "@/lib/datos-co/formato";
import { getInflacionCo } from "@/lib/datos-co/macro";
import {
  breadcrumbJsonLdCo,
  datasetJsonLdCo,
  faqJsonLdCo,
  metadataDatosCo,
  MIGAS_BASE_CO,
  webApplicationJsonLdCo,
} from "@/lib/datos-co/seo";
import { jsonLdString } from "@/lib/seo";
import { cn } from "@/lib/utils";


type Params = { pais: string };


const PATH = "/co/datos/inflacion";
const CSV_PATH = "/co/datos/inflacion/csv/ipc-colombia-dane.csv";

const MIGAS = [
  ...MIGAS_BASE_CO,
  { label: "Inflación e IPC", path: PATH },
] as const;

const FAQS = [
  {
    pregunta: "¿Cómo se calcula el ajuste por IPC en Colombia?",
    respuesta:
      "Se multiplica el monto original por la razón entre el índice IPC del mes de destino y el índice IPC del mes de origen: monto × (IPC_destino / IPC_origen). La serie oficial del DANE utiliza base diciembre de 2018 = 100.",
  },
  {
    pregunta: "¿Cuál es la inflación anual en Colombia a octubre de 2026?",
    respuesta:
      "Según el DANE, en octubre de 2026 la variación a 12 meses del IPC fue de 6,30 % y el índice general alcanzó 161,32 puntos (base dic-2018 = 100).",
  },
  {
    pregunta: "¿Qué relación tienen el IPC, la tasa de intervención del BanRep y la TRM?",
    respuesta:
      "El Banco de la República ajusta su tasa de interés de política monetaria (12,25 % al 24 de noviembre de 2026) para conducir la inflación hacia su meta. La TRM ($3.592,03 COP/USD al 25 de noviembre de 2026) refleja el tipo de cambio oficial del dólar en Colombia.",
  },
  {
    pregunta: "¿Cuál es la fuente oficial del IPC y de la TRM?",
    respuesta:
      "La serie del IPC proviene del DANE (anex-IPC-Indices-oct2026.xlsx). La tasa de intervención proviene del Banco de la República (API SDMX) y la TRM de referencia proviene de datos.gov.co (conjunto 32sa-8pi3, Superfinanciera) bajo licencia CC BY-SA 4.0.",
  },
] as const;

export async function metadataCoInflacion({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "co") return {};
  return metadataDatosCo({
    title: "Inflación y calculadora de IPC Colombia 2026 (DANE)",
    description:
      "Inflación en Colombia (6,30 % oct-2026) y calculadora de IPC DANE (base dic-2018=100). Ajusta salarios y montos en COP, consulta tasa BanRep y TRM.",
    path: PATH,
    rutaHreflang: "/datos/inflacion",
    keywords: [
      "calculadora ipc colombia",
      "inflacion colombia 2026",
      "ipc dane octubre 2026",
      "tasa banrep colombia",
      "trm colombia",
    ],
  });
}

export async function PageCoInflacion({
  params,
}: {
  params: Promise<Params>;
}) {
  const { pais } = await params;
  if (pais !== "co") notFound();

  const data = getInflacionCo();
  const { meta, serie } = data;

  const resumenFrases = [
    `En octubre de 2026, el Índice de Precios al Consumidor (IPC) del DANE (base ${meta.base}) alcanzó ${meta.indice_actual.toFixed(2).replace(".", ",")} puntos, con una variación anual de ${tasaCo(meta.var_12m_actual_pct, 2)}.`,
    `La tasa de interés de política monetaria del Banco de la República se ubicó en ${tasaCo(meta.tasa_intervencion_pct, 2)} al ${meta.tasa_intervencion_fecha}.`,
    `La Tasa Representativa del Mercado (TRM) de referencia se situó en ${meta.trm_cop_usd.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP/USD al ${meta.trm_fecha} (${meta.trm_licencia}).`,
  ];

  const jsonLd = [
    breadcrumbJsonLdCo(MIGAS),
    webApplicationJsonLdCo({
      name: "Calculadora de IPC y poder adquisitivo de Colombia — ProgramBI",
      description:
        "Herramienta gratuita para ajustar montos en pesos colombianos y comparar salarios frente a la inflación oficial del DANE (base dic-2018=100).",
      path: PATH,
    }),
    datasetJsonLdCo({
      id: "dataset-ipc-co",
      name: "Serie del Índice de Precios al Consumidor (IPC) de Colombia — Base dic-2018=100",
      description:
        "Serie mensual del IPC nacional de Colombia (2003–oct-2026) publicada por el DANE.",
      path: PATH,
      isBasedOn: {
        name: meta.fuente_ipc,
        url: meta.fuente_ipc_url,
      },
      variableMeasured: [
        "Índice de Precios al Consumidor (base dic-2018=100)",
        "Variación anual 12 meses (%)",
      ],
      temporalCoverage: "2003-01/2026-10",
      dateModified: "2026-11-09",
      distributions: [
        {
          name: "ipc-colombia-dane.csv",
          encodingFormat: "text/csv",
          path: CSV_PATH,
        },
      ],
    }),
    datasetJsonLdCo({
      id: "dataset-trm-co",
      name: "TRM de referencia en Colombia (datos.gov.co 32sa-8pi3)",
      description:
        "Tasa de Cambio Representativa del Mercado (TRM) COP/USD de la Superintendencia Financiera de Colombia.",
      path: PATH,
      isBasedOn: {
        name: meta.trm_fuente,
        url: meta.trm_url,
      },
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      variableMeasured: ["Tasa de Cambio Representativa del Mercado (COP/USD)"],
      dateModified: meta.trm_fecha,
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
            <p className="text-sm font-semibold text-amber-800">
              DANE IPC · Banco de la República · TRM Superfinanciera
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Inflación en Colombia (6,30 %) y calculadora de poder adquisitivo
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              Ajusta cualquier monto o salario en pesos colombianos con la serie oficial del IPC
              del DANE (base dic-2018 = 100) y consulta la tasa de intervención y la TRM de referencia.
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
            Descargar CSV IPC
          </a>
        </header>
      </div>

      <section aria-label="Indicadores de inflación y política monetaria" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          valor={tasaCo(meta.var_12m_actual_pct, 2)}
          etiqueta="Inflación 12 meses (oct-2026)"
          fuente="DANE · IPC"
          icono={<TrendingUp className="size-4" aria-hidden="true" />}
          variante="primary"
        />
        <KpiCard
          valor={meta.indice_actual.toFixed(2).replace(".", ",")}
          etiqueta="Índice IPC (oct-2026)"
          subtitulo={`Base ${meta.base}`}
          fuente="DANE · Serie mensual"
        />
        <KpiCard
          valor={tasaCo(meta.tasa_intervencion_pct, 2)}
          etiqueta="Tasa de intervención BanRep"
          subtitulo={`Vigente al ${meta.tasa_intervencion_fecha}`}
          fuente="Banco de la República · SDMX"
          icono={<Landmark className="size-4" aria-hidden="true" />}
        />
        <KpiCard
          valor={pesosCo(meta.trm_cop_usd)}
          etiqueta="TRM de referencia (COP/USD)"
          subtitulo={`Exacta: ${meta.trm_cop_usd.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${meta.trm_fecha})`}
          fuente={`datos.gov.co 32sa-8pi3 · ${meta.trm_licencia}`}
          icono={<DollarSign className="size-4" aria-hidden="true" />}
        />
      </section>

      <CalculadoraIpcCo serie={serie} />

      <EnResumen
        frases={resumenFrases}
        fuente={`Fuentes: ${meta.fuente_ipc} | ${meta.tasa_intervencion_fuente} | ${meta.trm_fuente}`}
      />

      <Card className="rounded-xl border border-border bg-card shadow-xs ring-0">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <GraduationCap className="size-4 text-blue-600" aria-hidden="true" />
              <span>Modelos financieros y tableros en vivo</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              ¿Trabajas con series de IPC, presupuestos o indicadores financieros?
            </h2>
            <p className="text-sm text-muted-foreground">
              Aprende Excel aplicado y Power BI con proyectos reales. Clases en vivo, 3 cuotas sin
              interés y clase gratis de prueba.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Link
              href="/co/cursos/excel"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 gap-1.5 rounded-lg px-4 text-sm font-medium"
              )}
            >
              Curso Excel
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/co/cursos/power-bi"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 gap-1.5 rounded-lg px-4 text-sm font-medium"
              )}
            >
              Curso Power BI
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <WhatsAppCta
              page={PATH}
              country="co"
              intent="curso"
              course="Excel y Power BI"
              courseSlug="excel"
              ctaPosition="inflacion_co_cta"
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

      <div className="space-y-1 text-xs text-muted-foreground">
        <p>
          Fuente IPC:{" "}
          <a
            href={meta.fuente_ipc_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            {meta.fuente_ipc}
          </a>
        </p>
        <p>
          Fuente TRM:{" "}
          <a
            href={meta.trm_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            {meta.trm_fuente}
          </a>
        </p>
      </div>
    </div>
  );
}
