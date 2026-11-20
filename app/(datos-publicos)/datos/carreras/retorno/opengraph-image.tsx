import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { OG_HEADERS, renderOgCard } from "@/lib/datos/og-card";
import { getMetaCarreras, getRankingCarreras } from "@/lib/datos/carreras";
import { mesCorto, pesos } from "@/lib/datos/formato";
import { ajustarPorIpc } from "@/lib/datos/ipc";

export const dynamic = "force-static";
export const alt = "Calculadora de retorno de carreras en Chile | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();
  // Ejemplo real con los mismos supuestos por defecto de CalculadoraRetorno:
  // Ingeniería Civil Industrial (U), arancel mediano 2026 × años reales
  // (dur_real/2 redondeado a 0,1) + costo mediano de titulación.
  const ejemplo = getRankingCarreras().find(
    (r) => r.slug === "ingenieria-civil-industrial" && r.tipo === "u"
  );
  let cifra: string | undefined;
  let cifraLabel: string | undefined;
  let subtitulo =
    "Estima el costo total de estudiar y a cuántos meses de sueldo bruto equivale.";
  if (
    ejemplo &&
    ejemplo.ing1 &&
    ejemplo.ing4 &&
    ejemplo.arancel_med &&
    ejemplo.dur_real
  ) {
    const anos = Math.round((ejemplo.dur_real / 2) * 10) / 10;
    const costo = Math.round(ejemplo.arancel_med * anos + (ejemplo.costo_tit_med ?? 0));
    const adj1 = ajustarPorIpc(ejemplo.ing1, meta.pesos_de);
    const adj4 = ajustarPorIpc(ejemplo.ing4, meta.pesos_de);
    const meses1 = adj1 && adj1.montoAjustado > 0 ? costo / adj1.montoAjustado : null;
    const meses4 = adj4 && adj4.montoAjustado > 0 ? costo / adj4.montoAjustado : null;
    if (meses4 !== null && adj4) {
      cifra = `${meses4.toFixed(1).replace(".", ",")} meses`;
      cifraLabel = "de sueldo bruto al 4.º año equivalen al costo de estudiar";
      subtitulo =
        `Ejemplo ${ejemplo.nombre} (U): costo directo ${pesos(costo)} (${pesos(ejemplo.arancel_med)} × ${anos.toFixed(1).replace(".", ",")} años + titulación)` +
        (meses1 !== null
          ? ` · ${meses1.toFixed(1).replace(".", ",")} meses al 1.er año · sueldos ajustados por IPC a ${mesCorto(adj4.mesHasta)}`
          : "");
    }
  }

  return new ImageResponse(
    renderOgCard({
      titulo: "¿Cuánto cuesta estudiar una carrera y a cuántos sueldos equivale?",
      cifra,
      cifraLabel,
      subtitulo,
      badge: `Calculadora de retorno · Edición ${meta.edicion}`,
      logoSrc,
      fuente: "Fuente: www.mifuturo.cl (Mineduc) · IPC: INE",
      urlCorta: "programbi.com/datos/carreras/retorno",
    }),
    { width: 1200, height: 630, headers: OG_HEADERS }
  );
}
