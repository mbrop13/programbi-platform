/**
 * Sistema de diseño editorial «ProgramBI Paper & Ink Atelier».
 *
 * Unificado con la identidad visual principal de ProgramBI 2.0:
 * papel cálido/blanco nítido, tinta obsidiana (#171716), acentos técnicos
 * en tipografía mono, filetes de 1px y calibración automática WCAG del color
 * de acento por curso para garantizar contraste legible en los 13 programas.
 *
 * Módulo puro (sin React): compartido por hojas A4, visor web y motor PDF.
 */

export const T = {
  paper: "#FFFFFF",
  paperWarm: "#FAFAF8",
  canvas: "#EAE8E2",
  studioBg: "#F3F3F0",
  wash: "#F5F4F0",
  obsidian: "#171716",
  obsidianSoft: "#262624",
  ink: "#171716",
  inkSoft: "#3E3D39",
  mute: "#686660",
  line: "#E3E1DA",
  lineStrong: "#CCC9BF",
  brand: "#1890FF",
  brandSoft: "#EFF6FF",
  ok: "#0E7A4D",
  okSoft: "#ECF8F2",
  whatsapp: "#128C4A",
  certNavy: "#0F2C59",
  certGold: "#C5A059",
} as const;

export const FONT_SANS =
  'var(--font-sans), "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
export const FONT_MONO =
  'var(--font-mono), "Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
export const FONT_DISPLAY = FONT_SANS;
export const FONT_CERT =
  'var(--font-dancing), "Dancing Script", Georgia, "Times New Roman", serif';

/** Hoja A4 a 96 dpi (210 × 297 mm) y retícula editorial de 12 columnas. */
export const A4 = { w: 794, h: 1123, margin: 48, gutter: 20, cols: 12 } as const;

export const SPACE = [4, 8, 12, 16, 24, 32, 48, 64] as const;

export const TYPE = {
  hero: { size: 46, line: 1.03, weight: 700, family: "display" },
  h1: { size: 30, line: 1.12, weight: 700, family: "display" },
  h2: { size: 18, line: 1.25, weight: 700, family: "sans" },
  body: { size: 13, line: 1.52, weight: 400, family: "sans" },
  small: { size: 11.5, line: 1.45, weight: 400, family: "sans" },
  kicker: {
    size: 11,
    line: 1.2,
    weight: 600,
    family: "mono",
    tracking: "0.14em",
    upper: true,
  },
  price: { size: 54, line: 0.98, weight: 700, family: "sans" },
} as const;

const HEX_6 = /^#[0-9a-fA-F]{6}$/;

function parseHex(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${clamp(r)}${clamp(g)}${clamp(b)}`;
}

/** Luminancia relativa sRGB (0 = negro, 1 = blanco). */
export function luminance(hex: string): number {
  const [r, g, b] = parseHex(accentOf(hex)).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Acento del curso validado (`#RRGGBB`). */
export function accentOf(hex: string | null | undefined): string {
  if (typeof hex !== "string") return T.brand;
  const valor = hex.trim();
  return HEX_6.test(valor) ? valor : T.brand;
}

/** Mezcla `hex` hacia negro (`#171716`) para obtener contraste AA sobre papel blanco. */
export function accentInk(hex: string | null | undefined): string {
  const base = accentOf(hex);
  const L = luminance(base);
  if (L <= 0.22) return base;
  const [r, g, b] = parseHex(base);
  // Cuanto más luminoso el acento (ej. #F2C811 Power BI), más se profundiza sobre blanco.
  const mix = L > 0.45 ? 0.56 : 0.34;
  return toHex(
    r * (1 - mix) + 23 * mix,
    g * (1 - mix) + 23 * mix,
    b * (1 - mix) + 22 * mix
  );
}

/** Color de texto óptimo encima de un fondo sólido `hex` (botones/chips). */
export function contrastOn(hex: string | null | undefined): string {
  return luminance(accentOf(hex)) > 0.36 ? T.obsidian : "#FFFFFF";
}

/** Tinta suave para detalles en fondos oscuros: mantiene el tono vibrante original o aclarado leve. */
export function accentOnDark(hex: string | null | undefined): string {
  const base = accentOf(hex);
  const L = luminance(base);
  if (L >= 0.16) return base;
  const [r, g, b] = parseHex(base);
  return toHex(
    r + (255 - r) * 0.45,
    g + (255 - g) * 0.45,
    b + (255 - b) * 0.45
  );
}

/** Fondo suave del acento: `rgba(r,g,b,alpha)`. */
export function tint(hex: string | null | undefined, alpha: number): string {
  const [r, g, b] = parseHex(accentOf(hex));
  const a = Number.isFinite(alpha) ? Math.min(1, Math.max(0, alpha)) : 0;
  return `rgba(${r},${g},${b},${Number(a.toFixed(3))})`;
}

export const RADIUS = { card: 8, chip: 4, image: 6 } as const;

export const SHADOW_SHEET =
  "0 1px 2px rgba(23,23,22,.05), 0 14px 34px rgba(23,23,22,.08)";
