import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuiaPage from "@/components/guias/GuiaPage";
import { esIsoPais, esIndexable, getPais, ISO_CHILE } from "@/config/paises";
import {
  alternatesClaude,
  alternatesCurso,
  alternatesGuiaPais,
  guiaDePais,
  guiasDePais,
  indiceGuias,
} from "@/lib/guias";
import { robotsLocal } from "@/lib/paises/metadata";
import { localeOg } from "@/lib/paises/rutas";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = false;

type Params = { pais: string; slug: string };

/**
 * Guías por país. Devuelve también `pais` porque este page genera los dos
 * segmentos: solo existen los pares país × guía que tienen contenido.
 */
export function generateStaticParams(): Params[] {
  const paises = ["ar", "mx", "pe", "co", "uy", "py"];
  return paises.flatMap((pais) =>
    guiasDePais(pais).map((guia) => ({ pais, slug: guia.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { pais, slug } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const guia = guiaDePais(pais, slug);
  if (!guia) return {};
  const alternates = alternatesGuiaPais(guia) ?? alternatesClaude(guia) ?? alternatesCurso(guia);
  const indexable = esIndexable(pais);
  return {
    title: { absolute: guia.title },
    description: guia.description,
    alternates: {
      canonical: absoluteUrl(guia.path),
      ...(indexable && alternates ? { languages: alternates } : {}),
    },
    ...(indexable ? {} : { robots: robotsLocal(pais) }),
    openGraph: {
      title: guia.title,
      description: guia.description,
      url: absoluteUrl(guia.path),
      locale: localeOg(pais),
      type: "article",
    },
  };
}

export default async function GuiaPaisPage({ params }: { params: Promise<Params> }) {
  const { pais, slug } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) notFound();
  const guia = guiaDePais(pais, slug);
  if (!guia) notFound();
  const relacionadas = guiasDePais(pais).filter((otra) => otra.path !== guia.path);
  return (
    <GuiaPage
      guia={guia}
      rutaIndice={indiceGuias(pais)}
      nombreMercado={getPais(pais).nombre}
      relacionadas={relacionadas}
    />
  );
}
