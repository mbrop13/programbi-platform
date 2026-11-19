"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Plus,
  Share2,
  X,
} from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const ComparadorChart = dynamic(
  () => import("@/components/datos/ComparadorChart").then((m) => m.ComparadorChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[320px] w-full rounded-lg" />,
  }
);
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trackEvent, trackEventOnce } from "@/lib/analytics/marketing";
import {
  TIPO_ETIQUETAS,
  TIPO_ORDEN,
  type TipoIesKey,
} from "@/lib/datos/carreras-tipos";
import {
  normalizarTexto,
  pesos,
  porcentaje,
  semestres,
} from "@/lib/datos/formato";
import { SINONIMOS_CARRERAS } from "@/lib/datos/carreras-sinonimos";

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

const COLORES = ["#1890ff", "#f99c00", "#171716"] as const;
const COLORES_TEXTO = ["#1063b8", "#9a5200", "#171716"] as const;

function primerTipoDisponible(c: ComparadorCarreraItem, preferido?: string | null): TipoIesKey {
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
    const ratio = (Math.max(ingA, ingB) / Math.min(ingA, ingB));
    if (ratio >= 1.05) {
      partes.push(
        `${mayor.carrera.nombre} (${TIPO_ETIQUETAS[mayor.tipo].corto}) gana ${ratio.toFixed(1).replace(".", ",")} veces lo que ${menor.carrera.nombre} (${TIPO_ETIQUETAS[menor.tipo].corto}) al 4.º año`
      );
    } else {
      partes.push(
        `${a.carrera.nombre} y ${b.carrera.nombre} registran ingresos promedio muy similares al 4.º año (${pesos(ingA)} vs ${pesos(ingB)})`
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
        `${mayorEmp.carrera.nombre} tiene ${Math.abs(pp).toFixed(1).replace(".", ",")} pp. más de empleabilidad al 1.er año`
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
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // SSR-safe initial state: always matches prerendered HTML; URL params are applied in useEffect.
  const [seleccion, setSeleccion] = React.useState<Seleccion[]>(defaults);
  const [busqueda, setBusqueda] = React.useState("");
  const [selectorAbierto, setSelectorAbierto] = React.useState(false);
  const [copiado, setCopiado] = React.useState(false);

  React.useEffect(() => {
    const cParam = searchParams.get("c");
    const tParam = searchParams.get("t");
    if (!cParam) return;
    const slugs = cParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3);
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
  }, [searchParams, mapaCarreras]);

  React.useEffect(() => {
    trackEventOnce("datos_view_comparar", "datos_view", { pagina: "comparar" });
  }, []);

  const sincronizarUrl = React.useCallback(
    (next: Seleccion[]) => {
      const c = next.map((s) => s.slug).join(",");
      const t = next.map((s) => s.tipo).join(",");
      router.replace(`/datos/carreras/comparar?c=${encodeURIComponent(c)}&t=${encodeURIComponent(t)}`, {
        scroll: false,
      });
      if (next.length >= 2) {
        trackEvent("datos_compare", {
          slugs: c,
          tipos: t,
          cantidad: next.length,
        });
      }
    },
    [router]
  );

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
        const data = carrera.tipos[s.tipo] ?? carrera.tipos[primerTipoDisponible(carrera)];
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
    return `/datos/carreras/compartir/${a.carrera.slug}/${b.carrera.slug}?ta=${a.tipo}&tb=${b.tipo}&formato=1080x1350&v=${encodeURIComponent(edicion)}`;
  }, [itemsActivos, edicion]);

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      trackEvent("datos_share", {
        formato: "link",
        slugs: itemsActivos.map((i) => i.carrera.slug).join(","),
      });
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleShareNative = async () => {
    const url = window.location.href;
    const titulo = itemsActivos.map((i) => i.carrera.nombre).join(" vs ");
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Comparación: ${titulo} | ProgramBI`,
          text: fraseComparacion ?? `Compara ${titulo} con datos oficiales de mifuturo.cl`,
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
      recurso: `comparar-${itemsActivos.slice(0, 2).map((i) => i.carrera.slug).join("-vs-")}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Selector de carreras (hasta 3) */}
      <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#171716]">
              Elige hasta 3 carreras para comparar
            </h2>
            <p className="text-xs text-[#5c5c58]">
              Puedes cambiar el tipo de institución (U, IP o CFT) en cada tarjeta.
            </p>
          </div>
          {seleccion.length < 3 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectorAbierto((v) => !v)}
              className="border-[#1063b8] text-[#1063b8] hover:bg-[#e9f4ff]"
            >
              <Plus className="mr-1.5 size-4" />
              Agregar carrera ({seleccion.length}/3)
            </Button>
          ) : null}
        </div>

        {/* Chips de carreras seleccionadas */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {itemsActivos.map((item) => {
            const tiposDisponibles = TIPO_ORDEN.filter((k) => Boolean(item.carrera.tipos[k]));
            return (
              <div
                key={item.carrera.slug}
                className="flex flex-col justify-between gap-3 rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-3.5"
                style={{ borderTopWidth: 4, borderTopColor: item.color }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/datos/carreras/${item.carrera.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-[#171716] hover:text-[#1890ff] hover:underline"
                    >
                      <span className="truncate">{item.carrera.nombre}</span>
                      <ArrowUpRight className="size-3.5 shrink-0" />
                    </Link>
                    <p className="text-xs text-[#5c5c58]">{item.carrera.area}</p>
                  </div>
                  {seleccion.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => quitarCarrera(item.carrera.slug)}
                      aria-label={`Quitar ${item.carrera.nombre}`}
                      className="rounded p-1 text-[#5c5c58] hover:bg-white hover:text-[#171716]"
                    >
                      <X className="size-4" />
                    </button>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#5c5c58]">Tipo:</span>
                  {tiposDisponibles.length > 1 ? (
                    <Select
                      value={item.tipo}
                      onValueChange={(val) => cambiarTipo(item.carrera.slug, val as TipoIesKey)}
                    >
                      <SelectTrigger
                        aria-label={`Tipo de institución para ${item.carrera.nombre}`}
                        className="h-8 w-[140px] bg-white text-xs"
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
                    <Badge variant="secondary" className="bg-white text-xs text-[#171716]">
                      {TIPO_ETIQUETAS[item.tipo].singular}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Buscador Command */}
        {selectorAbierto && seleccion.length < 3 ? (
          <div className="mt-4 rounded-xl border border-[#e2e2dc] bg-white p-2 shadow-sm">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Buscar carrera o sinónimo (ej. enfermería, informática, tens)..."
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
                        <span className="font-medium text-[#171716]">{c.nombre}</span>
                        <span className="ml-2 text-xs text-[#5c5c58]">{c.area}</span>
                      </div>
                      <span className="text-xs text-[#1890ff]">Agregar</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        ) : null}
      </div>

      {/* Frase comparativa automática */}
      {fraseComparacion ? (
        <div className="rounded-xl border border-[#d6e6f5] bg-[#e9f4ff]/50 px-5 py-4 text-sm font-medium text-[#171716]">
          {fraseComparacion}
        </div>
      ) : null}

      {/* KPIs lado a lado */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {itemsActivos.map((item) => (
          <div
            key={`${item.carrera.slug}-${item.tipo}-kpi`}
            className="rounded-xl border border-[#e2e2dc] bg-white p-5 shadow-2xs"
            style={{ borderTopWidth: 4, borderTopColor: item.color }}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-[#171716]">{item.carrera.nombre}</h3>
              <Badge variant="outline" className="text-xs">
                {TIPO_ETIQUETAS[item.tipo].corto}
              </Badge>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold tracking-wide text-[#5c5c58] uppercase">
                Ingreso bruto 4.º año
              </p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight tabular-nums" style={{ color: item.colorTexto }}>
                {pesos(item.data.ing[3] ?? null)}
              </p>
              <p className="mt-0.5 text-xs text-[#5c5c58]">Pesos de {pesosDe}</p>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-[#f0f0ec] pt-4 text-xs">
              <div>
                <dt className="text-[#5c5c58]">Ingreso 1.er año</dt>
                <dd className="mt-0.5 font-bold text-[#171716] tabular-nums">
                  {pesos(item.data.ing[0] ?? null)}
                </dd>
              </div>
              <div>
                <dt className="text-[#5c5c58]">Empleabilidad 1.er año</dt>
                <dd className="mt-0.5 font-bold text-[#171716] tabular-nums">
                  {porcentaje(item.data.emp1)}
                </dd>
              </div>
              <div>
                <dt className="text-[#5c5c58]">Duración real</dt>
                <dd className="mt-0.5 font-bold text-[#171716] tabular-nums">
                  {semestres(item.data.dur_real)}
                </dd>
              </div>
              <div>
                <dt className="text-[#5c5c58]">Arancel anual mediano</dt>
                <dd className="mt-0.5 font-bold text-[#171716] tabular-nums">
                  {pesos(item.data.arancel_med)}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {/* Gráfico de trayectoria 1.º -> 5.º año */}
      <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 shadow-2xs sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#171716]">
              Trayectoria de ingreso bruto mensual (1.º al 5.º año)
            </h3>
            <p className="text-xs text-[#5c5c58]">
              Valores oficiales en pesos de {pesosDe} (mifuturo.cl).
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            {itemsActivos.map((item) => (
              <span key={item.carrera.slug} className="inline-flex items-center gap-1.5 font-medium text-[#171716]">
                <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.carrera.nombre} ({TIPO_ETIQUETAS[item.tipo].corto})
              </span>
            ))}
          </div>
        </div>

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
      </div>

      {/* Acciones de compartir y descargar tarjeta */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e2e2dc] bg-white p-4 shadow-2xs">
        <div className="text-xs text-[#5c5c58]">
          Comparte esta comparación o descarga la tarjeta oficial en PNG.
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleCopyLink}>
            {copiado ? <Check className="mr-1.5 size-4 text-emerald-600" /> : <Copy className="mr-1.5 size-4" />}
            {copiado ? "Enlace copiado" : "Copiar enlace"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleShareNative}>
            <Share2 className="mr-1.5 size-4" />
            Compartir
          </Button>
          {shareImageUrl ? (
            <a
              href={shareImageUrl}
              download={`comparacion-${itemsActivos[0].carrera.slug}-vs-${itemsActivos[1].carrera.slug}.png`}
              onClick={handleDownloadPng}
              className={buttonVariants({ size: "sm", className: "bg-[#1063b8] text-white hover:bg-[#0d549c]" })}
            >
              <Download className="mr-1.5 size-4" />
              Descargar imagen PNG
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
