import type { Metadata } from "next";
import ComparativaAcademia from "@/components/comparativas/ComparativaAcademia";
import { metadataComparativa } from "@/components/comparativas/seo";
import { comparativaPlatzi } from "@/lib/data/comparativas";

export const revalidate = 3600;

const contenido = comparativaPlatzi();

export const metadata: Metadata = metadataComparativa(contenido);

export default function AlternativaPlatziPage() {
  return <ComparativaAcademia contenido={contenido} iso="cl" />;
}
