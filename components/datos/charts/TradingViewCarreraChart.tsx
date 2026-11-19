"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaSeries,
  ColorType,
  CrosshairMode,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from "lightweight-charts";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { pesos, pesosEje, puntos, variacionPorcentual } from "@/lib/datos/formato";
import { cn } from "@/lib/utils";

export interface TradingViewCarreraChartProps {
  evolIng4: Record<string, number | null>;
  evolEmp1: Record<string, number | null>;
  factorIpc?: number;
  etiquetaPesos?: string;
  height?: number;
}

type MetricaKey = "ing4" | "emp1";

const ANOS_SERIE = ["2020", "2021", "2022", "2023", "2024"] as const;

interface PuntoSerie {
  ano: string;
  time: string;
  value: number;
}

function extraerAnoDeTime(time: Time | undefined): string | null {
  if (!time) return null;
  if (typeof time === "string") return time.slice(0, 4);
  if (typeof time === "object" && "year" in time) return String(time.year);
  return null;
}

export function TradingViewCarreraChart({
  evolIng4,
  evolEmp1,
  factorIpc = 1,
  etiquetaPesos = "pesos de sep-2025",
  height = 280,
}: TradingViewCarreraChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [metricaSeleccionada, setMetricaSeleccionada] = useState<MetricaKey>("ing4");
  const [hovered, setHovered] = useState<{ ano: string; value: number } | null>(null);

  const serieIng = useMemo<PuntoSerie[]>(() => {
    const out: PuntoSerie[] = [];
    for (const ano of ANOS_SERIE) {
      const raw = evolIng4[ano];
      if (typeof raw === "number" && Number.isFinite(raw)) {
        out.push({
          ano,
          time: `${ano}-01-01`,
          value: Math.round(raw * factorIpc),
        });
      }
    }
    return out;
  }, [evolIng4, factorIpc]);

  const serieEmp = useMemo<PuntoSerie[]>(() => {
    const out: PuntoSerie[] = [];
    for (const ano of ANOS_SERIE) {
      const raw = evolEmp1[ano];
      if (typeof raw === "number" && Number.isFinite(raw)) {
        out.push({
          ano,
          time: `${ano}-01-01`,
          value: Math.round(raw * 1000) / 10,
        });
      }
    }
    return out;
  }, [evolEmp1]);

  const tieneIng = serieIng.length > 0;
  const tieneEmp = serieEmp.length > 0;
  const ambasSeries = tieneIng && tieneEmp;

  const metricaActiva: MetricaKey =
    metricaSeleccionada === "ing4" && !tieneIng && tieneEmp
      ? "emp1"
      : metricaSeleccionada === "emp1" && !tieneEmp && tieneIng
        ? "ing4"
        : metricaSeleccionada;

  const puntosActivos = metricaActiva === "ing4" ? serieIng : serieEmp;
  const ultimoPunto = puntosActivos.length > 0 ? puntosActivos[puntosActivos.length - 1] : null;
  const primerPunto = puntosActivos.length > 0 ? puntosActivos[0] : null;

  const hudPunto = hovered ?? (ultimoPunto ? { ano: ultimoPunto.ano, value: ultimoPunto.value } : null);

  const variacionTexto = useMemo(() => {
    if (!primerPunto || !ultimoPunto || primerPunto.ano === ultimoPunto.ano) return null;
    if (metricaActiva === "ing4") {
      if (primerPunto.value <= 0) return null;
      const ratio = (ultimoPunto.value - primerPunto.value) / primerPunto.value;
      return {
        texto: `${variacionPorcentual(ratio)} desde ${primerPunto.ano}`,
        positivo: ratio >= 0,
      };
    }
    const deltaPp = ultimoPunto.value - primerPunto.value;
    return {
      texto: `${puntos(deltaPp)} desde ${primerPunto.ano}`,
      positivo: deltaPp >= 0,
    };
  }, [primerPunto, ultimoPunto, metricaActiva]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || puntosActivos.length === 0) return;

    const chart: IChartApi = createChart(container, {
      width: container.clientWidth || 600,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "#ffffff" },
        textColor: "#64748b",
        fontFamily: "inherit",
        fontSize: 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "#f1f5f9" },
        horzLines: { color: "#f1f5f9" },
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          color: "#94a3b8",
          width: 1,
          style: 3,
          labelBackgroundColor: "#0f172a",
        },
        horzLine: {
          color: "#94a3b8",
          width: 1,
          style: 3,
          labelBackgroundColor: "#0f172a",
        },
      },
      rightPriceScale: {
        borderColor: "#e2e8f0",
        scaleMargins: { top: 0.16, bottom: 0.12 },
      },
      timeScale: {
        borderColor: "#e2e8f0",
        fixLeftEdge: true,
        fixRightEdge: true,
        tickMarkFormatter: (time: Time) => extraerAnoDeTime(time) ?? "",
      },
      handleScroll: false,
      handleScale: false,
      localization: {
        priceFormatter: (price: number) =>
          metricaActiva === "ing4"
            ? pesosEje(price)
            : `${price.toFixed(1).replace(".", ",")}%`,
        timeFormatter: (time: Time) => extraerAnoDeTime(time) ?? "",
      },
    });

    const series: ISeriesApi<"Area"> = chart.addSeries(AreaSeries, {
      lineColor: "#2563eb",
      topColor: "rgba(37, 99, 235, 0.22)",
      bottomColor: "rgba(37, 99, 235, 0.01)",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 5,
      crosshairMarkerBorderColor: "#ffffff",
      crosshairMarkerBackgroundColor: "#2563eb",
      priceFormat:
        metricaActiva === "ing4"
          ? { type: "custom", minMove: 1, formatter: (v: number) => pesosEje(v) }
          : {
              type: "custom",
              minMove: 0.1,
              formatter: (v: number) => `${v.toFixed(1).replace(".", ",")}%`,
            },
    });

    series.setData(puntosActivos.map((p) => ({ time: p.time, value: p.value })));
    chart.timeScale().fitContent();

    chart.subscribeCrosshairMove((param) => {
      if (!param.time) {
        setHovered(null);
        return;
      }
      const dataPoint = param.seriesData.get(series) as { value?: number } | undefined;
      const ano = extraerAnoDeTime(param.time);
      if (ano && typeof dataPoint?.value === "number") {
        setHovered({ ano, value: dataPoint.value });
      } else {
        setHovered(null);
      }
    });

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width && width > 0) {
        chart.applyOptions({ width });
        chart.timeScale().fitContent();
      }
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, [puntosActivos, metricaActiva, height]);

  if (!tieneIng && !tieneEmp) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
        Sin serie histórica disponible para este tipo de institución.
      </div>
    );
  }

  const valorFormateado = hudPunto
    ? metricaActiva === "ing4"
      ? pesos(hudPunto.value)
      : `${hudPunto.value.toFixed(1).replace(".", ",")}\u00a0%`
    : "s/i";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Live Top HUD */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 tabular-nums">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {hudPunto ? `Año ${hudPunto.ano}` : "Último año"}
            </span>
            <span className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {valorFormateado}
            </span>
          </div>
          {variacionTexto ? (
            <Badge
              variant="secondary"
              className={cn(
                "h-auto rounded-md border px-2 py-0.5 text-[11px] font-medium tabular-nums",
                variacionTexto.positivo
                  ? "border-emerald-200/80 bg-emerald-50 text-emerald-800"
                  : "border-rose-200/80 bg-rose-50 text-rose-800"
              )}
            >
              {variacionTexto.texto}
            </Badge>
          ) : null}
          <span className="text-[11px] text-muted-foreground">
            {metricaActiva === "ing4"
              ? `Sueldo real 4.º año (${etiquetaPesos})`
              : "Empleabilidad 1.er año"}
          </span>
        </div>

        {/* Toggle entre Sueldo y Empleabilidad */}
        {ambasSeries ? (
          <ToggleGroup
            type="single"
            value={metricaActiva}
            onValueChange={(val) => {
              if (val === "ing4" || val === "emp1") {
                setHovered(null);
                setMetricaSeleccionada(val);
              }
            }}
            aria-label="Métrica del gráfico histórico"
          >
            <ToggleGroupItem value="ing4" className="px-2.5 py-1 text-xs">
              Sueldo real 4.º año
            </ToggleGroupItem>
            <ToggleGroupItem value="emp1" className="px-2.5 py-1 text-xs">
              Empleabilidad 1.er año
            </ToggleGroupItem>
          </ToggleGroup>
        ) : null}
      </div>

      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-lg border border-border/70 bg-white"
        style={{ height }}
      />
    </div>
  );
}
