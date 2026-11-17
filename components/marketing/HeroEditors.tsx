"use client";

import { useMemo, useState } from "react";
import { Bug, Files, GitBranch, Play, Puzzle, Search, Terminal } from "lucide-react";
import { MONTHS, type DemoPais } from "@/components/marketing/hero-demo";

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
    <div className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-line bg-wash py-2 text-mute">
      {items.map(({ id, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex size-12 items-center justify-center ${
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
              className={`min-h-12 w-full truncate px-1.5 py-2 text-left font-mono text-[11px] ${
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

export function PythonEditor({ demo, onOpenSql }: { demo: DemoPais; onOpenSql: () => void }) {
  const [panel, setPanel] = useState("files");
  const [file, setFile] = useState("ventas.py");
  const [ran, setRan] = useState(false);
  const line = 10;

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
        <div className="flex min-h-12 shrink-0 items-center justify-between border-b border-line bg-canvas px-2">
          <div className="flex items-center">
            {(["ventas.py", file === "data/ventas.csv" ? "ventas.csv" : null] as const)
              .filter(Boolean)
              .map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFile(tab === "ventas.csv" ? "data/ventas.csv" : "ventas.py")}
                  className={`min-h-12 min-w-12 px-2 py-1 font-mono text-[11px] ${
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
            className="mr-1 inline-flex min-h-12 items-center gap-1 px-3 py-0.5 font-mono text-[11px] font-semibold text-ink hover:bg-wash"
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
                  ["Ene", demo.cortas[0], "18.200.000"],
                  ["Feb", demo.cortas[1], "9.400.000"],
                  ["Mar", demo.cortas[2], "7.150.000"],
                  ["Abr", demo.cortas[0], "21.800.000"],
                ].map((row, rowIdx) => (
                  <tr key={`${row[0]}-${rowIdx}`} className="border-b border-line/60">
                    {row.map((c, colIdx) => (
                      <td key={`${row[0]}-${colIdx}`} className="px-3 py-1">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <pre className="h-full overflow-hidden px-3 py-2.5 font-mono text-[11px] leading-[1.7] sm:text-[12px]">
              <CodeLine n={1}>
                <Kw>import</Kw> pandas <Kw>as</Kw> pd
              </CodeLine>
              <CodeLine n={2}>
                <Kw>import</Kw> plotly.express <Kw>as</Kw> px
              </CodeLine>
              <CodeLine n={3} />
              <CodeLine n={4}>
                ventas = pd.<Fn>read_csv</Fn>(<Str>&quot;ventas.csv&quot;</Str>)
              </CodeLine>
              <CodeLine n={5}>
                mensual = (
              </CodeLine>
              <CodeLine n={6}>
                {"    "}ventas.<Fn>groupby</Fn>(<Str>&quot;mes&quot;</Str>, as_index=<Kw>False</Kw>)
              </CodeLine>
              <CodeLine n={7}>
                {"    "}.<Fn>agg</Fn>(total=(<Str>&quot;monto&quot;</Str>, <Str>&quot;sum&quot;</Str>))
              </CodeLine>
              <CodeLine n={8}>
                )
              </CodeLine>
              <CodeLine n={9} />
              <CodeLine n={10} active>
                fig = px.<Fn>bar</Fn>(mensual, x=<Str>&quot;mes&quot;</Str>, y=<Str>&quot;total&quot;</Str>)
              </CodeLine>
              <CodeLine n={11}>
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

export function SqlEditor({ demo }: { demo: DemoPais }) {
  const [panel, setPanel] = useState("files");
  const [running, setRunning] = useState(false);
  const [show, setShow] = useState(true);
  const [sel, setSel] = useState<number | null>(0);
  const [sortDesc, setSortDesc] = useState(true);

  const rows = useMemo(() => {
    const data = [
      [demo.sqlRegiones[0], "128.450.000"],
      [demo.sqlRegiones[1], "64.210.000"],
      [demo.sqlRegiones[2], "41.880.000"],
      [demo.sqlRegiones[3], "29.140.000"],
    ];
    return sortDesc ? data : [...data].reverse();
  }, [sortDesc, demo.sqlRegiones]);

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
        <div className="flex min-h-12 shrink-0 items-center justify-between border-b border-line bg-canvas px-2">
          <span className="border-b-2 border-ink px-2 py-1 font-mono text-[11px] text-ink">consulta.sql</span>
          <button
            type="button"
            onClick={run}
            className="mr-1 inline-flex min-h-12 items-center gap-1 px-3 py-0.5 font-mono text-[11px] font-semibold text-ink hover:bg-wash"
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
