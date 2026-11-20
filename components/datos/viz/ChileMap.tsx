// T2 · ChileMap — mapa coroplético de Chile en SVG puro, server-safe.
// Geometría oficial BCN reutilizada de components/datos/mapa-paths.json (NO regenerar).
// Sin "use client", sin hooks, sin dependencias nuevas. Contrato: BRIEF_SUBBOTS § viz.
//
// Escala de 5 pasos (C.scale), documentada:
//  · ≥8 valores no nulos → cortes por cuantiles q20/q40/q60/q80 (interpolación lineal),
//    de modo que cada paso agrupa ~20 % de las regiones.
//  · <8 valores → cortes lineales entre min y max.
//  · min === max → sin variación: todo en el paso central (2) y leyenda de un solo valor.
//  · null/undefined/no finito → fill C.line («Sin dato»).
//
// Orientación horizontal (Chile acostado, norte a la izquierda):
//   viewBox "0 0 2143 400" + transform="translate(871.5 -871.5) rotate(-90 200 1071.5)".
//   Matemática: rotate(-90) alrededor del centro (200, 1071.5) del viewBox original
//   mapea (x, y) → (y − 871.5, 1271.5 − x). La caja 400×2143 cae exacta en
//   (0,0)–(2143,400) tras el translate; el norte (y chica) queda a la izquierda.
//   El aspect-ratio del SVG reserva la altura exacta en ambos sentidos (sin CLS).

import type { CSSProperties, ReactElement } from "react";
import mapa from "@/components/datos/mapa-paths.json";
import { C } from "./tokens";

export type RegionKey =
  | "arica-y-parinacota"
  | "tarapaca"
  | "antofagasta"
  | "atacama"
  | "coquimbo"
  | "valparaiso"
  | "metropolitana"
  | "ohiggins"
  | "maule"
  | "nuble"
  | "biobio"
  | "araucania"
  | "los-rios"
  | "los-lagos"
  | "aysen"
  | "magallanes";

/** Orden geográfico fijo norte → sur (el de la geometría BCN). */
const ORDEN: readonly RegionKey[] = [
  "arica-y-parinacota",
  "tarapaca",
  "antofagasta",
  "atacama",
  "coquimbo",
  "valparaiso",
  "metropolitana",
  "ohiggins",
  "maule",
  "nuble",
  "biobio",
  "araucania",
  "los-rios",
  "los-lagos",
  "aysen",
  "magallanes",
];

/** Nombres legibles para tooltips, enlaces y alternativa textual. */
const NOMBRES: Record<RegionKey, string> = {
  "arica-y-parinacota": "Arica y Parinacota",
  tarapaca: "Tarapacá",
  antofagasta: "Antofagasta",
  atacama: "Atacama",
  coquimbo: "Coquimbo",
  valparaiso: "Valparaíso",
  metropolitana: "Metropolitana",
  ohiggins: "O'Higgins",
  maule: "Maule",
  nuble: "Ñuble",
  biobio: "Biobío",
  araucania: "Araucanía",
  "los-rios": "Los Ríos",
  "los-lagos": "Los Lagos",
  aysen: "Aysén",
  magallanes: "Magallanes",
};

type Props = {
  values: Partial<Record<RegionKey, number | null>>;
  format: (v: number) => string;
  highlight?: RegionKey;
  hrefFor?: (r: RegionKey) => string;
  legendLabel: string;
  orientation?: "vertical" | "horizontal";
  size?: "mini" | "md" | "lg";
  ariaLabel: string;
  hatched?: RegionKey[];
};

/** Anchos CSS por tamaño; el alto sale del viewBox (aspect-ratio, sin CLS). */
const ANCHO: Record<NonNullable<Props["size"]>, number> = { mini: 140, md: 280, lg: 460 };

// Dimensiones del viewBox BCN original (leídas del JSON, no inventadas).
const PARTES_VB = mapa.viewBox.split(/\s+/).map(Number);
const VB_W = PARTES_VB[2] ?? 400;
const VB_H = PARTES_VB[3] ?? 2143;
const CX = VB_W / 2;
const CY = VB_H / 2;
const TRANSFORM_HORIZONTAL = `translate(${(VB_H - VB_W) / 2} ${(VB_W - VB_H) / 2}) rotate(-90 ${CX} ${CY})`;

const PATHS = mapa.paths as Record<string, string | undefined>;

type Escala = {
  cortes: [number, number, number, number];
  min: number;
  max: number;
  degenerada: boolean;
  paso: (v: number) => number;
};

function calcularEscala(valores: number[]): Escala {
  const ordenados = [...valores].sort((a, b) => a - b);
  const n = ordenados.length;
  const min = ordenados[0];
  const max = ordenados[n - 1];
  if (min === max) {
    // Sin variación: paso central para todo, leyenda de un solo valor.
    return { cortes: [min, min, min, min], min, max, degenerada: true, paso: () => 2 };
  }
  const fracciones = [0.2, 0.4, 0.6, 0.8];
  const cortes = fracciones.map((f) => {
    if (n >= 8) {
      // Cuantil interpolado linealmente sobre los valores ordenados.
      const pos = f * (n - 1);
      const base = Math.floor(pos);
      const resto = pos - base;
      const siguiente = ordenados[Math.min(base + 1, n - 1)];
      return ordenados[base] + (siguiente - ordenados[base]) * resto;
    }
    return min + (max - min) * f;
  }) as [number, number, number, number];
  const paso = (v: number) => {
    let i = 0;
    while (i < cortes.length && v >= cortes[i]) i++;
    return i; // 0..4 → C.scale[i]
  };
  return { cortes, min, max, degenerada: false, paso };
}

/** Centroide de vértices de una región. Los paths BCN solo usan M/L/Z absolutos
 * (verificado), así que promediar los pares de coordenadas es seguro. */
function centroide(d: string): { x: number; y: number } | null {
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (const tramo of d.split("Z")) {
    const idx = tramo.indexOf("M");
    if (idx === -1) continue;
    const nums = tramo.slice(idx + 1).match(/-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/g);
    if (!nums || nums.length < 2) continue;
    for (let i = 0; i + 1 < nums.length; i += 2) {
      sx += Number(nums[i]);
      sy += Number(nums[i + 1]);
      n++;
    }
  }
  return n > 0 ? { x: sx / n, y: sy / n } : null;
}

/** Id determinista (SSR = cliente, sin hooks) para pattern y estilos scoped. */
function hashId(semilla: string): string {
  let h = 5381;
  for (let i = 0; i < semilla.length; i++) h = ((h << 5) + h + semilla.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

const ESTILO_SR_ONLY: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export function ChileMap({
  values,
  format,
  highlight,
  hrefFor,
  legendLabel,
  orientation = "vertical",
  size = "md",
  ariaLabel,
  hatched,
}: Props): ReactElement {
  const horizontal = orientation === "horizontal";
  const hatchedSet = new Set<RegionKey>(hatched ?? []);

  // Valores válidos (finitos) en orden geográfico.
  const nums: number[] = [];
  for (const r of ORDEN) {
    const v = values[r];
    if (typeof v === "number" && Number.isFinite(v)) nums.push(v);
  }
  const escala = nums.length > 0 ? calcularEscala(nums) : null;
  const haySinDato = ORDEN.some((r) => {
    const v = values[r];
    return !(typeof v === "number" && Number.isFinite(v));
  });

  const clase = `chilemap-${hashId(
    `${ariaLabel}|${size}|${orientation}|${highlight ?? ""}|${hatched?.join(",") ?? ""}|${nums.join(",")}`,
  )}`;
  const patron = `${clase}-hatch`;

  const valorTexto = (r: RegionKey): string => {
    const v = values[r];
    return typeof v === "number" && Number.isFinite(v) ? format(v) : "sin dato";
  };

  // Regiones: <a> navegable por teclado si hay hrefFor; si no, paths sueltos.
  const regiones = ORDEN.map((r) => {
    const d = PATHS[r];
    if (!d) return null;
    const v = values[r];
    const fill =
      typeof v === "number" && Number.isFinite(v) && escala ? C.scale[escala.paso(v)] : C.line;
    const opacidad = highlight && highlight !== r ? 0.85 : 1;
    const nombre = NOMBRES[r];
    const titulo = `${nombre}: ${valorTexto(r)}`;
    const path = (
      <path
        className="chilemap-region"
        d={d}
        fill={fill}
        fillRule="evenodd"
        stroke="#fff"
        strokeWidth={1.5}
        opacity={opacidad}
      />
    );
    const hatch = hatchedSet.has(r) ? (
      <path d={d} fill={`url(#${patron})`} fillRule="evenodd" opacity={opacidad} pointerEvents="none" />
    ) : null;
    if (hrefFor) {
      return (
        <a key={r} href={hrefFor(r)} aria-label={titulo}>
          <title>{titulo}</title>
          {path}
          {hatch}
        </a>
      );
    }
    return (
      <g key={r}>
        {path}
        {hatch}
      </g>
    );
  });

  // Highlight: trazo ink encima de todas las regiones (overlay, no altera el
  // orden DOM de navegación) + punto amarillo puntual en el centroide.
  const dHighlight = highlight ? PATHS[highlight] : undefined;
  const centro = dHighlight ? centroide(dHighlight) : null;
  const overlay = dHighlight ? (
    <>
      <path d={dHighlight} fill="none" stroke={C.ink} strokeWidth={3} pointerEvents="none" />
      {centro ? (
        <circle cx={centro.x} cy={centro.y} r={10} fill={C.yellow} stroke={C.ink} strokeWidth={1.5} pointerEvents="none" />
      ) : null}
    </>
  ) : null;

  // Leyenda de 5 pasos bajo el mapa.
  const etiquetaPaso = (i: number): string => {
    if (!escala) return "";
    if (i === 0) return `< ${format(escala.cortes[0])}`;
    if (i === 4) return `≥ ${format(escala.cortes[3])}`;
    return `${format(escala.cortes[i - 1])}–${format(escala.cortes[i])}`;
  };
  const cuadradito = (fondo: string, borde: string): CSSProperties => ({
    width: 10,
    height: 10,
    flexShrink: 0,
    borderRadius: 2,
    background: fondo,
    border: `1px solid ${borde}`,
  });
  const itemLeyenda = (key: string, swatch: CSSProperties, label: string): ReactElement => (
    <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span aria-hidden="true" style={swatch} />
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{label}</span>
    </span>
  );
  const itemsLeyenda: ReactElement[] = [];
  if (escala) {
    if (escala.degenerada) {
      itemsLeyenda.push(itemLeyenda("unico", cuadradito(C.scale[2], C.line), format(escala.min)));
    } else {
      for (let i = 0; i < 5; i++) {
        itemsLeyenda.push(itemLeyenda(`paso-${i}`, cuadradito(C.scale[i], C.line), etiquetaPaso(i)));
      }
    }
  }
  if (haySinDato) {
    itemsLeyenda.push(itemLeyenda("sin-dato", cuadradito(C.line, C.mute), "Sin dato"));
  }
  if (hatchedSet.size > 0) {
    itemsLeyenda.push(
      itemLeyenda(
        "hatch",
        {
          ...cuadradito(C.scale[2], C.line),
          background: `repeating-linear-gradient(45deg, ${C.ink}66 0px, ${C.ink}66 1.5px, transparent 1.5px, transparent 5px), ${C.scale[2]}`,
        },
        "estimación poco fiable",
      ),
    );
  }
  if (highlight) {
    itemsLeyenda.push(
      itemLeyenda(
        "highlight",
        { width: 10, height: 10, flexShrink: 0, borderRadius: "50%", background: C.yellow, border: `1px solid ${C.ink}` },
        NOMBRES[highlight],
      ),
    );
  }

  const svg = (
    <svg
      viewBox={horizontal ? `0 0 ${VB_H} ${VB_W}` : mapa.viewBox}
      role={hrefFor ? "group" : "img"}
      aria-label={ariaLabel}
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        aspectRatio: horizontal ? `${VB_H} / ${VB_W}` : `${VB_W} / ${VB_H}`,
        overflow: "visible",
      }}
    >
      {hatchedSet.size > 0 ? (
        <defs>
          <pattern id={patron} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1={0} y1={0} x2={0} y2={8} stroke={C.ink} strokeWidth={2} opacity={0.45} />
          </pattern>
        </defs>
      ) : null}
      <g transform={horizontal ? TRANSFORM_HORIZONTAL : undefined}>
        {regiones}
        {overlay}
      </g>
    </svg>
  );

  return (
    <figure className={clase} style={{ margin: 0, width: ANCHO[size], maxWidth: "100%", color: C.ink }}>
      {svg}
      <figcaption
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "6px 12px",
          marginTop: 8,
          fontSize: 12,
          lineHeight: 1.4,
          color: C.mute,
        }}
      >
        <span style={{ fontWeight: 600, color: C.ink }}>{legendLabel}</span>
        {itemsLeyenda}
      </figcaption>
      {/* Alternativa textual para lectores de pantalla (className + estilos inline
          de respaldo, para no depender de que la utility exista en el build). */}
      <ul className="sr-only" style={ESTILO_SR_ONLY} aria-label="Valores por región">
        {ORDEN.map((r) => (
          <li key={r}>
            {NOMBRES[r]}: {valorTexto(r)}
            {hatchedSet.has(r) ? ", estimación poco fiable" : ""}
          </li>
        ))}
      </ul>
      {hrefFor ? (
        <style>{
          `.${clase} a{cursor:pointer}` +
          `.${clase} a:focus-visible{outline:3px solid ${C.blueText};outline-offset:2px}` +
          `.${clase} a:hover .chilemap-region{stroke:${C.ink};stroke-width:3}`
        }</style>
      ) : null}
    </figure>
  );
}