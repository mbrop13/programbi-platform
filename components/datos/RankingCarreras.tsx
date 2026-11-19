"use client";

import * as React from "react";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, GitCompare, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TIPO_ETIQUETAS, type RankingItem, type TipoIesKey } from "@/lib/datos/carreras-tipos";
import {
  entero,
  mesCorto,
} from "@/lib/datos/formato";
import { ajustarPorIpc, type PuntoIpc } from "@/lib/datos/ipc";
import { trackEvent } from "@/lib/analytics/marketing";
import {
  contarFiltrosActivos,
  FILTROS_DEFAULT,
  FiltrosAvanzados,
  parseFiltrosFromSearchParams,
  serializeFiltrosToQuery,
  tieneFiltrosPrograma,
  type FiltrosCarrerasState,
  type OrdenRankingKey,
} from "./FiltrosAvanzados";
import { ChipsFiltros } from "./ChipsFiltros";
import { ScatterSueldoEmpleo } from "./ScatterSueldoEmpleo";
import { TablaRankingCarreras } from "./TablaRankingCarreras";

interface ProgramaCompacto {
  s: string;
  i: string;
  n: string;
  r: string;
  j: string;
  a: number | null;
  d: number | null;
  v: number | null;
  p: number | null;
  c: number;
}

export interface RankingCarrerasProps {
  initialRows: RankingItem[];
  areas: string[];
  regiones: string[];
  arancelP95: number;
  pesosDe: string;
  ultimoMesIpc: string | null;
  ipcSeries: PuntoIpc[];
}

const ORDEN_OPCIONES: { value: OrdenRankingKey; label: string }[] = [
  { value: "ing4", label: "Mayor sueldo 4.º año" },
  { value: "ing1", label: "Mayor sueldo 1.er año" },
  { value: "ing5", label: "Mayor sueldo 5.º año" },
  { value: "emp1", label: "Mayor empleabilidad 1.er año" },
  { value: "yoy_real_4", label: "Mayor crecimiento real 2020–2024" },
  { value: "dur_real", label: "Menor duración real" },
  { value: "arancel_med", label: "Mayor arancel mediano" },
  { value: "arancel_asc", label: "Menor arancel mediano" },
];

export function RankingCarreras({
  initialRows,
  areas,
  regiones,
  arancelP95,
  pesosDe,
  ultimoMesIpc,
  ipcSeries,
}: RankingCarrerasProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filtros, setFiltros] = React.useState<FiltrosCarrerasState>(() =>
    parseFiltrosFromSearchParams(searchParams)
  );
  const [pesosHoy, setPesosHoy] = React.useState(false);
  const [allRanking, setAllRanking] = React.useState<RankingItem[] | null>(null);
  const [programasByTipo, setProgramasByTipo] = React.useState<
    Partial<Record<TipoIesKey, ProgramaCompacto[]>>
  >({});
  const [loadingProgramas, setLoadingProgramas] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(25);
  const [compareSlugs, setCompareSlugs] = React.useState<string[]>([]);
  const [selectedScatterSlug, setSelectedScatterSlug] = React.useState<string | null>(null);

  // Sync from URL when navigating back/forward
  React.useEffect(() => {
    setFiltros(parseFiltrosFromSearchParams(searchParams));
  }, [searchParams]);

  // Lazy load full ranking.json only when user filters/paginates, or once idle after initial hydration
  const needsFullRanking = React.useMemo(() => {
    return (
      visibleCount > 25 ||
      filtros.tipo !== FILTROS_DEFAULT.tipo ||
      filtros.orden !== FILTROS_DEFAULT.orden ||
      contarFiltrosActivos(filtros) > 0
    );
  }, [visibleCount, filtros]);

  React.useEffect(() => {
    if (allRanking !== null) return;
    let cancelled = false;
    const load = () => {
      fetch("/datos/carreras/ranking.json")
        .then((r) => (r.ok ? r.json() : null))
        .then((data: RankingItem[] | null) => {
          if (!cancelled && data) setAllRanking(data);
        })
        .catch(() => {});
    };

    if (needsFullRanking) {
      load();
      return () => {
        cancelled = true;
      };
    }

    const timer = window.setTimeout(load, 2800);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [allRanking, needsFullRanking]);

  // Lazy load programas-{tipo}.json when program-level filters are active
  const needsPrograms = tieneFiltrosPrograma(filtros);
  React.useEffect(() => {
    if (!needsPrograms) return;
    if (programasByTipo[filtros.tipo]) return;
    let cancelled = false;
    setLoadingProgramas(true);
    fetch(`/datos/carreras/programas-${filtros.tipo}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ProgramaCompacto[] | null) => {
        if (!cancelled && data) {
          setProgramasByTipo((prev) => ({ ...prev, [filtros.tipo]: data }));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingProgramas(false);
      });
    return () => {
      cancelled = true;
    };
  }, [needsPrograms, filtros.tipo, programasByTipo]);

  const ipcInfo = React.useMemo(() => {
    if (!pesosHoy || !ultimoMesIpc) return { factor: 1, mesLabel: mesCorto(pesosDe) };
    const res = ajustarPorIpc(1000, pesosDe, ultimoMesIpc, ipcSeries);
    if (!res) return { factor: 1, mesLabel: mesCorto(pesosDe) };
    return { factor: res.factor, mesLabel: mesCorto(res.mesHasta) };
  }, [pesosHoy, pesosDe, ultimoMesIpc, ipcSeries]);

  const updateFiltros = React.useCallback(
    (next: FiltrosCarrerasState) => {
      setFiltros(next);
      setVisibleCount(25);
      const qs = serializeFiltrosToQuery(next);
      router.replace(`${pathname}${qs}`, { scroll: false });
      trackEvent("datos_filter", {
        tipo: next.tipo,
        orden: next.orden,
        filtros_activos: contarFiltrosActivos(next),
      });
    },
    [pathname, router]
  );

  const resetFiltros = React.useCallback(() => {
    updateFiltros({ ...FILTROS_DEFAULT, tipo: filtros.tipo });
  }, [filtros.tipo, updateFiltros]);

  // Program-level matching slugs set
  const matchingSlugsByProgram = React.useMemo(() => {
    if (!needsPrograms) return null;
    const progs = programasByTipo[filtros.tipo];
    if (!progs) return null;
    const set = new Set<string>();
    for (const p of progs) {
      if (filtros.regiones.length > 0 && !filtros.regiones.includes(p.r)) continue;
      if (filtros.jornada && p.j !== filtros.jornada) continue;
      if (filtros.arancelMax !== null && (p.a === null || p.a > filtros.arancelMax)) continue;
      if (filtros.acredMin > 0 && p.c < filtros.acredMin) continue;
      if (filtros.vacantesMin > 0 && (p.v === null || p.v < filtros.vacantesMin)) continue;
      if (filtros.paes !== null && p.p !== null && p.p > filtros.paes) continue;
      set.add(p.s);
    }
    return set;
  }, [needsPrograms, programasByTipo, filtros]);

  const baseDataset = allRanking ?? initialRows;

  const filteredRows = React.useMemo(() => {
    const rows = baseDataset.filter((r) => {
      if (r.tipo !== filtros.tipo) return false;
      if (filtros.nivel && r.nivel !== filtros.nivel) return false;
      if (filtros.area && r.area !== filtros.area) return false;
      if (filtros.duracionMax !== null && (r.dur_real === null || r.dur_real > filtros.duracionMax))
        return false;
      if (filtros.tituladosMin > 0 && (r.titulados ?? 0) < filtros.tituladosMin) return false;

      if (matchingSlugsByProgram !== null) {
        if (!matchingSlugsByProgram.has(r.slug)) return false;
      } else if (needsPrograms) {
        // Fallback while programs JSON is loading: use summary fields
        if (
          filtros.regiones.length > 0 &&
          !filtros.regiones.some((reg) => r.regiones.includes(reg))
        )
          return false;
        if (filtros.jornada && !r.jornadas.includes(filtros.jornada)) return false;
        if (filtros.arancelMax !== null && (r.arancel_med === null || r.arancel_med > filtros.arancelMax))
          return false;
        if (filtros.acredMin > 0 && r.acred_max < filtros.acredMin) return false;
        if (filtros.vacantesMin > 0 && r.vacantes_total < filtros.vacantesMin) return false;
        if (filtros.paes !== null && r.paes_min !== null && r.paes_min > filtros.paes) return false;
      }

      return true;
    });

    const sorted = [...rows].sort((a, b) => {
      switch (filtros.orden) {
        case "ing1":
          return (b.ing1 ?? -1) - (a.ing1 ?? -1);
        case "ing5":
          return (b.ing5 ?? -1) - (a.ing5 ?? -1);
        case "emp1":
          return (b.emp1 ?? -1) - (a.emp1 ?? -1) || (b.ing4 ?? -1) - (a.ing4 ?? -1);
        case "yoy_real_4":
          return (b.yoy_real_4 ?? -99) - (a.yoy_real_4 ?? -99);
        case "dur_real":
          return (a.dur_real ?? 999) - (b.dur_real ?? 999);
        case "arancel_med":
          return (b.arancel_med ?? -1) - (a.arancel_med ?? -1);
        case "arancel_asc":
          return (a.arancel_med ?? Infinity) - (b.arancel_med ?? Infinity);
        case "ing4":
        default:
          return (b.ing4 ?? -1) - (a.ing4 ?? -1);
      }
    });

    return sorted;
  }, [baseDataset, filtros, matchingSlugsByProgram, needsPrograms]);

  const visibleRows = filteredRows.slice(0, visibleCount);

  const toggleCompare = (slug: string) => {
    setCompareSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return [...prev.slice(1), slug];
      return [...prev, slug];
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <FiltrosAvanzados
          filtros={filtros}
          onChange={updateFiltros}
          onReset={resetFiltros}
          areas={areas}
          regiones={regiones}
          arancelP95={arancelP95}
          totalResultados={filteredRows.length}
        />

        <div className="min-w-0 flex-1 space-y-4">
          {/* Top controls: Tabs U/IP/CFT + Orden + IPC toggle */}
          <div className="flex flex-col gap-3 rounded-xl border border-[#e2e2dc] bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              value={filtros.tipo}
              onValueChange={(val) => {
                if (val === "u" || val === "ip" || val === "cft") {
                  updateFiltros({ ...filtros, tipo: val });
                }
              }}
            >
              <TabsList className="bg-[#f3f3f0]">
                <TabsTrigger value="u" className="text-xs font-semibold">
                  Universidades
                </TabsTrigger>
                <TabsTrigger value="ip" className="text-xs font-semibold">
                  IP
                </TabsTrigger>
                <TabsTrigger value="cft" className="text-xs font-semibold">
                  CFT
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="toggle-ipc-ranking"
                  checked={pesosHoy}
                  onCheckedChange={setPesosHoy}
                />
                <label
                  htmlFor="toggle-ipc-ranking"
                  className="cursor-pointer text-xs font-medium text-[#171716]"
                >
                  {pesosHoy
                    ? `Pesos de hoy (${ipcInfo.mesLabel})`
                    : `Pesos ${mesCorto(pesosDe)}`}
                </label>
              </div>

              <Select
                value={filtros.orden}
                onValueChange={(v) =>
                  updateFiltros({ ...filtros, orden: v as OrdenRankingKey })
                }
              >
                <SelectTrigger
                  aria-label="Ordenar carreras por"
                  className="h-8 w-[220px] border-[#d4d4ce] bg-white text-xs"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDEN_OPCIONES.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ChipsFiltros
            filtros={filtros}
            onChange={updateFiltros}
            onReset={resetFiltros}
          />

          {compareSlugs.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1890ff]/40 bg-[#e9f4ff] px-4 py-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <GitCompare className="size-4 text-[#1063b8]" />
                <span className="font-semibold text-[#171716]">
                  Seleccionadas para comparar ({compareSlugs.length}/3):
                </span>
                {compareSlugs.map((s) => (
                  <Badge key={s} variant="secondary" className="bg-white text-[#171716]">
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCompareSlugs([])}
                  className="text-[#5c5c58] hover:text-[#171716] hover:underline"
                >
                  Vaciar
                </button>
                <Link
                  href={`/datos/carreras/comparar?c=${compareSlugs.join(",")}`}
                  prefetch={false}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#1063b8] px-3 py-1.5 font-semibold text-white hover:bg-[#0d549c]"
                >
                  Comparar ahora
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ) : null}

          {loadingProgramas ? (
            <div className="flex items-center gap-2 rounded-lg border border-[#e2e2dc] bg-white px-3 py-2 text-xs text-[#5c5c58]">
              <Loader2 className="size-3.5 animate-spin text-[#1063b8]" />
              Aplicando filtros exactos a nivel de programas 2026...
            </div>
          ) : null}

          {filteredRows.length === 0 ? (
            <div className="rounded-xl border border-[#e2e2dc] bg-white p-8 text-center">
              <p className="text-sm font-medium text-[#171716]">
                Ninguna carrera en {TIPO_ETIQUETAS[filtros.tipo].plural} cumple todos los filtros seleccionados.
              </p>
              <p className="mt-1 text-xs text-[#5c5c58]">
                Prueba ampliar el arancel máximo, quitar una región o cambiar el tipo de institución.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFiltros}
                className="mt-4 border-[#d4d4ce]"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <>
              <TablaRankingCarreras rows={visibleRows} maxP90={filteredRows.reduce((max, row) => Math.max(max, row.p90_5 ?? 0), 1_000_000)} factor={ipcInfo.factor} compareSlugs={compareSlugs} onToggleCompare={toggleCompare} onSelectSlug={setSelectedScatterSlug} />

              {visibleCount < filteredRows.length ? (
                <div className="flex items-center justify-between rounded-xl border border-[#e2e2dc] bg-white px-4 py-3 text-xs">
                  <span className="text-[#5c5c58] tabular-nums">
                    Mostrando {visibleRows.length} de {entero(filteredRows.length)} carreras
                  </span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setVisibleCount((c) => c + 25)}
                      className="border-[#d4d4ce] text-xs"
                    >
                      Ver 25 más
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setVisibleCount(filteredRows.length)}
                      className="text-xs text-[#1063b8]"
                    >
                      Ver todas
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Scatter Sueldo vs Empleabilidad */}
      <section aria-labelledby="heading-scatter" className="space-y-3">
        <div>
          <h2 id="heading-scatter" className="h2-datos text-[#171716]">
            Sueldo al 4.º año vs. empleabilidad al 1.er año
          </h2>
          <p className="mt-1 text-sm text-[#5c5c58]">
            Cada punto representa una carrera en {TIPO_ETIQUETAS[filtros.tipo].plural.toLowerCase()} según los filtros activos. Haz clic en un punto para ver su ficha.
          </p>
        </div>
        <ScatterSueldoEmpleo
          items={filteredRows}
          factorIpc={ipcInfo.factor}
          selectedSlug={selectedScatterSlug}
          onSelectSlug={setSelectedScatterSlug}
        />
      </section>
    </div>
  );
}
