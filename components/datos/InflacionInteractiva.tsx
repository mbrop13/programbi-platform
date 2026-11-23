"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Calculator,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Link2,
  Scale,
  Table2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { TradingViewIpcChart } from "@/components/datos/charts/TradingViewIpcChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackEvent, trackEventOnce } from "@/lib/analytics/marketing";
import { mesCorto, mesLargo, pesos, variacionPorcentual } from "@/lib/datos/formato";
import { ajustarPorIpc, variacionIpc, type PuntoIpc } from "@/lib/datos/ipc";
import { cn } from "@/lib/utils";

const MONTOS_RAPIDOS = [
  { valor: 500_000, etiqueta: "Sueldo mínimo ref." },
  { valor: 650_000, etiqueta: "Arriendo" },
  { valor: 1_000_000, etiqueta: "Sueldo $1M" },
  { valor: 4_500_000, etiqueta: "Arancel anual" },
] as const;

const REFERENCIAS_COTIDIANAS = [
  { concepto: "Compra semanal de supermercado", monto: 60_000 },
  { concepto: "Cuentas básicas del hogar", monto: 150_000 },
  { concepto: "Sueldo mínimo referencial", monto: 500_000 },
  { concepto: "Arriendo mensual promedio", monto: 650_000 },
  { concepto: "Sueldo profesional base", monto: 1_000_000 },
  { concepto: "Sueldo profesional consolidado", monto: 2_000_000 },
  { concepto: "Arancel universitario anual", monto: 4_500_000 },
] as const;

type FrecuenciaMonto = "mensual" | "anual" | "unico";

function capitalizar(texto: string): string {
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : "";
}

function getMesHace12(ym: string): string {
  const [yStr, mStr] = ym.split("-");
  const y = Number(yStr);
  if (!Number.isFinite(y) || !mStr) return "";
  return `${y - 1}-${mStr}`;
}

function formatearMiles(rawDigits: string): string {
  if (!rawDigits) return "";
  const num = Number(rawDigits);
  if (!Number.isFinite(num)) return "";
  return num.toLocaleString("es-CL");
}

function parseDigits(val: string): number {
  const limpio = Number(val.replace(/[^\d]/g, ""));
  return Number.isFinite(limpio) && limpio >= 0 ? limpio : 0;
}

export interface InflacionInteractivaProps {
  serie: readonly PuntoIpc[];
  defaultDesde?: string;
  defaultHasta?: string;
}

export function InflacionInteractiva({
  serie,
  defaultDesde,
  defaultHasta,
}: InflacionInteractivaProps) {
  const primerMes = serie[0]?.m ?? "2024-01";
  const ultimoMes = serie[serie.length - 1]?.m ?? "2026-10";
  const mesHace12 = getMesHace12(ultimoMes);
  const inicialDesde =
    defaultDesde && serie.some((p) => p.m === defaultDesde)
      ? defaultDesde
      : serie.some((p) => p.m === mesHace12)
        ? mesHace12
        : serie.some((p) => p.m === "2025-09")
          ? "2025-09"
          : primerMes;
  const inicialHasta =
    defaultHasta && serie.some((p) => p.m === defaultHasta) ? defaultHasta : ultimoMes;

  const [tabActiva, setTabActiva] = useState<string>("ajustar");
  const [montoRaw, setMontoRaw] = useState<string>("1000000");
  const [frecuencia, setFrecuencia] = useState<FrecuenciaMonto>("mensual");
  const [mesOrigen, setMesOrigen] = useState<string>(inicialDesde);
  const [mesDestino, setMesDestino] = useState<string>(inicialHasta);
  const [verFormula, setVerFormula] = useState<boolean>(false);

  // Tab 2: Comparador de sueldo real
  const [sueldoAntesRaw, setSueldoAntesRaw] = useState<string>("1000000");
  const [sueldoHoyRaw, setSueldoHoyRaw] = useState<string>("1080000");

  const [copiadoResumen, setCopiadoResumen] = useState<boolean>(false);

  useEffect(() => {
    trackEventOnce("datos_view:inflacion", "datos_view", { pagina: "inflacion" });
  }, []);

  // Restaurar parámetros desde la URL tras hidratar (SSR-safe)
  useEffect(() => {
    const syncFromUrl = () => {
      const sp = new URLSearchParams(window.location.search);
      const mParam = sp.get("monto");
      const dParam = sp.get("desde");
      const hParam = sp.get("hasta");
      if (mParam && /^\d+$/.test(mParam)) setMontoRaw(mParam);
      if (dParam && serie.some((p) => p.m === dParam)) setMesOrigen(dParam);
      if (hParam && serie.some((p) => p.m === hParam)) setMesDestino(hParam);
    };
    const timer = window.setTimeout(syncFromUrl, 0);
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, [serie]);

  const monto = useMemo(() => parseDigits(montoRaw), [montoRaw]);
  const sueldoAntes = useMemo(() => parseDigits(sueldoAntesRaw), [sueldoAntesRaw]);
  const sueldoHoy = useMemo(() => parseDigits(sueldoHoyRaw), [sueldoHoyRaw]);

  const calculo = useMemo(
    () => ajustarPorIpc(monto, mesOrigen, mesDestino, serie),
    [monto, mesOrigen, mesDestino, serie]
  );

  const variacion = useMemo(
    () => variacionIpc(mesOrigen, mesDestino, serie),
    [mesOrigen, mesDestino, serie]
  );

  // Métricas humanas derivadas del ajuste
  const diferenciaPesos = calculo ? calculo.montoAjustado - monto : null;
  const poderCompraSinReajuste =
    calculo && calculo.factor > 0 ? Math.round(monto / calculo.factor) : null;
  const perdidaPctSinReajuste =
    calculo && calculo.factor > 0 ? (1 / calculo.factor - 1) : null;
  // Pérdida (o ganancia, si las fechas van hacia atrás o hubo deflación) de poder de compra.
  const perdidaPesos = poderCompraSinReajuste !== null ? monto - poderCompraSinReajuste : null;
  const pierde = (perdidaPesos ?? 0) > 0;

  // Cálculo Tab 2: ¿Mi sueldo le ganó a la inflación?
  const comparacionSueldo = useMemo(() => {
    if (sueldoAntes <= 0) return null;
    const empate = ajustarPorIpc(sueldoAntes, mesOrigen, mesDestino, serie);
    if (!empate) return null;
    const brechaMensual = sueldoHoy - empate.montoAjustado;
    const brechaAnual = brechaMensual * 12;
    const varNominal = (sueldoHoy - sueldoAntes) / sueldoAntes;
    const varIpcVal = empate.factor - 1;
    const varReal = (1 + varNominal) / empate.factor - 1;
    return {
      sueldoEmpate: empate.montoAjustado,
      brechaMensual,
      brechaAnual,
      varNominal,
      varIpc: varIpcVal,
      varReal,
      estado:
        Math.abs(brechaMensual) < 500
          ? ("empate" as const)
          : brechaMensual > 0
            ? ("gana" as const)
            : ("pierde" as const),
    };
  }, [sueldoAntes, sueldoHoy, mesOrigen, mesDestino, serie]);

  const notificarCalculo = (tipo = "ipc") => {
    trackEvent("datos_calc", { calculadora: tipo });
  };

  const handleMontoChange = (val: string) => {
    setMontoRaw(val.replace(/[^\d]/g, "").slice(0, 12));
    notificarCalculo("ipc");
  };

  const handleOrigenChange = (val: string) => {
    setMesOrigen(val);
    notificarCalculo("ipc");
  };

  const handleDestinoChange = (val: string) => {
    setMesDestino(val);
    notificarCalculo("ipc");
  };

  const handleSwap = () => {
    setMesOrigen(mesDestino);
    setMesDestino(mesOrigen);
    notificarCalculo("ipc");
  };

  const copiarResultado = async () => {
    if (!calculo) return;
    const rinde = calculo.factor > 0 ? Math.round(monto / calculo.factor) : monto;
    const texto = `${pesos(monto)} de ${mesLargo(mesOrigen)} en ${mesLargo(mesDestino)} compran lo mismo que ${pesos(
      rinde
    )}. Para comprar lo mismo que antes se necesitan ${pesos(calculo.montoAjustado)} (${
      variacion !== null ? variacionPorcentual(variacion) : ""
    } de IPC según el INE). Calculado en programbi.com/datos/inflacion`;
    try {
      await navigator.clipboard.writeText(texto);
      setCopiadoResumen(true);
      toast.success("Resultado copiado al portapapeles");
      window.setTimeout(() => setCopiadoResumen(false), 2000);
    } catch {
      toast.error("No se pudo copiar el resultado");
    }
  };

  const copiarEnlace = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("monto", String(monto));
      url.searchParams.set("desde", mesOrigen);
      url.searchParams.set("hasta", mesDestino);
      await navigator.clipboard.writeText(url.toString());
      toast.success("Enlace con tu cálculo copiado");
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };


  return (
    <div className="space-y-8">
      {/* Primero la serie: el gráfico da contexto antes de la calculadora */}
      <TradingViewIpcChart serie={serie} />

      {/* Herramienta principal con 3 modos */}
      <Card className="gap-0 overflow-hidden rounded-[1.5rem] border border-line bg-card py-0 shadow-none ring-0">
        <Tabs value={tabActiva} onValueChange={setTabActiva} className="gap-0">
          <div className="border-b border-border bg-muted/35 px-4 pt-4 pb-3 sm:px-6">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-wash p-1 sm:w-fit">
              <TabsTrigger
                value="ajustar"
                className="h-10 gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
              >
                <Calculator className="size-3.5" aria-hidden="true" />
                Poder de compra
              </TabsTrigger>
              <TabsTrigger
                value="sueldo"
                className="h-10 gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
              >
                <Scale className="size-3.5" aria-hidden="true" />
                ¿Mi sueldo le ganó al IPC?
              </TabsTrigger>
              <TabsTrigger
                value="referencias"
                className="h-10 gap-1.5 rounded-lg px-3.5 text-sm font-semibold"
              >
                <Table2 className="size-3.5" aria-hidden="true" />
                Ejemplos cotidianos
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: AJUSTAR UN MONTO */}
          <TabsContent value="ajustar" className="p-5 sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="ipc-monto" className="text-sm font-medium text-foreground">
                      Monto de origen
                    </Label>
                    <span className="text-xs text-muted-foreground">Pesos chilenos (CLP)</span>
                  </div>

                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-lg font-medium text-muted-foreground"
                    >
                      $
                    </span>
                    <Input
                      id="ipc-monto"
                      type="text"
                      inputMode="numeric"
                      value={formatearMiles(montoRaw)}
                      onChange={(e) => handleMontoChange(e.target.value)}
                      placeholder="1.000.000"
                      className="h-12 rounded-lg border-input bg-background/60 pr-4 pl-8 text-xl font-semibold text-foreground tabular-nums focus-visible:bg-card"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {MONTOS_RAPIDOS.map((preset) => {
                      const activo = monto === preset.valor;
                      return (
                        <Button
                          key={preset.valor}
                          type="button"
                          variant={activo ? "default" : "outline"}
                          size="xs"
                          onClick={() => handleMontoChange(String(preset.valor))}
                          className={cn(
                            "h-7 rounded-md px-2.5 text-xs font-medium tabular-nums",
                            !activo && "bg-card text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {preset.etiqueta}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Frecuencia para mostrar impacto anual */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Tipo de monto (para ver el impacto anual)
                  </Label>
                  <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-muted p-1">
                    {(
                      [
                        { id: "mensual", label: "Mensual" },
                        { id: "anual", label: "Anual" },
                        { id: "unico", label: "Monto único" },
                      ] as const
                    ).map((op) => (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => setFrecuencia(op.id)}
                        aria-pressed={frecuencia === op.id}
                        className={cn(
                          "rounded-md py-1.5 text-xs font-medium transition-all",
                          frecuencia === op.id
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fechas origen / destino con shadcn Select */}
                <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
                  <div className="space-y-1.5">
                    <Label htmlFor="ipc-mes-origen" className="text-xs font-medium text-muted-foreground">
                      Desde qué fecha
                    </Label>
                    <Select value={mesOrigen} onValueChange={handleOrigenChange}>
                      <SelectTrigger
                        id="ipc-mes-origen"
                        aria-label="Mes de origen"
                        className="h-10 w-full bg-card text-sm font-medium"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {serie.map((p) => (
                          <SelectItem key={p.m} value={p.m}>
                            {capitalizar(mesLargo(p.m))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleSwap}
                    aria-label="Invertir fecha de origen y destino"
                    title="Invertir fechas"
                    className="h-10 w-full bg-card sm:w-10"
                  >
                    <ArrowLeftRight className="size-4" aria-hidden="true" />
                  </Button>

                  <div className="space-y-1.5">
                    <Label htmlFor="ipc-mes-destino" className="text-xs font-medium text-muted-foreground">
                      Hasta qué fecha
                    </Label>
                    <Select value={mesDestino} onValueChange={handleDestinoChange}>
                      <SelectTrigger
                        id="ipc-mes-destino"
                        aria-label="Mes de destino"
                        className="h-10 w-full bg-card text-sm font-medium"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {serie.map((p) => (
                          <SelectItem key={p.m} value={p.m}>
                            {capitalizar(mesLargo(p.m))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
                  <span>Cálculo exacto con índice oficial del INE</span>
                  <a
                    href="https://calculadoraipc.ine.cl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline"
                  >
                    ¿Necesitas fechas anteriores? Ir al INE
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Panel de resultado */}
              <div className="flex flex-col justify-between rounded-[1.25rem] border border-ipc/40 bg-ipc-suave p-5 sm:p-6">
                <div>
                  {/* Lo principal: cuánto rinde hoy el monto si no se reajustó (pérdida de poder de compra) */}
                  <p className="text-sm font-medium text-foreground">
                    {pesos(monto)} de {mesLargo(mesOrigen)}, en {mesLargo(mesDestino)} compran lo mismo que
                  </p>

                  <p className="kpi-hero mt-2 text-foreground tabular-nums">
                    {calculo && poderCompraSinReajuste !== null ? pesos(poderCompraSinReajuste) : "Sin dato"}
                  </p>

                  {calculo && perdidaPesos !== null && perdidaPctSinReajuste !== null ? (
                    <p
                      className={cn(
                        "mt-3 inline-flex flex-wrap items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold tabular-nums",
                        pierde ? "bg-ipc text-foreground" : "bg-empleo text-white"
                      )}
                    >
                      {pierde ? (
                        <TrendingDown className="size-4" aria-hidden="true" />
                      ) : (
                        <TrendingUp className="size-4" aria-hidden="true" />
                      )}
                      {pierde ? "Pierden" : "Ganan"} {pesos(Math.abs(perdidaPesos))} de poder de compra (
                      {Math.abs(perdidaPctSinReajuste * 100).toFixed(1).replace(".", ",")} %)
                    </p>
                  ) : null}

                  {!calculo ? (
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      Selecciona dos fechas válidas para calcular el ajuste por inflación.
                    </p>
                  ) : null}

                  {calculo && diferenciaPesos !== null ? (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-card p-3.5">
                        <p className="text-xs font-medium text-muted-foreground">
                          Para comprar lo mismo que antes
                        </p>
                        <p className="mt-1 text-base font-semibold text-foreground tabular-nums">
                          {pesos(calculo.montoAjustado)}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                          {diferenciaPesos >= 0 ? "+" : ""}
                          {pesos(diferenciaPesos)} de reajuste necesario
                        </p>
                      </div>

                      <div className="rounded-lg border border-border bg-card p-3.5">
                        <p className="text-xs font-medium text-muted-foreground">
                          {frecuencia === "mensual" ? "Si es un sueldo sin reajuste" : "Inflación del período"}
                        </p>
                        {frecuencia === "mensual" && perdidaPesos !== null ? (
                          <>
                            <p className="mt-1 text-base font-semibold text-foreground tabular-nums">
                              {pesos(Math.abs(perdidaPesos))} al mes
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {pierde ? "menos" : "más"} de poder de compra con precios de {mesCorto(mesDestino)}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="mt-1 text-base font-semibold text-foreground tabular-nums">
                              {variacion !== null ? variacionPorcentual(variacion) : "Sin dato"}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Variación del IPC entre ambas fechas
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Acciones y detalle colapsable */}
                <div className="mt-5 space-y-3 border-t border-border/70 pt-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copiarResultado}
                      className="h-8 gap-1.5 bg-card text-xs"
                    >
                      {copiadoResumen ? (
                        <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <Copy className="size-3.5 text-muted-foreground" aria-hidden="true" />
                      )}
                      {copiadoResumen ? "Copiado" : "Copiar resultado"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copiarEnlace}
                      className="h-8 gap-1.5 bg-card text-xs"
                    >
                      <Link2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
                      Compartir cálculo
                    </Button>
                  </div>

                  {calculo ? (
                    <Collapsible open={verFormula} onOpenChange={setVerFormula}>
                      <CollapsibleTrigger className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                        <ChevronDown
                          className={cn(
                            "size-3.5 transition-transform duration-150",
                            verFormula && "rotate-180"
                          )}
                          aria-hidden="true"
                        />
                        {verFormula ? "Ocultar cálculo paso a paso" : "Ver cómo se calcula paso a paso"}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2.5 rounded-lg border border-border bg-card p-3.5 text-xs">
                        <p className="font-medium text-foreground">Fórmula oficial del INE</p>
                        <p className="mt-1 font-mono text-[11px] text-muted-foreground tabular-nums">
                          {pesos(monto)} × ({calculo.ipcHasta.toFixed(2).replace(".", ",")} /{" "}
                          {calculo.ipcDesde.toFixed(2).replace(".", ",")}) ={" "}
                          <span className="font-semibold text-foreground">
                            {pesos(calculo.montoAjustado)}
                          </span>
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Factor de reajuste: {calculo.factor.toFixed(4).replace(".", ",")} · IPC{" "}
                          {mesCorto(mesOrigen)} ({calculo.ipcDesde.toFixed(2).replace(".", ",")}) →
                          IPC {mesCorto(mesDestino)} ({calculo.ipcHasta.toFixed(2).replace(".", ",")})
                        </p>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : null}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: ¿MI SUELDO LE GANÓ A LA INFLACIÓN? */}
          <TabsContent value="sueldo" className="p-5 sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Comprueba si tu sueldo ganó o perdió poder de compra
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Compara tu sueldo anterior con el actual y te mostramos cuánto debías recibir
                    solo para empatar la subida de precios.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="sueldo-antes" className="text-xs font-medium text-muted-foreground">
                      Sueldo en {mesLargo(mesOrigen)}
                    </Label>
                    <div className="relative">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground"
                      >
                        $
                      </span>
                      <Input
                        id="sueldo-antes"
                        type="text"
                        inputMode="numeric"
                        value={formatearMiles(sueldoAntesRaw)}
                        onChange={(e) => {
                          setSueldoAntesRaw(e.target.value.replace(/[^\d]/g, "").slice(0, 12));
                          notificarCalculo("ipc_sueldo_real");
                        }}
                        className="h-11 bg-background/60 pl-7 text-base font-semibold tabular-nums focus-visible:bg-card"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="sueldo-hoy" className="text-xs font-medium text-muted-foreground">
                      Sueldo en {mesLargo(mesDestino)}
                    </Label>
                    <div className="relative">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground"
                      >
                        $
                      </span>
                      <Input
                        id="sueldo-hoy"
                        type="text"
                        inputMode="numeric"
                        value={formatearMiles(sueldoHoyRaw)}
                        onChange={(e) => {
                          setSueldoHoyRaw(e.target.value.replace(/[^\d]/g, "").slice(0, 12));
                          notificarCalculo("ipc_sueldo_real");
                        }}
                        className="h-11 bg-background/60 pl-7 text-base font-semibold tabular-nums focus-visible:bg-card"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Fecha inicial</Label>
                    <Select value={mesOrigen} onValueChange={handleOrigenChange}>
                      <SelectTrigger className="h-10 w-full bg-card text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {serie.map((p) => (
                          <SelectItem key={p.m} value={p.m}>
                            {capitalizar(mesLargo(p.m))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Fecha actual</Label>
                    <Select value={mesDestino} onValueChange={handleDestinoChange}>
                      <SelectTrigger className="h-10 w-full bg-card text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {serie.map((p) => (
                          <SelectItem key={p.m} value={p.m}>
                            {capitalizar(mesLargo(p.m))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-xl border border-border bg-muted/35 p-5 sm:p-6">
                {comparacionSueldo ? (
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "h-auto rounded-md px-2.5 py-1 text-xs font-semibold",
                          comparacionSueldo.estado === "gana" &&
                            "border border-emerald-200 bg-emerald-50 text-emerald-800",
                          comparacionSueldo.estado === "pierde" &&
                            "border border-rose-200 bg-rose-50 text-rose-800",
                          comparacionSueldo.estado === "empate" &&
                            "border border-border bg-card text-foreground"
                        )}
                      >
                        {comparacionSueldo.estado === "gana"
                          ? "Le ganaste a la inflación"
                          : comparacionSueldo.estado === "pierde"
                            ? "Perdiste poder de compra"
                            : "Empataste con la inflación"}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground tabular-nums">
                        Variación real: {variacionPorcentual(comparacionSueldo.varReal)}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Diferencia real mensual frente al IPC
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-3xl font-bold tracking-tight tabular-nums sm:text-4xl",
                          comparacionSueldo.estado === "gana" && "text-emerald-700",
                          comparacionSueldo.estado === "pierde" && "text-rose-700",
                          comparacionSueldo.estado === "empate" && "text-foreground"
                        )}
                      >
                        {comparacionSueldo.brechaMensual >= 0 ? "+" : ""}
                        {pesos(comparacionSueldo.brechaMensual)}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">/mes</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                        Equivale a{" "}
                        <strong className="font-semibold text-foreground">
                          {comparacionSueldo.brechaAnual >= 0 ? "+" : ""}
                          {pesos(comparacionSueldo.brechaAnual)}
                        </strong>{" "}
                        en un año completo.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-card p-3.5">
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Para solo empatar al IPC
                        </p>
                        <p className="mt-1 text-base font-semibold text-foreground tabular-nums">
                          {pesos(comparacionSueldo.sueldoEmpate)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Inflación período: {variacionPorcentual(comparacionSueldo.varIpc)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-3.5">
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Cambio nominal de tu sueldo
                        </p>
                        <p className="mt-1 text-base font-semibold text-foreground tabular-nums">
                          {variacionPorcentual(comparacionSueldo.varNominal)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          De {pesos(sueldoAntes)} a {pesos(sueldoHoy)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Ingresa ambos sueldos para ver si tu remuneración superó la inflación del período.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: EJEMPLOS COTIDIANOS */}
          <TabsContent value="referencias" className="p-5 sm:p-7">
            <div className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    ¿Cuánto subieron distintos montos cotidianos?
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Equivalencia entre {mesLargo(mesOrigen)} y {mesLargo(mesDestino)}. Haz clic en
                    «Usar» para llevar cualquier monto a la calculadora.
                  </p>
                </div>
                {variacion !== null ? (
                  <Badge variant="secondary" className="tabular-nums">
                    IPC del tramo: {variacionPorcentual(variacion)}
                  </Badge>
                ) : null}
              </div>

              <div className="overflow-hidden rounded-lg border border-border">
                <Table className="tabular-nums">
                  <TableHeader className="bg-muted/60">
                    <TableRow className="hover:bg-muted/60">
                      <TableHead>Ejemplo cotidiano</TableHead>
                      <TableHead className="text-right">En {mesCorto(mesOrigen)}</TableHead>
                      <TableHead className="text-right">En {mesCorto(mesDestino)}</TableHead>
                      <TableHead className="text-right">Diferencia</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {REFERENCIAS_COTIDIANAS.map((ref) => {
                      const adj = ajustarPorIpc(ref.monto, mesOrigen, mesDestino, serie);
                      const diff = adj ? adj.montoAjustado - ref.monto : null;
                      return (
                        <TableRow key={ref.concepto}>
                          <TableCell className="font-medium text-foreground">
                            {ref.concepto}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {pesos(ref.monto)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-foreground">
                            {adj ? pesos(adj.montoAjustado) : "—"}
                          </TableCell>
                          <TableCell className="text-right text-xs font-medium text-muted-foreground">
                            {diff !== null ? `${diff >= 0 ? "+" : ""}${pesos(diff)}` : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              onClick={() => {
                                setMontoRaw(String(ref.monto));
                                setTabActiva("ajustar");
                                notificarCalculo("ipc_preset");
                              }}
                              className="text-xs font-medium text-blue-700 hover:text-blue-800"
                            >
                              Usar
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Gráfico interactivo TradingView Lightweight Charts */}
    </div>
  );
}
