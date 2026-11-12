import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComparativaAcademia from "@/components/comparativas/ComparativaAcademia";
import { metadataComparativa } from "@/components/comparativas/seo";
import { ISO_CHILE } from "@/config/paises";
import {
  comparativaCoderhouse,
  esPaisCoderhouse,
  hreflangCoderhouse,
  variantesCoderhouse,
} from "@/lib/data/comparativas";

export const revalidate = false;
export const dynamicParams = false;

type Params = { pais: string };

export function generateStaticParams(): Params[] {
  return [{ pais: "mx" }, { pais: "co" }, { pais: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esPaisCoderhouse(pais) || pais === ISO_CHILE) return {};
  return metadataComparativa(comparativaCoderhouse(pais), hreflangCoderhouse());
}

export default async function CoderhousePaisPage({ params }: { params: Promise<Params> }) {
  const { pais } = await params;
  if (!esPaisCoderhouse(pais) || pais === ISO_CHILE) notFound();
  return (
    <ComparativaAcademia
      contenido={comparativaCoderhouse(pais)}
      iso={pais}
      variantes={variantesCoderhouse()}
    />
  );
}
