import { ImageResponse } from "next/og";
import { loadLogoDataUrl, OG_SIZE } from "@/lib/og/assets";
import { OgCard } from "@/lib/og/card";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "ProgramBI";
  const kicker = searchParams.get("kicker") || undefined;
  const description = searchParams.get("description") || undefined;
  const tags = (searchParams.get("tags") || "")
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);
  const theme = searchParams.get("theme") === "ink" ? ("ink" as const) : ("paper" as const);
  const path = searchParams.get("path") || undefined;
  const accent = searchParams.get("accent") || undefined;
  const verified = searchParams.get("v") === "1";

  const logoSrc = await loadLogoDataUrl();

  return new ImageResponse(
    OgCard({
      logoSrc,
      kicker,
      title,
      description,
      tags,
      theme,
      path,
      accent,
      verified,
    }),
    { ...OG_SIZE }
  );
}
