import type { Metadata } from "next";
import { normalizarPais } from "@/config/paises";
import FaqContenido from "@/components/faq/FaqContenido";
import { faqDePais } from "@/lib/faq/contenido";
import { absoluteUrl, pageOg, tituloSeo } from "@/lib/seo";
import { hreflangDe } from "@/lib/paises/rutas";

/**
 * Preguntas frecuentes. La misma página sirve a Chile (raíz) y a cada país
 * (carpeta): el contenido se arma con `faqDePais()` y el TSX es uno solo.
 */
export const revalidate = 86400;

const PATH = "/preguntas-frecuentes";
const TITLE = tituloSeo("Preguntas frecuentes: cursos, clases y pagos");
const DESCRIPTION =
  "Respuestas sobre cursos de ProgramBI: clases en vivo por Zoom, campus virtual, horarios por país, precios en moneda local, cuotas y certificado.";

const share = pageOg({
  title: TITLE,
  description: DESCRIPTION,
  path: "preguntas-frecuentes",
  kicker: "Preguntas frecuentes",
  tags: ["Clases en vivo", "Pagos", "Certificado"],
});

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: absoluteUrl(PATH),
    // Recíproco con las versiones de Argentina, México, Perú, Colombia y Uruguay.
    languages: hreflangDe(PATH),
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    type: "website",
    images: share.images,
  },
  twitter: share.twitter,
};

export default async function PreguntasFrecuentesPage({
  params,
}: {
  params: Promise<{ pais?: string }>;
}) {
  const iso = normalizarPais((await params).pais);
  return <FaqContenido contenido={faqDePais(iso)} />;
}
