"use client";

import { useMemo, useState } from "react";
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
  Share2,
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
    { id: "bar", Icon: BarChart3 },
    { id: "line", Icon: LineChart },
    { id: "pie", Icon: PieChart },
    { id: "card", Icon: Hash },
    { id: "table", Icon: Table2 },
    { id: "map", Icon: Map },
    { id: "slicer", Icon: Filter },
    { id: "text", Icon: Type },
    { id: "grid", Icon: LayoutGrid },
  ] as const;

  return (
    <div className="flex h-full flex-col bg-[#efeee9]">
      <div className="flex h-8 shrink-0 items-center gap-3 border-b border-line bg-paper px-3">
        <span className="size-3.5 shrink-0 bg-[#F2C811]" />
        <nav className="flex gap-3 text-[11px] text-mute">
          <span className="font-semibold text-ink">Inicio</span>
          <span className="hidden sm:inline">Insertar</span>
          <span className="hidden sm:inline">Modelado</span>
          <span className="hidden sm:inline">Ver</span>
        </nav>
        <span className="ml-auto hidden items-center gap-1 text-[10px] font-semibold text-mute sm:inline-flex">
          <Share2 size={12} />
          Compartir
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="hidden w-8 shrink-0 flex-col items-center gap-3 border-r border-line bg-paper py-2 text-mute sm:flex">
          <LayoutGrid size={15} className="text-ink" />
          <Table2 size={15} />
          <Database size={15} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden p-2">
          <div className="mb-2 flex items-center gap-1.5 overflow-hidden">
            {(["all", 0, 1, 2] as const).map((r) => {
              const label = r === "all" ? "Todas" : demo.regiones[r];
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`min-h-7 shrink-0 whitespace-nowrap rounded-md border px-2.5 text-[10px] font-medium transition-colors ${
                    region === r ? "border-ink bg-paper text-ink" : "border-line bg-paper/70 text-mute hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <span className="mx-1 hidden h-3 w-px shrink-0 bg-line-strong sm:block" />
            {(["2025", "2026"] as const).map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`hidden min-h-7 shrink-0 rounded-md border px-2.5 text-[10px] font-medium transition-colors sm:inline-block ${
                  year === y ? "border-ink bg-paper text-ink" : "border-line bg-paper/70 text-mute hover:text-ink"
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {page === "informe" ? (
            <div className="grid min-h-0 flex-1 grid-cols-12 grid-rows-[auto_minmax(0,1.3fr)_minmax(0,1fr)] gap-1.5">
              <Kpi label="Ingresos" value={data.ingresos} hint={`${data.delta > 0 ? "+" : ""}${data.delta}% YoY`} />
              <Kpi label="Órdenes" value={data.ordenes} hint={year} />
              <Kpi label="Ticket" value={data.ticket} hint="promedio" />
              <Kpi label="Regiones" value={region === "all" ? "3" : "1"} hint={regionLabel} />

              <div className="relative col-span-7 flex flex-col border border-line bg-paper p-2 shadow-sm">
                <p className="mb-1 text-[10px] text-mute">Ventas por mes</p>
                <div className="flex min-h-0 flex-1 items-end gap-1">
                  {data.bars.map((h, i) => (
                    <button
                      key={MONTHS[i]}
                      type="button"
                      aria-label={`Ventas ${MONTHS[i]}`}
                      onMouseEnter={() => setHoverBar(i)}
                      onMouseLeave={() => setHoverBar(null)}
                      className="flex h-full min-h-12 flex-1 flex-col items-center justify-end"
                    >
                      <div
                        className="w-full transition-opacity"
                        style={{
                          height: `${h}%`,
                          background: hoverBar === i || hoverBar === null ? "#118DFF" : "#118DFF99",
                        }}
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-0.5 flex gap-1">
                  {MONTHS.map((m) => (
                    <span key={m} className="flex-1 text-center text-[8px] text-faint">
                      {m}
                    </span>
                  ))}
                </div>
                {hoverBar !== null && (
                  <div className="pointer-events-none absolute top-7 right-2 border border-line bg-paper px-2 py-1 text-[10px] text-ink shadow-sm">
                    {MONTHS[hoverBar]} · {Math.round(data.bars[hoverBar] * 0.42)}M
                  </div>
                )}
              </div>

              <div className="col-span-5 flex flex-col overflow-hidden border border-line bg-paper p-2 shadow-sm">
                <p className="mb-1 text-[10px] text-mute">Canal</p>
                <div className="flex min-h-0 flex-1 items-center gap-1.5 sm:gap-2">
                  <div
                    className="relative size-11 shrink-0 rounded-full sm:size-16"
                    style={{ background: conic(data.channels) }}
                  >
                    <i className="absolute inset-[26%] rounded-full bg-paper" />
                  </div>
                  <ul className="min-w-0">
                    {data.channels.map((c) => (
                      <li key={c.name}>
                        <button
                          type="button"
                          aria-label={`${c.name} ${c.pct}% — filtrar canal`}
                          onClick={() => setChannel(channel === c.name ? null : c.name)}
                          className={`flex min-h-5 w-full items-center gap-1 whitespace-nowrap text-[10px] sm:min-h-6 sm:gap-1.5 ${
                            channel === c.name ? "font-semibold text-ink" : "text-mute hover:text-ink"
                          }`}
                        >
                          <i className="size-2 shrink-0" style={{ background: c.color }} />
                          {c.name} {c.pct}%
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-span-12 flex flex-col border border-line bg-paper p-2 shadow-sm sm:col-span-7">
                <p className="mb-1 text-[10px] text-mute">Tendencia</p>
                <svg viewBox="0 0 160 42" className="h-full w-full" preserveAspectRatio="none">
                  <polyline fill="rgba(17,141,255,0.12)" stroke="none" points={`0,42 ${trendPts(data.trend)} 160,42`} />
                  <polyline fill="none" stroke="#118DFF" strokeWidth="1.8" points={trendPts(data.trend)} />
                </svg>
              </div>
              <div className="hidden flex-col border border-line bg-paper p-2 shadow-sm sm:col-span-5 sm:flex">
                <p className="mb-1 text-[10px] text-mute">Por región</p>
                {data.byRegion.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    aria-label={`${r.name} ${r.pct}% — filtrar región`}
                    onClick={() => setRegion(r.key)}
                    className="flex min-h-6 w-full items-center gap-2 text-[10px]"
                  >
                    <span className="w-16 truncate text-left text-mute">{r.name}</span>
                    <span className="h-1.5 flex-1 bg-wash">
                      <span className="block h-full bg-[#118DFF]" style={{ width: `${r.pct}%` }} />
                    </span>
                    <span className="w-8 text-right text-ink">{r.pct}%</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col border border-line bg-paper shadow-sm">
              <div className="border-b border-line px-2 py-1 text-[10px] text-mute">
                Detalle · {regionLabel} · {year}
                {channel ? ` · ${channel}` : ""}
              </div>
              <table className="w-full text-[10px] sm:text-[11px]">
                <thead className="text-left text-mute">
                  <tr className="border-b border-line">
                    <th className="px-2 py-1 font-medium">Mes</th>
                    <th className="px-2 py-1 font-medium">Canal</th>
                    <th className="px-2 py-1 text-right font-medium">Ventas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.detail.map((row) => (
                    <tr key={row.mes + row.canal} className="border-b border-line/60">
                      <td className="px-2 py-1">{row.mes}</td>
                      <td className="px-2 py-1">{row.canal}</td>
                      <td className="px-2 py-1 text-right font-medium">{row.ventas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="hidden w-[118px] shrink-0 flex-col border-l border-line bg-paper sm:flex">
          <p className="border-b border-line px-2 py-1.5 text-[10px] font-semibold text-ink">Visualizaciones</p>
          <div className="grid grid-cols-3 gap-0.5 p-1.5">
            {visuals.map(({ id, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setVisual(id)}
                className={`flex size-8 items-center justify-center ${
                  visual === id ? "bg-wash text-ink ring-1 ring-line-strong" : "text-mute hover:text-ink"
                }`}
                aria-label={id}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
          <p className="border-y border-line px-2 py-1.5 text-[10px] font-semibold text-ink">Datos</p>
          <ul className="space-y-0.5 px-2 py-1.5 font-mono text-[10px] text-mute">
            <li>▸ Ventas</li>
            <li className="pl-2">monto</li>
            <li className="pl-2">mes</li>
            <li>▸ Clientes</li>
            <li className="pl-2">region</li>
            <li className="pl-2">canal</li>
          </ul>
        </div>
      </div>

      <div className="flex h-7 shrink-0 items-center gap-1 border-t border-line bg-paper px-2">
        <button
          type="button"
          onClick={() => setPage("informe")}
          className={`h-7 px-3 text-[10px] font-medium ${
            page === "informe" ? "border-b-2 border-ink text-ink" : "text-mute"
          }`}
        >
          Informe 1
        </button>
        <button
          type="button"
          onClick={() => setPage("detalle")}
          className={`h-7 px-3 text-[10px] font-medium ${
            page === "detalle" ? "border-b-2 border-ink text-ink" : "text-mute"
          }`}
        >
          Detalle
        </button>
        <span className="ml-1 flex size-4 items-center justify-center bg-[#107c10] text-white">
          <Plus size={10} strokeWidth={3} />
        </span>
      </div>
    </div>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="col-span-3 flex flex-col justify-between border border-line bg-paper p-2 shadow-sm">
      <p className="text-[10px] text-mute">{label}</p>
      <p className="text-sm font-bold tracking-tight text-ink sm:text-base">{value}</p>
      <p className="truncate text-[9px] text-faint">{hint}</p>
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
