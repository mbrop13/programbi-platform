import type { CSSProperties, ReactNode } from "react";
import {
  FONT_MONO,
  FONT_SANS,
  T,
  accentInk,
  accentOnDark,
  contrastOn,
} from "@/lib/brochure/brochure-theme";

/**
 * Cabecera editorial reutilizable para las páginas interiores del brochure.
 */
export function SheetTitleBlock({
  kicker,
  title,
  subtitle,
  accentColor,
  rightSlot,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  accentColor?: string | null;
  rightSlot?: ReactNode;
}) {
  const accentText = accentInk(accentColor);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 20,
        paddingBottom: 14,
        borderBottom: `1px solid ${T.obsidian}`,
        marginBottom: 18,
        fontFamily: FONT_SANS,
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 14,
              height: 2,
              background: accentText,
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: accentText,
            }}
          >
            {kicker}
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 29,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: T.ink,
          }}
        >
          {title}
        </h1>

        {subtitle ? (
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              lineHeight: 1.45,
              color: T.inkSoft,
              maxWidth: 540,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {rightSlot ? <div style={{ flexShrink: 0 }}>{rightSlot}</div> : null}
    </div>
  );
}

/**
 * Separador de sección editorial en tipografía mono con regla de 1px.
 */
export function SectionDividerLabel({
  label,
  rightLabel,
}: {
  label: string;
  rightLabel?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: T.mute,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1, height: 1, background: T.line }} aria-hidden="true" />
      {rightLabel ? (
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: T.mute,
            whiteSpace: "nowrap",
          }}
        >
          {rightLabel}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Icono check minimalista nítido (renderiza de forma idéntica en SVG y html-to-image).
 */
export function CrispCheckIcon({
  color = T.ok,
  size = 14,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Botón CTA editorial compatible con enlaces clickeables reales dentro del PDF (`data-pdf-link`).
 */
export function BrochureCtaLink({
  href,
  label,
  variant = "primary",
  accentColor,
  style,
}: {
  href: string;
  label: string;
  variant?: "primary" | "accent" | "outline" | "whatsapp";
  accentColor?: string | null;
  style?: CSSProperties;
}) {
  const accent = accentOnDark(accentColor);
  const stylesByVariant: Record<typeof variant, CSSProperties> = {
    primary: {
      background: T.obsidian,
      color: "#FFFFFF",
      border: `1px solid ${T.obsidian}`,
    },
    accent: {
      background: accent,
      color: contrastOn(accent),
      border: `1px solid ${accent}`,
    },
    outline: {
      background: "transparent",
      color: "#FFFFFF",
      border: "1px solid rgba(255,255,255,0.28)",
    },
    whatsapp: {
      background: T.paper,
      color: T.whatsapp,
      border: `1px solid ${T.whatsapp}`,
    },
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-pdf-link="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 6,
        fontFamily: FONT_SANS,
        fontSize: 12.5,
        fontWeight: 600,
        textDecoration: "none",
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...stylesByVariant[variant],
        ...style,
      }}
    >
      {label}
    </a>
  );
}
