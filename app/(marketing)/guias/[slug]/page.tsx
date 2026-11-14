import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuiaPage from "@/components/guias/GuiaPage";
import TestimoniosDeCurso from "@/components/marketing/TestimoniosDeCurso";
import { guiaPorPath, guiasRaiz } from "@/lib/guias";
import { metadataDeGuia } from "@/lib/guias/metadata";

export const revalidate = false;
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
  return metadataDeGuia(guia, true);
}

export default async function GuiaRootPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guia = guiaDe(slug);
  if (!guia) notFound();
  const relacionadas = guiasRaiz().filter(
    (otra) => otra.path !== guia.path && otra.country === guia.country
  );
  return (
    <>
      <GuiaPage
        guia={guia}
        rutaIndice="/guias"
        nombreMercado={guia.country === "cl" ? "Chile" : "Latinoamérica"}
        relacionadas={relacionadas}
      />
      {/* El bloque se oculta solo si el curso de la guía no tiene citas reales. */}
      <TestimoniosDeCurso cursoSlug={guia.course} variante="compacta" />
    </>
  );
}
