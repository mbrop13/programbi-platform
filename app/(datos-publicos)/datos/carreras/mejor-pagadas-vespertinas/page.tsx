import type { Metadata } from "next";
import { metadataPreset } from "@/lib/datos/seo-carreras";
import { VistaPreset } from "@/components/datos/VistaPreset";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return metadataPreset("mejor-pagadas-vespertinas");
}

export default function MejorPagadasVespertinasPage() {
  return <VistaPreset slug="mejor-pagadas-vespertinas" />;
}
