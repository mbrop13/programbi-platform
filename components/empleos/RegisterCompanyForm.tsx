"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { COMPANY_SIZE_LABELS } from "@/lib/jobs/types";

const inputClass =
  "h-12 w-full rounded-xl border border-line-strong bg-paper px-3 text-base text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25";

const labelClass = "text-xs font-semibold text-mute";

export default function RegisterCompanyForm() {
  const [form, setForm] = useState({
    name: "",
    website: "",
    industry: "",
    size: "",
    city: "",
    contact_email: "",
    contact_whatsapp: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async () => {
    setError(null);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setNeedsLogin(true);
      window.dispatchEvent(new Event("open-auth-modal"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/employer/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          website: form.website || null,
          industry: form.industry || null,
          size: form.size || null,
          city: form.city || null,
          contact_email: form.contact_email,
          contact_whatsapp: form.contact_whatsapp || null,
          description: form.description || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No pudimos registrar tu empresa.");
        return;
      }
      setDone(true);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-[22px] border border-line bg-paper p-8 text-center shadow-[0_20px_60px_rgba(23,23,22,0.06)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-canvas">
          <Check size={22} strokeWidth={2.4} />
        </div>
        <h3 className="mt-4 text-xl font-bold tracking-tight text-ink">
          Empresa registrada
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-mute">
          Recibimos la solicitud de «{form.name}». Te notificaremos por correo cuando
          tu empresa esté aprobada para publicar vacantes (menos de 24 h hábiles).
        </p>
        <Link
          href="/comunidad/empleos"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-7 text-sm font-semibold text-canvas transition-transform active:scale-[0.98]"
        >
          Ir a mi panel
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border border-line bg-paper p-6 shadow-[0_20px_60px_rgba(23,23,22,0.06)] sm:p-8">
      <h3 className="text-xl font-bold tracking-tight text-ink">Registrar mi empresa</h3>
      <p className="mt-1 text-sm text-mute">
        Revisamos cada empresa antes de aprobarla: así mantenemos una bolsa libre de spam.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="rc-name" className={labelClass}>Nombre de la empresa *</label>
          <input id="rc-name" autoComplete="organization" className={`${inputClass} mt-1.5`} value={form.name} onChange={set("name")} placeholder="Ej. Minería Datos SpA" />
        </div>
        <div>
          <label htmlFor="rc-website" className={labelClass}>Sitio web</label>
          <input id="rc-website" type="url" inputMode="url" autoComplete="url" className={`${inputClass} mt-1.5`} value={form.website} onChange={set("website")} placeholder="https://…" />
        </div>
        <div>
          <label htmlFor="rc-industry" className={labelClass}>Industria</label>
          <input id="rc-industry" className={`${inputClass} mt-1.5`} value={form.industry} onChange={set("industry")} placeholder="Minería, banca, retail…" />
        </div>
        <div>
          <label htmlFor="rc-size" className={labelClass}>Tamaño</label>
          <select id="rc-size" className={`${inputClass} mt-1.5`} value={form.size} onChange={set("size")}>
            <option value="">Seleccionar</option>
            {Object.entries(COMPANY_SIZE_LABELS).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rc-city" className={labelClass}>Ciudad</label>
          <input id="rc-city" autoComplete="address-level2" className={`${inputClass} mt-1.5`} value={form.city} onChange={set("city")} placeholder="Santiago" />
        </div>
        <div>
          <label htmlFor="rc-email" className={labelClass}>Email de contacto *</label>
          <input id="rc-email" type="email" inputMode="email" autoComplete="email" className={`${inputClass} mt-1.5`} value={form.contact_email} onChange={set("contact_email")} placeholder="rrhh@empresa.cl" />
        </div>
        <div>
          <label htmlFor="rc-whatsapp" className={labelClass}>WhatsApp</label>
          <input id="rc-whatsapp" type="tel" inputMode="tel" autoComplete="tel" className={`${inputClass} mt-1.5`} value={form.contact_whatsapp} onChange={set("contact_whatsapp")} placeholder="+56 9 …" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="rc-description" className={labelClass}>Descripción breve</label>
          <textarea
            id="rc-description"
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-line-strong bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
            value={form.description}
            onChange={set("description")}
            placeholder="Qué hace tu empresa y qué tipo de talento buscan…"
            maxLength={2000}
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-[#dc2626]">{error}</p>}
      {needsLogin && (
        <p className="mt-4 text-sm font-medium text-mute">
          Primero crea tu cuenta o inicia sesión, y vuelve a enviar el formulario.
        </p>
      )}

      <button
        onClick={submit}
        disabled={loading || !form.name.trim() || !form.contact_email.trim()}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-base font-semibold text-canvas transition-transform active:scale-[0.98] disabled:opacity-50 sm:w-auto"
      >
        {loading ? <Loader2 size={17} className="animate-spin" /> : <ChevronRight size={17} strokeWidth={2.4} />}
        {loading ? "Enviando…" : "Enviar para aprobación"}
      </button>
    </div>
  );
}
