import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Carga el logo principal de ProgramBI como data URL para ImageResponse */
export async function loadLogoDataUrl(): Promise<string> {
  const logoPath = join(process.cwd(), "public", "logo.png");
  const logoData = await readFile(logoPath);
  return `data:image/png;base64,${logoData.toString("base64")}`;
}

/** Descarga una imagen remota y la devuelve como data URL */
export async function loadRemoteImageDataUrl(url: string): Promise<string> {
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "image/png";
  return `data:${contentType};base64,${buf.toString("base64")}`;
}

export const OG_SIZE = { width: 1200, height: 630 } as const;
