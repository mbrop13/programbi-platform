import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CertificadoPublico from "@/components/certificado/CertificadoPublico";
import { esCodigoCertificadoValido } from "@/lib/certificados/codigo";
import { obtenerCertificadoPorCodigo } from "@/lib/certificados/consulta";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

type Props = { params: Promise<{ codigo: string }> };

/**
 * Render dinámico: cada código se valida contra la base en el momento. Un
 * certificado recién emitido se verifica al instante y un código inexistente
 * responde 404 real, sin generar ni cachear páginas basura.
 */
export const dynamic = "force-dynamic";

/**
 * No se indexa la ficha: contiene el nombre de una persona real y un espacio de
 * URLs ilimitado (cualquier código). El punto de entrada indexable es
 * /verificar-certificado. `follow: true` permite que los enlaces sigan siendo
 * rastreables sin exponer la ficha en resultados de búsqueda.
 */
export const metadata: Metadata = {
  title: { absolute: "Certificado verificado | ProgramBI" },
  description:
    "Comprueba la autenticidad de un certificado emitido por ProgramBI y consulta el curso, la fecha de emisión y el código de validación.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Certificado verificado | ProgramBI",
    description:
      "Comprueba la autenticidad de un certificado emitido por ProgramBI y consulta el curso, la fecha de emisión y el código de validación.",
    type: "website",
    locale: "es_CL",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function CertificadoPage({ params }: Props) {
  const { codigo } = await params;

  // Formato inválido: 404 sin tocar la base de datos.
  if (!esCodigoCertificadoValido(codigo)) notFound();

  const certificado = await obtenerCertificadoPorCodigo(codigo);
  if (!certificado) notFound();

  return <CertificadoPublico certificado={certificado} />;
}
