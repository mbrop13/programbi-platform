import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuiaPage from "@/components/guias/GuiaPage";
import { alternatesClaude, alternatesCurso, alternatesGuiaPais, guiaPorPath, guiasRaiz } from "@/lib/guias";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = false;

type Params = { slug: string };

/** Solo las guías que viven en la raíz: la chilena y las transversales. */
export function generateStaticParams(): Params[] {
  return guiasRaiz().map((guia) => ({ slug: guia.slug }));
}

function guiaDe(slug: string) {
  return guiaPorPath(`/guias/${slug}`);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const guia = guiaDe(slug);
  if (!guia) return {};
  const alternates = alternatesGuiaPais(guia) ?? alternatesClaude(guia) ?? alternatesCurso(guia);
  return {
    title: { absolute: guia.title },
    description: guia.description,
    alternates: {
      canonical: absoluteUrl(guia.path),
      ...(alternates ? { languages: alternates } : {}),
    },
    openGraph: {
      title: guia.title,
      description: guia.description,
      url: absoluteUrl(guia.path),
      type: "article",
      locale: "es_CL",
    },
  };
}

export default async function GuiaRootPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guia = guiaDe(slug);
  if (!guia) notFound();
  const relacionadas = guiasRaiz().filter(
    (otra) => otra.path !== guia.path && otra.country === guia.country
  );
  return (
    <GuiaPage
      guia={guia}
      rutaIndice="/guias"
      nombreMercado={guia.country === "cl" ? "Chile" : "Latinoamérica"}
      relacionadas={relacionadas}
    />
  );
}
