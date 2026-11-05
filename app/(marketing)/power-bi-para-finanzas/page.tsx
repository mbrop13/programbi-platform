import type { Metadata } from "next";
import { LandingPage } from "@/components/landings";
import { getLanding, landingMetadata } from "@/lib/data/landings-nicho";

const landing = getLanding("power-bi-para-finanzas");

export const metadata: Metadata = landingMetadata(landing);

/** Landing de nicho: finanzas y control de gestión. Contenido en `lib/data/landings-nicho.ts`. */
export default function Page() {
  return <LandingPage landing={landing} />;
}
