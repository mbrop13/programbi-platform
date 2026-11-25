export const RECURSO_PLANTILLA_VENTAS = "plantilla-ventas-powerbi";
export const ARCHIVO_PLANTILLA_VENTAS = "/plantillas/plantilla-ventas-powerbi.csv";
export const NOMBRE_PLANTILLA_VENTAS = "plantilla-ventas-powerbi.csv";

export interface PlantillaLeadMagnet {
  recurso: string;
  archivoUrl: string;
  nombreArchivo: string;
}

export const PLANTILLAS_PERU = {
  "gratificacion-peru-2026": {
    recurso: "gratificacion-peru-2026",
    archivoUrl: "/pe/plantillas/gratificacion-peru-2026.xlsx",
    nombreArchivo: "gratificacion-peru-2026.xlsx",
  },
  "cts-peru-2026": {
    recurso: "cts-peru-2026",
    archivoUrl: "/pe/plantillas/cts-peru-2026.xlsx",
    nombreArchivo: "cts-peru-2026.xlsx",
  },
  "liquidacion-beneficios-sociales-peru-2026": {
    recurso: "liquidacion-beneficios-sociales-peru-2026",
    archivoUrl: "/pe/plantillas/liquidacion-beneficios-sociales-peru-2026.xlsx",
    nombreArchivo: "liquidacion-beneficios-sociales-peru-2026.xlsx",
  },
  "renta-quinta-categoria-peru-2026": {
    recurso: "renta-quinta-categoria-peru-2026",
    archivoUrl: "/pe/plantillas/renta-quinta-categoria-peru-2026.xlsx",
    nombreArchivo: "renta-quinta-categoria-peru-2026.xlsx",
  },
  "boleta-de-pago-peru-2026": {
    recurso: "boleta-de-pago-peru-2026",
    archivoUrl: "/pe/plantillas/boleta-de-pago-peru-2026.xlsx",
    nombreArchivo: "boleta-de-pago-peru-2026.xlsx",
  },
} as const satisfies Record<string, PlantillaLeadMagnet>;

export const PLANTILLAS_COLOMBIA_2026 = {
  primaServicios: {
    recurso: "prima-de-servicios-colombia-2026",
    archivoUrl: "/co/plantillas/prima-de-servicios-colombia-2026.xlsx",
    nombreArchivo: "prima-de-servicios-colombia-2026.xlsx",
  },
  interesesCesantias: {
    recurso: "intereses-de-cesantias-colombia-2026",
    archivoUrl: "/co/plantillas/intereses-de-cesantias-colombia-2026.xlsx",
    nombreArchivo: "intereses-de-cesantias-colombia-2026.xlsx",
  },
  cesantias: {
    recurso: "cesantias-colombia-2026",
    archivoUrl: "/co/plantillas/cesantias-colombia-2026.xlsx",
    nombreArchivo: "cesantias-colombia-2026.xlsx",
  },
  liquidacionContrato: {
    recurso: "liquidacion-contrato-colombia-2026",
    archivoUrl: "/co/plantillas/liquidacion-contrato-colombia-2026.xlsx",
    nombreArchivo: "liquidacion-contrato-colombia-2026.xlsx",
  },
  liquidacionNomina: {
    recurso: "liquidacion-nomina-colombia-2026",
    archivoUrl: "/co/plantillas/liquidacion-nomina-colombia-2026.xlsx",
    nombreArchivo: "liquidacion-nomina-colombia-2026.xlsx",
  },
} as const satisfies Record<string, PlantillaLeadMagnet>;

export const PLANTILLAS_MX = {
  aguinaldo: {
    recurso: "aguinaldo-mexico-2026",
    archivoUrl: "/mx/plantillas/aguinaldo-mexico-2026.xlsx",
    nombreArchivo: "aguinaldo-mexico-2026.xlsx",
  },
  finiquitoLiquidacion: {
    recurso: "finiquito-liquidacion-mexico-2026",
    archivoUrl: "/mx/plantillas/finiquito-liquidacion-mexico-2026.xlsx",
    nombreArchivo: "finiquito-liquidacion-mexico-2026.xlsx",
  },
  tablaIsr2026: {
    recurso: "tabla-isr-2026-mexico",
    archivoUrl: "/mx/plantillas/tabla-isr-2026-mexico.xlsx",
    nombreArchivo: "tabla-isr-2026-mexico.xlsx",
  },
  ptu: {
    recurso: "ptu-mexico-2026",
    archivoUrl: "/mx/plantillas/ptu-mexico-2026.xlsx",
    nombreArchivo: "ptu-mexico-2026.xlsx",
  },
} as const satisfies Record<string, PlantillaLeadMagnet>;

export const RECURSO_PLANTILLA_AGUINALDO_AR = "aguinaldo-sac-argentina-2026";
export const ARCHIVO_PLANTILLA_AGUINALDO_AR = "/ar/plantillas/aguinaldo-sac-argentina-2026.xlsx";
export const NOMBRE_PLANTILLA_AGUINALDO_AR = "aguinaldo-sac-argentina-2026.xlsx";

const RECURSOS_PERMITIDOS = new Set<string>([
  RECURSO_PLANTILLA_VENTAS,
  "test-sql",
  "test-excel",
  ...Object.values(PLANTILLAS_PERU).map((item) => item.recurso),
  ...Object.values(PLANTILLAS_COLOMBIA_2026).map((item) => item.recurso),
  ...Object.values(PLANTILLAS_MX).map((item) => item.recurso),
  RECURSO_PLANTILLA_AGUINALDO_AR,
]);

export function esRecursoLeadMagnet(recurso: string): boolean {
  return RECURSOS_PERMITIDOS.has(recurso);
}
