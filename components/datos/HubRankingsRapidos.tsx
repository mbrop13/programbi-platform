"use client";

import * as React from "react";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowUpRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { normalizarTexto } from "@/lib/datos/formato";
import { cn } from "@/lib/utils";

export interface FilaMiniRanking {
  slug: string;
  tipo: string;
  tipoCorto: string;
  nombre: string;
  area: string;
  metricaTexto: string;
}

export interface GrupoMiniRanking {
  id: string;
  tabLabel: string;
  titulo: string;
  subtitulo: string;
  hrefVerMas: string;
  filas: FilaMiniRanking[];
}

export function HubRankingsRapidos({ grupos }: { grupos: GrupoMiniRanking[] }) {
  if (grupos.length === 0) return null;

  return (
    <Card className="gap-0 overflow-hidden rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
      <Tabs defaultValue={grupos[0].id} className="flex flex-col gap-0">
        <CardHeader className="border-b border-border bg-muted/30 px-5 pt-5 pb-3 sm:px-6">
          <div className="flex flex-col gap-3">
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                Rankings rápidos por categoría
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                Cambia de pestaña para revisar el Top 10 según tipo de institución, empleabilidad,
                crecimiento o duración.
              </CardDescription>
            </div>
            <div className="-mx-1 overflow-x-auto px-1 pb-1">
              <TabsList className="inline-flex h-auto w-max min-w-full flex-nowrap justify-start gap-1 bg-muted p-1 sm:min-w-0">
                {grupos.map((g) => (
                  <TabsTrigger
                    key={g.id}
                    value={g.id}
                    className="h-8 shrink-0 px-3 text-xs font-medium whitespace-nowrap"
                  >
                    {g.tabLabel}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          {grupos.map((g) => (
            <TabsContent key={g.id} value={g.id} keepMounted className="mt-0 data-[hidden]:hidden">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{g.titulo}</h3>
                  <p className="text-xs text-muted-foreground">{g.subtitulo}</p>
                </div>
                <Link
                  href={g.hrefVerMas}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-blue-700 hover:underline"
                >
                  Ver ranking completo
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>

              <ol className="grid gap-2 sm:grid-cols-2">
                {g.filas.map((r, i) => (
                  <li
                    key={`${g.id}-${r.slug}-${r.tipo}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-background/50 px-3.5 py-2.5 transition-colors hover:border-slate-300 hover:bg-card"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold tabular-nums",
                          i < 3
                            ? "border border-blue-200/80 bg-blue-50 text-blue-700"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/datos/carreras/${r.slug}?tipo=${r.tipo}`}
                          prefetch={false}
                          className="block truncate text-sm font-medium text-foreground hover:text-blue-700 hover:underline"
                        >
                          {r.nombre}
                        </Link>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {r.tipoCorto} · {r.area}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
                      {r.metricaTexto}
                    </span>
                  </li>
                ))}
              </ol>
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  );
}

export interface GrupoDirectorioArea {
  area: string;
  carreras: { slug: string; nombre: string }[];
}

export function HubDirectorioAreas({
  grupos,
  totalCarreras,
  edicion,
}: {
  grupos: GrupoDirectorioArea[];
  totalCarreras: number;
  edicion: string;
}) {
  const [filtro, setFiltro] = React.useState("");
  const q = normalizarTexto(filtro);

  return (
    <Card
      aria-labelledby="directorio-carreras-titulo"
      className="gap-4 rounded-xl border border-border bg-card py-6 shadow-xs ring-0"
    >
      <CardHeader className="flex flex-col gap-3 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle
            id="directorio-carreras-titulo"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Directorio completo por área del conocimiento
          </CardTitle>
          <CardDescription className="mt-1 text-xs">
            Acceso directo a las {totalCarreras} fichas oficiales de mifuturo.cl (edición {edicion}).
          </CardDescription>
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Filtrar directorio..."
            aria-label="Filtrar directorio de carreras"
            className="h-9 bg-background/60 pl-8 text-xs focus-visible:bg-card"
          />
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grupos.map(({ area, carreras }) => {
            const visibles = q
              ? carreras.filter((c) => normalizarTexto(c.nombre).includes(q))
              : carreras;

            return (
              <div
                key={area}
                className={visibles.length === 0 ? "hidden" : "space-y-2.5"}
              >
                <div className="flex items-center justify-between gap-2 border-b border-border pb-1.5">
                  <h3 className="text-xs font-semibold text-foreground">{area}</h3>
                  <Badge variant="secondary" className="h-auto rounded px-1.5 py-0 text-[10px]">
                    {visibles.length}
                  </Badge>
                </div>
                <ul className="space-y-1 text-xs">
                  {carreras.map((c) => {
                    const match = !q || normalizarTexto(c.nombre).includes(q);
                    return (
                      <li key={c.slug} className={match ? undefined : "hidden"}>
                        <Link
                          href={`/datos/carreras/${c.slug}`}
                          prefetch={false}
                          className="inline-flex min-h-6 items-center py-0.5 text-muted-foreground transition-colors hover:text-blue-700 hover:underline"
                        >
                          {c.nombre}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
