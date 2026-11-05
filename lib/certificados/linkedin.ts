import { absoluteUrl } from "@/lib/seo";
import { partesFechaEmision } from "./fecha";

/**
 * URL oficial de "Add to Profile" de LinkedIn para certificaciones.
 * https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME
 *
 * No se envía `organizationId` porque no hay un ID numérico de la página de
 * empresa verificado en el repo; `organizationName` es el campo aceptado para
 * mostrar el nombre del emisor.
 */
export function urlCertificadoLinkedIn(datos: {
  curso: string;
  codigo: string;
  emitidoEn: string | null;
}): string {
  const params = new URLSearchParams();
  params.set("startTask", "CERTIFICATION_NAME");
  params.set("name", datos.curso);
  params.set("organizationName", "ProgramBI");

  const fecha = partesFechaEmision(datos.emitidoEn);
  if (fecha) {
    params.set("issueYear", String(fecha.anio));
    params.set("issueMonth", String(fecha.mes));
  }

  params.set("certUrl", absoluteUrl(`/certificado/${encodeURIComponent(datos.codigo)}`));
  params.set("certId", datos.codigo);

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}
