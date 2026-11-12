import { NextResponse } from "next/server";
import { cabecerasLlms, construirLlmsFullTxt } from "@/lib/llms/contenido";

/**
 * /llms-full.txt — versión extendida para asistentes de IA.
 *
 * Incluye todos los cursos, la tabla de precios por país y por curso, todas
 * las guías publicadas, las comparativas, una selección de preguntas
 * frecuentes y las políticas. Misma fuente de datos que `/llms.txt`:
 * `config/` y `lib/data/`.
 */
export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return new NextResponse(construirLlmsFullTxt(), { headers: cabecerasLlms() });
}
