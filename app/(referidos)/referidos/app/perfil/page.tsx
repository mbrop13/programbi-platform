"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CHILE_ACCOUNT_TYPES, CHILE_BANKS, REFERRER_TYPES } from "@/lib/referrals/constants";
import { REFERRER_TYPE_LABELS } from "@/lib/referrals/status";
import { SITE_URL } from "@/lib/seo";

type BankPublic = {
  bank: string;
  accountType: string;
  accountLast4: string;
  rut: string;
  accountHolder: string;
} | null;

export default function PerfilPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState("");
  const [bankPublic, setBankPublic] = useState<BankPublic>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: "other",
    bank: "",
    accountType: "Corriente",
    accountNumber: "",
    rut: "",
    accountHolder: "",
  });

  useEffect(() => {
    fetch("/api/referrals/profile")
      .then((r) => r.json())
      .then((j) => {
        setCode(j.referrer?.referral_code || "");
        setBankPublic(j.bank);
        setForm((f) => ({
          ...f,
          name: j.referrer?.name || "",
          phone: j.referrer?.phone || "",
          type: j.referrer?.type || "other",
          bank: j.bank?.bank || "",
          accountType: j.bank?.accountType || "Corriente",
          rut: j.bank?.rut || "",
          accountHolder: j.bank?.accountHolder || "",
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        phone: form.phone,
        type: form.type,
      };
      if (form.accountNumber && form.bank && form.rut) {
        payload.bank = {
          bank: form.bank,
          accountType: form.accountType,
          accountNumber: form.accountNumber,
          rut: form.rut,
          accountHolder: form.accountHolder || form.name,
        };
      }
      const res = await fetch("/api/referrals/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j.error || "No se pudo guardar.");
        return;
      }
      setBankPublic(j.bank);
      toast.success("Perfil actualizado.");
      setForm((f) => ({ ...f, accountNumber: "" }));
    } catch {
      toast.error("Error de red.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">Perfil y datos bancarios</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Cuenta chilena para el 15%. Ciframos en reposo. Nunca va a logs.
      </p>
      <form onSubmit={save} className="space-y-4">
        <Field label="Nombre" htmlFor="name">
          <Input id="name" className="h-10" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="WhatsApp" htmlFor="phone">
          <Input id="phone" className="h-10" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
        <Field label="Tipo" htmlFor="type">
          <select
            id="type"
            className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {REFERRER_TYPES.map((t) => (
              <option key={t} value={t}>
                {REFERRER_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </Field>
        <div className="rounded-2xl border border-border p-4">
          <p className="text-sm font-medium">Cuenta para transferencias</p>
          {bankPublic ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {bankPublic.bank} · {bankPublic.accountType} · •••• {bankPublic.accountLast4} · {bankPublic.rut}
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">Aún no hay cuenta registrada.</p>
          )}
          <div className="mt-4 space-y-3">
            <Field label="Banco" htmlFor="bank">
              <select
                id="bank"
                className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={form.bank}
                onChange={(e) => setForm({ ...form, bank: e.target.value })}
              >
                <option value="">Selecciona</option>
                {CHILE_BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tipo de cuenta" htmlFor="accountType">
              <select
                id="accountType"
                className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                value={form.accountType}
                onChange={(e) => setForm({ ...form, accountType: e.target.value })}
              >
                {CHILE_ACCOUNT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Número de cuenta" htmlFor="accountNumber">
              <Input
                id="accountNumber"
                className="h-10"
                autoComplete="off"
                placeholder={bankPublic ? "Ingresa de nuevo para actualizar" : ""}
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              />
            </Field>
            <Field label="RUT titular" htmlFor="rut">
              <Input id="rut" className="h-10" value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} />
            </Field>
            <Field label="Nombre titular" htmlFor="accountHolder">
              <Input
                id="accountHolder"
                className="h-10"
                value={form.accountHolder}
                onChange={(e) => setForm({ ...form, accountHolder: e.target.value })}
              />
            </Field>
          </div>
        </div>
        <div className="rounded-xl bg-muted/50 p-3 font-mono text-xs">
          Código: {code}
          <div className="mt-1 break-all text-muted-foreground">
            {SITE_URL}/empresas?ref={code}
          </div>
        </div>
        <Button type="submit" disabled={saving} className="h-10 px-5">
          {saving ? <Loader2 className="size-4 animate-spin" /> : "Guardar"}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
