import type { ReactNode } from "react";
import { Suspense } from "react";
import { Geist, Dancing_Script } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Providers from "@/app/providers";
import MarketingAnalytics from "@/components/shared/MarketingAnalytics";
import AttributionCapture from "@/components/shared/AttributionCapture";
import ReferralClaim from "@/components/shared/ReferralClaim";
import { ORG_ID, SITE_URL, WEBSITE_ID, jsonLdString } from "@/lib/seo";
import "@/app/globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
  weight: ["700"],
  preload: false,
});

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
    },
  ],
};

/**
 * Cáscara HTML compartida por los root layouts.
 * Cada grupo de rutas tiene su propio root layout (Chile, versiones por país,
 * auth, admin y comunidad) para poder poner su propio <html lang>.
 */
export default function RootShell({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}) {
  return (
    <html lang={lang} suppressHydrationWarning className={`${geist.variable} ${dancing.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh bg-canvas text-ink font-sans antialiased">
        <Providers>
          <AttributionCapture />
          <ReferralClaim />
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
