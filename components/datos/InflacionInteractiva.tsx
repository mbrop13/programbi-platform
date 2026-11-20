"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Calculator,
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Link2,
  Scale,
  Table2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartCard } from "@/components/datos/viz/ChartCard";
import { RangeBar } from "@/components/datos/viz/RangeBar";
import { Sparkline } from "@/components/datos/viz/Sparkline";
import { StatTile } from "@/components/datos/viz/StatTile";
import { C } from "@/components/datos/viz/tokens";
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

const MESES_CORTOS_CAL = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

type FrecuenciaMonto = "mensual" | "anual" | "unico";
type ModoGrafico = "indice" | "mensual" | "doce";
type RangoKey = "1A" | "5A" | "10A" | "Todo";

/** Rangos de años. Si la serie es más corta que el rango, se muestra todo (sin inventar datos). */
const RANGOS: readonly { key: RangoKey; label: string; months: number | null }[] = [
  { key: "1A", label: "1A", months: 12 },
  { key: "5A", label: "5A", months: 60 },
  { key: "10A", label: "10A", months: 120 },
  { key: "Todo", label: "Todo", months: null },
];

const CHART_CONFIG: ChartConfig = {
  v: { label: "Índice IPC (2023 = 100)", color: C.blue },
  mom: { label: "Variación mensual", color: C.blue },
  yoy: { label: "Inflación 12 meses", color: C.blue },
};

interface PuntoEnriquecido {
  m: string;
  v: number;
  /** Variación mensual en puntos porcentuales (null si no hay mes anterior en la serie). */
  mom: number | null;
  /** Variación interanual en puntos porcentuales (null si falta el mes de un año antes). */
  yoy: number | null;
}

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

function fmtIndice(val: number): string {
  return val.toFixed(2).replace(".", ",");
}

/** Texto compacto de variación mensual para celdas del heatmap (el eje ya indica que son %). */
function fmtCeldaHeatmap(val: number): string {
  const abs = Math.abs(val).toFixed(1).replace(".", ",");
  if (abs === "0,0") return "0,0";
  return `${val > 0 ? "+" : "−"}${abs}`;
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

  // Gráfico de la serie: pestañas, rangos y carga diferida sin CLS
  const [modoGrafico, setModoGrafico] = useState<ModoGrafico>("indice");
  const [rango, setRango] = useState<RangoKey>("Todo");
  const [graficoVisible, setGraficoVisible] = useState<boolean>(false);
  const [tablaSerieAbierta, setTablaSerieAbierta] = useState<boolean>(false);
  const [tablaHeatmapAbierta, setTablaHeatmapAbierta] = useState<boolean>(false);
  const zonaGraficoRef = useRef<HTMLDivElement | null>(null);

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

  // «Ver tabla» del ChartCard enlaza a #ipc-tabla-serie / #ipc-tabla-heatmap: abrir al llegar al ancla
  useEffect(() => {
    const revisarAncla = () => {
      if (window.location.hash === "#ipc-tabla-serie") setTablaSerieAbierta(true);
      if (window.location.hash === "#ipc-tabla-heatmap") setTablaHeatmapAbierta(true);
    };
    revisarAncla();
    window.addEventListener("hashchange", revisarAncla);
    return () => window.removeEventListener("hashchange", revisarAncla);
  }, []);

  // Diferir el montaje del gráfico hasta que se acerque al viewport (skeleton de la misma altura)
  useEffect(() => {
    if (graficoVisible) return;
    const el = zonaGraficoRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setGraficoVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setGraficoVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "240px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [graficoVisible]);

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

  const ultimoPunto = serie[serie.length - 1];
  const penultimoPunto = serie.length >= 2 ? serie[serie.length - 2] : null;
  const puntoHace12 = serie.find((p) => p.m === mesHace12) ?? null;
  const varUltimoTramo =
    penultimoPunto && ultimoPunto
      ? variacionIpc(penultimoPunto.m, ultimoPunto.m, serie)
      : null;
  const var12Meses =
    puntoHace12 && ultimoPunto
      ? variacionIpc(puntoHace12.m, ultimoPunto.m, serie)
      : null;

  // Serie enriquecida: variación mensual e interanual calculadas SOLO desde los datos oficiales
  const enriched = useMemo<PuntoEnriquecido[]>(() => {
    const porMes = new Map(serie.map((p) => [p.m, p.v]));
    return serie.map((p, idx) => {
      const prev = idx > 0 ? serie[idx - 1] : null;
      const mom = prev && prev.v > 0 ? ((p.v - prev.v) / prev.v) * 100 : null;
      const prev12 = porMes.get(getMesHace12(p.m));
      const yoy = prev12 && prev12 > 0 ? ((p.v - prev12) / prev12) * 100 : null;
      return { m: p.m, v: p.v, mom, yoy };
    });
  }, [serie]);

  const spark12 = useMemo(() => serie.slice(-12).map((p) => p.v), [serie]);
  const sparkMom = useMemo(
    () => enriched.slice(-13).map((p) => p.mom).filter((x): x is number => x !== null),
    [enriched]
  );
  const sparkIndice = useMemo(() => enriched.map((p) => p.v).slice(-12), [enriched]);
  const sparkYoy = useMemo(
    () => enriched.map((p) => p.yoy).filter((x): x is number => x !== null).slice(-12),
    [enriched]
  );

  // Ventana temporal del gráfico: rangos mayores que la serie muestran todo (sin inventar)
  const rangoObj = RANGOS.find((r) => r.key === rango) ?? RANGOS[RANGOS.length - 1];
  const ventana = useMemo(() => {
    const n = rangoObj.months;
    return n !== null && enriched.length > n ? enriched.slice(-n) : enriched;
  }, [enriched, rangoObj]);
  const puntosGrafico = useMemo(() => {
    if (modoGrafico === "indice") return ventana;
    if (modoGrafico === "mensual") return ventana.filter((p) => p.mom !== null);
    return ventana.filter((p) => p.yoy !== null);
  }, [ventana, modoGrafico]);

  const dataKeyGrafico = modoGrafico === "indice" ? "v" : modoGrafico === "mensual" ? "mom" : "yoy";
  const valoresGrafico = puntosGrafico
    .map((p) => (modoGrafico === "indice" ? p.v : modoGrafico === "mensual" ? p.mom : p.yoy))
    .filter((x): x is number => x !== null);
  const minGrafico = valoresGrafico.length ? Math.min(...valoresGrafico) : 0;
  const maxGrafico = valoresGrafico.length ? Math.max(...valoresGrafico) : 1;
  const padGrafico =
    modoGrafico === "indice"
      ? Math.max((maxGrafico - minGrafico) * 0.08, 0.5)
      : Math.max((maxGrafico - minGrafico) * 0.12, 0.2);
  const yMin =
    modoGrafico === "indice" ? minGrafico - padGrafico : Math.min(0, minGrafico) - padGrafico;
  const yMax = maxGrafico + padGrafico;

  const primeroVentana = ventana[0];
  const ultimoVentana = ventana[ventana.length - 1];
  const rangoExcedeSerie = rangoObj.months !== null && enriched.length < rangoObj.months;

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
    const texto = `${pesos(monto)} de ${mesLargo(mesOrigen)} equivalen a ${pesos(
      calculo.montoAjustado
    )} en ${mesLargo(mesDestino)} (${variacion !== null ? variacionPorcentual(variacion) : ""} según IPC oficial del INE). Calculado en programbi.com/datos/inflacion`;
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

  const descargarCsvSerie = () => {
    const filas = [
      "mes,periodo,indice_ipc_base_2023_100,variacion_mensual_pct,inflacion_12_meses_pct",
      ...enriched.map(
        (p) =>
          `${p.m},"${capitalizar(mesLargo(p.m))}",${p.v.toFixed(2)},${
            p.mom !== null ? p.mom.toFixed(2) : ""
          },${p.yoy !== null ? p.yoy.toFixed(2) : ""}`
      ),
    ];
    const blob = new Blob([filas.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ipc-chile-ine-serie.csv";
    a.click();
    URL.revokeObjectURL(url);
    trackEvent("datos_download", { formato: "csv", recurso: "ipc-chile" });
    toast.success("Archivo CSV descargado");
  };

  const variacionSube = (variacion ?? 0) > 0;
  const variacionBaja = (variacion ?? 0) < 0;

  // Banda comparativa honesta para RangeBar (tu reajuste vs IPC del período, en %)
  const rangoSueldoMin = comparacionSueldo
    ? Math.min(0, comparacionSueldo.varNominal, comparacionSueldo.varIpc) * 100
    : 0;
  const rangoSueldoMax = comparacionSueldo
    ? Math.max(0, comparacionSueldo.varNominal, comparacionSueldo.varIpc) * 100
    : 0;
  const hayBandaSueldo = rangoSueldoMax - rangoSueldoMin > 1e-9;

  return (
    <div className="space-y-6">
      {/* PRIMER PLIEGUE: calculadora protagonista + sparkline 12 meses a la derecha */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-6">
        {/* Herramienta principal con 3 modos (ajustar es el tab visible por defecto) */}
        <Card className="gap-0 overflow-hidden rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
        <Tabs value={tabActiva} onValueChange={setTabActiva} className="gap-0">
          <div className="border-b border-border bg-muted/35 px-4 pt-4 pb-3 sm:px-6">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-lg bg-muted p-1 sm:w-fit">
              <TabsTrigger
                value="ajustar"
                className="h-8 gap-1.5 px-3 text-xs font-medium sm:text-sm"
              >
                <Calculator className="size-3.5" aria-hidden="true" />
                Ajustar un monto
              </TabsTrigger>
              <TabsTrigger
                value="sueldo"
                className="h-8 gap-1.5 px-3 text-xs font-medium sm:text-sm"
              >
                <Scale className="size-3.5" aria-hidden="true" />
                ¿Mi sueldo le ganó al IPC?
              </TabsTrigger>
              <TabsTrigger
                value="referencias"
                className="h-8 gap-1.5 px-3 text-xs font-medium sm:text-sm"
              >
                <Table2 className="size-3.5" aria-hidden="true" />
                Ejemplos cotidianos
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: AJUSTAR UN MONTO */}
          <TabsContent value="ajustar" className="p-5 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="ipc-monto" className="text-sm font-medium text-foreground">
                      ¿Qué monto quieres actualizar?
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
                    className="inline-flex items-center gap-1 font-medium text-[#0b63c5] hover:underline"
                  >
                    ¿Necesitas fechas anteriores? Ir al INE
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Panel de resultado */}
              <div className="flex flex-col justify-between rounded-xl border border-border bg-muted/35 p-5 sm:p-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Equivale en {mesLargo(mesDestino)} a
                    </span>
                    {variacion !== null ? (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "h-auto gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums",
                          variacionSube && "border border-blue-200/80 bg-blue-50 text-[#0b63c5]",
                          variacionBaja && "border border-emerald-200/80 bg-emerald-50 text-emerald-800"
                        )}
                      >
                        {variacionSube ? (
                          <TrendingUp className="size-3" aria-hidden="true" />
                        ) : variacionBaja ? (
                          <TrendingDown className="size-3" aria-hidden="true" />
                        ) : null}
                        {variacionPorcentual(variacion)} de variación
                      </Badge>
                    ) : null}
                  </div>

                  <p className="kpi-hero mt-3 text-foreground tabular-nums">
                    {calculo ? pesos(calculo.montoAjustado) : "Sin dato"}
                  </p>

                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {calculo ? (
                      <>
                        Para mantener el mismo poder de compra que{" "}
                        <strong className="font-semibold text-foreground">{pesos(monto)}</strong> en{" "}
                        {mesLargo(mesOrigen)}, necesitas{" "}
                        <strong className="font-semibold text-foreground">
                          {pesos(calculo.montoAjustado)}
                        </strong>{" "}
                        en {mesLargo(mesDestino)}.
                      </>
                    ) : (
                      "Selecciona dos fechas válidas para calcular el ajuste por inflación."
                    )}
                  </p>

                  {calculo && diferenciaPesos !== null && poderCompraSinReajuste !== null ? (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-card p-3.5">
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Diferencia en pesos
                        </p>
                        <p className="mt-1 text-base font-semibold text-foreground tabular-nums">
                          {diferenciaPesos >= 0 ? "+" : ""}
                          {pesos(diferenciaPesos)}
                        </p>
                        {frecuencia === "mensual" && diferenciaPesos !== 0 ? (
                          <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                            {diferenciaPesos > 0 ? "+" : ""}
                            {pesos(diferenciaPesos * 12)} en 12 meses
                          </p>
                        ) : (
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            Ajuste neto del período
                          </p>
                        )}
                      </div>

                      <div className="rounded-lg border border-border bg-card p-3.5">
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Si el monto no se reajustó
                        </p>
                        <p className="mt-1 text-base font-semibold text-foreground tabular-nums">
                          {pesos(poderCompraSinReajuste)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                          {perdidaPctSinReajuste !== null && perdidaPctSinReajuste < 0
                            ? `Rinde ${Math.abs(perdidaPctSinReajuste * 100)
                                .toFixed(1)
                                .replace(".", ",")} % menos hoy`
                            : "Poder de compra equivalente"}
                        </p>
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
          <TabsContent value="sueldo" className="p-5 sm:p-6">
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

                        {/* Banda comparativa: tu reajuste nominal vs inflación del período */}
                        <div className="rounded-lg border border-border bg-card p-3.5">
                        <p className="text-[11px] font-medium text-muted-foreground">
                        Tu reajuste vs inflación del período
                        </p>
                        {hayBandaSueldo ? (
                        <div className="mt-2">
                          <RangeBar
                            min={rangoSueldoMin}
                            max={rangoSueldoMax}
                            mid={comparacionSueldo.varIpc * 100}
                            you={comparacionSueldo.varNominal * 100}
                            format={(v) => variacionPorcentual(v / 100)}
                            labels={["Tu reajuste", "IPC"]}
                          />
                        </div>
                        ) : (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Sin variación en el período: tu sueldo y el IPC se mantuvieron iguales.
                        </p>
                        )}
                        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                        Si «Tu reajuste» queda por encima del «IPC», ganaste poder de compra; si
                        queda por debajo, lo perdiste.
                        </p>
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
          <TabsContent value="referencias" className="p-5 sm:p-6">
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

              <div className="overflow-x-auto rounded-lg border border-border">
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
                              className="text-xs font-medium text-[#0b63c5] hover:text-[#0b63c5]"
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

        {/* Sparkline 12 meses del índice (SVG puro, altura reservada: sin CLS) */}
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-white p-5 shadow-xs">
          <div className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold text-foreground">IPC últimos 12 meses</h2>
              <span className="text-xs text-muted-foreground">Base 2023 = 100</span>
            </div>
            {spark12.length >= 2 && ultimoPunto ? (
              <div className="w-full [&>svg]:h-auto [&>svg]:w-full">
                <Sparkline
                  data={spark12}
                  width={300}
                  height={92}
                  lastDot
                  ariaLabel={`Índice IPC de ${mesLargo(serie[serie.length - spark12.length].m)} a ${mesLargo(ultimoPunto.m)}`}
                />
              </div>
            ) : (
              <div className="flex h-[92px] items-center justify-center rounded-lg bg-[#f7f7f4] text-xs text-muted-foreground">
                Serie insuficiente para graficar
              </div>
            )}
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {ultimoPunto ? fmtIndice(ultimoPunto.v) : "—"}
                <span className="ml-1.5 text-sm font-normal text-muted-foreground">pts</span>
              </p>
              {var12Meses !== null ? (
                <Badge
                  variant="secondary"
                  className="h-auto gap-1 rounded-md border border-blue-200/80 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#0b63c5] tabular-nums"
                >
                  {var12Meses > 0 ? (
                    <TrendingUp className="size-3" aria-hidden="true" />
                  ) : var12Meses < 0 ? (
                    <TrendingDown className="size-3" aria-hidden="true" />
                  ) : null}
                  {variacionPorcentual(var12Meses)} en 12m
                </Badge>
              ) : null}
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {puntoHace12 && ultimoPunto
              ? `${capitalizar(mesCorto(puntoHace12.m))} → ${capitalizar(mesCorto(ultimoPunto.m))} · Variación interanual del índice oficial del INE.`
              : "Variación interanual del índice oficial del INE."}
          </p>
        </div>
      </div>

      {/* KPIs compactos de la serie oficial (bajo la calculadora) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile
          label="Inflación 12 meses"
          value={var12Meses !== null ? variacionPorcentual(var12Meses) : "—"}
          sub={
            puntoHace12 && ultimoPunto
              ? `${mesCorto(puntoHace12.m)} → ${mesCorto(ultimoPunto.m)} · INE`
              : "Variación interanual del IPC"
          }
          spark={sparkYoy.length >= 2 ? sparkYoy : undefined}
        />
        <StatTile
          label="Última variación mensual"
          value={varUltimoTramo !== null ? variacionPorcentual(varUltimoTramo) : "—"}
          sub={
            penultimoPunto && ultimoPunto
              ? `${mesCorto(penultimoPunto.m)} → ${mesCorto(ultimoPunto.m)}`
              : "Referencia oficial del INE"
          }
          spark={sparkMom.length >= 2 ? sparkMom : undefined}
        />
        <StatTile
          label="Índice IPC actual"
          value={ultimoPunto ? `${fmtIndice(ultimoPunto.v)} pts` : "—"}
          sub={ultimoPunto ? `${capitalizar(mesLargo(ultimoPunto.m))} · Base 2023 = 100` : undefined}
          spark={sparkIndice.length >= 2 ? sparkIndice : undefined}
        />
      </div>

      {/* ChartCard OWID: serie mensual con rangos y pestañas */}
      <ChartCard
        title="¿Cómo ha evolucionado el IPC en Chile?"
        subtitle={
          primeroVentana && ultimoVentana
            ? `Serie mensual INE · Base 2023 = 100 · ${capitalizar(mesCorto(primeroVentana.m))} a ${capitalizar(mesCorto(ultimoVentana.m))} (${ventana.length} meses)`
            : "Serie mensual INE · Base 2023 = 100"
        }
        source="INE"
        license="CC BY-SA 4.0"
        tableId="ipc-tabla-serie"
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={descargarCsvSerie}
            className="h-8 gap-1.5 bg-white text-xs font-medium"
          >
            <Download className="size-3.5 text-muted-foreground" aria-hidden="true" />
            Descargar CSV
          </Button>
        }
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ToggleGroup
              type="single"
              value={modoGrafico}
              onValueChange={(val) => {
                if (val === "indice" || val === "mensual" || val === "doce") {
                  setModoGrafico(val);
                }
              }}
              aria-label="Pestaña del gráfico IPC"
              className="gap-1 rounded-lg bg-muted p-1"
            >
              <ToggleGroupItem value="indice" className="h-7 rounded-md px-2.5 text-xs font-medium">
                Índice
              </ToggleGroupItem>
              <ToggleGroupItem value="mensual" className="h-7 rounded-md px-2.5 text-xs font-medium">
                Var. mensual
              </ToggleGroupItem>
              <ToggleGroupItem value="doce" className="h-7 rounded-md px-2.5 text-xs font-medium">
                12 meses
              </ToggleGroupItem>
            </ToggleGroup>

            <ToggleGroup
              type="single"
              value={rango}
              onValueChange={(val) => {
                if (val === "1A" || val === "5A" || val === "10A" || val === "Todo") {
                  setRango(val);
                }
              }}
              aria-label="Rango de años del gráfico IPC"
              className="gap-1 rounded-lg border border-border bg-white p-0.5"
            >
              {RANGOS.map((r) => (
                <ToggleGroupItem
                  key={r.key}
                  value={r.key}
                  className="h-7 rounded-md border-0 px-2.5 text-xs font-medium shadow-none"
                >
                  {r.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <p className="min-h-4 text-xs text-muted-foreground">
            {rangoExcedeSerie
              ? `Rango ${rangoObj.label}: la serie oficial disponible cubre ${enriched.length} meses, por lo que se muestra el período completo.`
              : modoGrafico === "mensual"
                ? "Barras azules: meses con alza de precios; verdes: meses con baja (deflación)."
                : " "}
          </p>

          {/* Altura fija reservada: el skeleton y el gráfico ocupan exactamente lo mismo (sin CLS) */}
          <div ref={zonaGraficoRef} className="h-[300px] w-full sm:h-[340px]">
            {graficoVisible && puntosGrafico.length > 0 ? (
              <ChartContainer config={CHART_CONFIG} className="h-full w-full">
                {modoGrafico === "mensual" ? (
                  <BarChart data={puntosGrafico} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="m"
                      tickFormatter={(m: string) => capitalizar(mesCorto(m))}
                      interval="preserveStartEnd"
                      minTickGap={26}
                      tick={{ fontSize: 11, fill: C.mute }}
                      tickLine={false}
                      axisLine={{ stroke: C.line }}
                    />
                    <YAxis
                      domain={[yMin, yMax]}
                      width={48}
                      tickFormatter={(v: number) => variacionPorcentual(v / 100)}
                      tick={{ fontSize: 11, fill: C.mute }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ReferenceLine y={0} stroke={C.line} />
                    <ChartTooltip
                      cursor={{ fill: "rgba(24, 144, 255, 0.06)" }}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(label) => capitalizar(mesLargo(String(label)))}
                          formatter={(value) => variacionPorcentual(value / 100)}
                        />
                      }
                    />
                    <Bar dataKey="mom" maxBarSize={26} radius={2}>
                      {puntosGrafico.map((p) => (
                        <Cell
                          key={p.m}
                          fill={
                            (p.mom ?? 0) > 0.001
                              ? C.blue
                              : (p.mom ?? 0) < -0.001
                                ? C.up
                                : C.mute
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <LineChart data={puntosGrafico} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke={C.line} strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="m"
                      tickFormatter={(m: string) => capitalizar(mesCorto(m))}
                      interval="preserveStartEnd"
                      minTickGap={26}
                      tick={{ fontSize: 11, fill: C.mute }}
                      tickLine={false}
                      axisLine={{ stroke: C.line }}
                    />
                    <YAxis
                      domain={[yMin, yMax]}
                      width={48}
                      tickFormatter={(v: number) =>
                        modoGrafico === "indice" ? fmtIndice(v) : variacionPorcentual(v / 100)
                      }
                      tick={{ fontSize: 11, fill: C.mute }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={{ stroke: C.line }}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(label) => capitalizar(mesLargo(String(label)))}
                          formatter={(value) =>
                            modoGrafico === "indice"
                              ? `${fmtIndice(value)} pts`
                              : variacionPorcentual(value / 100)
                          }
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey={dataKeyGrafico}
                      stroke={C.blue}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: C.blue, stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  </LineChart>
                )}
              </ChartContainer>
            ) : (
              <div
                aria-hidden="true"
                className="h-full w-full animate-pulse rounded-lg border border-[#e5e4df] bg-[#f7f7f4]"
              />
            )}
          </div>
          <p className="sr-only">
            Gráfico de la serie mensual del IPC. La alternativa accesible es la tabla de la serie
            disponible bajo el gráfico («Ver tabla»).
          </p>

          {/* Alternativa en tabla de la serie completa (objetivo del enlace «Ver tabla» del ChartCard) */}
          <details
            id="ipc-tabla-serie"
            open={tablaSerieAbierta}
            className="group rounded-lg border border-border bg-white"
          >
            <summary
              onClick={(e) => {
                e.preventDefault();
                setTablaSerieAbierta((v) => !v);
              }}
              className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-semibold text-foreground select-none hover:bg-muted/40"
            >
              <span className="inline-flex items-center gap-1.5">
                <Table2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
                Ver tabla de la serie ({enriched.length} meses)
              </span>
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
                  tablaSerieAbierta && "rotate-180"
                )}
                aria-hidden="true"
              />
            </summary>
            <div className="max-h-[400px] overflow-auto border-t border-border/70">
              <Table className="tabular-nums">
                <TableHeader className="sticky top-0 bg-muted/80">
                  <TableRow className="hover:bg-muted/80">
                    <TableHead>Período</TableHead>
                    <TableHead className="text-right">Índice IPC</TableHead>
                    <TableHead className="text-right">Var. mensual</TableHead>
                    <TableHead className="text-right">Inflación 12m</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...enriched].reverse().map((row) => (
                    <TableRow key={row.m}>
                      <TableCell className="font-medium text-foreground">
                        {capitalizar(mesLargo(row.m))}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {fmtIndice(row.v)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-medium",
                          row.mom !== null && row.mom < 0
                            ? "text-emerald-700"
                            : "text-muted-foreground"
                        )}
                      >
                        {row.mom !== null ? variacionPorcentual(row.mom / 100) : "—"}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {row.yoy !== null ? variacionPorcentual(row.yoy / 100) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </details>
        </div>
      </ChartCard>

      {/* Heatmap año × mes de la variación mensual (escala secuencial azul documentada) */}
      <ChartCard
        title="¿En qué meses subieron más los precios?"
        subtitle={
          enriched.length > 0
            ? `Variación mensual del IPC (%) · año × mes · ${capitalizar(mesCorto(enriched[0].m))} a ${capitalizar(mesCorto(enriched[enriched.length - 1].m))}`
            : "Variación mensual del IPC (%) · año × mes"
        }
        source="INE"
        license="CC BY-SA 4.0"
        tableId="ipc-tabla-heatmap"
      >
        <HeatmapIpc
          enriched={enriched}
          tablaAbierta={tablaHeatmapAbierta}
          onToggleTabla={() => setTablaHeatmapAbierta((v) => !v)}
        />
      </ChartCard>
    </div>
  );
}

/**
 * Heatmap año × mes de la variación mensual del IPC.
 * Escala SECUENCIAL azul (C.scale) por magnitud |variación| en 5 tramos hasta el máximo
 * observado de la serie; el signo se lee en cada celda. Los meses con deflación
 * (variación negativa) se distinguen con borde verde discontinuo, no con otro color de relleno.
 * Escala sola: las filas se generan desde los años presentes en la serie (hoy 3 parciales;
 * cuando llegue la serie oficial larga aparecerán todos los años automáticamente).
 */
function HeatmapIpc({
  enriched,
  tablaAbierta,
  onToggleTabla,
}: {
  enriched: PuntoEnriquecido[];
  tablaAbierta: boolean;
  onToggleTabla: () => void;
}) {
  const porMes = useMemo(() => new Map(enriched.map((p) => [p.m, p])), [enriched]);
  const anos = useMemo(() => {
    const set = new Set<number>();
    for (const p of enriched) {
      const y = Number(p.m.slice(0, 4));
      if (Number.isFinite(y)) set.add(y);
    }
    return [...set].sort((a, b) => a - b);
  }, [enriched]);
  const maxAbs = useMemo(() => {
    let max = 0;
    for (const p of enriched) {
      if (p.mom !== null) max = Math.max(max, Math.abs(p.mom));
    }
    return max > 0 ? max : 1;
  }, [enriched]);

  if (enriched.length === 0 || anos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aún no hay datos suficientes para construir el mapa de calor mensual.
      </p>
    );
  }

  const LABEL_W = 46;
  const CELL = 46;
  const GAP = 4;
  const HEADER_H = 22;
  const ROW_H = CELL + GAP;
  const width = LABEL_W + 12 * (CELL + GAP);
  const height = HEADER_H + anos.length * ROW_H;

  const tramoCelda = (mom: number): number =>
    Math.min(4, Math.floor((Math.abs(mom) / maxAbs) * 5));
  const colorCelda = (mom: number): string => C.scale[tramoCelda(mom)];
  const textoCelda = (mom: number): string => (tramoCelda(mom) >= 4 ? "#ffffff" : C.ink);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Mapa de calor de la variación mensual del IPC por año y mes, de ${anos[0]} a ${anos[anos.length - 1]}. Escala secuencial azul por magnitud; los meses con deflación llevan borde verde discontinuo. La tabla bajo el gráfico contiene los mismos valores.`}
          className="h-auto w-full min-w-[560px] max-w-[760px]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {MESES_CORTOS_CAL.map((mes, i) => (
            <text
              key={mes}
              x={LABEL_W + i * (CELL + GAP) + CELL / 2}
              y={HEADER_H - 8}
              textAnchor="middle"
              fontSize={11}
              fill={C.mute}
            >
              {mes}
            </text>
          ))}
          {anos.map((ano, row) => (
            <g key={ano}>
              <text
                x={LABEL_W - 10}
                y={HEADER_H + row * ROW_H + CELL / 2}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={12}
                fontWeight={600}
                fill={C.ink}
              >
                {ano}
              </text>
              {MESES_CORTOS_CAL.map((_, i) => {
                const key = `${ano}-${String(i + 1).padStart(2, "0")}`;
                const punto = porMes.get(key);
                const x = LABEL_W + i * (CELL + GAP);
                const y = HEADER_H + row * ROW_H;
                if (!punto) {
                  return (
                    <rect
                      key={key}
                      x={x}
                      y={y}
                      width={CELL}
                      height={CELL}
                      rx={6}
                      fill="none"
                      stroke={C.line}
                      strokeDasharray="2 3"
                      opacity={0.7}
                    />
                  );
                }
                if (punto.mom === null) {
                  return (
                    <g key={key}>
                      <title>{`${capitalizar(mesLargo(key))}: sin variación calculable (primer mes de la serie disponible)`}</title>
                      <rect x={x} y={y} width={CELL} height={CELL} rx={6} fill={C.scale[0]} />
                      <text
                        x={x + CELL / 2}
                        y={y + CELL / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={9}
                        fill={C.mute}
                      >
                        s/d
                      </text>
                    </g>
                  );
                }
                const deflacion = punto.mom < 0;
                return (
                  <g key={key}>
                    <title>{`${capitalizar(mesLargo(key))}: ${variacionPorcentual(punto.mom / 100)} mensual${deflacion ? " (deflación)" : ""}`}</title>
                    <rect
                      x={x}
                      y={y}
                      width={CELL}
                      height={CELL}
                      rx={6}
                      fill={colorCelda(punto.mom)}
                      stroke={deflacion ? C.up : "none"}
                      strokeWidth={deflacion ? 1.5 : 0}
                      strokeDasharray={deflacion ? "3 2" : undefined}
                    />
                    <text
                      x={x + CELL / 2}
                      y={y + CELL / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={11}
                      fontWeight={500}
                      fill={textoCelda(punto.mom)}
                    >
                      {fmtCeldaHeatmap(punto.mom)}
                    </text>
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>

      {/* Leyenda y documentación de la escala */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="font-medium text-foreground">Magnitud mensual:</span>
          {C.scale.map((color, i) => (
            <span
              key={color}
              aria-hidden="true"
              className="inline-block size-4 rounded-sm border border-black/5"
              style={{ backgroundColor: color }}
              title={`Tramo ${i + 1} de 5`}
            />
          ))}
          <span className="tabular-nums">
            menor → mayor (máx. {maxAbs.toFixed(1).replace(".", ",")} %)
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block size-4 rounded-sm border-[1.5px] border-dashed bg-[#e8f3ff]"
            style={{ borderColor: C.up }}
          />
          Deflación (variación negativa)
        </span>
      </div>
      <p className="max-w-[68ch] text-xs leading-relaxed text-muted-foreground">
        Escala secuencial azul por magnitud de la variación mensual (5 tramos hasta el máximo
        observado de la serie); el signo se muestra en cada celda. Los meses con deflación se
        marcan con borde verde discontinuo. Las celdas punteadas sin relleno son meses aún no
        publicados; «s/d» es el primer mes de la serie disponible, sin mes anterior con qué
        compararlo.
      </p>

      {/* Alternativa en tabla del heatmap */}
      <details
        id="ipc-tabla-heatmap"
        open={tablaAbierta}
        className="group rounded-lg border border-border bg-white"
      >
        <summary
          onClick={(e) => {
            e.preventDefault();
            onToggleTabla();
          }}
          className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-semibold text-foreground select-none hover:bg-muted/40"
        >
          <span className="inline-flex items-center gap-1.5">
            <Table2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
            Ver tabla del mapa de calor
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
              tablaAbierta && "rotate-180"
            )}
            aria-hidden="true"
          />
        </summary>
        <div className="overflow-x-auto border-t border-border/70">
          <Table className="tabular-nums">
            <TableHeader className="bg-muted/60">
              <TableRow className="hover:bg-muted/60">
                <TableHead>Año</TableHead>
                {MESES_CORTOS_CAL.map((mes) => (
                  <TableHead key={mes} className="text-right">
                    {mes}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {anos.map((ano) => (
                <TableRow key={ano}>
                  <TableCell className="font-medium text-foreground">{ano}</TableCell>
                  {MESES_CORTOS_CAL.map((_, i) => {
                    const key = `${ano}-${String(i + 1).padStart(2, "0")}`;
                    const punto = porMes.get(key);
                    const mom = punto?.mom ?? null;
                    return (
                      <TableCell
                        key={key}
                        className={cn(
                          "text-right",
                          mom !== null && mom < 0 ? "text-emerald-700" : "text-muted-foreground"
                        )}
                      >
                        {mom !== null ? variacionPorcentual(mom / 100) : "—"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </details>
    </div>
  );
}
