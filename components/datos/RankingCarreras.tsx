"use client";

import * as React from "react";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Download,
  GitCompare,
  Info,
  LayoutGrid,
  Loader2,
  Search,
  Table2,
  X,
} from "lucide-react";
import { AreaVisualCard } from "./AreaVisualCard";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TIPO_ETIQUETAS, type RankingItem, type TipoIesKey } from "@/lib/datos/carreras-tipos";
import { entero, mesCorto, normalizarTexto } from "@/lib/datos/formato";
import { ajustarPorIpc, type PuntoIpc } from "@/lib/datos/ipc";
import { trackEvent } from "@/lib/analytics/marketing";
import { cn } from "@/lib/utils";
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
  { value: "ing4", label: "Mejor sueldo (4.º año)" },
  { value: "emp1", label: "Mayor empleabilidad (1.er año)" },
  { value: "ing1", label: "Mejor sueldo al egresar (1.er año)" },
  { value: "ing5", label: "Mejor sueldo (5.º año)" },
  { value: "yoy_real_4", label: "Más crecieron (2020–2024)" },
  { value: "dur_real", label: "Más cortas (duración real)" },
  { value: "arancel_asc", label: "Arancel más económico" },
  { value: "arancel_med", label: "Arancel más alto" },
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
  const [busquedaTabla, setBusquedaTabla] = React.useState("");
  const [vista, setVista] = React.useState<"tabla" | "tarjetas">("tabla");
  const [pesosHoy, setPesosHoy] = React.useState(false);
  const [allRanking, setAllRanking] = React.useState<RankingItem[] | null>(null);
  const [programasByTipo, setProgramasByTipo] = React.useState<
    Partial<Record<TipoIesKey, ProgramaCompacto[]>>
  >({});
  const [loadingProgramas, setLoadingProgramas] = React.useState(false);
  const [compareSlugs, setCompareSlugs] = React.useState<string[]>([]);
  const [selectedScatterSlug, setSelectedScatterSlug] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFiltros(parseFiltrosFromSearchParams(searchParams));
  }, [searchParams]);

  React.useEffect(() => {
    if (allRanking !== null) return;
    let cancelled = false;
    fetch("/datos/carreras/ranking.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: RankingItem[] | null) => {
        if (!cancelled && data) setAllRanking(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [allRanking]);

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
    setBusquedaTabla("");
    updateFiltros({ ...FILTROS_DEFAULT, tipo: filtros.tipo });
  }, [filtros.tipo, updateFiltros]);

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

  // Mapa de nombres reales para el dock de comparación
  const nombrePorSlug = React.useMemo(() => {
    const mapa = new Map<string, string>();
    for (const item of baseDataset) {
      if (!mapa.has(item.slug)) mapa.set(item.slug, item.nombre);
    }
    return mapa;
  }, [baseDataset]);

  const filteredRows = React.useMemo(() => {
    const q = normalizarTexto(busquedaTabla);
    const rows = baseDataset.filter((r) => {
      if (r.tipo !== filtros.tipo) return false;
      if (q) {
        const texto = normalizarTexto(`${r.nombre} ${r.area}`);
        if (!texto.includes(q)) return false;
      }
      if (filtros.nivel && r.nivel !== filtros.nivel) return false;
      if (filtros.area && r.area !== filtros.area) return false;
      if (filtros.duracionMax !== null && (r.dur_real === null || r.dur_real > filtros.duracionMax))
        return false;
      if (filtros.tituladosMin > 0 && (r.titulados ?? 0) < filtros.tituladosMin) return false;

      if (matchingSlugsByProgram !== null) {
        if (!matchingSlugsByProgram.has(r.slug)) return false;
      } else if (needsPrograms) {
        if (
          filtros.regiones.length > 0 &&
          !filtros.regiones.some((reg) => r.regiones.includes(reg))
        )
          return false;
        if (filtros.jornada && !r.jornadas.includes(filtros.jornada)) return false;
        if (
          filtros.arancelMax !== null &&
          (r.arancel_med === null || r.arancel_med > filtros.arancelMax)
        )
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
  }, [baseDataset, busquedaTabla, filtros, matchingSlugsByProgram, needsPrograms]);

  const areaStats = React.useMemo(() => {
    const byArea = new Map<string, { count: number; salaries: number[] }>();
    for (const a of areas) {
      byArea.set(a, { count: 0, salaries: [] });
    }
    for (const r of baseDataset) {
      if (r.tipo !== filtros.tipo) continue;
      const entry = byArea.get(r.area) ?? { count: 0, salaries: [] };
      entry.count += 1;
      if (r.ing4 !== null) {
        entry.salaries.push(Math.round(r.ing4 * ipcInfo.factor));
      }
      byArea.set(r.area, entry);
    }
    return areas.map((area) => {
      const entry = byArea.get(area) ?? { count: 0, salaries: [] };
      const sorted = [...entry.salaries].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const medianSalary =
        sorted.length === 0
          ? null
          : sorted.length % 2 === 0
            ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
            : sorted[mid];
      return { area, count: entry.count, medianSalary };
    });
  }, [areas, baseDataset, filtros.tipo, ipcInfo.factor]);

  const handleExportCsv = React.useCallback(() => {
    const header = [
      "Carrera",
      "Area",
      "Tipo",
      "Sueldo_4_Anio",
      "Empleabilidad_1_Anio",
      "Arancel_Anual_Med",
      "Duracion_Real_Semestres",
    ].join(",");
    const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
    const lines = filteredRows.map((r) =>
      [
        escape(r.nombre),
        escape(r.area),
        TIPO_ETIQUETAS[r.tipo].corto,
        r.ing4 !== null ? Math.round(r.ing4 * ipcInfo.factor) : "",
        r.emp1 !== null ? (r.emp1 * 100).toFixed(1) : "",
        r.arancel_med ?? "",
        r.dur_real ?? "",
      ].join(",")
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carreras-${filtros.tipo}-programbi.csv`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent("datos_download", { formato: "csv", recurso: "ranking-filtrado" });
  }, [filteredRows, filtros.tipo, ipcInfo.factor]);

  const toggleCompare = (slug: string) => {
    setCompareSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return [...prev.slice(1), slug];
      return [...prev, slug];
    });
  };

  return (
    <div className="min-w-0 max-w-full space-y-8">
      <div className="min-w-0 max-w-full space-y-4">
        {/* Tira visual de Áreas del Conocimiento */}
        <div className="min-w-0 max-w-full space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              Explora por área del conocimiento
            </h3>
            {filtros.area ? (
              <button
                type="button"
                onClick={() => updateFiltros({ ...filtros, area: "" })}
                className="text-xs font-medium text-blue-700 hover:underline"
              >
                Ver todas las áreas
              </button>
            ) : (
              <span className="text-xs text-muted-foreground">
                Haz clic en un área para filtrar
              </span>
            )}
          </div>
          <div className="w-full max-w-full min-w-0 overflow-x-auto pb-2 md:overflow-visible md:pb-0">
            <div className="flex w-max gap-3 md:grid md:w-full md:grid-cols-5">
              {areaStats.map(({ area, count, medianSalary }) => (
                <div key={area} className="w-44 shrink-0 md:w-auto md:min-w-0">
                  <AreaVisualCard
                    area={area}
                    count={count}
                    medianSalary={medianSalary}
                    active={filtros.area === area}
                    onClick={() =>
                      updateFiltros({
                        ...filtros,
                        area: filtros.area === area ? "" : area,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Barra principal de exploración (ancho completo, sin sidebar apretado) */}
        <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
          <CardContent className="space-y-3.5 p-4">
            {/* Fila 1: Tabs U/IP/CFT + Búsqueda rápida + Vista Tabla/Tarjetas */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Tabs
                value={filtros.tipo}
                onValueChange={(val) => {
                  if (val === "u" || val === "ip" || val === "cft") {
                    updateFiltros({ ...filtros, tipo: val });
                  }
                }}
              >
                <TabsList className="h-9 bg-muted p-1">
                  <TabsTrigger value="u" className="px-3 text-xs font-medium sm:text-sm">
                    Universidades
                  </TabsTrigger>
                  <TabsTrigger value="ip" className="px-3 text-xs font-medium sm:text-sm">
                    Institutos (IP)
                  </TabsTrigger>
                  <TabsTrigger value="cft" className="px-3 text-xs font-medium sm:text-sm">
                    Técnicos (CFT)
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-1 flex-wrap items-center gap-2 md:justify-end">
                <div className="relative min-w-[200px] flex-1 md:max-w-xs">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    value={busquedaTabla}
                    onChange={(e) => {
                      setBusquedaTabla(e.target.value);
                    }}
                    placeholder="Filtrar lista por nombre o área..."
                    aria-label="Filtrar ranking por nombre o área"
                    className="h-9 bg-background/60 pl-8 text-xs focus-visible:bg-card"
                  />
                </div>

                <div
                  role="group"
                  aria-label="Cambiar modo de vista"
                  className="hidden rounded-lg bg-muted p-0.5 sm:inline-flex"
                >
                  <button
                    type="button"
                    onClick={() => setVista("tabla")}
                    aria-pressed={vista === "tabla"}
                    className={cn(
                      "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all",
                      vista === "tabla"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Table2 className="size-3.5" aria-hidden="true" />
                    Tabla
                  </button>
                  <button
                    type="button"
                    onClick={() => setVista("tarjetas")}
                    aria-pressed={vista === "tarjetas"}
                    className={cn(
                      "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all",
                      vista === "tarjetas"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <LayoutGrid className="size-3.5" aria-hidden="true" />
                    Tarjetas
                  </button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  disabled={filteredRows.length === 0}
                  className="h-9 gap-1.5 bg-card text-xs font-medium"
                >
                  <Download className="size-3.5 text-blue-600" aria-hidden="true" />
                  <span className="hidden sm:inline">Exportar</span> CSV
                </Button>
              </div>
            </div>

            {/* Fila 2: Área + Orden + Más filtros (Sheet) + Switch IPC + Contador */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-border/70 pt-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={filtros.area || "__all__"}
                  onValueChange={(v) =>
                    updateFiltros({ ...filtros, area: v === "__all__" ? "" : v })
                  }
                >
                  <SelectTrigger
                    aria-label="Filtrar por área"
                    className="h-9 w-[195px] bg-card text-xs"
                  >
                    <SelectValue placeholder="Todas las áreas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Todas las áreas</SelectItem>
                    {areas.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filtros.orden}
                  onValueChange={(v) =>
                    updateFiltros({ ...filtros, orden: v as OrdenRankingKey })
                  }
                >
                  <SelectTrigger
                    aria-label="Ordenar carreras por"
                    className="h-9 w-[225px] bg-card text-xs"
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

                <FiltrosAvanzados
                  filtros={filtros}
                  onChange={updateFiltros}
                  onReset={resetFiltros}
                  areas={areas}
                  regiones={regiones}
                  arancelP95={arancelP95}
                  totalResultados={filteredRows.length}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <TooltipProvider delayDuration={150}>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="toggle-ipc-ranking"
                      checked={pesosHoy}
                      onCheckedChange={setPesosHoy}
                    />
                    <label
                      htmlFor="toggle-ipc-ranking"
                      className="cursor-pointer text-xs font-medium text-foreground"
                    >
                      {pesosHoy
                        ? `Pesos de hoy (${ipcInfo.mesLabel})`
                        : `Pesos ${mesCorto(pesosDe)}`}
                    </label>
                    <Tooltip>
                      <TooltipTrigger
                        type="button"
                        aria-label="Información sobre ajuste por IPC"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Info className="size-3.5" aria-hidden="true" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs leading-snug">
                        Mi Futuro publica los sueldos en pesos de septiembre de 2025. Activa este
                        interruptor para ajustarlos automáticamente a pesos actuales con el IPC del
                        INE.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>

                <span className="text-xs text-muted-foreground tabular-nums">
                  {entero(filteredRows.length)}{" "}
                  {filteredRows.length === 1 ? "carrera" : "carreras"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <ChipsFiltros filtros={filtros} onChange={updateFiltros} onReset={resetFiltros} />

        {loadingProgramas ? (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs text-muted-foreground shadow-xs">
            <Loader2 className="size-3.5 animate-spin text-blue-600" aria-hidden="true" />
            Aplicando filtros exactos a nivel de programas 2026...
          </div>
        ) : null}

        {filteredRows.length === 0 ? (
          <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
            <CardContent className="p-10 text-center">
              <p className="text-sm font-semibold text-foreground">
                Ninguna carrera en {TIPO_ETIQUETAS[filtros.tipo].plural.toLowerCase()} coincide con
                estos filtros.
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Prueba limpiar la búsqueda, ampliar el presupuesto de arancel o cambiar el tipo de
                institución.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFiltros}
                className="mt-4 bg-card"
              >
                Limpiar todos los filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <TablaRankingCarreras
              rows={filteredRows}
              maxP90={filteredRows.reduce((max, row) => Math.max(max, row.p90_5 ?? 0), 1_000_000)}
              factor={ipcInfo.factor}
              compareSlugs={compareSlugs}
              onToggleCompare={toggleCompare}
              onSelectSlug={setSelectedScatterSlug}
              vista={vista}
              interactiveTooltips
            />
          </>
        )}
      </div>

      {/* Barra flotante de comparación cuando hay carreras elegidas */}
      {compareSlugs.length > 0 ? (
        <div className="sticky bottom-4 z-30 mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/15 bg-slate-900 px-4 py-3 text-xs text-white shadow-xl shadow-slate-900/20">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-200">
                <GitCompare className="size-4 text-blue-400" aria-hidden="true" />
                Comparar ({compareSlugs.length}/3):
              </span>
              {compareSlugs.map((slug) => (
                <Badge
                  key={slug}
                  variant="secondary"
                  className="h-auto gap-1 rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white"
                >
                  <span className="max-w-[160px] truncate">{nombrePorSlug.get(slug) ?? slug}</span>
                  <button
                    type="button"
                    onClick={() => toggleCompare(slug)}
                    aria-label={`Quitar ${nombrePorSlug.get(slug) ?? slug}`}
                    className="ml-0.5 rounded hover:bg-white/20"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCompareSlugs([])}
                className="px-2 py-1 text-slate-300 transition-colors hover:text-white"
              >
                Vaciar
              </button>
              <Link
                href={`/datos/carreras/comparar?c=${compareSlugs.join(",")}`}
                prefetch={false}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "h-8 gap-1 rounded-lg bg-white px-3 text-xs font-semibold text-slate-900 hover:bg-slate-100"
                )}
              >
                Comparar ahora
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Gráfico interactivo Sueldo vs Empleabilidad */}
      <section aria-labelledby="heading-scatter" className="space-y-3">
        <div>
          <h2 id="heading-scatter" className="h2-datos text-foreground">
            Mapa sueldo vs. empleabilidad
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cada punto es una carrera en {TIPO_ETIQUETAS[filtros.tipo].plural.toLowerCase()} según
            tus filtros. Arriba a la derecha están las carreras con mejor sueldo y mayor empleo.
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
