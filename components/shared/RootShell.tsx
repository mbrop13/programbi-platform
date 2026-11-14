import type { ReactNode } from "react";
import { Suspense } from "react";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
      ? "ProgramBI (Chile) dicta cursos en vivo de Power BI, SQL y Python, y trabaja con empresas en capacitación e implementación de Business Intelligence."
      : "ProgramBI dicta cursos en vivo de Power BI, SQL y Python para profesionales y empresas en Latinoamérica, junto con proyectos de implementación de Business Intelligence.";

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
          "Excel a Power BI", "Minería", "Retail", "Finanzas",
        ],
        founder: {
          "@type": "Person",
          // @id estable del fundador: debe coincidir con idPersona("manuel-oliva")
          // de lib/seo/course-jsonld.ts y con el nodo Person de /profesores.
          "@id": `${SITE_URL}/#person-manuel-oliva`,
          name: "Manuel Oliva",
          jobTitle: "Fundador y Director",
          url: `${SITE_URL}/profesores/manuel-oliva`,
          description:
            "Contador Auditor (UdeC) y Magíster en Data Science (UAI). Experiencia como Gerente de Riesgos Financieros en Renta 4 Corredores de Bolsa y Analista de Riesgos en Banco Itaú Chile, y profesor universitario de postgrado en el MBA de la UGM (Data Analytics para la toma de decisiones).",
          alumniOf: [
            { "@type": "EducationalOrganization", name: "Universidad Adolfo Ibáñez" },
            { "@type": "EducationalOrganization", name: "Universidad de Concepción" },
          ],
          knowsAbout: [
            "Data Science",
            "Data Analytics para la toma de decisiones",
            "Riesgo Financiero",
            "Econometría",
            "Power BI",
            "Python",
            "SQL Server",
          ],
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
        <SpeedInsights />
      </body>
    </html>
  );
}
