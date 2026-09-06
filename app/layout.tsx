import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, JetBrains_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/react";
import MarketingAnalytics from "@/components/shared/MarketingAnalytics";
import { SITE_URL, ORG_ID, WEBSITE_ID, jsonLdString } from "@/lib/seo";
import { PAGE_SEO } from "@/lib/seo/money";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
  weight: ["700"],
  preload: false,
});

export const metadata: Metadata = {
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: "ProgramBI",
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
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

// JSON-LD Structured Data: Organization + WebSite
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "EducationalOrganization"],
      "@id": ORG_ID,
      name: "ProgramBI",
      legalName: "ProgramBI SPA",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
        width: 600,
        height: 160,
      },
      description:
        "ProgramBI (Chile) dicta cursos en vivo de Power BI, SQL y Python, y trabaja con empresas en capacitación e implementación de Business Intelligence.",
      slogan: "Aprende análisis de datos con expertos.",
      foundingDate: "2021",
      areaServed: [
        { "@type": "Country", name: "Chile" },
        { "@type": "Country", name: "Colombia" },
        { "@type": "Country", name: "México" },
        { "@type": "Country", name: "Perú" },
        { "@type": "Country", name: "Argentina" },
      ],
      knowsAbout: [
        "Power BI", "DAX", "SQL Server", "Python", "Pandas",
        "Business Intelligence", "Control de gestión",
        "Excel a Power BI", "Minería", "Retail", "Finanzas",
      ],
      founder: {
        "@type": "Person",
        name: "Manuel Oliva",
        jobTitle: "CEO & Fundador",
        alumniOf: [
          { "@type": "EducationalOrganization", name: "Universidad Adolfo Ibáñez" },
          { "@type": "EducationalOrganization", name: "Universidad de Concepción" },
        ],
        knowsAbout: ["Data Science", "Riesgo Financiero", "Econometría", "Power BI", "Python"],
      },
      sameAs: [
        "https://www.instagram.com/programbi_capacitaciones/",
        "https://www.tiktok.com/@programbi",
        "https://cl.linkedin.com/company/programbi",
        "https://www.youtube.com/@ProgramBi",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: "+56-9-3540-9699",
          availableLanguage: ["Spanish"],
          areaServed: "CL",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: "ProgramBI",
      publisher: { "@id": ORG_ID },
      inLanguage: "es-CL",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/cursos?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geist.variable} ${jetbrainsMono.variable} ${dancing.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh bg-canvas text-ink font-sans antialiased">
        <Providers>
          {children}
        </Providers>
        <Suspense fallback={null}>
          <MarketingAnalytics />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
