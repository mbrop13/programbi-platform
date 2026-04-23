import type { Metadata } from "next";
import { Inter, Poppins, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://programbi.com"),
  title: {
    default: "ProgramBI — Cursos de Análisis de Datos, Power BI, SQL y Python",
    template: "%s | ProgramBI",
  },
  description:
    "Capacitaciones profesionales en Power BI, Python, SQL, Excel y Big Data. Cursos online y presencial con expertos de la industria en Chile y Latinoamérica. +5000 estudiantes.",
  keywords: [
    "Power BI",
    "cursos Power BI",
    "Python",
    "curso Python datos",
    "SQL Server",
    "curso SQL",
    "análisis de datos",
    "data analytics",
    "cursos online Chile",
    "capacitación empresarial",
    "ProgramBI",
    "Excel avanzado",
    "Big Data",
    "machine learning",
    "dashboards",
    "automatización de datos",
    "Power Automate",
    "inteligencia artificial",
    "cursos presenciales Santiago",
    "capacitación Power BI Chile",
  ],
  authors: [{ name: "ProgramBI", url: "https://programbi.com" }],
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
    url: "https://programbi.com",
    siteName: "ProgramBI",
    title: "ProgramBI — Cursos de Análisis de Datos, Power BI, SQL y Python",
    description:
      "Capacitaciones profesionales en Power BI, Python, SQL, Excel y Big Data. +5000 estudiantes formados. Cursos online y presencial.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ProgramBI — Análisis de Datos con Expertos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProgramBI — Cursos de Análisis de Datos con Expertos",
    description:
      "Capacitaciones profesionales en Power BI, Python, SQL, Excel y Big Data. +5000 estudiantes.",
    images: ["/opengraph-image"],
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
      "@type": "Organization",
      "@id": "https://programbi.com/#organization",
      name: "ProgramBI",
      url: "https://programbi.com",
      logo: {
        "@type": "ImageObject",
        url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974",
        width: 600,
        height: 160,
      },
      description:
        "Capacitaciones profesionales en análisis de datos, Power BI, Python, SQL, Excel y Big Data para profesionales y empresas en Chile y Latinoamérica.",
      sameAs: [
        "https://www.instagram.com/programbi_capacitaciones/",
        "https://www.tiktok.com/@programbi",
        "https://cl.linkedin.com/company/programbi",
        "https://www.youtube.com/@ProgramBi",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["Spanish"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://programbi.com/#website",
      url: "https://programbi.com",
      name: "ProgramBI",
      publisher: { "@id": "https://programbi.com/#organization" },
      inLanguage: "es",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://programbi.com/cursos?q={search_term_string}",
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
    <html lang="es" className={`${inter.variable} ${poppins.variable} ${caveat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
