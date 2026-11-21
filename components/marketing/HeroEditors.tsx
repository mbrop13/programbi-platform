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
    { id: "files", label: "Archivos", Icon: Files },
    { id: "search", label: "Buscar", Icon: Search },
    { id: "git", label: "Control de versiones", Icon: GitBranch },
    { id: "debug", label: "Ejecución", Icon: Bug },
    { id: "ext", label: "Extensiones", Icon: Puzzle },
  ] as const;

  return (
    <div className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-[var(--h-border)] bg-[var(--h-wash)] py-2 text-[var(--h-subtle)]">
      {items.map(({ id, label, Icon }) => {
        const active = current === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={active}
            className={`flex size-11 items-center justify-center border-l-2 transition-colors ${
              active
                ? "border-[var(--h-accent)] text-[var(--h-ink)]"
                : "border-transparent hover:text-[var(--h-ink)]"
            }`}
            aria-label={label}
          >
            <Icon size={17} strokeWidth={active ? 2.1 : 1.7} aria-hidden />
          </button>
        );
      })}
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
    <div className="hidden w-[144px] shrink-0 flex-col border-r border-[var(--h-border)] bg-[var(--h-bg)] px-2 py-2.5 sm:flex">
      {panel === "search" ? (
        <>
          <label htmlFor="hero-editor-search" className="mb-2 px-1 text-[11px] font-semibold text-[var(--h-subtle)]">
            Buscar
          </label>
          <input
            id="hero-editor-search"
            type="search"
            placeholder="Buscar"
            className="mb-2 w-full rounded border border-[var(--h-border-strong)] bg-[var(--h-surface)] px-2 py-1 font-mono text-[11px] text-[var(--h-ink)]"
          />
          <p className="px-1 text-[10px] text-[var(--h-muted)]">groupby · ventas.py:6</p>
        </>
      ) : panel === "git" ? (
        <>
          <p className="mb-2 px-1 text-[11px] font-semibold text-[var(--h-subtle)]">Control</p>
          <p className="px-1 text-[11px] text-[var(--h-muted)]">0 cambios</p>
        </>
      ) : panel === "debug" ? (
        <>
          <p className="mb-2 px-1 text-[11px] font-semibold text-[var(--h-subtle)]">Ejecución</p>
          <p className="px-1 text-[11px] text-[var(--h-muted)]">Python: ventas.py</p>
        </>
      ) : panel === "ext" ? (
        <>
          <p className="mb-2 px-1 text-[11px] font-semibold text-[var(--h-subtle)]">Extensiones</p>
          <p className="px-1 text-[11px] text-[var(--h-muted)]">Python · Jupyter · Pylance</p>
        </>
      ) : (
        <>
          <p className="mb-1.5 px-1.5 text-[11px] font-semibold text-[var(--h-subtle)]">Archivos</p>
          {files.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onFile(name)}
              className={`min-h-11 w-full truncate rounded px-1.5 py-2 text-left font-mono text-[11px] transition-colors ${
                name === activeFile
                  ? "bg-[var(--h-accent-soft)] font-medium text-[var(--h-accent)]"
                  : "text-[var(--h-muted)] hover:bg-[var(--h-wash)] hover:text-[var(--h-ink)]"
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
    <div className="flex h-full bg-[var(--h-surface)] text-[var(--h-ink)]">
      <ActivityBar current={panel} onChange={setPanel} />
      <Sidebar
        panel={panel}
        activeFile={file}
        onFile={(name) => {
          if (name === "consulta.sql") onOpenSql();
          else setFile(name);
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[var(--h-surface)]">
        <div className="flex min-h-11 shrink-0 items-center justify-between border-b border-[var(--h-border)] bg-[var(--h-bg)] px-2">
          <div className="flex items-center">
            {(["ventas.py", file === "data/ventas.csv" ? "ventas.csv" : null] as const)
              .filter(Boolean)
              .map((tab) => {
                const isTabActive =
                  (file === "ventas.py" && tab === "ventas.py") ||
                  (file === "data/ventas.csv" && tab === "ventas.csv");
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFile(tab === "ventas.csv" ? "data/ventas.csv" : "ventas.py")}
                    className={`min-h-11 min-w-11 border-b-2 px-2.5 py-1 font-mono text-[11px] transition-colors ${
                      isTabActive
                        ? "border-[var(--h-accent)] font-medium text-[var(--h-ink)]"
                        : "border-transparent text-[var(--h-muted)] hover:text-[var(--h-ink)]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
          </div>
          <button
            type="button"
            onClick={() => setRan(true)}
            className="mr-1 inline-flex min-h-11 items-center gap-1.5 rounded px-3 py-1 font-mono text-[11px] font-semibold text-[var(--h-accent)] transition-colors hover:bg-[var(--h-accent-soft)]"
          >
            <Play size={12} fill="currentColor" aria-hidden />
            Ejecutar
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          {file === "data/ventas.csv" ? (
            <table className="w-full font-mono text-[11px] tabular-nums">
              <thead className="text-left text-[var(--h-subtle)]">
                <tr className="border-b border-[var(--h-border)]">
                  <th className="px-3 py-2 font-medium">mes</th>
                  <th className="px-3 py-2 font-medium">region</th>
                  <th className="px-3 py-2 font-medium">monto</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Ene", demo.cortas[0], "18.200.000"],
                  ["Feb", demo.cortas[1], "9.400.000"],
                  ["Mar", demo.cortas[2], "7.150.000"],
                  ["Abr", demo.cortas[0], "21.800.000"],
                ].map((row, rowIdx) => (
                  <tr key={`${row[0]}-${rowIdx}`} className="border-b border-[var(--h-border)]">
                    {row.map((c, colIdx) => (
                      <td key={`${row[0]}-${colIdx}`} className="px-3 py-1.5 text-[var(--h-ink)]">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <pre className="h-full overflow-hidden px-3 py-3 font-mono text-[11px] leading-[1.7] sm:text-[12px]">
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
          <div className="flex h-[38%] shrink-0 flex-col border-t border-[var(--h-border)] bg-[var(--h-bg)]">
            <div className="flex items-center gap-2 border-b border-[var(--h-border)] px-3 py-1 text-[10px] font-medium text-[var(--h-muted)]">
              <Terminal size={12} aria-hidden />
              Output
              <span className="ml-auto text-[var(--h-subtle)]">Figure(1)</span>
            </div>
            <div className="flex min-h-0 flex-1 items-end gap-1 px-4 py-2">
              {[42, 55, 48, 70, 62, 84, 76, 92].map((h, i) => (
                <div key={MONTHS[i]} className="flex flex-1 flex-col items-center justify-end gap-0.5">
                  <div className="w-full rounded-t-[2px] bg-[var(--h-accent)]" style={{ height: `${h}%` }} />
                  <span className="text-[8px] text-[var(--h-subtle)]">{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex h-7 shrink-0 items-center justify-between border-t border-[var(--h-border)] bg-[var(--h-wash)] px-3 font-mono text-[10px] text-[var(--h-muted)]">
          <span>Python 3.12.8</span>
          <span className="tabular-nums">UTF-8 · Ln {line}, Col 1</span>
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
    }, 320);
  };

  return (
    <div className="flex h-full bg-[var(--h-surface)] text-[var(--h-ink)]">
      <ActivityBar current={panel} onChange={setPanel} />
      <Sidebar panel={panel} activeFile="consulta.sql" onFile={() => undefined} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[var(--h-surface)]">
        <div className="flex min-h-11 shrink-0 items-center justify-between border-b border-[var(--h-border)] bg-[var(--h-bg)] px-2">
          <span className="border-b-2 border-[var(--h-accent)] px-2.5 py-2 font-mono text-[11px] font-medium text-[var(--h-ink)]">
            consulta.sql
          </span>
          <button
            type="button"
            onClick={run}
            className="mr-1 inline-flex min-h-11 items-center gap-1.5 rounded px-3 py-1 font-mono text-[11px] font-semibold text-[var(--h-accent)] transition-colors hover:bg-[var(--h-accent-soft)]"
          >
            <Play size={12} fill="currentColor" aria-hidden />
            {running ? "Ejecutando…" : "Ejecutar"}
          </button>
        </div>
        <pre className="min-h-0 flex-[0.9] overflow-hidden px-3 py-2.5 font-mono text-[11px] leading-[1.7] sm:text-[12px]">
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
        <div className="flex min-h-0 flex-1 flex-col border-t border-[var(--h-border)] bg-[var(--h-bg)]">
          <div className="flex items-center justify-between border-b border-[var(--h-border)] px-3 py-1.5 font-mono text-[10px] text-[var(--h-muted)]">
            <span>{running ? "Ejecutando…" : show ? `Resultados · ${rows.length} filas` : "Mensajes"}</span>
            <button
              type="button"
              onClick={() => setSortDesc((s) => !s)}
              className="min-h-[44px] font-medium text-[var(--h-ink)] hover:text-[var(--h-accent)] sm:min-h-[32px]"
            >
              Orden: {sortDesc ? "DESC" : "ASC"}
            </button>
          </div>
          {show && !running && (
            <table className="w-full font-mono text-[10px] tabular-nums sm:text-[11px]">
              <thead className="text-left text-[var(--h-subtle)]">
                <tr className="border-b border-[var(--h-border)]">
                  <th className="px-3 py-1.5 font-medium">region</th>
                  <th className="px-3 py-1.5 font-medium">total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row[0]}
                    onClick={() => setSel(i)}
                    className={`cursor-pointer border-b border-[var(--h-border)] last:border-b-0 ${
                      sel === i ? "bg-[var(--h-accent-soft)]" : "hover:bg-[var(--h-wash)]"
                    }`}
                  >
                    <td className="px-3 py-1.5 text-[var(--h-ink)]">{row[0]}</td>
                    <td className="px-3 py-1.5 text-[var(--h-ink)]">{row[1]}</td>
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
}: {
  n: number;
  children?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className={`flex w-full gap-3 text-left ${active ? "bg-[var(--h-wash)]" : ""}`}>
      <span className="w-4 shrink-0 text-right tabular-nums text-[var(--h-subtle)] select-none">{n}</span>
      <span>{children}</span>
    </div>
  );
}

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-[#0b63c5] dark:text-[#60a5fa]">{children}</span>;
}
function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-[#9f1239] dark:text-[#fda4af]">{children}</span>;
}
function Fn({ children }: { children: React.ReactNode }) {
  return <span className="text-[#7c4d00] dark:text-[#fcd34d]">{children}</span>;
}
