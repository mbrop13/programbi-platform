import type { Metadata } from "next";
import { LandingPage } from "@/components/landings";
import { getLanding, landingMetadata } from "@/lib/data/landings-nicho";

const landing = getLanding("analisis-de-datos-mineria");

export const metadata: Metadata = landingMetadata(landing);

/** Landing de nicho: análisis de datos para minería. */
export default function Page() {
  return <LandingPage landing={landing} />;
}
