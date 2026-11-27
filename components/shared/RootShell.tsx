import type { ReactNode } from "react";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import Providers from "@/app/providers";
import SiteAnalytics from "@/components/shared/SiteAnalytics";
import AttributionCapture from "@/components/shared/AttributionCapture";
import ReferralClaim from "@/components/shared/ReferralClaim";
import { ORG_ID, SITE_URL, WEBSITE_ID, jsonLdString } from "@/lib/seo";
import { fundadorEquipo } from "@/lib/data/equipo";
import { getPersonaJsonLd } from "@/lib/seo/course-jsonld";
import { scriptVentanaCampana } from "@/lib/campanas/black-friday";
import "@/app/globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
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

function buildJsonLd(lang: string) {
  const description =
    lang === "es-CL"
      ? "ProgramBI (Chile) dicta cursos en vivo de Power BI, SQL, Python e Inteligencia Artificial (Claude, ChatGPT y Gemini), y trabaja con empresas en capacitación e implementación de Business Intelligence."
      : lang === "es-ES"
        ? "ProgramBI imparte formación online en directo de Power BI, SQL Server, Python, análisis de datos e Inteligencia Artificial (Claude, ChatGPT y Gemini) para profesionales y empresas en España, con proyectos de Business Intelligence."
        : "ProgramBI dicta cursos en vivo de Power BI, SQL, Python e Inteligencia Artificial (Claude, ChatGPT y Gemini) para profesionales y empresas en Latinoamérica, junto con proyectos de implementación de Business Intelligence.";

  return {
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
        description,
        slogan: "Aprende análisis de datos con expertos.",
        foundingDate: "2021",
        knowsAbout: [
          "Power BI", "DAX", "SQL Server", "Python", "Pandas",
          "Business Intelligence", "Control de gestión",
          "Inteligencia Artificial", "Claude", "ChatGPT", "Gemini",
          "Excel a Power BI", "Minería", "Retail", "Finanzas",
        ],
        founder: getPersonaJsonLd(fundadorEquipo()),
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
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "ProgramBI",
        publisher: { "@id": ORG_ID },
        inLanguage: lang,
      },
    ],
  };
}

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
  const jsonLd = buildJsonLd(lang);

  return (
    <html lang={lang} suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${dancing.variable}`}>
      <head>
        {/* Antes de pintar: apaga la campaña de temporada si el visitante está fuera de su ventana. */}
        <script dangerouslySetInnerHTML={{ __html: scriptVentanaCampana() }} />
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
        <SiteAnalytics />
      </body>
    </html>
  );
}
