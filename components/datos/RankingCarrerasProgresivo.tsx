"use client";

import { useCallback, useEffect, useRef, useState, Suspense, type ComponentType, type ReactNode } from "react";
import type { RankingCarrerasProps } from "./RankingCarreras";

const PARAMETROS = ["tipo", "orden", "nivel", "area", "regiones", "region", "jornada", "arancel_max", "duracion_max", "acred", "vacantes", "paes", "min_titulados", "titulados"];

export function RankingCarrerasProgresivo({ children, ...props }: RankingCarrerasProps & { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const loading = useRef(false);
  const [Ranking, setRanking] = useState<ComponentType<RankingCarrerasProps> | null>(null);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    if (loading.current) return;
    loading.current = true;
    setFailed(false);
    import("./RankingCarreras").then((module) => {
      setRanking(() => module.RankingCarreras);
    }).catch(() => {
      loading.current = false;
      setFailed(true);
    });
  }, []);

  useEffect(() => {
    const cargarFiltrosDeUrl = () => {
      const params = new URLSearchParams(window.location.search);
      if (PARAMETROS.some((key) => params.has(key))) load();
    };
    cargarFiltrosDeUrl();
    window.addEventListener("popstate", cargarFiltrosDeUrl);
    const element = ref.current;
    let observer: IntersectionObserver | undefined;
    if (element && typeof window.IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          load();
          observer?.disconnect();
        }
      }, { rootMargin: "120px" });
      observer.observe(element);
    }
    return () => {
      observer?.disconnect();
      window.removeEventListener("popstate", cargarFiltrosDeUrl);
    };
  }, [load]);

  useEffect(() => {
    const element = ref.current;
    if (Ranking && element && (!element.contains(document.activeElement) || document.activeElement === element)) {
      setActive(true);
    }
  }, [Ranking]);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      onBlur={(event) => {
        if (Ranking && (!event.currentTarget.contains(event.relatedTarget) || event.relatedTarget === event.currentTarget)) setActive(true);
      }}
    >
      <div className="mb-4 flex min-h-10 items-center gap-3">
        {active ? <span role="status" className="sr-only">Ranking interactivo disponible</span> : (
          <button type="button" onClick={() => { ref.current?.focus(); load(); }} className="rounded-lg border border-[#1063b8] bg-white px-3 py-2 text-sm font-semibold text-[#1063b8]">
            {failed ? "Reintentar cargar filtros" : "Activar filtros y comparación"}
          </button>
        )}
        {failed ? <span role="status" className="text-sm text-[#5c5c58]">No se pudo cargar el ranking interactivo.</span> : null}
      </div>
      {active && Ranking ? <Suspense fallback={children}><Ranking {...props} /></Suspense> : children}
    </div>
  );
}
