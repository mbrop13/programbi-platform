/**
 * Construye la URL del endpoint dinámico de imágenes OG (/api/og)
 * para usarla en `metadata.openGraph.images` de cualquier página.
 */

export interface OgUrlOptions {
  title: string;
  kicker?: string;
  description?: string;
  tags?: string[];
  /** Ruta relativa, p. ej. "cursos/power-bi" */
  path?: string;
  theme?: "paper" | "ink";
  /** Hex (#RRGGBB) */
  accent?: string;
  /** Punto verde del kicker — solo certificados/verificación. */
  verified?: boolean;
}

export function ogImageUrl(opts: OgUrlOptions): string {
  const params = new URLSearchParams();
  params.set("t", opts.title);
  if (opts.kicker) params.set("k", opts.kicker);
  if (opts.description) params.set("d", opts.description);
  if (opts.tags && opts.tags.length > 0) params.set("tags", opts.tags.slice(0, 4).join(","));
  if (opts.path) params.set("p", opts.path.replace(/^\//, ""));
  if (opts.theme === "ink") params.set("theme", "ink");
  if (opts.accent && /^#[0-9a-fA-F]{6}$/.test(opts.accent)) params.set("accent", opts.accent);
  if (opts.verified) params.set("v", "1");
  return `/api/og?${params.toString()}`;
}
