import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowLeft, ArrowRight, BookOpen, GitCompare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TIPO_ETIQUETAS, type RankingItem, type TipoIesKey } from "@/lib/datos/carreras-tipos";
import { pesos, porcentaje } from "@/lib/datos/formato";
import type { CarreraParecida } from "@/lib/datos/parecidas";
import { cn } from "@/lib/utils";

interface CarrerasParecidasProps {
  slugActual: string;
  nombreActual: string;
  tipoActual: TipoIesKey;
  similares: CarreraParecida[];
  menosAnos: CarreraParecida[];
  anteriorEnRanking: RankingItem | null;
  siguienteEnRanking: RankingItem | null;
}

export function CarrerasParecidas({
  slugActual,
  nombreActual,
  tipoActual,
  similares,
  menosAnos,
  anteriorEnRanking,
  siguienteEnRanking,
}: CarrerasParecidasProps) {
  const compararCon = similares.slice(0, 3);

  return (
    <section aria-labelledby="parecidas-titulo" className="space-y-6">
      <Card className="gap-4 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
        <CardHeader className="px-6">
          <CardTitle id="parecidas-titulo" className="text-lg font-semibold text-foreground">
            Carreras parecidas por ingreso y área
          </CardTitle>
          <CardDescription className="text-xs">
            Alternativas en {TIPO_ETIQUETAS[tipoActual].plural.toLowerCase()} con sueldos cercanos
            al 4.º año.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          {similares.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {similares.map((c) => (
                <Link
                  key={`${c.slug}-${c.tipo}`}
                  href={`/datos/carreras/${c.slug}`}
                  className="group flex flex-col justify-between rounded-lg border border-border bg-background/60 p-4 transition-all hover:border-slate-300 hover:bg-card hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-700">
                        {c.nombre}
                      </h3>
                      <Badge variant="secondary" className="h-auto shrink-0 rounded px-1.5 py-0 text-[10px]">
                        {TIPO_ETIQUETAS[c.tipo].corto}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{c.area}</p>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-baseline justify-between text-xs tabular-nums">
                      <span className="font-semibold text-foreground">{pesos(c.ing4)}</span>
                      <span className="text-muted-foreground">Emp. {porcentaje(c.emp1)}</span>
                    </div>
                    {c.diferencias.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {c.diferencias.map((diff) => (
                          <Badge
                            key={diff}
                            variant="outline"
                            className="h-auto rounded bg-card px-1.5 py-0.5 text-[11px] font-normal text-muted-foreground"
                          >
                            {diff}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay suficientes carreras comparables en este segmento.
            </p>
          )}

          {compararCon.length > 0 ? (
            <div className="mt-5 border-t border-border/70 pt-4">
              <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <GitCompare className="size-3.5 text-blue-600" aria-hidden="true" />
                Comparar {nombreActual} frente a frente
              </p>
              <div className="flex flex-wrap gap-2">
                {compararCon.map((c) => (
                  <Link
                    key={`cmp-${c.slug}`}
                    href={`/datos/carreras/comparar?c=${encodeURIComponent(`${slugActual},${c.slug}`)}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-8 gap-1.5 rounded-lg bg-card px-3 text-xs font-medium"
                    )}
                  >
                    vs. {c.nombre}
                    <ArrowRight className="size-3 text-muted-foreground" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {menosAnos.length > 0 ? (
        <Card className="gap-3 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
          <CardHeader className="px-6">
            <CardTitle className="text-base font-semibold text-foreground">
              Sueldo similar en menos años reales
            </CardTitle>
            <CardDescription className="text-xs">
              Opciones con ingreso al 4.º año dentro de ±10 % y menor duración promedio.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {menosAnos.map((c) => (
                <Link
                  key={`ma-${c.slug}-${c.tipo}`}
                  href={`/datos/carreras/${c.slug}`}
                  className="rounded-lg border border-border bg-background/60 p-3.5 transition-all hover:border-slate-300 hover:bg-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold leading-snug text-foreground">
                      {c.nombre}
                    </span>
                    <Badge
                      variant="secondary"
                      className="h-auto shrink-0 rounded bg-amber-50 px-1.5 py-0 text-[10px] font-semibold text-amber-800"
                    >
                      {TIPO_ETIQUETAS[c.tipo].corto}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-blue-700 tabular-nums">
                    {pesos(c.ing4)}
                  </div>
                  {c.diferencias.length > 0 ? (
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {c.diferencias.join(" · ")}
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
          <CardContent className="flex h-full flex-col justify-between p-5">
            <span className="text-xs font-medium text-muted-foreground">
              Navegación en el ranking ({TIPO_ETIQUETAS[tipoActual].corto})
            </span>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {anteriorEnRanking ? (
                <Link
                  href={`/datos/carreras/${anteriorEnRanking.slug}`}
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs transition-colors hover:border-slate-300 hover:bg-card"
                >
                  <ArrowLeft className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-muted-foreground">Puesto superior</span>
                    <span className="block truncate font-semibold text-foreground">
                      {anteriorEnRanking.nombre}
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
                  Primer lugar del ranking
                </div>
              )}

              {siguienteEnRanking ? (
                <Link
                  href={`/datos/carreras/${siguienteEnRanking.slug}`}
                  className="flex items-center justify-end gap-2 rounded-lg border border-border bg-muted/40 p-3 text-right text-xs transition-colors hover:border-slate-300 hover:bg-card"
                >
                  <div className="min-w-0">
                    <span className="block text-[10px] text-muted-foreground">Puesto siguiente</span>
                    <span className="block truncate font-semibold text-foreground">
                      {siguienteEnRanking.nombre}
                    </span>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Link>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-3 text-right text-xs text-muted-foreground">
                  Último lugar evaluado
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
          <CardContent className="flex h-full flex-col justify-between p-5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <BookOpen className="size-3.5 text-blue-600" aria-hidden="true" />
                Habilidades complementarias en ProgramBI
              </span>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Herramientas prácticas de análisis de datos útiles en cualquier área profesional.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/cursos/excel"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "h-8 rounded-md px-3 text-xs font-medium"
                )}
              >
                Curso de Excel →
              </Link>
              <Link
                href="/cursos/power-bi"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "h-8 rounded-md px-3 text-xs font-medium"
                )}
              >
                Curso de Power BI →
              </Link>
              <Link
                href="/cursos/analisis-de-datos"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "h-8 rounded-md px-3 text-xs font-medium"
                )}
              >
                Análisis de Datos →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
