import { ImageResponse } from "next/og";
import { loadLogoDataUrl, OG_SIZE } from "@/lib/og/assets";
import { OgCard } from "@/lib/og/card";

export const alt =
  "Pack Adopción BI y cursos Power BI Chile | ProgramBI";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();

  return new ImageResponse(
    OgCard({
      logoSrc,
      kicker: "Chile · Pack Adopción BI",
      title: "De reportes eternos a decisiones en minutos",
      description:
        "Tablero en producción + equipo autónomo. Cursos Power BI, SQL y Python en vivo.",
      tags: ["Pack Adopción", "Power BI", "Chile"],
      theme: "paper",
    }),
    { ...size }
  );
}
