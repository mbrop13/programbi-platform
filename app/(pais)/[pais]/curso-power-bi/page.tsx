import { notFound, permanentRedirect } from "next/navigation";
import { esIsoPais } from "@/config/paises";

/**
 * Versión por país de la landing Power BI: misma decisión que la raíz, pero
 * conservando el mercado en el destino (/co/curso-power-bi → /co/cursos/power-bi).
 *
 * El layout de (pais) ya limita `dynamicParams` a las carpetas publicadas.
 * La regla 301 por país (12 mercados indexables) se entrega a WS2 para
 * vercel.json/next.config.ts; este redirect cubre el resto de los países y los
 * entornos sin configuración.
 */
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (!esIsoPais(pais)) notFound();
  permanentRedirect(`/${pais}/cursos/power-bi`);
}
