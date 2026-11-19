"use client";

import * as React from "react";
import { Info, MapPin, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { TIPO_ETIQUETAS, type TipoIesKey } from "@/lib/datos/carreras-tipos";
import { entero, pesos } from "@/lib/datos/formato";
import { cn } from "@/lib/utils";

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
  { value: "Diurna", label: "Diurna (día)" },
  { value: "Vespertina", label: "Vespertina (tarde/noche)" },
  { value: "A Distancia", label: "Online (a distancia)" },
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
  areas,
  regiones,
  arancelP95,
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

  return (
    <div className="space-y-6 text-sm">
      {/* Grupo 1: Qué y dónde estudiar */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-foreground">Estudios y modalidad</p>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Tipo de institución</Label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["u", "ip", "cft"] as const).map((tk) => (
              <button
                key={tk}
                type="button"
                onClick={() => onChange({ ...filtros, tipo: tk })}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                  filtros.tipo === tk
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
                )}
              >
                {TIPO_ETIQUETAS[tk].corto}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Área del conocimiento</Label>
          <Select
            value={filtros.area || "__all__"}
            onValueChange={(v) => onChange({ ...filtros, area: v === "__all__" ? "" : v })}
          >
            <SelectTrigger aria-label="Área del conocimiento" className="w-full bg-card text-xs">
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

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Nivel</Label>
            <Select
              value={filtros.nivel || "__all__"}
              onValueChange={(v) => onChange({ ...filtros, nivel: v === "__all__" ? "" : v })}
            >
              <SelectTrigger aria-label="Nivel formativo" className="w-full bg-card text-xs">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos los niveles</SelectItem>
                <SelectItem value="Profesional">Profesional</SelectItem>
                <SelectItem value="Técnica de Nivel Superior">Técnica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Jornada</Label>
            <Select
              value={filtros.jornada || "__all__"}
              onValueChange={(v) => onChange({ ...filtros, jornada: v === "__all__" ? "" : v })}
            >
              <SelectTrigger aria-label="Jornada" className="w-full bg-card text-xs">
                <SelectValue placeholder="Cualquiera" />
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
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden="true" />
              Región donde se estudia
            </Label>
            {filtros.regiones.length > 0 ? (
              <button
                type="button"
                onClick={() => onChange({ ...filtros, regiones: [] })}
                className="text-xs font-medium text-blue-700 hover:underline"
              >
                Quitar ({filtros.regiones.length})
              </button>
            ) : null}
          </div>
          <div className="max-h-40 space-y-0.5 overflow-y-auto rounded-lg border border-border bg-muted/40 p-2">
            {regiones.map((reg) => {
              const checked = filtros.regiones.includes(reg);
              return (
                <label
                  key={reg}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs text-foreground transition-colors hover:bg-card"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRegion(reg)}
                    className="size-3.5 rounded border-input accent-slate-900"
                  />
                  <span className="truncate">{reg}</span>
                </label>
              );
            })}
          </div>
          <p className="flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
            <Info className="mt-0.5 size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span>Filtra dónde se imparte la carrera; los sueldos oficiales son nacionales.</span>
          </p>
        </div>
      </div>

      <Separator />

      {/* Grupo 2: Presupuesto y duración */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-foreground">Presupuesto y tiempo</p>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Arancel anual máximo</span>
            <span className="font-semibold text-foreground tabular-nums">
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
          <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums">
            <span>$0</span>
            <span>{pesos(maxArancelSlider)}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Duración real máxima</span>
            <span className="font-semibold text-foreground tabular-nums">
              {filtros.duracionMax === null
                ? "Sin límite"
                : `${(filtros.duracionMax / 2).toFixed(1).replace(".", ",")} años (${filtros.duracionMax} sem.)`}
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
          <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums">
            <span>2 años (4 sem.)</span>
            <span>9+ años</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Grupo 3: Admisión y muestra */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-foreground">Calidad y admisión</p>

        <div className="space-y-1.5">
          <Label htmlFor="filtro-paes-input" className="text-xs font-medium text-muted-foreground">
            Tu puntaje PAES estimado (100–1.000)
          </Label>
          <Input
            id="filtro-paes-input"
            type="number"
            min={100}
            max={1000}
            step={5}
            value={paesInput}
            onChange={(e) => handlePaesChange(e.target.value)}
            placeholder="Ej. 650 (opcional)"
            className="h-9 bg-card text-xs tabular-nums"
          />
          <p className="text-[11px] leading-snug text-muted-foreground">
            Se compara con el promedio de matriculados 2025, no con el puntaje de corte.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Acreditación institucional</Label>
          <Select
            value={String(filtros.acredMin)}
            onValueChange={(v) =>
              onChange({ ...filtros, acredMin: Number(v) as 0 | 1 | 4 | 6 })
            }
          >
            <SelectTrigger aria-label="Acreditación institución" className="w-full bg-card text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Todas las instituciones</SelectItem>
              <SelectItem value="1">Solo acreditadas (≥ 1 año)</SelectItem>
              <SelectItem value="4">Avanzada (≥ 4 años)</SelectItem>
              <SelectItem value="6">Excelencia (≥ 6 años)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Vacantes 2026</Label>
            <Select
              value={String(filtros.vacantesMin)}
              onValueChange={(v) =>
                onChange({ ...filtros, vacantesMin: Number(v) as 0 | 50 | 100 })
              }
            >
              <SelectTrigger aria-label="Vacantes mínimas 2026" className="w-full bg-card text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Cualquiera</SelectItem>
                <SelectItem value="50">≥ 50 vacantes</SelectItem>
                <SelectItem value="100">≥ 100 vacantes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Titulados 2024</Label>
            <Select
              value={String(filtros.tituladosMin)}
              onValueChange={(v) =>
                onChange({ ...filtros, tituladosMin: Number(v) as 0 | 50 | 100 })
              }
            >
              <SelectTrigger aria-label="Mínimo de titulados 2024" className="w-full bg-card text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Cualquiera</SelectItem>
                <SelectItem value="50">≥ 50 titulados</SelectItem>
                <SelectItem value="100">≥ 100 titulados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FiltrosAvanzados(props: FiltrosAvanzadosProps) {
  const activos = contarFiltrosActivos(props.filtros);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-lg bg-card px-3 text-xs font-medium text-foreground shadow-xs"
        >
          <SlidersHorizontal className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span>Más filtros</span>
          {activos > 0 ? (
            <Badge className="ml-0.5 h-4.5 min-w-4.5 rounded-full px-1.5 text-[10px] font-semibold">
              {activos}
            </Badge>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-card p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="text-base font-semibold text-foreground">
            Filtrar carreras
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {entero(props.totalResultados)} carreras coinciden con tus criterios actuales.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <PanelFiltrosContenido {...props} />
        </div>

        <SheetFooter className="flex-row items-center justify-between gap-2 border-t border-border bg-muted/30 px-5 py-3.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={props.onReset}
            disabled={activos === 0}
            className="h-9 gap-1.5 text-xs text-muted-foreground"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Limpiar filtros
          </Button>
          <SheetClose
            render={
              <Button type="button" size="sm" className="h-9 px-4 text-xs font-medium" />
            }
          >
            Ver {entero(props.totalResultados)} carreras
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
