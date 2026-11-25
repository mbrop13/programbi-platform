import type { Metadata } from "next";
import { ORG_ID, SITE_URL } from "@/lib/seo";
import { hreflangDatosDe } from "@/lib/seo/datos-hreflang";
import { hreflangDe } from "@/lib/paises/rutas";
import type { PreguntaFaqCo } from "./textos";

export interface MigajaCo {
  label: string;
  path: string;
}

export const MIGAS_BASE_CO: readonly MigajaCo[] = [
  { label: "Inicio", path: "/co" },
  { label: "Datos de Colombia", path: "/co/datos" },
];

export const MIGAS_CARRERAS_CO: readonly MigajaCo[] = [
  ...MIGAS_BASE_CO,
  { label: "Carreras", path: "/co/datos/carreras" },
];

/** Canonical autorreferente absoluto: `https://www.programbi.com/co/datos...` */
export function canonicalCo(path: string): string {
  const limpio = (path.split("#")[0] ?? "/co/datos").split("?")[0] ?? "/co/datos";
  const conSlash = limpio.startsWith("/") ? limpio : `/${limpio}`;
  return `${SITE_URL}${conSlash}`;
}

/**
 * Construye `alternates.languages` cuando la ruta tiene equivalente multi-país,
 * o deja undefined si es exclusiva de Colombia.
 */
export function languagesHookCo(rutaEquivalente?: string): Record<string, string> | undefined {
  if (!rutaEquivalente) return undefined;
  return hreflangDe(rutaEquivalente);
}

export interface MetadataDatosCoOpts {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  rutaHreflang?: string;
  ogImage?: string;
}

export function metadataDatosCo(opts: MetadataDatosCoOpts): Metadata {
  const url = canonicalCo(opts.path);
  const languages = hreflangDatosDe(opts.path) ?? languagesHookCo(opts.rutaHreflang);
  const ogImg = opts.ogImage ?? `${SITE_URL}/opengraph-image`;

  return {
    title: { absolute: opts.title },
    description: opts.description,
    ...(opts.keywords?.length ? { keywords: opts.keywords } : {}),
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "ProgramBI",
      locale: "es_CO",
      url,
      title: opts.title,
      description: opts.description,
      images: [{ url: ogImg, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [ogImg],
    },
  };
}

export function breadcrumbJsonLdCo(migas: readonly MigajaCo[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.map(({ label, path }, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: label,
      item: canonicalCo(path),
    })),
  };
}

export interface DatasetJsonLdCoOpts {
  id: string;
  name: string;
  description: string;
  path: string;
  isBasedOn: { name: string; url: string };
  variableMeasured: string[];
  temporalCoverage?: string;
  dateModified?: string;
  /**
   * SOLO pasar cuando la fuente tenga licencia verificada (ej. TRM `32sa-8pi3`: CC BY-SA 4.0).
   * OLE, SNIES, DANE GEIH y DANE IPC tienen licencia no verificada: omitir `license`.
   */
  licenseUrl?: string;
  distributions?: Array<{
    name: string;
    encodingFormat: string;
    path: string;
  }>;
}

export function datasetJsonLdCo(opts: DatasetJsonLdCoOpts) {
  const url = canonicalCo(opts.path);
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#${opts.id}`,
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: "es-CO",
    creator: { "@type": "Organization", "@id": ORG_ID, name: "ProgramBI" },
    isBasedOn: {
      "@type": "Dataset",
      name: opts.isBasedOn.name,
      url: opts.isBasedOn.url,
    },
    ...(opts.licenseUrl ? { license: opts.licenseUrl } : {}),
    ...(opts.temporalCoverage ? { temporalCoverage: opts.temporalCoverage } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    spatialCoverage: { "@type": "Country", name: "Colombia" },
    variableMeasured: opts.variableMeasured,
    ...(opts.distributions?.length
      ? {
          distribution: opts.distributions.map((d) => ({
            "@type": "DataDownload",
            name: d.name,
            encodingFormat: d.encodingFormat,
            contentUrl: canonicalCo(d.path),
          })),
        }
      : {}),
  };
}

export function itemListJsonLdCo(
  name: string,
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      url: canonicalCo(item.path),
    })),
  };
}

export function faqJsonLdCo(preguntas: readonly PreguntaFaqCo[]) {
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

export function webApplicationJsonLdCo(opts: {
  name: string;
  description: string;
  path: string;
  applicationCategory?: string;
}) {
  const url = canonicalCo(opts.path);
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: "es-CO",
    applicationCategory: opts.applicationCategory ?? "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "COP",
    },
    provider: { "@type": "Organization", "@id": ORG_ID, name: "ProgramBI" },
  };
}
