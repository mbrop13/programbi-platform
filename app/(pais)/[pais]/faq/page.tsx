import { notFound, permanentRedirect } from "next/navigation";
import { esIsoPais } from "@/config/paises";

/**
 * Versión por país de /faq: redirige a /{pais}/preguntas-frecuentes.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (!esIsoPais(pais)) notFound();
  permanentRedirect(`/${pais}/preguntas-frecuentes`);
}
