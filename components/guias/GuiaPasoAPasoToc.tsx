"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface ItemTocPasoAPaso {
  id: string;
  texto: string;
  nivel: 2 | 3;
}

const MARGEN_SUPERIOR = 96;

function useSeccionActiva(items: ItemTocPasoAPaso[]) {
  const [activo, setActivo] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const nodos = items
      .map((item) => document.getElementById(item.id))
      .filter((n): n is HTMLElement => n !== null);
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

  return activo;
}

function ListaToc({
  items,
  activo,
  onNavegar,
}: {
  items: ItemTocPasoAPaso[];
  activo: string | null;
  onNavegar?: () => void;
}) {
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
                item.nivel === 3 ? "pl-6 text-[12px]" : "pl-3.5 text-[13px]"
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

export function GuiaPasoAPasoTocDesktop({ items }: { items: ItemTocPasoAPaso[] }) {
  const activo = useSeccionActiva(items);
  const [progreso, setProgreso] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const calcular = () => {
      frame.current = null;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgreso(0);
        return;
      }
      const pct = Math.min(100, Math.max(0, Math.round((window.scrollY / docHeight) * 100)));
      setProgreso(pct);
    };
    const onScroll = () => {
      if (frame.current == null) frame.current = window.requestAnimationFrame(calcular);
    };
    calcular();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current != null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="En esta guía"
      className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain pb-8"
    >
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-mute">
          <span>En esta guía</span>
          <span>{progreso}%</span>
        </div>
        <div
          className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-wash"
          role="progressbar"
          aria-valuenow={progreso}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso de lectura"
        >
          <div
            className="h-full bg-ink transition-[width] duration-150 ease-out"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      <ListaToc items={items} activo={activo} />
    </nav>
  );
}

export function GuiaPasoAPasoTocMobile({ items }: { items: ItemTocPasoAPaso[] }) {
  const activo = useSeccionActiva(items);
  const detalles = useRef<HTMLDetailsElement>(null);

  if (items.length === 0) return null;

  return (
    <details
      ref={detalles}
      className="group mt-6 rounded-2xl border border-line bg-paper px-4 py-3 lg:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
        <span>En esta guía</span>
        <ChevronDown
          size={15}
          aria-hidden
          className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div className="mt-3">
        <ListaToc
          items={items}
          activo={activo}
          onNavegar={() => {
            detalles.current?.removeAttribute("open");
          }}
        />
      </div>
    </details>
  );
}
