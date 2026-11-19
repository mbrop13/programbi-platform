import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SocialDatos } from "@/components/datos/SocialDatos";
import { datosTerritorio, regionesPublicables } from "@/lib/datos/desempleo";
import { datosJovenes } from "@/lib/datos/desempleo-desgloses";
import { NACIONAL, nombreTerritorio } from "@/lib/datos/regiones";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    "hub", NACIONAL, ...regionesPublicables().flatMap(({ slug }) => [slug, `comparar-${slug}`]),
    ...(datosJovenes() ? ["jovenes"] : []),
  ].map((territorio) => ({ territorio }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ territorio: string }> }) {
  const { territorio } = await params;
  const esComparacion = territorio.startsWith("comparar-");
  const slug = territorio === "hub" ? NACIONAL : esComparacion ? territorio.slice("comparar-".length) : territorio;
  const juventud = slug === "jovenes" ? datosJovenes() : null;
  const datos = juventud ? {
    actual: { p: juventud.actual.p, tasa: juventud.tasa },
    serie: juventud.tasas.flatMap((fila) => fila.valores.tasa === undefined
      ? [] : [{ p: fila.p, tasa: fila.valores.tasa }]),
  } : datosTerritorio(slug);
  if (!datos) return new Response(null, { status: 404, headers: { "Cache-Control": "public, s-maxage=86400" } });

  const titulo = territorio === "hub" ? "Datos de Chile"
    : juventud ? "Desempleo juvenil en Chile" : `Desempleo en ${nombreTerritorio(slug)}`;
  const logo = await readFile(join(process.cwd(), "public", "images", "logo.png"));
  return new ImageResponse(SocialDatos({
    titulo, actual: datos.actual, serie: datos.serie, logo: `data:image/png;base64,${logo.toString("base64")}`,
    chile: esComparacion ? datosTerritorio(NACIONAL)?.actual.tasa : undefined,
  }), {
    width: 1200,
    height: 630,
    headers: { "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=86400" },
  });
}
