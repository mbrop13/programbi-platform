"use client";

import * as React from "react";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { BuscadorCarreras } from "@/components/datos/BuscadorCarreras";
import { TIPO_ETIQUETAS, type TipoIesKey } from "@/lib/datos/carreras-tipos";
import { expandirConsulta, SINONIMOS_CARRERAS } from "@/lib/datos/carreras-sinonimos";
import { anosDesdeSemestres, pesos, porcentaje } from "@/lib/datos/formato";
import { cn } from "@/lib/utils";

/** Qué cifra ordena el ranking. Decide la columna con barra y cuál secundaria se omite. */
export type MetricaPreset = "ing4" | "emp1" | "ratio" | "arancel" | "crec";

export interface FilaRankingPreset {
  /** Posición original en el ranking (por tipo si el ranking va separado por tipo). */
  pos: number;
  slug: string;
  tipo: TipoIesKey;
  nombre: string;
  area: string;
  valor: number | null;
  texto: string;
  ing4: number | null;
  emp1: number | null;
  arancel: number | null;
  dur: number | null;
}

type FiltroTipo = TipoIesKey | "todas";
type Orden = "pos" | "ing4" | "emp1" | "arancel" | "dur";

const ETIQUETA_FILTRO: Record<TipoIesKey, string> = {
  u: "Universidades",
  ip: "Institutos (IP)",
  cft: "CFT",
};

const ORDENES: { key: Orden; label: string }[] = [
  { key: "pos", label: "Posición en el ranking" },
  { key: "ing4", label: "Mayor sueldo al 4.º año" },
  { key: "emp1", label: "Mayor empleabilidad" },
  { key: "arancel", label: "Menor arancel" },
  { key: "dur", label: "Menor duración real" },
];

interface Columna {
  key: "ing4" | "emp1" | "arancel" | "dur";
  label: string;
  corto: string;
  formato: (f: FilaRankingPreset) => string;
}

const COLUMNAS: Columna[] = [
  { key: "ing4", label: "Sueldo 4.º año", corto: "Sueldo 4.º", formato: (f) => pesos(f.ing4) },
  { key: "emp1", label: "Empleabilidad 1.er año", corto: "Empleo 1.er", formato: (f) => porcentaje(f.emp1) },
  { key: "arancel", label: "Arancel anual", corto: "Arancel", formato: (f) => pesos(f.arancel) },
  {
    key: "dur",
    label: "Duración real",
    corto: "Duración",
    formato: (f) => (f.dur !== null ? anosDesdeSemestres(f.dur) : "Sin dato"),
  },
];

function coincide(fila: FilaRankingPreset, q: string): boolean {
  if (!q) return true;
  const nombre = expandirConsulta(fila.nombre);
  const area = expandirConsulta(fila.area);
  if (nombre.includes(q) || area.includes(q)) return true;
  const sinonimos = SINONIMOS_CARRERAS[fila.slug] ?? [];
  if (sinonimos.some((s) => expandirConsulta(s).includes(q))) return true;
  const tokens = q.split(" ").filter((t) => t.length > 1);
  return tokens.length > 1 && tokens.every((t) => nombre.includes(t));
}

function ordenar(filas: FilaRankingPreset[], orden: Orden): FilaRankingPreset[] {
  if (orden === "pos") return filas;
  const valor = (f: FilaRankingPreset) => f[orden];
  const desc = orden === "ing4" || orden === "emp1";
  return [...filas].sort((a, b) => {
    const va = valor(a);
    const vb = valor(b);
    if (va === null && vb === null) return a.pos - b.pos;
    if (va === null) return 1;
    if (vb === null) return -1;
    return desc ? vb - va : va - vb;
  });
}

export function RankingPreset({
  filas,
  metrica,
  metricaLabel,
  separadoPorTipo,
  hrefExplorador,
}: {
  filas: FilaRankingPreset[];
  metrica: MetricaPreset;
  metricaLabel: string;
  /** true: cada tipo es un ranking propio (sin opción «Todas»). */
  separadoPorTipo: boolean;
  hrefExplorador: string;
}) {
  const idBase = React.useId();
  const [consulta, setConsulta] = React.useState("");
  const [tipo, setTipo] = React.useState<FiltroTipo>(separadoPorTipo ? "u" : "todas");
  const [orden, setOrden] = React.useState<Orden>("pos");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const q = expandirConsulta(consulta);

  const conteoPorTipo = React.useMemo(() => {
    const c: Record<TipoIesKey, number> = { u: 0, ip: 0, cft: 0 };
    for (const f of filas) c[f.tipo]++;
    return c;
  }, [filas]);

  const opcionesTipo: { key: FiltroTipo; label: string; n: number }[] = [
    ...(separadoPorTipo ? [] : [{ key: "todas" as const, label: "Todas", n: filas.length }]),
    ...(["u", "ip", "cft"] as const)
      .filter((k) => conteoPorTipo[k] > 0)
      .map((k) => ({
        key: k,
        label: ETIQUETA_FILTRO[k],
        n: conteoPorTipo[k],
      })),
  ];

  const delTipo = React.useMemo(
    () => (tipo === "todas" ? filas : filas.filter((f) => f.tipo === tipo)),
    [filas, tipo]
  );

  const visibles = React.useMemo(
    () => ordenar(delTipo.filter((f) => coincide(f, q)), orden),
    [delTipo, q, orden]
  );

  // Si la búsqueda no encuentra nada en el tipo activo, cuenta cuántas hay en los otros.
  const enOtrosTipos = React.useMemo(() => {
    if (!q || visibles.length > 0 || tipo === "todas") return [];
    return (["u", "ip", "cft"] as const)
      .filter((k) => k !== tipo)
      .map((k) => ({
        key: k,
        label: ETIQUETA_FILTRO[k],
        n: filas.filter((f) => f.tipo === k && coincide(f, q)).length,
      }))
      .filter((o) => o.n > 0);
  }, [q, visibles.length, tipo, filas]);

  const escala = React.useMemo(() => {
    if (metrica === "emp1") return 1;
    const valores = delTipo.map((f) => f.valor ?? 0);
    return Math.max(...valores, 0) || 1;
  }, [delTipo, metrica]);

  const columnas = COLUMNAS.filter((c) => c.key !== metrica);
  const ordenes = ORDENES.filter((o) => o.key !== metrica);
  const mostrarTipo = !separadoPorTipo;

  // Carrera | métrica con barra | secundarias.
  const plantillaDesktop = `2.5rem minmax(13rem,1fr) minmax(10rem,15rem) repeat(${columnas.length}, minmax(6rem,7.25rem))`;

  const limpiar = () => {
    setConsulta("");
    inputRef.current?.focus();
  };

  const etiquetaTipo = opcionesTipo.find((o) => o.key === tipo)?.label ?? "";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="space-y-4 border-b border-border p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <label
              htmlFor={`${idBase}-q`}
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Busca una carrera en este ranking
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                id={`${idBase}-q`}
                type="search"
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape" && consulta) {
                    e.preventDefault();
                    setConsulta("");
                  }
                }}
                placeholder="Nombre, área o apodo (ej. enfermería, tens, informática)"
                autoComplete="off"
                className="h-11 w-full rounded-xl border border-input bg-background pr-11 pl-10 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-ring sm:text-sm [&::-webkit-search-cancel-button]:hidden"
              />
              {consulta ? (
                <button
                  type="button"
                  onClick={limpiar}
                  aria-label="Borrar búsqueda"
                  className="absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground active:bg-secondary"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="lg:w-60">
            <label
              htmlFor={`${idBase}-orden`}
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Ordenar por
            </label>
            <div className="relative">
              <select
                id={`${idBase}-orden`}
                value={orden}
                onChange={(e) => setOrden(e.target.value as Orden)}
                className="h-11 w-full appearance-none rounded-xl border border-input bg-background pr-10 pl-3.5 text-base text-foreground hover:border-foreground/30 focus-visible:border-ring sm:text-sm"
              >
                {ordenes.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.key === "pos" ? `Posición (${metricaLabel.toLowerCase()})` : o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {opcionesTipo.length > 1 ? (
            <div
              role="group"
              aria-label="Tipo de institución"
              className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {opcionesTipo.map((o) => {
                const activo = tipo === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => setTipo(o.key)}
                    className={cn(
                      "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 text-sm font-medium whitespace-nowrap transition-colors sm:h-9",
                      activo
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-foreground hover:border-foreground/40 active:bg-muted"
                    )}
                  >
                    {o.label}
                    <span
                      className={cn(
                        "tabular-nums",
                        activo ? "text-background/75" : "text-muted-foreground"
                      )}
                    >
                      {o.n}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <span />
          )}

          <Link
            href={hrefExplorador}
            className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-xl px-1 text-sm font-medium text-blue-700 underline-offset-4 hover:underline sm:h-9 sm:self-auto"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Más filtros en el explorador de 165 carreras
          </Link>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {visibles.length === delTipo.length
          ? `Mostrando las ${delTipo.length} carreras`
          : `${visibles.length} de ${delTipo.length} carreras coinciden`}
      </p>

      {visibles.length === 0 ? (
        <div className="space-y-4 px-5 py-10 text-center sm:px-8">
          <p className="mx-auto max-w-md text-base text-foreground">
            Ninguna carrera de {tipo === "todas" ? "este ranking" : `la lista de ${etiquetaTipo}`}{" "}
            coincide con <strong className="font-semibold">«{consulta.trim()}»</strong>.
          </p>
          {enOtrosTipos.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2">
              {enOtrosTipos.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setTipo(o.key)}
                  className="inline-flex h-11 items-center rounded-xl border border-foreground bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/85"
                >
                  Ver {o.n} en {o.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Puede que no entre en este top 25. Búscala entre todas las carreras para ver su
              sueldo, empleabilidad y arancel.
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={limpiar}
              className="inline-flex h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground hover:border-foreground/40 active:bg-muted"
            >
              Borrar búsqueda
            </button>
            <BuscadorCarreras
              variante="boton"
              atajos={false}
              consultaInicial={consulta.trim()}
              botonClassName="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-blue-700 hover:border-foreground/40 active:bg-muted"
            >
              <Search className="size-4" aria-hidden="true" />
              Buscar en todas las carreras
            </BuscadorCarreras>
          </div>
        </div>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="hidden items-end gap-x-3 border-b border-border bg-muted/50 px-5 py-2.5 text-xs font-medium text-muted-foreground lg:grid xl:gap-x-4"
            style={{ gridTemplateColumns: plantillaDesktop }}
          >
            <span className="text-center">#</span>
            <span>Carrera</span>
            <span>{metricaLabel}</span>
            {columnas.map((c) => (
              <span key={c.key} className="text-right">
                {c.label}
              </span>
            ))}
          </div>

          <ol className="divide-y divide-border">
            {visibles.map((f) => {
              const ancho = f.valor !== null ? Math.max(0, Math.min(1, f.valor / escala)) : 0;
              const podio = f.pos <= 3;
              return (
                <li
                  key={`${f.slug}-${f.tipo}`}
                  className="group relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 px-4 py-4 transition-colors hover:bg-muted/40 sm:px-5 lg:items-center lg:gap-x-3 xl:gap-x-4 lg:py-3.5 lg:[grid-template-columns:var(--cols)]"
                  style={{ ["--cols" as string]: plantillaDesktop }}
                >
                  <span
                    className={cn(
                      "pt-0.5 text-center font-display text-lg leading-none font-extrabold tabular-nums lg:pt-0",
                      podio ? "text-blue-700" : "text-muted-foreground"
                    )}
                  >
                    <span className="sr-only">Puesto </span>
                    {f.pos}
                  </span>

                  <div className="min-w-0 lg:contents">
                    <div className="min-w-0">
                      <Link
                        href={`/datos/carreras/${f.slug}?tipo=${f.tipo}`}
                        className="font-semibold text-foreground decoration-blue-700 underline-offset-4 after:absolute after:inset-0 after:rounded-[inherit] group-hover:underline focus-visible:outline-none! focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset"
                      >
                        {f.nombre}
                      </Link>
                      <div className="mt-0.5 text-sm text-muted-foreground">
                        {f.area}
                        {mostrarTipo ? ` · ${TIPO_ETIQUETAS[f.tipo].corto}` : null}
                      </div>
                    </div>

                    <div className="mt-3 lg:mt-0">
                      <div
                        aria-hidden="true"
                        className="mb-1 flex items-baseline justify-between gap-2 lg:hidden"
                      >
                        <span className="text-xs text-muted-foreground">{metricaLabel}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-blue-50"
                          aria-hidden="true"
                        >
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${(ancho * 100).toFixed(1)}%` }}
                          />
                        </div>
                        <span className="w-[5.75rem] shrink-0 text-right font-display text-base font-bold text-foreground tabular-nums">
                          <span className="sr-only">{metricaLabel}: </span>
                          {f.texto}
                        </span>
                      </div>
                    </div>

                    <dl className="mt-3 grid grid-cols-3 gap-2 text-sm lg:contents">
                      {columnas.map((c, i) => (
                        <div
                          key={c.key}
                          className={cn(
                            "min-w-0 lg:text-right",
                            // En móvil caben tres cifras; la cuarta (duración) se ve en la ficha.
                            i >= 3 && "hidden lg:block"
                          )}
                        >
                          <dt className="text-xs text-muted-foreground lg:sr-only">{c.corto}</dt>
                          <dd
                            className={cn(
                              "font-medium tabular-nums",
                              c.key === "dur" || c.key === "arancel"
                                ? "text-foreground/80"
                                : "text-foreground"
                            )}
                          >
                            {c.formato(f)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}
