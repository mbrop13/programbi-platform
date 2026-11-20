// RangeBar — banda min–max (p. ej. P10–P90) con marcador de mediana y «Tú»
// opcional. SVG puro server-side (sin "use client", sin hooks, sin dependencias).
// Contrato viz · tarea T03. Alto fijo 72px (reserva de altura, sin CLS).
// Sin viewBox: las x van en % del ancho real y las y en px, así el texto no se
// deforma al estirar. Escala lineal min..max; si min === max se expande ±1.
import type { JSX } from "react";
import { C } from "./tokens";

export type RangeBarProps = {
  min: number;
  max: number;
  mid?: number;
  you?: number;
  format: (v: number) => string;
  labels?: [string, string];
};

const ALTO = 72;
// Margen lateral en % para que puntos y etiquetas de los extremos no se recorten.
const X0 = 4;
const X1 = 96;

export function RangeBar({
  min,
  max,
  mid,
  you,
  format,
  labels,
}: RangeBarProps): JSX.Element {
  const minV = typeof min === "number" && Number.isFinite(min) ? min : 0;
  const maxV = typeof max === "number" && Number.isFinite(max) ? max : 0;
  // Valores reales para etiquetas/aria; lo/hi solo para la geometría.
  const minN = Math.min(minV, maxV);
  const maxN = Math.max(minV, maxV);
  let lo = minN;
  let hi = maxN;
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }

  // Posición en % (clamp 0..1: «Tú» fuera del rango queda en el borde).
  const pos = (v: number) => X0 + Math.min(1, Math.max(0, (v - lo) / (hi - lo))) * (X1 - X0);
  // Las etiquetas centradas se acercan al borde sin salirse del SVG.
  const posTexto = (v: number) => Math.min(88, Math.max(12, pos(v)));

  const midV = typeof mid === "number" && Number.isFinite(mid) ? mid : null;
  const youV = typeof you === "number" && Number.isFinite(you) ? you : null;
  // labels[1] también sustituye la etiqueta «Tú» (literal del encargo T03).
  const etiquetaYou = labels?.[1] ?? "Tú";
  const etiquetaIzq = labels?.[0] ?? format(minN);
  const etiquetaDer = labels?.[1] ?? format(maxN);

  const partes = [`Rango de ${format(minN)} a ${format(maxN)}`];
  if (midV !== null) partes.push(`mediana ${format(midV)}`);
  if (youV !== null) partes.push(`${etiquetaYou}: ${format(youV)}`);
  const ariaLabel = partes.join(", ");

  const fuente = { fontVariantNumeric: "tabular-nums" } as const;

  return (
    <svg
      width="100%"
      height={ALTO}
      role="img"
      aria-label={ariaLabel}
      style={{ display: "block", ...fuente }}
    >
      {/* Pista gris de min a max. */}
      <rect x={`${X0}%`} y={37} width={`${X1 - X0}%`} height={4} rx={2} fill={C.line} />
      {/* Banda activa azul al 25% entre los extremos dados. */}
      <rect
        x={`${X0}%`}
        y={28}
        width={`${X1 - X0}%`}
        height={22}
        rx={4}
        fill={C.blue}
        fillOpacity={0.25}
      />
      {/* Marcador de mediana: línea vertical ink 2px + cifra arriba. */}
      {midV !== null ? (
        <>
          <line
            x1={`${pos(midV)}%`}
            y1={24}
            x2={`${pos(midV)}%`}
            y2={54}
            stroke={C.ink}
            strokeWidth={2}
          />
          <text
            x={`${posTexto(midV)}%`}
            y={18}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            fill={C.ink}
            style={fuente}
          >
            {format(midV)}
          </text>
        </>
      ) : null}
      {/* «Tú»: punto amarillo con borde ink + etiqueta debajo. */}
      {youV !== null ? (
        <>
          <circle
            cx={`${pos(youV)}%`}
            cy={39}
            r={5}
            fill={C.yellow}
            stroke={C.ink}
            strokeWidth={1.5}
          />
          <text
            x={`${posTexto(youV)}%`}
            y={66}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            fill={C.ink}
            style={fuente}
          >
            {etiquetaYou}
          </text>
        </>
      ) : null}
      {/* Etiquetas de extremos (12px mute). */}
      <text x={0} y={66} textAnchor="start" fontSize={12} fill={C.mute} style={fuente}>
        {etiquetaIzq}
      </text>
      <text x="100%" y={66} textAnchor="end" fontSize={12} fill={C.mute} style={fuente}>
        {etiquetaDer}
      </text>
    </svg>
  );
}
