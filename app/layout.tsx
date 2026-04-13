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
  title: {
    default: "ProgramBI — Análisis de Datos con Expertos",
    template: "%s | ProgramBI",
  },
  description:
    "Capacitaciones en Power BI, Python, SQL, Excel y Big Data diseñadas para potenciar tu carrera profesional. Cursos online y presencial con expertos de la industria.",
  keywords: [
    "Power BI",
    "Python",
    "SQL",
    "análisis de datos",
    "data analytics",
    "cursos online",
    "Chile",
    "capacitación",
    "ProgramBI",
  ],
  authors: [{ name: "ProgramBI" }],
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "ProgramBI",
    title: "ProgramBI — Análisis de Datos con Expertos",
    description:
      "Capacitaciones en Power BI, Python, SQL, Excel y Big Data diseñadas para potenciar tu carrera profesional.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable} ${caveat.variable}`}>
      <body className="min-h-screen bg-white text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
