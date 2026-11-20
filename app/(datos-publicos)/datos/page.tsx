import Link from "@/components/datos/EnlaceNavegacionDatos";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Calculator,
  ChartNoAxesCombined,
  Compass,
  GitCompare,
  GraduationCap,
  MapPin,
  Percent,
  Target,
  TrendingUp,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { BuscadorCarreras } from "@/components/datos/BuscadorCarreras";
import { DatosEstructurados, Fuente } from "@/components/datos/ElementosDatos";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { ChileMap, type RegionKey } from "@/components/datos/viz/ChileMap";
import { InlineBar } from "@/components/datos/viz/InlineBar";
import { Sparkline } from "@/components/datos/viz/Sparkline";
import { StatTile } from "@/components/datos/viz/StatTile";
import { datosTerritorio, RANKING } from "@/lib/datos/desempleo";
import { cifra, periodo, puntos } from "@/lib/datos/desempleo-formato";
import { getMetaCarreras, getRankingCarreras } from "@/lib/datos/carreras";
import { entero, mesCorto, mesLargo, pesos, variacionPorcentual } from "@/lib/datos/formato";
import { getIpcSeries, getUltimoIpc, variacionIpc } from "@/lib/datos/ipc";
import { NACIONAL, RUTA_DESEMPLEO, rutaTerritorio } from "@/lib/datos/regiones";
import { breadcrumbs, dataset, metaObservatorio, MIGAS_DATOS } from "@/lib/datos/seo";
import { resumenTerritorio } from "@/lib/datos/textos";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";
const baseMeta = metaObservatorio(NACIONAL, "Chile", true);
const nacionalMeta = datosTerritorio(NACIONAL);
const descripcion = nacionalMeta
  ? `Desempleo en Chile: ${cifra(nacionalMeta.actual.tasa)} % en ${periodo(nacionalMeta.actual.p)}, según el INE. Explora carreras, capacitación e IPC con datos oficiales, compara y descarga las series.`
  : "Explora datos oficiales de Chile sobre desempleo, carreras, capacitación e inflación.";
const titulo = "Datos de Chile: empleo, carreras e inflación";
export const metadata = {
  ...baseMeta,
  title: { absolute: titulo },
  description: descripcion,
  openGraph: { ...baseMeta.openGraph, title: titulo, description: descripcion },
  twitter: { ...baseMeta.twitter, title: titulo, description: descripcion },
};

/** Resta 12 meses a un período "YYYY-MM" (mismo mes del año anterior). */
function mesHaceUnAno(ym: string): string {
  const [ano, mes] = ym.split("-").map(Number);
  return `${ano - 1}-${String(mes).padStart(2, "0")}`;
}

export default function DatosPage() {
  const nacional = datosTerritorio(NACIONAL);
  if (!nacional) notFound();
  const { actual, serie, indicadores } = nacional;
  const resumen = resumenTerritorio("Chile", actual, indicadores, 0, RANKING.length);
  const carrerasMeta = getMetaCarreras();

  // Top 5 carreras universitarias mejor pagadas al 4.º año (solo JSON existente).
  const topU = getRankingCarreras()
    .filter((item) => item.tipo === "u" && item.ing4 !== null)
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))
    .slice(0, 5);
  const maxIng4 = topU[0]?.ing4 ?? 1;

  const ipcSerie = getIpcSeries();
  const ultimoIpc = getUltimoIpc();
  const ipcDesde12m = mesHaceUnAno(ultimoIpc.m);
  const varIpc12m = variacionIpc(ipcDesde12m, ultimoIpc.m, ipcSerie);

  // Tasas regionales para el mini-mapa del hero (RANKING ya excluye "nacional").
  const tasasPorRegion = Object.fromEntries(
    RANKING.map((region) => [region.slug, region.tasa])
  ) as Partial<Record<RegionKey, number | null>>;

  const sparkDesempleo = serie.slice(-24).map((observacion) => observacion.tasa);
  const sparkIpc = ipcSerie.map((punto) => punto.v);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:py-10">
      <DatosEstructurados
        nodos={[breadcrumbs(MIGAS_DATOS), dataset(NACIONAL, "Chile", descripcion, serie)]}
      />

      <div className="space-y-4">
        <MigasDatos migas={MIGAS_DATOS} />

        {/* Hero: texto + buscador a la izquierda; mini-mapa + 3 KPI a la derecha. */}
        <section
          aria-label="Panorama de datos de Chile"
          className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        >
          <div className="space-y-4">
            <Badge
              variant="secondary"
              className="h-auto gap-1.5 rounded-md border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              <Activity className="size-3.5 text-[#0b63c5]" aria-hidden="true" />
              Datos abiertos de ProgramBI
            </Badge>
            <h1 className="h1-datos text-foreground">Datos de Chile, explicados en simple</h1>
            <p className="max-w-[68ch] text-base leading-relaxed text-muted-foreground">
              Explora cifras oficiales sobre carreras, inflación, desempleo y capacitación. Todo
              gratis, sin registro y listo para comparar o descargar.
            </p>
            <BuscadorCarreras placeholder="Busca una carrera (ej. medicina, informática, tens)…" />
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-xs font-semibold text-foreground">Desocupación por región</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {periodo(actual.p)} · INE
                </p>
              </div>
              <ChileMap
                values={tasasPorRegion}
                format={(v) => `${cifra(v)} %`}
                hrefFor={(r) => rutaTerritorio(r)}
                legendLabel="Tasa de desocupación"
                orientation="vertical"
                size="mini"
                ariaLabel="Mapa de desempleo por región de Chile"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <StatTile
                label="Desempleo"
                value={`${cifra(actual.tasa)} %`}
                sub={`${periodo(actual.p)} · INE`}
                delta={
                  indicadores.yoy_pp !== null
                    ? {
                        text: `${puntos(indicadores.yoy_pp)} en 12 meses`,
                        dir:
                          indicadores.yoy_pp > 0
                            ? "up"
                            : indicadores.yoy_pp < 0
                              ? "down"
                              : "flat",
                        good: indicadores.yoy_pp <= 0,
                      }
                    : undefined
                }
                spark={sparkDesempleo}
              />
              <StatTile
                label="Inflación 12 meses"
                value={variacionPorcentual(varIpc12m)}
                sub={`IPC ${mesCorto(ipcDesde12m)} → ${mesCorto(ultimoIpc.m)}`}
                spark={sparkIpc}
              />
              {topU.length > 0 ? (
                <StatTile
                  label="Carreras"
                  value={pesos(topU[0].ing4)}
                  sub="Mejor sueldo 4.º año (U)"
                />
              ) : null}
            </div>
          </div>
        </section>
      </div>

      {/* 3 observatorios principales: mini-visuales de datos en vez de fotos. */}
      <section aria-labelledby="hub-observatorios" className="space-y-4">
        <h2 id="hub-observatorios" className="sr-only">
          Observatorios principales
        </h2>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Carreras y empleabilidad: top 5 mejor pagadas (U) con barras inline. */}
          <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0 transition-all hover:border-slate-300 hover:shadow-sm">
            <CardContent className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="secondary"
                  className="h-auto rounded-md border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-[#0b63c5]"
                >
                  Mi Futuro · Edición {carrerasMeta.edicion}
                </Badge>
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
                  <GraduationCap className="size-4" aria-hidden="true" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  Carreras, sueldos y empleabilidad
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {carrerasMeta.conteos.genericas_unicas} carreras y{" "}
                  {entero(carrerasMeta.conteos.filas_C)} programas 2026 en universidades, IP y CFT.
                </p>
              </div>

              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Top 5 · sueldo al 4.º año en universidades
                </p>
                <ol className="mt-2 space-y-2.5">
                  {topU.map((carrera) => (
                    <li key={carrera.slug}>
                      <div className="flex items-baseline justify-between gap-2 text-xs">
                        <Link
                          href={`/datos/carreras/${carrera.slug}`}
                          className="truncate font-medium text-foreground hover:text-[#0b63c5]"
                        >
                          {carrera.nombre}
                        </Link>
                        <span className="shrink-0 font-semibold text-foreground tabular-nums">
                          {pesos(carrera.ing4)}
                        </span>
                      </div>
                      <InlineBar
                        value={carrera.ing4 ?? 0}
                        max={maxIng4}
                        label={`${carrera.nombre}: ${pesos(carrera.ing4)} al 4.º año`}
                      />
                    </li>
                  ))}
                </ol>
              </div>

              <Link
                href="/datos/carreras"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "h-9 w-fit gap-1.5 rounded-lg px-4 text-xs font-medium"
                )}
              >
                Explorar carreras
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>

          {/* Inflación e IPC: sparkline de la serie mensual + últimas cifras. */}
          <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0 transition-all hover:border-slate-300 hover:shadow-sm">
            <CardContent className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="secondary"
                  className="h-auto rounded-md border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  INE · {mesLargo(ultimoIpc.m)}
                </Badge>
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
                  <Percent className="size-4" aria-hidden="true" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  Calculadora de inflación (IPC)
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Actualiza sueldos, arriendos o aranceles a pesos de hoy y comprueba si tus
                  ingresos le ganaron al costo de la vida.
                </p>
              </div>

              <div className="flex-1 space-y-2.5">
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <Sparkline
                    data={sparkIpc}
                    width={280}
                    height={64}
                    ariaLabel="Evolución del IPC mensual de Chile"
                    lastDot
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground tabular-nums">
                    IPC mensual · {mesCorto(ipcSerie[0].m)} → {mesCorto(ultimoIpc.m)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs">
                    <span className="text-muted-foreground">Último índice</span>
                    <p className="mt-0.5 text-base font-bold text-foreground tabular-nums">
                      {ultimoIpc.v.toFixed(2).replace(".", ",")} pts
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs">
                    <span className="text-muted-foreground">Var. 12 meses</span>
                    <p className="mt-0.5 text-base font-bold text-[#0b63c5] tabular-nums">
                      {varIpc12m !== null ? variacionPorcentual(varIpc12m) : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/datos/inflacion"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "h-9 w-fit gap-1.5 rounded-lg px-4 text-xs font-medium"
                )}
              >
                Abrir calculadora de IPC
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>

          {/* Desempleo: sparkline nacional + tasa SSR (data-* del check) + 16 regiones. */}
          <Card
            aria-labelledby="hub-desempleo"
            className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0 transition-all hover:border-slate-300 hover:shadow-sm"
          >
            <CardContent className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant="secondary"
                  className="h-auto rounded-md border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {periodo(actual.p)} · INE
                </Badge>
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
                  <Activity className="size-4" aria-hidden="true" />
                </div>
              </div>

              <div>
                <h3
                  id="hub-desempleo"
                  className="text-lg font-semibold tracking-tight text-foreground"
                >
                  Observatorio de Desempleo en Chile
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Tasa de desocupación nacional con evolución desde 2010 y mapa de las{" "}
                  {RANKING.length} regiones.
                </p>
              </div>

              <div className="flex-1 space-y-2.5">
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <Sparkline
                    data={sparkDesempleo}
                    width={280}
                    height={64}
                    ariaLabel="Tasa de desocupación nacional, últimos 24 trimestres móviles"
                    lastDot
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Últimos 24 trimestres móviles
                  </p>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
                  <p
                    className="text-3xl font-bold tracking-tight text-foreground tabular-nums"
                    data-tasa-hero={actual.tasa}
                  >
                    {cifra(actual.tasa)}
                    <span className="ml-1 text-lg font-semibold text-[#0b63c5]">%</span>
                  </p>
                  {indicadores.yoy_pp !== null ? (
                    <span
                      data-yoy-hero={indicadores.yoy_pp}
                      className="text-xs font-medium text-muted-foreground tabular-nums"
                    >
                      {puntos(indicadores.yoy_pp)} en 12 meses
                    </span>
                  ) : null}
                </div>

                <Fuente edicion />
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={RUTA_DESEMPLEO}
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "h-9 gap-1.5 rounded-lg px-4 text-xs font-medium"
                  )}
                >
                  Explorar desempleo
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href={`${RUTA_DESEMPLEO}#regiones`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-9 rounded-lg bg-card px-3 text-xs font-medium"
                  )}
                >
                  {RANKING.length} regiones
                </Link>
                <Link
                  href={`${RUTA_DESEMPLEO}/jovenes`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "h-9 px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                  )}
                >
                  Empleo juvenil
                </Link>
                <Link
                  href="/datos/capacitacion"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "h-9 px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                  )}
                >
                  Capacitación SENCE
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Herramientas rápidas */}
      <section aria-labelledby="hub-herramientas" className="space-y-4">
        <div>
          <h2 id="hub-herramientas" className="h2-datos text-foreground">
            Herramientas interactivas
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Calculadoras, comparadores y exploradores basados en fuentes oficiales de Chile.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/datos/carreras/comparar",
              icon: GitCompare,
              titulo: "Comparar carreras",
              desc: "Compara sueldos, empleabilidad y arancel lado a lado.",
            },
            {
              href: "/datos/carreras/test",
              icon: Compass,
              titulo: "Explorador por prioridades",
              desc: "Ordena carreras en 5 pasos según tus intereses y presupuesto.",
            },
            {
              href: "/datos/carreras/retorno",
              icon: Calculator,
              titulo: "Calculadora de retorno",
              desc: "Estima el costo total de estudiar y a cuántos sueldos equivale.",
            },
            {
              href: "/datos/carreras/puntaje-ponderado",
              icon: Target,
              titulo: "Calculadora PAES",
              desc: "Simula tu puntaje ponderado con ponderaciones oficiales.",
            },
            {
              href: `${RUTA_DESEMPLEO}#regiones`,
              icon: MapPin,
              titulo: "Mapa y ranking regional",
              desc: "Ubica tu región y compara tasas de desocupación.",
            },
            {
              href: `${RUTA_DESEMPLEO}#historico`,
              icon: ChartNoAxesCombined,
              titulo: "Histórico de desempleo",
              desc: "Compara regiones y trimestres móviles desde 2010.",
            },
            {
              href: "/datos/capacitacion",
              icon: BookOpen,
              titulo: "Capacitación en Chile",
              desc: "Participaciones por región en cursos con franquicia SENCE.",
            },
            {
              href: "/datos/carreras/tecnologia-y-datos",
              icon: TrendingUp,
              titulo: "Tecnología y datos",
              desc: "Ranking de informática, redes y estadística en Chile.",
            },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-start gap-3.5 rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-[#0b63c5]">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-[#0b63c5]">
                    {tool.titulo}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {tool.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Texto SEO largo, bajo el pliegue: resumen del panorama laboral. */}
      <Card
        aria-labelledby="hub-resumen"
        className="prose-datos gap-2 rounded-xl border border-border bg-card py-6 shadow-xs ring-0"
      >
        <CardContent className="space-y-2.5 px-6 text-sm leading-relaxed text-foreground/85">
          <h2 id="hub-resumen" className="text-base font-semibold text-foreground">
            En resumen: el mercado laboral en Chile
          </h2>
          {resumen.map((texto) => (
            <p key={texto}>{texto}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
