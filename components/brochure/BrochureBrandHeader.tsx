import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import {
  FONT_MONO,
  FONT_SANS,
  T,
  accentInk,
  accentOf,
} from "@/lib/brochure/brochure-theme";

export type BrochureBrandHeaderProps = {
  data: CourseBrochureData;
};

/**
 * Cabecera editorial superior de las hojas interiores (2..N).
 * Mantiene el lenguaje Paper & Ink de ProgramBI con acento calibrado.
 */
export function BrochureBrandHeader({ data }: BrochureBrandHeaderProps) {
  const accent = accentOf(data.accentColor);
  const accentText = accentInk(data.accentColor);
  const logoSrc = data.brandLogoUrl || "/images/logo.png";

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "18px 48px 13px",
        borderBottom: `1px solid ${T.line}`,
        background: T.paper,
        fontFamily: FONT_SANS,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <img
          src={logoSrc}
          alt="ProgramBI"
          crossOrigin="anonymous"
          style={{
            height: 24,
            width: "auto",
            display: "block",
            objectFit: "contain",
            flexShrink: 0,
          }}
        />
        <span
          aria-hidden="true"
          style={{ width: 1, height: 18, background: T.lineStrong, flexShrink: 0 }}
        />
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: T.mute,
            whiteSpace: "nowrap",
          }}
        >
          Brochure Ejecutivo
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          minWidth: 0,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            borderRadius: 2,
            background: accent,
            border: accent === "#F2C811" ? `1px solid ${accentText}` : "none",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: T.ink,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 260,
          }}
        >
          {data.title}
        </span>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            fontWeight: 600,
            color: accentText,
            background: T.paperWarm,
            border: `1px solid ${T.line}`,
            borderRadius: 4,
            padding: "2px 8px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {data.paisNombre} · {data.moneda}
        </span>
      </div>
    </header>
  );
}
