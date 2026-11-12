import type { Metadata } from "next";
import { normalizarPais } from "@/config/paises";
import FaqContenido from "@/components/faq/FaqContenido";
import { faqDePais } from "@/lib/faq/contenido";
import { absoluteUrl, tituloSeo, twitterShare } from "@/lib/seo";
import { hreflangDe } from "@/lib/paises/rutas";

/**
 * Preguntas frecuentes. La misma página sirve a Chile (raíz) y a cada país
 * (carpeta): el contenido se arma con `faqDePais()` y el TSX es uno solo.
 */
export const revalidate = 86400;

const PATH = "/preguntas-frecuentes";
const TITLE = tituloSeo("Preguntas frecuentes: cursos, clases y pagos");
const DESCRIPTION =
  "Respuestas sobre los cursos de ProgramBI: clases en vivo por Zoom, grabaciones de por vida, horarios por país, precios en moneda local, cuotas, requisitos y certificado.";

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
  },
  twitter: twitterShare(TITLE, DESCRIPTION),
};

export default async function PreguntasFrecuentesPage({
  params,
}: {
  params: Promise<{ pais?: string }>;
}) {
  const iso = normalizarPais((await params).pais);
  return <FaqContenido contenido={faqDePais(iso)} />;
}
