import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { getMetaCarreras } from "@/lib/datos/carreras";

export const alt = "Calculadora de retorno de carreras en Chile | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f7f4",
          color: "#171716",
          padding: "52px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="ProgramBI" width={180} height={46} style={{ objectFit: "contain" }} />
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              padding: "8px 18px",
              borderRadius: 999,
              background: "#e9f4ff",
              color: "#1890ff",
            }}
          >
            Calculadora de retorno · {meta.edicion}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08 }}>
            Costo total vs sueldo bruto en Chile
          </div>
          <div style={{ fontSize: 24, color: "#5c5c58", lineHeight: 1.35 }}>
            Estima cuántos meses de sueldo al 1.º y 4.º año equivalen al arancel 2026 y duración real de tu carrera.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "#5c5c58" }}>
          <span>Fuente: www.mifuturo.cl (Mineduc)</span>
          <span>programbi.com/datos/carreras/retorno</span>
        </div>
      </div>
    ),
    size
  );
}
