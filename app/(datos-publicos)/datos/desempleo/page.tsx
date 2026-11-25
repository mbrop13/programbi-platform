import { Observatorio } from "@/components/datos/Observatorio";
import { NACIONAL } from "@/lib/datos/regiones";
import { metaObservatorio } from "@/lib/datos/seo";
import { hreflangDatosDe } from "@/lib/seo/datos-hreflang";

export const dynamic = "force-static";

const baseMetadata = metaObservatorio(NACIONAL, "Chile");
const languages = hreflangDatosDe("/datos/desempleo");

export const metadata = languages
  ? {
      ...baseMetadata,
      alternates: {
        ...baseMetadata.alternates,
        languages,
      },
    }
  : baseMetadata;

export default function DesempleoChilePage() {
  return <Observatorio slug={NACIONAL} />;
}
