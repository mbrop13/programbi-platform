import type { Metadata } from "next";
import { ORG_ID, SITE_URL } from "@/lib/seo";
import { hreflangDatosDe } from "@/lib/seo/datos-hreflang";
import { getMetaCarrerasMx } from "./carreras";
import { h1FichaMx, metaFichaMx, tituloFichaMx } from "./textos";
import type { CarreraMxRecord, FaqItemMx, MigajaMx } from "./types";

const BASE_MX_PATH = "/mx/datos/carreras-mejor-pagadas";
const FICHAS_MX_PATH = "/mx/datos/carreras";

export const MIGAS_BASE_MX: readonly MigajaMx[] = [
  { label: "Inicio", path: "/mx" },
  { label: "Datos de México", path: "/mx/datos" },
  { label: "Carreras mejor pagadas", path: BASE_MX_PATH },
];

export function canonicalMxUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

export function buildLanguagesMx(
  canonical: string,
  extraLanguages?: Record<string, string>
): Record<string, string> | undefined {
  if (!extraLanguages || Object.keys(extraLanguages).length === 0) {
    return undefined;
  }
  return {
    "es-MX": canonical,
    ...extraLanguages,
  };
}

export function metadataHubCarrerasMx(opts?: {
  path?: string;
  languages?: Record<string, string>;
}): Metadata {
  const meta = getMetaCarrerasMx();
  const path = opts?.path ?? BASE_MX_PATH;
  const canonical = canonicalMxUrl(path);
  const languages = opts?.languages ?? hreflangDatosDe(path);
  const title = `Carreras mejor pagadas en México ${meta.edicion} | ProgramBI`;
  const description = `Ranking de las ${meta.totalPublicables} carreras mejor pagadas en México ${meta.edicion}: ingreso mensual, campo laboral, desocupación e informalidad con datos IMCO y ENOE.`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "ProgramBI",
      locale: "es_MX",
      url: canonical,
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

export function metadataFichaCarreraMx(
  carrera: CarreraMxRecord,
  opts?: { languages?: Record<string, string> }
): Metadata {
  const path = `${FICHAS_MX_PATH}/${carrera.slug}`;
  const canonical = canonicalMxUrl(path);
  const languages = opts?.languages ?? hreflangDatosDe(path);
  const title = tituloFichaMx(carrera);
  const description = metaFichaMx(carrera);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      siteName: "ProgramBI",
      locale: "es_MX",
      url: canonical,
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

/**
 * JSON-LD Dataset para México.
 * Nota: IMCO Compara Carreras 2026 no tiene licencia abierta verificada, por lo
 * que NO se declara la propiedad `license` y se cita explícitamente la fuente.
 */
export function jsonLdDatasetMx(opts: {
  name: string;
  description: string;
  path: string;
  distributionCsvPath?: string;
}) {
  const meta = getMetaCarrerasMx();
  const url = canonicalMxUrl(opts.path);

  const dataset: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: "es-MX",
    spatialCoverage: {
      "@type": "Place",
      name: "México",
    },
    temporalCoverage: meta.edicion,
    publisher: { "@id": ORG_ID },
    isBasedOn: {
      "@type": "Dataset",
      name: meta.fuente,
      url: meta.fuenteUrl,
    },
    citation: meta.fuente,
  };

  if (opts.distributionCsvPath) {
    dataset.distribution = [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: canonicalMxUrl(opts.distributionCsvPath),
      },
    ];
  }

  return dataset;
}

export function jsonLdItemListMx(
  carreras: readonly CarreraMxRecord[],
  name = "Carreras mejor pagadas en México 2026"
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: carreras.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: carreras.map((c, idx) => ({
      "@type": "ListItem",
      position: c.posicionIngreso ?? idx + 1,
      name: c.carrera,
      url: canonicalMxUrl(`${FICHAS_MX_PATH}/${c.slug}`),
    })),
  };
}

export function jsonLdBreadcrumbListMx(items: readonly MigajaMx[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      item: canonicalMxUrl(item.path),
    })),
  };
}

export function jsonLdFaqPageMx(faqs: readonly FaqItemMx[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.respuesta,
      },
    })),
  };
}

export function jsonLdFichaCarreraMx(
  carrera: CarreraMxRecord,
  faqs: readonly FaqItemMx[]
) {
  const path = `${FICHAS_MX_PATH}/${carrera.slug}`;
  const breadcrumbs: MigajaMx[] = [
    ...MIGAS_BASE_MX,
    { label: carrera.carrera, path },
  ];

  return [
    jsonLdDatasetMx({
      name: h1FichaMx(carrera),
      description: metaFichaMx(carrera),
      path,
    }),
    jsonLdBreadcrumbListMx(breadcrumbs),
    jsonLdFaqPageMx(faqs),
  ];
}
