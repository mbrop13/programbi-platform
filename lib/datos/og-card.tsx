import type { ReactElement } from "react";

/**
 * Tarjeta OG unificada de /datos (T14).
 * Diseño: 1200×630, fondo #f3f3f0, logo arriba izquierda, badge edición arriba
 * derecha, título ink, cifra grande en #0b63c5, mini-visual (barras/línea/mapa/
 * heatmap) y pie con fuente + urlCorta. Todo con flexbox: ImageResponse (Satori)
 * no soporta grid. Los SVG se serializan a data-URL (sin <text>: Satori no lo
 * soporta); las etiquetas van en divs flex debajo/al lado del visual.
 * Las cifras deben venir SIEMPRE de los JSON oficiales (sin inventar datos).
 */

/** Paleta OG: espejo de components/datos/viz/tokens.ts (sin acoplar el import). */
export const OG_C = {
  bg: "#f3f3f0",
  surface: "#f7f7f4",
  card: "#ffffff",
  ink: "#171716",
  mute: "#5f5e5a",
  line: "#e5e4df",
  blue: "#1890FF",
  blueText: "#0b63c5",
  pillBg: "#e8f3ff",
  scale: ["#e8f3ff", "#b9dcff", "#6fb5ff", "#1890FF", "#0b3d7a"],
} as const;

export { OG_SIZE } from "@/lib/og/assets";

/** Headers immutable para las respuestas OG (las URLs llevan ?v=edicion). */
export const OG_HEADERS: Record<string, string> = {
  "Cache-Control": "public, max-age=31536000, immutable",
};

export interface OgBarra {
  /** Etiqueta corta bajo la barra (nombre de carrera, región, componente…). */
  label: string;
  /** Magnitud que define la altura de la barra. */
  valor: number;
  /** Texto opcional sobre la barra (cifra formateada). */
  valorTexto?: string;
}

export interface OgHeatCelda {
  label: string;
  valor: number;
  valorTexto?: string;
}

export interface OgVisual {
  tipo: "barras" | "linea" | "mapa" | "heatmap";
  /** Leyenda pequeña arriba del visual (unidad/período). */
  caption?: string;
  /** barras: 3–5 columnas con etiqueta. */
  barras?: OgBarra[];
  /** linea: serie numérica (se dibuja polyline + último punto). */
  puntos?: number[];
  /** linea: etiquetas de los extremos (p. ej. meses). */
  extremos?: [string, string];
  /** mapa: paths BCN (components/datos/mapa-paths.json) coloreados por escala. */
  paths?: string[];
  viewBox?: string;
  /** heatmap: fila de celdas coloreadas por escala. */
  celdas?: OgHeatCelda[];
}

export interface OgCardProps {
  titulo: string;
  /** Cifra grande (72–96px) en azul texto #0b63c5. */
  cifra?: string;
  /** Etiqueta pequeña bajo la cifra. */
  cifraLabel?: string;
  subtitulo?: string;
  /** Pill arriba derecha (edición, tipo de institución…). */
  badge?: string;
  miniVisual?: OgVisual;
  logoSrc: string;
  fuente: string;
  urlCorta: string;
}

/** Escala de 5 tonos azules normalizada al rango de los valores. */
function colorEscala(valor: number, min: number, max: number): string {
  const t = max > min ? (valor - min) / (max - min) : 0;
  const idx = Math.min(OG_C.scale.length - 1, Math.max(0, Math.floor(t * OG_C.scale.length)));
  return OG_C.scale[idx];
}

/** Recorta etiquetas largas sin cortar palabras a la mitad cuando se puede. */
function etiquetaCorta(texto: string, max = 26): string {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max - 1);
  const ultimoEspacio = corte.lastIndexOf(" ");
  return `${(ultimoEspacio > max * 0.5 ? corte.slice(0, ultimoEspacio) : corte).trim()}…`;
}

function VisualBarras({ barras }: { barras: OgBarra[] }) {
  const max = Math.max(...barras.map((b) => b.valor), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 26, height: 150 }}>
      {barras.map((b, i) => {
        const altura = Math.max(10, Math.round((b.valor / max) * 104));
        return (
          <div
            key={`${b.label}-${i}`}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 168 }}
          >
            {b.valorTexto ? (
              <div style={{ display: "flex", fontSize: 17, fontWeight: 700, color: OG_C.ink, marginBottom: 6 }}>
                {b.valorTexto}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                width: 112,
                height: altura,
                background: OG_C.blue,
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: OG_C.mute,
                marginTop: 8,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {etiquetaCorta(b.label)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VisualLinea({ puntos, extremos }: { puntos: number[]; extremos?: [string, string] }) {
  const w = 1072;
  const h = 128;
  const pad = 10;
  const min = Math.min(...puntos);
  const max = Math.max(...puntos);
  const rango = max - min || 1;
  const coords = puntos.map((v, i) => {
    const x = pad + (i / Math.max(1, puntos.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / rango) * (h - pad * 2);
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as const;
  });
  const ultimo = coords[coords.length - 1];
  return (
    <div style={{ display: "flex", flexDirection: "column", width: w }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke={OG_C.line} strokeWidth={2} />
        <polyline
          points={coords.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke={OG_C.blue}
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {ultimo ? <circle cx={ultimo[0]} cy={ultimo[1]} r={8} fill={OG_C.blueText} /> : null}
      </svg>
      {extremos ? (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: OG_C.mute, marginTop: 6 }}>
          <span>{extremos[0]}</span>
          <span>{extremos[1]}</span>
        </div>
      ) : null}
    </div>
  );
}

function VisualMapa({ paths, viewBox }: { paths: string[]; viewBox?: string }) {
  const valores = paths.map((_, i) => i);
  const min = 0;
  const max = Math.max(1, paths.length - 1);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      <svg width={72} height={150} viewBox={viewBox ?? "0 0 400 2143"}>
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={colorEscala(valores[i], min, max)}
            fillRule="evenodd"
            stroke={OG_C.card}
            strokeWidth={6}
          />
        ))}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {OG_C.scale.map((tono) => (
            <div key={tono} style={{ display: "flex", width: 26, height: 14, borderRadius: 4, background: tono }} />
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 14, color: OG_C.mute }}>Menor → mayor</div>
      </div>
    </div>
  );
}

function VisualHeatmap({ celdas }: { celdas: OgHeatCelda[] }) {
  const valores = celdas.map((c) => c.valor);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  return (
    <div style={{ display: "flex", gap: 14 }}>
      {celdas.map((c, i) => (
        <div
          key={`${c.label}-${i}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            width: 148,
            height: 118,
            borderRadius: 14,
            background: colorEscala(c.valor, min, max),
            padding: "10px 8px",
          }}
        >
          <div style={{ display: "flex", fontSize: 24, fontWeight: 800, color: OG_C.ink }}>
            {c.valorTexto ?? String(c.valor)}
          </div>
          <div style={{ display: "flex", fontSize: 14, color: OG_C.ink, textAlign: "center", lineHeight: 1.2 }}>
            {etiquetaCorta(c.label, 20)}
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniVisual({ visual }: { visual: OgVisual }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {visual.caption ? (
        <div style={{ display: "flex", fontSize: 15, fontWeight: 600, color: OG_C.mute }}>{visual.caption}</div>
      ) : null}
      {visual.tipo === "barras" && visual.barras && visual.barras.length > 0 ? (
        <VisualBarras barras={visual.barras} />
      ) : null}
      {visual.tipo === "linea" && visual.puntos && visual.puntos.length > 1 ? (
        <VisualLinea puntos={visual.puntos} extremos={visual.extremos} />
      ) : null}
      {visual.tipo === "mapa" && visual.paths && visual.paths.length > 0 ? (
        <VisualMapa paths={visual.paths} viewBox={visual.viewBox} />
      ) : null}
      {visual.tipo === "heatmap" && visual.celdas && visual.celdas.length > 0 ? (
        <VisualHeatmap celdas={visual.celdas} />
      ) : null}
    </div>
  );
}

/** Tarjeta 1200×630 lista para pasar a `new ImageResponse(...)`. */
export function renderOgCard(p: OgCardProps): ReactElement {
  const tituloLargo = p.titulo.length > 56;
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: OG_C.bg,
        color: OG_C.ink,
        padding: "48px 64px 40px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* ImageResponse renderiza fuera del navegador con un logo local. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.logoSrc} alt="ProgramBI" width={180} height={46} style={{ objectFit: "contain" }} />
        {p.badge ? (
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              padding: "8px 18px",
              borderRadius: 999,
              background: OG_C.pillBg,
              color: OG_C.blueText,
            }}
          >
            {p.badge}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            fontSize: tituloLargo ? 44 : 52,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {p.titulo}
        </div>
        {p.cifra ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontSize: 88, fontWeight: 800, color: OG_C.blueText, lineHeight: 1.05 }}>
              {p.cifra}
            </span>
            {p.cifraLabel ? (
              <span style={{ fontSize: 21, color: OG_C.mute, lineHeight: 1.25 }}>{p.cifraLabel}</span>
            ) : null}
          </div>
        ) : null}
        {p.subtitulo ? (
          <div style={{ display: "flex", fontSize: 22, color: OG_C.mute, lineHeight: 1.3 }}>{p.subtitulo}</div>
        ) : null}
      </div>

      {p.miniVisual ? <MiniVisual visual={p.miniVisual} /> : null}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 16,
          color: OG_C.mute,
          borderTop: `1px solid ${OG_C.line}`,
          paddingTop: 16,
        }}
      >
        <span>{p.fuente}</span>
        <span>{p.urlCorta}</span>
      </div>
    </div>
  );
}