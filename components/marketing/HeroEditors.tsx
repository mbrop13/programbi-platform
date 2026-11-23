"use client";

import { useMemo, useState } from "react";
import { Play, Terminal } from "lucide-react";
import { MONTHS, type DemoPais } from "@/components/marketing/hero-demo";
import { tokenizeCode, type SyntaxLanguage, type SyntaxTokenType } from "@/lib/guias/syntax";

const TOKEN_CLASSES: Record<SyntaxTokenType, string> = {
  plain: "text-[#111214] dark:text-[#f4f4f6]",
  keyword: "text-[#0b63c5] dark:text-[#93c5fd] font-medium",
  function: "text-[#9a3412] dark:text-[#fcd34d]",
  string: "text-[#166534] dark:text-[#86efac]",
  number: "text-[#9d174d] dark:text-[#f9a8d4]",
  comment: "text-[#64748b] dark:text-[#8b95aa] italic",
  operator: "text-[#334155] dark:text-[#cbd5e1]",
};

function HighlightedCode({
  code,
  language,
  activeLine,
}: {
  code: string;
  language: SyntaxLanguage;
  activeLine?: number;
}) {
  const lines = useMemo(() => code.split("\n"), [code]);

  return (
    <div className="overflow-x-auto px-3 py-3 font-mono text-[12.5px] leading-[1.65] sm:px-4 sm:text-[13px]">
      <div className="min-w-max">
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const isActive = activeLine === lineNum;
          const tokens = tokenizeCode(line, language);
          return (
            <div
              key={lineNum}
              className={`flex items-baseline gap-4 rounded px-1.5 ${
                isActive ? "bg-[#0b63c5]/[0.05] dark:bg-white/[0.04]" : ""
              }`}
            >
              <span className="w-5 shrink-0 select-none text-right text-[#6b7280] tabular-nums dark:text-[#636b7f]">
                {lineNum}
              </span>
              <code className="whitespace-pre">
                {tokens.length > 0 ? (
                  tokens.map((tok, tIdx) => (
                    <span key={tIdx} className={TOKEN_CLASSES[tok.type]}>
                      {tok.value}
                    </span>
                  ))
                ) : (
                  "\u00A0"
                )}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PYTHON_CODE = `import pandas as pd
import plotly.express as px

# Cargar ventas mensuales y agrupar por periodo
ventas = pd.read_csv("data/ventas.csv")
mensual = (
    ventas.groupby("mes", as_index=False)
    .agg(total=("monto", "sum"))
)

fig = px.bar(mensual, x="mes", y="total", title="Ventas mensuales")
fig.show()`;

const PYTHON_BARS = [16.2, 21.4, 18.8, 26.5, 24.1, 32.8, 29.4, 38.6];

export function PythonEditor({
  demo,
}: {
  demo: DemoPais;
  onOpenSql?: () => void;
}) {
  const [file, setFile] = useState<"analisis_ventas.py" | "data/ventas.csv">("analisis_ventas.py");
  const [ran, setRan] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-white text-[#111214] dark:bg-[#121318] dark:text-[#f4f4f6]">
      {/* Barra superior del editor */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.08] bg-[#f7f7f8] px-3 py-1.5 dark:border-white/[0.08] dark:bg-[#171920]">
        <div className="flex items-center gap-1" role="tablist" aria-label="Archivos de Python">
          {(["analisis_ventas.py", "data/ventas.csv"] as const).map((tab) => {
            const active = file === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFile(tab)}
                className={`min-h-[44px] cursor-pointer rounded-md px-2.5 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa] sm:min-h-[32px] ${
                  active
                    ? "bg-white font-semibold text-[#111214] ring-1 ring-black/[0.08] dark:bg-white/[0.08] dark:text-white dark:ring-0"
                    : "text-[#525866] hover:bg-black/[0.04] hover:text-[#111214] dark:text-[#9ca3af] dark:hover:bg-white/[0.04] dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            setFile("analisis_ventas.py");
            setRan(true);
          }}
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-lg bg-[#0b63c5] px-3 text-xs font-medium text-white transition-colors hover:bg-[#0953a6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa] sm:min-h-[32px]"
        >
          <Play size={12} fill="currentColor" aria-hidden="true" />
          Ejecutar
        </button>
      </div>

      {/* Área de código o CSV */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {file === "data/ventas.csv" ? (
          <div className="overflow-x-auto p-3 sm:p-4">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-black/[0.08] bg-[#f7f7f8] text-[#525866] dark:border-white/[0.08] dark:bg-[#171920] dark:text-[#9ca3af]">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    mes
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    region
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-semibold">
                    monto
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                {[
                  ["Ene", demo.cortas[0], "18.200.000"],
                  ["Feb", demo.cortas[1], "9.400.000"],
                  ["Mar", demo.cortas[2], "7.150.000"],
                  ["Abr", demo.cortas[0], "21.800.000"],
                  ["May", demo.cortas[1], "14.650.000"],
                ].map((row, idx) => (
                  <tr key={`${row[0]}-${idx}`} className="hover:bg-[#f7f7f8] dark:hover:bg-white/[0.03]">
                    <td className="px-3 py-2 font-medium text-[#111214] dark:text-[#f4f4f6]">{row[0]}</td>
                    <td className="px-3 py-2 text-[#4b5058] dark:text-[#cbd5e1]">{row[1]}</td>
                    <td className="px-3 py-2 text-right font-medium text-[#166534] tabular-nums dark:text-[#86efac]">
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <HighlightedCode code={PYTHON_CODE} language="python" activeLine={11} />
        )}

        {/* Panel Output */}
        {ran && file === "analisis_ventas.py" ? (
          <div className="mt-auto border-t border-black/[0.08] bg-[#f7f7f8] dark:border-white/[0.08] dark:bg-[#171920]">
            <div className="flex items-center justify-between border-b border-black/[0.08] px-3.5 py-1.5 font-mono text-[11px] text-[#525866] dark:border-white/[0.08] dark:text-[#9ca3af]">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#111214] dark:text-[#f4f4f6]">
                <Terminal size={13} aria-hidden="true" />
                Output
              </span>
              <span className="font-medium text-[#166534] tabular-nums dark:text-[#86efac]">
                8 meses · Total $207.8M
              </span>
            </div>
            <div className="bg-white px-3.5 py-2.5 dark:bg-[#121318]">
              <svg
                viewBox="0 0 340 105"
                className="h-auto w-full max-w-[440px] select-none"
                role="img"
                aria-label="Gráfico de barras generado por Python"
              >
                {[0, 20, 40].map((tick) => {
                  const y = 78 - (tick / 40) * 62;
                  return (
                    <g key={tick}>
                      <line
                        x1={32}
                        x2={330}
                        y1={y}
                        y2={y}
                        strokeDasharray="2 3"
                        className="stroke-black/[0.09] dark:stroke-white/[0.08]"
                      />
                      <text
                        x={26}
                        y={y + 3}
                        textAnchor="end"
                        className="fill-[#5f6670] font-mono text-[9px] tabular-nums dark:fill-[#8b95aa]"
                      >
                        {tick}M
                      </text>
                    </g>
                  );
                })}
                {PYTHON_BARS.map((val, i) => {
                  const slot = (330 - 36) / MONTHS.length;
                  const bw = 20;
                  const x = 36 + slot * i + (slot - bw) / 2;
                  const h = (val / 40) * 62;
                  const y = 78 - h;
                  return (
                    <g key={MONTHS[i]}>
                      <rect
                        x={x}
                        y={y}
                        width={bw}
                        height={h}
                        rx={3}
                        className="fill-[#0b63c5] dark:fill-[#3b82f6]"
                      />
                      <text
                        x={x + bw / 2}
                        y={y - 3}
                        textAnchor="middle"
                        className="fill-[#111214] font-mono text-[8.5px] font-medium tabular-nums dark:fill-[#cbd5e1]"
                      >
                        {val.toFixed(0)}
                      </text>
                      <text
                        x={x + bw / 2}
                        y={93}
                        textAnchor="middle"
                        className="fill-[#5f6670] font-mono text-[9.5px] dark:fill-[#9ca3af]"
                      >
                        {MONTHS[i]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        ) : null}
      </div>

      {/* Barra de estado */}
      <div className="flex items-center justify-between border-t border-black/[0.08] bg-[#f7f7f8] px-3.5 py-1.5 font-mono text-[11px] text-[#525866] dark:border-white/[0.08] dark:bg-[#171920] dark:text-[#9ca3af]">
        <span>Python 3.12 · pandas + plotly</span>
        <span className="tabular-nums">UTF-8 · Ln 11, Col 1</span>
      </div>
    </div>
  );
}

const SQL_CODE = `-- Resumen de ventas por región (año activo)
SELECT
  c.region,
  COUNT(v.id) AS ordenes,
  SUM(v.monto) AS total
FROM ventas v
JOIN clientes c ON c.id = v.cliente_id
WHERE v.fecha >= '2026-01-01'
GROUP BY c.region
ORDER BY total DESC;`;

export function SqlEditor({ demo }: { demo: DemoPais }) {
  const [running, setRunning] = useState(false);
  const [show, setShow] = useState(true);
  const [sel, setSel] = useState<number | null>(0);
  const [sortDesc, setSortDesc] = useState(true);

  const rows = useMemo(() => {
    const data = [
      [demo.sqlRegiones[0], "3.840", "$128.450.000"],
      [demo.sqlRegiones[1], "1.920", "$64.210.000"],
      [demo.sqlRegiones[2], "1.250", "$41.880.000"],
      [demo.sqlRegiones[3], "890", "$29.140.000"],
    ];
    return sortDesc ? data : [...data].reverse();
  }, [sortDesc, demo.sqlRegiones]);

  const run = () => {
    setRunning(true);
    setShow(false);
    window.setTimeout(() => {
      setRunning(false);
      setShow(true);
    }, 320);
  };

  return (
    <div className="flex flex-1 flex-col bg-white text-[#111214] dark:bg-[#121318] dark:text-[#f4f4f6]">
      {/* Barra superior SQL */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.08] bg-[#f7f7f8] px-3 py-1.5 dark:border-white/[0.08] dark:bg-[#171920]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[#111214] dark:text-white">
            consulta_ventas.sql
          </span>
          <span className="rounded border border-black/[0.08] bg-white px-2 py-0.5 text-[11px] font-medium text-[#4b5058] dark:border-white/[0.1] dark:bg-white/[0.08] dark:text-[#cbd5e1]">
            SQL Server
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSortDesc((s) => !s)}
            className="min-h-[44px] cursor-pointer rounded-lg border border-black/[0.1] bg-white px-2.5 text-xs font-medium text-[#111214] transition-colors hover:bg-[#eff0f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:border-white/15 dark:bg-white/[0.04] dark:text-[#e2e8f0] dark:hover:bg-white/[0.08] dark:focus-visible:outline-[#60a5fa] sm:min-h-[32px]"
          >
            Orden: {sortDesc ? "DESC" : "ASC"}
          </button>
          <button
            type="button"
            onClick={run}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-lg bg-[#0b63c5] px-3 text-xs font-medium text-white transition-colors hover:bg-[#0953a6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa] sm:min-h-[32px]"
          >
            <Play size={12} fill="currentColor" aria-hidden="true" />
            {running ? "Ejecutando..." : "Ejecutar consulta"}
          </button>
        </div>
      </div>

      {/* Editor SQL */}
      <div className="border-b border-black/[0.08] dark:border-white/[0.08]">
        <HighlightedCode code={SQL_CODE} language="sql" activeLine={5} />
      </div>

      {/* Resultados */}
      <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-[#121318]">
        <div className="flex items-center justify-between border-b border-black/[0.08] bg-[#f7f7f8] px-3.5 py-1.5 font-mono text-[11px] text-[#525866] dark:border-white/[0.08] dark:bg-[#171920] dark:text-[#9ca3af]">
          <span>
            {running ? "Ejecutando consulta..." : show ? `42 ms · ${rows.length} filas` : "Sin resultados"}
          </span>
          <span className="font-medium text-[#111214] dark:text-[#cbd5e1]">dbo.ventas</span>
        </div>

        {show && !running ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-black/[0.08] bg-[#f7f7f8] text-[#525866] dark:border-white/[0.08] dark:bg-[#171920] dark:text-[#9ca3af]">
                <tr>
                  <th scope="col" className="px-3.5 py-2 font-semibold">
                    region
                  </th>
                  <th scope="col" className="px-3.5 py-2 text-right font-semibold">
                    ordenes
                  </th>
                  <th scope="col" className="px-3.5 py-2 text-right font-semibold">
                    total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                {rows.map((row, i) => {
                  const selected = sel === i;
                  return (
                    <tr
                      key={row[0]}
                      onClick={() => setSel(i)}
                      className={`cursor-pointer transition-colors ${
                        selected
                          ? "bg-[#0b63c5]/[0.07] dark:bg-[#0b63c5]/20"
                          : "hover:bg-[#f7f7f8] dark:hover:bg-white/[0.04]"
                      }`}
                    >
                      <td className="px-3.5 py-2 font-medium text-[#111214] dark:text-white">{row[0]}</td>
                      <td className="px-3.5 py-2 text-right text-[#4b5058] tabular-nums dark:text-[#cbd5e1]">
                        {row[1]}
                      </td>
                      <td className="px-3.5 py-2 text-right font-semibold text-[#166534] tabular-nums dark:text-[#86efac]">
                        {row[2]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
