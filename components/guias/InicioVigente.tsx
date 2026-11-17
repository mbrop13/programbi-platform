"use client";

import { useSyncExternalStore } from "react";
import type { InicioGuia } from "@/lib/guias/inicio";

const sinSuscripcion = () => () => {};

/**
 * Muestra la fecha de la próxima cohorte solo mientras siga vigente.
 *
 * La guía es estática y la fecha se fijó al construir el sitio. Si el visitante
 * llega después de ese día, se cambia por `alterno` («Cupos abiertos — consulta
 * fecha») para no anunciar una clase que ya empezó.
 */
export default function InicioVigente({
  inicio,
  prefijo,
  alterno,
}: {
  inicio: InicioGuia | null;
  /** Texto antes de la fecha, por ejemplo «Próximo inicio: ». */
  prefijo: string;
  alterno: string;
}) {
  const fecha = inicio?.fecha;
  // En el servidor (build) la fecha siempre se considera vigente; el navegador
  // la compara con el día real del visitante al hidratar.
  const vencida = useSyncExternalStore(
    sinSuscripcion,
    () => (fecha ? new Date(`${fecha}T23:59:59`).getTime() < Date.now() : false),
    () => false,
  );

  if (!inicio || vencida) return <>{alterno}</>;
  return (
    <>
      {prefijo}
      {inicio.texto}
    </>
  );
}
