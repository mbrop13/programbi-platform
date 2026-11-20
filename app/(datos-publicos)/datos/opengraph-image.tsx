import { ImageResponse } from "next/og";
import mapa from "@/components/datos/mapa-paths.json";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { OG_HEADERS, renderOgCard } from "@/lib/datos/og-card";
import { getMetaCarreras } from "@/lib/datos/carreras";
import { datosTerritorio, RANKING } from "@/lib/datos/desempleo";
import { cifra, periodo, tasa } from "@/lib/datos/desempleo-formato";
import { entero, mesCorto } from "@/lib/datos/formato";
import { getUltimoIpc } from "@/lib/datos/ipc";
import { NACIONAL } from "@/lib/datos/regiones";

export const dynamic = "force-static";
export const alt = "Datos de Chile: desempleo, carreras e IPC | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();
  const nacional = datosTerritorio(NACIONAL);
  const ultimoIpc = getUltimoIpc();

  // El helper colorea el mapa por posición con escala «Menor → mayor»:
  // se ordenan las regiones de menor a mayor tasa real para que el color
  // corresponda a la tasa de desempleo de cada región (datos INE).
  const asc = [...RANKING].sort((a, b) => a.tasa - b.tasa);
  const paths = asc
    .map((r) => mapa.paths[r.slug as keyof typeof mapa.paths])
    .filter((d): d is string => Boolean(d));

  return new ImageResponse(
    renderOgCard({
      titulo: "Datos de Chile: desempleo, carreras e IPC",
      cifra: nacional ? tasa(nacional.actual.tasa) : undefined,
      cifraLabel: nacional
        ? `desempleo nacional · ${periodo(nacional.actual.p)}`
        : undefined,
      subtitulo: `${entero(meta.conteos.genericas_unicas)} carreras genéricas · IPC ${mesCorto(ultimoIpc.m)}: ${ultimoIpc.v.toFixed(2).replace(".", ",")}`,
      badge: "Datos de Chile",
      miniVisual:
        asc.length > 0 && nacional
          ? {
              tipo: "mapa",
              caption: `Tasa de desempleo por región · ${periodo(nacional.actual.p)} · ${cifra(asc[0].tasa)}–${cifra(asc[asc.length - 1].tasa)} %`,
              paths,
              viewBox: mapa.viewBox,
            }
          : undefined,
      logoSrc,
      fuente: "Fuente: INE (ENE) · mifuturo.cl (Mineduc) · Mapa: BCN",
      urlCorta: "programbi.com/datos",
    }),
    { width: 1200, height: 630, headers: OG_HEADERS }
  );
}
