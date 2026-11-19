"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { InstitucionAvatar } from "@/components/datos/InstitucionAvatar";
import type { InstitucionCarrera, ProgramaCarrera } from "@/lib/datos/carreras";
import { anosDesdeSemestres, normalizarTexto, pesos, porcentaje } from "@/lib/datos/formato";
import { compararTramosDesc, puntoMedioTramo } from "@/lib/datos/tramos";
import { cn } from "@/lib/utils";

interface TablaInstitucionesProps {
  instituciones: InstitucionCarrera[];
  programas?: ProgramaCarrera[];
}

type SortKey =
  | "tramo"
  | "institucion"
  | "acred_anos"
  | "arancel"
  | "emp1"
  | "emp2"
  | "continuidad"
  | "retencion_1"
  | "dur_real";

const ESCALA_MIN = 600_000;
const ESCALA_MAX = 3_800_000;

function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
}) {
  if (sortKey !== col) return <ArrowUpDown className="ml-1 inline size-3 opacity-45" />;
  return sortDir === "desc" ? (
    <ArrowDown className="ml-1 inline size-3 text-blue-700" />
  ) : (
    <ArrowUp className="ml-1 inline size-3 text-blue-700" />
  );
}

function AcreditacionBadge({
  anos,
  texto,
}: {
  anos: number;
  texto: string;
}) {
  if (anos <= 0 && !texto) {
    return <span className="text-xs text-muted-foreground">Sin dato</span>;
  }

  const badgeClass =
    anos >= 6
      ? "border-emerald-200/80 bg-emerald-50 text-emerald-800"
      : anos >= 4
        ? "border-blue-200/80 bg-blue-50 text-blue-800"
        : "border-slate-200 bg-slate-100 text-slate-700";

  return (
    <Badge
      variant="secondary"
      className={cn("h-auto rounded-md border px-2 py-0.5 text-[11px] font-medium", badgeClass)}
    >
      {texto || `${anos} años`}
    </Badge>
  );
}

function BarraTramo({ tramo }: { tramo: InstitucionCarrera["tramo"] }) {
  if (!tramo) {
    return <span className="text-xs text-muted-foreground">Sin dato suficiente</span>;
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
    <div className="min-w-[170px]">
      <div className="text-xs font-semibold text-foreground">{tramo.texto}</div>
      <div className="relative mt-1.5 h-1.5 w-full rounded-full bg-slate-200/80">
        <div
          className="absolute top-0 bottom-0 rounded-full bg-blue-600"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
      </div>
      <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground">
        <span>$600k</span>
        <span>$3,5M+</span>
      </div>
    </div>
  );
}

interface OfertaIesMeta {
  arancelMed: number | null;
  regiones: string[];
  jornadas: string[];
}

export function TablaInstituciones({
  instituciones,
  programas = [],
}: TablaInstitucionesProps) {
  const [busqueda, setBusqueda] = useState("");
  const [regionFiltro, setRegionFiltro] = useState<string>("todas");
  const [jornadaFiltro, setJornadaFiltro] = useState<string>("todas");
  const [sortKey, setSortKey] = useState<SortKey>("tramo");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { metaPorIes, regionesDisponibles, jornadasDisponibles, tieneAranceles } = useMemo(() => {
    const mapa = new Map<string, { aranceles: number[]; regiones: Set<string>; jornadas: Set<string> }>();
    const regSet = new Set<string>();
    const jorSet = new Set<string>();

    for (const p of programas) {
      const key = normalizarTexto(p.institucion);
      let entry = mapa.get(key);
      if (!entry) {
        entry = { aranceles: [], regiones: new Set(), jornadas: new Set() };
        mapa.set(key, entry);
      }
      if (typeof p.arancel === "number" && p.arancel > 0) {
        entry.aranceles.push(p.arancel);
      }
      if (p.region) {
        entry.regiones.add(p.region);
        regSet.add(p.region);
      }
      if (p.jornada) {
        entry.jornadas.add(p.jornada);
        jorSet.add(p.jornada);
      }
    }

    const resumen = new Map<string, OfertaIesMeta>();
    let anyArancel = false;
    for (const [key, val] of mapa.entries()) {
      const sorted = [...val.aranceles].sort((a, b) => a - b);
      const med =
        sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)] : null;
      if (med !== null) anyArancel = true;
      resumen.set(key, {
        arancelMed: med,
        regiones: [...val.regiones].sort((a, b) => a.localeCompare(b, "es")),
        jornadas: [...val.jornadas].sort((a, b) => a.localeCompare(b, "es")),
      });
    }

    return {
      metaPorIes: resumen,
      regionesDisponibles: [...regSet].sort((a, b) => a.localeCompare(b, "es")),
      jornadasDisponibles: [...jorSet].sort((a, b) => a.localeCompare(b, "es")),
      tieneAranceles: anyArancel,
    };
  }, [programas]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir(key === "institucion" || key === "arancel" ? "asc" : "desc");
    }
  };

  const filas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const filtradas = instituciones.filter((item) => {
      if (
        q &&
        !item.institucion.toLowerCase().includes(q) &&
        !item.titulo.toLowerCase().includes(q)
      ) {
        return false;
      }
      const meta = metaPorIes.get(normalizarTexto(item.institucion));
      if (regionFiltro !== "todas") {
        if (!meta || !meta.regiones.includes(regionFiltro)) return false;
      }
      if (jornadaFiltro !== "todas") {
        if (!meta || !meta.jornadas.includes(jornadaFiltro)) return false;
      }
      return true;
    });

    return [...filtradas].sort((a, b) => {
      const mul = sortDir === "desc" ? 1 : -1;
      if (sortKey === "tramo") {
        if (sortDir === "desc") return compararTramosDesc(a.tramo, b.tramo);
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
        if (sortKey === "arancel") {
          return metaPorIes.get(normalizarTexto(item.institucion))?.arancelMed ?? null;
        }
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
  }, [instituciones, busqueda, regionFiltro, jornadaFiltro, sortKey, sortDir, metaPorIes]);

  if (instituciones.length === 0) {
    return (
      <Card className="gap-2 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
        <CardHeader className="px-6">
          <CardTitle className="text-base font-semibold text-foreground">
            Resultados por institución
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 text-sm text-muted-foreground">
          No hay registros institucionales publicados para este tipo de institución en la edición
          vigente.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-4 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
      <CardHeader className="flex flex-col gap-3 px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Resultados por institución ({filas.length})
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Los ingresos por institución se publican en tramos oficiales. Haz clic en cualquier
              columna para ordenar.
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Filtrar institución o título..."
              aria-label="Filtrar institución o título"
              className="h-9 bg-background/60 pl-8 text-xs focus-visible:bg-card"
            />
          </div>
        </div>

        {(regionesDisponibles.length > 1 || jornadasDisponibles.length > 1) ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {regionesDisponibles.length > 1 ? (
              <Select value={regionFiltro} onValueChange={setRegionFiltro}>
                <SelectTrigger className="h-8 w-auto min-w-[160px] bg-background/60 text-xs">
                  <SelectValue placeholder="Todas las regiones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las regiones</SelectItem>
                  {regionesDisponibles.map((reg) => (
                    <SelectItem key={reg} value={reg}>
                      {reg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}

            {jornadasDisponibles.length > 1 ? (
              <Select value={jornadaFiltro} onValueChange={setJornadaFiltro}>
                <SelectTrigger className="h-8 w-auto min-w-[145px] bg-background/60 text-xs">
                  <SelectValue placeholder="Todas las jornadas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las jornadas</SelectItem>
                  {jornadasDisponibles.map((jor) => (
                    <SelectItem key={jor} value={jor}>
                      {jor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="px-6">
        {filas.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
            Ninguna institución coincide con los filtros aplicados.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
              <Table className="tabular-nums">
                <TableHeader className="bg-muted/60">
                  <TableRow className="hover:bg-muted/60">
                    <TableHead className="min-w-[240px] normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("institucion")}
                        className="font-medium text-foreground hover:text-blue-700"
                      >
                        Institución / Título
                        <SortIcon col="institucion" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead className="normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("acred_anos")}
                        className="font-medium text-foreground hover:text-blue-700"
                      >
                        Acreditación
                        <SortIcon col="acred_anos" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[190px] normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("tramo")}
                        className="font-medium text-foreground hover:text-blue-700"
                      >
                        Tramo sueldo 4.º año
                        <SortIcon col="tramo" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                    {tieneAranceles ? (
                      <TableHead className="text-right normal-case">
                        <button
                          type="button"
                          onClick={() => toggleSort("arancel")}
                          className="font-medium text-foreground hover:text-blue-700"
                        >
                          Arancel anual
                          <SortIcon col="arancel" sortKey={sortKey} sortDir={sortDir} />
                        </button>
                      </TableHead>
                    ) : null}
                    <TableHead className="text-right normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("emp1")}
                        className="font-medium text-foreground hover:text-blue-700"
                      >
                        Empleo 1.º
                        <SortIcon col="emp1" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead className="text-right normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("emp2")}
                        className="font-medium text-foreground hover:text-blue-700"
                      >
                        Empleo 2.º
                        <SortIcon col="emp2" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead className="text-right normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("retencion_1")}
                        className="font-medium text-foreground hover:text-blue-700"
                      >
                        Retención 1.º
                        <SortIcon col="retencion_1" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead className="text-right normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("continuidad")}
                        className="font-medium text-foreground hover:text-blue-700"
                      >
                        Continuidad
                        <SortIcon col="continuidad" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead className="text-right normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("dur_real")}
                        className="font-medium text-foreground hover:text-blue-700"
                      >
                        Duración real
                        <SortIcon col="dur_real" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filas.map((item) => {
                    const meta = metaPorIes.get(normalizarTexto(item.institucion));
                    return (
                      <TableRow key={`${item.codigo_ies}-${item.titulo}`}>
                        <TableCell className="align-top">
                          <div className="flex items-start gap-2.5">
                            <InstitucionAvatar
                              nombre={item.institucion}
                              tipo={item.tipo}
                              size="sm"
                              className="mt-0.5"
                            />
                            <div className="min-w-0">
                              <div className="font-medium leading-snug text-foreground">
                                {item.institucion}
                              </div>
                              <div className="mt-0.5 text-xs text-muted-foreground">
                                {item.titulo}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <AcreditacionBadge
                            anos={item.acred_anos}
                            texto={item.acreditacion}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <BarraTramo tramo={item.tramo} />
                        </TableCell>
                        {tieneAranceles ? (
                          <TableCell className="text-right align-top text-muted-foreground">
                            {meta?.arancelMed ? pesos(meta.arancelMed) : "s/i"}
                          </TableCell>
                        ) : null}
                        <TableCell className="text-right align-top font-semibold text-foreground">
                          {porcentaje(item.emp1)}
                        </TableCell>
                        <TableCell className="text-right align-top text-muted-foreground">
                          {porcentaje(item.emp2)}
                        </TableCell>
                        <TableCell className="text-right align-top text-muted-foreground">
                          {porcentaje(item.retencion_1)}
                        </TableCell>
                        <TableCell className="text-right align-top text-muted-foreground">
                          {porcentaje(item.continuidad)}
                        </TableCell>
                        <TableCell className="text-right align-top text-muted-foreground">
                          {item.dur_real !== null
                            ? anosDesdeSemestres(item.dur_real)
                            : "Sin dato"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card Rows */}
            <div className="space-y-3 md:hidden">
              {filas.map((item) => {
                const meta = metaPorIes.get(normalizarTexto(item.institucion));
                return (
                  <div
                    key={`${item.codigo_ies}-${item.titulo}-mob`}
                    className="space-y-3 rounded-lg border border-border bg-background/40 p-3.5 tabular-nums"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <InstitucionAvatar
                          nombre={item.institucion}
                          tipo={item.tipo}
                          size="sm"
                          className="mt-0.5"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-medium leading-snug text-foreground">
                            {item.institucion}
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {item.titulo}
                          </div>
                        </div>
                      </div>
                      <AcreditacionBadge
                        anos={item.acred_anos}
                        texto={item.acreditacion}
                      />
                    </div>

                    <BarraTramo tramo={item.tramo} />

                    <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-2.5 text-xs">
                      <div>
                        <div className="text-[11px] text-muted-foreground">Empleo 1.º</div>
                        <div className="font-semibold text-foreground">
                          {porcentaje(item.emp1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-muted-foreground">Retención 1.º</div>
                        <div className="font-medium text-foreground">
                          {porcentaje(item.retencion_1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-muted-foreground">
                          {tieneAranceles ? "Arancel" : "Duración"}
                        </div>
                        <div className="font-medium text-foreground">
                          {tieneAranceles
                            ? meta?.arancelMed
                              ? pesos(meta.arancelMed)
                              : "s/i"
                            : item.dur_real !== null
                              ? anosDesdeSemestres(item.dur_real)
                              : "s/i"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
