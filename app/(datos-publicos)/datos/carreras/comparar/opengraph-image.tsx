import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { getMetaCarreras, getRankingCarreras } from "@/lib/datos/carreras";
import { pesos, porcentaje } from "@/lib/datos/formato";

export const alt = "Comparador de carreras en Chile | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();
  const ranking = getRankingCarreras();
  const com = ranking.find((r) => r.slug === "ingenieria-comercial" && r.tipo === "u");
  const ind = ranking.find((r) => r.slug === "ingenieria-civil-industrial" && r.tipo === "u");

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
            Comparador oficial · {meta.edicion}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08 }}>
            Comparador de carreras en Chile
          </div>
          <div style={{ fontSize: 24, color: "#5c5c58" }}>
            Sueldos del 1.º al 5.º año, empleabilidad, duración real y aranceles lado a lado.
          </div>

          {com && ind ? (
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  background: "#ffffff",
                  border: "1px solid #e2e2dc",
                  borderTop: "5px solid #1890ff",
                  borderRadius: 16,
                  padding: "20px 24px",
                }}
              >
                <span style={{ fontSize: 22, fontWeight: 700 }}>{com.nombre} (U)</span>
                <span style={{ fontSize: 34, fontWeight: 800, color: "#1890ff", marginTop: 6 }}>
                  {pesos(com.ing4)}
                </span>
                <span style={{ fontSize: 16, color: "#5c5c58", marginTop: 4 }}>
                  4.º año · Empleo {porcentaje(com.emp1)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  background: "#ffffff",
                  border: "1px solid #e2e2dc",
                  borderTop: "5px solid #f99c00",
                  borderRadius: 16,
                  padding: "20px 24px",
                }}
              >
                <span style={{ fontSize: 22, fontWeight: 700 }}>{ind.nombre} (U)</span>
                <span style={{ fontSize: 34, fontWeight: 800, color: "#f99c00", marginTop: 6 }}>
                  {pesos(ind.ing4)}
                </span>
                <span style={{ fontSize: 16, color: "#5c5c58", marginTop: 4 }}>
                  4.º año · Empleo {porcentaje(ind.emp1)}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "#5c5c58" }}>
          <span>Fuente: www.mifuturo.cl (Mineduc)</span>
          <span>programbi.com/datos/carreras/comparar</span>
        </div>
      </div>
    ),
    size
  );
}
