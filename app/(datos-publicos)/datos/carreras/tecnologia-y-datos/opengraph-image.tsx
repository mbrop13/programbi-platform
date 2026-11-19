import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { getMetaCarreras, getRankingCarreras } from "@/lib/datos/carreras";
import { pesos, porcentaje } from "@/lib/datos/formato";

export const alt = "Carreras de tecnología y datos en Chile | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();
  const top = getRankingCarreras().find(
    (r) => r.slug === "ingenieria-civil-en-computacion-e-informatica" && r.tipo === "u"
  );

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
            Tecnología y datos · {meta.edicion}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08 }}>
            Carreras de tecnología y datos en Chile
          </div>
          <div style={{ fontSize: 24, color: "#5c5c58", lineHeight: 1.35 }}>
            Computación, informática, conectividad y redes, telecomunicaciones y matemática/estadística.
          </div>
          {top ? (
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#ffffff",
                  border: "1px solid #e2e2dc",
                  borderRadius: 16,
                  padding: "18px 26px",
                }}
              >
                <span style={{ fontSize: 16, color: "#5c5c58" }}>{top.nombre} (U) · 4.º año</span>
                <span style={{ fontSize: 34, fontWeight: 800, color: "#1890ff" }}>
                  {pesos(top.ing4)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#ffffff",
                  border: "1px solid #e2e2dc",
                  borderRadius: 16,
                  padding: "18px 26px",
                }}
              >
                <span style={{ fontSize: 16, color: "#5c5c58" }}>Empleabilidad 1.er año</span>
                <span style={{ fontSize: 34, fontWeight: 800, color: "#171716" }}>
                  {porcentaje(top.emp1)}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "#5c5c58" }}>
          <span>Fuente: www.mifuturo.cl (Mineduc)</span>
          <span>programbi.com/datos/carreras/tecnologia-y-datos</span>
        </div>
      </div>
    ),
    size
  );
}
