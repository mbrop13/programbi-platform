import { renderPresetOgImage } from "@/lib/datos/preset-og";

export const dynamic = "force-static";
export const alt = "Carreras con mejor sueldo por arancel en Chile | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderPresetOgImage("mejor-sueldo-por-arancel");
}
