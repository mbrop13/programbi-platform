import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { getMetaCarreras, getRankingCarreras } from "@/lib/datos/carreras";
import { entero, pesos, porcentaje } from "@/lib/datos/formato";

export const alt = "Ranking de carreras en Chile: sueldos y empleabilidad | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();
  const ranking = getRankingCarreras();
  const topU = ranking
    .filter((r) => r.tipo === "u" && r.ing4 !== null)
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))[0];
  const topIp = ranking
    .filter((r) => r.tipo === "ip" && r.ing4 !== null)
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f8f9fb",
          color: "#0f172a",
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
              fontWeight: 600,
              padding: "8px 18px",
              borderRadius: 10,
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
            }}
          >
            {`Edición ${meta.edicion} · ${meta.conteos.genericas_unicas} carreras`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 54, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08 }}>
            Ranking de carreras en Chile: sueldos y empleabilidad
          </div>
          <div style={{ fontSize: 24, color: "#475569", lineHeight: 1.35 }}>
            Ingresos brutos 1.º al 5.º año, percentiles P10–P90, aranceles 2026 y comparador oficial.
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
            {topU ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 16,
                  padding: "18px 24px",
                  flex: 1,
                }}
              >
                <span style={{ fontSize: 16, color: "#475569" }}>Top Universidades (4.º año)</span>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#1d4ed8", marginTop: 4 }}>
                  {`${topU.nombre}: ${pesos(topU.ing4)}`}
                </span>
                <span style={{ fontSize: 16, color: "#475569", marginTop: 4 }}>
                  {`Empleabilidad 1.º: ${porcentaje(topU.emp1)}`}
                </span>
              </div>
            ) : null}
            {topIp ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 16,
                  padding: "18px 24px",
                  flex: 1,
                }}
              >
                <span style={{ fontSize: 16, color: "#475569" }}>Top IP (4.º año)</span>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                  {`${topIp.nombre}: ${pesos(topIp.ing4)}`}
                </span>
                <span style={{ fontSize: 16, color: "#475569", marginTop: 4 }}>
                  {`${entero(meta.conteos.filas_C)} programas analizados`}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "#475569" }}>
          <span>Fuente: www.mifuturo.cl (Mineduc) · Pesos sep-2025</span>
          <span>programbi.com/datos/carreras</span>
        </div>
      </div>
    ),
    size
  );
}
