export const RECURSO_PLANTILLA_VENTAS = "plantilla-ventas-powerbi";
export const ARCHIVO_PLANTILLA_VENTAS = "/plantillas/plantilla-ventas-powerbi.csv";
export const NOMBRE_PLANTILLA_VENTAS = "plantilla-ventas-powerbi.csv";

const RECURSOS_PERMITIDOS = new Set<string>([RECURSO_PLANTILLA_VENTAS]);

export function esRecursoLeadMagnet(recurso: string): boolean {
  return RECURSOS_PERMITIDOS.has(recurso);
}
