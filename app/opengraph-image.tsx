import { ImageResponse } from "next/og";
import { loadLogoDataUrl, OG_SIZE } from "@/lib/og/assets";
import { OgCard } from "@/lib/og/card";

export const alt =
  "ProgramBI — Cursos de Análisis de Datos, Power BI, SQL y Python";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();

  return new ImageResponse(
    OgCard({
      logoSrc,
      kicker: "+5.000 estudiantes formados",
      title: "Cursos de análisis de datos con expertos de la industria",
      description:
        "Formación práctica, online en vivo, con proyectos reales. Desde Chile para Latinoamérica.",
      tags: ["Power BI", "SQL Server", "Python", "Excel"],
      theme: "paper",
    }),
    { ...size }
  );
}
