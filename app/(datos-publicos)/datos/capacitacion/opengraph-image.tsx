import { ImageResponse } from "next/og";
import data from "@/data/datos-fase3/sence.json";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { OG_HEADERS, renderOgCard } from "@/lib/datos/og-card";
import { entero } from "@/lib/datos/formato";

export const dynamic = "force-static";
export const alt = "Capacitación en Chile: participaciones SENCE por región | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const top5 = [...data.regions].sort((a, b) => b.total - a.total).slice(0, 5);
  const pctAprobadas = ((data.national.aprobados / data.national.total) * 100)
    .toFixed(1)
    .replace(".", ",");

  return new ImageResponse(
    renderOgCard({
      titulo: "Capacitación en Chile: franquicia tributaria",
      cifra: entero(data.national.total),
      cifraLabel: `participaciones registradas en ${data.year} · ${pctAprobadas} % aprobadas`,
      subtitulo: `${entero(data.national.aprobados)} aprobadas · una persona puede contar más de una vez (no son personas únicas)`,
      badge: `Año ${data.year}`,
      miniVisual:
        top5.length > 0
          ? {
              tipo: "barras",
              caption: `Participaciones por región · top 5 · ${data.year}`,
              barras: top5.map((r) => ({
                label: r.region,
                valor: r.total,
                valorTexto: entero(r.total),
              })),
            }
          : undefined,
      logoSrc,
      fuente: "Fuente: Anuario SENCE · cuadro A.1",
      urlCorta: "programbi.com/datos/capacitacion",
    }),
    { width: 1200, height: 630, headers: OG_HEADERS }
  );
}
