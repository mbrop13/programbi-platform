"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MiniCalculadoraRetorno } from "@/components/datos/MiniCalculadoraRetorno";
import { Percentiles } from "@/components/datos/Percentiles";
import { PerfilEstudiantes } from "@/components/datos/PerfilEstudiantes";
import { TablaInstituciones } from "@/components/datos/TablaInstituciones";
import { RangeBar } from "@/components/datos/viz/RangeBar";
import { Sparkline } from "@/components/datos/viz/Sparkline";
import { StatTile } from "@/components/datos/viz/StatTile";
import { trackEventOnce } from "@/lib/analytics/marketing";
import {
  TIPO_ETIQUETAS,
  TIPO_ORDEN,
  type CarreraRecord,
  type InstitucionCarrera,
  type ProgramaCarrera,
  type TipoIesKey,
} from "@/lib/datos/carreras-tipos";
import {
  anosDesdeSemestres,
  entero,
  mesCorto,
  pesos,
  porcentaje,
  semestres,
  variacionPorcentual,
} from "@/lib/datos/formato";
import { ajustarPorIpc, getIpcSeries, getUltimoIpc } from "@/lib/datos/ipc";
import { cn } from "@/lib/utils";

const CurvaIngresos = dynamic(
  () => import("@/components/datos/CurvaIngresos").then((m) => m.CurvaIngresos),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[380px] w-full rounded-xl" />,
  }
);

const EvolucionYoY = dynamic(
  () => import("@/components/datos/EvolucionYoY").then((m) => m.EvolucionYoY),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[360px] w-full rounded-xl" />,
  }
);

const HistogramaAranceles = dynamic(
  () =>
    import("@/components/datos/HistogramaAranceles").then(
      (m) => m.HistogramaAranceles
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[380px] w-full rounded-xl" />,
  }
);

const MeAlcanza = dynamic(
  () => import("@/components/datos/MeAlcanza").then((m) => m.MeAlcanza),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[380px] w-full rounded-xl" />,
  }
);

const ANOS_ING = ["1.er", "2.º", "3.er", "4.º", "5.º"] as const;

const CHIPS_SALTO = [
  { href: "#sueldo", label: "Sueldo" },
  { href: "#empleabilidad", label: "Empleabilidad" },
  { href: "#donde-estudiar", label: "Dónde estudiar" },
  { href: "#arancel", label: "Arancel" },
  { href: "#faq-datos", label: "FAQ" },
] as const;

function GraficoEnVista({
  children,
  altura,
}: {
  children: ReactNode;
  altura: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof window.IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? children : <Skeleton className={`w-full rounded-xl ${altura}`} />}
    </div>
  );
}

interface FichaCarreraClientProps {
  carrera: CarreraRecord;
  tipoInicial: TipoIesKey;
  instituciones: InstitucionCarrera[];
  programas: ProgramaCarrera[];
  edicion: string;
}

export function FichaCarreraClient({
  carrera,
  tipoInicial,
  instituciones,
  programas,
  edicion,
}: FichaCarreraClientProps) {
  const tiposDisponibles = useMemo(
    () => TIPO_ORDEN.filter((k) => Boolean(carrera.tipos[k])),
    [carrera]
  );

  const [tipoActivo, setTipoActivo] = useState<TipoIesKey>(tipoInicial);
  const [modoPesos, setModoPesos] = useState<"sep2025" | "hoy">("sep2025");

  useEffect(() => {
    const syncFromUrl = () => {
      const tParam = new URLSearchParams(window.location.search).get("tipo");
      if (
        (tParam === "u" || tParam === "ip" || tParam === "cft") &&
        tiposDisponibles.includes(tParam)
      ) {
        setTipoActivo(tParam);
      }
    };
    const timer = window.setTimeout(syncFromUrl, 0);
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, [tiposDisponibles]);

  useEffect(() => {
    trackEventOnce(`datos_view_ficha_${carrera.slug}`, "datos_view", {
      seccion: "carreras",
      pagina: "ficha",
      slug: carrera.slug,
      edicion,
    });
  }, [carrera.slug, edicion]);

  const ipcSerie = getIpcSeries();
  const ultimoIpc = getUltimoIpc();
  const ajusteIpc = useMemo(
    () => ajustarPorIpc(1_000_000, "2025-09", ultimoIpc.m, ipcSerie),
    [ipcSerie, ultimoIpc.m]
  );

  const factorIpc = modoPesos === "hoy" && ajusteIpc ? ajusteIpc.factor : 1;
  const etiquetaPesos =
    modoPesos === "hoy" && ajusteIpc
      ? `pesos de ${mesCorto(ajusteIpc.mesHasta)} (IPC)`
      : "pesos de sep-2025";

  const data = carrera.tipos[tipoActivo] ?? carrera.tipos[tipoInicial];
  const oferta = data?.oferta ?? carrera.oferta;

  const institucionesTipo = useMemo(
    () => instituciones.filter((i) => i.tipo === tipoActivo),
    [instituciones, tipoActivo]
  );

  const programasTipo = useMemo(() => {
    const porTipo = programas.filter((p) => p.tipo === tipoActivo);
    return porTipo.length > 0 ? porTipo : programas;
  }, [programas, tipoActivo]);

  if (!data) return null;

  const esc = (v: number | null) => (v !== null ? Math.round(v * factorIpc) : null);

  const ing4 = esc(data.ing[3]);
  const ing1 = esc(data.ing[0]);
  const ing5 = esc(data.ing[4]);

  // Banda P10–P90 al 5.º año; si no hay percentiles publicados, rango honesto
  // de promedios 1.er→5.º año; si tampoco, se omite la banda.
  const p10 = esc(data.pct.p10_5);
  const p90 = esc(data.pct.p90_5);
  const p50 = esc(data.pct.p50_5);
  const bandaPct = p10 !== null && p90 !== null && p90 > p10;
  const bandaPromedios = !bandaPct && ing1 !== null && ing5 !== null && ing5 > ing1;

  const puntosIng = data.ing
    .map((v, i): { ano: string; valor: number | null } => ({
      ano: ANOS_ING[i] ?? `${i + 1}.º`,
      valor: esc(v),
    }))
    .filter((p): p is { ano: string; valor: number } => p.valor !== null);
  const sparkData = puntosIng.map((p) => p.valor);
  const sparkAria = `Sueldo bruto promedio por año de egreso: ${puntosIng
    .map((p) => `${p.ano} año ${pesos(p.valor)}`)
    .join(", ")}`;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Barra de controles: Tipo de institución + Toggle IPC */}
      <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4">
          {tiposDisponibles.length > 1 ? (
            <ToggleGroup
              type="single"
              value={tipoActivo}
              onValueChange={(v) => setTipoActivo((v || tipoActivo) as TipoIesKey)}
              aria-label="Tipo de institución"
              className="gap-1 rounded-lg bg-muted p-1"
            >
              {tiposDisponibles.map((t) => (
                <ToggleGroupItem
                  key={t}
                  value={t}
                  className={cn(
                    "h-8 rounded-md border-transparent px-3 text-xs font-medium shadow-none sm:text-sm",
                    tipoActivo === t
                      ? "border-transparent bg-card text-[#0b63c5] shadow-xs"
                      : "border-transparent bg-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground"
                  )}
                >
                  {TIPO_ETIQUETAS[t].plural}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          ) : (
            <Badge
              variant="secondary"
              className="h-auto rounded-md px-2.5 py-1 text-xs font-medium"
            >
              {TIPO_ETIQUETAS[tipoActivo].plural}
            </Badge>
          )}

          <div
            role="group"
            aria-label="Moneda de los ingresos"
            className="inline-flex items-center rounded-lg bg-muted p-0.5 text-xs"
          >
            <button
              type="button"
              onClick={() => setModoPesos("sep2025")}
              aria-pressed={modoPesos === "sep2025"}
              className={cn(
                "rounded-md px-3 py-1.5 font-medium transition-all",
                modoPesos === "sep2025"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Pesos sep-2025
            </button>
            <button
              type="button"
              onClick={() => setModoPesos("hoy")}
              aria-pressed={modoPesos === "hoy"}
              className={cn(
                "rounded-md px-3 py-1.5 font-medium transition-all",
                modoPesos === "hoy"
                  ? "bg-card text-[#0b63c5] shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Pesos de hoy (IPC)
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Héroe levels.fyi: el KPI de sueldo aparece UNA sola vez en la ficha.
          Cifra grande + banda P10–P90 + mini-curva; al lado (móvil debajo) grilla 2×2. */}
      <section
        id="sueldo"
        aria-label="Sueldo y principales indicadores"
        className="scroll-mt-24"
      >
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-stretch">
          <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
            <CardContent className="flex h-full flex-col gap-4 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Sueldo bruto mensual · 4.º año de titulación
                  </p>
                  <p className="mt-1.5 text-4xl font-bold tracking-tight text-foreground tabular-nums sm:text-[2.75rem] sm:leading-[1.05]">
                    {pesos(ing4)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{etiquetaPesos}</p>
                </div>
                {data.variacion.yoy_23_24 !== null ? (
                  <span
                    className={cn(
                      "shrink-0 rounded-md border px-2 py-1 text-[11px] font-medium tabular-nums",
                      data.variacion.yoy_23_24 >= 0
                        ? "border-[#0f7b4a]/25 bg-[#0f7b4a]/10 text-[#0f7b4a]"
                        : "border-[#c2410c]/25 bg-[#c2410c]/10 text-[#c2410c]"
                    )}
                  >
                    23→24: {variacionPorcentual(data.variacion.yoy_23_24)}
                  </span>
                ) : null}
              </div>

              {bandaPct ? (
                <div>
                  <RangeBar
                    min={p10}
                    max={p90}
                    mid={p50 ?? undefined}
                    format={pesos}
                    labels={["P10", "P90"]}
                  />
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    Dispersión al 5.º año: del 10 % que menos gana al 10 % que más.
                  </p>
                </div>
              ) : bandaPromedios ? (
                <div>
                  <RangeBar
                    min={ing1}
                    max={ing5}
                    format={pesos}
                    labels={["1.er año", "5.º año"]}
                  />
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    Sin percentiles publicados: rango de promedios del 1.er al 5.º año.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Sin percentiles publicados para este tipo de institución.
                </p>
              )}

              {sparkData.length >= 2 ? (
                <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Sueldo promedio por año de egreso
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                      1.er año {pesos(ing1)} → 5.º año {pesos(ing5)}
                    </p>
                  </div>
                  <Sparkline
                    data={sparkData}
                    width={132}
                    height={36}
                    lastDot
                    ariaLabel={sparkAria}
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Grilla 2×2 compacta (en móvil queda debajo de la tarjeta de sueldo) */}
          <div className="grid grid-cols-2 gap-3">
            <StatTile
              label="Empleabilidad 1.er año"
              value={porcentaje(data.emp1)}
              sub={
                data.emp2 !== null
                  ? `2.º año: ${porcentaje(data.emp2)}`
                  : "Ingresos ≥ sueldo mínimo"
              }
            />
            <StatTile
              label="Duración real promedio"
              value={data.dur_real !== null ? anosDesdeSemestres(data.dur_real) : "s/i"}
              sub={
                data.dur_formal !== null
                  ? `Formal: ${semestres(data.dur_formal)}`
                  : semestres(data.dur_real)
              }
            />
            <StatTile
              label="Arancel anual mediano 2026"
              value={pesos(oferta?.arancel?.med ?? null)}
              sub={
                oferta
                  ? `${entero(oferta.programas)} programas · ${entero(oferta.instituciones)} inst.`
                  : "Sin oferta 2026 publicada"
              }
            />
            <StatTile
              label="Retención 1.er año"
              value={porcentaje(data.retencion.r1)}
              sub={
                data.retencion.r2 !== null
                  ? `2.º año: ${porcentaje(data.retencion.r2)}`
                  : "Permanencia en la carrera"
              }
            />
          </div>
        </div>
      </section>

      {/* Chips de salto a las secciones de la ficha */}
      <nav
        aria-label="Secciones de la ficha"
        className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0"
      >
        <ul className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap">
          {CHIPS_SALTO.map((chip) => (
            <li key={chip.href}>
              <a
                href={chip.href}
                className="inline-flex items-center whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-[#0b63c5]/50 hover:text-[#0b63c5]"
              >
                {chip.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Curva de ingresos + Percentiles */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <GraficoEnVista altura="h-[380px]">
          <CurvaIngresos
            ing={data.ing}
            factorIpc={factorIpc}
            etiquetaPesos={etiquetaPesos}
            pct={data.pct}
          />
        </GraficoEnVista>
        <Percentiles
          pct={data.pct}
          factorIpc={factorIpc}
          etiquetaPesos={etiquetaPesos}
        />
      </div>

      {/* Evolución histórica 2020-2024 (ingresos y empleabilidad) */}
      <div id="empleabilidad" className="scroll-mt-24">
        <GraficoEnVista altura="h-[360px]">
          <EvolucionYoY
            evolIng4={data.evol_ing4}
            evolEmp1={data.evol_emp1}
            evolEmp2={data.evol_emp2}
            variacion={data.variacion}
            factorIpc={factorIpc}
            etiquetaPesos={etiquetaPesos}
          />
        </GraficoEnVista>
      </div>

      {/* Mini calculadora de retorno */}
      <div id="calculadora-retorno" className="scroll-mt-24">
        <MiniCalculadoraRetorno
          slug={carrera.slug}
          tipo={tipoActivo}
          arancelMediano={oferta?.arancel?.med ?? null}
          durRealSemestres={data.dur_real}
          ing1={data.ing[0]}
          ing4={data.ing[3]}
          factorIpc={factorIpc}
        />
      </div>

      {/* Tabla de instituciones */}
      <div id="donde-estudiar" className="scroll-mt-24">
        <TablaInstituciones
          instituciones={institucionesTipo}
          programas={programasTipo}
        />
      </div>

      {/* Oferta 2026: Histograma de aranceles y Me Alcanza PAES */}
      {programasTipo.length > 0 ? (
        <div id="arancel" className="grid scroll-mt-24 gap-4 sm:gap-6 lg:grid-cols-2">
          <GraficoEnVista altura="h-[380px]">
            <HistogramaAranceles programas={programasTipo} oferta={oferta} />
          </GraficoEnVista>
          <GraficoEnVista altura="h-[380px]">
            <MeAlcanza programas={programasTipo} />
          </GraficoEnVista>
        </div>
      ) : null}

      {/* Perfil de estudiantes y titulados */}
      <PerfilEstudiantes data={data} />
    </div>
  );
}

export function CompartirFichaButton({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: titulo, url });
        return;
      } catch {
        // Fallback to clipboard if user cancels or share fails
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="h-9 shrink-0 gap-1.5 rounded-lg bg-card px-3.5 text-xs font-medium"
    >
      {copiado ? (
        <>
          <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
          Enlace copiado
        </>
      ) : (
        <>
          <Share2 className="size-3.5 text-blue-700" aria-hidden="true" />
          Compartir
        </>
      )}
    </Button>
  );
}

export function AnalisisCarreraCollapsible({
  parrafos,
}: {
  parrafos: readonly string[];
}) {
  const [abierto, setAbierto] = useState(false);

  if (parrafos.length === 0) return null;

  const primero = parrafos[0];
  const resto = parrafos.slice(1);

  if (resto.length === 0) {
    return <p>{primero}</p>;
  }

  return (
    <Collapsible open={abierto} onOpenChange={setAbierto} className="space-y-3">
      <p>{primero}</p>
      <CollapsibleContent
        forceMount
        className="space-y-3 data-[state=closed]:hidden"
      >
        {resto.map((parrafo) => (
          <p key={parrafo}>{parrafo}</p>
        ))}
      </CollapsibleContent>
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-800"
        >
          {abierto ? (
            <>
              Ocultar análisis completo
              <ChevronUp className="size-3.5" aria-hidden="true" />
            </>
          ) : (
            <>
              Leer análisis completo
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </>
          )}
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  );
}
