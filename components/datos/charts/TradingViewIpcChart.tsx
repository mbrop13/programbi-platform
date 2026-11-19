"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineStyle,
  createChart,
  type IChartApi,
  type Time,
} from "lightweight-charts";
import {
  BarChart3,
  Download,
  Table2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { trackEvent } from "@/lib/analytics/marketing";
import { mesCorto, mesLargo } from "@/lib/datos/formato";
import type { PuntoIpc } from "@/lib/datos/ipc";
import { cn } from "@/lib/utils";

type ChartMode = "indice" | "mensual" | "anual";
type TimeframeKey = "6M" | "1A" | "2A" | "Todo";

interface EnrichedIpcPoint {
  m: string;
  time: string;
  mesCortoLabel: string;
  mesLargoLabel: string;
  v: number;
  momPct: number | null;
  yoyPct: number | null;
}

export interface TradingViewIpcChartProps {
  serie: readonly PuntoIpc[];
  className?: string;
}

function capitalizar(texto: string): string {
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : "";
}

function formatMesHud(ym: string): string {
  const largo = mesLargo(ym).replace(" de ", " ");
  return capitalizar(largo);
}

function formatNumeroCl(val: number, decimals = 2): string {
  return val.toFixed(decimals).replace(".", ",");
}

function formatPctCl(val: number, decimals = 2, withSign = true): string {
  const abs = Math.abs(val).toFixed(decimals).replace(".", ",");
  if (abs === "0,00" || abs === "0,0") return `${abs}%`;
  const sign = withSign ? (val > 0 ? "+" : "−") : val < 0 ? "−" : "";
  return `${sign}${abs}%`;
}

function getPrev12Month(ym: string): string {
  const [yStr, mStr] = ym.split("-");
  const y = Number(yStr);
  if (!Number.isFinite(y) || !mStr) return "";
  return `${y - 1}-${mStr}`;
}

const TIMEFRAMES: readonly { key: TimeframeKey; label: string; months: number | null }[] = [
  { key: "6M", label: "6M", months: 6 },
  { key: "1A", label: "1A", months: 12 },
  { key: "2A", label: "2A", months: 24 },
  { key: "Todo", label: "Todo", months: null },
];

export function TradingViewIpcChart({ serie, className }: TradingViewIpcChartProps) {
  const [mode, setMode] = useState<ChartMode>("indice");
  const [timeframe, setTimeframe] = useState<TimeframeKey>("Todo");
  const [showTable, setShowTable] = useState<boolean>(false);
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const enriched = useMemo<EnrichedIpcPoint[]>(() => {
    const byMonth = new Map(serie.map((p) => [p.m, p.v]));
    return serie.map((p, idx) => {
      const prev = idx > 0 ? serie[idx - 1] : null;
      const momPct = prev && prev.v > 0 ? ((p.v - prev.v) / prev.v) * 100 : null;
      const prev12 = byMonth.get(getPrev12Month(p.m));
      const yoyPct = prev12 && prev12 > 0 ? ((p.v - prev12) / prev12) * 100 : null;
      return {
        m: p.m,
        time: `${p.m}-01`,
        mesCortoLabel: capitalizar(mesCorto(p.m)),
        mesLargoLabel: capitalizar(mesLargo(p.m)),
        v: p.v,
        momPct,
        yoyPct,
      };
    });
  }, [serie]);

  const activeSeriesPoints = useMemo(() => {
    if (mode === "indice") return enriched;
    if (mode === "mensual") return enriched.filter((p) => p.momPct !== null);
    return enriched.filter((p) => p.yoyPct !== null);
  }, [enriched, mode]);

  // Crear y limpiar gráfico TradingView Lightweight Charts v5
  useEffect(() => {
    if (showTable) return;
    const container = containerRef.current;
    if (!container || activeSeriesPoints.length === 0) return;

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: "#FFFFFF" },
        textColor: "#475569",
        fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif",
        fontSize: 12,
        attributionLogo: false,
      },
      width: container.clientWidth,
      height: container.clientHeight || 340,
      grid: {
        vertLines: { color: "#F1F5F9" },
        horzLines: { color: "#F1F5F9" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "#0F172A",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#0F172A",
        },
        horzLine: {
          color: "#0F172A",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#0F172A",
        },
      },
      rightPriceScale: {
        borderColor: "#E2E8F0",
        scaleMargins: { top: 0.14, bottom: 0.1 },
      },
      timeScale: {
        borderColor: "#E2E8F0",
        timeVisible: false,
        rightOffset: 2,
        barSpacing: 18,
        minBarSpacing: 6,
      },
      localization: {
        locale: "es-CL",
        priceFormatter: (price: number) =>
          mode === "indice" ? formatNumeroCl(price, 2) : `${formatNumeroCl(price, 2)}%`,
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: false,
        pinch: true,
      },
    });

    chartRef.current = chart;

    if (mode === "indice") {
      const series = chart.addSeries(AreaSeries, {
        lineColor: "#2563EB",
        lineWidth: 2,
        topColor: "rgba(37, 99, 235, 0.22)",
        bottomColor: "rgba(37, 99, 235, 0.01)",
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 5,
        crosshairMarkerBorderColor: "#FFFFFF",
        crosshairMarkerBorderWidth: 2,
        crosshairMarkerBackgroundColor: "#2563EB",
        priceLineVisible: false,
        lastValueVisible: true,
      });
      series.setData(
        activeSeriesPoints.map((p) => ({
          time: p.time as Time,
          value: p.v,
        }))
      );
    } else if (mode === "mensual") {
      const series = chart.addSeries(HistogramSeries, {
        base: 0,
        priceFormat: {
          type: "custom",
          formatter: (price: number) => `${formatNumeroCl(price, 2)}%`,
        },
        priceLineVisible: false,
        lastValueVisible: true,
      });
      series.setData(
        activeSeriesPoints.map((p) => {
          const val = p.momPct ?? 0;
          const color =
            val > 0.001 ? "#2563EB" : val < -0.001 ? "#10B981" : "#94A3B8";
          return {
            time: p.time as Time,
            value: Number(val.toFixed(2)),
            color,
          };
        })
      );
      series.createPriceLine({
        price: 0,
        color: "#CBD5E1",
        lineWidth: 1,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: false,
      });
    } else {
      const series = chart.addSeries(AreaSeries, {
        lineColor: "#2563EB",
        lineWidth: 2,
        topColor: "rgba(37, 99, 235, 0.20)",
        bottomColor: "rgba(37, 99, 235, 0.01)",
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 5,
        crosshairMarkerBorderColor: "#FFFFFF",
        crosshairMarkerBorderWidth: 2,
        crosshairMarkerBackgroundColor: "#2563EB",
        priceLineVisible: false,
        lastValueVisible: true,
      });
      series.setData(
        activeSeriesPoints.map((p) => ({
          time: p.time as Time,
          value: Number((p.yoyPct ?? 0).toFixed(2)),
        }))
      );
      series.createPriceLine({
        price: 3.0,
        color: "#64748B",
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: "Meta BCCh 3,0%",
      });
    }

    // Aplicar rango inicial según timeframe seleccionado
    const tfObj = TIMEFRAMES.find((t) => t.key === timeframe);
    if (tfObj?.months && activeSeriesPoints.length > tfObj.months) {
      chart.timeScale().setVisibleLogicalRange({
        from: activeSeriesPoints.length - tfObj.months,
        to: activeSeriesPoints.length - 1,
      });
    } else {
      chart.timeScale().fitContent();
    }

    chart.subscribeCrosshairMove((param) => {
      if (!param.point || !param.time) {
        setHoveredTime(null);
        return;
      }
      if (typeof param.time === "string") {
        setHoveredTime(param.time);
      } else {
        setHoveredTime(null);
      }
    });

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        chart.applyOptions({ width, height });
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [activeSeriesPoints, mode, showTable, timeframe]);

  // Punto activo en el HUD (hover o último punto disponible)
  const hudPoint = useMemo(() => {
    if (activeSeriesPoints.length === 0) return null;
    if (hoveredTime) {
      const found = activeSeriesPoints.find((p) => p.time === hoveredTime);
      if (found) return found;
    }
    return activeSeriesPoints[activeSeriesPoints.length - 1] ?? null;
  }, [activeSeriesPoints, hoveredTime]);

  const hudPrevPoint = useMemo(() => {
    if (!hudPoint) return null;
    const idx = activeSeriesPoints.findIndex((p) => p.m === hudPoint.m);
    return idx > 0 ? activeSeriesPoints[idx - 1] : null;
  }, [activeSeriesPoints, hudPoint]);

  const hudDisplay = useMemo(() => {
    if (!hudPoint) return null;
    if (mode === "indice") {
      const delta = hudPoint.momPct;
      return {
        value: formatNumeroCl(hudPoint.v, 2),
        unit: "pts",
        deltaLabel: delta !== null ? `${formatPctCl(delta, 2, true)} mensual` : "Inicio serie",
        deltaDirection: delta === null ? 0 : delta > 0 ? 1 : delta < 0 ? -1 : 0,
      };
    }
    if (mode === "mensual") {
      const val = hudPoint.momPct ?? 0;
      const prevVal = hudPrevPoint?.momPct ?? null;
      const diffPp = prevVal !== null ? val - prevVal : null;
      return {
        value: formatPctCl(val, 2, true),
        unit: "mensual",
        deltaLabel:
          diffPp !== null
            ? `${diffPp >= 0 ? "+" : "−"}${formatNumeroCl(Math.abs(diffPp), 2)} pp vs mes ant.`
            : "Variación mensual",
        deltaDirection: val > 0 ? 1 : val < 0 ? -1 : 0,
      };
    }
    const val = hudPoint.yoyPct ?? 0;
    const prevVal = hudPrevPoint?.yoyPct ?? null;
    const diffPp = prevVal !== null ? val - prevVal : null;
    return {
      value: formatPctCl(val, 2, false),
      unit: "12 meses",
      deltaLabel:
        diffPp !== null
          ? `${diffPp >= 0 ? "+" : "−"}${formatNumeroCl(Math.abs(diffPp), 2)} pp vs mes ant.`
          : "Variación 12 meses",
      deltaDirection: val > 3.0 ? 1 : val < 3.0 ? -1 : 0,
    };
  }, [hudPoint, hudPrevPoint, mode]);

  const handleTimeframeClick = (nextTf: TimeframeKey) => {
    setTimeframe(nextTf);
    const chart = chartRef.current;
    if (!chart || activeSeriesPoints.length === 0) return;
    const tfObj = TIMEFRAMES.find((t) => t.key === nextTf);
    if (tfObj?.months && activeSeriesPoints.length > tfObj.months) {
      chart.timeScale().setVisibleLogicalRange({
        from: activeSeriesPoints.length - tfObj.months,
        to: activeSeriesPoints.length - 1,
      });
    } else {
      chart.timeScale().fitContent();
    }
  };

  const handleDescargarCsv = () => {
    const filas = [
      "mes,periodo,indice_ipc_base_2023_100,variacion_mensual_pct,inflacion_12_meses_pct",
      ...enriched.map(
        (p) =>
          `${p.m},"${p.mesLargoLabel}",${p.v.toFixed(2)},${
            p.momPct !== null ? p.momPct.toFixed(2) : ""
          },${p.yoyPct !== null ? p.yoyPct.toFixed(2) : ""}`
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

  const primerMes = enriched[0]?.mesCortoLabel ?? "";
  const ultimoMes = enriched[enriched.length - 1]?.mesCortoLabel ?? "";

  return (
    <Card
      aria-labelledby="ipc-tv-chart-title"
      className={cn(
        "gap-0 overflow-hidden rounded-xl border border-border bg-white py-0 shadow-xs ring-0",
        className
      )}
    >
      <CardHeader className="gap-3 border-b border-border/70 px-5 py-4 sm:px-6">
        <div className="space-y-1">
          <CardTitle
            id="ipc-tv-chart-title"
            className="text-base font-semibold tracking-tight text-foreground"
          >
            Evolución oficial del IPC en Chile
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Serie mensual INE (Base 2023 = 100) · {primerMes} a {ultimoMes} ({enriched.length} meses)
          </CardDescription>
        </div>

        <CardAction className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowTable((prev) => !prev)}
            aria-pressed={showTable}
            className="h-8 gap-1.5 bg-white text-xs font-medium"
          >
            {showTable ? (
              <>
                <BarChart3 className="size-3.5 text-muted-foreground" aria-hidden="true" />
                Ver gráfico
              </>
            ) : (
              <>
                <Table2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
                Ver tabla
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDescargarCsv}
            className="h-8 gap-1.5 bg-white text-xs font-medium"
          >
            <Download className="size-3.5 text-muted-foreground" aria-hidden="true" />
            Exportar CSV
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4 p-5 sm:p-6">
        {/* Controles de modo y ventana temporal */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(val) => {
              if (val === "indice" || val === "mensual" || val === "anual") {
                setMode(val);
                setHoveredTime(null);
              }
            }}
            aria-label="Modo del gráfico IPC"
            className="gap-1 rounded-lg bg-slate-100 p-1"
          >
            <ToggleGroupItem
              value="indice"
              className={cn(
                "h-7 rounded-md border-0 px-2.5 text-xs font-medium shadow-none",
                mode === "indice"
                  ? "bg-white text-slate-900 shadow-xs hover:bg-white"
                  : "bg-transparent text-slate-600 hover:bg-transparent hover:text-slate-900"
              )}
            >
              Índice IPC (2023=100)
            </ToggleGroupItem>
            <ToggleGroupItem
              value="mensual"
              className={cn(
                "h-7 rounded-md border-0 px-2.5 text-xs font-medium shadow-none",
                mode === "mensual"
                  ? "bg-white text-slate-900 shadow-xs hover:bg-white"
                  : "bg-transparent text-slate-600 hover:bg-transparent hover:text-slate-900"
              )}
            >
              Variación mensual (%)
            </ToggleGroupItem>
            <ToggleGroupItem
              value="anual"
              className={cn(
                "h-7 rounded-md border-0 px-2.5 text-xs font-medium shadow-none",
                mode === "anual"
                  ? "bg-white text-slate-900 shadow-xs hover:bg-white"
                  : "bg-transparent text-slate-600 hover:bg-transparent hover:text-slate-900"
              )}
            >
              Inflación 12 meses (%)
            </ToggleGroupItem>
          </ToggleGroup>

          {!showTable ? (
            <div
              role="group"
              aria-label="Ventana temporal"
              className="inline-flex w-fit items-center gap-1 rounded-lg border border-border bg-white p-0.5"
            >
              {TIMEFRAMES.map((tf) => {
                const active = timeframe === tf.key;
                return (
                  <button
                    key={tf.key}
                    type="button"
                    onClick={() => handleTimeframeClick(tf.key)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    {tf.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Live Financial HUD */}
        {!showTable && hudPoint && hudDisplay ? (
          <div className="flex flex-wrap items-baseline justify-between gap-3 rounded-lg border border-slate-200/80 bg-slate-50/70 px-4 py-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {formatMesHud(hudPoint.m)}
              </span>
              <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums sm:text-3xl">
                {hudDisplay.value}
              </span>
              <span className="text-xs font-medium text-slate-500">{hudDisplay.unit}</span>
            </div>

            <Badge
              variant="secondary"
              className={cn(
                "h-auto gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold tabular-nums",
                hudDisplay.deltaDirection > 0 &&
                  "border border-blue-200/80 bg-blue-50 text-blue-700",
                hudDisplay.deltaDirection < 0 &&
                  "border border-emerald-200/80 bg-emerald-50 text-emerald-700",
                hudDisplay.deltaDirection === 0 &&
                  "border border-slate-200 bg-white text-slate-600"
              )}
            >
              {hudDisplay.deltaDirection > 0 ? (
                <TrendingUp className="size-3" aria-hidden="true" />
              ) : hudDisplay.deltaDirection < 0 ? (
                <TrendingDown className="size-3" aria-hidden="true" />
              ) : null}
              {hudDisplay.deltaLabel}
            </Badge>
          </div>
        ) : null}

        {/* Contenedor TradingView o Tabla */}
        {!showTable ? (
          <div
            ref={containerRef}
            className="min-h-[300px] h-[340px] w-full overflow-hidden rounded-lg border border-slate-100 bg-white"
            aria-label="Gráfico interactivo de evolución del IPC en Chile"
          />
        ) : (
          <div className="max-h-[400px] overflow-auto rounded-lg border border-border">
            <Table className="tabular-nums">
              <TableHeader className="sticky top-0 bg-slate-50">
                <TableRow className="hover:bg-slate-50">
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
                      {row.mesLargoLabel}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      {formatNumeroCl(row.v, 2)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        row.momPct !== null && row.momPct < 0
                          ? "text-emerald-700"
                          : "text-muted-foreground"
                      )}
                    >
                      {row.momPct !== null ? formatPctCl(row.momPct, 2, true) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {row.yoyPct !== null ? formatPctCl(row.yoyPct, 2, false) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 bg-slate-50/60 px-5 py-3 text-xs text-muted-foreground sm:px-6">
        <span>
          {mode === "anual"
            ? "Línea punteada indica la meta de inflación del Banco Central de Chile (3,0% anual)."
            : "Pasa el cursor sobre el gráfico para inspeccionar el detalle mensual."}
        </span>
        <span className="font-medium text-slate-600">Fuente: INE · Base 2023 = 100</span>
      </CardFooter>
    </Card>
  );
}
