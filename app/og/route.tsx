import { ImageResponse } from "next/og";
import { loadLogoDataUrl, OG_SIZE } from "@/lib/og/assets";
import { OgCard } from "@/lib/og/card";

/**
 * El logo se lee del disco UNA sola vez por proceso y se reutiliza en todas las
 * peticiones (antes: readFile + base64 en cada request).
 */
let logoDataUrlPromise: Promise<string> | null = null;

function getLogoSrc(): Promise<string> {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = loadLogoDataUrl().catch((error: unknown) => {
      // No cachear una promesa rechazada: el siguiente request reintenta.
      logoDataUrlPromise = null;
      throw error;
    });
  }
  return logoDataUrlPromise;
}

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

  const logoSrc = await getLogoSrc();

  const response = new ImageResponse(
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

  // La imagen depende solo de la query string: cachear en navegador, CDN y borde.
  response.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800"
  );

  return response;
}
