import { Observatorio } from "@/components/datos/Observatorio";
import { NACIONAL } from "@/lib/datos/regiones";
import { metaObservatorio } from "@/lib/datos/seo";

export const dynamic = "force-static";
export const metadata = metaObservatorio(NACIONAL, "Chile");

export default function DesempleoChilePage() {
  return <Observatorio slug={NACIONAL} />;
}
