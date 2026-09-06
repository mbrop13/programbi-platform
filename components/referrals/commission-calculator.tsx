"use client";

import { useMemo, useState } from "react";
import { calculateCommissionClp } from "@/lib/referrals/commission";
import {
  REFERRAL_TICKET_DEFAULT_CLP,
  REFERRAL_TICKET_MAX_CLP,
  REFERRAL_TICKET_MIN_CLP,
} from "@/lib/referrals/constants";
import { formatClp } from "@/lib/referrals/format";
import { NumberTicker } from "./magic/number-ticker";

export function CommissionCalculator() {
  const [ticket, setTicket] = useState<number>(REFERRAL_TICKET_DEFAULT_CLP);
  const commission = useMemo(() => calculateCommissionClp(ticket), [ticket]);
  const pct =
    ((ticket - REFERRAL_TICKET_MIN_CLP) /
      (REFERRAL_TICKET_MAX_CLP - REFERRAL_TICKET_MIN_CLP)) *
    100;

  return (
    <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">Calculadora</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
        Ejemplo con un curso → tu 15%
      </h3>
      <p className="mt-2 max-w-md text-sm text-mute">
        Rango de cursos abiertos {formatClp(REFERRAL_TICKET_MIN_CLP)}–{formatClp(REFERRAL_TICKET_MAX_CLP)}.
        Comisión = entero inferior del 15% del neto cobrado. En empresas, la misma fórmula sobre la
        factura de la capacitación.
      </p>

      <label className="mt-8 block text-sm font-medium" htmlFor="ticket-slider">
        Valor neto cobrado
      </label>
      <input
        id="ticket-slider"
        type="range"
        min={REFERRAL_TICKET_MIN_CLP}
        max={REFERRAL_TICKET_MAX_CLP}
        step={50000}
        value={ticket}
        onChange={(e) => setTicket(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-wash accent-ink"
        style={{
          background: `linear-gradient(to right, #171716 ${pct}%, #ebebe6 ${pct}%)`,
        }}
      />
      <div className="mt-2 flex justify-between font-mono text-[11px] text-faint">
        <span>{formatClp(REFERRAL_TICKET_MIN_CLP)}</span>
        <span className="font-medium text-ink">{formatClp(ticket)}</span>
        <span>{formatClp(REFERRAL_TICKET_MAX_CLP)}</span>
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
