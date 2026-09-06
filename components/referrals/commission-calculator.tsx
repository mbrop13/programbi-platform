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
import { BorderBeam } from "./magic/border-beam";

export function CommissionCalculator() {
  const [ticket, setTicket] = useState<number>(REFERRAL_TICKET_DEFAULT_CLP);
  const commission = useMemo(() => calculateCommissionClp(ticket), [ticket]);
  const pct =
    ((ticket - REFERRAL_TICKET_MIN_CLP) /
      (REFERRAL_TICKET_MAX_CLP - REFERRAL_TICKET_MIN_CLP)) *
    100;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <BorderBeam />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Calculadora
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
        Ticket del Pack → tu 15%
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Rango referencial {formatClp(REFERRAL_TICKET_MIN_CLP)}–{formatClp(REFERRAL_TICKET_MAX_CLP)}{" "}
        / área. Comisión = entero inferior del 15% del neto cobrado.
      </p>

      <label className="mt-8 block text-sm font-medium" htmlFor="ticket-slider">
        Valor neto cobrado del Pack
      </label>
      <input
        id="ticket-slider"
        type="range"
        min={REFERRAL_TICKET_MIN_CLP}
        max={REFERRAL_TICKET_MAX_CLP}
        step={50000}
        value={ticket}
        onChange={(e) => setTicket(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-emerald-700"
        style={{
          background: `linear-gradient(to right, #0f7a4d ${pct}%, var(--muted) ${pct}%)`,
        }}
      />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{formatClp(REFERRAL_TICKET_MIN_CLP)}</span>
        <span className="font-medium text-foreground">{formatClp(ticket)}</span>
        <span>{formatClp(REFERRAL_TICKET_MAX_CLP)}</span>
      </div>

      <div className="mt-8 rounded-2xl bg-emerald-50/80 p-5 dark:bg-emerald-500/10">
        <p className="text-sm text-emerald-900/70 dark:text-emerald-200/70">Tu comisión 15% =</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight text-emerald-800 dark:text-emerald-300 sm:text-5xl">
          <NumberTicker value={commission} format={(n) => formatClp(n)} />
        </p>
        <p className="mt-2 text-xs text-emerald-900/60 dark:text-emerald-200/50">
          Pago por transferencia cuando ProgramBI cobra la factura / OC. Un Pack = una comisión.
        </p>
      </div>
    </div>
  );
}
