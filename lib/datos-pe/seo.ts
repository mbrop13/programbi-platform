import type { Metadata } from "next";
import { ORG_ID, SITE_URL } from "@/lib/seo";
import { hreflangDatosDe } from "@/lib/seo/datos-hreflang";
import { getMetaCarrerasPe, type CarreraPe } from "./carreras";
import { porcentajeTexto, solesTexto } from "./formato";
import { profesionDeCarreraPe, tituloFichaPe } from "./textos";

export interface MigajaPe {
  label: string;
  path: string;
}

export const MIGAS_PE_BASE: readonly MigajaPe[] = [
  { label: "Inicio", path: "/pe" },
  { label: "Datos de Perú", path: "/pe/datos" },
  { label: "Carreras", path: "/pe/datos/carreras" },
];

export function urlAbsolutaPe(path: string): string {
  const limpio = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${limpio}`;
}

function ajustarDescripcionPe(texto: string): string {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= 155) return limpio;
  let corte = limpio.slice(0, 154).trim();
  const espacio = corte.lastIndexOf(" ");
  if (espacio >= 120) corte = corte.slice(0, espacio);
  return corte.replace(/[\s,;:.\-–—]+$/, "") + ".";
}

export function metadataPaginaPe(opts: {
  path: string;
  title: string;
  description: string;
  languages?: Record<string, string>;
}): Metadata {
  const url = urlAbsolutaPe(opts.path);
  const title = opts.title.slice(0, 60);
  const description = ajustarDescripcionPe(opts.description);
  const languages = opts.languages ?? hreflangDatosDe(opts.path);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "ProgramBI",
      locale: "es_PE",
      url,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function metadataFichaCarreraPe(
  carrera: CarreraPe,
  languages?: Record<string, string>,
): Metadata {
  const path = `/pe/datos/carreras/${carrera.slug}`;
  const prof = profesionDeCarreraPe(carrera);
  const title = tituloFichaPe(carrera);
  const medStr = solesTexto(carrera.enaho.mediana);
  const ocupStr = porcentajeTexto(carrera.enaho.pctOcupados);
  const desc = `${prof.articulo === "una" ? "Una" : "Un"} ${prof.persona} en Perú tiene una mediana de ${medStr} mensuales (ENAHO 2022–2024) y ${ocupStr} ocupados. Revisa planilla MTPE y universidades SUNEDU.`;
  return metadataPaginaPe({
    path,
    title,
    description: desc,
    languages: languages ?? hreflangDatosDe(path),
  });
}

export function breadcrumbsPeSchema(migas: readonly MigajaPe[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: migas.map((m, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: m.label,
      item: urlAbsolutaPe(m.path),
    })),
  };
}

export function faqPagePeSchema(faqs: readonly { pregunta: string; respuesta: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: { "@type": "Answer", text: f.respuesta },
    })),
  };
}

export function itemListPeSchema(
  name: string,
  items: readonly Pick<CarreraPe, "nombre" | "slug" | "tipo">[],
) {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: `${item.nombre} (${item.tipo === "universitaria" ? "Universitaria" : "Técnica"})`,
      url: urlAbsolutaPe(`/pe/datos/carreras/${item.slug}`),
    })),
  };
}

export function datasetPeSchema(opts: {
  path: string;
  name: string;
  description: string;
}) {
  const meta = getMetaCarrerasPe();
  const url = urlAbsolutaPe(opts.path);
  return {
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: "es-PE",
    creator: { "@type": "Organization", "@id": ORG_ID, name: "ProgramBI" },
    isBasedOn: meta.fuentes.map((f) => f.url),
    creditText:
      "Fuente: Elaboración propia a partir de INEI ENAHO 2022–2024, MTPE-DISEL Planilla Electrónica, MTPE EDO 2026 y SUNEDU.",
    temporalCoverage: "2022/2026",
    spatialCoverage: { "@type": "Country", name: "Perú" },
    dateModified: meta.fechaCorte,
    variableMeasured: [
      "Ingreso laboral mensual mediano de egresados 25-40 años (S/ de 2024, ENAHO)",
      "Porcentaje de egresados ocupados (%)",
      "Afiliación a sistema de pensiones (%)",
      "Sueldo promedio formal privado 18-29 años (MTPE-DISEL)",
    ],
    distribution: [
      {
        "@type": "DataDownload",
        name: "Carreras en Perú — ENAHO, MTPE y SUNEDU (CSV)",
        encodingFormat: "text/csv",
        contentUrl: urlAbsolutaPe("/pe/datos/carreras/csv/carreras-peru.csv"),
      },
    ],
  };
}
