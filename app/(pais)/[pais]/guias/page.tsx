import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  const titleLargo = `Guías de datos y Power BI en ${nombre} — ProgramBI`;
  // «República Dominicana» empuja el título sobre 60 caracteres: en ese caso
  // se conserva la palabra clave corta y se suelta «Power BI».
  const title =
    titleLargo.length <= 60 ? titleLargo : `Guías de datos en ${nombre} — ProgramBI`;
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
    <div className="bg-canvas px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <div className="mx-auto max-w-[1120px]">
        <nav aria-label="Migas de pan" className="text-xs text-mute">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href={`/${pais}`} className="no-underline hover:text-ink">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink">Guías</li>
          </ol>
        </nav>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Guías de datos y Power BI en {nombre}
        </h1>
        <p className="mt-4 max-w-[62ch] leading-relaxed text-mute">
          {guias.length} guías de estudio y referencia para trabajar con datos en {nombre}: ruta de
          aprendizaje, funciones con ejemplos, fuentes citadas, precios locales y el curso en vivo que
          las cubre.
        </p>

        <div className="mt-8">
          <GuiasHub
            guias={tarjetasDeGuias(guias)}
            paises={[]}
            cursos={cursos}
            mostrarPais={false}
            iso={pais}
          />
        </div>

        <p className="mt-12 border-t border-line pt-8 text-sm">
          <Link href={indiceGuias("cl")} className="font-medium text-ink underline underline-offset-4">
            Ver todas las guías de ProgramBI
          </Link>
        </p>
      </div>
    </div>
  );
}
