import type { Metadata } from "next";
import ListiclePowerBiChile from "@/components/comparativas/ListiclePowerBiChile";
import { RUTA_LISTICLE } from "@/lib/data/comparativas";
import { absoluteUrl, pageOg, tituloLocal } from "@/lib/seo";

export const revalidate = false;

const title = "Mejores cursos de Power BI en Chile 2026";
const description =
  "Revisamos precio, horas en vivo, formato y certificado de 7 cursos de Power BI en Chile: ProgramBI, Coderhouse, Crenn, UC Teleduc, Qualitymas, Platzi e IPS DATAX.";

const share = pageOg({
  title,
  description,
  path: RUTA_LISTICLE,
  kicker: "Cursos de Power BI · Chile",
  tags: ["Power BI", "Chile", "2026"],
  alt: title,
});

export const metadata: Metadata = {
  title: { absolute: tituloLocal(title) },
  description,
  alternates: { canonical: absoluteUrl(RUTA_LISTICLE) },
  openGraph: {
    title,
    description,
    url: absoluteUrl(RUTA_LISTICLE),
    type: "article",
    locale: "es_CL",
    siteName: "ProgramBI",
    images: share.images,
  },
  twitter: share.twitter,
};

export default function MejoresCursosPowerBiChilePage() {
  return <ListiclePowerBiChile />;
}
