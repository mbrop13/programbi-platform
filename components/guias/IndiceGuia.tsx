"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ItemIndice } from "@/components/guias/indice";

/**
 * Índice de la guía: fijo a la izquierda en escritorio y desplegable en mobile.
 *
 * La sección activa se marca con un único IntersectionObserver (sin listener de
 * scroll y sin recalcular posiciones). Si el navegador no lo soporta, la lista
 * queda como anclas normales: el índice sigue funcionando igual.
 *
 * Todo el marcado se renderiza en el servidor; el observer solo agrega
 * `aria-current` y una barra de color.
 */
type Props = { items: ItemIndice[] };

/** Alto del navbar fijo (72 px) + un respiro de 24 px. */
const MARGEN_SUPERIOR = 96;

function Lista({ items, activo, onNavegar }: Props & { activo: string | null; onNavegar?: () => void }) {
  return (
    <ol className="border-l border-line">
      {items.map((item) => {
        const esActivo = activo === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={esActivo ? "location" : undefined}
              onClick={onNavegar}
              className={`-ml-px block border-l-2 py-1 leading-snug no-underline transition-colors ${
                item.nivel === 3 ? "pl-7 text-[12.5px]" : "pl-4 text-[13px]"
              } ${
                esActivo
                  ? "border-ink font-semibold text-ink"
                  : "border-transparent text-mute hover:border-line-strong hover:text-ink"
              }`}
            >
              {item.texto}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function useSeccionActiva(items: ItemIndice[]) {
  const [activo, setActivo] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const nodos = items
      .map((item) => document.getElementById(item.id))
      .filter((nodo): nodo is HTMLElement => nodo !== null);
    if (nodos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibles = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibles[0]) setActivo(visibles[0].target.id);
      },
      { rootMargin: `-${MARGEN_SUPERIOR}px 0px -65% 0px`, threshold: 0 }
    );

    nodos.forEach((nodo) => observer.observe(nodo));
    return () => observer.disconnect();
  }, [items]);

  return [activo, setActivo] as const;
}

/** Versión escritorio: columna fija que acompaña la lectura. */
export function IndiceGuiaNav({ items }: Props) {
  const [activo] = useSeccionActiva(items);
  if (items.length < 3) return null;

  return (
    <nav
      aria-label="En esta guía"
      data-testid="indice-guia"
      className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain pb-8"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">En esta guía</p>
      <div className="mt-3">
        <Lista items={items} activo={activo} />
      </div>
    </nav>
  );
}

/** Versión mobile: bloque desplegable arriba del cuerpo. */
export function IndiceGuiaMobile({ items }: Props) {
  const [activo, setActivo] = useSeccionActiva(items);
  const detalles = useRef<HTMLDetailsElement>(null);

  if (items.length < 3) return null;

  return (
    <details ref={detalles} className="group mt-6 rounded-2xl border border-line bg-paper px-4 py-3 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
        <span>En esta guía</span>
        <ChevronDown
          size={15}
          aria-hidden
          className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div className="mt-3">
        <Lista
          items={items}
          activo={activo}
          onNavegar={() => {
            setActivo(null);
            detalles.current?.removeAttribute("open");
          }}
        />
      </div>
    </details>
  );
}
