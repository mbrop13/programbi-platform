"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  Copy,
  Download,
  Info,
  RotateCcw,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { trackEvent, trackEventOnce } from "@/lib/analytics/marketing";
import { TIPO_ETIQUETAS, type RankingItem } from "@/lib/datos/carreras-tipos";
import { pesos, porcentaje, semestres } from "@/lib/datos/formato";

interface ScoredItem {
  item: RankingItem;
  score: number;
  razones: string[];
}

export function TestCarrera({
  ranking,
  edicion,
}: {
  ranking: RankingItem[];
  edicion: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const areasDisponibles = React.useMemo(() => {
    const set = new Set<string>();
    for (const r of ranking) {
      if (r.area) set.add(r.area);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [ranking]);

  const regionesDisponibles = React.useMemo(() => {
    const set = new Set<string>();
    for (const r of ranking) {
      for (const reg of r.regiones) set.add(reg);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [ranking]);

  const [paso, setPaso] = React.useState<number>(() => {
    return searchParams.get("r") ? 5 : 0;
  });

  // Respuestas de los 5 pasos
  const [areasElegidas, setAreasElegidas] = React.useState<string[]>(() => {
    const a = searchParams.get("a");
    return a ? a.split(",").filter(Boolean).slice(0, 3) : [];
  });
  const [conGratuidad, setConGratuidad] = React.useState(false);
  const [presupuestoMax, setPresupuestoMax] = React.useState<number>(8_000_000);
  const [presupuestoUsado, setPresupuestoUsado] = React.useState(false);
  const [paesInput, setPaesInput] = React.useState<string>("");
  const [regionElegida, setRegionElegida] = React.useState<string>("cualquiera");
  const [jornadaElegida, setJornadaElegida] = React.useState<string>("cualquiera");

  // Pesos interactivos (default 40% ing4, 40% emp1, 20% dur_real inversa)
  const [pesoIng, setPesoIng] = React.useState(40);
  const [pesoEmp, setPesoEmp] = React.useState(40);
  const [pesoDur, setPesoDur] = React.useState(20);

  const [copiado, setCopiado] = React.useState(false);

  React.useEffect(() => {
    trackEventOnce("datos_view_test", "datos_view", { pagina: "test" });
  }, []);

  const toggleArea = (area: string) => {
    setAreasElegidas((prev) => {
      if (prev.includes(area)) return prev.filter((a) => a !== area);
      if (prev.length >= 3) return prev;
      return [...prev, area];
    });
  };

  // Cálculo transparente de ranking personalizado
  const resultado = React.useMemo(() => {
    const base = ranking.filter((r) => r.ing4 !== null && r.emp1 !== null);
    const maxIng = Math.max(...base.map((r) => r.ing4 ?? 0), 1);
    const minIng = Math.min(...base.map((r) => r.ing4 ?? maxIng));
    const durs = base.map((r) => r.dur_real).filter((d): d is number => d !== null && d > 0);
    const minDur = durs.length ? Math.min(...durs) : 4;
    const maxDur = durs.length ? Math.max(...durs) : 18;

    const paesNum = paesInput.trim() !== "" ? Number(paesInput) : null;
    const usaPaes = paesNum !== null && Number.isFinite(paesNum) && paesNum >= 100 && paesNum <= 1000;
    const usaPresupuesto = !conGratuidad && presupuestoUsado;

    const filtrar = (opts: {
      usarAreas: boolean;
      usarPresupuesto: boolean;
      usarPaes: boolean;
      usarRegion: boolean;
      usarJornada: boolean;
    }) => {
      return base.filter((r) => {
        if (opts.usarAreas && areasElegidas.length > 0 && !areasElegidas.includes(r.area)) {
          return false;
        }
        if (opts.usarPresupuesto && r.arancel_min !== null && r.arancel_min > presupuestoMax) {
          return false;
        }
        if (opts.usarPaes && paesNum !== null && r.paes_min !== null && r.paes_min > paesNum + 30) {
          return false;
        }
        if (opts.usarRegion && regionElegida !== "cualquiera" && regionElegida !== "online") {
          if (!r.regiones.includes(regionElegida)) return false;
        }
        if (opts.usarRegion && regionElegida === "online") {
          if (!r.jornadas.includes("A Distancia") && !r.jornadas.includes("Semipresencial")) {
            return false;
          }
        }
        if (opts.usarJornada && jornadaElegida !== "cualquiera") {
          if (!r.jornadas.includes(jornadaElegida)) return false;
        }
        return true;
      });
    };

    const relajaciones: string[] = [];
    let candidatos = filtrar({
      usarAreas: true,
      usarPresupuesto: usaPresupuesto,
      usarPaes: usaPaes,
      usarRegion: regionElegida !== "cualquiera",
      usarJornada: jornadaElegida !== "cualquiera",
    });

    if (candidatos.length < 5 && jornadaElegida !== "cualquiera") {
      candidatos = filtrar({
        usarAreas: true,
        usarPresupuesto: usaPresupuesto,
        usarPaes: usaPaes,
        usarRegion: regionElegida !== "cualquiera",
        usarJornada: false,
      });
      relajaciones.push("jornada");
    }
    if (candidatos.length < 5 && regionElegida !== "cualquiera") {
      candidatos = filtrar({
        usarAreas: true,
        usarPresupuesto: usaPresupuesto,
        usarPaes: usaPaes,
        usarRegion: false,
        usarJornada: false,
      });
      relajaciones.push("región");
    }
    if (candidatos.length < 5 && usaPaes) {
      candidatos = filtrar({
        usarAreas: true,
        usarPresupuesto: usaPresupuesto,
        usarPaes: false,
        usarRegion: false,
        usarJornada: false,
      });
      relajaciones.push("puntaje PAES");
    }
    if (candidatos.length < 5 && usaPresupuesto) {
      candidatos = filtrar({
        usarAreas: true,
        usarPresupuesto: false,
        usarPaes: false,
        usarRegion: false,
        usarJornada: false,
      });
      relajaciones.push("presupuesto");
    }
    if (candidatos.length < 5 && areasElegidas.length > 0) {
      candidatos = base;
      relajaciones.push("áreas seleccionadas");
    }

    const totalPeso = pesoIng + pesoEmp + pesoDur || 1;
    const wIng = pesoIng / totalPeso;
    const wEmp = pesoEmp / totalPeso;
    const wDur = pesoDur / totalPeso;

    // Deduplicar por slug manteniendo la mejor combinación carrera-tipo
    const porSlug = new Map<string, ScoredItem>();

    for (const r of candidatos) {
      const ingNorm = maxIng > minIng ? ((r.ing4 ?? minIng) - minIng) / (maxIng - minIng) : 0.5;
      const empNorm = r.emp1 ?? 0;
      const durVal = r.dur_real ?? maxDur;
      const durNorm = maxDur > minDur ? 1 - (durVal - minDur) / (maxDur - minDur) : 0.5;

      const score = Math.round((ingNorm * wIng + empNorm * wEmp + durNorm * wDur) * 100);

      const razones: string[] = [];
      if (areasElegidas.includes(r.area)) razones.push(`Área: ${r.area}`);
      if (conGratuidad) razones.push("Compatible con gratuidad / beca");
      else if (usaPresupuesto && r.arancel_min !== null && r.arancel_min <= presupuestoMax) {
        razones.push(`Arancel desde ${pesos(r.arancel_min)}`);
      }
      if ((r.emp1 ?? 0) >= 0.8) razones.push(`Alta empleabilidad (${porcentaje(r.emp1)})`);
      if ((r.ing4 ?? 0) >= 1_800_000) razones.push(`Ingreso 4.º año ${pesos(r.ing4)}`);
      if (r.dur_real !== null && r.dur_real <= 10) razones.push(`Duración real ${semestres(r.dur_real)}`);
      if (razones.length === 0) {
        razones.push(`Ingreso ${pesos(r.ing4)} · Empleo ${porcentaje(r.emp1)}`);
      }

      const prev = porSlug.get(r.slug);
      if (!prev || score > prev.score) {
        porSlug.set(r.slug, { item: r, score, razones: razones.slice(0, 3) });
      }
    }

    const top5 = Array.from(porSlug.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return { top5, relajaciones };
  }, [
    ranking,
    areasElegidas,
    conGratuidad,
    presupuestoUsado,
    presupuestoMax,
    paesInput,
    regionElegida,
    jornadaElegida,
    pesoIng,
    pesoEmp,
    pesoDur,
  ]);

  const irAResultados = (skip = false) => {
    setPaso(5);
    const slugs = resultado.top5.slice(0, 3).map((x) => x.item.slug).join(",");
    const aParam = areasElegidas.join(",");
    router.replace(
      `/datos/carreras/test?r=${encodeURIComponent(slugs)}${aParam ? `&a=${encodeURIComponent(aParam)}` : ""}`,
      { scroll: false }
    );
    trackEvent("datos_quiz_result", {
      skipped_all: skip && areasElegidas.length === 0 && !presupuestoUsado && !paesInput && regionElegida === "cualquiera",
      top3: slugs,
      areas: aParam || "ninguna",
    });
  };

  const avanzarPaso = () => {
    trackEvent("datos_quiz", { paso: paso + 1, accion: "siguiente" });
    if (paso < 4) {
      setPaso((p) => p + 1);
    } else {
      irAResultados(false);
    }
  };

  const saltarPaso = () => {
    trackEvent("datos_quiz", { paso: paso + 1, accion: "saltar" });
    if (paso < 4) {
      setPaso((p) => p + 1);
    } else {
      irAResultados(true);
    }
  };

  const reiniciar = () => {
    setAreasElegidas([]);
    setConGratuidad(false);
    setPresupuestoUsado(false);
    setPaesInput("");
    setRegionElegida("cualquiera");
    setJornadaElegida("cualquiera");
    setPesoIng(40);
    setPesoEmp(40);
    setPesoDur(20);
    setPaso(0);
    router.replace("/datos/carreras/test", { scroll: false });
  };

  const top3Slugs = resultado.top5.slice(0, 3).map((x) => x.item.slug).join(",");
  const shareCardUrl = top3Slugs
    ? `/datos/carreras/compartir/test/${top3Slugs}?formato=1080x1350&v=${encodeURIComponent(edicion)}`
    : null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
      trackEvent("datos_share", { formato: "link", slugs: top3Slugs });
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mis 5 carreras según datos oficiales | ProgramBI",
          text: "Ordené carreras en Chile según ingresos, empleabilidad y duración real en mifuturo.cl.",
          url: window.location.href,
        });
        trackEvent("datos_share", { formato: "native", slugs: top3Slugs });
      } catch {
        // cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6">
      {/* Aviso obligatorio */}
      <div className="flex items-start gap-2.5 rounded-xl border border-[#d6e6f5] bg-[#e9f4ff]/50 px-4 py-3 text-xs text-[#171716]">
        <Info className="mt-0.5 size-4 shrink-0 text-[#1890ff]" aria-hidden="true" />
        <p className="font-medium">
          No es un test vocacional: ordena carreras según datos y lo que elegiste. Habla con tu orientador.
        </p>
      </div>

      {paso < 5 ? (
        <div className="rounded-xl border border-[#e2e2dc] bg-white p-6 shadow-2xs sm:p-8">
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#5c5c58]">
              <span>Paso {paso + 1} de 5</span>
              <span>Todos los pasos son opcionales</span>
            </div>
            <Progress value={((paso + 1) / 5) * 100} className="h-2" />
          </div>

          {paso === 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#171716]">
                1. ¿Qué áreas te interesan más? (máximo 3)
              </h2>
              <p className="text-sm text-[#5c5c58]">
                Si aún no lo tienes claro, puedes saltar este paso y ver el ranking general.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {areasDisponibles.map((area) => {
                  const activa = areasElegidas.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleArea(area)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        activa
                          ? "border-[#1890ff] bg-[#1890ff] text-white"
                          : "border-[#e2e2dc] bg-[#f7f7f4] text-[#171716] hover:border-[#1890ff]"
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {paso === 1 ? (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#171716]">
                2. ¿Cuál es tu presupuesto anual máximo de arancel?
              </h2>
              <div className="flex items-center justify-between rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-4">
                <div>
                  <Label htmlFor="test-grat" className="text-sm font-semibold text-[#171716]">
                    Postularé con gratuidad o beca completa
                  </Label>
                  <p className="text-xs text-[#5c5c58]">
                    Omite el límite de arancel en el filtro.
                  </p>
                </div>
                <Switch
                  id="test-grat"
                  checked={conGratuidad}
                  onCheckedChange={(v) => {
                    setConGratuidad(v);
                    setPresupuestoUsado(false);
                  }}
                />
              </div>
              {!conGratuidad ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5c5c58]">Arancel anual máximo:</span>
                    <span className="font-bold text-[#1890ff] tabular-nums">
                      {presupuestoUsado ? pesos(presupuestoMax) : "Sin límite definido"}
                    </span>
                  </div>
                  <Slider
                    min={1_500_000}
                    max={12_000_000}
                    step={250_000}
                    value={[presupuestoMax]}
                    onValueChange={([v]) => {
                      setPresupuestoMax(v);
                      setPresupuestoUsado(true);
                    }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {paso === 2 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#171716]">
                3. ¿Tienes un puntaje PAES aproximado? (opcional)
              </h2>
              <p className="text-sm text-[#5c5c58]">
                Sirve solo como referencia frente a los puntajes mínimos observados en universidades. IP y CFT no exigen PAES.
              </p>
              <div className="max-w-xs space-y-1.5">
                <Label htmlFor="test-paes" className="text-xs font-semibold text-[#5c5c58]">
                  Puntaje promedio aproximado (100 a 1.000)
                </Label>
                <Input
                  id="test-paes"
                  type="number"
                  min={100}
                  max={1000}
                  placeholder="Ej. 650 (o déjalo vacío)"
                  value={paesInput}
                  onChange={(e) => setPaesInput(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {paso === 3 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#171716]">
                4. ¿En qué región prefieres estudiar?
              </h2>
              <div className="max-w-sm">
                <Select value={regionElegida} onValueChange={setRegionElegida}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cualquiera">Cualquier región</SelectItem>
                    <SelectItem value="online">Modalidad online / semipresencial</SelectItem>
                    {regionesDisponibles.map((reg) => (
                      <SelectItem key={reg} value={reg}>
                        {reg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : null}

          {paso === 4 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#171716]">
                5. ¿Qué jornada prefieres?
              </h2>
              <div className="flex flex-wrap gap-2">
                {["cualquiera", "Diurna", "Vespertina", "A Distancia", "Semipresencial"].map((j) => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => setJornadaElegida(j)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      jornadaElegida === j
                        ? "border-[#1890ff] bg-[#1890ff] text-white"
                        : "border-[#e2e2dc] bg-[#f7f7f4] text-[#171716] hover:border-[#1890ff]"
                    }`}
                  >
                    {j === "cualquiera" ? "Cualquier jornada" : j}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0f0ec] pt-5">
            <div className="flex items-center gap-2">
              {paso > 0 ? (
                <Button type="button" variant="outline" size="sm" onClick={() => setPaso((p) => p - 1)}>
                  <ArrowLeft className="mr-1.5 size-4" />
                  Anterior
                </Button>
              ) : null}
              <Button type="button" variant="ghost" size="sm" onClick={saltarPaso}>
                Saltar este paso
              </Button>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={avanzarPaso}
              className="bg-[#1890ff] text-white hover:bg-[#1478d6]"
            >
              {paso === 4 ? "Ver Top 5 con datos" : "Siguiente"}
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* Pantalla de Resultados */
        <div className="space-y-6">
          {resultado.relajaciones.length > 0 ? (
            <div className="rounded-xl border border-[#f99c00]/40 bg-[#fff8eb] px-4 py-3 text-xs text-[#171716]">
              Como la combinación exacta tenía menos de 5 carreras con datos completos, ampliamos:{" "}
              <strong>{resultado.relajaciones.join(", ")}</strong>.
            </div>
          ) : null}

          {/* Sliders interactivos de ponderación */}
          <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#171716]">
                  Ajusta qué pesa más en tu orden (fórmula transparente)
                </h2>
                <p className="text-xs text-[#5c5c58]">
                  Por defecto: 40 % ingreso al 4.º año, 40 % empleabilidad 1.er año y 20 % menor duración real.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={reiniciar}>
                <RotateCcw className="mr-1.5 size-3.5" />
                Volver a responder
              </Button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#5c5c58]">Sueldo 4.º año</span>
                  <span className="font-bold text-[#1890ff] tabular-nums">{pesoIng}</span>
                </div>
                <Slider min={0} max={100} step={5} value={[pesoIng]} onValueChange={([v]) => setPesoIng(v)} />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#5c5c58]">Empleabilidad 1.er año</span>
                  <span className="font-bold text-[#f99c00] tabular-nums">{pesoEmp}</span>
                </div>
                <Slider min={0} max={100} step={5} value={[pesoEmp]} onValueChange={([v]) => setPesoEmp(v)} />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#5c5c58]">Menor duración real</span>
                  <span className="font-bold text-[#171716] tabular-nums">{pesoDur}</span>
                </div>
                <Slider min={0} max={100} step={5} value={[pesoDur]} onValueChange={([v]) => setPesoDur(v)} />
              </div>
            </div>
          </div>

          {/* Top 5 */}
          <div className="space-y-3">
            {resultado.top5.map(({ item, score, razones }, idx) => (
              <div
                key={`${item.slug}-${item.tipo}`}
                className="flex flex-col justify-between gap-4 rounded-xl border border-[#e2e2dc] bg-white p-5 shadow-2xs sm:flex-row sm:items-center"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#1890ff] text-xs font-extrabold text-white">
                      #{idx + 1}
                    </span>
                    <Link
                      href={`/datos/carreras/${item.slug}`}
                      className="inline-flex items-center gap-1 text-lg font-bold text-[#171716] hover:text-[#1890ff] hover:underline"
                    >
                      {item.nombre}
                      <ArrowUpRight className="size-4" />
                    </Link>
                    <Badge variant="outline" className="text-xs">
                      {TIPO_ETIQUETAS[item.tipo].corto}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Puntaje {score}/100
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-[#5c5c58]">
                    <span className="font-semibold text-[#171716]">Por qué aparece:</span>
                    {razones.map((raz) => (
                      <span key={raz} className="rounded bg-[#f3f3f0] px-2 py-0.5">
                        {raz}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-5 border-t border-[#f0f0ec] pt-3 sm:border-t-0 sm:pt-0">
                  <div>
                    <p className="text-[11px] text-[#5c5c58]">Ingreso 4.º año</p>
                    <p className="text-lg font-extrabold text-[#1890ff] tabular-nums">
                      {pesos(item.ing4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#5c5c58]">Empleo 1.er año</p>
                    <p className="text-lg font-extrabold text-[#171716] tabular-nums">
                      {porcentaje(item.emp1)}
                    </p>
                  </div>
                  <Link
                    href={`/datos/carreras/comparar?c=${top3Slugs}`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Comparar Top 3
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Compartir Top 3 */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e2e2dc] bg-white p-4 shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-[#5c5c58]">
              <Compass className="size-4 text-[#1890ff]" />
              <span>Comparte tu Top 3 o descarga la tarjeta oficial en PNG.</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
                {copiado ? <Check className="mr-1.5 size-4 text-emerald-600" /> : <Copy className="mr-1.5 size-4" />}
                {copiado ? "Enlace copiado" : "Copiar enlace"}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-1.5 size-4" />
                Compartir
              </Button>
              {shareCardUrl ? (
                <a
                  href={shareCardUrl}
                  download={`top-3-carreras-${edicion}.png`}
                  className={buttonVariants({ size: "sm", className: "bg-[#1890ff] text-white hover:bg-[#1478d6]" })}
                >
                  <Download className="mr-1.5 size-4" />
                  Descargar tarjeta PNG
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
