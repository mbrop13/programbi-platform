import type { Metadata } from "next";
import { ORG_ID, SITE_URL } from "@/lib/seo";
import { datosTerritorio, FECHA_EDICION, FUENTE_ENE, LICENCIA, PERIODO_ACTUAL, REVISION_DESEMPLEO, type Observacion } from "./desempleo";
import { periodo, tasa } from "./desempleo-formato";
import { NACIONAL, rutaTerritorio } from "./regiones";

export type Migaja = { label: string; path: string };
export type Pregunta = { pregunta: string; respuesta: string };
export const MIGAS_DATOS = [
  { label: "Inicio", path: "/" },
  { label: "Datos de Chile", path: "/datos" },
];

const SUFIJOS = [
  "Explora la serie histórica desde 2010, compara con Chile y descarga los datos oficiales en CSV y Excel.",
  "Revisa el histórico desde 2010, compáralo con Chile y descarga el CSV o Excel con datos oficiales.",
  "Compara con Chile, revisa la serie desde 2010 y descarga los datos oficiales en Excel o CSV.",
  "Revisa la serie desde 2010, compara con Chile y descarga los datos oficiales en CSV o XLSX.",
  "Compara con Chile y explora la serie desde 2010 con descargas oficiales en CSV y XLSX.",
  "Mira la serie desde 2010 y descarga datos oficiales en CSV o Excel para comparar con Chile.",
  "Compara con Chile y descarga la serie oficial desde 2010 en CSV o Excel.",
  "Consulta el histórico y descarga los datos oficiales en CSV o Excel.",
  "Compara con Chile y descarga el histórico en CSV o Excel.",
];

export function metaObservatorio(slug: string, nombre: string, esHub = false): Metadata {
  const esChile = slug === NACIONAL;
  const path = esHub ? "/datos" : rutaTerritorio(slug);
  const title = esHub
    ? "Datos de Chile: observatorio de desempleo del INE"
    : esChile
      ? "Desempleo en Chile: tasa actual por región (INE)"
      : `Desempleo en ${nombre}: tasa actual e histórico`;
  const fecha = periodo(PERIODO_ACTUAL);
  const principal = esHub || esChile ? "Chile" : nombre;
  const datos = datosTerritorio(slug);
  if (!datos) return { title: { absolute: title }, robots: { index: false, follow: true } };
  const valor = tasa(datos.actual.tasa).replace(" ", " ");
  const inicio = `Tasa de desempleo en ${principal}: ${valor} en ${fecha}, según el INE. `;
  const opciones = esChile ? [
    "Consulta las 16 regiones, compara trimestres y descarga las series históricas en CSV y Excel.",
    "Consulta las 16 regiones, compara trimestres y descarga series oficiales en CSV y Excel.",
    ...SUFIJOS,
  ] : SUFIJOS;
  const description = opciones.map((opcion) => inicio + opcion).find((texto) => texto.length >= 140 && texto.length <= 155)
    ?? inicio + "Explora el histórico y descarga los datos oficiales.";
  const url = `${SITE_URL}${path}`;
  const imagen = `${SITE_URL}/datos/desempleo/og/${esHub ? "hub" : slug}?v=${REVISION_DESEMPLEO}`;
  return {
    title: { absolute: title.length <= 60 ? title : `Desempleo en ${nombre}: tasa e histórico` },
    description,
    keywords: ["desempleo", `tasa de desocupación ${principal}`, "Encuesta Nacional de Empleo", "INE Chile"],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { type: "website", siteName: "ProgramBI", locale: "es_CL", url, title, description,
      images: [{ url: imagen, width: 1200, height: 630, alt: `Desempleo en ${principal}, ${valor}` }] },
    twitter: { card: "summary_large_image", title, description, images: [imagen] },
  };
}

export function breadcrumbs(migas: readonly Migaja[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: migas.map(({ label, path }, index) => ({
      "@type": "ListItem", position: index + 1, name: label, item: `${SITE_URL}${path === "/" ? "" : path}`,
    })),
  };
}

export function dataset(slug: string, nombre: string, descripcion: string, serie: readonly Observacion[]) {
  const url = `${SITE_URL}${rutaTerritorio(slug)}`;
  return {
    "@type": "Dataset",
    "@id": `${url}#serie-ene`,
    name: `Serie trimestral de desocupación de ${nombre} (INE, ENE)`,
    description: descripcion,
    url,
    inLanguage: "es-CL",
    creator: { "@type": "Organization", "@id": ORG_ID, name: "ProgramBI" },
    isBasedOn: FUENTE_ENE,
    license: LICENCIA,
    temporalCoverage: `${serie[0].p}/${PERIODO_ACTUAL}`,
    spatialCoverage: { "@type": "Place", name: nombre, containedInPlace: slug === NACIONAL ? undefined : { "@type": "Country", name: "Chile" } },
    variableMeasured: [
      "Tasa de desocupación (%)", "Tasa de ocupación (%)", "Tasa de participación (%)",
      "Fuerza de trabajo (miles de personas)", "Ocupados (miles de personas)", "Desocupados (miles de personas)",
    ],
    dateModified: FECHA_EDICION,
    distribution: [
      { "@type": "DataDownload", name: `Serie de ${nombre} en CSV`, encodingFormat: "text/csv", contentUrl: `${SITE_URL}/datos/desempleo/csv/${slug}.csv` },
      { "@type": "DataDownload", name: "Chile y regiones en Excel", encodingFormat: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", contentUrl: `${SITE_URL}/datos/desempleo/desempleo-chile.xlsx` },
    ],
  };
}

export function faqSchema(preguntas: readonly Pregunta[]) {
  return {
    "@type": "FAQPage",
    mainEntity: preguntas.map(({ pregunta, respuesta }) => ({
      "@type": "Question", name: pregunta, acceptedAnswer: { "@type": "Answer", text: respuesta },
    })),
  };
}
