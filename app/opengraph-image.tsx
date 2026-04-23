import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ProgramBI — Cursos de Análisis de Datos con Expertos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(24,144,255,0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-60px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(99,102,241,0.1)",
            display: "flex",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #1890FF, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "40px",
              fontWeight: 900,
              boxShadow: "0 8px 30px rgba(24,144,255,0.4)",
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 300,
              color: "#94a3b8",
              letterSpacing: "-1px",
            }}
          >
            Program
          </span>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#1890FF",
              letterSpacing: "-1px",
            }}
          >
            BI
          </span>
        </div>

        {/* Main heading */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "52px",
              fontWeight: 900,
              color: "white",
              textAlign: "center",
              lineHeight: 1.1,
              maxWidth: "900px",
              letterSpacing: "-2px",
            }}
          >
            Cursos de Análisis de Datos
          </span>
          <span
            style={{
              fontSize: "52px",
              fontWeight: 900,
              background: "linear-gradient(90deg, #1890FF, #818cf8)",
              backgroundClip: "text",
              color: "transparent",
              textAlign: "center",
              letterSpacing: "-2px",
            }}
          >
            con Expertos
          </span>
        </div>

        {/* Tech stack */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "36px",
          }}
        >
          {["Power BI", "Python", "SQL", "Excel", "Big Data"].map((tech) => (
            <div
              key={tech}
              style={{
                padding: "10px 24px",
                borderRadius: "999px",
                background: "rgba(24,144,255,0.12)",
                border: "1px solid rgba(24,144,255,0.25)",
                color: "#60a5fa",
                fontSize: "18px",
                fontWeight: 700,
                display: "flex",
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(90deg, #1890FF, #818cf8, #1890FF)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
