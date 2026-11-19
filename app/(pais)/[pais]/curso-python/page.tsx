import { notFound, permanentRedirect } from "next/navigation";
import { esIsoPais } from "@/config/paises";

/**
 * Versión por país de /curso-python: redirige a la ficha canónica local
 * (p. ej. /mx/curso-python → /mx/cursos/python).
 */
export default async function Page({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (!esIsoPais(pais)) notFound();
  permanentRedirect(`/${pais}/cursos/python`);
}
