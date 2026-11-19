import { renderPresetOgImage } from "@/lib/datos/preset-og";

export const alt = "Carreras que más crecieron en sueldo real en Chile | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderPresetOgImage("crecieron-en-sueldo-real");
}
