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
import { DatosEstructurados, Fuente, MiniSerie } from "@/components/datos/ElementosDatos";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { datosTerritorio, RANKING } from "@/lib/datos/desempleo";
import { cifra, periodo, puntos } from "@/lib/datos/desempleo-formato";
import { getMetaCarreras, getRankingCarreras } from "@/lib/datos/carreras";
import { entero, mesLargo, pesos, porcentaje, variacionPorcentual } from "@/lib/datos/formato";
import { getIpcSeries, getUltimoIpc, variacionIpc } from "@/lib/datos/ipc";
import { NACIONAL, RUTA_DESEMPLEO } from "@/lib/datos/regiones";
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

export default function DatosPage() {
  const nacional = datosTerritorio(NACIONAL);
  if (!nacional) notFound();
  const { actual, serie, indicadores } = nacional;
  const resumen = resumenTerritorio("Chile", actual, indicadores, 0, RANKING.length);
  const carrerasMeta = getMetaCarreras();
  const medicina = getRankingCarreras().find(
    (item) => item.slug === "medicina" && item.tipo === "u"
  );
  const ipcSerie = getIpcSeries();
  const ultimoIpc = getUltimoIpc();
  const varIpcSep = variacionIpc("2025-09", ultimoIpc.m, ipcSerie);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:py-10">
      <DatosEstructurados
        nodos={[breadcrumbs(MIGAS_DATOS), dataset(NACIONAL, "Chile", descripcion, serie)]}
      />

      <div className="space-y-4">
        <MigasDatos migas={MIGAS_DATOS} />

        <header className="max-w-3xl space-y-3">
          <Badge
            variant="secondary"
            className="h-auto gap-1.5 rounded-md border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
          >
            <Activity className="size-3.5 text-blue-600" aria-hidden="true" />
            Datos abiertos de ProgramBI
          </Badge>
          <h1 className="h1-datos text-foreground">Datos de Chile, explicados en simple</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Explora cifras oficiales sobre carreras, inflación, desempleo y capacitación. Todo
            gratis, sin registro y listo para comparar o descargar.
          </p>
        </header>
      </div>

      {/* 3 Observatorios principales en grid moderno */}
      <section aria-labelledby="hub-observatorios" className="space-y-4">
        <h2 id="hub-observatorios" className="sr-only">
          Observatorios principales
        </h2>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Carreras y empleabilidad */}
          <Card className="group gap-0 overflow-hidden rounded-xl border border-border bg-card py-0 shadow-xs ring-0 transition-all hover:border-slate-300 hover:shadow-sm">
            <div className="relative h-44 w-full overflow-hidden border-b border-border bg-slate-100">
              <img
                src="/images/datos/hero-carreras.jpg"
                alt="Campus universitario moderno en Chile"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent"
              />
              <div className="absolute top-3 left-4 right-4 flex items-center justify-between gap-2">
                <Badge
                  variant="secondary"
                  className="h-auto rounded-md border border-white/25 bg-white/95 px-2.5 py-0.5 text-xs font-medium text-blue-800 backdrop-blur-xs"
                >
                  Mi Futuro · Edición {carrerasMeta.edicion}
                </Badge>
                <div className="flex size-7 items-center justify-center rounded-lg border border-white/25 bg-white/90 text-slate-700 backdrop-blur-xs">
                  <GraduationCap className="size-4" aria-hidden="true" />
                </div>
              </div>
            </div>
            <CardContent className="flex flex-1 flex-col justify-between gap-5 p-6">
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    Carreras, sueldos y empleabilidad
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {carrerasMeta.conteos.genericas_unicas} carreras y{" "}
                    {entero(carrerasMeta.conteos.filas_C)} programas 2026 en universidades, IP y
                    CFT.
                  </p>
                </div>

                {medicina && medicina.ing4 !== null ? (
                  <div className="rounded-lg border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground">
                    Ejemplo: <strong className="font-semibold text-foreground">Medicina (U)</strong>{" "}
                    promedia{" "}
                    <strong className="font-semibold text-foreground">
                      {pesos(medicina.ing4)}
                    </strong>{" "}
                    al 4.º año y{" "}
                    <strong className="font-semibold text-foreground">
                      {porcentaje(medicina.emp1)}
                    </strong>{" "}
                    de empleabilidad al 1.er año.
                  </div>
                ) : null}
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

          {/* Inflación e IPC */}
          <Card className="group gap-0 overflow-hidden rounded-xl border border-border bg-card py-0 shadow-xs ring-0 transition-all hover:border-slate-300 hover:shadow-sm">
            <div className="relative h-44 w-full overflow-hidden border-b border-border bg-slate-100">
              <img
                src="/images/datos/hero-inflacion.jpg"
                alt="Distrito financiero de Santiago de Chile"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent"
              />
              <div className="absolute top-3 left-4 right-4 flex items-center justify-between gap-2">
                <Badge
                  variant="secondary"
                  className="h-auto rounded-md border border-white/25 bg-white/95 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-xs"
                >
                  INE · {mesLargo(ultimoIpc.m)}
                </Badge>
                <div className="flex size-7 items-center justify-center rounded-lg border border-white/25 bg-white/90 text-slate-700 backdrop-blur-xs">
                  <Percent className="size-4" aria-hidden="true" />
                </div>
              </div>
            </div>
            <CardContent className="flex flex-1 flex-col justify-between gap-5 p-6">
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    Calculadora de inflación (IPC)
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Actualiza sueldos, arriendos o aranceles a pesos de hoy y comprueba si tus
                    ingresos le ganaron al costo de la vida.
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
                    <span className="text-muted-foreground">Var. sep-2025 → hoy</span>
                    <p className="mt-0.5 text-base font-bold text-blue-700 tabular-nums">
                      {varIpcSep !== null ? variacionPorcentual(varIpcSep) : "—"}
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
        </div>

        {/* Observatorio de Desempleo destacado */}
        <Card
          aria-labelledby="hub-desempleo"
          className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0"
        >
          <CardContent className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="h-auto rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {periodo(actual.p)} · INE
                </Badge>
                {indicadores.yoy_pp !== null ? (
                  <span
                    data-yoy-hero={indicadores.yoy_pp}
                    className="text-xs font-medium text-muted-foreground tabular-nums"
                  >
                    {puntos(indicadores.yoy_pp)} en 12 meses
                  </span>
                ) : null}
              </div>

              <div>
                <h2 id="hub-desempleo" className="text-xl font-semibold text-foreground">
                  Observatorio de Desempleo en Chile
                </h2>
                <p
                  className="mt-2 text-4xl font-bold tracking-tight text-foreground tabular-nums sm:text-5xl"
                  data-tasa-hero={actual.tasa}
                >
                  {cifra(actual.tasa)}
                  <span className="ml-1 text-2xl font-semibold text-blue-700">%</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tasa de desocupación nacional con evolución desde 2010 y mapa de las 16 regiones.
                </p>
              </div>

              <Fuente edicion />

              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href={RUTA_DESEMPLEO}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-9 gap-1.5 rounded-lg bg-card px-4 text-xs font-medium"
                  )}
                >
                  Explorar desempleo en Chile
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href={`${RUTA_DESEMPLEO}/jovenes`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "h-9 text-xs font-medium text-muted-foreground hover:text-foreground"
                  )}
                >
                  Empleo juvenil
                </Link>
                <Link
                  href="/datos/capacitacion"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "h-9 text-xs font-medium text-muted-foreground hover:text-foreground"
                  )}
                >
                  Capacitación SENCE
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <MiniSerie serie={serie} variante="hub" />
            </div>
          </CardContent>
        </Card>
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
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-blue-700">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-700">
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

      {/* En resumen del panorama laboral */}
      <Card
        aria-labelledby="hub-resumen"
        className="prose-datos gap-2 rounded-xl border border-border bg-card py-6 shadow-xs ring-0"
      >
        <CardContent className="space-y-2.5 px-6 text-sm leading-relaxed text-foreground/85">
          <h2 id="hub-resumen" className="text-base font-semibold text-foreground">
            Resumen del mercado laboral en Chile
          </h2>
          {resumen.map((texto) => (
            <p key={texto}>{texto}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
