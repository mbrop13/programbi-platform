"use client";

import { Inbox } from "lucide-react";
import { useReferralData } from "@/components/referrals/app/use-referral-data";
import { ReferralTable } from "@/components/referrals/app/referral-table";
import { EmptyState } from "@/components/referrals/empty-state";
import { StatusBadge } from "@/components/referrals/status-badge";
import { STATUS_HELP, STATUS_LABELS } from "@/lib/referrals/status";
import type { ReferralStatus } from "@/lib/referrals/types";

export default function ReferidosListPage() {
  const { loading, referrals } = useReferralData();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tus referidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Estados en español. Calificada = el equipo validó el fit.
        </p>
      </div>
      {loading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      ) : referrals.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Aún no tienes intros — manda la primera"
          description="Cuando envíes una intro, aparece acá y en la cola interna de ProgramBI."
          actionHref="/referidos/app/nueva"
          actionLabel="Nueva intro"
        />
      ) : (
        <ReferralTable data={referrals} />
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {(Object.keys(STATUS_LABELS) as ReferralStatus[]).map((s) => (
          <div key={s} className="flex items-start gap-3 rounded-xl border border-border px-3 py-2">
            <StatusBadge status={s} />
            <p className="text-xs text-muted-foreground">{STATUS_HELP[s]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
