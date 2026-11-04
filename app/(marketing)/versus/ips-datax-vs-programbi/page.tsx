import type { Metadata } from "next";
import ComparativaAcademia from "@/components/comparativas/ComparativaAcademia";
import { metadataComparativa } from "@/components/comparativas/seo";
import { comparativaIpsDatax } from "@/lib/data/comparativas";

export const revalidate = 3600;

const contenido = comparativaIpsDatax();

export const metadata: Metadata = metadataComparativa(contenido);

export default function IpsDataxVsProgrambiPage() {
  return <ComparativaAcademia contenido={contenido} iso="cl" />;
}
