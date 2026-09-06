"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CommissionBadge } from "@/components/referrals/status-badge";
import { formatClp, formatDateCl } from "@/lib/referrals/format";
import type { Commission, Referral, Referrer } from "@/lib/referrals/types";

type Row = Commission & { referral: Referral; referrer: Referrer | null };

export default function AdminComisionesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [refs, setRefs] = useState<Record<string, string>>({});

  const load = async () => {
    const res = await fetch("/api/referrals/admin/comisiones");
    const j = await res.json();
    setRows(j.commissions || []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const pay = async (row: Row) => {
    const paymentRef = refs[row.id] || "";
    if (paymentRef.length < 2) {
      toast.error("Ingresa referencia de transferencia.");
      return;
    }
    const res = await fetch(`/api/referrals/admin/intros/${row.referral_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "pay", paymentRef }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(j.error || "No se pudo marcar pagada.");
      return;
    }
    toast.success("Comisión marcada pagada");
    await load();
  };

  const clawback = async (row: Row) => {
    const reason = window.prompt("Razón del clawback (NC / devolución)");
    if (!reason || reason.trim().length < 3) return;
    const res = await fetch(`/api/referrals/admin/intros/${row.referral_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clawback", reason: reason.trim() }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(j.error || "No se pudo aplicar clawback.");
      return;
    }
    toast.success("Clawback aplicado");
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Comisiones</h1>
      {loading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referidor</TableHead>
                <TableHead>Venta</TableHead>
                <TableHead>Deal</TableHead>
                <TableHead>15%</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.referrer?.name}</div>
                    <div className="text-xs text-muted-foreground">{r.referrer?.email}</div>
                  </TableCell>
                  <TableCell>
                    {r.referral.prospect_company}
                    <div className="text-xs text-muted-foreground">{formatDateCl(r.created_at)}</div>
                  </TableCell>
                  <TableCell className="tabular-nums">{formatClp(r.deal_amount_clp)}</TableCell>
                  <TableCell className="tabular-nums text-emerald-800 dark:text-emerald-300">
                    {formatClp(r.commission_amount_clp)}
                  </TableCell>
                  <TableCell>
                    <CommissionBadge status={r.status} />
                  </TableCell>
                  <TableCell>
                    {r.status === "payable" || r.status === "accrued" ? (
                      <div className="flex items-center gap-2">
                        <Input
                          className="h-8 w-36"
                          placeholder="Ref. pago"
                          value={refs[r.id] || ""}
                          onChange={(e) => setRefs({ ...refs, [r.id]: e.target.value })}
                        />
                        <Button size="sm" onClick={() => pay(r)}>
                          Pagada
                        </Button>
                      </div>
                    ) : r.status === "paid" ? (
                      <Button size="sm" variant="destructive" onClick={() => clawback(r)}>
                        Clawback
                      </Button>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
