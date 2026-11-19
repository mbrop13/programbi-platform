"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InstitucionCarrera } from "@/lib/datos/carreras";
import { porcentaje, semestres } from "@/lib/datos/formato";
import { compararTramosDesc, puntoMedioTramo } from "@/lib/datos/tramos";

interface TablaInstitucionesProps {
  instituciones: InstitucionCarrera[];
}

type SortKey =
  | "tramo"
  | "institucion"
  | "acred_anos"
  | "emp1"
  | "emp2"
  | "continuidad"
  | "retencion_1"
  | "dur_real";

const ESCALA_MIN = 600_000;
const ESCALA_MAX = 3_800_000;

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: "asc" | "desc" }) {
  if (sortKey !== col) return <ArrowUpDown className="ml-1 inline size-3 opacity-45" />;
  return sortDir === "desc" ? (
    <ArrowDown className="ml-1 inline size-3 text-[#1890ff]" />
  ) : (
    <ArrowUp className="ml-1 inline size-3 text-[#1890ff]" />
  );
}

function BarraTramo({ tramo }: { tramo: InstitucionCarrera["tramo"] }) {
  if (!tramo) {
    return (
      <span className="text-xs text-[#5c5c58]">Sin información suficiente</span>
    );
  }
  const minClamped = Math.max(ESCALA_MIN, Math.min(ESCALA_MAX, tramo.min));
  const maxClamped =
    tramo.max === null
      ? ESCALA_MAX
      : Math.max(ESCALA_MIN, Math.min(ESCALA_MAX, tramo.max));

  const leftPct = ((minClamped - ESCALA_MIN) / (ESCALA_MAX - ESCALA_MIN)) * 100;
  const widthPct = Math.max(
    6,
    ((maxClamped - minClamped) / (ESCALA_MAX - ESCALA_MIN)) * 100
  );

  return (
    <div className="min-w-[180px]">
      <div className="text-xs font-semibold text-[#171716]">{tramo.texto}</div>
      <div className="relative mt-1.5 h-2 w-full rounded-full bg-[#e2e2dc]">
        <div
          className="absolute top-0 bottom-0 rounded-full bg-[#1890ff]"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
      </div>
      <div className="mt-0.5 flex justify-between text-[10px] text-[#5c5c58]">
        <span>$600k</span>
        <span>$3,5M+</span>
      </div>
    </div>
  );
}

export function TablaInstituciones({ instituciones }: TablaInstitucionesProps) {
  const [busqueda, setBusqueda] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("tramo");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir(key === "institucion" ? "asc" : "desc");
    }
  };

  const filas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const filtradas = q
      ? instituciones.filter(
          (i) =>
            i.institucion.toLowerCase().includes(q) ||
            i.titulo.toLowerCase().includes(q)
        )
      : instituciones;

    return [...filtradas].sort((a, b) => {
      const mul = sortDir === "desc" ? 1 : -1;
      if (sortKey === "tramo") {
        if (sortDir === "desc") return compararTramosDesc(a.tramo, b.tramo);
        // Ascendente manteniendo s/i al final
        if (!a.tramo && !b.tramo) return 0;
        if (!a.tramo) return 1;
        if (!b.tramo) return -1;
        return compararTramosDesc(b.tramo, a.tramo);
      }
      if (sortKey === "institucion") {
        return a.institucion.localeCompare(b.institucion, "es") * (sortDir === "asc" ? 1 : -1);
      }
      const numVal = (item: InstitucionCarrera): number | null => {
        if (sortKey === "acred_anos") return item.acred_anos;
        if (sortKey === "emp1") return item.emp1;
        if (sortKey === "emp2") return item.emp2;
        if (sortKey === "continuidad") return item.continuidad;
        if (sortKey === "retencion_1") return item.retencion_1;
        if (sortKey === "dur_real") return item.dur_real;
        return puntoMedioTramo(item.tramo);
      };
      const va = numVal(a);
      const vb = numVal(b);
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;
      return (vb - va) * mul;
    });
  }, [instituciones, busqueda, sortKey, sortDir]);

  if (instituciones.length === 0) {
    return (
      <div className="rounded-xl border border-[#e2e2dc] bg-white p-6">
        <h3 className="text-base font-bold text-[#171716]">
          Resultados por institución
        </h3>
        <p className="mt-2 text-sm text-[#5c5c58]">
          No hay registros institucionales publicados para este tipo de institución en la edición vigente.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#171716]">
            Resultados por institución ({filas.length})
          </h3>
          <p className="text-xs text-[#5c5c58]">
            Orden referencial por punto medio del tramo; los ingresos institucionales se publican en tramos, no en cifras exactas.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-[#5c5c58]" />
          <Input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Filtrar institución o título..."
            aria-label="Filtrar institución o título"
            className="h-9 border-[#d4d4ce] bg-[#f7f7f4] pl-8 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#e2e2dc]">
        <Table className="tabular-nums">
          <TableHeader className="bg-[#f3f3f0]">
            <TableRow className="border-[#e2e2dc] hover:bg-[#f3f3f0]">
              <TableHead className="min-w-[210px]">
                <button
                  type="button"
                  onClick={() => toggleSort("institucion")}
                  className="font-semibold text-[#171716] hover:text-[#1890ff]"
                >
                  Institución / Título
                  <SortIcon col="institucion" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => toggleSort("acred_anos")}
                  className="font-semibold text-[#171716] hover:text-[#1890ff]"
                >
                  Acred.
                  <SortIcon col="acred_anos" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="min-w-[210px]">
                <button
                  type="button"
                  onClick={() => toggleSort("tramo")}
                  className="font-semibold text-[#171716] hover:text-[#1890ff]"
                >
                  Tramo ingreso 4.º año
                  <SortIcon col="tramo" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  onClick={() => toggleSort("emp1")}
                  className="font-semibold text-[#171716] hover:text-[#1890ff]"
                >
                  Emp. 1.º
                  <SortIcon col="emp1" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  onClick={() => toggleSort("emp2")}
                  className="font-semibold text-[#171716] hover:text-[#1890ff]"
                >
                  Emp. 2.º
                  <SortIcon col="emp2" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  onClick={() => toggleSort("retencion_1")}
                  className="font-semibold text-[#171716] hover:text-[#1890ff]"
                >
                  Ret. 1.º
                  <SortIcon col="retencion_1" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  onClick={() => toggleSort("continuidad")}
                  className="font-semibold text-[#171716] hover:text-[#1890ff]"
                >
                  Cont.
                  <SortIcon col="continuidad" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  onClick={() => toggleSort("dur_real")}
                  className="font-semibold text-[#171716] hover:text-[#1890ff]"
                >
                  Dur. real
                  <SortIcon col="dur_real" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filas.map((item) => (
              <TableRow
                key={`${item.codigo_ies}-${item.titulo}`}
                className="border-[#e2e2dc] hover:bg-[#f7f7f4]/70"
              >
                <TableCell className="align-top">
                  <div className="font-semibold text-[#171716] leading-snug">
                    {item.institucion}
                  </div>
                  <div className="mt-0.5 text-xs text-[#5c5c58]">{item.titulo}</div>
                </TableCell>
                <TableCell className="align-top">
                  {item.acred_anos > 0 ? (
                    <Badge
                      variant="secondary"
                      className="border border-[#d6e6f5] bg-[#e9f4ff] text-[#1063b8]"
                    >
                      {item.acreditacion}
                    </Badge>
                  ) : (
                    <span className="text-xs text-[#5c5c58]">
                      {item.acreditacion || "s/i"}
                    </span>
                  )}
                </TableCell>
                <TableCell className="align-top">
                  <BarraTramo tramo={item.tramo} />
                </TableCell>
                <TableCell className="text-right align-top font-medium text-[#171716]">
                  {porcentaje(item.emp1)}
                </TableCell>
                <TableCell className="text-right align-top text-[#5c5c58]">
                  {porcentaje(item.emp2)}
                </TableCell>
                <TableCell className="text-right align-top text-[#5c5c58]">
                  {porcentaje(item.retencion_1)}
                </TableCell>
                <TableCell className="text-right align-top text-[#5c5c58]">
                  {porcentaje(item.continuidad)}
                </TableCell>
                <TableCell className="text-right align-top text-[#5c5c58]">
                  {semestres(item.dur_real)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
