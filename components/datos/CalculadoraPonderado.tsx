"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Calculator, Info, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trackEvent, trackEventOnce } from "@/lib/analytics/marketing";
import { normalizarTexto } from "@/lib/datos/formato";

interface Ponderaciones {
  nem: number;
  ranking: number;
  lenguaje: number;
  mate1: number;
  mate2: number;
  historia: number;
  ciencias: number;
  otros: number;
}

interface ProgramaU {
  s: string;
  i: string;
  n: string;
  r: string;
  j: string;
  a: number | null;
  p: number | null;
  w: Ponderaciones;
}

function sumaPonderaciones(w: Ponderaciones): number {
  return w.nem + w.ranking + w.lenguaje + w.mate1 + w.mate2 + w.historia + w.ciencias + w.otros;
}

function calcularPonderado(
  puntajes: {
    nem: number;
    ranking: number;
    lenguaje: number;
    mate1: number;
    mate2: number;
    historia: number;
    ciencias: number;
  },
  w: Ponderaciones
): { total: number; usaMejorElectiva: boolean; electivaUsada: "historia" | "ciencias" | "ambas" } {
  const base =
    (puntajes.nem * w.nem +
      puntajes.ranking * w.ranking +
      puntajes.lenguaje * w.lenguaje +
      puntajes.mate1 * w.mate1 +
      puntajes.mate2 * w.mate2) /
    100;

  const sumaTotal = sumaPonderaciones(w);
  const ambosElectivos = w.historia > 0 && w.ciencias > 0 && sumaTotal > 100;

  if (ambosElectivos) {
    const aporteHist = (puntajes.historia * w.historia) / 100;
    const aporteCien = (puntajes.ciencias * w.ciencias) / 100;
    if (aporteHist >= aporteCien) {
      return { total: base + aporteHist, usaMejorElectiva: true, electivaUsada: "historia" };
    }
    return { total: base + aporteCien, usaMejorElectiva: true, electivaUsada: "ciencias" };
  }

  const aporteElectivos =
    (puntajes.historia * w.historia + puntajes.ciencias * w.ciencias) / 100;
  return {
    total: base + aporteElectivos,
    usaMejorElectiva: false,
    electivaUsada: w.historia > 0 ? "historia" : "ciencias",
  };
}

export function CalculadoraPonderado() {
  const [programas, setProgramas] = React.useState<ProgramaU[]>([]);
  const [cargando, setCargando] = React.useState(true);
  const [busqueda, setBusqueda] = React.useState("");
  const [programaIdx, setProgramaIdx] = React.useState<number>(0);

  const [nem, setNem] = React.useState<number>(680);
  const [ranking, setRanking] = React.useState<number>(710);
  const [lenguaje, setLenguaje] = React.useState<number>(670);
  const [mate1, setMate1] = React.useState<number>(720);
  const [mate2, setMate2] = React.useState<number>(600);
  const [historia, setHistoria] = React.useState<number>(620);
  const [ciencias, setCiencias] = React.useState<number>(650);

  React.useEffect(() => {
    trackEventOnce("datos_view_ponderado", "datos_view", { pagina: "puntaje-ponderado" });
  }, []);

  React.useEffect(() => {
    let activo = true;
    fetch("/datos/carreras/programas-u.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ProgramaU[]) => {
        if (!activo) return;
        const conPonderacion = data.filter((p) => sumaPonderaciones(p.w) > 0);
        setProgramas(conPonderacion);
        const def = conPonderacion.findIndex(
          (p) => p.s === "ingenieria-civil-industrial" && p.w.nem > 0
        );
        if (def >= 0) setProgramaIdx(def);
      })
      .catch(() => {
        // ignore
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  const programasFiltrados = React.useMemo(() => {
    const q = normalizarTexto(busqueda);
    const lista = programas.map((p, idx) => ({ p, idx }));
    if (!q) return lista.slice(0, 80);
    return lista
      .filter(({ p }) => {
        const texto = normalizarTexto(`${p.n} ${p.i} ${p.r}`);
        return texto.includes(q);
      })
      .slice(0, 80);
  }, [programas, busqueda]);

  const programaActual = programas[programaIdx] ?? null;

  const resultado = React.useMemo(() => {
    if (!programaActual) return null;
    return calcularPonderado(
      { nem, ranking, lenguaje, mate1, mate2, historia, ciencias },
      programaActual.w
    );
  }, [programaActual, nem, ranking, lenguaje, mate1, mate2, historia, ciencias]);

  const handleTrack = () => {
    trackEvent("datos_calc", {
      calculadora: "ponderado",
      slug: programaActual?.s ?? "ninguno",
      institucion: programaActual?.i ?? "ninguna",
    });
  };

  const clampPaes = (val: string) => {
    const n = Number(val);
    if (!Number.isFinite(n)) return 100;
    return Math.max(100, Math.min(1000, Math.round(n)));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Panel de puntajes y selector */}
        <div className="space-y-5 rounded-xl border border-[#e2e2dc] bg-white p-6 shadow-2xs">
          <div className="flex items-center gap-2">
            <Calculator className="size-4 text-[#1890ff]" aria-hidden="true" />
            <h2 className="text-base font-bold text-[#171716]">
              1. Elige un programa universitario y sus ponderaciones
            </h2>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-[#8a8a84]" />
              <Input
                type="search"
                placeholder="Filtrar por carrera, universidad o región (ej. Medicina Chile, UDP)..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={String(programaIdx)}
              onValueChange={(v) => {
                setProgramaIdx(Number(v));
                handleTrack();
              }}
              disabled={cargando || programas.length === 0}
            >
              <SelectTrigger className="bg-white">
                <SelectValue
                  placeholder={cargando ? "Cargando programas universitarios..." : "Selecciona un programa"}
                />
              </SelectTrigger>
              <SelectContent>
                {programasFiltrados.map(({ p, idx }) => (
                  <SelectItem key={`${p.i}-${p.n}-${p.r}-${idx}`} value={String(idx)}>
                    {p.n} — {p.i} ({p.r}, {p.j})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-t border-[#f0f0ec] pt-4">
            <h3 className="mb-3 text-sm font-bold text-[#171716]">
              2. Ingresa tus puntajes (escala 100 a 1.000)
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: "nem", label: "NEM", val: nem, set: setNem, peso: programaActual?.w.nem },
                { id: "ranking", label: "Ranking", val: ranking, set: setRanking, peso: programaActual?.w.ranking },
                { id: "lenguaje", label: "Competencia Lectora", val: lenguaje, set: setLenguaje, peso: programaActual?.w.lenguaje },
                { id: "mate1", label: "Matemática 1 (M1)", val: mate1, set: setMate1, peso: programaActual?.w.mate1 },
                { id: "mate2", label: "Matemática 2 (M2)", val: mate2, set: setMate2, peso: programaActual?.w.mate2 },
                { id: "historia", label: "Historia y Cs. Sociales", val: historia, set: setHistoria, peso: programaActual?.w.historia },
                { id: "ciencias", label: "Ciencias", val: ciencias, set: setCiencias, peso: programaActual?.w.ciencias },
              ].map((campo) => (
                <div key={campo.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <Label htmlFor={`paes-${campo.id}`} className="font-semibold text-[#5c5c58]">
                      {campo.label}
                    </Label>
                    {campo.peso !== undefined ? (
                      <span
                        className={`font-bold tabular-nums ${
                          campo.peso > 0 ? "text-[#1890ff]" : "text-[#8a8a84]"
                        }`}
                      >
                        {campo.peso} %
                      </span>
                    ) : null}
                  </div>
                  <Input
                    id={`paes-${campo.id}`}
                    type="number"
                    min={100}
                    max={1000}
                    value={campo.val}
                    onChange={(e) => campo.set(clampPaes(e.target.value))}
                    onBlur={handleTrack}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel de resultado */}
        <div className="flex flex-col justify-between gap-5 rounded-xl border border-[#e2e2dc] border-t-4 border-t-[#1890ff] bg-white p-6 shadow-2xs">
          {programaActual && resultado ? (
            <div className="space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {programaActual.i}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {programaActual.r} · {programaActual.j}
                  </Badge>
                </div>
                <h3 className="mt-2 text-lg font-bold text-[#171716]">{programaActual.n}</h3>
              </div>

              <div className="rounded-xl border border-[#d6e6f5] bg-[#e9f4ff]/40 p-5">
                <p className="text-xs font-semibold tracking-wide text-[#5c5c58] uppercase">
                  Tu puntaje ponderado estimado
                </p>
                <p className="mt-1 text-5xl font-extrabold tracking-tight text-[#1890ff] tabular-nums">
                  {resultado.total.toFixed(1).replace(".", ",")}
                </p>
                {programaActual.p ? (
                  <p className="mt-2 text-xs text-[#5c5c58]">
                    Promedio PAES referencial del programa: <strong className="text-[#171716]">{programaActual.p.toFixed(1).replace(".", ",")} pts</strong>
                  </p>
                ) : null}
              </div>

              {/* Desglose de ponderación */}
              <div className="space-y-2 rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-4 text-xs">
                <p className="font-bold text-[#171716]">Desglose aplicado</p>
                <div className="grid grid-cols-2 gap-y-1.5 text-[#5c5c58]">
                  <span>NEM ({programaActual.w.nem} %):</span>
                  <span className="text-right font-semibold text-[#171716] tabular-nums">
                    +{((nem * programaActual.w.nem) / 100).toFixed(1).replace(".", ",")}
                  </span>
                  <span>Ranking ({programaActual.w.ranking} %):</span>
                  <span className="text-right font-semibold text-[#171716] tabular-nums">
                    +{((ranking * programaActual.w.ranking) / 100).toFixed(1).replace(".", ",")}
                  </span>
                  <span>Comp. Lectora ({programaActual.w.lenguaje} %):</span>
                  <span className="text-right font-semibold text-[#171716] tabular-nums">
                    +{((lenguaje * programaActual.w.lenguaje) / 100).toFixed(1).replace(".", ",")}
                  </span>
                  <span>Matemática 1 ({programaActual.w.mate1} %):</span>
                  <span className="text-right font-semibold text-[#171716] tabular-nums">
                    +{((mate1 * programaActual.w.mate1) / 100).toFixed(1).replace(".", ",")}
                  </span>
                  {programaActual.w.mate2 > 0 ? (
                    <>
                      <span>Matemática 2 ({programaActual.w.mate2} %):</span>
                      <span className="text-right font-semibold text-[#171716] tabular-nums">
                        +{((mate2 * programaActual.w.mate2) / 100).toFixed(1).replace(".", ",")}
                      </span>
                    </>
                  ) : null}
                  {programaActual.w.historia > 0 &&
                  (!resultado.usaMejorElectiva || resultado.electivaUsada === "historia") ? (
                    <>
                      <span>Historia ({programaActual.w.historia} %):</span>
                      <span className="text-right font-semibold text-[#171716] tabular-nums">
                        +{((historia * programaActual.w.historia) / 100).toFixed(1).replace(".", ",")}
                      </span>
                    </>
                  ) : null}
                  {programaActual.w.ciencias > 0 &&
                  (!resultado.usaMejorElectiva || resultado.electivaUsada === "ciencias") ? (
                    <>
                      <span>Ciencias ({programaActual.w.ciencias} %):</span>
                      <span className="text-right font-semibold text-[#171716] tabular-nums">
                        +{((ciencias * programaActual.w.ciencias) / 100).toFixed(1).replace(".", ",")}
                      </span>
                    </>
                  ) : null}
                </div>
                {resultado.usaMejorElectiva ? (
                  <p className="pt-1 text-[11px] text-[#5c5c58]">
                    * Se tomó tu mejor prueba electiva entre Historia y Ciencias ({resultado.electivaUsada}).
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-[#5c5c58]">
              {cargando ? "Cargando ponderaciones oficiales..." : "Selecciona un programa universitario para calcular."}
            </div>
          )}

          <div className="space-y-3 border-t border-[#f0f0ec] pt-4">
            <div className="flex items-start gap-2 rounded-lg bg-[#fff8eb] p-3 text-xs text-[#171716]">
              <Info className="mt-0.5 size-4 shrink-0 text-[#f99c00]" aria-hidden="true" />
              <p>
                Ponderaciones informadas en el Buscador de Carreras 2025–2026; confirma las de la
                Admisión 2027 en la Oferta Definitiva del DEMRE.
              </p>
            </div>

            {programaActual ? (
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/datos/carreras/${programaActual.s}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Ver ficha de la carrera
                  <ArrowUpRight className="ml-1 size-3.5" />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
