"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Plus,
  Share2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { trackEvent, trackEventOnce } from "@/lib/analytics/marketing";
import {
  TIPO_ETIQUETAS,
  TIPO_ORDEN,
  type TipoIesKey,
} from "@/lib/datos/carreras-tipos";
import {
  anosDesdeSemestres,
  normalizarTexto,
  pesos,
  porcentaje,
  semestres,
} from "@/lib/datos/formato";
import { SINONIMOS_CARRERAS } from "@/lib/datos/carreras-sinonimos";
import { cn } from "@/lib/utils";

const ComparadorChart = dynamic(
  () => import("@/components/datos/ComparadorChart").then((m) => m.ComparadorChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[320px] w-full rounded-lg" />,
  }
);

export interface ComparadorTipoInfo {
  ing: (number | null)[];
  emp1: number | null;
  emp2: number | null;
  dur_formal: number | null;
  dur_real: number | null;
  arancel_med: number | null;
  costo_tit_med: number | null;
}

export interface ComparadorCarreraItem {
  slug: string;
  nombre: string;
  area: string;
  tipos: Partial<Record<TipoIesKey, ComparadorTipoInfo>>;
}

interface Seleccion {
  slug: string;
  tipo: TipoIesKey;
}

const COLORES = ["#2563eb", "#d97706", "#0f172a"] as const;
const COLORES_TEXTO = ["#1d4ed8", "#b45309", "#0f172a"] as const;

function primerTipoDisponible(
  c: ComparadorCarreraItem,
  preferido?: string | null
): TipoIesKey {
  if (preferido === "u" || preferido === "ip" || preferido === "cft") {
    if (c.tipos[preferido]) return preferido;
  }
  for (const k of TIPO_ORDEN) {
    const t = c.tipos[k];
    if (t && t.ing[3] !== null) return k;
  }
  for (const k of TIPO_ORDEN) {
    if (c.tipos[k]) return k;
  }
  return "u";
}

function generarFraseComparacion(
  a: { carrera: ComparadorCarreraItem; tipo: TipoIesKey; data: ComparadorTipoInfo },
  b: { carrera: ComparadorCarreraItem; tipo: TipoIesKey; data: ComparadorTipoInfo }
): string | null {
  const ingA = a.data.ing[3] ?? null;
  const ingB = b.data.ing[3] ?? null;
  const durA = a.data.dur_real ?? a.data.dur_formal ?? null;
  const durB = b.data.dur_real ?? b.data.dur_formal ?? null;

  const partes: string[] = [];

  if (ingA && ingB && ingA > 0 && ingB > 0) {
    const mayor = ingA >= ingB ? a : b;
    const menor = ingA >= ingB ? b : a;
    const ratio = Math.max(ingA, ingB) / Math.min(ingA, ingB);
    if (ratio >= 1.05) {
      partes.push(
        `${mayor.carrera.nombre} (${TIPO_ETIQUETAS[mayor.tipo].corto}) gana ${ratio
          .toFixed(1)
          .replace(".", ",")} veces lo que ${menor.carrera.nombre} (${
          TIPO_ETIQUETAS[menor.tipo].corto
        }) al 4.º año`
      );
    } else {
      partes.push(
        `${a.carrera.nombre} y ${b.carrera.nombre} registran ingresos promedio muy similares al 4.º año (${pesos(
          ingA
        )} vs ${pesos(ingB)})`
      );
    }
  }

  if (durA !== null && durB !== null) {
    const diff = Math.round((durA - durB) * 10) / 10;
    if (Math.abs(diff) >= 0.5) {
      const masLarga = diff > 0 ? a : b;
      partes.push(`dura ${semestres(Math.abs(diff))} más (${masLarga.carrera.nombre})`);
    } else {
      partes.push("tienen una duración real similar");
    }
  }

  if (a.data.emp1 !== null && b.data.emp1 !== null) {
    const pp = Math.round((a.data.emp1 - b.data.emp1) * 1000) / 10;
    if (Math.abs(pp) >= 2) {
      const mayorEmp = pp > 0 ? a : b;
      partes.push(
        `${mayorEmp.carrera.nombre} tiene ${Math.abs(pp)
          .toFixed(1)
          .replace(".", ",")} pp. más de empleabilidad al 1.er año`
      );
    }
  }

  if (partes.length === 0) return null;
  return `${partes.join("; ")}.`;
}

export function Comparador({
  carreras,
  edicion,
  pesosDe,
}: {
  carreras: ComparadorCarreraItem[];
  edicion: string;
  pesosDe: string;
}) {
  const mapaCarreras = React.useMemo(
    () => new Map(carreras.map((c) => [c.slug, c])),
    [carreras]
  );

  const defaults = React.useMemo<Seleccion[]>(() => {
    const base: Seleccion[] = [];
    for (const slug of ["ingenieria-comercial", "ingenieria-civil-industrial"]) {
      const car = mapaCarreras.get(slug);
      if (car) base.push({ slug, tipo: primerTipoDisponible(car) });
    }
    if (base.length === 0 && carreras.length >= 2) {
      base.push(
        { slug: carreras[0].slug, tipo: primerTipoDisponible(carreras[0]) },
        { slug: carreras[1].slug, tipo: primerTipoDisponible(carreras[1]) }
      );
    }
    return base;
  }, [mapaCarreras, carreras]);

  const [seleccion, setSeleccion] = React.useState<Seleccion[]>(defaults);
  const [busqueda, setBusqueda] = React.useState("");
  const [selectorAbierto, setSelectorAbierto] = React.useState(false);
  const [copiado, setCopiado] = React.useState(false);
  const chartRef = React.useRef<HTMLDivElement>(null);
  const [mostrarGrafico, setMostrarGrafico] = React.useState(false);

  React.useEffect(() => {
    const elemento = chartRef.current;
    if (!elemento) return;
    if (!("IntersectionObserver" in window)) {
      setMostrarGrafico(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMostrarGrafico(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const aplicarUrl = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const cParam = searchParams.get("c");
      const tParam = searchParams.get("t");
      if (!cParam) {
        setSeleccion(defaults);
        return;
      }
      const slugs = cParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
      const tipos = tParam ? tParam.split(",").map((s) => s.trim()) : [];
      const res: Seleccion[] = [];
      slugs.forEach((slug, idx) => {
        const car = mapaCarreras.get(slug);
        if (car && !res.some((r) => r.slug === slug)) {
          res.push({ slug, tipo: primerTipoDisponible(car, tipos[idx]) });
        }
      });
      if (res.length > 0) {
        setSeleccion(res);
      }
    };
    aplicarUrl();
    window.addEventListener("popstate", aplicarUrl);
    return () => window.removeEventListener("popstate", aplicarUrl);
  }, [defaults, mapaCarreras]);

  React.useEffect(() => {
    trackEventOnce("datos_view_comparar", "datos_view", { pagina: "comparar" });
  }, []);

  const sincronizarUrl = React.useCallback((next: Seleccion[]) => {
    const c = next.map((s) => s.slug).join(",");
    const t = next.map((s) => s.tipo).join(",");
    window.history.replaceState(
      null,
      "",
      `/datos/carreras/comparar?c=${encodeURIComponent(c)}&t=${encodeURIComponent(t)}`
    );
    if (next.length >= 2) {
      trackEvent("datos_compare", {
        slugs: c,
        tipos: t,
        cantidad: next.length,
      });
    }
  }, []);

  const agregarCarrera = (slug: string) => {
    if (seleccion.length >= 3 || seleccion.some((s) => s.slug === slug)) return;
    const car = mapaCarreras.get(slug);
    if (!car) return;
    const next = [...seleccion, { slug, tipo: primerTipoDisponible(car) }];
    setSeleccion(next);
    setSelectorAbierto(false);
    setBusqueda("");
    sincronizarUrl(next);
  };

  const quitarCarrera = (slug: string) => {
    if (seleccion.length <= 1) return;
    const next = seleccion.filter((s) => s.slug !== slug);
    setSeleccion(next);
    sincronizarUrl(next);
  };

  const cambiarTipo = (slug: string, tipo: TipoIesKey) => {
    const next = seleccion.map((s) => (s.slug === slug ? { ...s, tipo } : s));
    setSeleccion(next);
    sincronizarUrl(next);
  };

  const itemsActivos = React.useMemo(() => {
    return seleccion
      .map((s, idx) => {
        const carrera = mapaCarreras.get(s.slug);
        if (!carrera) return null;
        const data =
          carrera.tipos[s.tipo] ?? carrera.tipos[primerTipoDisponible(carrera)];
        if (!data) return null;
        return {
          carrera,
          tipo: s.tipo,
          data,
          color: COLORES[idx] ?? COLORES[0],
          colorTexto: COLORES_TEXTO[idx] ?? COLORES_TEXTO[0],
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [seleccion, mapaCarreras]);

  const resultadosBusqueda = React.useMemo(() => {
    const q = normalizarTexto(busqueda);
    const yaElegidas = new Set(seleccion.map((s) => s.slug));
    const filtradas = carreras.filter((c) => {
      if (yaElegidas.has(c.slug)) return false;
      if (!q) return true;
      if (normalizarTexto(c.nombre).includes(q)) return true;
      const syns = SINONIMOS_CARRERAS[c.slug] ?? [];
      return syns.some((syn) => normalizarTexto(syn).includes(q));
    });
    return filtradas.slice(0, 30);
  }, [busqueda, carreras, seleccion]);

  const chartData = React.useMemo(() => {
    const anios = ["1.er año", "2.º año", "3.er año", "4.º año", "5.º año"];
    return anios.map((etiqueta, idx) => {
      const punto: Record<string, string | number | null> = { anio: etiqueta };
      itemsActivos.forEach((item, cIdx) => {
        punto[`c${cIdx}`] = item.data.ing[idx] ?? null;
      });
      return punto;
    });
  }, [itemsActivos]);

  const chartConfig = React.useMemo<ChartConfig>(() => {
    const cfg: ChartConfig = {};
    itemsActivos.forEach((item, idx) => {
      cfg[`c${idx}`] = {
        label: `${item.carrera.nombre} (${TIPO_ETIQUETAS[item.tipo].corto})`,
        color: item.color,
      };
    });
    return cfg;
  }, [itemsActivos]);

  const fraseComparacion = React.useMemo(() => {
    if (itemsActivos.length < 2) return null;
    return generarFraseComparacion(itemsActivos[0], itemsActivos[1]);
  }, [itemsActivos]);

  const shareImageUrl = React.useMemo(() => {
    if (itemsActivos.length < 2) return null;
    const a = itemsActivos[0];
    const b = itemsActivos[1];
    return `/datos/carreras/compartir/${a.carrera.slug}/${b.carrera.slug}?ta=${a.tipo}&tb=${b.tipo}&formato=1080x1350&v=${encodeURIComponent(
      edicion
    )}`;
  }, [itemsActivos, edicion]);

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      toast.success("Enlace de comparación copiado");
      trackEvent("datos_share", {
        formato: "link",
        slugs: itemsActivos.map((i) => i.carrera.slug).join(","),
      });
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const handleShareNative = async () => {
    const url = window.location.href;
    const titulo = itemsActivos.map((i) => i.carrera.nombre).join(" vs ");
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Comparación: ${titulo} | ProgramBI`,
          text:
            fraseComparacion ??
            `Compara ${titulo} con datos oficiales de mifuturo.cl`,
          url,
        });
        trackEvent("datos_share", {
          formato: "native",
          slugs: itemsActivos.map((i) => i.carrera.slug).join(","),
        });
      } catch {
        // cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadPng = () => {
    if (!shareImageUrl) return;
    trackEvent("datos_download", {
      formato: "png",
      recurso: `comparar-${itemsActivos
        .slice(0, 2)
        .map((i) => i.carrera.slug)
        .join("-vs-")}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Selector de carreras */}
      <Card className="gap-4 rounded-xl border border-border bg-card py-5 shadow-xs ring-0">
        <CardHeader className="flex flex-col gap-3 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Elige hasta 3 carreras para comparar
            </CardTitle>
            <CardDescription className="text-xs">
              Puedes cambiar el tipo de institución (U, IP o CFT) por separado en cada carrera.
            </CardDescription>
          </div>
          {seleccion.length < 3 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectorAbierto((v) => !v)}
              className="h-9 gap-1.5 bg-card text-xs font-medium"
            >
              <Plus className="size-3.5 text-blue-700" aria-hidden="true" />
              Agregar carrera ({seleccion.length}/3)
            </Button>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-4 px-5 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {itemsActivos.map((item) => {
              const tiposDisponibles = TIPO_ORDEN.filter((k) =>
                Boolean(item.carrera.tipos[k])
              );
              return (
                <div
                  key={item.carrera.slug}
                  className="flex flex-col justify-between gap-3 rounded-lg border border-border bg-muted/35 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <Link
                          href={`/datos/carreras/${item.carrera.slug}`}
                          className="inline-flex min-w-0 items-center gap-1 text-sm font-semibold text-foreground hover:text-blue-700 hover:underline"
                        >
                          <span className="truncate">{item.carrera.nombre}</span>
                          <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
                        </Link>
                      </div>
                      <p className="mt-0.5 pl-4.5 text-xs text-muted-foreground">
                        {item.carrera.area}
                      </p>
                    </div>
                    {seleccion.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => quitarCarrera(item.carrera.slug)}
                        aria-label={`Quitar ${item.carrera.nombre}`}
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Institución:</span>
                    {tiposDisponibles.length > 1 ? (
                      <Select
                        value={item.tipo}
                        onValueChange={(val) =>
                          cambiarTipo(item.carrera.slug, val as TipoIesKey)
                        }
                      >
                        <SelectTrigger
                          aria-label={`Tipo de institución para ${item.carrera.nombre}`}
                          className="h-8 w-[150px] bg-card text-xs"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposDisponibles.map((k) => (
                            <SelectItem key={k} value={k} className="text-xs">
                              {TIPO_ETIQUETAS[k].singular} ({TIPO_ETIQUETAS[k].corto})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary" className="bg-card text-xs font-medium">
                        {TIPO_ETIQUETAS[item.tipo].singular}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectorAbierto && seleccion.length < 3 ? (
            <div className="rounded-xl border border-border bg-card p-1.5 shadow-md">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Buscar carrera o apodo (ej. enfermería, informática, tens)..."
                  value={busqueda}
                  onValueChange={setBusqueda}
                />
                <CommandList>
                  <CommandEmpty>No se encontraron carreras con ese nombre.</CommandEmpty>
                  <CommandGroup heading="Carreras oficiales">
                    {resultadosBusqueda.map((c) => (
                      <CommandItem
                        key={c.slug}
                        value={c.slug}
                        onSelect={() => agregarCarrera(c.slug)}
                        className="flex cursor-pointer items-center justify-between"
                      >
                        <div>
                          <span className="font-medium text-foreground">{c.nombre}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{c.area}</span>
                        </div>
                        <span className="text-xs font-medium text-blue-700">Agregar</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Frase resumen clara */}
      {fraseComparacion ? (
        <div className="rounded-xl border border-blue-200/80 bg-blue-50/60 px-5 py-3.5 text-sm font-medium text-foreground">
          {fraseComparacion}
        </div>
      ) : null}

      {/* KPIs lado a lado */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {itemsActivos.map((item) => (
          <Card
            key={`${item.carrera.slug}-${item.tipo}-kpi`}
            className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <h3 className="text-base font-semibold text-foreground">
                    {item.carrera.nombre}
                  </h3>
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  {TIPO_ETIQUETAS[item.tipo].corto}
                </Badge>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground">Sueldo bruto 4.º año</p>
                <p
                  className="mt-1 text-3xl font-bold tracking-tight tabular-nums"
                  style={{ color: item.colorTexto }}
                >
                  {pesos(item.data.ing[3] ?? null)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">Pesos de {pesosDe}</p>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border/70 pt-4 text-xs">
                <div>
                  <dt className="text-muted-foreground">Sueldo 1.er año</dt>
                  <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
                    {pesos(item.data.ing[0] ?? null)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Empleabilidad 1.er año</dt>
                  <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
                    {porcentaje(item.data.emp1)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Duración real</dt>
                  <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
                    {item.data.dur_real !== null
                      ? anosDesdeSemestres(item.data.dur_real)
                      : "Sin dato"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Arancel anual 2026</dt>
                  <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
                    {pesos(item.data.arancel_med)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de trayectoria */}
      <Card className="gap-4 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
        <CardHeader className="flex flex-col gap-3 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Evolución de sueldo del 1.º al 5.º año
            </CardTitle>
            <CardDescription className="text-xs">
              Valores oficiales en pesos de {pesosDe} (mifuturo.cl).
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            {itemsActivos.map((item) => (
              <span
                key={item.carrera.slug}
                className="inline-flex items-center gap-1.5 font-medium text-foreground"
              >
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.carrera.nombre} ({TIPO_ETIQUETAS[item.tipo].corto})
              </span>
            ))}
          </div>
        </CardHeader>

        <CardContent className="px-6">
          <div ref={chartRef}>
            {mostrarGrafico ? (
              <ComparadorChart
                chartConfig={chartConfig}
                chartData={chartData}
                items={itemsActivos.map((item) => ({
                  slug: item.carrera.slug,
                  nombre: item.carrera.nombre,
                  tipo: item.tipo,
                  color: item.color,
                }))}
              />
            ) : (
              <Skeleton className="h-[320px] w-full rounded-lg" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Acciones de compartir y descargar tarjeta */}
      <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5">
          <div className="text-xs text-muted-foreground">
            Comparte esta comparación o descarga la tarjeta oficial en PNG.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-8 gap-1.5 bg-card text-xs"
            >
              {copiado ? (
                <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
              ) : (
                <Copy className="size-3.5 text-muted-foreground" aria-hidden="true" />
              )}
              {copiado ? "Copiado" : "Copiar enlace"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShareNative}
              className="h-8 gap-1.5 bg-card text-xs"
            >
              <Share2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
              Compartir
            </Button>
            {shareImageUrl ? (
              <a
                href={shareImageUrl}
                download={`comparacion-${itemsActivos[0].carrera.slug}-vs-${itemsActivos[1].carrera.slug}.png`}
                onClick={handleDownloadPng}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "h-8 gap-1.5 rounded-lg px-3 text-xs font-medium"
                )}
              >
                <Download className="size-3.5" aria-hidden="true" />
                Descargar PNG
              </a>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
