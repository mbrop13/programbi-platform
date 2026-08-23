import type { ReactElement } from "react";

/**
 * Plantilla compartida de imágenes OG (Open Graph) con el lenguaje visual
 * actual de ProgramBI: papel-monócromo (#f3f3f0 / #171716), tipografía enorme,
 * líneas finas y verde #16a34a reservado para "verificado".
 *
 * Temas:
 *  - "paper": fondo canvas claro, texto tinta (default)
 *  - "ink":   fondo tinta oscuro, texto papel (secciones cinematográficas de la bolsa)
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgCardOptions {
  logoSrc: string;
  /** Etiqueta corta arriba (sección o prueba social). Se muestra en mayúsculas. */
  kicker?: string;
  title: string;
  description?: string;
  /** Chips del pie (máx. 4). */
  tags?: string[];
  /** Ruta relativa, p. ej. "cursos/power-bi". Se muestra como programbi.com/cursos/power-bi */
  path?: string;
  theme?: "paper" | "ink";
  /** Hex de acento (p. ej. accentColor del curso). El verde queda para "verificado". */
  accent?: string;
  /** Pinta el punto del kicker de verde: solo para certificados/verificación. */
  verified?: boolean;
}

const INK = "#171716";
const PAPER = "#f3f3f0";
const GREEN = "#16a34a";

function titleFontSize(title: string): number {
  const len = title.length;
  if (len <= 30) return 76;
  if (len <= 46) return 66;
  if (len <= 64) return 56;
  if (len <= 84) return 48;
  return 42;
}

export function OgCard({
  logoSrc,
  kicker,
  title,
  description,
  tags,
  path,
  theme = "paper",
  accent,
  verified = false,
}: OgCardOptions): ReactElement {
  const dark = theme === "ink";
  const bg = dark ? INK : PAPER;
  const fg = dark ? PAPER : INK;
  const fgSoft = dark ? "rgba(247,247,244,0.68)" : "rgba(23,23,22,0.64)";
  const fgFaint = dark ? "rgba(247,247,244,0.5)" : "rgba(23,23,22,0.46)";
  const hairline = dark ? "rgba(247,247,244,0.18)" : "rgba(23,23,22,0.16)";
  const chipBg = dark ? "rgba(247,247,244,0.06)" : "rgba(23,23,22,0.04)";
  const dotColor = verified ? GREEN : accent || fg;
  const gridColor = dark ? "rgba(247,247,244,0.5)" : "rgba(23,23,22,0.5)";

  const cleanTags = (tags || []).filter(Boolean).slice(0, 4);
  const cleanDesc =
    description && description.trim().length > 0
      ? description.trim().slice(0, 170).trim() + (description.trim().length > 170 ? "…" : "")
      : null;
  const displayPath = path ? `programbi.com/${path.replace(/^\//, "")}` : "programbi.com";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: bg,
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Grilla fina, casi imperceptible — textura editorial */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Halo suave superior derecho, monócromo */}
      <div
        style={{
          position: "absolute",
          top: -260,
          right: -200,
          width: 640,
          height: 640,
          borderRadius: 999,
          background: dark
            ? "rgba(247,247,244,0.05)"
            : "rgba(255,255,255,0.55)",
        }}
      />

      {/* Marco hairline interior */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          right: 28,
          bottom: 28,
          border: `1px solid ${hairline}`,
          borderRadius: 18,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 72px 58px",
          position: "relative",
        }}
      >
        {/* Header: logo + kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {dark ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.96)",
                borderRadius: 12,
                padding: "10px 18px",
              }}
            >
              <img
                src={logoSrc}
                alt="ProgramBI"
                width={168}
                height={44}
                style={{ objectFit: "contain", objectPosition: "left center" }}
              />
            </div>
          ) : (
            <img
              src={logoSrc}
              alt="ProgramBI"
              width={196}
              height={51}
              style={{ objectFit: "contain", objectPosition: "left center" }}
            />
          )}

          {kicker ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: `1px solid ${hairline}`,
                background: chipBg,
                borderRadius: 999,
                padding: "10px 20px",
              }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 999,
                  background: dotColor,
                }}
              />
              <span
                style={{
                  color: fgSoft,
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {kicker}
              </span>
            </div>
          ) : null}
        </div>

        {/* Título + descripción */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            maxWidth: 940,
            paddingBottom: 8,
          }}
        >
          {accent && !verified ? (
            <div
              style={{
                width: 64,
                height: 6,
                borderRadius: 3,
                background: accent,
              }}
            />
          ) : null}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: titleFontSize(title),
              fontWeight: 800,
              lineHeight: 1.08,
              color: fg,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          {cleanDesc ? (
            <div
              style={{
                display: "flex",
                fontSize: 25,
                fontWeight: 500,
                lineHeight: 1.4,
                color: fgSoft,
                maxWidth: 860,
              }}
            >
              {cleanDesc}
            </div>
          ) : null}
        </div>

        {/* Pie: tags + ruta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${hairline}`,
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            {cleanTags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "9px 18px",
                  borderRadius: 999,
                  border: `1px solid ${hairline}`,
                  background: chipBg,
                  color: fg,
                  fontSize: 17,
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: fgFaint,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            {displayPath}
            <span style={{ fontSize: 22 }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
