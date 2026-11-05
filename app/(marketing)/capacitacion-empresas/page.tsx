import type { Metadata } from "next";
import { LandingPage } from "@/components/landings";
import { getLanding, landingMetadata } from "@/lib/data/landings-nicho";

const landing = getLanding("capacitacion-empresas");

export const metadata: Metadata = landingMetadata(landing);

/**
 * Landing de nicho: capacitación in-company. El formulario es el mismo
 * `EmpresasContactForm` de /empresas (cliente); la página se renderiza en el
 * servidor.
 */
export default function Page() {
  return <LandingPage landing={landing} />;
}
