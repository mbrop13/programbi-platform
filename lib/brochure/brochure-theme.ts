/**
 * Sistema de diseño «Temario y precios» — tokens comunes a todas las hojas A4.
 *
 * Tema CLARO y único para todos los cursos: papel blanco, mucho aire, hairlines
 * en vez de cajas, y un solo acento por curso usado únicamente en detalles
 * (filete superior, numeración, chips, barras). Nada de paneles oscuros.
 *
 * Este módulo es puro (sin React, sin "use client"): lo importan tanto las
 * hojas que captura `html-to-image` como la vista del visor y el PDF.
 * Todos los valores se aplican con `style` inline; no depende de Tailwind.
 */

export const T = {
  paper: "#FFFFFF", // hoja
  canvas: "#F3F2EE", // fondo del visor/estudio (claro, igual para todos)
  wash: "#F7F6F2", // paneles suaves
  ink: "#14161B", // texto principal
  inkSoft: "#3B3F49", // texto secundario fuerte
  mute: "#6B6F78", // texto apagado
  line: "#E5E2DA", // bordes/hairlines
  brand: "#1D4ED8", // azul ProgramBI (CTA, links)
  brandSoft: "#EAF0FF", // fondo de chips/highlights
  ok: "#0F7B4A", // checks
  whatsapp: "#128C4A", // botón WhatsApp
} as const;

export const FONT_SANS =
  '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
export const FONT_DISPLAY = 'Georgia, "Times New Roman", serif';

/** Hoja A4 a 96 dpi (210 × 297 mm) y su grilla editorial. */
export const A4 = { w: 794, h: 1123, margin: 56, gutter: 24, cols: 12 } as const; // grilla 12 col, margen 56 px (~14 mm)

/** Escala de espaciado en px (índice = paso). */
export const SPACE = [4, 8, 12, 16, 24, 32, 48, 64] as const;

/**
 * Escala tipográfica. `family: "display"` usa Georgia (números y títulos),
 * `family: "sans"` la pila de sistema. `tracking` y `upper` solo aplican a
 * los kickers (mayúsculas espaciadas).
 */
export const TYPE = {
  hero: { size: 54, line: 1.04, weight: 700, family: "display" }, // título de portada
  h1: { size: 34, line: 1.1, weight: 700, family: "display" }, // título de hoja
  h2: { size: 20, line: 1.25, weight: 700, family: "sans" },
  body: { size: 13.5, line: 1.55, weight: 400, family: "sans" },
  small: { size: 11.5, line: 1.45, weight: 400, family: "sans" },
  kicker: {
    size: 10.5,
    line: 1.2,
    weight: 700,
    family: "sans",
    tracking: "0.16em",
    upper: true,
  },
  price: { size: 64, line: 1, weight: 700, family: "display" },
} as const;

const HEX_6 = /^#[0-9a-fA-F]{6}$/;

/**
 * Acento del curso, validado. Si el valor no es un `#RRGGBB` válido (por
 * ejemplo, `null`, vacío o un color con nombre) devuelve el azul de marca.
 */
export function accentOf(hex: string | null | undefined): string {
  if (typeof hex !== "string") return T.brand;
  const valor = hex.trim();
  return HEX_6.test(valor) ? valor : T.brand;
}

/**
 * Fondo suave del acento: `rgba(r,g,b,alpha)`. Acepta cualquier alfa y lo
 * acota a [0, 1]; si el color no es válido usa el acento de marca.
 */
export function tint(hex: string | null | undefined, alpha: number): string {
  const base = accentOf(hex);
  const r = parseInt(base.slice(1, 3), 16);
  const g = parseInt(base.slice(3, 5), 16);
  const b = parseInt(base.slice(5, 7), 16);
  const a = Number.isFinite(alpha) ? Math.min(1, Math.max(0, alpha)) : 0;
  return `rgba(${r},${g},${b},${Number(a.toFixed(3))})`;
}

export const RADIUS = { card: 14, chip: 999, image: 12 } as const;

/** Sombra de la hoja sobre el canvas claro. */
export const SHADOW_SHEET =
  "0 1px 2px rgba(20,22,27,.06), 0 12px 32px rgba(20,22,27,.08)";
