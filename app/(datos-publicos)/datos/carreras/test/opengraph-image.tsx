import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { OG_HEADERS, renderOgCard } from "@/lib/datos/og-card";
import { getMetaCarreras } from "@/lib/datos/carreras";
import { entero } from "@/lib/datos/formato";

export const dynamic = "force-static";
export const alt = "Explorador de carreras en Chile | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();

  return new ImageResponse(
    renderOgCard({
      titulo: "¿Qué carrera conviene explorar según tus prioridades?",
      cifra: `${entero(meta.conteos.genericas_unicas)} carreras`,
      cifraLabel: "reales con datos oficiales para ordenar en 5 pasos",
      subtitulo:
        "Área, presupuesto, PAES, región y jornada · fórmula por defecto: 40 % ingreso, 40 % empleabilidad y 20 % duración real.",
      badge: `Explorador en 5 pasos · Edición ${meta.edicion}`,
      logoSrc,
      fuente: "Fuente: www.mifuturo.cl (Mineduc)",
      urlCorta: "programbi.com/datos/carreras/test",
    }),
    { width: 1200, height: 630, headers: OG_HEADERS }
  );
}
