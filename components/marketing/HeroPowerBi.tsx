"use client";

import { useMemo, useState } from "react";
import { CHANNELS, MONTHS, type DemoPais } from "@/components/marketing/hero-demo";

type RegionKey = "all" | 0 | 1 | 2;

const CHANNEL_COLORS: Record<string, string> = {
  Retail: "#0b63c5",
  B2B: "#0d9488",
  Online: "#475569",
};

export default function PowerBiCanvas({ demo }: { demo: DemoPais }) {
  const [region, setRegion] = useState<RegionKey>("all");
  const [year, setYear] = useState<"2025" | "2026">("2026");
  const [page, setPage] = useState<"informe" | "detalle">("informe");
  const [channel, setChannel] = useState<string | null>(null);
  const [activeBar, setActiveBar] = useState<number | null>(null);

  const regionLabel = region === "all" ? "Todas" : demo.regiones[region];
  const data = useMemo(() => compute(region, year, channel, demo), [region, year, channel, demo]);

  const maxBar = Math.max(...data.barsM, 10);
  const yCeiling = Math.ceil(maxBar / 10) * 10;
  const yTicks = [0, 0.33, 0.66, 1].map((r) => Math.round(yCeiling * r));

  // Coordenadas del gráfico SVG (360 x 156)
  const chartW = 360;
  const chartH = 148;
  const padL = 34;
  const padR = 10;
  const padT = 14;
  const padB = 22;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  const slotW = plotW / MONTHS.length;
  const barW = Math.min(24, slotW * 0.56);

  const trendPoints = data.barsM
    .map((val, i) => {
      const x = padL + slotW * i + slotW / 2;
      const y = padT + plotH - (val / yCeiling) * plotH * 0.92;
      return `${x.toFixed(1)},${Math.max(padT + 4, y - 6).toFixed(1)}`;
    })
    .join(" ");

  const donutRadius = 52;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const totalPct = data.channels.reduce((acc, c) => acc + c.pct, 0) || 100;

  return (
    <div className="flex flex-1 flex-col gap-3 bg-[#f2f4f7] p-3 dark:bg-[#0e0f13] sm:p-4">
      {/* Barra de filtros interactivos */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filtrar por región">
          {(["all", 0, 1, 2] as const).map((r) => {
            const label = r === "all" ? "Todas" : demo.regiones[r];
            const selected = region === r;
            return (
              <button
                key={String(r)}
                type="button"
                aria-pressed={selected}
                onClick={() => setRegion(r)}
                className={`min-h-[44px] rounded-lg px-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] sm:min-h-[32px] ${
                  selected
                    ? "bg-[#0b63c5] text-white dark:bg-[#2563eb]"
                    : "border border-black/[0.08] bg-white text-[#4b5058] hover:text-[#111214] dark:border-white/[0.1] dark:bg-[#16171d] dark:text-[#b4b7c0] dark:hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1" role="group" aria-label="Seleccionar año">
          {(["2025", "2026"] as const).map((y) => {
            const selected = year === y;
            return (
              <button
                key={y}
                type="button"
                aria-pressed={selected}
                onClick={() => setYear(y)}
                className={`min-h-[44px] rounded-lg px-2.5 text-xs font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] sm:min-h-[32px] ${
                  selected
                    ? "bg-[#111214] text-white dark:bg-[#f4f4f6] dark:text-[#111214]"
                    : "border border-black/[0.08] bg-white text-[#4b5058] hover:text-[#111214] dark:border-white/[0.1] dark:bg-[#16171d] dark:text-[#b4b7c0] dark:hover:text-white"
                }`}
              >
                {y}
              </button>
            );
          })}
        </div>

        <div
          className="ml-auto flex items-center rounded-lg border border-black/[0.08] bg-white p-0.5 dark:border-white/[0.1] dark:bg-[#16171d]"
          role="group"
          aria-label="Cambiar vista del informe"
        >
          {(
            [
              { id: "informe", label: "Resumen" },
              { id: "detalle", label: "Detalle" },
            ] as const
          ).map((v) => {
            const selected = page === v.id;
            return (
              <button
                key={v.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setPage(v.id)}
                className={`min-h-[44px] rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] sm:min-h-[32px] ${
                  selected
                    ? "bg-[#eff0f2] text-[#111214] dark:bg-[#252730] dark:text-white"
                    : "text-[#525866] hover:text-[#111214] dark:text-[#9ca3af] dark:hover:text-white"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {page === "informe" ? (
        <>
          {/* Fila de 4 KPIs ejecutivos */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Kpi
              label="Ingresos"
              value={data.ingresos}
              hint={`${data.delta > 0 ? "+" : ""}${data.delta}% YoY`}
              trend={data.delta > 0 ? "up" : "down"}
            />
            <Kpi label="Órdenes" value={data.ordenes} hint={`Año ${year}`} />
            <Kpi label="Ticket prom." value={data.ticket} hint={channel ?? "Todos los canales"} />
            <Kpi label="Regiones" value={region === "all" ? "3" : "1"} hint={regionLabel} />
          </div>

          {/* Gráficos SVG principales */}
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-12">
            {/* Barras + Tendencia */}
            <div className="relative flex flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3.5 dark:border-white/[0.08] dark:bg-[#16171d] sm:col-span-7">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#111214] dark:text-[#f4f4f6]">
                  Ventas mensuales (Ene - Ago)
                </p>
                <span className="text-xs font-medium text-[#0b63c5] tabular-nums dark:text-[#60a5fa]">
                  {activeBar !== null
                    ? `${MONTHS[activeBar]}: $${data.barsM[activeBar].toFixed(1)}M`
                    : `Total: ${data.ingresos}`}
                </span>
              </div>

              <div className="relative w-full">
                <svg
                  viewBox={`0 0 ${chartW} ${chartH}`}
                  className="h-auto w-full select-none overflow-visible"
                  role="img"
                  aria-label="Gráfico de ventas mensuales de enero a agosto"
                >
                  {/* Guías horizontales + Eje Y */}
                  {yTicks.map((tick) => {
                    const y = padT + plotH - (tick / yCeiling) * plotH;
                    return (
                      <g key={tick}>
                        <line
                          x1={padL}
                          x2={chartW - padR}
                          y1={y}
                          y2={y}
                          stroke="currentColor"
                          strokeOpacity={0.1}
                          strokeDasharray="3 3"
                          className="text-[#111214] dark:text-[#f4f4f6]"
                        />
                        <text
                          x={padL - 6}
                          y={y + 3}
                          textAnchor="end"
                          className="fill-[#525866] text-[9.5px] tabular-nums dark:fill-[#9ca3af]"
                        >
                          {tick}M
                        </text>
                      </g>
                    );
                  })}

                  {/* Barras */}
                  {data.barsM.map((val, i) => {
                    const h = Math.max(4, (val / yCeiling) * plotH);
                    const x = padL + slotW * i + (slotW - barW) / 2;
                    const y = padT + plotH - h;
                    const isFocused = activeBar === i;
                    const dimmed = activeBar !== null && !isFocused;

                    return (
                      <g key={MONTHS[i]}>
                        <rect
                          x={x}
                          y={y}
                          width={barW}
                          height={h}
                          rx={4}
                          className={`transition-opacity ${
                            isFocused
                              ? "fill-[#084a96] dark:fill-[#60a5fa]"
                              : "fill-[#0b63c5] dark:fill-[#3b82f6]"
                          }`}
                          opacity={dimmed ? 0.45 : 1}
                        />
                        <text
                          x={padL + slotW * i + slotW / 2}
                          y={chartH - 5}
                          textAnchor="middle"
                          className={`text-[10px] tabular-nums ${
                            isFocused
                              ? "fill-[#111214] font-semibold dark:fill-white"
                              : "fill-[#525866] dark:fill-[#9ca3af]"
                          }`}
                        >
                          {MONTHS[i]}
                        </text>
                        <rect
                          x={padL + slotW * i}
                          y={padT}
                          width={slotW}
                          height={plotH + padB}
                          fill="transparent"
                          className="cursor-pointer"
                          tabIndex={0}
                          role="button"
                          aria-label={`${MONTHS[i]}: $${val.toFixed(1)}M`}
                          onMouseEnter={() => setActiveBar(i)}
                          onMouseLeave={() => setActiveBar(null)}
                          onFocus={() => setActiveBar(i)}
                          onBlur={() => setActiveBar(null)}
                        />
                      </g>
                    );
                  })}

                  {/* Línea de tendencia */}
                  <polyline
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={trendPoints}
                    className="pointer-events-none"
                  />
                  {data.barsM.map((val, i) => {
                    const cx = padL + slotW * i + slotW / 2;
                    const cy = Math.max(padT + 4, padT + plotH - (val / yCeiling) * plotH * 0.92 - 6);
                    return (
                      <circle
                        key={`node-${MONTHS[i]}`}
                        cx={cx}
                        cy={cy}
                        r={activeBar === i ? 4 : 2.5}
                        fill="#ffffff"
                        stroke="#0d9488"
                        strokeWidth={1.75}
                        className="pointer-events-none"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Donut por canal + Regiones */}
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-black/[0.07] bg-white p-3.5 dark:border-white/[0.08] dark:bg-[#16171d] sm:col-span-5">
              <div>
                <p className="mb-2 text-xs font-semibold text-[#111214] dark:text-[#f4f4f6]">
                  Distribución por canal
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative size-24 shrink-0 sm:size-[104px]">
                    <svg viewBox="0 0 132 132" className="size-full -rotate-90" aria-hidden="true">
                      {(() => {
                        let offset = 0;
                        return data.channels.map((c) => {
                          const frac = c.pct / totalPct;
                          const dash = frac * donutCircumference;
                          const gap = donutCircumference - dash;
                          const currentOffset = offset;
                          offset += dash;
                          const isSelected = channel === c.name;
                          const dimmed = channel !== null && !isSelected;

                          return (
                            <circle
                              key={c.name}
                              cx="66"
                              cy="66"
                              r={donutRadius}
                              fill="none"
                              stroke={CHANNEL_COLORS[c.name] ?? c.color}
                              strokeWidth={isSelected ? 12 : 10}
                              strokeDasharray={`${dash} ${gap}`}
                              strokeDashoffset={-currentOffset}
                              opacity={dimmed ? 0.35 : 1}
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="pointer-events-none absolute inset-[18%] flex flex-col items-center justify-center text-center">
                      <span className="text-[8.5px] font-medium leading-none tracking-wider text-[#525866] uppercase dark:text-[#9ca3af]">
                        {channel ?? "Total"}
                      </span>
                      <span className="mt-0.5 text-[10.5px] font-semibold leading-tight tracking-tight text-[#111214] tabular-nums dark:text-[#f4f4f6] sm:text-[11px]">
                        {channel
                          ? `${data.channels.find((c) => c.name === channel)?.pct ?? 100}%`
                          : data.ingresos}
                      </span>
                    </div>
                  </div>

                  <ul className="min-w-0 flex-1 space-y-1">
                    {data.channels.map((c) => {
                      const active = channel === c.name;
                      return (
                        <li key={c.name}>
                          <button
                            type="button"
                            aria-pressed={active}
                            onClick={() => setChannel(active ? null : c.name)}
                            className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-lg px-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] sm:min-h-[28px] ${
                              active
                                ? "bg-[#eff0f2] font-semibold text-[#111214] dark:bg-[#252730] dark:text-white"
                                : "text-[#4b5058] hover:bg-[#f7f7f8] hover:text-[#111214] dark:text-[#b4b7c0] dark:hover:bg-white/[0.04] dark:hover:text-white"
                            }`}
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <span
                                className="size-2.5 shrink-0 rounded-sm"
                                style={{ backgroundColor: CHANNEL_COLORS[c.name] ?? c.color }}
                              />
                              {c.name}
                            </span>
                            <span className="tabular-nums">{c.pct}%</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="border-t border-black/[0.06] pt-2.5 dark:border-white/[0.08]">
                <p className="mb-1.5 text-xs font-semibold text-[#111214] dark:text-[#f4f4f6]">
                  Participación por región
                </p>
                <div className="space-y-1">
                  {data.byRegion.map((r) => {
                    const active = region === r.key;
                    return (
                      <button
                        key={r.key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setRegion(active ? "all" : r.key)}
                        className={`flex min-h-[44px] w-full items-center gap-2 rounded-md px-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] sm:min-h-[26px] ${
                          active
                            ? "bg-[#eff0f2] font-semibold text-[#111214] dark:bg-[#252730] dark:text-white"
                            : "text-[#4b5058] hover:bg-[#f7f7f8] dark:text-[#b4b7c0] dark:hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="w-20 truncate text-left">{r.name}</span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#e5e7eb] dark:bg-white/[0.1]">
                          <span
                            className="block h-full rounded-full bg-[#0b63c5] dark:bg-[#3b82f6]"
                            style={{ width: `${r.pct}%` }}
                          />
                        </span>
                        <span className="w-8 text-right font-medium text-[#111214] tabular-nums dark:text-[#f4f4f6]">
                          {r.pct}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Vista Detalle */
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-black/[0.07] bg-white dark:border-white/[0.08] dark:bg-[#16171d]">
          <div className="flex items-center justify-between border-b border-black/[0.07] px-3.5 py-2.5 text-xs text-[#525866] dark:border-white/[0.08] dark:text-[#9ca3af]">
            <span className="font-medium text-[#111214] dark:text-[#f4f4f6]">
              Detalle de ventas: {regionLabel} ({year})
              {channel ? ` · ${channel}` : ""}
            </span>
            <span className="tabular-nums">{data.detail.length} registros</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/[0.07] bg-[#f7f7f8] text-[#525866] dark:border-white/[0.08] dark:bg-[#1b1d24] dark:text-[#9ca3af]">
                <tr>
                  <th scope="col" className="px-3.5 py-2 font-semibold">
                    Mes
                  </th>
                  <th scope="col" className="px-3.5 py-2 font-semibold">
                    Canal
                  </th>
                  <th scope="col" className="px-3.5 py-2 font-semibold">
                    Región
                  </th>
                  <th scope="col" className="px-3.5 py-2 text-right font-semibold">
                    Ventas
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                {data.detail.map((row) => (
                  <tr
                    key={`${row.mes}-${row.canal}`}
                    className="transition-colors hover:bg-[#f7f7f8] dark:hover:bg-white/[0.04]"
                  >
                    <td className="px-3.5 py-2 font-medium text-[#111214] dark:text-[#f4f4f6]">
                      {row.mes}
                    </td>
                    <td className="px-3.5 py-2 text-[#4b5058] dark:text-[#b4b7c0]">{row.canal}</td>
                    <td className="px-3.5 py-2 text-[#4b5058] dark:text-[#b4b7c0]">{regionLabel}</td>
                    <td className="px-3.5 py-2 text-right font-semibold text-[#111214] tabular-nums dark:text-[#f4f4f6]">
                      {row.ventas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  trend,
}: {
  label: string;
  value: string;
  hint: string;
  trend?: "up" | "down";
}) {
  const hintColor =
    trend === "up"
      ? "text-[#15803d] dark:text-[#4ade80]"
      : trend === "down"
        ? "text-[#b91c1c] dark:text-[#f87171]"
        : "text-[#525866] dark:text-[#9ca3af]";

  return (
    <div className="flex flex-col justify-between rounded-xl border border-black/[0.07] bg-white px-3 py-2.5 dark:border-white/[0.08] dark:bg-[#16171d]">
      <p className="text-[11px] font-medium text-[#525866] dark:text-[#9ca3af]">{label}</p>
      <p className="mt-0.5 text-[17px] font-semibold tracking-tight text-[#111214] tabular-nums dark:text-[#f4f4f6] sm:text-[19px]">
        {value}
      </p>
      <p className={`mt-0.5 truncate text-[11px] font-medium tabular-nums ${hintColor}`}>{hint}</p>
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
  const baseBars = [16.2, 21.4, 18.8, 26.5, 24.1, 32.8, 29.4, 38.6];
  const barsM = baseBars.map((x) => Math.max(4.5, Number((x * Math.sqrt(f)).toFixed(1))));

  const channels = CHANNELS.map((c, i) => {
    const raw = [46, 28, 26][i];
    if (channel && c.name !== channel) return { ...c, pct: Math.max(8, Math.round(raw * 0.35)) };
    return { ...c, pct: channel ? Math.min(78, Math.round(raw * 1.45)) : raw };
  });

  const byRegion: { key: 0 | 1 | 2; name: string; pct: number }[] = [
    { key: 0, name: demo.regiones[0], pct: region === 1 || region === 2 ? 18 : 55 },
    { key: 1, name: demo.regiones[1], pct: region === 1 ? 62 : 27 },
    { key: 2, name: demo.regiones[2], pct: region === 2 ? 58 : 18 },
  ];

  const detail = MONTHS.slice(0, 6).flatMap((mes, i) =>
    (channel ? CHANNELS.filter((c) => c.name === channel) : CHANNELS.slice(0, 2)).map((c) => ({
      mes,
      canal: c.name,
      ventas: `$${((18 - i) * 1.4 * f * (c.name === "Retail" ? 1.2 : 0.8)).toFixed(1)}M`,
    })),
  );

  return {
    ingresos: `$${ingresos.toFixed(1)}M`,
    ordenes: ordenes.toLocaleString(demo.locale),
    ticket: `$${(27.8 * yf).toFixed(1)}k`,
    delta: year === "2026" ? 12 : -4,
    barsM,
    channels,
    byRegion,
    detail: detail.slice(0, 6),
  };
}
