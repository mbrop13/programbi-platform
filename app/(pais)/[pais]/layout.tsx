import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { esIndexable, esIsoPais, getPais, ISO_CHILE } from "@/config/paises";
import { localeOg, paramsCarpeta } from "@/lib/paises/rutas";
import { robotsLocal } from "@/lib/paises/metadata";
import { METADATA_BASE } from "@/lib/seo/metadata-base";
import RootShell from "@/components/shared/RootShell";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import MarketingChrome from "@/components/shared/MarketingChrome";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return paramsCarpeta();
}

/**
 * Root layout de las versiones por país.
 * Cada versión declara su propio <html lang> (es-AR, es-MX, es-PE, es-CO, es-UY).
 * Los países que no se indexan reciben noindex, follow aquí.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const indexable = esIndexable(pais);
  return {
    ...METADATA_BASE,
    // Cada página por país lleva su canonical propio (lo define la página).
    alternates: { canonical: null },
    ...(indexable ? {} : { robots: robotsLocal(pais) }),
    openGraph: {
      ...METADATA_BASE.openGraph,
      locale: localeOg(pais),
    },
  };
}

export default async function PaisLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) notFound();
  return (
    <RootShell lang={getPais(pais).idioma}>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-canvas"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" className="flex-1 bg-canvas">
        {children}
      </main>
      <Footer />
      <MarketingChrome />
    </RootShell>
  );
}
