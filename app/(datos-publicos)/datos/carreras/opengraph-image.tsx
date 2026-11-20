import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { OG_HEADERS, renderOgCard } from "@/lib/datos/og-card";
import { getMetaCarreras, getRankingCarreras } from "@/lib/datos/carreras";
import { entero, pesos } from "@/lib/datos/formato";

export const dynamic = "force-static";
export const alt = "Ranking de carreras en Chile: sueldos y empleabilidad | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();
  const topU = getRankingCarreras()
    .filter((r) => r.tipo === "u" && r.ing4 !== null)
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))
    .slice(0, 5);
  const top1 = topU[0];

  return new ImageResponse(
    renderOgCard({
      titulo: "Ranking de carreras en Chile: sueldos y empleabilidad",
      cifra: top1 ? pesos(top1.ing4) : undefined,
      cifraLabel: top1 ? "mayor sueldo 4.º año (U)" : undefined,
      subtitulo: `${top1 ? `${top1.nombre} lidera · ` : ""}${entero(meta.conteos.genericas_unicas)} carreras genéricas · ${entero(meta.conteos.filas_C)} programas analizados`,
      badge: `Edición ${meta.edicion}`,
      miniVisual:
        topU.length > 0
          ? {
              tipo: "barras",
              caption: `Ingreso bruto 4.º año · top universidades · pesos ${meta.pesos_de}`,
              barras: topU.map((r) => ({
                label: r.nombre,
                valor: r.ing4 ?? 0,
                valorTexto: pesos(r.ing4),
              })),
            }
          : undefined,
      logoSrc,
      fuente: "Fuente: www.mifuturo.cl (Mineduc)",
      urlCorta: "programbi.com/datos/carreras",
    }),
    { width: 1200, height: 630, headers: OG_HEADERS }
  );
}
