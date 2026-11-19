"use client";

import Link from "@/components/datos/EnlaceNavegacionDatos";
import { useActionState, useEffect } from "react";
import { Mail } from "lucide-react";
import { honeypotStyle } from "@/lib/antibot";
import { trackGenerateLead } from "@/lib/analytics/marketing";
import { solicitarAlerta } from "@/lib/datos/alertas-acciones";
import { ALERTA_INICIAL } from "@/lib/datos/alertas-config";
import styles from "./AlertasDesempleo.module.css";

export function AlertasDesempleo() {
  const [resultado, accion, enviando] = useActionState(solicitarAlerta, ALERTA_INICIAL);
  const enviado = resultado.estado === "enviado";

  useEffect(() => {
    if (enviado) {
      trackGenerateLead({
        method: "form",
        form_name: "datos_alerta_desempleo",
        lead_type: "alerta_datos",
        lead_source: "datos_desempleo",
        country: "cl",
      });
    }
  }, [enviado]);

  return (
    <section id="alerta-desempleo" className={styles.alerta} aria-labelledby="titulo-alerta">
      <div>
        <span className={styles.icono}><Mail size={20} aria-hidden="true" /></span>
        <h2 id="titulo-alerta">Recibe la próxima cifra</h2>
        <p>Te avisaremos cuando ProgramBI publique un nuevo trimestre móvil de la Encuesta Nacional de Empleo.</p>
      </div>
      <form action={accion} className={styles.formulario}>
        <div aria-hidden="true" style={honeypotStyle}>
          <label>Sitio web <input name="_website" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <label htmlFor="datos-alerta-email">Correo electrónico</label>
        <div className={styles.fila}>
          <input id="datos-alerta-email" type="email" name="email" autoComplete="email" maxLength={254}
            placeholder="nombre@ejemplo.cl" required disabled={enviando || enviado} />
          <button className={styles.boton} type="submit" disabled={enviando || enviado}>
            {enviando ? "Enviando…" : "Activar alerta"}
          </button>
        </div>
        <div className={styles.consentimiento}>
          <label><input type="checkbox" name="consentimiento" required disabled={enviando || enviado} /> Quiero recibir este aviso por correo.</label>
          <Link href="/privacidad">Política de privacidad</Link>
        </div>
        <p className={styles.resultado} aria-live="polite">{resultado.mensaje}</p>
      </form>
    </section>
  );
}
