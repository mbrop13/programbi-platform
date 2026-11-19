"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
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

  const factorIpc =
    modoPesos === "hoy" && ajusteIpc ? ajusteIpc.factor : 1;
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

  const esc = (v: number | null) =>
    v !== null ? Math.round(v * factorIpc) : null;

  const ing4 = esc(data.ing[3]);
  const ing1 = esc(data.ing[0]);

  return (
    <div className="space-y-6">
      {/* Barra de controles: Tipo de institución + Toggle IPC */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e2e2dc] bg-white p-3.5 sm:px-5">
        {tiposDisponibles.length > 1 ? (
          <Tabs
            value={tipoActivo}
            onValueChange={(val) => setTipoActivo(val as TipoIesKey)}
          >
            <TabsList className="bg-[#f3f3f0]">
              {tiposDisponibles.map((t) => (
                <TabsTrigger key={t} value={t} className="px-3 text-xs sm:text-sm">
                  {TIPO_ETIQUETAS[t].plural}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <span className="inline-flex items-center rounded-md bg-[#e9f4ff] px-2.5 py-1 text-xs font-semibold text-[#1063b8]">
            {TIPO_ETIQUETAS[tipoActivo].plural}
          </span>
        )}

        <div
          role="group"
          aria-label="Moneda de los ingresos"
          className="inline-flex items-center rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-0.5 text-xs"
        >
          <button
            type="button"
            onClick={() => setModoPesos("sep2025")}
            aria-pressed={modoPesos === "sep2025"}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              modoPesos === "sep2025"
                ? "bg-white text-[#171716] shadow-2xs"
                : "text-[#5c5c58] hover:text-[#171716]"
            }`}
          >
            Pesos sep-2025
          </button>
          <button
            type="button"
            onClick={() => setModoPesos("hoy")}
            aria-pressed={modoPesos === "hoy"}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              modoPesos === "hoy"
                ? "bg-white text-[#1063b8] shadow-2xs"
                : "text-[#5c5c58] hover:text-[#171716]"
            }`}
          >
            Pesos de hoy (IPC)
          </button>
        </div>
      </div>

      {/* KPIs del segmento activo */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          variante="primary"
          etiqueta="Ingreso bruto 4.º año"
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
              : "Ingresos ≥ sueldo mínimo"
          }
        />
        <KpiCard
          etiqueta="Duración real promedio"
          valor={semestres(data.dur_real)}
          subtitulo={
            data.dur_formal !== null
              ? `${anosDesdeSemestres(data.dur_real)} · formal ${semestres(data.dur_formal)}`
              : anosDesdeSemestres(data.dur_real)
          }
        />
        <KpiCard
          variante="accent"
          etiqueta="Arancel anual mediano 2026"
          valor={pesos(oferta?.arancel?.med ?? null)}
          subtitulo={
            oferta
              ? `${entero(oferta.programas)} programas · ${entero(oferta.instituciones)} inst.`
              : "Sin oferta 2026 publicada"
          }
        />
      </div>

      {/* Curva de ingresos + Percentiles */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CurvaIngresos
          ing={data.ing}
          factorIpc={factorIpc}
          etiquetaPesos={etiquetaPesos}
        />
        <Percentiles
          pct={data.pct}
          factorIpc={factorIpc}
          etiquetaPesos={etiquetaPesos}
        />
      </div>

      {/* Evolución histórica 2020-2024 */}
      <EvolucionYoY
        evolIng4={data.evol_ing4}
        evolEmp1={data.evol_emp1}
        evolEmp2={data.evol_emp2}
        variacion={data.variacion}
        factorIpc={factorIpc}
        etiquetaPesos={etiquetaPesos}
      />

      {/* Mini calculadora de retorno */}
      <MiniCalculadoraRetorno
        slug={carrera.slug}
        tipo={tipoActivo}
        arancelMediano={oferta?.arancel?.med ?? null}
        durRealSemestres={data.dur_real}
        ing1={data.ing[0]}
        ing4={data.ing[3]}
        factorIpc={factorIpc}
      />

      {/* Tabla de instituciones */}
      <TablaInstituciones instituciones={institucionesTipo} />

      {/* Oferta 2026: Histograma de aranceles y Me Alcanza PAES */}
      {programasTipo.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <HistogramaAranceles programas={programasTipo} oferta={oferta} />
          <MeAlcanza programas={programasTipo} />
        </div>
      ) : null}

      {/* Perfil de estudiantes y titulados */}
      <PerfilEstudiantes data={data} />
    </div>
  );
}
