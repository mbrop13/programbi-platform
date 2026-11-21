"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  BarChart3,
  Database,
  Filter,
  Hash,
  LayoutGrid,
  LineChart,
  Map,
  PieChart,
  Plus,
  Table2,
  Type,
} from "lucide-react";
import { CHANNELS, MONTHS, type DemoPais } from "@/components/marketing/hero-demo";

type RegionKey = "all" | 0 | 1 | 2;

export default function PowerBiCanvas({ demo }: { demo: DemoPais }) {
  const [region, setRegion] = useState<RegionKey>("all");
  const [year, setYear] = useState<"2025" | "2026">("2026");
  const [page, setPage] = useState<"informe" | "detalle">("informe");
  const [channel, setChannel] = useState<string | null>(null);
  const [hoverBar, setHoverBar] = useState<number | null>(null);
  const [visual, setVisual] = useState("bar");

  const regionLabel = region === "all" ? "Todas" : demo.regiones[region];
  const data = useMemo(() => compute(region, year, channel, demo), [region, year, channel, demo]);
  const visuals = [
    { id: "bar", label: "Barras", Icon: BarChart3 },
    { id: "line", label: "Líneas", Icon: LineChart },
    { id: "pie", label: "Circular", Icon: PieChart },
    { id: "card", label: "Tarjeta", Icon: Hash },
    { id: "table", label: "Tabla", Icon: Table2 },
    { id: "map", label: "Mapa", Icon: Map },
    { id: "slicer", label: "Filtro", Icon: Filter },
    { id: "text", label: "Texto", Icon: Type },
    { id: "grid", label: "Matriz", Icon: LayoutGrid },
  ] as const;

  return (
    <div className="flex h-full flex-col bg-[var(--h-wash)] text-[var(--h-ink)]">
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-[var(--h-border)] bg-[var(--h-surface)] px-3">
        <span className="size-3 shrink-0 rounded-xs bg-[#F2C811]" aria-hidden />
        <div className="flex gap-3 text-[11px] text-[var(--h-muted)]">
          <span className="font-semibold text-[var(--h-ink)]">Inicio</span>
          <span className="hidden sm:inline">Insertar</span>
          <span className="hidden sm:inline">Modelado</span>
          <span className="hidden sm:inline">Ver</span>
        </div>
        <span className="ml-auto truncate text-[10px] font-medium text-[var(--h-subtle)]">
          {demo.pbix}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        <div className="hidden w-9 shrink-0 flex-col items-center gap-3 border-r border-[var(--h-border)] bg-[var(--h-surface)] py-2.5 text-[var(--h-subtle)] sm:flex">
          <LayoutGrid size={15} className="text-[var(--h-accent)]" aria-hidden />
          <Table2 size={15} aria-hidden />
          <Database size={15} aria-hidden />
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden p-2.5">
          <div className="mb-2 flex items-center gap-1.5 overflow-x-auto">
            {(["all", 0, 1, 2] as const).map((r) => {
              const label = r === "all" ? "Todas" : demo.regiones[r];
              const active = region === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  aria-pressed={active}
                  className={`min-h-[44px] shrink-0 whitespace-nowrap rounded-md border px-2.5 text-[11px] font-medium transition-colors sm:min-h-[32px] ${
                    active
                      ? "border-[var(--h-accent)] bg-[var(--h-accent-soft)] text-[var(--h-accent)]"
                      : "border-[var(--h-border)] bg-[var(--h-surface)] text-[var(--h-muted)] hover:text-[var(--h-ink)]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <span className="mx-0.5 hidden h-3.5 w-px shrink-0 bg-[var(--h-border-strong)] sm:block" aria-hidden />
            {(["2025", "2026"] as const).map((y) => {
              const active = year === y;
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  aria-pressed={active}
                  className={`hidden min-h-[44px] shrink-0 rounded-md border px-2.5 text-[11px] font-medium tabular-nums transition-colors sm:inline-block sm:min-h-[32px] ${
                    active
                      ? "border-[var(--h-accent)] bg-[var(--h-accent-soft)] text-[var(--h-accent)]"
                      : "border-[var(--h-border)] bg-[var(--h-surface)] text-[var(--h-muted)] hover:text-[var(--h-ink)]"
                  }`}
                >
                  {y}
                </button>
              );
            })}
          </div>

          {page === "informe" ? (
            <div className="grid min-h-0 flex-1 grid-cols-12 grid-rows-[auto_minmax(0,1.25fr)_minmax(0,1fr)] gap-2">
              <Kpi label="Ingresos" value={data.ingresos} hint={`${data.delta > 0 ? "+" : ""}${data.delta}% YoY`} />
              <Kpi label="Órdenes" value={data.ordenes} hint={year} />
              <Kpi label="Ticket" value={data.ticket} hint="promedio" />
              <Kpi label="Regiones" value={region === "all" ? "3" : "1"} hint={regionLabel} />

              <div className="relative col-span-7 flex flex-col rounded-lg border border-[var(--h-border)] bg-[var(--h-surface)] p-2.5">
                <p className="mb-1 text-[10px] font-medium text-[var(--h-muted)]">Ventas por mes</p>
                <div className="flex min-h-0 flex-1 items-end gap-1">
                  {data.bars.map((h, i) => (
                    <button
                      key={MONTHS[i]}
                      type="button"
                      aria-label={`Ventas ${MONTHS[i]}`}
                      onMouseEnter={() => setHoverBar(i)}
                      onMouseLeave={() => setHoverBar(null)}
                      onFocus={() => setHoverBar(i)}
                      onBlur={() => setHoverBar(null)}
                      className="flex h-full min-h-12 flex-1 flex-col items-center justify-end"
                    >
                      <div
                        className="w-full rounded-t-[2px] transition-opacity"
                        style={{
                          height: `${h}%`,
                          backgroundColor: "var(--h-accent)",
                          opacity: hoverBar === i || hoverBar === null ? 1 : 0.45,
                        }}
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-1 flex gap-1">
                  {MONTHS.map((m) => (
                    <span key={m} className="flex-1 text-center text-[9px] text-[var(--h-subtle)]">
                      {m}
                    </span>
                  ))}
                </div>
                {hoverBar !== null && (
                  <div className="pointer-events-none absolute top-2 right-2 rounded border border-[var(--h-border-strong)] bg-[var(--h-surface)] px-2 py-0.5 text-[10px] font-medium tabular-nums text-[var(--h-ink)]">
                    {MONTHS[hoverBar]} · {Math.round(data.bars[hoverBar] * 0.42)}M
                  </div>
                )}
              </div>

              <div className="col-span-5 flex flex-col overflow-hidden rounded-lg border border-[var(--h-border)] bg-[var(--h-surface)] p-2.5">
                <p className="mb-1 text-[10px] font-medium text-[var(--h-muted)]">Canal</p>
                <div className="flex min-h-0 flex-1 items-center gap-2">
                  <div
                    className="relative size-11 shrink-0 rounded-full sm:size-14"
                    style={{ background: conic(data.channels) }}
                    aria-hidden
                  >
                    <i className="absolute inset-[26%] rounded-full bg-[var(--h-surface)]" />
                  </div>
                  <ul className="min-w-0 space-y-0.5">
                    {data.channels.map((c) => (
                      <li key={c.name}>
                        <button
                          type="button"
                          aria-label={`${c.name} ${c.pct}% filtrar canal`}
                          aria-pressed={channel === c.name}
                          onClick={() => setChannel(channel === c.name ? null : c.name)}
                          className={`flex min-h-5 w-full items-center gap-1.5 whitespace-nowrap text-[10px] tabular-nums sm:min-h-6 ${
                            channel === c.name
                              ? "font-semibold text-[var(--h-ink)]"
                              : "text-[var(--h-muted)] hover:text-[var(--h-ink)]"
                          }`}
                        >
                          <i className="size-2 shrink-0 rounded-xs" style={{ background: c.color }} aria-hidden />
                          {c.name} {c.pct}%
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-span-12 flex flex-col rounded-lg border border-[var(--h-border)] bg-[var(--h-surface)] p-2.5 sm:col-span-7">
                <p className="mb-1 text-[10px] font-medium text-[var(--h-muted)]">Tendencia</p>
                <svg viewBox="0 0 160 42" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
                  <polyline
                    fill="var(--h-accent-soft)"
                    stroke="none"
                    points={`0,42 ${trendPts(data.trend)} 160,42`}
                  />
                  <polyline
                    fill="none"
                    stroke="var(--h-accent)"
                    strokeWidth="1.8"
                    points={trendPts(data.trend)}
                  />
                </svg>
              </div>
              <div className="hidden flex-col justify-between rounded-lg border border-[var(--h-border)] bg-[var(--h-surface)] p-2.5 sm:col-span-5 sm:flex">
                <p className="mb-1 text-[10px] font-medium text-[var(--h-muted)]">Por región</p>
                <div className="space-y-1">
                  {data.byRegion.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      aria-label={`${r.name} ${r.pct}% filtrar región`}
                      onClick={() => setRegion(r.key)}
                      className="flex min-h-5 w-full items-center gap-2 text-[10px] tabular-nums"
                    >
                      <span className="w-16 truncate text-left text-[var(--h-muted)]">{r.name}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--h-wash)]">
                        <span
                          className="block h-full rounded-full bg-[var(--h-accent)]"
                          style={{ width: `${r.pct}%` }}
                        />
                      </span>
                      <span className="w-8 text-right font-medium text-[var(--h-ink)]">{r.pct}%</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[var(--h-border)] bg-[var(--h-surface)]">
              <div className="border-b border-[var(--h-border)] px-3 py-1.5 text-[10px] font-medium text-[var(--h-muted)]">
                Detalle · {regionLabel} · {year}
                {channel ? ` · ${channel}` : ""}
              </div>
              <table className="w-full text-[10px] tabular-nums sm:text-[11px]">
                <thead className="text-left text-[var(--h-subtle)]">
                  <tr className="border-b border-[var(--h-border)]">
                    <th className="px-3 py-1.5 font-medium">Mes</th>
                    <th className="px-3 py-1.5 font-medium">Canal</th>
                    <th className="px-3 py-1.5 text-right font-medium">Ventas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.detail.map((row) => (
                    <tr key={row.mes + row.canal} className="border-b border-[var(--h-border)] last:border-b-0">
                      <td className="px-3 py-1.5 text-[var(--h-ink)]">{row.mes}</td>
                      <td className="px-3 py-1.5 text-[var(--h-muted)]">{row.canal}</td>
                      <td className="px-3 py-1.5 text-right font-medium text-[var(--h-ink)]">{row.ventas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col border-t border-[var(--h-border)] bg-[var(--h-surface)] sm:w-[136px] sm:border-t-0 sm:border-l">
          <div className="flex items-center gap-2.5 border-b border-[var(--h-border)] p-2 sm:block">
            <div className="w-20 shrink-0 overflow-hidden rounded-md border border-[var(--h-border)] bg-[var(--h-wash)] sm:w-full">
              <Image
                src="/images/courses/power-bi-card.webp"
                alt="Clase en vivo del curso Power BI en ProgramBI"
                width={320}
                height={180}
                priority
                fetchPriority="high"
                sizes="(max-width: 639px) 80px, 120px"
                className="aspect-video w-full object-cover"
              />
            </div>
            <p className="text-[10px] font-medium text-[var(--h-muted)] sm:mt-1.5">Proyecto del curso</p>
          </div>

          <p className="hidden border-b border-[var(--h-border)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--h-ink)] sm:block">
            Visualizaciones
          </p>
          <div className="hidden grid-cols-3 gap-0.5 p-1.5 sm:grid">
            {visuals.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setVisual(id)}
                aria-pressed={visual === id}
                className={`flex size-8 items-center justify-center rounded transition-colors ${
                  visual === id
                    ? "bg-[var(--h-accent-soft)] text-[var(--h-accent)]"
                    : "text-[var(--h-muted)] hover:bg-[var(--h-wash)] hover:text-[var(--h-ink)]"
                }`}
                aria-label={`Visualización ${label}`}
              >
                <Icon size={14} aria-hidden />
              </button>
            ))}
          </div>
          <p className="hidden border-y border-[var(--h-border)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--h-ink)] sm:block">
            Datos
          </p>
          <ul className="hidden space-y-0.5 px-2.5 py-1.5 font-mono text-[10px] text-[var(--h-muted)] sm:block">
            <li className="text-[var(--h-ink)]">Ventas</li>
            <li className="pl-2">monto</li>
            <li className="pl-2">mes</li>
            <li className="text-[var(--h-ink)]">Clientes</li>
            <li className="pl-2">region</li>
            <li className="pl-2">canal</li>
          </ul>
        </div>
      </div>

      <div className="flex min-h-[44px] shrink-0 items-center gap-1 border-t border-[var(--h-border)] bg-[var(--h-surface)] px-2.5 sm:h-8 sm:min-h-0">
        <button
          type="button"
          onClick={() => setPage("informe")}
          className={`min-h-[44px] border-b-2 px-3 text-[11px] font-medium transition-colors sm:min-h-[32px] ${
            page === "informe"
              ? "border-[var(--h-accent)] text-[var(--h-ink)]"
              : "border-transparent text-[var(--h-muted)] hover:text-[var(--h-ink)]"
          }`}
        >
          Informe 1
        </button>
        <button
          type="button"
          onClick={() => setPage("detalle")}
          className={`min-h-[44px] border-b-2 px-3 text-[11px] font-medium transition-colors sm:min-h-[32px] ${
            page === "detalle"
              ? "border-[var(--h-accent)] text-[var(--h-ink)]"
              : "border-transparent text-[var(--h-muted)] hover:text-[var(--h-ink)]"
          }`}
        >
          Detalle
        </button>
        <span className="ml-1 flex size-4 items-center justify-center rounded-xs bg-[var(--h-wash)] text-[var(--h-muted)]" aria-hidden>
          <Plus size={10} strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="col-span-3 flex flex-col justify-between rounded-lg border border-[var(--h-border)] bg-[var(--h-surface)] p-2">
      <p className="text-[10px] text-[var(--h-muted)]">{label}</p>
      <p className="text-sm font-bold tracking-tight tabular-nums text-[var(--h-ink)] sm:text-base">{value}</p>
      <p className="truncate text-[9px] tabular-nums text-[var(--h-subtle)]">{hint}</p>
    </div>
  );
}

function compute(region: RegionKey, year: "2025" | "2026", channel: string | null, demo: DemoPais) {
  const yf = year === "2025" ? 0.86 : 1;
  const rf = region === "all" ? 1 : region === 0 ? 0.55 : region === 1 ? 0.27 : 0.18;
  const cf = channel === "Retail" ? 0.46 : channel === "B2B" ? 0.28 : channel === "Online" ? 0.26 : 1;
  const f = yf * rf * (channel ? cf / 0.33 : 1);
  const ingresos = 234.5 * f;
  const ordenes = Math.round(8412 * f);
  const bars = [36, 48, 42, 61, 55, 74, 66, 88].map((x) => Math.max(14, Math.round(x * Math.sqrt(f))));
  const channels = CHANNELS.map((c, i) => {
    const raw = [46, 28, 26][i];
    if (channel && c.name !== channel) return { ...c, pct: Math.max(6, Math.round(raw * 0.35)) };
    return { ...c, pct: channel ? Math.round(raw * 1.4) : raw };
  });
  const byRegion: { key: 0 | 1 | 2; name: string; pct: number }[] = [
    { key: 0, name: demo.regiones[0], pct: region === 1 || region === 2 ? 18 : 55 },
    { key: 1, name: demo.regiones[1], pct: region === 1 ? 62 : 27 },
    { key: 2, name: demo.regiones[2], pct: region === 2 ? 58 : 18 },
  ];
  const detail = MONTHS.slice(0, 5).flatMap((mes, i) =>
    (channel ? CHANNELS.filter((c) => c.name === channel) : CHANNELS.slice(0, 2)).map((c) => ({
      mes,
      canal: c.name,
      ventas: `${Math.round((18 - i) * 1.4 * f * (c.name === "Retail" ? 1.2 : 0.8))}M`,
    })),
  );
  return {
    ingresos: `$${ingresos.toFixed(1)}M`,
    ordenes: ordenes.toLocaleString(demo.locale),
    ticket: `$${(27.8 * yf).toFixed(1)}k`,
    delta: year === "2026" ? 12 : -4,
    bars,
    channels,
    byRegion,
    trend: bars.map((b) => 42 - b * 0.32),
    detail: detail.slice(0, 6),
  };
}

function conic(channels: { pct: number; color: string }[]) {
  let acc = 0;
  const parts = channels.map((c) => {
    const from = acc;
    acc += c.pct;
    return `${c.color} ${from}% ${acc}%`;
  });
  return `conic-gradient(${parts.join(", ")})`;
}

function trendPts(ys: number[]) {
  return ys.map((y, i) => `${(i / (ys.length - 1)) * 160},${y}`).join(" ");
}
