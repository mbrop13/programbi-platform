import { NextResponse } from "next/server";
import { cabecerasLlms, construirLlmsTxt } from "@/lib/llms/contenido";

/**
 * /llms.txt — resumen del sitio para asistentes de IA.
 *
 * El contenido vive en `lib/llms/contenido.ts`: los precios, horarios y
 * cantidades salen de `config/` y `lib/data/`, nunca de este archivo. La
 * versión extendida se publica en `/llms-full.txt`.
 */
export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return new NextResponse(construirLlmsTxt(), { headers: cabecerasLlms() });
}
