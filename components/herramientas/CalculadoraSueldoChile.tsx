"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, CheckSquare, Info, Square } from "lucide-react";
import {
  BENCHMARK_BAR_ITEMS,
  DEFAULT_AFP_PCT,
  DEFAULT_SALUD_PCT,
  DEFAULT_UTM_CLP,
  DISCLAIMER_LEGAL,
  calcularBrutoALiquido,
  estimarBrutoDesdeLiquido,
  formatClp,
} from "@/lib/data/sueldos-chile";

type ModoCalculo = "bruto_a_liquido" | "liquido_a_bruto";

interface SkillOption {
  id: string;
  label: string;
  detalle: string;
}

const SKILL_OPTIONS: SkillOption[] = [
  {
    id: "excel",
    label: "Excel (tablas dinámicas y BUSCARX)",
    detalle: "Base operativa",
  },
  {
    id: "powerbi",
    label: "Power BI + DAX (modelo estrella y medidas)",
    detalle: "Exigido en Analista BI",
  },
  {
    id: "sql",
    label: "SQL (JOINs, GROUP BY y extracción desde BD)",
    detalle: "Autonomía técnica",
  },
  {
    id: "python",
    label: "Python (Pandas y automatización ETL)",
    detalle: "Diferenciador analítico",
  },
  {
    id: "pl300",
    label: "Certificación PL-300 / Portafolio público",
    detalle: "Validación ante reclutadores",
  },
];

function parsePositiveNumber(value: string, fallback = 0): number {
  const cleaned = Number(String(value).replace(",", ".").replace(/[^0-9.]/g, ""));
  return Number.isFinite(cleaned) && cleaned >= 0 ? cleaned : fallback;
}

export function CalculadoraSueldoChile() {
  const [modo, setModo] = useState<ModoCalculo>("bruto_a_liquido");
  const [montoInput, setMontoInput] = useState("1147226");
  const [afpInput, setAfpInput] = useState(String(DEFAULT_AFP_PCT));
  const [saludInput, setSaludInput] = useState(String(DEFAULT_SALUD_PCT));
  const [tipoContrato, setTipoContrato] = useState<"indefinido" | "plazo_fijo">("indefinido");
  const [utmInput, setUtmInput] = useState(String(DEFAULT_UTM_CLP));
  const [skills, setSkills] = useState<Record<string, boolean>>({
    excel: true,
    powerbi: false,
    sql: false,
    python: false,
    pl300: false,
  });

  const resultado = useMemo(() => {
    const monto = parsePositiveNumber(montoInput, 0);
    const afpPct = parsePositiveNumber(afpInput, DEFAULT_AFP_PCT);
    const saludPct = parsePositiveNumber(saludInput, DEFAULT_SALUD_PCT);
    const valorUtm = Math.max(1000, parsePositiveNumber(utmInput, DEFAULT_UTM_CLP));

    if (modo === "bruto_a_liquido") {
      return calcularBrutoALiquido({
        monto,
        afpPct,
        saludPct,
        tipoContrato,
        valorUtm,
      });
    }
    return estimarBrutoDesdeLiquido(monto, {
      afpPct,
      saludPct,
      tipoContrato,
      valorUtm,
    });
  }, [modo, montoInput, afpInput, saludInput, tipoContrato, utmInput]);

  const maxBenchmark = Math.max(1500000, resultado.bruto, 1);

  const recomendacion = useMemo(() => {
    if (!skills.powerbi) {
      return {
        titulo: "Siguiente paso recomendado: Power BI + DAX",
        descripcion:
          "En Chile, pasar de Excel operativo a Power BI (Power Query, modelo estrella y DAX) es el salto más directo hacia cargos de Analista BI.",
        primario: { href: "/cursos/power-bi", label: "Ver curso Power BI en vivo" },
        secundario: { href: "/plantillas", label: "Explorar plantillas gratis" },
      };
    }
    if (!skills.sql) {
      return {
        titulo: "Siguiente paso recomendado: SQL Server",
        descripcion:
          "Los avisos mejor pagados de Analista BI piden extraer datos directo desde bases SQL sin depender de TI.",
        primario: { href: "/cursos/sql-server", label: "Ver curso SQL Server" },
        secundario: { href: "/simulador-pl-300", label: "Practicar simulador PL-300" },
      };
    }
    if (!skills.python) {
      return {
        titulo: "Siguiente paso recomendado: Python y flujo completo de Análisis de Datos",
        descripcion:
          "Ya manejas Power BI y SQL. Sumar Python (Pandas) y automatización te posiciona para cargos de Analista de Datos en banca, minería y tech.",
        primario: { href: "/cursos/analisis-de-datos", label: "Ver programa Análisis de Datos" },
        secundario: { href: "/simulador-pl-300", label: "Simulador PL-300" },
      };
    }
    if (!skills.pl300) {
      return {
        titulo: "Siguiente paso recomendado: Certificación PL-300 y portafolio",
        descripcion:
          "Tienes el stack técnico completo (Power BI, SQL y Python). Valida tu nivel con el simulador PL-300 y arma un tablero demostrable.",
        primario: { href: "/simulador-pl-300", label: "Ir al simulador PL-300" },
        secundario: { href: "/plantillas", label: "Ver plantillas de portafolio" },
      };
    }
    return {
      titulo: "Perfil técnico completo para postular a bandas superiores",
      descripcion:
        "Cuentas con el stack más demandado en Chile (SQL + Power BI + Python + preparación PL-300). Apunta a avisos con bandas visibles en GetOnBoard y LinkedIn.",
      primario: { href: "/cursos/analisis-de-datos", label: "Ver especialización" },
      secundario: { href: "/plantillas", label: "Recursos y plantillas" },
    };
  }, [skills]);

  function toggleSkill(id: string) {
    setSkills((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section aria-label="Calculadora de sueldo Analista de Datos Chile" className="text-ink">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        {/* Panel izquierdo: parámetros */}
        <div className="rounded-[26px] border border-line bg-paper p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-ink">
              <Calculator className="h-4 w-4" aria-hidden />
              Calculadora Bruto / Líquido (CLP)
            </h2>
            <div className="inline-flex rounded-full border border-line bg-canvas p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModo("bruto_a_liquido")}
                className={`rounded-full px-3 py-1 transition-colors ${
                  modo === "bruto_a_liquido" ? "bg-ink text-canvas" : "text-mute hover:text-ink"
                }`}
              >
                Bruto → Líquido
              </button>
              <button
                type="button"
                onClick={() => setModo("liquido_a_bruto")}
                className={`rounded-full px-3 py-1 transition-colors ${
                  modo === "liquido_a_bruto" ? "bg-ink text-canvas" : "text-mute hover:text-ink"
                }`}
              >
                Líquido → Bruto
              </button>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="sueldo-monto-clp" className="block text-xs font-semibold text-ink">
              {modo === "bruto_a_liquido"
                ? "Sueldo bruto mensual (CLP)"
                : "Sueldo líquido objetivo mensual (CLP)"}
            </label>
            <input
              id="sueldo-monto-clp"
              type="number"
              min={0}
              step={10000}
              value={montoInput}
              onChange={(e) => setMontoInput(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-line-strong bg-canvas px-4 py-3 font-mono text-lg font-bold text-ink focus:border-ink focus:outline-none"
            />
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-faint">Referencias reales:</span>
              {[
                { label: "$979.205 (Datos)", val: "979205" },
                { label: "$1.035.380 (Indeed)", val: "1035380" },
                { label: "$1.147.226 (BI)", val: "1147226" },
                { label: "$1.500.000 (Aviso SQL+SAP)", val: "1500000" },
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setMontoInput(preset.val)}
                  className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[11px] font-medium text-mute hover:border-line-strong hover:text-ink"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="afp-pct" className="block text-xs font-semibold text-ink">
                AFP (% referencial)
              </label>
              <input
                id="afp-pct"
                type="number"
                min={10}
                max={15}
                step={0.01}
                value={afpInput}
                onChange={(e) => setAfpInput(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 font-mono text-sm text-ink focus:border-ink focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-faint">10% obligatorio + comisión (ej. 11,44%)</p>
            </div>

            <div>
              <label htmlFor="salud-pct" className="block text-xs font-semibold text-ink">
                Salud (% Fonasa / Isapre)
              </label>
              <input
                id="salud-pct"
                type="number"
                min={7}
                max={25}
                step={0.1}
                value={saludInput}
                onChange={(e) => setSaludInput(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 font-mono text-sm text-ink focus:border-ink focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-faint">Fonasa 7% (edita si tienes plan Isapre)</p>
            </div>

            <div>
              <label htmlFor="tipo-contrato" className="block text-xs font-semibold text-ink">
                Tipo de contrato (AFC)
              </label>
              <select
                id="tipo-contrato"
                value={tipoContrato}
                onChange={(e) =>
                  setTipoContrato(e.target.value as "indefinido" | "plazo_fijo")
                }
                className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
              >
                <option value="indefinido">Indefinido (0,6% AFC)</option>
                <option value="plazo_fijo">Plazo fijo (0% AFC trabajador)</option>
              </select>
            </div>

            <div>
              <label htmlFor="utm-valor" className="block text-xs font-semibold text-ink">
                Valor UTM referencial (CLP)
              </label>
              <input
                id="utm-valor"
                type="number"
                min={50000}
                step={100}
                value={utmInput}
                onChange={(e) => setUtmInput(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-canvas px-3 py-2 font-mono text-sm text-ink focus:border-ink focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-faint">Usada para tramos de Impuesto Único</p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-2xl border border-line bg-wash p-3.5 text-xs leading-relaxed text-mute">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink" aria-hidden />
            <p>{DISCLAIMER_LEGAL}</p>
          </div>
        </div>

        {/* Panel derecho: resultado y desglose */}
        <div className="rounded-[26px] border border-line-strong bg-paper p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
            Resultado estimado
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-canvas p-4">
              <p className="text-xs text-mute">
                {modo === "bruto_a_liquido" ? "Sueldo líquido estimado" : "Sueldo bruto estimado"}
              </p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {modo === "bruto_a_liquido"
                  ? formatClp(resultado.liquido)
                  : formatClp(resultado.bruto)}
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-canvas p-4">
              <p className="text-xs text-mute">Descuentos legales estimados</p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {formatClp(resultado.totalDescuentos)}
              </p>
              <p className="mt-1 text-[11px] text-faint">
                {resultado.tasaDescuentoPct.toFixed(1).replace(".", ",")}% del bruto
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5 rounded-2xl border border-line bg-canvas p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-mute">Sueldo bruto imponible</span>
              <span className="font-mono font-semibold text-ink">{formatClp(resultado.bruto)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mute">AFP ({afpInput || DEFAULT_AFP_PCT}%)</span>
              <span className="font-mono text-mute">− {formatClp(resultado.afp)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mute">Salud ({saludInput || DEFAULT_SALUD_PCT}%)</span>
              <span className="font-mono text-mute">− {formatClp(resultado.salud)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mute">
                Seguro de Cesantía ({tipoContrato === "indefinido" ? "0,6%" : "0%"})
              </span>
              <span className="font-mono text-mute">− {formatClp(resultado.afc)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mute">Impuesto Único 2ª Categoría</span>
              <span className="font-mono text-mute">− {formatClp(resultado.impuestoUnico)}</span>
            </div>
            <div className="border-t border-line pt-2.5 flex items-center justify-between font-semibold">
              <span className="text-ink">Sueldo líquido estimado</span>
              <span className="font-mono text-ink">{formatClp(resultado.liquido)}</span>
            </div>
          </div>

          {/* Barra comparativa contra referencias públicas */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-ink">
              Tu sueldo bruto vs referencias públicas en Chile
            </p>
            <div className="mt-3 space-y-2.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-ink">
                  <span>Tu cálculo (bruto)</span>
                  <span className="font-mono">{formatClp(resultado.bruto)}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-wash">
                  <div
                    className="h-full rounded-full bg-ink transition-all"
                    style={{ width: `${Math.min(100, (resultado.bruto / maxBenchmark) * 100)}%` }}
                  />
                </div>
              </div>

              {BENCHMARK_BAR_ITEMS.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex justify-between text-xs text-mute">
                    <span>{item.label}</span>
                    <span className="font-mono">{formatClp(item.monto)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-wash">
                    <div
                      className="h-full rounded-full bg-line-strong"
                      style={{ width: `${Math.min(100, (item.monto / maxBenchmark) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Checklist de brecha de habilidades */}
      <div className="mt-8 rounded-[26px] border border-line bg-paper p-5 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
              Diagnóstico de perfil
            </p>
            <h3 className="mt-1.5 text-xl font-bold tracking-tight text-ink">
              ¿Qué herramientas ya dominas?
            </h3>
            <p className="mt-1 text-sm text-mute">
              Marca las herramientas que ya usas en producción para ver qué te falta para acceder a
              los rangos de Analista BI y Analista de Datos.
            </p>

            <div className="mt-4 space-y-2">
              {SKILL_OPTIONS.map((skill) => {
                const checked = Boolean(skills[skill.id]);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    aria-pressed={checked}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors ${
                      checked
                        ? "border-line-strong bg-canvas text-ink"
                        : "border-line bg-canvas/60 text-mute hover:border-line-strong"
                    }`}
                  >
                    <span className="flex items-center gap-3 text-sm font-medium">
                      {checked ? (
                        <CheckSquare className="h-4 w-4 shrink-0 text-ink" aria-hidden />
                      ) : (
                        <Square className="h-4 w-4 shrink-0 text-faint" aria-hidden />
                      )}
                      {skill.label}
                    </span>
                    <span className="text-[11px] text-faint">{skill.detalle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-line-strong bg-canvas p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
              Recomendación según tu stack
            </p>
            <h4 className="mt-2 text-lg font-bold tracking-tight text-ink">
              {recomendacion.titulo}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-mute">{recomendacion.descripcion}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={recomendacion.primario.href}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-canvas no-underline transition-opacity hover:opacity-90"
              >
                {recomendacion.primario.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={recomendacion.secundario.href}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-paper px-5 py-2.5 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash"
              >
                {recomendacion.secundario.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
