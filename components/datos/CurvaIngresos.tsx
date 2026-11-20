"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "@/components/datos/viz/ChartCard";
import { C } from "@/components/datos/viz/tokens";
import { pesos, pesosEje, variacionPorcentual } from "@/lib/datos/formato";
import { cn } from "@/lib/utils";

interface CurvaIngresosProps {
  ing: (number | null)[];
  factorIpc?: number;
  etiquetaPesos?: string;
  /** Percentiles oficiales a 1.er y 5.º año para dibujar la banda P10–P90. */
  pct?: {
    p10_1: number | null;
    p90_1: number | null;
    p10_5: number | null;
    p90_5: number | null;
  };
}

const ETIQUETAS_ANOS = ["1.er año", "2.º año", "3.er año", "4.º año", "5.º año"] as const;

const CHART_CONFIG: ChartConfig = {
  ingreso: {
    label: "Sueldo bruto promedio",
    color: C.blue,
  },
  banda: {
    label: "Banda P10–P90",
    color: C.blue,
  },
};

/** Interpolación lineal entre dos extremos conocidos; null si falta alguno. */
function interp(a: number | null, b: number | null, t: number): number | null {
  if (a === null || b === null) return null;
  return a + (b - a) * t;
}

export function CurvaIngresos({
  ing,
  factorIpc = 1,
  etiquetaPesos = "pesos de sep-2025",
  pct,
}: CurvaIngresosProps) {
  const esc = (v: number | null | undefined): number | null =>
    v !== null && v !== undefined && Number.isFinite(v) ? Math.round(v * factorIpc) : null;

  // Banda P10–P90: solo si los cuatro extremos oficiales están presentes.
  const extremos =
    pct &&
    pct.p10_1 !== null &&
    pct.p90_1 !== null &&
    pct.p10_5 !== null &&
    pct.p90_5 !== null
      ? { p10_1: pct.p10_1, p90_1: pct.p90_1, p10_5: pct.p10_5, p90_5: pct.p90_5 }
      : null;
  const bandaActiva = extremos !== null;

  const puntos = ETIQUETAS_ANOS.map((ano, idx) => {
    const raw = ing[idx] ?? null;
    const valor = raw !== null ? Math.round(raw * factorIpc) : null;
    const t = idx / (ETIQUETAS_ANOS.length - 1);
    // Extremos (año 1 y 5) = oficiales; intermedios = interpolados linealmente.
    // Se interpolan los valores crudos y se escala una sola vez por factorIpc.
    const lo = extremos ? esc(interp(extremos.p10_1, extremos.p10_5, t)) : null;
    const hi = extremos ? esc(interp(extremos.p90_1, extremos.p90_5, t)) : null;
    const banda: [number, number] | null =
      bandaActiva && lo !== null && hi !== null ? [lo, hi] : null;
    return { ano, valor, banda, idx };
  });

  const conDatos = puntos.filter(
    (p): p is {
      ano: (typeof ETIQUETAS_ANOS)[number];
      valor: number;
      banda: [number, number] | null;
      idx: number;
    } => p.valor !== null
  );
  const primerDato = conDatos.length > 0 ? conDatos[0] : null;
  const ultimoDato = conDatos.length > 0 ? conDatos[conDatos.length - 1] : null;
  const ultimoIdx = ultimoDato ? ultimoDato.idx : -1;

  const crecimientoRatio =
    primerDato &&
    ultimoDato &&
    primerDato.idx !== ultimoDato.idx &&
    primerDato.valor > 0
      ? (ultimoDato.valor - primerDato.valor) / primerDato.valor
      : null;

  const etiquetaCrecimiento =
    primerDato && ultimoDato
      ? primerDato.idx === 0 && ultimoDato.idx === 4
        ? "del 1.º al 5.º año"
        : `de ${primerDato.ano} a ${ultimoDato.ano}`
      : "";

  const titulo = "¿Cómo crece el sueldo del 1.er al 5.º año?";
  const subtituloBase = `Sueldo bruto · ${etiquetaPesos}`;
  const subtitulo = bandaActiva
    ? `${subtituloBase} · Banda P10–P90 entre 1.er y 5.º año (extremos oficiales, intermedios interpolados)`
    : subtituloBase;

  if (conDatos.length === 0) {
    return (
      <ChartCard
        title={titulo}
        subtitle={subtituloBase}
        source="mifuturo.cl (Mineduc)"
        license="CC BY-SA 4.0"
      >
        <div className="flex h-[380px] flex-col justify-center gap-2 px-1 text-sm text-muted-foreground">
          <p>
            No hay suficientes casos publicados para graficar la curva de ingresos por año de
            egreso.
          </p>
          <p className="text-xs">
            Cada año corresponde a cohortes distintas; no es el aumento de una misma persona.
          </p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title={titulo}
      subtitle={subtitulo}
      source="mifuturo.cl (Mineduc)"
      license="CC BY-SA 4.0"
      actions={
        crecimientoRatio !== null ? (
          <Badge
            variant="secondary"
            className={cn(
              "h-auto gap-1 rounded-md border px-2.5 py-1 text-xs font-medium tabular-nums",
              crecimientoRatio >= 0
                ? "border-emerald-200/80 bg-emerald-50 text-emerald-800"
                : "border-rose-200/80 bg-rose-50 text-rose-800"
            )}
          >
            <TrendingUp className="size-3.5" aria-hidden="true" />
            {variacionPorcentual(crecimientoRatio)} {etiquetaCrecimiento}
          </Badge>
        ) : undefined
      }
    >
      {/* Cuerpo de altura fija (h-[380px], igual que el skeleton de T8); sin CLS. */}
      <div className="flex h-[380px] flex-col">
        {primerDato && ultimoDato && primerDato.idx !== ultimoDato.idx ? (
          <div
            className="mb-2 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg border border-border/70 px-3 py-1.5 text-xs tabular-nums"
            style={{ backgroundColor: C.surface }}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">{primerDato.ano}:</span>
              <span className="font-semibold text-foreground">{pesos(primerDato.valor)}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">{ultimoDato.ano}:</span>
              <span className="font-semibold" style={{ color: C.blueText }}>
                {pesos(ultimoDato.valor)}
              </span>
            </div>
          </div>
        ) : null}

        <ChartContainer config={CHART_CONFIG} className="min-h-0 w-full flex-1 tabular-nums">
          <AreaChart data={puntos} margin={{ top: 28, right: 20, left: 6, bottom: 4 }}>
            <defs>
              <linearGradient id="curvaIngGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.blue} stopOpacity={0.18} />
                <stop offset="95%" stopColor={C.blue} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
            <XAxis
              dataKey="ano"
              tickLine={false}
              axisLine={{ stroke: C.line }}
              tick={{ fill: C.mute, fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={58}
              domain={[0, "auto"]}
              tickFormatter={(v: number) => pesosEje(v)}
              tick={{ fill: C.mute, fontSize: 12 }}
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;
                const punto = payload[0]?.payload as
                  | { valor: number | null; banda: [number, number] | null; idx: number }
                  | undefined;
                if (!punto) return null;
                const esExtremo = punto.idx === 0 || punto.idx === ETIQUETAS_ANOS.length - 1;
                return (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-lg shadow-slate-900/5">
                    <div className="mb-1.5 font-semibold text-foreground">
                      {String(label)} desde la titulación
                    </div>
                    <div className="flex flex-col gap-1.5 tabular-nums">
                      {punto.valor !== null ? (
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span
                              className="inline-block size-2 rounded-full"
                              style={{ backgroundColor: C.blue }}
                            />
                            Sueldo bruto promedio
                          </span>
                          <span className="font-semibold text-foreground">
                            {pesos(punto.valor)}
                          </span>
                        </div>
                      ) : null}
                      {punto.banda ? (
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span
                              className="inline-block size-2 rounded-full"
                              style={{ backgroundColor: C.blue, opacity: 0.35 }}
                            />
                            Banda P10–P90{esExtremo ? "" : " (interpolada)"}
                          </span>
                          <span className="font-semibold text-foreground">
                            {pesos(punto.banda[0])} – {pesos(punto.banda[1])}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              }}
            />
            {bandaActiva ? (
              <Area
                type="linear"
                dataKey="banda"
                name="banda"
                stroke="none"
                fill={C.blue}
                fillOpacity={0.16}
                connectNulls={false}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            ) : null}
            <Area
              type="monotone"
              dataKey="valor"
              name="ingreso"
              stroke={C.blue}
              strokeWidth={2.25}
              fill="url(#curvaIngGrad)"
              connectNulls={false}
              dot={{ r: 4, fill: C.blue, stroke: "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: C.blueText, stroke: "#ffffff", strokeWidth: 2 }}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="valor"
                content={(props) => {
                  const { x, y, value, index } = props;
                  if (
                    index !== ultimoIdx ||
                    typeof value !== "number" ||
                    typeof x !== "number" ||
                    typeof y !== "number"
                  ) {
                    return null;
                  }
                  return (
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="end"
                      fill={C.blueText}
                      fontSize={12}
                      fontWeight={600}
                      className="tabular-nums"
                    >
                      {pesos(value)}
                    </text>
                  );
                }}
              />
            </Area>
          </AreaChart>
        </ChartContainer>

        <p className="mt-2 border-t border-border/70 pt-2 text-xs leading-snug text-muted-foreground">
          Cada punto refleja una generación distinta de egresados; sirve como referencia de
          progresión salarial, no como aumento garantizado.
        </p>
      </div>
    </ChartCard>
  );
}
