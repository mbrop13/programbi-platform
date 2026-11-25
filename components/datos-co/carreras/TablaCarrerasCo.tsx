"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  enteroCo,
  nombreProgramaCo,
  pesosCo,
  porcentajeCo,
  smmlvCo,
} from "@/lib/datos-co/formato";
import type { CarreraCo, NivelFormacionCo } from "@/lib/datos-co/types";
import { cn } from "@/lib/utils";

export type OrdenCarrerasCo = "mediana" | "pct4" | "cotizantes";
export type FiltroSectorCo = "todos" | "con_comparativa" | "oficial_mayor" | "privado_mayor";

export interface TablaCarrerasCoProps {
  programas: CarreraCo[];
  niveles: readonly NivelFormacionCo[];
  areas: readonly string[];
  ordenInicial?: OrdenCarrerasCo;
  limiteInicial?: number;
}

function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function TablaCarrerasCo({
  programas,
  niveles,
  areas,
  ordenInicial = "mediana",
  limiteInicial = 40,
}: TablaCarrerasCoProps) {
  const [busqueda, setBusqueda] = useState("");
  const [nivel, setNivel] = useState<string>("todos");
  const [area, setArea] = useState<string>("todas");
  const [sector, setSector] = useState<FiltroSectorCo>("todos");
  const [orden, setOrden] = useState<OrdenCarrerasCo>(ordenInicial);
  const [mostrarTodo, setMostrarTodo] = useState(false);

  const filtrados = useMemo(() => {
    const q = normalizarTexto(busqueda.trim());
    const lista = programas.filter((p) => {
      if (nivel !== "todos" && p.nivel_formacion !== nivel) return false;
      if (area !== "todas" && p.area_conocimiento !== area) return false;
      if (sector === "con_comparativa" && !p.sector_ies) return false;
      if (
        sector === "oficial_mayor" &&
        (!p.sector_ies || p.sector_ies.oficial.mediana_smmlv < p.sector_ies.privado.mediana_smmlv)
      ) {
        return false;
      }
      if (
        sector === "privado_mayor" &&
        (!p.sector_ies || p.sector_ies.privado.mediana_smmlv <= p.sector_ies.oficial.mediana_smmlv)
      ) {
        return false;
      }
      if (q) {
        const hay = normalizarTexto(
          `${p.programa} ${p.programa_normalizado} ${p.area_conocimiento} ${p.nivel_formacion}`
        );
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return lista.slice().sort((a, b) => {
      if (orden === "pct4") {
        return (
          b.pct_4plus_smmlv - a.pct_4plus_smmlv ||
          b.mediana_cop_2026 - a.mediana_cop_2026 ||
          b.graduados_cotizantes - a.graduados_cotizantes
        );
      }
      if (orden === "cotizantes") {
        return (
          b.graduados_cotizantes - a.graduados_cotizantes ||
          b.mediana_cop_2026 - a.mediana_cop_2026
        );
      }
      return (
        b.mediana_cop_2026 - a.mediana_cop_2026 ||
        b.pct_4plus_smmlv - a.pct_4plus_smmlv ||
        b.graduados_cotizantes - a.graduados_cotizantes
      );
    });
  }, [programas, busqueda, nivel, area, sector, orden]);

  const visibles = mostrarTodo ? filtrados : filtrados.slice(0, limiteInicial);
  const hayFiltrosActivos =
    busqueda.trim() !== "" || nivel !== "todos" || area !== "todas" || sector !== "todos";

  const limpiarFiltros = () => {
    setBusqueda("");
    setNivel("todos");
    setArea("todas");
    setSector("todos");
    setMostrarTodo(false);
  };

  return (
    <Card className="gap-4 rounded-xl border border-border bg-card py-5 shadow-xs ring-0">
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-4">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrarTodo(false);
              }}
              placeholder="Buscar carrera o área..."
              aria-label="Buscar carrera o área de conocimiento"
              className="h-10 pl-9"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={nivel}
              onChange={(e) => {
                setNivel(e.target.value);
                setMostrarTodo(false);
              }}
              aria-label="Filtrar por nivel de formación"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="todos">Todos los niveles</option>
              {niveles.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setMostrarTodo(false);
              }}
              aria-label="Filtrar por área de conocimiento"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="todas">Todas las áreas</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sector}
              onChange={(e) => {
                setSector(e.target.value as FiltroSectorCo);
                setMostrarTodo(false);
              }}
              aria-label="Filtrar por sector IES"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="todos">Sector IES: todos</option>
              <option value="con_comparativa">Con desglose Oficial vs Privado</option>
              <option value="oficial_mayor">Mediana Oficial ≥ Privada</option>
              <option value="privado_mayor">Mediana Privada &gt; Oficial</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>
              Mostrando <strong className="text-foreground tabular-nums">{visibles.length}</strong> de{" "}
              <strong className="text-foreground tabular-nums">{filtrados.length}</strong> programas
            </span>
            {hayFiltrosActivos ? (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground hover:bg-muted"
              >
                <X className="size-3" aria-hidden="true" />
                Limpiar filtros
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowDownUp className="size-3.5" aria-hidden="true" />
              Ordenar:
            </span>
            {(
              [
                { id: "mediana", label: "Mediana COP 2026" },
                { id: "pct4", label: "% ≥ 4 SMMLV" },
                { id: "cotizantes", label: "Cotizantes" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setOrden(opt.id)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  orden === opt.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {visibles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No encontramos programas con esos filtros. Prueba limpiar la búsqueda o cambiar de nivel.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                  <th className="py-2.5 pr-3">Programa</th>
                  <th className="px-3 py-2.5">Nivel</th>
                  <th className="px-3 py-2.5 text-right">Mediana COP 2026</th>
                  <th className="px-3 py-2.5 text-right">SMMLV</th>
                  <th className="px-3 py-2.5 text-right">% ≥ 4 SMMLV</th>
                  <th className="pl-3 py-2.5 text-right">Cotizantes OLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {visibles.map((p) => {
                  const nombre = nombreProgramaCo(p.programa);
                  return (
                    <tr key={p.slug} className="hover:bg-muted/35">
                      <td className="py-3 pr-3 align-top">
                        {p.sugerido_ficha ? (
                          <Link
                            href={`/co/datos/carreras/${p.slug}`}
                            prefetch={false}
                            className="font-medium text-blue-700 hover:underline"
                          >
                            {nombre}
                          </Link>
                        ) : (
                          <span className="font-medium text-foreground">{nombre}</span>
                        )}
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {p.area_conocimiento}
                          {p.sector_ies
                            ? ` · Oficial ${smmlvCo(p.sector_ies.oficial.mediana_smmlv, false)} vs Priv. ${smmlvCo(p.sector_ies.privado.mediana_smmlv, false)}`
                            : ""}
                        </p>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <Badge variant="secondary" className="text-[11px] font-normal">
                          {p.nivel_formacion === "Formación técnica profesional"
                            ? "Técnica prof."
                            : p.nivel_formacion}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-right align-top font-semibold tabular-nums text-foreground">
                        {pesosCo(p.mediana_cop_2026)}
                      </td>
                      <td className="px-3 py-3 text-right align-top tabular-nums text-muted-foreground">
                        {smmlvCo(p.mediana_smmlv, false)}
                      </td>
                      <td className="px-3 py-3 text-right align-top font-medium tabular-nums text-emerald-700">
                        {porcentajeCo(p.pct_4plus_smmlv)}
                      </td>
                      <td className="pl-3 py-3 text-right align-top tabular-nums text-muted-foreground">
                        {enteroCo(p.graduados_cotizantes)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!mostrarTodo && filtrados.length > visibles.length ? (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setMostrarTodo(true)}
              className={cn(buttonVariants({ variant: "outline", size: "default" }), "px-5")}
            >
              Ver los {filtrados.length} programas filtrados
            </button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
