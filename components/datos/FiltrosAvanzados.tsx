"use client";

import * as React from "react";
import { Filter, Info, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { TIPO_ETIQUETAS, type TipoIesKey } from "@/lib/datos/carreras-tipos";
import { entero, pesos } from "@/lib/datos/formato";

export type OrdenRankingKey =
  | "ing4"
  | "ing1"
  | "ing5"
  | "emp1"
  | "yoy_real_4"
  | "dur_real"
  | "arancel_med"
  | "arancel_asc";

export interface FiltrosCarrerasState {
  tipo: TipoIesKey;
  nivel: string;
  area: string;
  regiones: string[];
  jornada: string;
  arancelMax: number | null;
  duracionMax: number | null;
  acredMin: 0 | 1 | 4 | 6;
  vacantesMin: 0 | 50 | 100;
  paes: number | null;
  tituladosMin: 0 | 50 | 100;
  orden: OrdenRankingKey;
}

export const FILTROS_DEFAULT: FiltrosCarrerasState = {
  tipo: "u",
  nivel: "",
  area: "",
  regiones: [],
  jornada: "",
  arancelMax: null,
  duracionMax: null,
  acredMin: 0,
  vacantesMin: 0,
  paes: null,
  tituladosMin: 0,
  orden: "ing4",
};

const ORDEN_ALIASES: Record<string, OrdenRankingKey> = {
  ing4: "ing4",
  ing1: "ing1",
  ing5: "ing5",
  emp1: "emp1",
  yoy_real_4: "yoy_real_4",
  crec: "yoy_real_4",
  dur_real: "dur_real",
  arancel_med: "arancel_med",
  arancel_asc: "arancel_asc",
};

export function parseFiltrosFromSearchParams(
  params: URLSearchParams | Readonly<URLSearchParams>
): FiltrosCarrerasState {
  const tipoRaw = params.get("tipo");
  const tipo: TipoIesKey = tipoRaw === "ip" || tipoRaw === "cft" ? tipoRaw : "u";

  const ordenRaw = params.get("orden") ?? "ing4";
  const orden: OrdenRankingKey = ORDEN_ALIASES[ordenRaw] ?? "ing4";

  const regionesRaw = params.get("regiones") ?? params.get("region") ?? "";
  const regiones = regionesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const arancelRaw = Number(params.get("arancel_max"));
  const arancelMax = Number.isFinite(arancelRaw) && arancelRaw > 0 ? arancelRaw : null;

  const durRaw = Number(params.get("duracion_max"));
  const duracionMax = Number.isFinite(durRaw) && durRaw > 0 ? durRaw : null;

  const acredRaw = Number(params.get("acred"));
  const acredMin: 0 | 1 | 4 | 6 =
    acredRaw === 1 || acredRaw === 4 || acredRaw === 6 ? acredRaw : 0;

  const vacRaw = Number(params.get("vacantes"));
  const vacantesMin: 0 | 50 | 100 = vacRaw === 50 || vacRaw === 100 ? vacRaw : 0;

  const paesRaw = Number(params.get("paes"));
  const paes = Number.isFinite(paesRaw) && paesRaw >= 100 && paesRaw <= 1000 ? paesRaw : null;

  const titRaw = Number(params.get("min_titulados") ?? params.get("titulados"));
  const tituladosMin: 0 | 50 | 100 = titRaw === 50 || titRaw === 100 ? titRaw : 0;

  return {
    tipo,
    nivel: params.get("nivel") ?? "",
    area: params.get("area") ?? "",
    regiones,
    jornada: params.get("jornada") ?? "",
    arancelMax,
    duracionMax,
    acredMin,
    vacantesMin,
    paes,
    tituladosMin,
    orden,
  };
}

export function serializeFiltrosToQuery(f: FiltrosCarrerasState): string {
  const sp = new URLSearchParams();
  if (f.tipo !== "u") sp.set("tipo", f.tipo);
  if (f.orden !== "ing4") sp.set("orden", f.orden);
  if (f.nivel) sp.set("nivel", f.nivel);
  if (f.area) sp.set("area", f.area);
  if (f.regiones.length > 0) sp.set("regiones", f.regiones.join(","));
  if (f.jornada) sp.set("jornada", f.jornada);
  if (f.arancelMax !== null) sp.set("arancel_max", String(f.arancelMax));
  if (f.duracionMax !== null) sp.set("duracion_max", String(f.duracionMax));
  if (f.acredMin > 0) sp.set("acred", String(f.acredMin));
  if (f.vacantesMin > 0) sp.set("vacantes", String(f.vacantesMin));
  if (f.paes !== null) sp.set("paes", String(f.paes));
  if (f.tituladosMin > 0) sp.set("min_titulados", String(f.tituladosMin));
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export function tieneFiltrosPrograma(f: FiltrosCarrerasState): boolean {
  return (
    f.regiones.length > 0 ||
    f.jornada !== "" ||
    f.arancelMax !== null ||
    f.acredMin > 0 ||
    f.vacantesMin > 0 ||
    f.paes !== null
  );
}

export function contarFiltrosActivos(f: FiltrosCarrerasState): number {
  let n = 0;
  if (f.nivel) n++;
  if (f.area) n++;
  if (f.regiones.length > 0) n++;
  if (f.jornada) n++;
  if (f.arancelMax !== null) n++;
  if (f.duracionMax !== null) n++;
  if (f.acredMin > 0) n++;
  if (f.vacantesMin > 0) n++;
  if (f.paes !== null) n++;
  if (f.tituladosMin > 0) n++;
  return n;
}

const JORNADAS = [
  { value: "Diurna", label: "Diurna" },
  { value: "Vespertina", label: "Vespertina" },
  { value: "A Distancia", label: "A distancia (online)" },
  { value: "Semipresencial", label: "Semipresencial" },
] as const;

interface FiltrosAvanzadosProps {
  filtros: FiltrosCarrerasState;
  onChange: (next: FiltrosCarrerasState) => void;
  onReset: () => void;
  areas: string[];
  regiones: string[];
  arancelP95: number;
  totalResultados: number;
}

function PanelFiltrosContenido({
  filtros,
  onChange,
  onReset,
  areas,
  regiones,
  arancelP95,
  totalResultados,
}: FiltrosAvanzadosProps) {
  const [paesInput, setPaesInput] = React.useState(filtros.paes ? String(filtros.paes) : "");

  React.useEffect(() => {
    setPaesInput(filtros.paes ? String(filtros.paes) : "");
  }, [filtros.paes]);

  const toggleRegion = (reg: string) => {
    const exists = filtros.regiones.includes(reg);
    const nextRegiones = exists
      ? filtros.regiones.filter((r) => r !== reg)
      : [...filtros.regiones, reg];
    onChange({ ...filtros, regiones: nextRegiones });
  };

  const handlePaesChange = (val: string) => {
    setPaesInput(val);
    const clean = val.trim();
    if (!clean) {
      onChange({ ...filtros, paes: null });
      return;
    }
    const num = Number(clean);
    if (Number.isFinite(num) && num >= 100 && num <= 1000) {
      onChange({ ...filtros, paes: Math.round(num) });
    }
  };

  const maxArancelSlider = Math.max(1_000_000, Math.ceil(arancelP95 / 100_000) * 100_000);
  const arancelActual = filtros.arancelMax ?? maxArancelSlider;
  const duracionActual = filtros.duracionMax ?? 18;
  const activos = contarFiltrosActivos(filtros);

  return (
    <div className="space-y-5 text-sm">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-[#171716]">
          Filtros{" "}
          <span className="ml-1 text-xs font-normal text-[#5c5c58] tabular-nums">
            ({entero(totalResultados)} resultados)
          </span>
        </div>
        {activos > 0 ? (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-[#1063b8] hover:underline"
          >
            Limpiar ({activos})
          </button>
        ) : null}
      </div>

      <Separator className="bg-[#e2e2dc]" />

      {/* Tipo de institución */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-[#5c5c58]">
          Tipo de institución
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(["u", "ip", "cft"] as const).map((tk) => (
            <button
              key={tk}
              type="button"
              onClick={() => onChange({ ...filtros, tipo: tk })}
              className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors ${
                filtros.tipo === tk
                  ? "border-[#1063b8] bg-[#e9f4ff] text-[#1063b8]"
                  : "border-[#e2e2dc] bg-white text-[#171716] hover:bg-[#f3f3f0]"
              }`}
            >
              {TIPO_ETIQUETAS[tk].corto}
            </button>
          ))}
        </div>
      </div>

      {/* Nivel */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-[#5c5c58]">
          Nivel formativo
        </label>
        <Select
          value={filtros.nivel || "__all__"}
          onValueChange={(v) => onChange({ ...filtros, nivel: v === "__all__" ? "" : v })}
        >
          <SelectTrigger aria-label="Nivel formativo" className="w-full border-[#d4d4ce] bg-white text-xs">
            <SelectValue placeholder="Todos los niveles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos los niveles</SelectItem>
            <SelectItem value="Profesional">Profesional</SelectItem>
            <SelectItem value="Técnica de Nivel Superior">Técnica de Nivel Superior</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Área */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-[#5c5c58]">
          Área del conocimiento
        </label>
        <Select
          value={filtros.area || "__all__"}
          onValueChange={(v) => onChange({ ...filtros, area: v === "__all__" ? "" : v })}
        >
          <SelectTrigger aria-label="Área del conocimiento" className="w-full border-[#d4d4ce] bg-white text-xs">
            <SelectValue placeholder="Todas las áreas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas las áreas ({areas.length})</SelectItem>
            {areas.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Jornada */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-[#5c5c58]">
          Jornada
        </label>
        <Select
          value={filtros.jornada || "__all__"}
          onValueChange={(v) => onChange({ ...filtros, jornada: v === "__all__" ? "" : v })}
        >
          <SelectTrigger aria-label="Jornada" className="w-full border-[#d4d4ce] bg-white text-xs">
            <SelectValue placeholder="Cualquier jornada" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Cualquier jornada</SelectItem>
            {JORNADAS.map((j) => (
              <SelectItem key={j.value} value={j.value}>
                {j.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Región multi-select */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#5c5c58]">
            <MapPin className="size-3.5" />
            Región donde se estudia
          </label>
          {filtros.regiones.length > 0 ? (
            <button
              type="button"
              onClick={() => onChange({ ...filtros, regiones: [] })}
              className="text-[11px] text-[#1063b8] hover:underline"
            >
              Todas
            </button>
          ) : null}
        </div>
        <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-2">
          {regiones.map((reg) => {
            const checked = filtros.regiones.includes(reg);
            return (
              <label
                key={reg}
                className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs text-[#171716] hover:bg-white"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleRegion(reg)}
                  className="size-3.5 rounded border-[#d4d4ce] accent-[#1063b8]"
                />
                <span className="truncate">{reg}</span>
              </label>
            );
          })}
        </div>
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-[#5c5c58]">
          <Info className="mt-0.5 size-3 shrink-0 text-[#1063b8]" />
          <span>La región filtra dónde se estudia; los sueldos son nacionales.</span>
        </p>
      </div>

      {/* Arancel anual máximo */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide text-[#5c5c58]">
            Arancel anual máx.
          </span>
          <span className="font-semibold text-[#171716] tabular-nums">
            {filtros.arancelMax === null ? "Sin límite" : pesos(filtros.arancelMax)}
          </span>
        </div>
        <Slider
          min={0}
          max={maxArancelSlider}
          step={100_000}
          value={[arancelActual]}
          onValueChange={([val]) =>
            onChange({
              ...filtros,
              arancelMax: val >= maxArancelSlider ? null : val,
            })
          }
          aria-label="Arancel anual máximo"
        />
        <div className="flex justify-between text-[11px] text-[#5c5c58] tabular-nums">
          <span>$0</span>
          <span>{pesos(maxArancelSlider)}</span>
        </div>
      </div>

      {/* Duración real máxima */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide text-[#5c5c58]">
            Duración real máx.
          </span>
          <span className="font-semibold text-[#171716] tabular-nums">
            {filtros.duracionMax === null ? "Sin límite" : `${filtros.duracionMax} sem.`}
          </span>
        </div>
        <Slider
          min={4}
          max={18}
          step={1}
          value={[duracionActual]}
          onValueChange={([val]) =>
            onChange({
              ...filtros,
              duracionMax: val >= 18 ? null : val,
            })
          }
          aria-label="Duración real máxima en semestres"
        />
        <div className="flex justify-between text-[11px] text-[#5c5c58] tabular-nums">
          <span>4 sem.</span>
          <span>18+ sem.</span>
        </div>
      </div>

      {/* Acreditación */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-[#5c5c58]">
          Acreditación institución
        </label>
        <Select
          value={String(filtros.acredMin)}
          onValueChange={(v) =>
            onChange({ ...filtros, acredMin: Number(v) as 0 | 1 | 4 | 6 })
          }
        >
          <SelectTrigger aria-label="Acreditación institución" className="w-full border-[#d4d4ce] bg-white text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Todas las instituciones</SelectItem>
            <SelectItem value="1">Solo acreditadas (≥ 1 año)</SelectItem>
            <SelectItem value="4">Acreditación ≥ 4 años</SelectItem>
            <SelectItem value="6">Excelencia ≥ 6 años</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vacantes mínimas */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-[#5c5c58]">
          Vacantes mínimas 2026
        </label>
        <Select
          value={String(filtros.vacantesMin)}
          onValueChange={(v) =>
            onChange({ ...filtros, vacantesMin: Number(v) as 0 | 50 | 100 })
          }
        >
          <SelectTrigger aria-label="Vacantes mínimas 2026" className="w-full border-[#d4d4ce] bg-white text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Cualquiera</SelectItem>
            <SelectItem value="50">≥ 50 vacantes</SelectItem>
            <SelectItem value="100">≥ 100 vacantes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mínimo de titulados */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-[#5c5c58]">
          Mínimo de titulados 2024
        </label>
        <Select
          value={String(filtros.tituladosMin)}
          onValueChange={(v) =>
            onChange({ ...filtros, tituladosMin: Number(v) as 0 | 50 | 100 })
          }
        >
          <SelectTrigger aria-label="Mínimo de titulados 2024" className="w-full border-[#d4d4ce] bg-white text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Cualquiera</SelectItem>
            <SelectItem value="50">≥ 50 titulados</SelectItem>
            <SelectItem value="100">≥ 100 titulados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tu puntaje PAES */}
      <div className="space-y-1.5">
        <label
          htmlFor="filtro-paes-input"
          className="text-xs font-semibold uppercase tracking-wide text-[#5c5c58]"
        >
          Tu puntaje PAES (100–1000)
        </label>
        <input
          id="filtro-paes-input"
          type="number"
          min={100}
          max={1000}
          step={5}
          value={paesInput}
          onChange={(e) => handlePaesChange(e.target.value)}
          placeholder="Ej. 650 (opcional)"
          className="h-9 w-full rounded-md border border-[#d4d4ce] bg-white px-3 text-xs text-[#171716] tabular-nums placeholder:text-[#5c5c58] focus-visible:outline-2 focus-visible:outline-[#1063b8]"
        />
        <p className="text-[11px] leading-snug text-[#5c5c58]">
          Es el promedio de quienes se matricularon, no el puntaje de corte. El corte se conoce el 18-01-2027.
        </p>
      </div>
    </div>
  );
}

export function FiltrosAvanzados(props: FiltrosAvanzadosProps) {
  const activos = contarFiltrosActivos(props.filtros);

  return (
    <>
      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-[#d4d4ce] bg-white text-[#171716]"
            >
              <Filter className="size-4 text-[#1063b8]" />
              Filtros
              {activos > 0 ? (
                <Badge className="ml-0.5 bg-[#1063b8] px-1.5 py-0 text-[11px] text-white">
                  {activos}
                </Badge>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] overflow-y-auto bg-white p-5 sm:w-[360px]">
            <SheetHeader className="px-0 pb-3 text-left">
              <SheetTitle className="text-base font-bold text-[#171716]">
                Filtrar carreras
              </SheetTitle>
              <SheetDescription className="text-xs text-[#5c5c58]">
                {entero(props.totalResultados)} resultados con los criterios actuales.
              </SheetDescription>
            </SheetHeader>
            <PanelFiltrosContenido {...props} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside
        aria-label="Filtros de carreras"
        className="hidden w-72 shrink-0 rounded-xl border border-[#e2e2dc] bg-white p-5 lg:block"
      >
        <PanelFiltrosContenido {...props} />
      </aside>
    </>
  );
}
