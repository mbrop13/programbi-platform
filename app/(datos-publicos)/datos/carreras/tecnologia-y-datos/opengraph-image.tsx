import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { OG_HEADERS, renderOgCard } from "@/lib/datos/og-card";
import { getMetaCarreras, getRankingCarreras, TIPO_ETIQUETAS } from "@/lib/datos/carreras";
import { pesos } from "@/lib/datos/formato";

export const dynamic = "force-static";
export const alt = "Carreras de tecnología y datos en Chile | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mismo filtro que tecnologia-y-datos/page.tsx (solo lectura de su lógica).
const RE_TEC_DATOS =
  /computacion|informatica|conectividad|redes|telecomunicaciones|matematica|estadistica|datos/i;

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();
  const items = getRankingCarreras()
    .filter(
      (r) =>
        (RE_TEC_DATOS.test(r.slug) || RE_TEC_DATOS.test(r.nombre)) && r.ing4 !== null
    )
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0));
  const top = items.slice(0, 5);
  const top1 = top[0];

  return new ImageResponse(
    renderOgCard({
      titulo: "Carreras de tecnología y datos en Chile",
      cifra: top1 ? pesos(top1.ing4) : undefined,
      cifraLabel: top1 ? `mayor sueldo 4.º año (${TIPO_ETIQUETAS[top1.tipo].corto})` : undefined,
      subtitulo: `${top1 ? `${top1.nombre} lidera · ` : ""}${items.length} combinaciones carrera-tipo con datos oficiales de computación, informática, redes, telecomunicaciones y estadística`,
      badge: `Tecnología y datos · Edición ${meta.edicion}`,
      miniVisual:
        top.length > 0
          ? {
              tipo: "barras",
              caption: `Ingreso bruto 4.º año · top del área · pesos ${meta.pesos_de}`,
              barras: top.map((r) => ({
                label: `${r.nombre} (${TIPO_ETIQUETAS[r.tipo].corto})`,
                valor: r.ing4 ?? 0,
                valorTexto: pesos(r.ing4),
              })),
            }
          : undefined,
      logoSrc,
      fuente: "Fuente: www.mifuturo.cl (Mineduc)",
      urlCorta: "programbi.com/datos/carreras/tecnologia-y-datos",
    }),
    { width: 1200, height: 630, headers: OG_HEADERS }
  );
}
