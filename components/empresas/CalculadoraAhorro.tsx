"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { getPais } from "@/config/paises";
import { trackCalculadoraUse, trackWhatsAppClick } from "@/lib/analytics/marketing";
import { usePaisRuta, useRutaLocal } from "@/lib/paises/cliente";
import { formatMoneda } from "@/lib/paises/precios";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * Calculadora de ahorro por capacitación (B2B).
 *
 * Solo trabaja con supuestos que el visitante ve y puede editar: no hay
 * precios de cursos precargados ni cifras de mercado. Si falta el costo hora
 * el resultado queda en horas; si falta el costo de la capacitación no se
 * calcula el retorno. La nota de la página deja claro que es una estimación.
 */

/** Valores de ejemplo: se muestran marcados como «supuesto, edítalo». */
const PERSONAS_INICIAL = 8;
const HORAS_SEMANA_INICIAL = 4;
const PORCENTAJE_INICIAL = 40;

/** 4,33 semanas promedio por mes (365,25 días ÷ 12 ÷ 7). */
const SEMANAS_POR_MES = 4.33;
const HORAS_POR_JORNADA = 8;

/** Un evento por ráfaga de cambios (2 s después) y como máximo uno por minuto. */
const ESPERA_EVENTO_MS = 2000;
const MIN_ENTRE_EVENTOS_MS = 60_000;

const PAGE_PATH = "/empresas/calculadora-capacitacion";

/** Acepta coma o punto decimal; vacío o negativo cuenta como 0. */
function numero(valor: string): number {
  const n = Number(String(valor).replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Formato es-CL estable (coma decimal, punto de miles) sin depender de Intl. */
function fmt(valor: number, decimales = 1): string {
  const seguro = Number.isFinite(valor) ? Math.abs(valor) : 0;
  const fijo = seguro.toFixed(decimales);
  const [entero, decimalesTexto] = fijo.split(".");
  const conMiles = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decimalesTexto ? `${conMiles},${decimalesTexto}` : conMiles;
}

/** Hasta un decimal, sin el «,0» cuando el valor es entero. */
function fmtFlex(valor: number): string {
  return Number.isInteger(valor) ? fmt(valor, 0) : fmt(valor, 1);
}

export function CalculadoraAhorro() {
  const pais = usePaisRuta();
  const rutaLocal = useRutaLocal();
  const moneda = getPais(pais).moneda;

  const [personas, setPersonas] = useState(String(PERSONAS_INICIAL));
  const [horasSemana, setHorasSemana] = useState(String(HORAS_SEMANA_INICIAL));
  const [porcentaje, setPorcentaje] = useState(String(PORCENTAJE_INICIAL));
  const [costoHora, setCostoHora] = useState("");
  const [costoCapacitacion, setCostoCapacitacion] = useState("");

  const usoRef = useRef(false);
  const ultimoEventoRef = useRef(0);
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const personasN = numero(personas);
  const horasSemanaN = numero(horasSemana);
  const porcentajeN = Math.min(100, numero(porcentaje));
  const costoHoraN = numero(costoHora);
  const costoCapacitacionN = numero(costoCapacitacion);

  const horasMes = personasN * horasSemanaN * SEMANAS_POR_MES * (porcentajeN / 100);
  const jornadas = horasMes / HORAS_POR_JORNADA;
  const ahorroMes = costoHoraN > 0 ? horasMes * costoHoraN : null;
  const mesesRecupero =
    ahorroMes != null && ahorroMes > 0 && costoCapacitacionN > 0
      ? costoCapacitacionN / ahorroMes
      : null;

  // Medición: no se dispara al montar, solo cuando el visitante mueve algo.
  useEffect(() => {
    if (!usoRef.current) return;
    if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    temporizadorRef.current = setTimeout(() => {
      const ahora = Date.now();
      if (ahora - ultimoEventoRef.current < MIN_ENTRE_EVENTOS_MS) return;
      ultimoEventoRef.current = ahora;
      trackCalculadoraUse({
        personas: Math.round(personasN),
        horasAhorradasMes: Math.round(horasMes * 10) / 10,
      });
    }, ESPERA_EVENTO_MS);

    return () => {
      if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    };
  }, [personasN, horasSemanaN, porcentajeN, costoHoraN, costoCapacitacionN, horasMes]);

  const waExtra =
    personasN >= 1
      ? `Calculé aproximadamente las horas por mes de ahorro para ${fmtFlex(personasN)} personas: ${fmt(horasMes)} h/mes.`
      : "Calculé las horas de ahorro por mes con la calculadora de la web.";
  const waHref = whatsappHref({
    page: PAGE_PATH,
    intent: "empresas",
    country: pais,
    extra: waExtra,
  });

  return (
    <section aria-label="Calculadora de ahorro por capacitación" className="text-ink">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="rounded-[26px] border border-line bg-paper p-5 sm:p-6">
          <h2 className="text-base font-semibold tracking-tight">Tus supuestos</h2>
          <p className="mt-1 text-xs leading-relaxed text-mute">
            Los tres primeros son valores de ejemplo. Cámbialos por los de tu equipo y el
            resultado se recalcula al instante.
          </p>

          <div className="mt-6 space-y-5">
            <CampoNumero
              id="calculadora-personas"
              etiqueta="Personas en el equipo"
              supuesto
              valor={personas}
              onChange={(valor) => {
                usoRef.current = true;
                setPersonas(valor);
              }}
              min={1}
              max={500}
              step={1}
              sufijo="personas"
              nota="Quiénes arman o actualizan reportes a mano hoy."
            />

            <CampoNumero
              id="calculadora-horas"
              etiqueta="Horas por persona a la semana"
              supuesto
              valor={horasSemana}
              onChange={(valor) => {
                usoRef.current = true;
                setHorasSemana(valor);
              }}
              min={0}
              max={60}
              step={0.5}
              sufijo="h / semana"
              nota="Tiempo de armado y actualización de reportes, no el de analizarlos."
            />

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="calculadora-porcentaje"
                  className="text-[12px] font-bold uppercase tracking-wide text-mute"
                >
                  Tiempo que se automatiza tras el curso
                </label>
                <span className="rounded-full bg-wash px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-faint">
                  supuesto, edítalo
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <input
                  id="calculadora-porcentaje"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={porcentajeN}
                  onChange={(event) => {
                    usoRef.current = true;
                    setPorcentaje(event.target.value);
                  }}
                  className="h-2 w-full cursor-pointer accent-ink"
                />
                <span className="w-16 shrink-0 text-right text-lg font-bold tabular-nums text-ink">
                  {fmtFlex(porcentajeN)} %
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-faint">
                Parte del trabajo repetitivo que queda en un tablero que se actualiza solo.
              </p>
            </div>

            <CampoNumero
              id="calculadora-costo-hora"
              etiqueta="Costo por hora del equipo"
              valor={costoHora}
              onChange={(valor) => {
                usoRef.current = true;
                setCostoHora(valor);
              }}
              min={0}
              step={100}
              placeholder="Opcional"
              sufijo={moneda}
              nota="En la moneda de tu país. Si lo dejas vacío, el resultado queda solo en horas."
            />

            <CampoNumero
              id="calculadora-costo-capacitacion"
              etiqueta="Costo total de la capacitación"
              valor={costoCapacitacion}
              onChange={(valor) => {
                usoRef.current = true;
                setCostoCapacitacion(valor);
              }}
              min={0}
              step={1000}
              placeholder="Lo escribes tú"
              sufijo={moneda}
              nota="Opcional y sin precargar: usa el valor de la propuesta que tengas."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[26px] border border-line-strong bg-ink p-5 text-canvas sm:p-6">
            <div className="flex items-center gap-2 text-canvas/70">
              <Calculator size={16} aria-hidden />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                Resultado estimado
              </h2>
            </div>

            <p
              aria-live="polite"
              className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight tabular-nums sm:text-5xl"
            >
              {fmt(horasMes)}{" "}
              <span className="ml-2 align-baseline text-lg font-semibold sm:text-xl">
                horas al mes
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-canvas/70">
              Equivale a unas <strong className="font-semibold text-canvas">{fmt(jornadas)}</strong>{" "}
              jornadas de {HORAS_POR_JORNADA} horas al mes que dejan de irse en reportes armados a
              mano.
            </p>

            {ahorroMes != null ? (
              <>
                <dl className="mt-5 space-y-3 border-t border-canvas/15 pt-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <dt className="text-sm text-canvas/70">Ahorro estimado al mes</dt>
                    <dd className="text-2xl font-bold tabular-nums">
                      {formatMoneda(pais, Math.round(ahorroMes))}
                    </dd>
                  </div>
                  {mesesRecupero != null ? (
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <dt className="text-sm text-canvas/70">Recuperas la inversión en</dt>
                      <dd className="text-lg font-semibold tabular-nums">
                        {mesesRecupero < 1 ? "menos de 1 mes" : `≈ ${fmt(mesesRecupero)} meses`}
                      </dd>
                    </div>
                  ) : null}
                </dl>
                {mesesRecupero == null ? (
                  <p className="mt-3 text-xs leading-relaxed text-canvas/60">
                    Agrega el costo total de la capacitación para ver cuántos meses tarda en
                    pagarse sola.
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-5 border-t border-canvas/15 pt-4 text-xs leading-relaxed text-canvas/60">
                Con el costo por hora del equipo también verías el ahorro mensual en dinero y en
                cuántos meses se recupera la capacitación.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={rutaLocal("/empresas#contacto")}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[14.5px] font-semibold text-canvas no-underline shadow-md shadow-ink/10 transition-transform active:scale-[0.98]"
            >
              Cotiza para tu equipo
              <ArrowRight size={16} strokeWidth={2.4} aria-hidden />
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-tracked="1"
              onClick={() =>
                trackWhatsAppClick({
                  page: PAGE_PATH,
                  country: pais,
                  cta_position: "calculadora_resultado",
                })
              }
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-line bg-paper px-6 text-[14.5px] font-medium text-ink no-underline transition-colors hover:bg-wash active:scale-[0.98]"
            >
              Enviar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[26px] border border-line bg-paper p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">La fórmula y los supuestos</h2>
        <p className="mt-3 rounded-xl bg-wash px-3 py-2 font-mono text-[12.5px] leading-relaxed text-ink">
          personas × horas a la semana × 4,33 × % automatizado = horas al mes
        </p>
        <p className="mt-2 text-xs leading-relaxed text-mute">
          Con tus valores: {fmtFlex(personasN)} × {fmtFlex(horasSemanaN)} × 4,33 ×{" "}
          {fmtFlex(porcentajeN)} % ={" "}
          <strong className="font-semibold text-ink">{fmt(horasMes)} horas al mes</strong>.
        </p>

        <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <Supuesto
            etiqueta="Equipo"
            valor={`${fmtFlex(personasN)} personas`}
          />
          <Supuesto
            etiqueta="Horas armando reportes"
            valor={`${fmtFlex(horasSemanaN)} h por persona a la semana`}
          />
          <Supuesto
            etiqueta="Automatización tras el curso"
            valor={`${fmtFlex(porcentajeN)} % de ese tiempo`}
          />
          <Supuesto etiqueta="Semanas por mes" valor="4,33" />
          <Supuesto etiqueta="Jornada" valor={`${HORAS_POR_JORNADA} horas`} />
          <Supuesto
            etiqueta="Costo hora"
            valor={costoHoraN > 0 ? `${formatMoneda(pais, Math.round(costoHoraN))} por hora` : "sin dato"}
          />
          <Supuesto
            etiqueta="Costo de la capacitación"
            valor={
              costoCapacitacionN > 0
                ? formatMoneda(pais, Math.round(costoCapacitacionN))
                : "sin dato"
            }
          />
          <Supuesto
            etiqueta="Ahorro mensual"
            valor={
              ahorroMes != null
                ? formatMoneda(pais, Math.round(ahorroMes))
                : "falta el costo hora"
            }
          />
        </dl>

        <p className="mt-5 text-[11px] leading-relaxed text-faint">
          Los supuestos son tuyos: cámbialos y el resultado se mueve con ellos. Sin costo hora el
          cálculo queda solo en horas; sin costo de capacitación no se estima el retorno.
        </p>
      </div>
    </section>
  );
}

function CampoNumero({
  id,
  etiqueta,
  supuesto = false,
  valor,
  onChange,
  sufijo,
  nota,
  placeholder,
  min,
  max,
  step,
}: {
  id: string;
  etiqueta: string;
  supuesto?: boolean;
  valor: string;
  onChange: (valor: string) => void;
  sufijo?: string;
  nota?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-[12px] font-bold uppercase tracking-wide text-mute">
          {etiqueta}
        </label>
        {supuesto ? (
          <span className="rounded-full bg-wash px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-faint">
            supuesto, edítalo
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex items-stretch gap-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={valor}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-line-strong bg-canvas px-3 text-base font-semibold tabular-nums text-ink outline-none transition-colors placeholder:font-normal placeholder:text-faint focus:border-ink"
        />
        {sufijo ? (
          <span className="inline-flex h-11 shrink-0 items-center rounded-xl border border-line bg-wash px-3 text-xs font-semibold text-mute">
            {sufijo}
          </span>
        ) : null}
      </div>
      {nota ? <p className="mt-1.5 text-xs leading-relaxed text-faint">{nota}</p> : null}
    </div>
  );
}

function Supuesto({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/70 pb-2">
      <dt className="text-xs font-semibold uppercase tracking-wide text-faint">{etiqueta}</dt>
      <dd className="text-right text-sm font-medium text-ink">{valor}</dd>
    </div>
  );
}
