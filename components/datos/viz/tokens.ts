/**
 * Tokens de color del sistema de visualización de /datos (contrato viz).
 * Paleta fija del encargo: azul #1890FF solo para gráficos (barras/líneas),
 * #0b63c5 para texto/enlaces (contraste AA); verde/rojo solo en deltas.
 */
export const C = {
  bg: "#f3f3f0",
  surface: "#f7f7f4",
  card: "#ffffff",
  ink: "#171716",
  mute: "#5f5e5a",
  line: "#e5e4df",
  blue: "#1890FF",
  blueText: "#0b63c5",
  yellow: "#f2c811",
  up: "#0f7b4a",
  down: "#c2410c",
  scale: ["#e8f3ff", "#b9dcff", "#6fb5ff", "#1890FF", "#0b3d7a"],
} as const;

/** Dirección de un delta (variación) para KPIs y badges. */
export type DeltaDir = "up" | "down" | "flat";
