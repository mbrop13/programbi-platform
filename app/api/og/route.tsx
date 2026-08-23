import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { OgCard, OG_WIDTH, OG_HEIGHT } from "@/lib/og/card";

export const contentType = "image/png";

/**
 * Generador dinámico de imágenes OG con la marca ProgramBI.
 * Ej: /api/og?t=Power%20BI&k=Curso%20online&tags=Power%20BI,DAX&p=cursos/power-bi
 *
 * El verde (v=1) queda reservado para certificados/verificación.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = (searchParams.get("t") || "ProgramBI").slice(0, 120);
  const kicker = searchParams.get("k")?.slice(0, 40) || undefined;
  const description = searchParams.get("d")?.slice(0, 200) || undefined;
  const tags = (searchParams.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 4);
  const pathParam = searchParams.get("p") || undefined;
  const path = pathParam ? pathParam.replace(/[^a-zA-Z0-9\-\/]/g, "").slice(0, 60) : undefined;
  const theme = searchParams.get("theme") === "ink" ? ("ink" as const) : ("paper" as const);
  const accentParam = searchParams.get("accent");
  const accent = accentParam && /^#[0-9a-fA-F]{6}$/.test(accentParam) ? accentParam : undefined;
  const verified = searchParams.get("v") === "1";

  const logoSrc = await loadLogoDataUrl();

  const response = new ImageResponse(
    OgCard({
      logoSrc,
      kicker,
      title,
      description,
      tags,
      path,
      theme,
      accent,
      verified,
    }),
    { width: OG_WIDTH, height: OG_HEIGHT }
  );

  // Cache agresivo: la imagen depende solo de la query string.
  response.headers.set(
    "Cache-Control",
    "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800"
  );

  return response;
}
