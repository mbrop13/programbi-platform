import { ImageResponse } from "next/og";
import {
  loadLogoDataUrl,
  loadRemoteImageDataUrl,
  OG_SIZE,
} from "@/lib/og/assets";

export const alt =
  "¿Quién ganará la final? España vs Argentina — Predice y gana un curso | ProgramBI";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const [logoSrc, flagEs, flagAr] = await Promise.all([
    loadLogoDataUrl(),
    loadRemoteImageDataUrl("https://flagcdn.com/w320/es.png"),
    loadRemoteImageDataUrl("https://flagcdn.com/w320/ar.png"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "linear-gradient(160deg, #0A0F1A 0%, #111827 50%, #0F172A 100%)",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Team color glows */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -60,
            width: 480,
            height: 480,
            borderRadius: 999,
            background: "rgba(220, 38, 38, 0.28)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -40,
            width: 500,
            height: 500,
            borderRadius: 999,
            background: "rgba(14, 165, 233, 0.26)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 500,
            width: 300,
            height: 300,
            borderRadius: 999,
            background: "rgba(251, 191, 36, 0.08)",
          }}
        />

        {/* Top accent bar España / Argentina */}
        <div style={{ display: "flex", height: 10, width: "100%" }}>
          <div
            style={{
              flex: 1,
              background: "linear-gradient(90deg, #DC2626 0%, #F59E0B 100%)",
            }}
          />
          <div
            style={{
              flex: 1,
              background: "linear-gradient(90deg, #38BDF8 0%, #E0F2FE 100%)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "36px 56px 44px",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Header logo + badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.96)",
                borderRadius: 14,
                padding: "12px 18px",
                boxShadow: "0 8px 28px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={logoSrc}
                alt="ProgramBI"
                width={200}
                height={52}
                style={{ objectFit: "contain", objectPosition: "left center" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(251, 191, 36, 0.12)",
                border: "1px solid rgba(251, 191, 36, 0.4)",
                borderRadius: 999,
                padding: "10px 18px",
              }}
            >
              <span style={{ fontSize: 18 }}>🏆</span>
              <span
                style={{
                  color: "#FCD34D",
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                Sorteo de curso
              </span>
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              marginTop: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                color: "white",
                fontSize: 58,
                fontWeight: 900,
                letterSpacing: -1.5,
                lineHeight: 1.05,
                textAlign: "center",
              }}
            >
              ¿Quién ganará la final?
            </div>
            <div
              style={{
                display: "flex",
                color: "rgba(226, 232, 240, 0.75)",
                fontSize: 24,
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Predice el resultado y gana un curso a tu elección
            </div>
          </div>

          {/* Matchup cards */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 28,
              marginTop: 8,
            }}
          >
            {/* España */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                width: 280,
                padding: "28px 24px",
                borderRadius: 28,
                background:
                  "linear-gradient(160deg, rgba(220,38,38,0.22) 0%, rgba(15,23,42,0.75) 100%)",
                border: "2px solid rgba(248, 113, 113, 0.45)",
              }}
            >
              <img
                src={flagEs}
                alt="España"
                width={140}
                height={90}
                style={{
                  borderRadius: 12,
                  objectFit: "cover",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    color: "rgba(252, 165, 165, 0.9)",
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                  }}
                >
                  ESP
                </span>
                <span
                  style={{
                    color: "white",
                    fontSize: 32,
                    fontWeight: 900,
                    letterSpacing: -0.5,
                  }}
                >
                  España
                </span>
              </div>
            </div>

            {/* VS badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 88,
                height: 88,
                borderRadius: 999,
                background: "linear-gradient(145deg, #FBBF24 0%, #F59E0B 100%)",
                color: "#0F172A",
                fontSize: 28,
                fontWeight: 900,
                boxShadow: "0 0 40px rgba(251, 191, 36, 0.45)",
                border: "4px solid rgba(15, 23, 42, 0.9)",
              }}
            >
              VS
            </div>

            {/* Argentina */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                width: 280,
                padding: "28px 24px",
                borderRadius: 28,
                background:
                  "linear-gradient(160deg, rgba(14,165,233,0.22) 0%, rgba(15,23,42,0.75) 100%)",
                border: "2px solid rgba(56, 189, 248, 0.45)",
              }}
            >
              <img
                src={flagAr}
                alt="Argentina"
                width={140}
                height={90}
                style={{
                  borderRadius: 12,
                  objectFit: "cover",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    color: "rgba(125, 211, 252, 0.95)",
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                  }}
                >
                  ARG
                </span>
                <span
                  style={{
                    color: "white",
                    fontSize: 32,
                    fontWeight: 900,
                    letterSpacing: -0.5,
                  }}
                >
                  Argentina
                </span>
              </div>
            </div>
          </div>

          {/* Footer prizes */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              {["Power BI", "SQL Server", "Python"].map((label) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    padding: "10px 16px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#E2E8F0",
                    fontSize: 16,
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
                color: "rgba(226, 232, 240, 0.7)",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              Solo miembros · programbi.com/gran-partido
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // Twemoji for trophy emoji rendering
      emoji: "twemoji",
    }
  );
}
