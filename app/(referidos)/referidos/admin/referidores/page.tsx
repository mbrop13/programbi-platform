"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { REFERRER_STATUS_LABELS, REFERRER_TYPE_LABELS } from "@/lib/referrals/status";
import type { Referrer } from "@/lib/referrals/types";

type Row = Referrer & { intros: number };

export default function AdminReferidoresPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/referrals/admin/referidores");
    const j = await res.json();
    setRows(j.referrers || []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const patch = async (id: string, status: Referrer["status"]) => {
    const res = await fetch(`/api/referrals/admin/referidores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("No se pudo actualizar.");
      return;
    }
    toast.success("Estado actualizado");
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Referidores</h1>
      {loading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Intros</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                  </TableCell>
                  <TableCell>{REFERRER_TYPE_LABELS[r.type]}</TableCell>
                  <TableCell>{REFERRER_STATUS_LABELS[r.status]}</TableCell>
                  <TableCell className="font-mono text-xs">{r.referral_code}</TableCell>
                  <TableCell>{r.intros}</TableCell>
                  <TableCell className="space-x-2">
                    {r.status !== "suspended" ? (
                      <Button size="sm" variant="outline" onClick={() => patch(r.id, "suspended")}>
                        Suspender
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => patch(r.id, "active")}>
                        Activar
                      </Button>
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
