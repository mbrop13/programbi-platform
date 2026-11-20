// InlineBar — barra horizontal para celdas de tabla, SVG puro server-side
// (sin "use client", sin hooks, sin dependencias). Contrato viz · tarea T03.
// display:block + min-width 72px para convivir con <td> sin romper el layout.
// El relleno es geométrico: el texto del label siempre va en C.ink (nunca C.blue).
import type { JSX } from "react";
import { C } from "./tokens";

export type InlineBarProps = {
  value: number;
  max: number;
  label?: string;
  tone?: "blue" | "mute";
};

// Tono mute: gris neutro fijado por el encargo T03 (#b9b8b2); no está en tokens.
const MUTE_BAR = "#b9b8b2";

export function InlineBar({
  value,
  max,
  label,
  tone = "blue",
}: InlineBarProps): JSX.Element {
  // Fracción clamp 0..1; max <= 0 o valor no finito → 0 (nunca NaN).
  const v = typeof value === "number" && Number.isFinite(value) ? value : 0;
  const m = typeof max === "number" && Number.isFinite(max) ? max : 0;
  const frac = m > 0 ? Math.min(1, Math.max(0, v / m)) : 0;
  const relleno = tone === "mute" ? MUTE_BAR : C.blue;
  const ariaLabel = `${label ?? "valor"}: ${v} de ${m}`;

  return (
    <span
      style={{
        display: "block",
        minWidth: 72,
        width: "100%",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {/* Fila: barra elástica + label opcional a la derecha (una sola línea en el <td>). */}
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ flex: 1, minWidth: 0, display: "block" }}>
          <svg
            width="100%"
            height={16}
            role="img"
            aria-label={ariaLabel}
            style={{ display: "block" }}
          >
            {/* Pista completa redondeada (sin viewBox: % = ancho real de celda, rx en px). */}
            <rect x={0} y={3} width="100%" height={10} rx={5} fill={C.line} />
            {frac > 0 ? (
              // rx se auto-limita a la mitad del ancho en barras cortas (spec SVG).
              <rect x={0} y={3} width={`${frac * 100}%`} height={10} rx={5} fill={relleno} />
            ) : null}
          </svg>
        </span>
        {label ? (
          <span
            style={{
              flexShrink: 0,
              fontSize: 12,
              lineHeight: "16px",
              color: C.ink,
              whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {label}
          </span>
        ) : null}
      </span>
    </span>
  );
}
