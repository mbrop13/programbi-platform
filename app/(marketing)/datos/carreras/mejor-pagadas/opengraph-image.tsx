import { renderPresetOgImage } from "@/lib/datos/preset-og";

export const alt = "Carreras mejor pagadas en Chile: U, IP y CFT | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderPresetOgImage("mejor-pagadas");
}
