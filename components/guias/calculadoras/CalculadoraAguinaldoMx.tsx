"use client";

import { useId, useMemo, useState } from "react";
import {
  ANIO_AGUINALDO,
  DIAS_ANIO,
  DIAS_LEY,
  TOPE_EXENTO,
  calcularAguinaldoMx,
  diasTrabajadosEnAnio,
} from "@/lib/calculadoras/aguinaldo-mx";

const MXN = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

/** "15,000.50" o "15000" → 15000.5. Vacío o inválido → null. */
function leerMonto(texto: string): number | null {
  const limpio = texto.replace(/[^\d.]/g, "");
  if (!limpio) return null;
  const n = Number(limpio);
  return Number.isFinite(n) && n > 0 ? n : null;
}

const CAMPO =
  "h-12 w-full rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-surface)] px-3.5 text-base text-[var(--g-ink)] tabular-nums outline-none transition-colors focus:border-[var(--g-accent)] focus:ring-2 focus:ring-[var(--g-accent)]/20";

/**
 * Calculadora de aguinaldo 2026 (México). Mismo cálculo que la guía y la plantilla:
 * lib/calculadoras/aguinaldo-mx.ts. Todo ocurre en el navegador; no se envía nada.
 */
export default function CalculadoraAguinaldoMx() {
  const id = useId();
  const [sueldo, setSueldo] = useState("");
  const [anioCompleto, setAnioCompleto] = useState(true);
  const [ingreso, setIngreso] = useState("");
  const [salida, setSalida] = useState("");
  const [diasPactados, setDiasPactados] = useState(String(DIAS_LEY));

  const sueldoNum = leerMonto(sueldo);
  const diasPactadosNum = Math.max(DIAS_LEY, Math.round(Number(diasPactados) || DIAS_LEY));
  const diasTrabajados = anioCompleto ? DIAS_ANIO : ingreso ? diasTrabajadosEnAnio(ingreso, salida || null) : null;

  const resultado = useMemo(
    () =>
      sueldoNum != null && diasTrabajados != null
        ? calcularAguinaldoMx({ sueldoMensual: sueldoNum, diasTrabajados, diasAguinaldo: diasPactadosNum })
        : null,
    [sueldoNum, diasTrabajados, diasPactadosNum]
  );

  const falta =
    sueldoNum == null
      ? "Escribe tu sueldo mensual para ver el cálculo."
      : diasTrabajados == null
        ? "Indica tu fecha de ingreso."
        : null;

  return (
    <section
      aria-labelledby={`${id}-titulo`}
      className="rounded-3xl border border-[var(--g-border)] bg-[var(--g-bg)] p-5 shadow-[var(--g-card-shadow)] sm:p-6"
    >
      <h2 id={`${id}-titulo`} className="text-lg font-bold tracking-[-0.015em] text-[var(--g-ink)]">
        Calcula tu aguinaldo {ANIO_AGUINALDO}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-[var(--g-muted)]">
        Con las reglas de la LFT y el ISR de {ANIO_AGUINALDO}. Se calcula en tu navegador; no se guarda nada.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor={`${id}-sueldo`} className="text-sm font-semibold text-[var(--g-ink)]">
            Sueldo mensual bruto
          </label>
          <div className="relative mt-1.5">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-base text-[var(--g-subtle)]"
            >
              $
            </span>
            <input
              id={`${id}-sueldo`}
              inputMode="decimal"
              autoComplete="off"
              placeholder="15,000"
              value={sueldo}
              onChange={(e) => setSueldo(e.target.value)}
              aria-describedby={`${id}-sueldo-ayuda`}
              className={`${CAMPO} pl-7`}
            />
          </div>
          <p id={`${id}-sueldo-ayuda`} className="mt-1 text-xs text-[var(--g-subtle)]">
            Antes de impuestos, sin bonos ni prestaciones.
          </p>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-[var(--g-ink)]">¿Trabajaste todo {ANIO_AGUINALDO}?</legend>
          <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-surface)] p-1">
            {[
              { valor: true, texto: "Sí, todo el año" },
              { valor: false, texto: "No, solo una parte" },
            ].map((op) => (
              <label
                key={op.texto}
                className={[
                  "flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg px-2 text-center text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--g-accent)]",
                  anioCompleto === op.valor
                    ? "bg-[var(--g-ink)] text-[var(--g-surface)]"
                    : "text-[var(--g-muted)] hover:text-[var(--g-ink)]",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name={`${id}-anio`}
                  className="sr-only"
                  checked={anioCompleto === op.valor}
                  onChange={() => setAnioCompleto(op.valor)}
                />
                {op.texto}
              </label>
            ))}
          </div>
        </fieldset>

        {!anioCompleto ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-ingreso`} className="text-sm font-semibold text-[var(--g-ink)]">
                Fecha de ingreso
              </label>
              <input
                id={`${id}-ingreso`}
                type="date"
                min="1970-01-01"
                max={`${ANIO_AGUINALDO}-12-31`}
                value={ingreso}
                onChange={(e) => setIngreso(e.target.value)}
                className={`${CAMPO} mt-1.5`}
              />
            </div>
            <div>
              <label htmlFor={`${id}-salida`} className="text-sm font-semibold text-[var(--g-ink)]">
                Fecha de salida
              </label>
              <input
                id={`${id}-salida`}
                type="date"
                min={`${ANIO_AGUINALDO}-01-01`}
                max={`${ANIO_AGUINALDO}-12-31`}
                value={salida}
                onChange={(e) => setSalida(e.target.value)}
                aria-describedby={`${id}-salida-ayuda`}
                className={`${CAMPO} mt-1.5`}
              />
              <p id={`${id}-salida-ayuda`} className="mt-1 text-xs text-[var(--g-subtle)]">
                Solo si ya no trabajas ahí.
              </p>
            </div>
          </div>
        ) : null}

        <div>
          <label htmlFor={`${id}-dias`} className="block text-sm font-semibold text-[var(--g-ink)]">
            Días de aguinaldo
          </label>
          <input
            id={`${id}-dias`}
            type="number"
            inputMode="numeric"
            min={DIAS_LEY}
            max={90}
            value={diasPactados}
            onChange={(e) => setDiasPactados(e.target.value)}
            aria-describedby={`${id}-dias-ayuda`}
            className={`${CAMPO} mt-1.5 max-w-[8rem]`}
          />
          <p id={`${id}-dias-ayuda`} className="mt-1 text-xs text-[var(--g-subtle)]">
            {DIAS_LEY} es el mínimo de ley. Cambia el número si tu contrato da más.
          </p>
        </div>
      </div>

      <div aria-live="polite" className="mt-6 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-4 sm:p-5">
        {resultado ? (
          <>
            <p className="text-sm font-medium text-[var(--g-muted)]">Tu aguinaldo bruto</p>
            <p className="mt-0.5 text-[2rem] leading-tight font-bold tracking-[-0.03em] text-[var(--g-ink)] tabular-nums">
              {MXN.format(resultado.bruto)}
            </p>
            <p className="mt-1 text-sm text-[var(--g-muted)]">
              Recibes aprox.{" "}
              <strong className="font-semibold text-[var(--g-ink)] tabular-nums">{MXN.format(resultado.neto)}</strong>{" "}
              después de ISR
            </p>
            <dl className="mt-4 divide-y divide-[var(--g-border)] border-t border-[var(--g-border)] text-sm">
              {[
                ["Días trabajados en el año", `${resultado.diasTrabajados} de ${DIAS_ANIO}`],
                ["Salario diario (sueldo / 30)", MXN.format(resultado.salarioDiario)],
                ["Días de aguinaldo que te tocan", resultado.diasProporcionales.toLocaleString("es-MX")],
                [`Parte exenta (hasta ${MXN.format(TOPE_EXENTO)})`, MXN.format(resultado.exento)],
                ["Parte gravada", MXN.format(resultado.gravado)],
                ["ISR estimado", MXN.format(resultado.isr)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-2">
                  <dt className="text-[var(--g-muted)]">{k}</dt>
                  <dd className="font-semibold text-[var(--g-ink)] tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <p className="text-sm text-[var(--g-muted)]">{falta}</p>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[var(--g-subtle)]">
        El ISR es una estimación con la tarifa mensual del art. 96 (sumando el aguinaldo gravado a un sueldo
        mensual), sin subsidio para el empleo. Tu empresa puede usar el método del art. 174 del Reglamento. Se
        paga a más tardar el 19 de diciembre.
      </p>
      <a
        href="#descarga-plantilla"
        className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--g-accent)] underline decoration-[var(--g-accent)]/30 underline-offset-4 hover:decoration-[var(--g-accent)]"
      >
        Hazlo en Excel con la plantilla gratis
      </a>
    </section>
  );
}
