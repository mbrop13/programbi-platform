"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { entero, porcentaje, soles } from "@/lib/datos-pe/formato";
import type { CarreraPe, NivelCarreraPe } from "@/lib/datos-pe/types";
import { cn } from "@/lib/utils";

type ColumnaOrden = "mediana" | "mtpe" | "ocupados" | "pension" | "sunedu";
type FiltroNivel = "todas" | NivelCarreraPe;

export interface TablaCarrerasPeProps {
  carreras: readonly CarreraPe[];
  mostrarFiltro?: boolean;
  mostrarColumnaTipo?: boolean;
  mostrarRankMtpe?: boolean;
  caption?: string;
  className?: string;
}

function valorOrden(c: CarreraPe, col: ColumnaOrden): number {
  switch (col) {
    case "mediana":
      return c.enaho.mediana;
    case "mtpe":
      return c.mtpe.nacional ?? -1;
    case "ocupados":
      return c.enaho.pctOcupados;
    case "pension":
      return c.enaho.pctPension;
    case "sunedu":
      return c.sunedu?.totalUniversidades ?? -1;
  }
}

export function TablaCarrerasPe({
  carreras,
  mostrarFiltro = false,
  mostrarColumnaTipo = true,
  mostrarRankMtpe = false,
  caption = "Sueldos y situación laboral por carrera en Perú",
  className,
}: TablaCarrerasPeProps) {
  const [filtro, setFiltro] = useState<FiltroNivel>("todas");
  const [ordenCol, setOrdenCol] = useState<ColumnaOrden>("mediana");
  const [ordenDir, setOrdenDir] = useState<"desc" | "asc">("desc");

  const conteos = useMemo(() => {
    let univ = 0;
    let tec = 0;
    for (const c of carreras) {
      if (c.tipo === "universitaria") univ += 1;
      else tec += 1;
    }
    return { total: carreras.length, univ, tec };
  }, [carreras]);

  const filas = useMemo(() => {
    const filtradas =
      filtro === "todas" ? [...carreras] : carreras.filter((c) => c.tipo === filtro);
    filtradas.sort((a, b) => {
      const va = valorOrden(a, ordenCol);
      const vb = valorOrden(b, ordenCol);
      if (va !== vb) {
        return ordenDir === "desc" ? vb - va : va - vb;
      }
      return b.enaho.mediana - a.enaho.mediana;
    });
    return filtradas;
  }, [carreras, filtro, ordenCol, ordenDir]);

  const toggleOrden = (col: ColumnaOrden) => {
    if (ordenCol === col) {
      setOrdenDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setOrdenCol(col);
      setOrdenDir("desc");
    }
  };

  const renderIconoOrden = (col: ColumnaOrden) => {
    if (ordenCol !== col) {
      return <ArrowUpDown className="size-3.5 text-muted-foreground/70" aria-hidden="true" />;
    }
    return ordenDir === "desc" ? (
      <ArrowDown className="size-3.5 text-foreground" aria-hidden="true" />
    ) : (
      <ArrowUp className="size-3.5 text-foreground" aria-hidden="true" />
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      {mostrarFiltro ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por nivel de carrera">
            <Button
              type="button"
              size="sm"
              variant={filtro === "todas" ? "default" : "outline"}
              onClick={() => setFiltro("todas")}
            >
              Todas ({conteos.total})
            </Button>
            <Button
              type="button"
              size="sm"
              variant={filtro === "universitaria" ? "default" : "outline"}
              onClick={() => setFiltro("universitaria")}
            >
              Universitarias ({conteos.univ})
            </Button>
            <Button
              type="button"
              size="sm"
              variant={filtro === "tecnica" ? "default" : "outline"}
              onClick={() => setFiltro("tecnica")}
            >
              Técnicas ({conteos.tec})
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Mostrando {filas.length} carreras · Haz clic en un encabezado para ordenar
          </p>
        </div>
      ) : null}

      <Card className="gap-0 overflow-hidden rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
        <Table className="tabular-nums">
          <caption className="sr-only">{caption}</caption>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Carrera</TableHead>
              {mostrarColumnaTipo ? <TableHead>Nivel</TableHead> : null}
              <TableHead className="text-right">
                <button
                  type="button"
                  onClick={() => toggleOrden("mediana")}
                  className="inline-flex items-center gap-1 font-medium uppercase hover:text-foreground"
                >
                  Mediana ENAHO
                  {renderIconoOrden("mediana")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  onClick={() => toggleOrden("mtpe")}
                  className="inline-flex items-center gap-1 font-medium uppercase hover:text-foreground"
                >
                  MTPE formal
                  {renderIconoOrden("mtpe")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  onClick={() => toggleOrden("ocupados")}
                  className="inline-flex items-center gap-1 font-medium uppercase hover:text-foreground"
                >
                  % ocupados
                  {renderIconoOrden("ocupados")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  onClick={() => toggleOrden("pension")}
                  className="inline-flex items-center gap-1 font-medium uppercase hover:text-foreground"
                >
                  % pensión
                  {renderIconoOrden("pension")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  onClick={() => toggleOrden("sunedu")}
                  className="inline-flex items-center gap-1 font-medium uppercase hover:text-foreground"
                >
                  Univ. SUNEDU (aprox.)
                  {renderIconoOrden("sunedu")}
                </button>
              </TableHead>
              <TableHead className="text-right">EDO 2026</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filas.map((c, idx) => (
              <TableRow key={c.slug}>
                <TableCell className="text-center text-xs text-muted-foreground">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/pe/datos/carreras/${c.slug}`}
                    className="text-foreground underline-offset-4 hover:text-blue-700 hover:underline"
                  >
                    {c.nombre}
                  </Link>
                </TableCell>
                {mostrarColumnaTipo ? (
                  <TableCell>
                    <Badge variant={c.tipo === "universitaria" ? "secondary" : "outline"}>
                      {c.tipo === "universitaria" ? "Universitaria" : "Técnica"}
                    </Badge>
                  </TableCell>
                ) : null}
                <TableCell className="text-right font-semibold text-foreground">
                  {soles(c.enaho.mediana)}
                </TableCell>
                <TableCell className="text-right">
                  {c.mtpe.nacional !== null ? (
                    <span className="inline-flex items-center justify-end gap-1.5">
                      <span>{soles(c.mtpe.nacional)}</span>
                      {mostrarRankMtpe && c.mtpe.rankNacional !== null ? (
                        <span className="text-xs text-muted-foreground">
                          (#{c.mtpe.rankNacional})
                        </span>
                      ) : null}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">sin dato MTPE</span>
                  )}
                </TableCell>
                <TableCell className="text-right">{porcentaje(c.enaho.pctOcupados)}</TableCell>
                <TableCell className="text-right">{porcentaje(c.enaho.pctPension)}</TableCell>
                <TableCell className="text-right">
                  {c.sunedu && c.sunedu.totalUniversidades > 0 ? (
                    <span title="Conteo aproximado de universidades licenciadas en el padrón SUNEDU (corte ago-2024)">
                      ~{entero(c.sunedu.totalUniversidades)} aprox.
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {c.edo2026 ? (
                    <span className="text-xs font-medium text-emerald-700">
                      {entero(c.edo2026.puestos)} puestos
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">fuera del top 10 EDO</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
