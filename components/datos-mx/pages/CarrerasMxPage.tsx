import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import CtaDatosMx from "@/components/datos-mx/CtaDatosMx";
import TablaCarrerasMx from "@/components/datos-mx/TablaCarrerasMx";
import {
  getCarrerasPublicablesMx,
  getMetaCarrerasMx,
} from "@/lib/datos-mx/carreras";
import { pesosMx } from "@/lib/datos-mx/formato";
import {
  canonicalMxUrl,
  jsonLdBreadcrumbListMx,
  jsonLdDatasetMx,
  jsonLdItemListMx,
} from "@/lib/datos-mx/seo";
import { hreflangDatosDe } from "@/lib/seo/datos-hreflang";
import { jsonLdString } from "@/lib/seo";



const TITLE = "Carreras en México: sueldo y campo laboral (IMCO 2026)";
const DESCRIPTION =
  "Índice de las 75 carreras en México con datos verificados de ingreso mensual promedio, rango P25–P75, desocupación, informalidad y matrícula según IMCO 2026 e INEGI.";

export async function metadataMxCarreras({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "mx") return {};

  const canonical = canonicalMxUrl("/mx/datos/carreras");
  const languages = hreflangDatosDe("/mx/datos/carreras");

  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "ProgramBI",
      locale: "es_MX",
      url: canonical,
      title: TITLE,
      description: DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export async function PageMxCarreras({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "mx") notFound();

  const meta = getMetaCarrerasMx();
  const publicables = getCarrerasPublicablesMx();

  const breadcrumbs = [
    { label: "Inicio", path: "/mx" },
    { label: "Datos de México", path: "/mx/datos" },
    { label: "Carreras", path: "/mx/datos/carreras" },
  ];

  const jsonLd = [
    jsonLdDatasetMx({
      name: TITLE,
      description: DESCRIPTION,
      path: "/mx/datos/carreras",
    }),
    jsonLdItemListMx(
      publicables,
      "Sueldo y campo laboral de 75 carreras en México"
    ),
    jsonLdBreadcrumbListMx(breadcrumbs),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <nav aria-label="Ruta de navegación" className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/mx" className="hover:text-foreground">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/mx/datos" className="hover:text-foreground">
              Datos de México
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-foreground">Carreras</li>
        </ol>
      </nav>

      <header className="max-w-3xl space-y-4">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          {meta.fuente}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Sueldo y campo laboral de {meta.totalPublicables} carreras en México
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Consulta la ficha completa de cada carrera con ingreso mensual
          promedio (mediana nacional de{" "}
          <strong className="font-semibold text-foreground">
            {pesosMx(meta.medianaIngresoPublicables)}
          </strong>
          ), desocupación, informalidad y matrícula universitaria.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/mx/datos/carreras-mejor-pagadas"
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90 sm:text-sm"
          >
            Ver análisis de carreras mejor pagadas
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/mx/datos"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover sm:text-sm"
          >
            Volver a Datos de México
          </Link>
        </div>
      </header>

      <section aria-labelledby="tabla-indice-carreras">
        <h2 id="tabla-indice-carreras" className="sr-only">
          Listado completo de las {meta.totalPublicables} carreras en México
        </h2>
        <TablaCarrerasMx
          carreras={publicables}
          caption={`Listado de las ${meta.totalPublicables} carreras con ingreso publicado en IMCO Compara Carreras 2026. Haz clic en cualquier carrera para abrir su ficha detallada.`}
        />
      </section>

      <CtaDatosMx page="/mx/datos/carreras" ctaPosition="datos_mx_carreras_index_cta" />
    </div>
  );
}
