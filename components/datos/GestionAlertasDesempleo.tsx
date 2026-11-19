"use client";

import { useActionState, useSyncExternalStore } from "react";
import { gestionarAlerta } from "@/lib/datos/alertas-acciones";
import { ALERTA_INICIAL } from "@/lib/datos/alertas-config";
import styles from "./AlertasDesempleo.module.css";

function escuchar(cambio: () => void) {
  window.addEventListener("hashchange", cambio);
  return () => window.removeEventListener("hashchange", cambio);
}

export function GestionAlertasDesempleo() {
  const fragmento = useSyncExternalStore(escuchar, () => window.location.hash.slice(1), () => "");
  const [resultado, accion, enviando] = useActionState(gestionarAlerta, ALERTA_INICIAL);
  const [operacion, token] = fragmento.split("=");
  const valido = (operacion === "confirmar" || operacion === "baja") && Boolean(token);
  const finalizado = resultado.estado === "confirmado" || resultado.estado === "baja";

  return (
    <div>
      <p>Confirma tu suscripción o date de baja desde el enlace que recibiste por correo.</p>
      {valido && !finalizado ? (
        <form action={accion}>
          <input type="hidden" name="operacion" value={operacion} />
          <input type="hidden" name="token" value={token} />
          <button type="submit" className={styles.boton} disabled={enviando}>
            {operacion === "confirmar" ? "Confirmar suscripción" : "Confirmar baja"}
          </button>
        </form>
      ) : null}
      <p role="status">{resultado.mensaje}</p>
    </div>
  );
}
