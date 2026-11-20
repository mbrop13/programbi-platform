"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ChileMap, type RegionKey } from "@/components/datos/viz/ChileMap";
import { InlineBar } from "@/components/datos/viz/InlineBar";
import { C } from "@/components/datos/viz/tokens";
import {
  TIPO_ETIQUETAS,
  TIPO_ORDEN,
  type InstitucionCarrera,
  type ProgramaCarrera,
} from "@/lib/datos/carreras-tipos";
import { entero, normalizarTexto, pesos, porcentaje } from "@/lib/datos/formato";
import { REGIONES } from "@/lib/datos/regiones";
import { compararTramosDesc, formatearTramoCorto, puntoMedioTramo } from "@/lib/datos/tramos";

interface TablaInstitucionesProps {
  instituciones: InstitucionCarrera[];
  programas?: ProgramaCarrera[];
}

type SortKey = "institucion" | "tipo" | "tramo" | "emp1" | "arancel" | "programas";

const LIMITE_FILAS = 10;

/* ---- Normalización de regiones (nombre legible -> RegionKey) ---- */

const canonRegion = (s: string) =>
  normalizarTexto(s).replace(/['’´`]/g, "").replace(/\s+/g, " ").trim();

const ALIAS_REGION = (() => {
  const m = new Map<string, RegionKey>();
  const add = (form: string, slug: RegionKey) => {
    const c = canonRegion(form);
    if (!c) return;
    m.set(c, slug);
    m.set(c.replace(/\s+/g, "-"), slug);
    m.set(c.replace(/-/g, " "), slug);
  };
  for (const r of REGIONES) {
    const slug = r.slug as RegionKey;
    for (const form of [r.slug, r.nombre, r.nombreOficial]) {
      add(form, slug);
      const sinRegion = canonRegion(form).replace(
        /^region\s+(?:de\s+la\s+|de\s+|del\s+|metropolitana\s+)?/,
        ""
      );
      if (sinRegion) add(sinRegion, slug);
    }
  }
  return m;
})();

const NOMBRE_REGION = new Map<RegionKey, string>(
  REGIONES.map((r) => [r.slug as RegionKey, r.nombre] as [RegionKey, string])
);

function normalizarRegion(raw: string | null | undefined): RegionKey | null {
  if (!raw) return null;
  const c = canonRegion(raw);
  if (!c) return null;
  return ALIAS_REGION.get(c) ?? ALIAS_REGION.get(c.replace(/\s+/g, "-")) ?? null;
}

/* ---- Helpers de fila ---- */

/** Valor representativo del sueldo al 4.º año a partir del tramo oficial. */
function valorSueldo(item: InstitucionCarrera): number | null {
  if (!item.tramo) return null;
  return puntoMedioTramo(item.tramo) ?? item.tramo.min;
}

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
    <ArrowDown className="ml-1 inline size-3" style={{ color: C.blueText }} />
  ) : (
    <ArrowUp className="ml-1 inline size-3" style={{ color: C.blueText }} />
  );
}

function TipoBadge({ tipo }: { tipo: InstitucionCarrera["tipo"] }) {
  return (
    <Badge
      variant="secondary"
      title={TIPO_ETIQUETAS[tipo].singular}
      className="h-auto rounded-md border border-border bg-background/60 px-2 py-0.5 text-[11px] font-semibold text-foreground"
    >
      {TIPO_ETIQUETAS[tipo].corto}
    </Badge>
  );
}

interface OfertaIesMeta {
  arancelMed: number | null;
  regiones: string[];
  jornadas: string[];
  programas: number;
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
  const [expandido, setExpandido] = useState(false);

  const {
    metaPorIes,
    regionesDisponibles,
    jornadasDisponibles,
    valoresMapa,
    listaRegiones,
    totalRegiones,
  } = useMemo(() => {
    const mapa = new Map<
      string,
      { aranceles: number[]; regiones: Set<string>; jornadas: Set<string>; count: number }
    >();
    const regSet = new Set<string>();
    const jorSet = new Set<string>();
    const conteo = new Map<RegionKey, number>();

    for (const p of programas) {
      const key = normalizarTexto(p.institucion);
      let entry = mapa.get(key);
      if (!entry) {
        entry = { aranceles: [], regiones: new Set(), jornadas: new Set(), count: 0 };
        mapa.set(key, entry);
      }
      entry.count += 1;
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
      const rk = normalizarRegion(p.region);
      if (rk) conteo.set(rk, (conteo.get(rk) ?? 0) + 1);
    }

    const resumen = new Map<string, OfertaIesMeta>();
    for (const [key, val] of mapa.entries()) {
      const sorted = [...val.aranceles].sort((a, b) => a - b);
      const med = sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)] : null;
      resumen.set(key, {
        arancelMed: med,
        regiones: [...val.regiones].sort((a, b) => a.localeCompare(b, "es")),
        jornadas: [...val.jornadas].sort((a, b) => a.localeCompare(b, "es")),
        programas: val.count,
      });
    }

    const valoresMapa: Partial<Record<RegionKey, number>> = {};
    for (const [rk, n] of conteo.entries()) valoresMapa[rk] = n;
    const listaRegiones = [...conteo.entries()]
      .map(([rk, n]) => ({ slug: rk, nombre: NOMBRE_REGION.get(rk) ?? rk, count: n }))
      .sort((a, b) => b.count - a.count || a.nombre.localeCompare(b.nombre, "es"));

    return {
      metaPorIes: resumen,
      regionesDisponibles: [...regSet].sort((a, b) => a.localeCompare(b, "es")),
      jornadasDisponibles: [...jorSet].sort((a, b) => a.localeCompare(b, "es")),
      valoresMapa,
      listaRegiones,
      totalRegiones: conteo.size,
    };
  }, [programas]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir(key === "institucion" || key === "arancel" || key === "tipo" ? "asc" : "desc");
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
        const meta = metaPorIes.get(normalizarTexto(item.institucion));
        if (sortKey === "tipo") return TIPO_ORDEN.indexOf(item.tipo);
        if (sortKey === "emp1") return item.emp1;
        if (sortKey === "arancel") return meta?.arancelMed ?? null;
        if (sortKey === "programas") return meta?.programas ?? 0;
        return null;
      };
      const va = numVal(a);
      const vb = numVal(b);
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;
      const mul = sortDir === "desc" ? 1 : -1;
      return (vb - va) * mul;
    });
  }, [instituciones, busqueda, regionFiltro, jornadaFiltro, sortKey, sortDir, metaPorIes]);

  const filasVisibles = expandido ? filas : filas.slice(0, LIMITE_FILAS);
  const hayMas = filas.length > LIMITE_FILAS;

  const maxSueldoVisibles = useMemo(() => {
    let m = 0;
    for (const it of filasVisibles) {
      const v = valorSueldo(it);
      if (v !== null && v > m) m = v;
    }
    return m > 0 ? m : 1;
  }, [filasVisibles]);

  if (instituciones.length === 0) {
    return (
      <Card className="gap-2 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
        <CardHeader className="px-6">
          <CardTitle className="text-base font-semibold text-foreground">
            Dónde estudiar
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 text-sm text-muted-foreground">
          No hay registros institucionales publicados para este tipo de institución en la edición
          vigente.
        </CardContent>
      </Card>
    );
  }

  const totalInstituciones = instituciones.length;
  const totalProgramas = programas.length;

  return (
    <Card className="gap-4 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
      <CardHeader className="flex flex-col gap-3 px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Dónde estudiar
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs tabular-nums">
              {entero(totalInstituciones)} instituciones · {entero(totalProgramas)} programas ·{" "}
              {entero(totalRegiones)} regiones
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
        {/* Mapa por región + alternativa textual (solo si hay regiones utilizables). */}
        {listaRegiones.length > 0 ? (
          <div className="mb-6 grid gap-5 md:grid-cols-[minmax(0,auto)_minmax(0,1fr)] md:items-start">
            <ChileMap
              size="md"
              values={valoresMapa}
              format={(v) => `${v} programas`}
              legendLabel="Programas por región"
              ariaLabel="Mapa de programas de la carrera por región"
            />
            <div className="min-w-0">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Programas por región
              </h3>
              <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 tabular-nums sm:grid-cols-2">
                {listaRegiones.map((r) => (
                  <li
                    key={r.slug}
                    className="flex items-center justify-between gap-2 border-b border-border/50 py-1 text-xs"
                  >
                    <span className="truncate text-foreground">{r.nombre}</span>
                    <span className="font-semibold" style={{ color: C.blueText }}>
                      {entero(r.count)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {filas.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
            Ninguna institución coincide con los filtros aplicados.
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="tabular-nums">
                Mostrando {entero(filasVisibles.length)} de {entero(filas.length)}
              </span>
              <span>Haz clic en una columna para ordenar.</span>
            </div>

            {/* Tabla compacta (desktop) */}
            <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
              <Table className="tabular-nums">
                <TableHeader className="bg-muted/60">
                  <TableRow className="hover:bg-muted/60">
                    <TableHead className="min-w-[230px] normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("institucion")}
                        className="font-medium text-foreground hover:text-[#0b63c5]"
                      >
                        Institución / Título
                        <SortIcon col="institucion" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead className="normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("tipo")}
                        className="font-medium text-foreground hover:text-[#0b63c5]"
                      >
                        Tipo
                        <SortIcon col="tipo" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[190px] normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("tramo")}
                        className="font-medium text-foreground hover:text-[#0b63c5]"
                      >
                        Sueldo 4.º año
                        <SortIcon col="tramo" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead className="text-right normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("emp1")}
                        className="font-medium text-foreground hover:text-[#0b63c5]"
                      >
                        Empleo 1.º
                        <SortIcon col="emp1" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead className="text-right normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("arancel")}
                        className="font-medium text-foreground hover:text-[#0b63c5]"
                      >
                        Arancel anual
                        <SortIcon col="arancel" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead className="text-right normal-case">
                      <button
                        type="button"
                        onClick={() => toggleSort("programas")}
                        className="font-medium text-foreground hover:text-[#0b63c5]"
                      >
                        Programas
                        <SortIcon col="programas" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filasVisibles.map((item) => {
                    const meta = metaPorIes.get(normalizarTexto(item.institucion));
                    const sueldo = valorSueldo(item);
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
                          <TipoBadge tipo={item.tipo} />
                        </TableCell>
                        <TableCell className="align-top">
                          {item.tramo && sueldo !== null ? (
                            <InlineBar
                              value={sueldo}
                              max={maxSueldoVisibles}
                              label={formatearTramoCorto(item.tramo)}
                              tone="blue"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">s/i</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right align-top font-semibold text-foreground">
                          {porcentaje(item.emp1)}
                        </TableCell>
                        <TableCell className="text-right align-top text-muted-foreground">
                          {meta?.arancelMed ? pesos(meta.arancelMed) : "s/i"}
                        </TableCell>
                        <TableCell className="text-right align-top text-muted-foreground">
                          {entero(meta?.programas ?? 0)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Filas compactas (móvil) */}
            <div className="space-y-3 md:hidden">
              {filasVisibles.map((item) => {
                const meta = metaPorIes.get(normalizarTexto(item.institucion));
                const sueldo = valorSueldo(item);
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
                      <TipoBadge tipo={item.tipo} />
                    </div>

                    {item.tramo && sueldo !== null ? (
                      <InlineBar
                        value={sueldo}
                        max={maxSueldoVisibles}
                        label={formatearTramoCorto(item.tramo)}
                        tone="blue"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">Sueldo 4.º año: s/i</span>
                    )}

                    <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-2.5 text-xs">
                      <div>
                        <div className="text-[11px] text-muted-foreground">Empleo 1.º</div>
                        <div className="font-semibold text-foreground">
                          {porcentaje(item.emp1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-muted-foreground">Arancel</div>
                        <div className="font-medium text-foreground">
                          {meta?.arancelMed ? pesos(meta.arancelMed) : "s/i"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-muted-foreground">Programas</div>
                        <div className="font-medium text-foreground">
                          {entero(meta?.programas ?? 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hayMas ? (
              <div className="mt-4 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-expanded={expandido}
                  onClick={() => setExpandido((v) => !v)}
                  className="gap-1.5 text-xs"
                >
                  {expandido ? (
                    <>
                      <ChevronUp className="size-3.5" aria-hidden="true" />
                      Mostrar menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="size-3.5" aria-hidden="true" />
                      Ver las {entero(filas.length)}
                    </>
                  )}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
