import type { Metadata } from "next";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { PAGE_SEO } from "@/lib/seo/money";

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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here when you have it
    // google: "your-verification-code",
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
