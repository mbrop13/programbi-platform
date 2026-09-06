"use client";

import { Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useReferralData } from "@/components/referrals/app/use-referral-data";
import { EmptyState } from "@/components/referrals/empty-state";
import { CommissionBadge } from "@/components/referrals/status-badge";
import { formatClp, formatDateCl } from "@/lib/referrals/format";
import { NumberTicker } from "@/components/referrals/magic/number-ticker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ComisionesPage() {
  const { loading, stats, referrals } = useReferralData();
  const rows = referrals.filter((r) => r.commission);
  const chart = rows.map((r) => ({
    name: r.prospect_company.slice(0, 16),
    comisión: r.commission ? Number(r.commission.commission_amount_clp) : 0,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Comisiones</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          15% del neto cobrado. Pagada = transferencia hecha. Clawback 60 días.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MoneyCard label="Ganada" value={stats?.commissionEarnedClp ?? 0} loading={loading} />
        <MoneyCard label="Por pagar" value={stats?.commissionPayableClp ?? 0} loading={loading} />
        <MoneyCard label="Pagada" value={stats?.commissionPaidClp ?? 0} loading={loading} />
      </div>

      {loading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Todavía no hay comisiones"
          description="Aparecen cuando un Pack atribuido se cierra y se cobra."
          actionHref="/referidos/app/nueva"
          actionLabel="Enviar intro"
        />
      ) : (
        <>
          <div className="h-56 rounded-2xl border border-border bg-card p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatClp(Number(v ?? 0))} />
                <Bar dataKey="comisión" fill="#0f7a4d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Deal</TableHead>
                  <TableHead>15%</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Pago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium">{r.prospect_company}</div>
                      <div className="text-xs text-muted-foreground">{r.prospect_name}</div>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {formatClp(r.commission!.deal_amount_clp)}
                    </TableCell>
                    <TableCell className="tabular-nums text-emerald-800 dark:text-emerald-300">
                      {formatClp(r.commission!.commission_amount_clp)}
                    </TableCell>
                    <TableCell>
                      <CommissionBadge status={r.commission!.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.commission!.paid_at
                        ? `${formatDateCl(r.commission!.paid_at)} · ${r.commission!.payment_ref || "—"}`
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}

function MoneyCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-800 dark:text-emerald-300">
        {loading ? "…" : <NumberTicker value={value} format={(n) => formatClp(n)} />}
      </p>
    </div>
  );
}
