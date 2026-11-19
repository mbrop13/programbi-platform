import type { Metadata } from "next";
import Link from "next/link";
import { PLANTILLAS } from "@/lib/data/plantillas";
import {
  SITE_URL,
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdString,
  pageOg,
} from "@/lib/seo";
import PlantillasHubClient from "./PlantillasHubClient";

export const revalidate = 86400;

const PATH = "/plantillas";
const TITULO = "Plantillas Power BI, DAX, SQL y Python Gratis | ProgramBI";
const DESCRIPCION =
  "Descarga gratis datasets reales de Chile y LATAM, packs de medidas DAX, 40 ejercicios resueltos de SQL Server y notebooks Python Pandas.";

const compartir = pageOg({
  title: TITULO,
  description: DESCRIPCION,
  path: PATH,
  kicker: "Biblioteca gratuita",
  tags: ["Power BI", "DAX", "SQL Server", "Python"],
  alt: "Plantillas y datasets gratuitos de análisis de datos — ProgramBI",
});

export const metadata: Metadata = {
  title: { absolute: TITULO },
  description: DESCRIPCION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: absoluteUrl(PATH),
    type: "website",
    siteName: "ProgramBI",
    locale: "es_CL",
    images: compartir.images,
  },
  twitter: compartir.twitter,
};

export default function PlantillasPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Biblioteca de Plantillas y Datasets de Datos | ProgramBI",
    description: DESCRIPCION,
    url: absoluteUrl(PATH),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: PLANTILLAS.length,
      itemListElement: PLANTILLAS.map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: absoluteUrl(`/plantillas/${p.slug}`),
        name: p.title,
        description: p.summary,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Inicio", path: "/" },
              { name: "Plantillas", path: PATH },
            ])
          ),
        }}
      />

      <div className="bg-canvas text-ink">
        <section className="border-b border-line">
          <div className="mx-auto max-w-[1400px] px-4 pt-6 pb-12 sm:px-6 lg:px-8 lg:pt-8">
            <nav
              aria-label="Ruta de navegación"
              className="flex flex-wrap items-center gap-2 text-xs font-semibold text-faint"
            >
              <Link
                href="/"
                className="text-mute no-underline transition-colors hover:text-ink"
              >
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink">Plantillas</span>
            </nav>

            <div className="mt-8 max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                Recursos descargables gratuitos · {PLANTILLAS.length} packs listos para usar
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                Plantillas de Power BI, DAX, SQL Server y Python con datos reales
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
                Datasets de Chile y Latinoamérica (ventas, finanzas, minería, inventario y RRHH),
                fórmulas DAX listas para producción, scripts SQL comentados y notebooks de Pandas
                para automatizar reportes.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <PlantillasHubClient plantillas={PLANTILLAS} />
        </section>

        <section className="border-t border-line bg-wash">
          <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                  Cómo aprovechar estas plantillas
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Pasa de copiar fórmulas a diseñar tus propios modelos de datos
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
                  Cada recurso incluye el archivo descargable original (`.csv`, `.dax`, `.sql` o
                  `.ipynb`), la explicación de sus columnas y los fragmentos de código clave
                  documentados. Si quieres dominar la lógica detrás de cada KPI con casos en vivo,
                  revisa nuestros programas prácticos.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  href="/cursos/power-bi"
                  className="rounded-lg border border-ink bg-ink px-4 py-2.5 text-sm font-semibold text-canvas no-underline transition-opacity hover:opacity-90"
                >
                  Curso de Power BI en vivo
                </Link>
                <Link
                  href="/cursos/sql-server"
                  className="rounded-lg border border-line-strong bg-paper px-4 py-2.5 text-sm font-semibold text-ink no-underline transition-colors hover:border-ink"
                >
                  Curso SQL Server
                </Link>
                <Link
                  href="/cursos/python"
                  className="rounded-lg border border-line-strong bg-paper px-4 py-2.5 text-sm font-semibold text-ink no-underline transition-colors hover:border-ink"
                >
                  Curso Python Datos
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
