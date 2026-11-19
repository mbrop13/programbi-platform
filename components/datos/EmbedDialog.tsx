"use client";

import { useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics/marketing";
import { rutaTerritorio } from "@/lib/datos/regiones";
import estilos from "./Observatorio.module.css";
import modal from "./EmbedDialog.module.css";

export function EmbedDialog({ territorio, nombre }: { territorio: string; nombre: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titulo = useId();
  const descripcion = useId();
  const [estado, setEstado] = useState<"listo" | "copiado" | "error">("listo");
  const canonical = `https://www.programbi.com${rutaTerritorio(territorio)}`;
  const snippet = [
    `<iframe src="https://www.programbi.com/datos/desempleo/embed/${territorio}" title="Desempleo en ${nombre} — ProgramBI" loading="lazy" width="100%" height="420" style="border:0"></iframe>`,
    `<a href="${canonical}">Ver datos de desempleo en ${nombre} en ProgramBI</a>`,
  ].join("\n");

  return (
    <>
      <button type="button" className={estilos.botonClaro} onClick={() => ref.current?.showModal()}>
        Insertar en tu sitio
      </button>
      <dialog
        ref={ref}
        className={modal.dialogo}
        aria-labelledby={titulo}
        aria-describedby={descripcion}
        onClose={() => setEstado("listo")}
      >
        <div className={modal.encabezado}>
          <h2 id={titulo}>Insertar en tu sitio</h2>
          <button type="button" className={modal.cerrar} aria-label="Cerrar"
            onClick={() => ref.current?.close()}>
            <X size={19} aria-hidden="true" />
          </button>
        </div>
        <p id={descripcion}>Copia este código para mostrar la cifra y un enlace al observatorio.</p>
        <textarea
          aria-label="Código para insertar"
          readOnly
          value={snippet}
          rows={6}
          onFocus={(event) => event.currentTarget.select()}
          className={modal.codigo}
        />
        <div className={modal.acciones}>
          <button type="button" className={estilos.botonClaro} onClick={async () => {
            try {
              await navigator.clipboard.writeText(snippet);
              setEstado("copiado");
              trackEvent("datos_embed_copy", { territorio });
            } catch {
              setEstado("error");
            }
          }}>Copiar</button>
          <span aria-live="polite">
            {estado === "copiado" && "Copiado."}
            {estado === "error" && "Selecciona el código y cópialo manualmente."}
          </span>
        </div>
      </dialog>
    </>
  );
}
