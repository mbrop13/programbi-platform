import { ImageResponse } from "next/og";
import { loadLogoDataUrl, OG_SIZE } from "@/lib/og/assets";

export const alt =
  "ProgramBI — Cursos de Análisis de Datos, Power BI, SQL y Python";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "linear-gradient(145deg, #020617 0%, #0B1B3A 45%, #0F274F 100%)",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: "rgba(24, 144, 255, 0.28)",
            filter: "blur(8px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: -100,
            width: 380,
            height: 380,
            borderRadius: 999,
            background: "rgba(56, 189, 248, 0.16)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 420,
            width: 280,
            height: 280,
            borderRadius: 999,
            background: "rgba(99, 102, 241, 0.12)",
          }}
        />

        {/* Grid lines subtle */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.07,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "52px 64px",
            position: "relative",
          }}
        >
          {/* Logo con placa para contraste */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.96)",
              borderRadius: 16,
              padding: "14px 22px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              alignSelf: "flex-start",
            }}
          >
            <img
              src={logoSrc}
              alt="ProgramBI"
              width={240}
              height={62}
              style={{
                objectFit: "contain",
                objectPosition: "left center",
              }}
            />
          </div>

          {/* Main copy */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              maxWidth: 720,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(24, 144, 255, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.35)",
                borderRadius: 999,
                padding: "10px 20px",
                width: "auto",
                alignSelf: "flex-start",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#38BDF8",
                }}
              />
              <span
                style={{
                  color: "#BAE6FD",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                +5.000 estudiantes formados
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 64,
                fontWeight: 900,
                lineHeight: 1.08,
                color: "white",
                letterSpacing: -1.5,
              }}
            >
              <span>Cursos de Análisis</span>
              <span>
                de Datos con{" "}
                <span style={{ color: "#38BDF8" }}>Expertos</span>
              </span>
            </div>

            <div
              style={{
                display: "flex",
                color: "rgba(226, 232, 240, 0.82)",
                fontSize: 26,
                fontWeight: 500,
                lineHeight: 1.35,
                maxWidth: 640,
              }}
            >
              Power BI · SQL Server · Python · Excel · IA
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(148, 163, 184, 0.25)",
              paddingTop: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 14,
              }}
            >
              {["Power BI", "SQL", "Python", "Excel"].map((label) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 18px",
                    borderRadius: 12,
                    background: "rgba(15, 23, 42, 0.55)",
                    border: "1px solid rgba(56, 189, 248, 0.28)",
                    color: "#E2E8F0",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#7DD3FC",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              programbi.com
              <span style={{ fontSize: 24 }}>→</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
