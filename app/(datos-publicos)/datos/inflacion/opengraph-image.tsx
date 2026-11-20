import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { OG_HEADERS, renderOgCard } from "@/lib/datos/og-card";
import { mesCorto, variacionPorcentual } from "@/lib/datos/formato";
import { getIpcSeries, getUltimoIpc, variacionIpc } from "@/lib/datos/ipc";

export const dynamic = "force-static";
export const alt = "Calculadora de IPC: cuánto valen tus pesos hoy | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Resta 12 meses a un período "YYYY-MM" (mismo mes del año anterior). */
function mesHaceUnAno(ym: string): string {
  const [ano, mes] = ym.split("-").map(Number);
  return `${ano - 1}-${String(mes).padStart(2, "0")}`;
}

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const serie = getIpcSeries();
  const ultimo = getUltimoIpc();
  const var12m = variacionIpc(mesHaceUnAno(ultimo.m), ultimo.m, serie);

  return new ImageResponse(
    renderOgCard({
      titulo: "Calculadora de IPC: cuánto valen tus pesos hoy",
      cifra: ultimo.v.toFixed(2).replace(".", ","),
      cifraLabel: `índice IPC ${mesCorto(ultimo.m)}${var12m !== null ? ` · ${variacionPorcentual(var12m).replace(/ /g, " ")} en 12 meses` : ""}`,
      subtitulo:
        "Ajusta sueldos, aranceles y montos en CLP con la serie oficial del INE.",
      badge: `IPC oficial INE · ${mesCorto(ultimo.m)}`,
      miniVisual:
        serie.length > 1
          ? {
              tipo: "linea",
              caption: "Índice de Precios al Consumidor (base 2023=100, INE)",
              puntos: serie.map((p) => p.v),
              extremos: [mesCorto(serie[0].m), mesCorto(ultimo.m)],
            }
          : undefined,
      logoSrc,
      fuente: "Fuente: INE Chile (CC BY-SA 4.0)",
      urlCorta: "programbi.com/datos/inflacion",
    }),
    { width: 1200, height: 630, headers: OG_HEADERS }
  );
}
