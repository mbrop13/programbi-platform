"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
import { useReferralData } from "@/components/referrals/app/use-referral-data";
import { KpiGrid } from "@/components/referrals/app/kpi-grid";
import { ReferralTable } from "@/components/referrals/app/referral-table";
import { EmptyState } from "@/components/referrals/empty-state";
import { SITE_URL } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ReferrerDashboardPage() {
  const { loading, error, referrer, stats, referrals } = useReferralData();
  const recent = referrals.slice(0, 6);
  const track = referrer
    ? `${SITE_URL}/cursos?ref=${encodeURIComponent(referrer.referral_code)}`
    : "";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {referrer ? `Hola, ${referrer.name.split(" ")[0]}` : "Panel"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Intros, pipeline y el 15% cuando se cobra el curso o la capacitación.
        </p>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <KpiGrid stats={stats} loading={loading} />

      {referrer ? (
        <div className="rounded-2xl border border-border bg-card p-4 text-sm">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Link opcional (cookie 90 días)
          </p>
          <p className="mt-2 break-all font-mono text-xs">{track}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            También sirve en /empresas. Sugiere atribución; un admin confirma. No spamear.
          </p>
        </div>
      ) : null}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Últimas intros</h2>
          <Link href="/referidos/app/referidos" className="text-sm text-muted-foreground hover:underline">
            Ver todas
          </Link>
        </div>
        {!loading && referrals.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Aún no tienes intros — manda la primera"
            description="Un amigo para un curso, o un equipo para una capacitación. Nosotros cerramos."
            actionHref="/referidos/app/nueva"
            actionLabel="Nueva intro"
          />
        ) : loading ? (
          <div className="h-40 animate-pulse rounded-2xl bg-muted" />
        ) : (
          <ReferralTable data={recent} />
        )}
      </div>

      <Link
        href="/referidos/app/nueva"
        className={cn(buttonVariants(), "h-10 px-4 no-underline md:hidden")}
      >
        Nueva intro
      </Link>
    </div>
  );
}
