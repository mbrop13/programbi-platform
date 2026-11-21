import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuiaScope } from "@/components/guias/GuiaEditorialPrimitives";
import GuiasHub from "@/components/guias/GuiasHub";
import {
  esIndexable,
  esIsoPais,
  getPais,
  ISO_CHILE,
  PAISES_CARPETA,
} from "@/config/paises";
import { guiasDePais, indiceGuias } from "@/lib/guias";
import { opcionesCurso } from "@/lib/guias/opciones";
import { tarjetasDeGuias } from "@/lib/guias/tarjetas";
import { robotsLocal } from "@/lib/paises/metadata";
import { hreflangDe, localeOg } from "@/lib/paises/rutas";
import { absoluteUrl, jsonLdString, pageOg } from "@/lib/seo";

export const revalidate = false;
export const dynamicParams = false;

type Params = { pais: string };

/** Solo se generan los países que tienen al menos una guía publicada. */
export function generateStaticParams(): Params[] {
  return PAISES_CARPETA.filter((pais) => guiasDePais(pais.iso).length > 0).map((pais) => ({
    pais: pais.iso,
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const nombre = getPais(pais).nombre;
  const path = `/${pais}/guias`;
  const titleLargo = `Guías de datos y Power BI en ${nombre} | ProgramBI`;
  // «República Dominicana» empuja el título sobre 60 caracteres: en ese caso
  // se conserva la palabra clave corta y se suelta «Power BI».
  const title =
    titleLargo.length <= 60 ? titleLargo : `Guías de datos en ${nombre} | ProgramBI`;
  const description = `Guías prácticas de Claude, Power BI, SQL, Python y Excel en ${nombre}: rutas de estudio, sueldos del mercado y cursos en vivo.`;
  const indexable = esIndexable(pais);
  const share = pageOg({
    title: `Guías prácticas de datos e IA en ${nombre}`,
    description,
    path,
    kicker: `Biblioteca ProgramBI · ${nombre}`,
    tags: ["Claude AI", "Power BI", "SQL y Python"],
    alt: title,
  });
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: absoluteUrl(path),
      ...(indexable ? { languages: hreflangDe("/guias") } : {}),
    },
    ...(indexable ? {} : { robots: robotsLocal(pais) }),
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      locale: localeOg(pais),
      type: "website",
      siteName: "ProgramBI",
      images: share.images,
    },
    twitter: share.twitter,
  };
}

export default async function GuiasPaisPage({ params }: { params: Promise<Params> }) {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) notFound();
  const guias = guiasDePais(pais);
  if (guias.length === 0) notFound();
  const nombre = getPais(pais).nombre;
  const cursos = opcionesCurso(guias);
  const tarjetas = tarjetasDeGuias(guias);
  const canonical = absoluteUrl(`/${pais}/guias`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#collection`,
        name: `Guías de datos y Power BI en ${nombre}`,
        description: `Guías prácticas para ${nombre}: ruta de estudio, sueldos del mercado, precios locales y el curso en vivo de ProgramBI.`,
        inLanguage: getPais(pais).idioma,
        url: canonical,
      },
      {
        "@type": "ItemList",
        "@id": `${canonical}#list`,
        numberOfItems: tarjetas.length,
        itemListElement: tarjetas.map((guia, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: guia.h1,
          url: absoluteUrl(guia.path),
        })),
      },
    ],
  };

  return (
    <GuiaScope className="pb-20 pt-8 sm:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <GuiasHub
          guias={tarjetas}
          paises={[]}
          cursos={cursos}
          mostrarPais={false}
          iso={pais}
          titulo={`Guías de datos y Power BI en ${nombre}`}
          subtitulo={`${tarjetas.length} ${tarjetas.length === 1 ? "guía" : "guías"} de estudio y referencia para ${nombre}: rutas de aprendizaje, ejemplos aplicados, precios locales y cursos en vivo.`}
          breadcrumbs={[
            { label: "Inicio", href: `/${pais}` },
            { label: "Guías", href: "/guias" },
            { label: nombre },
          ]}
        />

        <p className="mt-14 border-t border-[var(--g-border)] pt-8 text-sm">
          <Link
            href={indiceGuias("cl")}
            className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)] sm:min-h-0"
          >
            Ver todas las guías de ProgramBI
          </Link>
        </p>
      </div>
    </GuiaScope>
  );
}
