"use client";

import { formatClp } from "@/lib/referrals/format";
import type { ReferrerStats } from "@/lib/referrals/types";
import { NumberTicker } from "../magic/number-ticker";
import { Skeleton } from "@/components/ui/skeleton";

export function KpiGrid({ stats, loading }: { stats: ReferrerStats | null; loading: boolean }) {
  const items = [
    { label: "Intros enviadas", value: stats?.introsSent ?? 0, money: false },
    { label: "En pipeline", value: stats?.inPipeline ?? 0, money: false },
    { label: "Ganadas", value: stats?.won ?? 0, money: false },
    {
      label: "Comisión ganada",
      value: stats?.commissionEarnedClp ?? 0,
      money: true,
    },
    {
      label: "Comisión pagada",
      value: stats?.commissionPaidClp ?? 0,
      money: true,
    },
    { label: "Conversión", value: stats?.conversionRate ?? 0, pct: true },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="rounded-2xl border border-line bg-paper p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">{it.label}</p>
          {loading ? (
            <Skeleton className="mt-3 h-8 w-24" />
          ) : (
            <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
              {it.money ? (
                <NumberTicker value={it.value} format={(n) => formatClp(n)} />
              ) : it.pct ? (
                `${it.value}%`
              ) : (
                it.value
              )}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
