import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { OG_HEADERS, renderOgCard } from "@/lib/datos/og-card";
import { getMetaCarreras, getRankingCarreras } from "@/lib/datos/carreras";
import { pesos, porcentaje } from "@/lib/datos/formato";

export const dynamic = "force-static";
export const alt = "Comparador de carreras en Chile | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();
  const ranking = getRankingCarreras();
  const com = ranking.find((r) => r.slug === "ingenieria-comercial" && r.tipo === "u");
  const ind = ranking.find((r) => r.slug === "ingenieria-civil-industrial" && r.tipo === "u");

  return new ImageResponse(
    renderOgCard({
      titulo: "Comparador de carreras en Chile",
      cifra: com ? pesos(com.ing4) : undefined,
      cifraLabel: com ? `sueldo 4.º año · ${com.nombre} (U)` : undefined,
      subtitulo:
        com && ind
          ? `vs ${ind.nombre} (U): ${pesos(ind.ing4)} · Empleo 1.er año: ${porcentaje(com.emp1)} vs ${porcentaje(ind.emp1)}`
          : "Sueldos del 1.º al 5.º año, empleabilidad, duración real y aranceles lado a lado.",
      badge: `Comparador oficial · Edición ${meta.edicion}`,
      miniVisual:
        com && ind
          ? {
              tipo: "barras",
              caption: `Ingreso bruto 4.º año · pesos ${meta.pesos_de}`,
              barras: [
                { label: `${com.nombre} (U)`, valor: com.ing4 ?? 0, valorTexto: pesos(com.ing4) },
                { label: `${ind.nombre} (U)`, valor: ind.ing4 ?? 0, valorTexto: pesos(ind.ing4) },
              ],
            }
          : undefined,
      logoSrc,
      fuente: "Fuente: www.mifuturo.cl (Mineduc)",
      urlCorta: "programbi.com/datos/carreras/comparar",
    }),
    { width: 1200, height: 630, headers: OG_HEADERS }
  );
}
