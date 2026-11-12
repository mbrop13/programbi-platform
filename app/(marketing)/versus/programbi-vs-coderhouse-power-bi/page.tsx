import type { Metadata } from "next";
import ComparativaAcademia from "@/components/comparativas/ComparativaAcademia";
import { metadataComparativa } from "@/components/comparativas/seo";
import {
  comparativaCoderhouse,
  hreflangCoderhouse,
  variantesCoderhouse,
} from "@/lib/data/comparativas";

export const revalidate = false;

const contenido = comparativaCoderhouse("cl");

export const metadata: Metadata = metadataComparativa(contenido, hreflangCoderhouse());

export default function ProgrambiVsCoderhousePage() {
  return (
    <ComparativaAcademia
      contenido={contenido}
      iso="cl"
      variantes={variantesCoderhouse()}
    />
  );
}
