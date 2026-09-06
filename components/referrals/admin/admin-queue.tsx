"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { LeadHint, ReferralStatus, ReferralWithCommission } from "@/lib/referrals/types";
import { KANBAN_COLUMNS, ADMIN_TRANSITIONS } from "@/lib/referrals/status";
import { StatusBadge } from "../status-badge";
import { formatClp, formatDateCl } from "@/lib/referrals/format";
import { calculateCommissionClp } from "@/lib/referrals/commission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminQueue() {
  const [rows, setRows] = useState<ReferralWithCommission[]>([]);
  const [hints, setHints] = useState<LeadHint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [view, setView] = useState<"table" | "kanban">("table");
  const [active, setActive] = useState<ReferralWithCommission | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/referrals/admin/intros");
    const j = await res.json();
    if (!res.ok) {
      toast.error(j.error || "No se pudo cargar.");
      setLoading(false);
      return;
    }
    setRows(j.referrals || []);
    setHints(j.hints || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-2xl font-semibold tracking-tight">Cola de intros</h1>
        <select
          className="h-9 rounded-lg border border-input bg-transparent px-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          {KANBAN_COLUMNS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={() => setView(view === "table" ? "kanban" : "table")}>
          {view === "table" ? "Kanban" : "Tabla"}
        </Button>
      </div>

      {hints.length > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-500/20 dark:bg-amber-500/10">
          <p className="font-medium">Atribución sugerida (cookie ?ref=) — confirmar a mano</p>
          <ul className="mt-2 space-y-1 text-xs">
            {hints.map((h) => (
              <li key={h.id}>
                {h.referral_code} · {h.lead_name} · {h.lead_company} · {h.lead_email}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      ) : view === "kanban" ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const items = rows.filter((r) => r.status === col.id);
            return (
              <div key={col.id} className="w-64 shrink-0 rounded-2xl border border-border bg-muted/30 p-2">
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  {col.label} · {items.length}
                </p>
                <div className="space-y-2">
                  {items.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setActive(r)}
                      className="w-full rounded-xl border border-border bg-card p-3 text-left text-sm"
                    >
                      <div className="font-medium">{r.prospect_company}</div>
                      <div className="text-xs text-muted-foreground">{r.prospect_name}</div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {r.referrer?.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prospecto</TableHead>
                <TableHead>Referidor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.prospect_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.prospect_company} · {r.prospect_role}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {r.referrer?.name}
                    <div className="text-xs text-muted-foreground">{r.referrer?.referral_code}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-xs">{formatDateCl(r.created_at)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setActive(r)}>
                      Acciones
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {active ? (
        <ActionDialog
          row={active}
          onClose={() => setActive(null)}
          onDone={async () => {
            setActive(null);
            setLoading(true);
            await load();
          }}
        />
      ) : null}
    </div>
  );
}

function ActionDialog({
  row,
  onClose,
  onDone,
}: {
  row: ReferralWithCommission;
  onClose: () => void;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [deal, setDeal] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const preview = calculateCommissionClp(Number(deal) || 0);
  const nexts = ADMIN_TRANSITIONS[row.status] || [];

  const act = async (action: string, extra: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/referrals/admin/intros/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j.error || "Falló la acción.");
        return;
      }
      toast.success("Actualizado");
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {row.prospect_name} · {row.prospect_company}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            {row.prospect_role} · {row.prospect_email || "sin email"} · {row.prospect_phone || "sin tel"}
          </p>
          <p>{row.notes}</p>
          <StatusBadge status={row.status} />
          {row.commission ? (
            <p className="text-emerald-800 dark:text-emerald-300">
              Comisión {formatClp(row.commission.commission_amount_clp)} ({row.commission.status})
            </p>
          ) : null}

          {nexts.filter((s) => s !== "won" && s !== "lost").length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {nexts
                .filter((s) => s !== "won" && s !== "lost")
                .map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => act("status", { status: s as ReferralStatus, note })}
                  >
                    {s === "qualified"
                      ? "Calificar"
                      : s === "diagnosis_scheduled"
                        ? "Agendar diagnóstico"
                        : s === "proposal_sent"
                          ? "Propuesta enviada"
                          : s === "in_review"
                            ? "En revisión"
                            : s}
                  </Button>
                ))}
            </div>
          ) : null}

          <Textarea
            placeholder="Nota interna (opcional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {row.status === "proposal_sent" ? (
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-medium">Won + cobrado (monto neto CLP)</p>
              <Input
                className="mt-2 h-10"
                inputMode="numeric"
                placeholder="2900000"
                value={deal}
                onChange={(e) => setDeal(e.target.value.replace(/\D/g, ""))}
              />
              <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                Comisión 15% = {formatClp(preview)}
              </p>
              <Button
                className="mt-3 h-9"
                disabled={busy || !deal}
                onClick={() => act("won", { dealAmountClp: Number(deal), note })}
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Marcar ganada"}
              </Button>
            </div>
          ) : null}

          {row.status === "won" && row.commission ? (
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-medium">Marcar comisión pagada</p>
              <Input
                className="mt-2 h-10"
                placeholder="N° transferencia / ref"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
              />
              <Button
                className="mt-3 h-9"
                disabled={busy || paymentRef.length < 2}
                onClick={() => act("pay", { paymentRef })}
              >
                Marcar pagada
              </Button>
            </div>
          ) : null}

          {row.status === "paid" && row.commission ? (
            <div className="rounded-xl border border-destructive/20 p-3">
              <p className="text-xs font-medium">Clawback</p>
              <Input
                className="mt-2 h-10"
                placeholder="Razón (NC / devolución)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <Button
                variant="destructive"
                className="mt-3 h-9"
                disabled={busy || reason.length < 3}
                onClick={() => act("clawback", { reason })}
              >
                Aplicar clawback
              </Button>
            </div>
          ) : null}

          {nexts.includes("lost") || row.status === "lost" ? (
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-medium">Perdida</p>
              <Input
                className="mt-2 h-10"
                placeholder="Razón"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <Button
                variant="outline"
                className="mt-3 h-9"
                disabled={busy || reason.length < 3}
                onClick={() => act("lost", { reason })}
              >
                Marcar perdida
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
