import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { mesCorto, variacionPorcentual } from "@/lib/datos/formato";
import { getIpcSeries, getUltimoIpc, variacionIpc } from "@/lib/datos/ipc";

export const alt = "Calculadora de IPC: cuánto valen tus pesos hoy | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const serie = getIpcSeries();
  const ultimo = getUltimoIpc();
  const varSep25 = variacionIpc("2025-09", ultimo.m, serie);

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
          <img
            src={logoSrc}
            alt="ProgramBI"
            width={180}
            height={46}
            style={{ objectFit: "contain" }}
          />
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
            {`IPC Base 2023 = 100 · ${mesCorto(ultimo.m)}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 54,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
            }}
          >
            Calculadora de IPC: cuánto valen tus pesos hoy
          </div>
          <div style={{ fontSize: 25, color: "#5c5c58", lineHeight: 1.35 }}>
            Ajusta sueldos, aranceles y montos en CLP con la serie oficial del INE.
          </div>

          <div style={{ display: "flex", gap: 24, marginTop: 10 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#ffffff",
                border: "1px solid #e2e2dc",
                borderRadius: 16,
                padding: "18px 28px",
              }}
            >
              <span style={{ fontSize: 16, color: "#5c5c58" }}>
                Último índice ({mesCorto(ultimo.m)})
              </span>
              <span style={{ fontSize: 36, fontWeight: 800, color: "#1890ff" }}>
                {ultimo.v.toFixed(2).replace(".", ",")}
              </span>
            </div>

            {varSep25 !== null ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#ffffff",
                  border: "1px solid #e2e2dc",
                  borderRadius: 16,
                  padding: "18px 28px",
                }}
              >
                <span style={{ fontSize: 16, color: "#5c5c58" }}>
                  Variación sep-2025 → {mesCorto(ultimo.m)}
                </span>
                <span style={{ fontSize: 36, fontWeight: 800, color: "#171716" }}>
                  {variacionPorcentual(varSep25).replace("\u00a0", " ")}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#5c5c58",
          }}
        >
          <span>Fuente: INE Chile (CC BY-SA 4.0)</span>
          <span>programbi.com/datos/inflacion</span>
        </div>
      </div>
    ),
    size
  );
}
