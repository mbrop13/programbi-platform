import { notFound } from "next/navigation";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { paramsCarpeta } from "@/lib/paises/rutas";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return paramsCarpeta();
}

export default async function PaisLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) notFound();
  return children;
}
