"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  children: ReactNode;
  /** Alto visible antes de expandir, solo bajo `lg`. */
  alto?: string;
  /** Color del degradado: el fondo de la sección que envuelve. */
  fondo?: string;
  /** Texto del botón, por ejemplo «Ver toda la sección». */
  etiqueta?: string;
};

/**
 * Recorta una sección larga en celular y tablet: muestra el comienzo con un
 * degradado y un botón «Ver más». En escritorio no recorta nada.
 *
 * El contenido completo queda en el HTML (lo leen Google y los lectores de
 * pantalla); solo cambia cuánto se ve. Si el ancla de la URL apunta a algo
 * dentro de la sección, se abre sola para que el salto no caiga en la parte
 * oculta.
 */
export default function ExpandibleMovil({
  children,
  alto = "30rem",
  fondo = "var(--color-canvas, #f7f7f5)",
  etiqueta = "Ver más",
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const [recorta, setRecorta] = useState(true);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const medir = () => setRecorta(el.scrollHeight > el.clientHeight + 24);
    medir();
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(medir);
    ro?.observe(el);

    const abrirSiAncla = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id && el.querySelector(`[id="${CSS.escape(id)}"]`)) setAbierto(true);
    };
    abrirSiAncla();
    window.addEventListener("hashchange", abrirSiAncla);
    return () => {
      ro?.disconnect();
      window.removeEventListener("hashchange", abrirSiAncla);
    };
  }, []);

  const cerrado = !abierto && recorta;

  return (
    <div className="relative" style={{ "--expandible-alto": alto, "--expandible-fondo": fondo } as CSSProperties}>
      <div
        ref={caja}
        className={abierto ? undefined : "max-lg:max-h-[var(--expandible-alto)] max-lg:overflow-hidden"}
      >
        {children}
      </div>
      {cerrado ? (
        <div className="absolute inset-x-0 bottom-0 flex h-44 items-end justify-center bg-gradient-to-t from-[var(--expandible-fondo)] from-35% to-transparent pb-6 lg:hidden">
          <button
            type="button"
            onClick={() => setAbierto(true)}
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line-strong bg-paper px-5 text-sm font-semibold text-ink shadow-[0_6px_20px_rgba(23,23,22,0.10)] active:scale-[0.98]"
          >
            {etiqueta}
            <ChevronDown size={16} aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
