"use client";

import * as React from "react";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowUpRight, Calculator, Info } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { trackEvent, trackEventOnce } from "@/lib/analytics/marketing";
import {
  TIPO_ETIQUETAS,
  TIPO_ORDEN,
  type RankingItem,
  type TipoIesKey,
} from "@/lib/datos/carreras-tipos";
import { mesCorto, pesos } from "@/lib/datos/formato";
import { ajustarPorIpc } from "@/lib/datos/ipc";
import { cn } from "@/lib/utils";

interface ProgramaCompacto {
  s: string;
  i: string;
  n: string;
  r: string;
  j: string;
  a: number | null;
  d: number | null;
}

export function CalculadoraRetorno({
  ranking,
  pesosDe,
}: {
  ranking: RankingItem[];
  edicion?: string;
  pesosDe: string;
}) {
  const carrerasUnicas = React.useMemo(() => {
    const mapa = new Map<string, { slug: string; nombre: string; area: string }>();
    for (const r of ranking) {
      if (!mapa.has(r.slug)) {
        mapa.set(r.slug, { slug: r.slug, nombre: r.nombre, area: r.area });
      }
    }
    return Array.from(mapa.values()).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }, [ranking]);

  const defaultSlug = React.useMemo(() => {
    if (ranking.some((r) => r.slug === "ingenieria-civil-industrial")) {
      return "ingenieria-civil-industrial";
    }
    return carrerasUnicas[0]?.slug ?? "";
  }, [ranking, carrerasUnicas]);

  const [slug, setSlug] = React.useState(defaultSlug);
  const tiposDisponibles = React.useMemo(() => {
    const set = new Set(ranking.filter((r) => r.slug === slug).map((r) => r.tipo));
    return TIPO_ORDEN.filter((t) => set.has(t));
  }, [ranking, slug]);

  const [tipo, setTipo] = React.useState<TipoIesKey>("u");

  React.useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const cParam = sp.get("c");
    const tParam = sp.get("t");
    if (cParam && ranking.some((r) => r.slug === cParam)) {
      setSlug(cParam);
    }
    if (tParam === "u" || tParam === "ip" || tParam === "cft") {
      setTipo(tParam);
    }
  }, [ranking]);

  React.useEffect(() => {
    if (tiposDisponibles.length > 0 && !tiposDisponibles.includes(tipo)) {
      setTipo(tiposDisponibles[0]);
    }
  }, [tiposDisponibles, tipo]);

  const itemActual = React.useMemo(
    () =>
      ranking.find((r) => r.slug === slug && r.tipo === tipo) ??
      ranking.find((r) => r.slug === slug) ??
      null,
    [ranking, slug, tipo]
  );

  const [conGratuidad, setConGratuidad] = React.useState(false);
  const [arancelAnual, setArancelAnual] = React.useState<number>(
    itemActual?.arancel_med ?? 4_500_000
  );
  const [anosReales, setAnosReales] = React.useState<number>(
    itemActual?.dur_real ? Math.round((itemActual.dur_real / 2) * 10) / 10 : 5
  );
  const [costoTitulacion, setCostoTitulacion] = React.useState<number>(
    itemActual?.costo_tit_med ?? 0
  );
  const [sueldoAlternativo, setSueldoAlternativo] = React.useState<string>("");

  const [programasCache, setProgramasCache] = React.useState<
    Partial<Record<TipoIesKey, ProgramaCompacto[]>>
  >({});
  const [cargandoProgramas, setCargandoProgramas] = React.useState(false);
  const [institucionSeleccionada, setInstitucionSeleccionada] = React.useState<string>("mediana");

  React.useEffect(() => {
    trackEventOnce("datos_view_retorno", "datos_view", { pagina: "retorno" });
  }, []);

  React.useEffect(() => {
    if (!itemActual) return;
    setArancelAnual(itemActual.arancel_med ?? 4_000_000);
    setAnosReales(
      itemActual.dur_real
        ? Math.round((itemActual.dur_real / 2) * 10) / 10
        : itemActual.dur_formal
          ? Math.round((itemActual.dur_formal / 2) * 10) / 10
          : 5
    );
    setCostoTitulacion(itemActual.costo_tit_med ?? 0);
    setInstitucionSeleccionada("mediana");
  }, [itemActual]);

  const cargarProgramasTipo = React.useCallback(
    async (t: TipoIesKey) => {
      if (programasCache[t]) return;
      setCargandoProgramas(true);
      try {
        const res = await fetch(`/datos/carreras/programas-${t}.json`);
        if (res.ok) {
          const data = (await res.json()) as ProgramaCompacto[];
          setProgramasCache((prev) => ({ ...prev, [t]: data }));
        }
      } catch {
        // ignore network error
      } finally {
        setCargandoProgramas(false);
      }
    },
    [programasCache]
  );

  React.useEffect(() => {
    cargarProgramasTipo(tipo);
  }, [tipo, cargarProgramasTipo]);

  const programasCarrera = React.useMemo(() => {
    const lista = programasCache[tipo] ?? [];
    return lista
      .filter((p) => p.s === slug && p.a !== null && p.a > 0)
      .sort((a, b) => (a.a ?? 0) - (b.a ?? 0));
  }, [programasCache, tipo, slug]);

  const handleSeleccionarInstitucion = (idxStr: string) => {
    setInstitucionSeleccionada(idxStr);
    if (idxStr === "mediana") {
      if (itemActual?.arancel_med) setArancelAnual(itemActual.arancel_med);
      return;
    }
    const idx = Number(idxStr);
    const prog = programasCarrera[idx];
    if (prog?.a) {
      setArancelAnual(prog.a);
      setConGratuidad(false);
      trackEvent("datos_calc", {
        calculadora: "retorno",
        slug,
        tipo,
        institucion: prog.i,
      });
    }
  };

  const arancelEfectivo = conGratuidad ? 0 : arancelAnual;
  const costoTotal = Math.round(arancelEfectivo * anosReales + costoTitulacion);

  const ipcIng1 = React.useMemo(() => {
    if (!itemActual?.ing1) return null;
    const adj = ajustarPorIpc(itemActual.ing1, "2025-09");
    return adj
      ? { ...adj, original: itemActual.ing1 }
      : {
          montoAjustado: itemActual.ing1,
          factor: 1,
          ipcDesde: 109.14,
          ipcHasta: 109.14,
          mesHasta: "2025-09",
          original: itemActual.ing1,
        };
  }, [itemActual]);

  const ipcIng4 = React.useMemo(() => {
    if (!itemActual?.ing4) return null;
    const adj = ajustarPorIpc(itemActual.ing4, "2025-09");
    return adj
      ? { ...adj, original: itemActual.ing4 }
      : {
          montoAjustado: itemActual.ing4,
          factor: 1,
          ipcDesde: 109.14,
          ipcHasta: 109.14,
          mesHasta: "2025-09",
          original: itemActual.ing4,
        };
  }, [itemActual]);

  const mesesEquiv1 =
    ipcIng1 && ipcIng1.montoAjustado > 0 ? costoTotal / ipcIng1.montoAjustado : null;
  const mesesEquiv4 =
    ipcIng4 && ipcIng4.montoAjustado > 0 ? costoTotal / ipcIng4.montoAjustado : null;

  const sueldoAltNum = Number(sueldoAlternativo.replace(/[^\d]/g, ""));
  const costoOportunidad =
    sueldoAlternativo.trim() !== "" && Number.isFinite(sueldoAltNum) && sueldoAltNum > 0
      ? Math.round(sueldoAltNum * 12 * anosReales)
      : null;

  const handleTrackCalc = () => {
    trackEvent("datos_calc", {
      calculadora: "retorno",
      slug,
      tipo,
      gratuidad: conGratuidad,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      {/* Panel de supuestos editables */}
      <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-2">
            <Calculator className="size-4 text-blue-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">Personaliza tus supuestos</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="space-y-1.5">
              <Label htmlFor="retorno-carrera" className="text-xs font-medium text-muted-foreground">
                Carrera
              </Label>
              <Select
                value={slug}
                onValueChange={(v) => {
                  setSlug(v);
                  trackEvent("datos_calc", { calculadora: "retorno", slug: v });
                }}
              >
                <SelectTrigger id="retorno-carrera" className="w-full bg-card">
                  <SelectValue placeholder="Selecciona una carrera" />
                </SelectTrigger>
                <SelectContent>
                  {carrerasUnicas.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="retorno-tipo" className="text-xs font-medium text-muted-foreground">
                Institución
              </Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as TipoIesKey)}>
                <SelectTrigger id="retorno-tipo" className="w-[155px] bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiposDisponibles.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TIPO_ETIQUETAS[t].corto} · {TIPO_ETIQUETAS[t].singular}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="retorno-inst" className="text-xs font-medium text-muted-foreground">
              Arancel de institución específica (opcional)
            </Label>
            <Select
              value={institucionSeleccionada}
              onValueChange={handleSeleccionarInstitucion}
              disabled={cargandoProgramas || programasCarrera.length === 0}
            >
              <SelectTrigger id="retorno-inst" className="w-full bg-card">
                <SelectValue
                  placeholder={
                    cargandoProgramas
                      ? "Cargando aranceles por institución..."
                      : "Usar arancel mediano nacional"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mediana">
                  Arancel mediano nacional ({pesos(itemActual?.arancel_med)})
                </SelectItem>
                {programasCarrera.map((p, idx) => (
                  <SelectItem key={`${p.i}-${p.r}-${p.j}-${idx}`} value={String(idx)}>
                    {p.i} ({p.j}, {p.r}) — {pesos(p.a)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
            <div>
              <Label htmlFor="retorno-gratuidad" className="text-sm font-medium text-foreground">
                Estudio con gratuidad o beca
              </Label>
              <p className="text-xs text-muted-foreground">
                Fija el arancel anual en $0 para evaluar solo titulación o costo alternativo.
              </p>
            </div>
            <Switch
              id="retorno-gratuidad"
              checked={conGratuidad}
              onCheckedChange={(checked) => {
                setConGratuidad(checked);
                handleTrackCalc();
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="retorno-arancel" className="font-medium text-muted-foreground">
                Arancel anual (2026)
              </Label>
              <span className="font-semibold text-foreground tabular-nums">
                {pesos(arancelEfectivo)}
              </span>
            </div>
            <Slider
              id="retorno-arancel"
              min={500_000}
              max={12_000_000}
              step={50_000}
              disabled={conGratuidad}
              value={[arancelAnual]}
              onValueChange={([v]) => setArancelAnual(v)}
              onValueCommit={handleTrackCalc}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="retorno-anos" className="font-medium text-muted-foreground">
                Años reales de estudio (prom. oficial:{" "}
                {itemActual?.dur_real
                  ? `${(itemActual.dur_real / 2).toFixed(1).replace(".", ",")} años`
                  : "s/i"}
                )
              </Label>
              <span className="font-semibold text-foreground tabular-nums">
                {anosReales.toFixed(1).replace(".", ",")} años
              </span>
            </div>
            <Slider
              id="retorno-anos"
              min={1.5}
              max={9}
              step={0.5}
              value={[anosReales]}
              onValueChange={([v]) => setAnosReales(v)}
              onValueCommit={handleTrackCalc}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="retorno-titulacion" className="text-xs font-medium text-muted-foreground">
                Costo de titulación (CLP)
              </Label>
              <Input
                id="retorno-titulacion"
                type="number"
                min={0}
                step={10000}
                value={costoTitulacion}
                onChange={(e) => setCostoTitulacion(Math.max(0, Number(e.target.value) || 0))}
                onBlur={handleTrackCalc}
                className="h-9 bg-card tabular-nums"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="retorno-alt" className="text-xs font-medium text-muted-foreground">
                Sueldo alternativo si no estudias (opcional)
              </Label>
              <Input
                id="retorno-alt"
                type="number"
                min={0}
                step={50000}
                placeholder="Ej. 550000"
                value={sueldoAlternativo}
                onChange={(e) => setSueldoAlternativo(e.target.value)}
                onBlur={handleTrackCalc}
                className="h-9 bg-card tabular-nums"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de resultados */}
      <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
        <CardContent className="flex h-full flex-col justify-between gap-5 p-6">
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-muted/35 p-5">
              <p className="text-xs font-medium text-muted-foreground">
                Costo directo estimado de estudiar
              </p>
              <p className="mt-1.5 text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-4xl">
                {pesos(costoTotal)}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {conGratuidad
                  ? `Solo costo de titulación (${pesos(costoTitulacion)}) durante ${anosReales
                      .toFixed(1)
                      .replace(".", ",")} años.`
                  : `${pesos(arancelEfectivo)} × ${anosReales
                      .toFixed(1)
                      .replace(".", ",")} años + ${pesos(costoTitulacion)} titulación.`}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">En sueldos del 1.er año</p>
                <p className="mt-1 text-2xl font-bold text-blue-700 tabular-nums">
                  {mesesEquiv1 !== null
                    ? `${mesesEquiv1.toFixed(1).replace(".", ",")} meses`
                    : "Sin dato"}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Sueldo 1.er año hoy: {pesos(ipcIng1?.montoAjustado ?? null)}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">En sueldos del 4.º año</p>
                <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
                  {mesesEquiv4 !== null
                    ? `${mesesEquiv4.toFixed(1).replace(".", ",")} meses`
                    : "Sin dato"}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Sueldo 4.º año hoy: {pesos(ipcIng4?.montoAjustado ?? null)}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-foreground">Resumen visual</p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <div className="flex-1 rounded-md bg-muted/70 px-3 py-2.5">
                  <span className="block font-semibold text-foreground">
                    1. Estudio ({anosReales.toFixed(1).replace(".", ",")} años)
                  </span>
                  <span className="text-muted-foreground">Inversión: {pesos(costoTotal)}</span>
                </div>
                <span className="text-muted-foreground">→</span>
                <div className="flex-1 rounded-md border border-blue-200/80 bg-blue-50/70 px-3 py-2.5">
                  <span className="block font-semibold text-blue-800">2. Equivalencia bruta</span>
                  <span className="text-muted-foreground">
                    {mesesEquiv4 !== null
                      ? `${mesesEquiv4.toFixed(1).replace(".", ",")} meses de sueldo (4.º año)`
                      : "Sin dato de ingreso"}
                  </span>
                </div>
              </div>
              {costoOportunidad !== null ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Considerando el sueldo alternativo ({pesos(sueldoAltNum)}/mes durante{" "}
                  {anosReales.toFixed(1).replace(".", ",")} años), dejarías de percibir{" "}
                  <strong className="font-semibold text-foreground">
                    {pesos(costoOportunidad)}
                  </strong>{" "}
                  brutos mientras estudias.
                </p>
              ) : null}
            </div>

            {ipcIng4 ? (
              <p className="text-[11px] text-muted-foreground">
                Los sueldos oficiales de {pesosDe} fueron actualizados por IPC a{" "}
                {mesCorto(ipcIng4.mesHasta)} (factor{" "}
                {ipcIng4.factor.toFixed(3).replace(".", ",")}) para compararlos con el arancel 2026.
              </p>
            ) : null}
          </div>

          <div className="space-y-3 border-t border-border/70 pt-4">
            <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden="true" />
              <p>
                Estimación referencial con supuestos ajustables. No considera impuestos,
                cotizaciones, gastos de vida ni vocación personal.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/datos/carreras/${slug}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-8 bg-card text-xs"
                )}
              >
                Ver ficha de carrera
                <ArrowUpRight className="ml-1 size-3.5" aria-hidden="true" />
              </Link>
              <Link
                href={`/datos/carreras/comparar?c=${slug}&t=${tipo}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-8 bg-card text-xs"
                )}
              >
                Comparar con otra carrera
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
