import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SocialDatos } from "@/components/datos/SocialDatos";
import { datosTerritorio, regionesPublicables } from "@/lib/datos/desempleo";
import { NACIONAL, nombreTerritorio } from "@/lib/datos/regiones";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ["hub", NACIONAL, ...regionesPublicables().map(({ slug }) => slug)].map((territorio) => ({ territorio }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ territorio: string }> }) {
  const { territorio } = await params;
  const slug = territorio === "hub" ? NACIONAL : territorio;
  const datos = datosTerritorio(slug);
  if (!datos) return new Response(null, { status: 404, headers: { "Cache-Control": "public, s-maxage=86400" } });

  const titulo = territorio === "hub" ? "Datos de Chile" : `Desempleo en ${nombreTerritorio(slug)}`;
  const logo = await readFile(join(process.cwd(), "public", "images", "logo.png"));
  return new ImageResponse(SocialDatos({
    titulo, actual: datos.actual, serie: datos.serie, logo: `data:image/png;base64,${logo.toString("base64")}`,
  }), {
    width: 1200,
    height: 630,
    headers: { "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=86400" },
  });
}
