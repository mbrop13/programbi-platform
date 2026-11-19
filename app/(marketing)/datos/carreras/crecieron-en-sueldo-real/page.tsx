import type { Metadata } from "next";
import { metadataPreset } from "@/lib/datos/seo-carreras";
import { VistaPreset } from "@/components/datos/VistaPreset";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return metadataPreset("crecieron-en-sueldo-real");
}

export default function CrecieronEnSueldoRealPage() {
  return <VistaPreset slug="crecieron-en-sueldo-real" />;
}
