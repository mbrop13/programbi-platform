import type { Metadata } from "next";
import ComparativaAcademia from "@/components/comparativas/ComparativaAcademia";
import { metadataComparativa } from "@/components/comparativas/seo";
import { comparativaDesafioLatam } from "@/lib/data/comparativas";

export const revalidate = 3600;

const contenido = comparativaDesafioLatam();

export const metadata: Metadata = metadataComparativa(contenido);

export default function DesafioLatamVsProgrambiPage() {
  return <ComparativaAcademia contenido={contenido} iso="cl" />;
}
