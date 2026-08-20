"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bug,
  Code2,
  Database,
  Files,
  Filter,
  GitBranch,
  Hash,
  LayoutGrid,
  LineChart,
  Map,
  PieChart,
  Play,
  Plus,
  Puzzle,
  Search,
  Share2,
  Table2,
  Terminal,
  Type,
} from "lucide-react";

const TABS = [
  { id: "python", title: "Python", icon: Code2 },
  { id: "bi", title: "Power BI", icon: BarChart3 },
  { id: "sql", title: "SQL Server", icon: Database },
] as const;

type TabId = (typeof TABS)[number]["id"];

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago"];
const CHANNELS = [
  { name: "Retail", color: "#118DFF" },
  { name: "B2B", color: "#E66C37" },
  { name: "Online", color: "#D9B300" },
] as const;

export default function HeroPreview() {
  const [active, setActive] = useState<TabId>("python");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      setActive((cur) => TABS[(TABS.findIndex((x) => x.id === cur) + 1) % TABS.length].id);
    }, 9000);
    return () => window.clearInterval(t);
  }, [active, paused]);

  const current = TABS.find((t) => t.id === active)!;
  const file =
    active === "python" ? "ventas.py" : active === "sql" ? "consulta.sql" : "Ventas Chile.pbix";

  const pause = () => setPaused(true);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-8 rounded-[50px] bg-gradient-to-tr from-ink/8 via-ink/0 to-ink/6 blur-3xl" />

      <div
        className="relative flex h-[min(420px,50vh)] w-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_25px_80px_rgba(23,23,22,0.10)] ring-1 ring-ink/5 sm:h-[min(500px,56vh)] sm:rounded-[26px]"
        onPointerDown={pause}
      >
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-line bg-canvas px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <i className="size-3 rounded-full bg-[#ff5f57]" />
              <i className="size-3 rounded-full bg-[#febc2e]" />
              <i className="size-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="ml-3 hidden items-center gap-2 text-xs font-medium text-mute sm:flex">
              <span className="font-semibold text-ink">{file}</span>
              <span className="text-faint">—</span>
              <span className="font-mono text-[11px] text-faint">{current.title}</span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-faint">Clase en vivo</span>
        </div>

        <div className="relative min-h-0 flex-1 bg-canvas">
          {active === "python" && <PythonEditor onOpenSql={() => setActive("sql")} />}
          {active === "sql" && <SqlEditor />}
          {active === "bi" && <PowerBiCanvas />}
        </div>
      </div>

      <div className="relative mt-3 flex overflow-hidden rounded-lg border-2 border-line-strong bg-canvas" suppressHydrationWarning>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActive(tab.id);
                pause();
              }}
              className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold transition-colors ${
                isActive ? "bg-paper text-ink" : "text-mute hover:text-ink"
              }`}
            >
              <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ActivityBar({
  current,
  onChange,
}: {
  current: string;
  onChange: (id: string) => void;
}) {
  const items = [
    { id: "files", Icon: Files },
    { id: "search", Icon: Search },
    { id: "git", Icon: GitBranch },
    { id: "debug", Icon: Bug },
    { id: "ext", Icon: Puzzle },
  ] as const;
  return (
    <div className="flex w-10 shrink-0 flex-col items-center gap-1 border-r border-line bg-wash py-2 text-mute">
      {items.map(({ id, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex size-9 items-center justify-center ${
            current === id ? "border-l-2 border-ink text-ink" : "border-l-2 border-transparent hover:text-ink"
          }`}
          aria-label={id}
        >
          <Icon size={18} strokeWidth={current === id ? 2.2 : 1.8} />
        </button>
      ))}
    </div>
  );
}

function Sidebar({
  panel,
  activeFile,
  onFile,
}: {
  panel: string;
  activeFile: string;
  onFile: (name: string) => void;
}) {
  const files = ["ventas.py", "consulta.sql", "data/ventas.csv"];
  return (
    <div className="hidden w-[138px] shrink-0 flex-col border-r border-line bg-canvas px-2 py-2 sm:flex">
      {panel === "search" ? (
        <>
          <p className="mb-2 px-1 text-[10px] font-semibold tracking-wider text-faint uppercase">Search</p>
          <input
            type="search"
            placeholder="Buscar"
            className="mb-2 w-full border border-line bg-paper px-1.5 py-1 font-mono text-[11px] text-ink outline-none"
          />
          <p className="px-1 text-[10px] text-mute">groupby · ventas.py:6</p>
        </>
      ) : panel === "git" ? (
        <>
          <p className="mb-2 px-1 text-[10px] font-semibold tracking-wider text-faint uppercase">Source Control</p>
          <p className="px-1 text-[11px] text-mute">0 cambios</p>
        </>
      ) : panel === "debug" ? (
        <>
          <p className="mb-2 px-1 text-[10px] font-semibold tracking-wider text-faint uppercase">Run</p>
          <p className="px-1 text-[11px] text-mute">Python: ventas.py</p>
        </>
      ) : panel === "ext" ? (
        <>
          <p className="mb-2 px-1 text-[10px] font-semibold tracking-wider text-faint uppercase">Extensions</p>
          <p className="px-1 text-[11px] text-mute">Python · Jupyter · Pylance</p>
        </>
      ) : (
        <>
          <p className="mb-2 px-1 text-[10px] font-semibold tracking-wider text-faint uppercase">Explorer</p>
          {files.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onFile(name)}
              className={`w-full truncate px-1.5 py-0.5 text-left font-mono text-[11px] ${
                name === activeFile ? "bg-wash text-ink" : "text-mute hover:text-ink"
              }`}
            >
              {name}
            </button>
          ))}
        </>
      )}
    </div>
  );
}

function PythonEditor({ onOpenSql }: { onOpenSql: () => void }) {
  const [panel, setPanel] = useState("files");
  const [file, setFile] = useState("ventas.py");
  const [ran, setRan] = useState(false);
  const [line, setLine] = useState(10);

  return (
    <div className="flex h-full">
      <ActivityBar current={panel} onChange={setPanel} />
      <Sidebar
        panel={panel}
        activeFile={file}
        onFile={(name) => {
          if (name === "consulta.sql") onOpenSql();
          else setFile(name);
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-paper">
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-line bg-canvas px-2">
          <div className="flex items-center">
            {(["ventas.py", file === "data/ventas.csv" ? "ventas.csv" : null] as const)
              .filter(Boolean)
              .map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFile(tab === "ventas.csv" ? "data/ventas.csv" : "ventas.py")}
                  className={`px-2 py-1 font-mono text-[11px] ${
                    (file === "ventas.py" && tab === "ventas.py") ||
                    (file === "data/ventas.csv" && tab === "ventas.csv")
                      ? "border-b-2 border-ink text-ink"
                      : "text-mute"
                  }`}
                >
                  {tab}
                </button>
              ))}
          </div>
          <button
            type="button"
            onClick={() => setRan(true)}
            className="mr-1 inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] font-semibold text-ink hover:bg-wash"
          >
            <Play size={12} fill="currentColor" />
            Ejecutar
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          {file === "data/ventas.csv" ? (
            <table className="w-full font-mono text-[11px]">
              <thead className="text-left text-mute">
                <tr className="border-b border-line">
                  <th className="px-3 py-1.5 font-medium">mes</th>
                  <th className="px-3 py-1.5 font-medium">region</th>
                  <th className="px-3 py-1.5 font-medium">monto</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Ene", "RM", "18.200.000"],
                  ["Feb", "Valparaíso", "9.400.000"],
                  ["Mar", "Biobío", "7.150.000"],
                  ["Abr", "RM", "21.800.000"],
                ].map((row) => (
                  <tr key={row.join()} className="border-b border-line/60">
                    {row.map((c) => (
                      <td key={c} className="px-3 py-1">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <pre className="h-full overflow-hidden px-3 py-2.5 font-mono text-[11px] leading-[1.7] sm:text-[12px]">
              <CodeLine n={1} active={line === 1} onClick={() => setLine(1)}>
                <Kw>import</Kw> pandas <Kw>as</Kw> pd
              </CodeLine>
              <CodeLine n={2} active={line === 2} onClick={() => setLine(2)}>
                <Kw>import</Kw> plotly.express <Kw>as</Kw> px
              </CodeLine>
              <CodeLine n={3} active={line === 3} onClick={() => setLine(3)} />
              <CodeLine n={4} active={line === 4} onClick={() => setLine(4)}>
                ventas = pd.<Fn>read_csv</Fn>(<Str>&quot;ventas.csv&quot;</Str>)
              </CodeLine>
              <CodeLine n={5} active={line === 5} onClick={() => setLine(5)}>
                mensual = (
              </CodeLine>
              <CodeLine n={6} active={line === 6} onClick={() => setLine(6)}>
                {"    "}ventas.<Fn>groupby</Fn>(<Str>&quot;mes&quot;</Str>, as_index=<Kw>False</Kw>)
              </CodeLine>
              <CodeLine n={7} active={line === 7} onClick={() => setLine(7)}>
                {"    "}.<Fn>agg</Fn>(total=(<Str>&quot;monto&quot;</Str>, <Str>&quot;sum&quot;</Str>))
              </CodeLine>
              <CodeLine n={8} active={line === 8} onClick={() => setLine(8)}>
                )
              </CodeLine>
              <CodeLine n={9} active={line === 9} onClick={() => setLine(9)} />
              <CodeLine n={10} active={line === 10} onClick={() => setLine(10)}>
                fig = px.<Fn>bar</Fn>(mensual, x=<Str>&quot;mes&quot;</Str>, y=<Str>&quot;total&quot;</Str>)
              </CodeLine>
              <CodeLine n={11} active={line === 11} onClick={() => setLine(11)}>
                fig.<Fn>show</Fn>()
              </CodeLine>
            </pre>
          )}
        </div>

        {ran && file === "ventas.py" && (
          <div className="flex h-[38%] shrink-0 flex-col border-t border-line bg-canvas">
            <div className="flex items-center gap-2 border-b border-line px-3 py-1 text-[10px] font-medium text-mute">
              <Terminal size={12} />
              Output
              <span className="ml-auto text-faint">Figure(1)</span>
            </div>
            <div className="flex min-h-0 flex-1 items-end gap-1 px-4 py-2">
              {[42, 55, 48, 70, 62, 84, 76, 92].map((h, i) => (
                <div key={MONTHS[i]} className="flex flex-1 flex-col items-center justify-end gap-0.5">
                  <div className="w-full bg-[#118DFF]" style={{ height: `${h}%` }} />
                  <span className="text-[8px] text-faint">{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex h-6 shrink-0 items-center justify-between border-t border-line bg-wash px-3 font-mono text-[10px] text-mute">
          <span>Python 3.12.8</span>
          <span>UTF-8 · Ln {line}, Col 1</span>
        </div>
      </div>
    </div>
  );
}

function SqlEditor() {
  const [panel, setPanel] = useState("files");
  const [running, setRunning] = useState(false);
  const [show, setShow] = useState(true);
  const [sel, setSel] = useState<number | null>(0);
  const [sortDesc, setSortDesc] = useState(true);

  const rows = useMemo(() => {
    const data = [
      ["Metropolitana", "128.450.000"],
      ["Valparaíso", "64.210.000"],
      ["Biobío", "41.880.000"],
      ["Antofagasta", "29.140.000"],
    ];
    return sortDesc ? data : [...data].reverse();
  }, [sortDesc]);

  const run = () => {
    setRunning(true);
    setShow(false);
    window.setTimeout(() => {
      setRunning(false);
      setShow(true);
    }, 420);
  };

  return (
    <div className="flex h-full">
      <ActivityBar current={panel} onChange={setPanel} />
      <Sidebar panel={panel} activeFile="consulta.sql" onFile={() => undefined} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-paper">
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-line bg-canvas px-2">
          <span className="border-b-2 border-ink px-2 py-1 font-mono text-[11px] text-ink">consulta.sql</span>
          <button
            type="button"
            onClick={run}
            className="mr-1 inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] font-semibold text-ink hover:bg-wash"
          >
            <Play size={12} fill="currentColor" />
            {running ? "Ejecutando…" : "Ejecutar"}
          </button>
        </div>
        <pre className="min-h-0 flex-[0.9] overflow-hidden px-3 py-2 font-mono text-[11px] leading-[1.7] sm:text-[12px]">
          <CodeLine n={1}>
            <Kw>SELECT</Kw> c.region, <Fn>SUM</Fn>(v.monto) <Kw>AS</Kw> total
          </CodeLine>
          <CodeLine n={2}>
            <Kw>FROM</Kw> ventas v
          </CodeLine>
          <CodeLine n={3}>
            <Kw>JOIN</Kw> clientes c <Kw>ON</Kw> c.id = v.cliente_id
          </CodeLine>
          <CodeLine n={4}>
            <Kw>WHERE</Kw> v.fecha &gt;= <Str>&apos;2025-01-01&apos;</Str>
          </CodeLine>
          <CodeLine n={5}>
            <Kw>GROUP BY</Kw> c.region
          </CodeLine>
          <CodeLine n={6}>
            <Kw>ORDER BY</Kw> total <Kw>DESC</Kw>;
          </CodeLine>
        </pre>
        <div className="flex min-h-0 flex-1 flex-col border-t border-line bg-canvas">
          <div className="flex items-center justify-between border-b border-line px-3 py-1 font-mono text-[10px] text-mute">
            <span>{running ? "Running…" : show ? `Results · ${rows.length} rows` : "Messages"}</span>
            <button type="button" onClick={() => setSortDesc((s) => !s)} className="hover:text-ink">
              Orden: {sortDesc ? "DESC" : "ASC"}
            </button>
          </div>
          {show && !running && (
            <table className="w-full font-mono text-[10px] sm:text-[11px]">
              <thead className="text-left text-mute">
                <tr className="border-b border-line">
                  <th className="px-3 py-1 font-medium">region</th>
                  <th className="px-3 py-1 font-medium">total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row[0]}
                    onClick={() => setSel(i)}
                    className={`cursor-pointer border-b border-line/60 ${sel === i ? "bg-wash" : "hover:bg-paper"}`}
                  >
                    <td className="px-3 py-1 text-ink">{row[0]}</td>
                    <td className="px-3 py-1 text-ink">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

type Region = "Todas" | "Metropolitana" | "Valparaíso" | "Biobío";

function PowerBiCanvas() {
  const [region, setRegion] = useState<Region>("Todas");
  const [year, setYear] = useState<"2025" | "2026">("2026");
  const [page, setPage] = useState<"informe" | "detalle">("informe");
  const [channel, setChannel] = useState<string | null>(null);
  const [hoverBar, setHoverBar] = useState<number | null>(null);
  const [visual, setVisual] = useState("bar");

  const data = useMemo(() => compute(region, year, channel), [region, year, channel]);
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
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {(["Todas", "Metropolitana", "Valparaíso", "Biobío"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`border px-2 py-0.5 text-[10px] font-medium ${
                  region === r ? "border-ink bg-paper text-ink" : "border-line bg-paper/70 text-mute hover:text-ink"
                }`}
              >
                {r}
              </button>
            ))}
            <span className="mx-1 h-3 w-px bg-line-strong" />
            {(["2025", "2026"] as const).map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`border px-2 py-0.5 text-[10px] font-medium ${
                  year === y ? "border-ink bg-paper text-ink" : "border-line bg-paper/70 text-mute hover:text-ink"
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {page === "informe" ? (
            <div className="grid min-h-0 flex-1 grid-cols-12 gap-1.5">
              <Kpi label="Ingresos" value={data.ingresos} hint={`${data.delta > 0 ? "+" : ""}${data.delta}% YoY`} />
              <Kpi label="Órdenes" value={data.ordenes} hint={year} />
              <Kpi label="Ticket" value={data.ticket} hint="promedio" />
              <Kpi label="Regiones" value={region === "Todas" ? "3" : "1"} hint={region} />

              <div className="relative col-span-7 flex flex-col border border-line bg-paper p-2 shadow-sm">
                <p className="mb-1 text-[10px] text-mute">Ventas por mes</p>
                <div className="flex min-h-0 flex-1 items-end gap-1">
                  {data.bars.map((h, i) => (
                    <button
                      key={MONTHS[i]}
                      type="button"
                      onMouseEnter={() => setHoverBar(i)}
                      onMouseLeave={() => setHoverBar(null)}
                      className="flex h-full flex-1 flex-col items-center justify-end"
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

              <div className="col-span-5 flex flex-col border border-line bg-paper p-2 shadow-sm">
                <p className="mb-1 text-[10px] text-mute">Canal</p>
                <div className="flex flex-1 items-center gap-2">
                  <div
                    className="relative size-16 shrink-0 rounded-full"
                    style={{ background: conic(data.channels) }}
                  >
                    <i className="absolute inset-[26%] rounded-full bg-paper" />
                  </div>
                  <ul className="min-w-0 space-y-1">
                    {data.channels.map((c) => (
                      <li key={c.name}>
                        <button
                          type="button"
                          onClick={() => setChannel(channel === c.name ? null : c.name)}
                          className={`flex w-full items-center gap-1.5 text-[10px] ${
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
                    key={r.name}
                    type="button"
                    onClick={() => setRegion(r.name as Region)}
                    className="mb-1 flex items-center gap-2 text-[10px]"
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
                Detalle · {region} · {year}
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
          className={`px-2 py-0.5 text-[10px] font-medium ${
            page === "informe" ? "border-b-2 border-ink text-ink" : "text-mute"
          }`}
        >
          Informe 1
        </button>
        <button
          type="button"
          onClick={() => setPage("detalle")}
          className={`px-2 py-0.5 text-[10px] font-medium ${
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

function compute(region: Region, year: "2025" | "2026", channel: string | null) {
  const yf = year === "2025" ? 0.86 : 1;
  const rf = region === "Todas" ? 1 : region === "Metropolitana" ? 0.55 : region === "Valparaíso" ? 0.27 : 0.18;
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
  const byRegion = [
    { name: "Metropolitana", pct: region === "Valparaíso" || region === "Biobío" ? 18 : 55 },
    { name: "Valparaíso", pct: region === "Valparaíso" ? 62 : 27 },
    { name: "Biobío", pct: region === "Biobío" ? 58 : 18 },
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
    ordenes: ordenes.toLocaleString("es-CL"),
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

function CodeLine({
  n,
  children,
  active,
  onClick,
}: {
  n: number;
  children?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={`flex w-full gap-3 text-left ${active ? "bg-wash" : ""} ${onClick ? "cursor-pointer" : ""}`}
    >
      <span className="w-4 shrink-0 text-right text-faint select-none">{n}</span>
      <span>{children}</span>
    </div>
  );
}

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-[#0451a5]">{children}</span>;
}
function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-[#a31515]">{children}</span>;
}
function Fn({ children }: { children: React.ReactNode }) {
  return <span className="text-[#795e26]">{children}</span>;
}
