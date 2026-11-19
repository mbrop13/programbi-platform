"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import type { RankingCarrerasProps } from "./RankingCarreras";

export function RankingCarrerasProgresivo({
  children,
  ...props
}: RankingCarrerasProps & { children: ReactNode }) {
  const loading = useRef(false);
  const [Ranking, setRanking] = useState<ComponentType<RankingCarrerasProps> | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    if (loading.current) return;
    loading.current = true;
    setFailed(false);
    import("./RankingCarreras")
      .then((module) => {
        setRanking(() => module.RankingCarreras);
      })
      .catch(() => {
        loading.current = false;
        setFailed(true);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (Ranking) {
    return (
      <Suspense fallback={children}>
        <Ranking {...props} />
      </Suspense>
    );
  }

  return (
    <div>
      {failed ? (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-xs text-muted-foreground">
          <span>No se pudieron cargar los filtros interactivos.</span>
          <button
            type="button"
            onClick={load}
            className="font-semibold text-blue-700 hover:underline"
          >
            Reintentar
          </button>
        </div>
      ) : null}
      {children}
    </div>
  );
}
