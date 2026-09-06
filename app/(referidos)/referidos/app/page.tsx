"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
import { useReferralData } from "@/components/referrals/app/use-referral-data";
import { KpiGrid } from "@/components/referrals/app/kpi-grid";
import { ReferralTable } from "@/components/referrals/app/referral-table";
import { EmptyState } from "@/components/referrals/empty-state";
import { CopyLinkButton } from "@/components/referrals/app/copy-link-button";
import { referralSignupUrl } from "@/lib/referrals/format";

export default function ReferrerDashboardPage() {
  const { loading, error, referrer, stats, referrals } = useReferralData();
  const recent = referrals.slice(0, 6);
  const track = referrer ? referralSignupUrl(referrer.referral_code) : "";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {referrer ? `Hola, ${referrer.name.split(" ")[0]}` : "Panel"}
        </h1>
        <p className="mt-1 text-sm text-mute">
          Comparte tu link. Si se registran y después se cobra un curso o una capacitación, ganas el
          15%.
        </p>
      </div>
      {error ? (
        <p className="rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink">{error}</p>
      ) : null}

      {referrer ? (
        <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
            Tu link
          </p>
          <p className="mt-3 break-all font-mono text-sm text-ink">{track}</p>
          <p className="mt-3 max-w-xl text-sm text-mute">
            Quien entre con este link y cree una cuenta ProgramBI aparece acá como referido. También
            sirve si primero visita /cursos o /empresas: la cookie dura 90 días.
          </p>
          <div className="mt-5">
            <CopyLinkButton code={referrer.referral_code} always />
          </div>
        </div>
      ) : null}

      <KpiGrid stats={stats} loading={loading} />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Últimos referidos</h2>
          <Link
            href="/referidos/app/referidos"
            className="text-sm text-mute no-underline hover:text-ink hover:underline"
          >
            Ver todos
          </Link>
        </div>
        {!loading && referrals.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Todavía no hay referidos"
            description="Copia tu link y mándaselo a un amigo o a alguien de una empresa. Cuando se registren, aparecen acá."
          />
        ) : loading ? (
          <div className="h-40 animate-pulse rounded-2xl bg-wash" />
        ) : (
          <ReferralTable data={recent} />
        )}
      </div>
    </div>
  );
}
