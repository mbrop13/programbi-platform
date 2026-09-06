"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { INTRO_SOURCES } from "@/lib/referrals/constants";
import { SOURCE_LABELS } from "@/lib/referrals/status";

export function IntroForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    prospectName: "",
    prospectCompany: "",
    prospectRole: "",
    prospectEmail: "",
    prospectPhone: "",
    prospectLinkedIn: "",
    notes: "",
    source: "whatsapp",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/referrals/intros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json.error || "No se pudo enviar la intro.");
        return;
      }
      toast.success("Intro enviada. El equipo la revisa antes de calificarla.");
      router.push("/referidos/app/referidos");
      router.refresh();
    } catch {
      toast.error("Error de red.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-4">
      <Field label="Nombre del contacto" htmlFor="prospectName">
        <Input
          id="prospectName"
          required
          minLength={2}
          className="h-10"
          value={form.prospectName}
          onChange={(e) => setForm({ ...form, prospectName: e.target.value })}
        />
      </Field>
      <Field label="Empresa" htmlFor="prospectCompany">
        <Input
          id="prospectCompany"
          required
          className="h-10"
          value={form.prospectCompany}
          onChange={(e) => setForm({ ...form, prospectCompany: e.target.value })}
        />
      </Field>
      <Field label="Cargo" htmlFor="prospectRole">
        <Input
          id="prospectRole"
          required
          placeholder="Controller, Control de Gestión…"
          className="h-10"
          value={form.prospectRole}
          onChange={(e) => setForm({ ...form, prospectRole: e.target.value })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email (opcional)" htmlFor="prospectEmail">
          <Input
            id="prospectEmail"
            type="email"
            className="h-10"
            value={form.prospectEmail}
            onChange={(e) => setForm({ ...form, prospectEmail: e.target.value })}
          />
        </Field>
        <Field label="WhatsApp (opcional)" htmlFor="prospectPhone">
          <Input
            id="prospectPhone"
            className="h-10"
            value={form.prospectPhone}
            onChange={(e) => setForm({ ...form, prospectPhone: e.target.value })}
          />
        </Field>
      </div>
      <Field label="LinkedIn (opcional)" htmlFor="prospectLinkedIn">
        <Input
          id="prospectLinkedIn"
          type="url"
          className="h-10"
          placeholder="https://www.linkedin.com/in/…"
          value={form.prospectLinkedIn}
          onChange={(e) => setForm({ ...form, prospectLinkedIn: e.target.value })}
        />
      </Field>
      <Field label="Cómo lo conoces" htmlFor="source">
        <select
          id="source"
          className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
        >
          {INTRO_SOURCES.map((s) => (
            <option key={s} value={s}>
              {SOURCE_LABELS[s]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Contexto (dolor Excel, área, timing)" htmlFor="notes">
        <Textarea
          id="notes"
          rows={4}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </Field>
      <p className="text-xs text-muted-foreground">
        Máximo 5 intros por día. El equipo califica a mano — no mandes listas frías.
      </p>
      <Button type="submit" disabled={loading} className="h-10 px-5">
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Enviar intro"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
