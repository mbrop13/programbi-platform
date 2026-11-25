import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowRight, ChevronDown } from "lucide-react";
import { CtaDatos } from "@/components/datos/CtaDatos";
import { EnResumen } from "@/components/datos/EnResumen";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { InflacionInteractiva } from "@/components/datos/InflacionInteractiva";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { mesLargo, variacionPorcentual } from "@/lib/datos/formato";
import { getIpcSeries, getUltimoIpc, variacionIpc } from "@/lib/datos/ipc";
import {
  breadcrumbsSchema,
  faqPageSchema,
  metadataSimpleDatos,
  webAppSchema,
  type MigajaDatos,
} from "@/lib/datos/seo-carreras";
import { jsonLdString, ORG_ID, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

const PATH = "/datos/inflacion";

const MIGAS: readonly MigajaDatos[] = [
  { label: "Inicio", path: "/" },
  { label: "Datos de Chile", path: "/datos" },
  { label: "Calculadora de IPC", path: PATH },
];

const FAQS = [
  {
    pregunta: "¿Cómo se calcula el ajuste por IPC en Chile?",
    respuesta:
      "Se multiplica el monto original por el índice IPC del mes de destino y se divide por el índice IPC del mes de origen: monto × (IPC_destino / IPC_origen). Es la fórmula oficial utilizada por el Instituto Nacional de Estadísticas (INE).",
  },
  {
    pregunta: "¿Cómo sé si mi sueldo le ganó a la inflación?",
    respuesta:
      "Si el porcentaje en que subió tu sueldo es mayor que la variación del IPC en el mismo período, ganaste poder adquisitivo. Si subió menos (o se mantuvo igual), hoy puedes comprar menos con ese mismo dinero. Puedes comprobarlo al instante en la pestaña «¿Mi sueldo le ganó al IPC?».",
  },
  {
    pregunta: "¿Por qué los sueldos de mifuturo.cl están en pesos de septiembre de 2025?",
    respuesta:
      "El Mineduc publica los ingresos de titulados expresados en moneda homogénea de septiembre de 2025 para que puedas comparar carreras sin distorsión por inflación. Con esta calculadora puedes llevar esos montos al último IPC disponible.",
  },
  {
    pregunta: "¿Qué significa IPC Base 2023 = 100?",
    respuesta:
      "Indica que el promedio de precios de la canasta del año 2023 equivale al valor índice 100,00. Los meses posteriores reflejan la variación acumulada respecto de esa base oficial del INE.",
  },
  {
    pregunta: "¿Cuál es la fuente oficial de los datos del IPC?",
    respuesta:
      "Los índices provienen del Instituto Nacional de Estadísticas (INE) de Chile y se distribuyen bajo licencia Creative Commons Atribución-CompartirIgual 4.0 (CC BY-SA 4.0).",
  },
] as const;

export function generateMetadata(): Metadata {
  return metadataSimpleDatos({
    path: PATH,
    title: "Calculadora de IPC Chile: cuánto valen tus pesos hoy",
    description:
      "Calcula el ajuste por inflación en Chile con la serie oficial del IPC (INE, base 2023=100). Actualiza sueldos, aranceles y montos a pesos de hoy.",
  });
}

export default function InflacionPage() {
  const serie = getIpcSeries();
  const primer = serie[0];
  const ultimo = getUltimoIpc();
  const [ultimoY, ultimoM] = ultimo.m.split("-");
  const mesHace12 = ultimoY && ultimoM ? `${Number(ultimoY) - 1}-${ultimoM}` : "2025-10";
  const var12Meses = variacionIpc(mesHace12, ultimo.m, serie);
  const varSep25 = variacionIpc("2025-09", ultimo.m, serie);
  const varTotal = primer ? variacionIpc(primer.m, ultimo.m, serie) : null;

  const resumenFrases = [
    `El Índice de Precios al Consumidor (IPC) publicado por el INE (base 2023 = 100) alcanzó ${ultimo.v
      .toFixed(2)
      .replace(".", ",")} puntos en ${mesLargo(ultimo.m)}.`,
    varSep25 !== null
      ? `Entre septiembre de 2025 y ${mesLargo(ultimo.m)}, la variación acumulada del IPC fue de ${variacionPorcentual(
          varSep25
        ).replace("\u00a0", " ")}, por lo que un sueldo de $1.000.000 de esa fecha equivale hoy a ${Math.round(
          1_000_000 * (1 + varSep25)
        ).toLocaleString("es-CL")} pesos.`
      : "Puedes actualizar cualquier monto desde septiembre de 2025 al último mes oficial disponible.",
    primer && varTotal !== null
      ? `En el tramo completo de la serie (${mesLargo(primer.m)} a ${mesLargo(
          ultimo.m
        )}), el índice acumula una variación de ${variacionPorcentual(varTotal).replace("\u00a0", " ")}.`
      : "La fórmula oficial aplica la razón directa entre ambos índices mensuales sin redondeos intermedios.",
  ];

  const pageUrl = `${SITE_URL}${PATH}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbsSchema(MIGAS),
      faqPageSchema(FAQS),
      webAppSchema({
        path: PATH,
        name: "Calculadora de IPC Chile — ProgramBI",
        description:
          "Herramienta gratuita para ajustar montos en pesos chilenos según el Índice de Precios al Consumidor oficial del INE.",
      }),
      {
        "@type": "Dataset",
        "@id": `${pageUrl}#dataset`,
        name: "Serie del Índice de Precios al Consumidor (IPC) de Chile — Base 2023=100",
        description:
          "Valores mensuales del IPC oficial de Chile publicados por el Instituto Nacional de Estadísticas (INE) y utilizados para actualizar montos a pesos de hoy.",
        url: pageUrl,
        inLanguage: "es-CL",
        license: "https://creativecommons.org/licenses/by-sa/4.0/",
        creator: { "@type": "Organization", "@id": ORG_ID, name: "ProgramBI" },
        isBasedOn: ["https://calculadoraipc.ine.cl", "https://www.ine.gob.cl/"],
        creditText:
          "Fuente: Instituto Nacional de Estadísticas (INE) de Chile, distribuido bajo licencia CC BY-SA 4.0.",
        spatialCoverage: { "@type": "Country", name: "Chile" },
        dateModified: `${ultimo.m}-01`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1180px] space-y-10 px-4 py-6 sm:px-6 lg:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <div className="space-y-4">
        <MigasDatos migas={MIGAS} />

        <header className="grid items-stretch gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="flex flex-col justify-center py-2">
            <p className="text-sm font-semibold text-ipc-tinta">
              Calculadora de IPC · INE, actualizado a {mesLargo(ultimo.m)}
            </p>
            <h1 className="h1-datos mt-3 text-foreground">
              ¿Cuánto <span className="marcador">poder de compra</span> pierde tu plata?
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Mira cuánto rinde hoy un sueldo, arriendo o ahorro de antes si no se reajustó, y cuánto
              necesitarías para comprar lo mismo. Con la serie oficial del IPC del INE.
            </p>
          </div>

          {var12Meses !== null ? (
            <div className="flex flex-col justify-between gap-6 rounded-[1.75rem] bg-ipc p-6 text-foreground sm:p-8">
              <p className="text-sm font-semibold">Inflación de los últimos 12 meses</p>
              <p className="font-display text-[clamp(3.5rem,8vw,5.5rem)] leading-[0.9] font-extrabold tracking-[-0.05em] tabular-nums">
                {variacionPorcentual(var12Meses)}
              </p>
              <p className="text-[15px] leading-snug font-medium">
                {mesLargo(mesHace12)} a {mesLargo(ultimo.m)}. Índice actual:{" "}
                {ultimo.v.toFixed(2).replace(".", ",")} puntos (base 2023 = 100).
              </p>
            </div>
          ) : null}
        </header>
      </div>

      <InflacionInteractiva serie={serie} />

      {/* Puente al observatorio de carreras (sus sueldos vienen en pesos de sep-2025) */}
      <section
        aria-labelledby="inflacion-carreras"
        className="flex flex-col gap-5 rounded-[1.75rem] bg-carreras p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8"
      >
        <div className="max-w-2xl">
          <h2 id="inflacion-carreras" className="font-display text-2xl font-bold">
            ¿Revisando sueldos de carreras?
          </h2>
          <p className="mt-2 text-base leading-relaxed">
            En el ranking de carreras puedes ver todos los sueldos de mifuturo.cl en pesos de hoy
            con un clic, usando esta misma serie del IPC.
          </p>
        </div>
        <Link
          href="/datos/carreras"
          className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-white px-5 text-[15px] font-semibold text-foreground transition-colors hover:bg-[#e6f4ff]"
        >
          Ver sueldos de carreras
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      <details className="group rounded-[1.25rem] border border-line bg-white">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-6 py-4 text-base font-semibold text-foreground select-none hover:bg-slate-50">
          <span>En resumen y nota metodológica oficial</span>
          <ChevronDown
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="border-t border-border/70">
          <EnResumen
            frases={resumenFrases}
            fuente="Fuente: Instituto Nacional de Estadísticas (INE) de Chile · Base 2023 = 100 · Licencia CC BY-SA 4.0."
            className="rounded-none border-0 shadow-none"
          />
        </div>
      </details>

      <FaqDatos faqs={FAQS} />

      <CtaDatos slug="inflacion" pagina={PATH} />

      <FuenteLinea
        fuente="Fuente: Instituto Nacional de Estadísticas (INE) de Chile vía Banco Central de Chile · Licencia CC BY-SA 4.0."
        conAviso={false}
      />
    </div>
  );
}
