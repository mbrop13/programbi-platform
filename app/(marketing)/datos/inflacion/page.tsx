import type { Metadata } from "next";
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
      ? `En el tramo completo cargado en la serie (${mesLargo(primer.m)} a ${mesLargo(
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
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <MigasDatos migas={MIGAS} />

      <header className="max-w-3xl space-y-3">
        <p className="inline-flex items-center rounded-full border border-[#e2e2dc] bg-white px-3 py-1 text-xs font-semibold tracking-wide text-[#1890ff] uppercase">
          IPC oficial INE · Base 2023 = 100
        </p>
        <h1 className="h1-datos text-[#171716]">
          Calculadora de IPC: cuánto valen tus pesos hoy
        </h1>
        <p className="text-base leading-relaxed text-[#5c5c58] sm:text-lg">
          Convierte montos históricos, aranceles o sueldos de mifuturo.cl a pesos actuales usando la
          serie oficial del Índice de Precios al Consumidor de Chile.
        </p>
      </header>

      <InflacionInteractiva serie={serie} />

      <EnResumen
        frases={resumenFrases}
        fuente="Fuente: Instituto Nacional de Estadísticas (INE) de Chile · Base 2023 = 100 · Licencia CC BY-SA 4.0."
      />

      <FaqDatos faqs={FAQS} />

      <CtaDatos slug="inflacion" pagina={PATH} />

      <FuenteLinea
        fuente="Fuente: Instituto Nacional de Estadísticas (INE) de Chile vía Banco Central de Chile · Licencia CC BY-SA 4.0."
        conAviso={false}
      />
    </div>
  );
}
