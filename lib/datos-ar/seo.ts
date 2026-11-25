import type { Metadata } from "next";
import { ORG_ID, SITE_URL } from "@/lib/seo";
import { hreflangDatosDe } from "@/lib/seo/datos-hreflang";

export const CANONICAL_AR_DATOS_BASE = `${SITE_URL}/ar/datos`;
export const ARAUCANO_CC_BY_4_URL = "https://creativecommons.org/licenses/by/4.0/";

export interface MigajaAr {
  label: string;
  path: string;
}

export interface PreguntaAr {
  pregunta: string;
  respuesta: string;
}

export function canonicalArUrl(subpath = ""): string {
  const limpio = subpath.replace(/^\/+/, "");
  return limpio ? `${CANONICAL_AR_DATOS_BASE}/${limpio}` : CANONICAL_AR_DATOS_BASE;
}

export function metadataDatosAr(opts: {
  subpath?: string;
  title: string;
  description: string;
  keywords?: string[];
  languages?: Record<string, string>;
  noindex?: boolean;
}): Metadata {
  const limpio = opts.subpath ? opts.subpath.replace(/^\/+/, "") : "";
  const path = limpio ? `/ar/datos/${limpio}` : "/ar/datos";
  const url = canonicalArUrl(opts.subpath);
  const languages = opts.languages ?? hreflangDatosDe(path);
  return {
    title: { absolute: opts.title },
    description: opts.description,
    keywords: opts.keywords,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
    },
    robots: opts.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "ProgramBI",
      locale: "es_AR",
      url,
      title: opts.title,
      description: opts.description,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
    },
  };
}

export function breadcrumbJsonLdAr(migas: readonly MigajaAr[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.map(({ label, path }, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: label,
      item: path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`,
    })),
  };
}

export function faqJsonLdAr(preguntas: readonly PreguntaAr[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: p.respuesta,
      },
    })),
  };
}

/**
 * Dataset JSON-LD para Araucano (CEP XXI).
 * Única fuente con licencia abierta confirmada: CC BY 4.0.
 */
export function datasetAraucanoJsonLd(opts: {
  subpath: string;
  name: string;
  description: string;
  temporalCoverage: string;
  dateModified: string;
  csvPath?: string;
}) {
  const url = canonicalArUrl(opts.subpath);
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset-araucano`,
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: "es-AR",
    creator: { "@type": "Organization", "@id": ORG_ID, name: "ProgramBI" },
    isBasedOn: "https://datos.produccion.gob.ar/dataset/graduados-universitarios-del-sistema-araucano-2016-2018",
    license: ARAUCANO_CC_BY_4_URL,
    temporalCoverage: opts.temporalCoverage,
    spatialCoverage: { "@type": "Country", name: "Argentina" },
    dateModified: opts.dateModified,
    ...(opts.csvPath
      ? {
          distribution: [
            {
              "@type": "DataDownload",
              name: "CSV de disciplinas Araucano (Argentina)",
              encodingFormat: "text/csv",
              contentUrl: `${SITE_URL}${opts.csvPath.startsWith("/") ? opts.csvPath : `/${opts.csvPath}`}`,
            },
          ],
        }
      : {}),
  };
}

/**
 * Dataset JSON-LD para fuentes oficiales sin licencia abierta confirmada (INDEC, DIU, BCRA).
 * Omite la propiedad `license` y cita al organismo con su enlace oficial.
 */
export function datasetFuenteOficialJsonLd(opts: {
  subpath: string;
  idSuffix: string;
  name: string;
  description: string;
  organismoNombre: string;
  organismoUrl: string;
  temporalCoverage: string;
  dateModified: string;
  csvPath?: string;
}) {
  const url = canonicalArUrl(opts.subpath);
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#${opts.idSuffix}`,
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: "es-AR",
    creator: { "@type": "Organization", "@id": ORG_ID, name: "ProgramBI" },
    publisher: { "@type": "Organization", name: opts.organismoNombre, url: opts.organismoUrl },
    isBasedOn: opts.organismoUrl,
    temporalCoverage: opts.temporalCoverage,
    spatialCoverage: { "@type": "Country", name: "Argentina" },
    dateModified: opts.dateModified,
    ...(opts.csvPath
      ? {
          distribution: [
            {
              "@type": "DataDownload",
              name: `${opts.name} (CSV)`,
              encodingFormat: "text/csv",
              contentUrl: `${SITE_URL}${opts.csvPath.startsWith("/") ? opts.csvPath : `/${opts.csvPath}`}`,
            },
          ],
        }
      : {}),
  };
}
