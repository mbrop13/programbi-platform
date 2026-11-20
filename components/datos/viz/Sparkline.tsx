// Sparkline — SVG puro server-side (sin "use client", sin hooks, sin dependencias).
// Contrato viz: scratch/BRIEF_SUBBOTS.md · tarea T03.
// width/height definen el tamaño natural (120×32 por defecto); maxWidth:100% +
// preserveAspectRatio="none" permiten encogerse dentro de celdas de tabla sin CLS.
import type { JSX } from "react";
import { C } from "./tokens";

export type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  ariaLabel: string;
  lastDot?: boolean;
};

export function Sparkline({
  data,
  width,
  height,
  ariaLabel,
  lastDot = false,
}: SparklineProps): JSX.Element {
  const w =
    typeof width === "number" && Number.isFinite(width) && width > 0 ? width : 120;
  const h =
    typeof height === "number" && Number.isFinite(height) && height > 0 ? height : 32;

  // Solo valores finitos: nunca NaN en el SVG.
  const vals = (Array.isArray(data) ? data : []).filter(
    (v) => typeof v === "number" && Number.isFinite(v),
  );
  const n = vals.length;

  // Margen del trazo (y del punto final) para no recortar stroke ni círculo.
  const padX = lastDot ? 3 : 1;
  const padY = lastDot ? 3 : 2;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;

  let puntos: string;
  let ultimo: { x: number; y: number } | null = null;

  if (n === 0) {
    // Serie vacía: línea plana centrada.
    puntos = `${padX},${h / 2} ${w - padX},${h / 2}`;
  } else if (n === 1) {
    // Un solo punto: línea plana centrada (el punto final va al extremo derecho).
    puntos = `${padX},${h / 2} ${w - padX},${h / 2}`;
    ultimo = { x: w - padX, y: h / 2 };
  } else {
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const rango = max - min;
    // Normalización min..max con 5% de padding; serie constante → línea centrada.
    const margen = rango > 0 ? rango * 0.05 : Math.abs(min) * 0.05 || 1;
    const lo = min - margen;
    const hi = max + margen;
    const coords = vals.map((v, i) => ({
      x: padX + (i / (n - 1)) * innerW,
      y: padY + ((hi - v) / (hi - lo)) * innerH,
    }));
    puntos = coords.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
    ultimo = coords[n - 1];
  }

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={ariaLabel}
      style={{ display: "block", maxWidth: "100%" }}
    >
      <polyline
        points={puntos}
        fill="none"
        stroke={C.blue}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Punto final en C.blueText (contraste AA); el amarillo queda reservado al «Tú» de RangeBar. */}
      {lastDot && ultimo ? (
        <circle cx={ultimo.x} cy={ultimo.y} r={3} fill={C.blueText} />
      ) : null}
    </svg>
  );
}
