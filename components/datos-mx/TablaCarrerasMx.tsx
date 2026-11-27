"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { enteroMx, pesosMx, porcentajeMx } from "@/lib/datos-mx/formato";
import type { CarreraMxRecord } from "@/lib/datos-mx/types";

type SortKey =
  | "posicionIngreso"
  | "carrera"
  | "ingreso"
  | "tasaDesocupacion"
  | "tasaInformalidad"
  | "matricula";

type SortDir = "asc" | "desc";

interface TablaCarrerasMxProps {
  carreras: readonly CarreraMxRecord[];
  defaultSortKey?: SortKey;
  defaultSortDir?: SortDir;
  caption?: string;
}

function normalizarBusqueda(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function SortIcon({
  col,
  activeKey,
  dir,
}: {
  col: SortKey;
  activeKey: SortKey;
  dir: SortDir;
}) {
  if (col !== activeKey) {
    return <ArrowUpDown className="size-3.5 text-muted-foreground/60" />;
  }
  return dir === "asc" ? (
    <ArrowUp className="size-3.5 text-foreground" />
  ) : (
    <ArrowDown className="size-3.5 text-foreground" />
  );
}

export default function TablaCarrerasMx({
  carreras,
  defaultSortKey = "posicionIngreso",
  defaultSortDir = "asc",
  caption,
}: TablaCarrerasMxProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(defaultSortKey);
  const [sortDir, setSortDir] = useState<SortDir>(defaultSortDir);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(
        key === "ingreso" || key === "matricula" ? "desc" : "asc"
      );
    }
  };

  const filtradasYOrdenadas = useMemo(() => {
    const q = normalizarBusqueda(query.trim());
    const filtradas = q
      ? carreras.filter((c) => normalizarBusqueda(c.carrera).includes(q))
      : [...carreras];

    filtradas.sort((a, b) => {
      if (sortKey === "carrera") {
        const cmp = a.carrera.localeCompare(b.carrera, "es-MX");
        return sortDir === "asc" ? cmp : -cmp;
      }

      const va = a[sortKey];
      const vb = b[sortKey];

      if (va === null && vb === null) {
        return a.carrera.localeCompare(b.carrera, "es-MX");
      }
      if (va === null) return 1;
      if (vb === null) return -1;

      const diff = va - vb;
      return sortDir === "asc" ? diff : -diff;
    });

    return filtradas;
  }, [carreras, query, sortKey, sortDir]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar carrera (ej. medicina, ingeniería, derecho)..."
            aria-label="Buscar carrera"
            className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
          />
        </div>
        <p className="text-xs text-muted-foreground tabular-nums">
          Mostrando {filtradasYOrdenadas.length} de {carreras.length} carreras
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          {caption ? (
            <caption className="border-b border-border bg-background/60 px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
              {caption}
            </caption>
          ) : null}
          <thead>
            <tr className="border-b border-border bg-background/70 text-xs font-semibold text-foreground">
              <th scope="col" className="px-3 py-3 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort("posicionIngreso")}
                  className="inline-flex items-center gap-1 hover:text-foreground/80"
                >
                  #
                  <SortIcon col="posicionIngreso" activeKey={sortKey} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className="px-3 py-3">
                <button
                  type="button"
                  onClick={() => handleSort("carrera")}
                  className="inline-flex items-center gap-1 hover:text-foreground/80"
                >
                  Carrera
                  <SortIcon col="carrera" activeKey={sortKey} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort("ingreso")}
                  className="inline-flex items-center justify-end gap-1 hover:text-foreground/80"
                >
                  Ingreso promedio
                  <SortIcon col="ingreso" activeKey={sortKey} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-right whitespace-nowrap">
                P25–P75
              </th>
              <th scope="col" className="px-3 py-3 text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort("tasaDesocupacion")}
                  className="inline-flex items-center justify-end gap-1 hover:text-foreground/80"
                >
                  Desocupación
                  <SortIcon col="tasaDesocupacion" activeKey={sortKey} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort("tasaInformalidad")}
                  className="inline-flex items-center justify-end gap-1 hover:text-foreground/80"
                >
                  Informalidad
                  <SortIcon col="tasaInformalidad" activeKey={sortKey} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => handleSort("matricula")}
                  className="inline-flex items-center justify-end gap-1 hover:text-foreground/80"
                >
                  Matrícula
                  <SortIcon col="matricula" activeKey={sortKey} dir={sortDir} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtradasYOrdenadas.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No se encontraron carreras que coincidan con &ldquo;{query}&rdquo;.
                </td>
              </tr>
            ) : (
              filtradasYOrdenadas.map((c) => {
                const tieneIngreso = c.publicable && c.ingreso !== null;
                return (
                  <tr
                    key={c.slug}
                    className="transition-colors hover:bg-surface-hover/60"
                  >
                    <td className="px-3 py-3 text-xs font-medium text-muted-foreground tabular-nums">
                      {c.posicionIngreso ?? "—"}
                    </td>
                    <td className="px-3 py-3 font-medium text-foreground">
                      {tieneIngreso ? (
                        <Link
                          href={`/mx/datos/carreras/${c.slug}`}
                          className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                        >
                          {c.carrera}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">{c.carrera}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold whitespace-nowrap tabular-nums">
                      {tieneIngreso ? (
                        <span className="text-foreground">{pesosMx(c.ingreso)}</span>
                      ) : (
                        <span className="text-xs font-normal text-muted-foreground">
                          sin dato de ingreso
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right text-xs whitespace-nowrap text-muted-foreground tabular-nums">
                      {c.ingresoQ25 !== null && c.ingresoQ75 !== null
                        ? `${pesosMx(c.ingresoQ25)} – ${pesosMx(c.ingresoQ75)}`
                        : "s/i"}
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap text-muted-foreground tabular-nums">
                      {c.tasaDesocupacion !== null
                        ? porcentajeMx(c.tasaDesocupacion)
                        : "s/i"}
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap text-muted-foreground tabular-nums">
                      {c.tasaInformalidad !== null
                        ? porcentajeMx(c.tasaInformalidad)
                        : "s/i"}
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap text-muted-foreground tabular-nums">
                      {c.matricula !== null ? enteroMx(c.matricula) : "s/i"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
