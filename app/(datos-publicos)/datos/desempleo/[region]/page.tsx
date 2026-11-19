import { notFound } from "next/navigation";
import { Observatorio } from "@/components/datos/Observatorio";
import { regionesPublicables } from "@/lib/datos/desempleo";
import { buscarRegion } from "@/lib/datos/regiones";
import { metaObservatorio } from "@/lib/datos/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return regionesPublicables().map(({ slug }) => ({ region: slug }));
}

type Props = { params: Promise<{ region: string }> };

export async function generateMetadata({ params }: Props) {
  const { region } = await params;
  const entrada = buscarRegion(region);
  if (!entrada) notFound();
  return metaObservatorio(entrada.slug, entrada.nombre);
}

export default async function DesempleoRegionPage({ params }: Props) {
  const { region } = await params;
  return <Observatorio slug={region} />;
}
