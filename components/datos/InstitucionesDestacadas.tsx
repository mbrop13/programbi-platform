"use client";

import * as React from "react";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstitucionAvatar } from "@/components/datos/InstitucionAvatar";
import {
  getInstitucionVisual,
  INSTITUCIONES_DESTACADAS_KEYS,
  type InstitucionVisual,
} from "@/lib/datos/instituciones-visual";
import { entero } from "@/lib/datos/formato";
import { cn } from "@/lib/utils";

export interface InstitucionResumenItem {
  key: string;
  programas?: number;
  carreras?: number;
}

const GRUPOS: { id: "U" | "IP" | "CFT"; label: string; tipoQuery: "u" | "ip" | "cft" }[] = [
  { id: "U", label: "Universidades", tipoQuery: "u" },
  { id: "IP", label: "Institutos (IP)", tipoQuery: "ip" },
  { id: "CFT", label: "Técnicos (CFT)", tipoQuery: "cft" },
];

export function InstitucionesDestacadas({
  statsPorInstitucion = {},
}: {
  statsPorInstitucion?: Record<string, InstitucionResumenItem>;
}) {
  const porTipo = React.useMemo(() => {
    const grupos: Record<"U" | "IP" | "CFT", InstitucionVisual[]> = {
      U: [],
      IP: [],
      CFT: [],
    };
    for (const key of INSTITUCIONES_DESTACADAS_KEYS) {
      const vis = getInstitucionVisual(key);
      grupos[vis.tipo].push(vis);
    }
    return grupos;
  }, []);

  return (
    <section aria-labelledby="instituciones-destacadas-titulo" className="space-y-4">
      <Tabs defaultValue="U" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="instituciones-destacadas-titulo" className="h2-datos text-foreground">
              Instituciones destacadas en Chile
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Universidades, institutos profesionales y centros de formación técnica con oferta
              oficial 2026.
            </p>
          </div>

          <TabsList className="h-9 w-fit bg-muted p-1">
            {GRUPOS.map((g) => (
              <TabsTrigger key={g.id} value={g.id} className="px-3 text-xs font-medium">
                {g.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {GRUPOS.map((g) => {
          const lista = porTipo[g.id];
          return (
            <TabsContent key={g.id} value={g.id} keepMounted className="mt-0 data-[hidden]:hidden">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {lista.map((inst) => {
                  const stats = statsPorInstitucion[inst.key];
                  const acred = inst.acreditacionAnios;
                  return (
                    <Link
                      key={inst.key}
                      href={`/datos/carreras?tipo=${g.tipoQuery}#explorar-carreras`}
                      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    >
                      <Card className="h-full gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm">
                        <CardContent className="flex h-full flex-col justify-between gap-3.5 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <InstitucionAvatar
                                nombre={inst.nombreOficial}
                                tipo={inst.tipo}
                                size="md"
                              />
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-blue-700">
                                  {inst.nombreCorto}
                                </h3>
                                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                                  {inst.ciudad ? (
                                    <span className="inline-flex items-center gap-0.5">
                                      <MapPin className="size-3" aria-hidden="true" />
                                      {inst.ciudad}
                                    </span>
                                  ) : null}
                                  <span>·</span>
                                  <span>{inst.tipo}</span>
                                </div>
                              </div>
                            </div>
                            <ArrowUpRight
                              className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-700"
                              aria-hidden="true"
                            />
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3">
                            {acred ? (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "h-auto gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium",
                                  acred >= 6
                                    ? "border-emerald-200/80 bg-emerald-50 text-emerald-800"
                                    : "border-blue-200/80 bg-blue-50 text-blue-800"
                                )}
                              >
                                <ShieldCheck className="size-3" aria-hidden="true" />
                                {acred} años acred.
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="h-auto rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                              >
                                Oferta 2026
                              </Badge>
                            )}

                            {stats?.programas ? (
                              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                                <strong className="font-semibold text-foreground">
                                  {entero(stats.programas)}
                                </strong>{" "}
                                programas
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-blue-700">
                                Ver carreras
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}
