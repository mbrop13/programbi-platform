"use client";

import { useMemo, useState } from "react";
import { calculateCommissionClp } from "@/lib/referrals/commission";
import { REFERRAL_TICKET_MAX_CLP, REFERRAL_TICKET_MIN_CLP } from "@/lib/referrals/constants";
import { formatClp } from "@/lib/referrals/format";
import { NumberTicker } from "./magic/number-ticker";

export function CommissionCalculator() {
  // El control va en porcentaje (0-100) para no publicar el arancel del curso
  // en el HTML: el ticket se calcula en cliente a partir del rango interno.
  const [pct, setPct] = useState(50);

  const ticket = useMemo(() => {
    const raw =
      REFERRAL_TICKET_MIN_CLP +
      (REFERRAL_TICKET_MAX_CLP - REFERRAL_TICKET_MIN_CLP) * (pct / 100);
    return Math.max(0, Math.round(raw / 1000) * 1000);
  }, [pct]);

  const commission = useMemo(() => calculateCommissionClp(ticket), [ticket]);

  return (
    <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">Calculadora</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
        Ejemplo con un curso → tu 15%
      </h3>
      <p className="mt-2 max-w-md text-sm text-mute">
        El monto del curso va desde un programa estándar hasta el pack de análisis de datos.
        Comisión = entero inferior del 15% del neto cobrado. En empresas, la misma fórmula sobre la
        factura de la capacitación.
      </p>

      <label className="mt-8 block text-sm font-medium" htmlFor="ticket-slider">
        Tamaño de la venta
      </label>
      <input
        id="ticket-slider"
        type="range"
        min={0}
        max={100}
        step={1}
        value={pct}
        onChange={(event) => setPct(Number(event.target.value))}
        aria-valuetext={`${pct}% del rango de ventas`}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-wash accent-ink"
        style={{
          background: `linear-gradient(to right, #171716 ${pct}%, #ebebe6 ${pct}%)`,
        }}
      />
      <div className="mt-2 flex justify-between text-[11px] text-faint">
        <span>Curso estándar</span>
        <span>Pack de análisis de datos</span>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-canvas px-5 py-5">
        <p className="text-[11px] tracking-wide text-faint">Tu 15%</p>
        <p className="mt-1 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          <NumberTicker value={commission} format={(n) => formatClp(n)} />
        </p>
        <p className="mt-2 text-xs text-mute">
          Transferencia cuando ProgramBI cobra la factura. Una venta atribuida = una comisión.
        </p>
      </div>
    </div>
  );
}
