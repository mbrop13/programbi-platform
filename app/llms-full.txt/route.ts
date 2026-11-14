import { NextResponse } from "next/server";
import { cabecerasLlms, construirLlmsFullTxt } from "@/lib/llms/contenido";

/**
 * /llms-full.txt — versión extendida para asistentes de IA.
 *
 * Incluye todos los cursos (1 y 2 niveles), tablas de precios públicos
 * «Desde <precio>» por país y por curso en moneda local (descuentos y fechas
 * en el PDF de temario), todas las guías publicadas, las comparativas,
 * credenciales E-E-A-T, preguntas frecuentes y políticas. Misma fuente de
 * datos que `/llms.txt`: `config/` y `lib/data/`.
 */
export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return new NextResponse(construirLlmsFullTxt(), { headers: cabecerasLlms() });
}
