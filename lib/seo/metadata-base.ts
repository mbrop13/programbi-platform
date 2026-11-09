import type { Metadata } from "next";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { PAGE_SEO } from "@/lib/seo/money";

/**
 * Verificación de buscadores. Next no tiene un campo `verification.bing`:
 * Bing Webmaster Tools pide la meta `msvalidate.01`, que va por `other`.
 * Los códigos viven en NEXT_PUBLIC_* para poder fijarlos en Vercel sin tocar
 * código; si no están definidos no se emite ninguna etiqueta.
 */
const BING_VERIFICATION = process.env.NEXT_PUBLIC_BING_VERIFICATION?.trim();
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION?.trim();

/**
 * Metadatos comunes de todos los root layouts.
 * Cada grupo de rutas (marketing, versiones por país, auth, admin, comunidad)
 * parte de esta base y ajusta lo que necesite.
 */
export const METADATA_BASE: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: PAGE_SEO.home.title,
    template: "%s | ProgramBI",
  },
  description: PAGE_SEO.home.description,
  keywords: [
    "curso Power BI Chile",
    "cursos de power bi chile",
    "cursos analisis de datos",
    "Power BI empresas Chile",
    "capacitación Power BI Chile",
    "SQL Server",
    "Python datos",
    "Business Intelligence Chile",
    "ProgramBI",
  ],
  authors: [{ name: "ProgramBI", url: SITE_URL }],
  creator: "ProgramBI",
  publisher: "ProgramBI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: "ProgramBI",
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    images: [DEFAULT_OG_IMAGE.url],
  },
  // Sin `robots` a propósito: `index, follow` es el comportamiento por defecto
  // de Next y, si se declara explícito, se emite una <meta name="robots"> que
  // choca con la `noindex` que Next inyecta solo en las respuestas 404
  // (dos metas en la misma página). Las páginas que sí deben quedar fuera del
  // índice declaran su propio noindex (ROBOTS_NOINDEX_FOLLOW o robotsLocal).
  verification: {
    // Search Console y Bing Webmaster Tools. Vacío = no se emite la meta.
    ...(GOOGLE_VERIFICATION ? { google: GOOGLE_VERIFICATION } : {}),
    ...(BING_VERIFICATION ? { other: { "msvalidate.01": BING_VERIFICATION } } : {}),
  },
};

/** Páginas que no se indexan pero sí se siguen: login, registro, comunidad. */
export const ROBOTS_NOINDEX_FOLLOW: Metadata["robots"] = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
  },
};
