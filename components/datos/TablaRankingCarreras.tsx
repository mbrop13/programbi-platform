"use client";

import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from "@tanstack/react-table/legacy";
import type { SortingState } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAreaVisual } from "@/lib/datos/areas-visual";
import type { RankingItem } from "@/lib/datos/carreras-tipos";
import {
  anosDesdeSemestres,
  pesos,
  porcentaje,
  semestres,
  variacionPorcentual,
} from "@/lib/datos/formato";
import { cn } from "@/lib/utils";

function EmpleabilidadBadge({ emp1 }: { emp1: number | null }) {
  if (emp1 === null) {
    return <span className="text-xs text-muted-foreground">Sin dato</span>;
  }
  const pct = emp1 * 100;
  const clase =
    pct >= 85
      ? "border-emerald-200/80 bg-emerald-50 text-emerald-800"
      : pct >= 70
        ? "border-amber-200/80 bg-amber-50 text-amber-800"
        : "border-slate-200/80 bg-slate-100 text-slate-700";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums",
        clase
      )}
    >
      {porcentaje(emp1)}
    </span>
  );
}

function MiniRangoBar({
  p10,
  p50,
  p90,
  maxGlobal,
  factor,
}: {
  p10: number | null;
  p50: number | null;
  p90: number | null;
  maxGlobal: number;
  factor: number;
}) {
  if (p10 === null || p90 === null || maxGlobal <= 0) {
    return <span className="text-xs text-muted-foreground">Sin dato</span>;
  }
  const left = Math.max(0, Math.min(100, (p10 / maxGlobal) * 100));
  const right = Math.max(left, Math.min(100, (p90 / maxGlobal) * 100));
  const mid = p50 !== null ? Math.max(left, Math.min(right, (p50 / maxGlobal) * 100)) : null;

  return (
    <div className="w-28 space-y-1">
      <div className="relative h-1.5 w-full rounded-full bg-slate-200/80">
        <div
          className="absolute top-0 h-1.5 rounded-full bg-blue-500/40"
          style={{ left: `${left}%`, width: `${Math.max(4, right - left)}%` }}
        />
        {mid !== null ? (
          <div
            className="absolute -top-0.5 h-2.5 w-1 rounded-full bg-blue-600"
            style={{ left: `${mid}%` }}
          />
        ) : null}
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums">
        <span>{pesos(p10 * factor)}</span>
        <span>{pesos(p90 * factor)}</span>
      </div>
    </div>
  );
}

function HeaderTooltip({ label, ayuda }: { label: string; ayuda: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        aria-label={`Qué significa ${label}`}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex text-muted-foreground/70 transition-colors hover:text-foreground"
      >
        <Info className="size-3.5" aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[230px] text-left font-normal leading-snug normal-case">
        {ayuda}
      </TooltipContent>
    </Tooltip>
  );
}

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <ArrowUp className="size-3.5 text-blue-600" aria-hidden="true" />;
  if (sorted === "desc") return <ArrowDown className="size-3.5 text-blue-600" aria-hidden="true" />;
  return <ArrowUpDown className="size-3.5 text-muted-foreground/60" aria-hidden="true" />;
}

/** Meses de sueldo bruto al 4.º año necesarios para cubrir el arancel total real estimado. */
function calcularRetornoMeses(row: RankingItem, factor: number): number | null {
  if (!row.arancel_med || !row.dur_real || !row.ing4 || row.ing4 <= 0) return null;
  const costoTotal = row.arancel_med * (row.dur_real / 2);
  const sueldoMensual = row.ing4 * factor;
  if (sueldoMensual <= 0) return null;
  return costoTotal / sueldoMensual;
}

const COLUMN_LABELS: Record<string, string> = {
  rango: "Rango salarial",
  arancel_med: "Arancel anual",
  dur_real: "Duración real",
  retorno: "Retorno estimado",
};

export function TablaRankingCarreras({
  rows,
  factor = 1,
  compareSlugs = [],
  onToggleCompare,
  onSelectSlug,
  maxP90: suppliedMaxP90,
  vista = "tabla",
  interactiveTooltips = false,
  defaultPageSize = 15,
}: {
  rows: readonly RankingItem[];
  factor?: number;
  compareSlugs?: readonly string[];
  onToggleCompare?: (slug: string) => void;
  onSelectSlug?: (slug: string) => void;
  maxP90?: number;
  vista?: "tabla" | "tarjetas";
  interactiveTooltips?: boolean;
  defaultPageSize?: number;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({
    rango: true,
    arancel_med: true,
    dur_real: true,
    retorno: true,
  });

  const data = React.useMemo(() => [...rows], [rows]);

  const maxP90 = React.useMemo(
    () => suppliedMaxP90 ?? rows.reduce((max, row) => Math.max(max, row.p90_5 ?? 0), 1_000_000),
    [rows, suppliedMaxP90]
  );

  const columns = React.useMemo<LegacyColumnDef<RankingItem>[]>(
    () => [
      {
        id: "rank",
        header: () => <span className="block text-center">#</span>,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row, table }) => {
          const sortedRows = table.getSortedRowModel().rows;
          const rankIndex = sortedRows.findIndex((r) => r.id === row.id);
          const pos = rankIndex >= 0 ? rankIndex + 1 : row.index + 1;
          return (
            <span className="block text-center text-xs font-medium text-muted-foreground tabular-nums">
              {pos}
            </span>
          );
        },
      },
      {
        accessorKey: "nombre",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-left font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Carrera</span>
            <SortIcon sorted={column.getIsSorted()} />
          </button>
        ),
        enableHiding: false,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="min-w-[165px] max-w-[220px]">
              <a
                href={`/datos/carreras/${item.slug}?tipo=${item.tipo}`}
                className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-blue-700 hover:underline"
              >
                {item.nombre}
              </a>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="truncate">{item.area}</span>
                {item.yoy_real_4 !== null ? (
                  <span
                    className={cn(
                      "font-medium tabular-nums",
                      item.yoy_real_4 >= 0 ? "text-emerald-700" : "text-rose-700"
                    )}
                  >
                    {variacionPorcentual(item.yoy_real_4)} real
                  </span>
                ) : null}
              </div>
            </div>
          );
        },
      },
      {
        id: "ing4",
        accessorFn: (row) => (row.ing4 !== null ? Math.round(row.ing4 * factor) : null),
        sortUndefined: "last",
        header: ({ column }) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>Sueldo 4.º año</span>
              <SortIcon sorted={column.getIsSorted()} />
            </button>
            {interactiveTooltips ? (
              <HeaderTooltip
                label="Sueldo 4.º año"
                ayuda="Ingreso bruto mensual promedio al cuarto año desde la titulación (cruce SIES-SII)."
              />
            ) : null}
          </div>
        ),
        enableHiding: false,
        cell: ({ getValue }) => {
          const val = getValue<number | null>();
          return (
            <div className="text-right text-sm font-semibold text-foreground tabular-nums">
              {val !== null ? (
                pesos(val)
              ) : (
                <span className="font-normal text-xs text-muted-foreground">Sin dato</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "emp1",
        sortUndefined: "last",
        header: ({ column }) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>Empleabilidad</span>
              <SortIcon sorted={column.getIsSorted()} />
            </button>
            {interactiveTooltips ? (
              <HeaderTooltip
                label="Empleabilidad"
                ayuda="Porcentaje de titulados con empleo formal al primer año de egresar."
              />
            ) : null}
          </div>
        ),
        enableHiding: false,
        cell: ({ getValue }) => (
          <div className="text-right">
            <EmpleabilidadBadge emp1={getValue<number | null>()} />
          </div>
        ),
      },
      {
        id: "rango",
        enableSorting: false,
        header: () => (
          <div className="flex items-center gap-1">
            <span>Rango salarial</span>
            {interactiveTooltips ? (
              <HeaderTooltip
                label="Rango salarial"
                ayuda="Brecha entre el 10% que menos gana y el 10% que más gana al 5.º año. La marca azul indica la mediana."
              />
            ) : null}
          </div>
        ),
        cell: ({ row }) => (
          <MiniRangoBar
            p10={row.original.p10_5}
            p50={row.original.p50_5}
            p90={row.original.p90_5}
            maxGlobal={maxP90}
            factor={factor}
          />
        ),
      },
      {
        accessorKey: "arancel_med",
        sortUndefined: "last",
        header: ({ column }) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>Arancel anual</span>
              <SortIcon sorted={column.getIsSorted()} />
            </button>
          </div>
        ),
        cell: ({ getValue }) => {
          const val = getValue<number | null>();
          return (
            <div className="text-right text-xs text-foreground tabular-nums">
              {val !== null ? (
                pesos(val)
              ) : (
                <span className="text-muted-foreground">Sin dato</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "dur_real",
        sortUndefined: "last",
        header: ({ column }) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>Duración real</span>
              <SortIcon sorted={column.getIsSorted()} />
            </button>
            {interactiveTooltips ? (
              <HeaderTooltip
                label="Duración real"
                ayuda="Años reales que demoran en promedio los estudiantes en titularse."
              />
            ) : null}
          </div>
        ),
        cell: ({ getValue }) => {
          const val = getValue<number | null>();
          return (
            <div className="text-right text-xs tabular-nums">
              {val !== null ? (
                <div>
                  <span className="font-medium text-foreground">{anosDesdeSemestres(val)}</span>
                  <span className="hidden text-[11px] text-muted-foreground lg:block">
                    {semestres(val)}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">Sin dato</span>
              )}
            </div>
          );
        },
      },
      {
        id: "retorno",
        accessorFn: (row) => calcularRetornoMeses(row, factor),
        sortUndefined: "last",
        header: ({ column }) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>Retorno</span>
              <SortIcon sorted={column.getIsSorted()} />
            </button>
            {interactiveTooltips ? (
              <HeaderTooltip
                label="Retorno"
                ayuda="Meses de sueldo bruto al 4.º año equivalentes al costo total estimado de aranceles (duración real)."
              />
            ) : null}
          </div>
        ),
        cell: ({ getValue }) => {
          const meses = getValue<number | null>();
          if (meses === null) {
            return <div className="text-right text-xs text-muted-foreground">Sin dato</div>;
          }
          const redondeado = Math.max(1, Math.round(meses));
          return (
            <div className="text-right text-xs font-medium text-foreground tabular-nums">
              {redondeado} {redondeado === 1 ? "mes" : "meses"}
            </div>
          );
        },
      },
      {
        id: "comparar",
        enableSorting: false,
        enableHiding: false,
        header: () => <span className="block text-right">Comparar</span>,
        cell: ({ row }) => {
          const item = row.original;
          const inCompare = compareSlugs.includes(item.slug);
          return (
            <div className="text-right">
              <button
                type="button"
                onClick={onToggleCompare ? () => onToggleCompare(item.slug) : undefined}
                disabled={!onToggleCompare}
                aria-pressed={inCompare}
                aria-label={`${inCompare ? "Quitar de comparación" : "Comparar"}: ${item.nombre}`}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors",
                  inCompare
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted disabled:opacity-50"
                )}
              >
                {inCompare ? (
                  <>
                    <Check className="size-3" aria-hidden="true" />
                    En lista
                  </>
                ) : (
                  <>
                    <Plus className="size-3" aria-hidden="true" />
                    Comparar
                  </>
                )}
              </button>
            </div>
          );
        },
      },
    ],
    [compareSlugs, factor, interactiveTooltips, maxP90, onToggleCompare]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useLegacyTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: defaultPageSize,
      },
    },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalFiltered = table.getSortedRowModel().rows.length;
  const pageRows = table.getRowModel().rows;
  const startItem = totalFiltered === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = Math.min(totalFiltered, (pageIndex + 1) * pageSize);
  const pageCount = Math.max(1, table.getPageCount());

  const paginationBar = totalFiltered > 0 && (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-xs shadow-xs">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-muted-foreground tabular-nums">
          Mostrando <strong className="font-semibold text-foreground">{startItem}–{endItem}</strong> de{" "}
          <strong className="font-semibold text-foreground">{totalFiltered}</strong> carreras
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Filas:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger aria-label="Carreras por página" className="h-7 w-[70px] bg-card text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[15, 30, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground tabular-nums">
          Página {pageIndex + 1} de {pageCount}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-7 gap-1 bg-card px-2.5 text-xs"
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            Anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-7 gap-1 bg-card px-2.5 text-xs"
          >
            Siguiente
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (vista === "tarjetas") {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pageRows.map((tableRow, idx) => {
            const row = tableRow.original;
            const inCompare = compareSlugs.includes(row.slug);
            const ing4Adj = row.ing4 !== null ? Math.round(row.ing4 * factor) : null;
            const areaVisual = getAreaVisual(row.area);
            const globalRank = pageIndex * pageSize + idx + 1;

            return (
              <Card
                key={`${row.slug}-${row.tipo}`}
                onMouseEnter={onSelectSlug ? () => onSelectSlug(row.slug) : undefined}
                className="group gap-0 overflow-hidden rounded-xl border border-border bg-card py-0 shadow-xs ring-0 transition-all hover:border-slate-300 hover:shadow-sm"
              >
                {/* Thumbnail fotográfico del área */}
                <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                  <img
                    src={areaVisual.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />
                  <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between gap-2">
                    <Badge
                      variant="secondary"
                      className="h-auto rounded-md border border-white/20 bg-slate-900/75 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs tabular-nums"
                    >
                      #{globalRank}
                    </Badge>
                    <EmpleabilidadBadge emp1={row.emp1} />
                  </div>
                  <span
                    className="absolute bottom-2 left-3 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium shadow-xs"
                    style={{
                      backgroundColor: areaVisual.softBg,
                      color: areaVisual.accent,
                      borderColor: areaVisual.border,
                      borderWidth: 1,
                    }}
                  >
                    {row.area}
                  </span>
                </div>

                <CardContent className="flex flex-1 flex-col justify-between gap-4 p-4">
                  <div>
                    <h3 className="text-base font-semibold leading-snug text-foreground">
                      <a
                        href={`/datos/carreras/${row.slug}?tipo=${row.tipo}`}
                        className="inline-flex items-start gap-1 transition-colors hover:text-blue-700"
                      >
                        <span>{row.nombre}</span>
                        <ArrowUpRight
                          className="mt-0.5 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </a>
                    </h3>

                    <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-border/70 pt-3">
                      <div>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Sueldo 4.º año
                        </p>
                        <p className="mt-0.5 text-xl font-bold tracking-tight text-foreground tabular-nums">
                          {ing4Adj !== null ? pesos(ing4Adj) : "Sin dato"}
                        </p>
                      </div>
                      {row.yoy_real_4 !== null ? (
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-xs font-medium tabular-nums",
                            row.yoy_real_4 >= 0
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          )}
                        >
                          {variacionPorcentual(row.yoy_real_4)} real
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs">
                      <div className="rounded-lg bg-muted/50 px-3 py-2">
                        <span className="block text-[11px] text-muted-foreground">Arancel anual</span>
                        <span className="mt-0.5 block font-semibold text-foreground tabular-nums">
                          {row.arancel_med !== null ? pesos(row.arancel_med) : "Sin dato"}
                        </span>
                      </div>
                      <div className="rounded-lg bg-muted/50 px-3 py-2">
                        <span className="block text-[11px] text-muted-foreground">Duración real</span>
                        <span className="mt-0.5 block font-semibold text-foreground tabular-nums">
                          {row.dur_real !== null ? anosDesdeSemestres(row.dur_real) : "Sin dato"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">
                    <a
                      href={`/datos/carreras/${row.slug}?tipo=${row.tipo}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline"
                    >
                      Ver ficha completa
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={onToggleCompare ? () => onToggleCompare(row.slug) : undefined}
                      disabled={!onToggleCompare}
                      aria-pressed={inCompare}
                      aria-label={`${inCompare ? "Quitar de comparación" : "Comparar"}: ${row.nombre}`}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                        inCompare
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:bg-muted"
                      )}
                    >
                      {inCompare ? (
                        <>
                          <Check className="size-3" aria-hidden="true" />
                          En lista
                        </>
                      ) : (
                        <>
                          <Plus className="size-3" aria-hidden="true" />
                          Comparar
                        </>
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {paginationBar}
      </div>
    );
  }

  const contenidoTabla = (
    <div className="min-w-0 max-w-full space-y-3">
      {/* Barra superior de columnas */}
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 bg-card text-xs font-medium"
            >
              <SlidersHorizontal className="size-3.5 text-muted-foreground" aria-hidden="true" />
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs">Columnas visibles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(checked) => col.toggleVisibility(Boolean(checked))}
                  className="text-xs"
                >
                  {COLUMN_LABELS[col.id] ?? col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabla shadcn + TanStack Table */}
      <div className="w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <Table aria-label="Ranking de carreras">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-11 px-2.5 whitespace-nowrap normal-case">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {pageRows.map((row) => (
              <TableRow
                key={`${row.original.slug}-${row.original.tipo}`}
                onMouseEnter={onSelectSlug ? () => onSelectSlug(row.original.slug) : undefined}
                className="hover:bg-muted/35"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-2.5 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {paginationBar}
    </div>
  );

  if (!interactiveTooltips) return contenidoTabla;

  return <TooltipProvider delayDuration={150}>{contenidoTabla}</TooltipProvider>;
}
