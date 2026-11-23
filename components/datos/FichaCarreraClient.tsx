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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/datos/KpiCard";
import { MiniCalculadoraRetorno } from "@/components/datos/MiniCalculadoraRetorno";
import { Percentiles } from "@/components/datos/Percentiles";
import { PerfilEstudiantes } from "@/components/datos/PerfilEstudiantes";
import { TablaInstituciones } from "@/components/datos/TablaInstituciones";
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
  ctaSueldo?: ReactNode;
}

export function FichaCarreraClient({
  carrera,
  tipoInicial,
  instituciones,
  programas,
  edicion,
  ctaSueldo,
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

  return (
    <div className="space-y-6">
      {/* Barra de controles: Tipo de institución + Toggle IPC */}
      <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:px-5">
          {tiposDisponibles.length > 1 ? (
            <Tabs
              value={tipoActivo}
              onValueChange={(val) => setTipoActivo(val as TipoIesKey)}
            >
              <TabsList className="h-9 bg-muted p-1">
                {tiposDisponibles.map((t) => (
                  <TabsTrigger key={t} value={t} className="px-3 text-xs font-medium sm:text-sm">
                    {TIPO_ETIQUETAS[t].plural}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
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
                  ? "bg-card text-blue-700 shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Pesos de hoy (IPC)
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 4 KPIs principales (unificados, SSR-rendered) */}
      <section aria-label="Indicadores principales" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          variante="primary"
          etiqueta="Sueldo bruto 4.º año"
          valor={pesos(ing4)}
          delta={
            data.variacion.yoy_23_24 !== null
              ? `23→24: ${variacionPorcentual(data.variacion.yoy_23_24)}`
              : null
          }
          subtitulo={`1.er año: ${pesos(ing1)} · ${etiquetaPesos}`}
        />
        <KpiCard
          etiqueta="Empleabilidad 1.er año"
          valor={porcentaje(data.emp1)}
          subtitulo={
            data.emp2 !== null
              ? `2.º año: ${porcentaje(data.emp2)}`
              : "Titulados con ingresos ≥ mínimo"
          }
        />
        <KpiCard
          etiqueta="Duración real promedio"
          valor={data.dur_real !== null ? anosDesdeSemestres(data.dur_real) : "Sin dato"}
          subtitulo={
            data.dur_formal !== null
              ? `${semestres(data.dur_real)} · formal ${semestres(data.dur_formal)}`
              : semestres(data.dur_real)
          }
        />
        <KpiCard
          etiqueta="Arancel anual mediano 2026"
          valor={pesos(oferta?.arancel?.med ?? null)}
          subtitulo={
            oferta
              ? `${entero(oferta.programas)} programas · ${entero(oferta.instituciones)} inst.`
              : "Sin oferta 2026 publicada"
          }
        />
      </section>

      {/* Curva de ingresos + Percentiles */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GraficoEnVista altura="h-[380px]">
          <CurvaIngresos
            ing={data.ing}
            factorIpc={factorIpc}
            etiquetaPesos={etiquetaPesos}
          />
        </GraficoEnVista>
        <Percentiles
          pct={data.pct}
          factorIpc={factorIpc}
          etiquetaPesos={etiquetaPesos}
        />
      </div>

      {ctaSueldo}

      {/* Evolución histórica 2020-2024 */}
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

      {/* Mini calculadora de retorno */}
      <div id="calculadora-retorno" className="scroll-mt-20">
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
      <div id="instituciones" className="scroll-mt-20">
        <TablaInstituciones
          instituciones={institucionesTipo}
          programas={programasTipo}
        />
      </div>

      {/* Oferta 2026: Histograma de aranceles y Me Alcanza PAES */}
      {programasTipo.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
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
      className="h-11 shrink-0 gap-2 rounded-xl border-line-strong bg-white px-4 text-sm font-semibold"
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
