import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuiaBreadcrumbs, GuiaScope } from "@/components/guias/GuiaEditorialPrimitives";
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
    <GuiaScope className="pb-20 pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <GuiaBreadcrumbs
          items={[
            { label: "Inicio", href: `/${pais}` },
            { label: "Guías", href: "/guias" },
            { label: nombre },
          ]}
        />

        <header className="mt-6 border-b border-[var(--g-border)] pb-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h1 className="max-w-[24ch] text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--g-ink)]">
              Guías de datos y Power BI en {nombre}
            </h1>
            <p className="text-sm font-medium tabular-nums text-[var(--g-subtle)]">
              {tarjetas.length} {tarjetas.length === 1 ? "guía" : "guías"}
            </p>
          </div>
          <p className="mt-3 max-w-[66ch] text-base leading-relaxed text-[var(--g-muted)]">
            Rutas de estudio, funciones con ejemplos, precios locales y cursos en vivo para {nombre}.
          </p>
        </header>

        <div className="mt-8">
          <GuiasHub
            guias={tarjetas}
            paises={[]}
            cursos={cursos}
            mostrarPais={false}
            iso={pais}
          />
        </div>

        <p className="mt-14 border-t border-[var(--g-border)] pt-8 text-sm">
          <Link
            href={indiceGuias("cl")}
            className="font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)]"
          >
            Ver todas las guías de ProgramBI
          </Link>
        </p>
      </div>
    </GuiaScope>
  );
}
