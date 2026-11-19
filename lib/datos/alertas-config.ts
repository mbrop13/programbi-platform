export const RUTA_GESTION_ALERTAS = "/datos/desempleo/alertas/gestionar";

export type EstadoAlerta = {
  estado: "inicial" | "enviado" | "confirmado" | "baja" | "error";
  mensaje: string;
};

export const ALERTA_INICIAL: EstadoAlerta = { estado: "inicial", mensaje: "" };
