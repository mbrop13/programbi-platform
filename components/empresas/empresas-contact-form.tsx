"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { getAntiBotFields } from "@/lib/antibot";
import { trackLeadSubmit } from "@/lib/analytics/marketing";
import { readBrowserReferralCode } from "@/lib/referrals/cookie";
import { whatsappHref } from "@/lib/whatsapp";

type Status = "idle" | "error" | "success";

const TOPICS = [
  "Power BI",
  "SQL Server",
  "Python",
  "Excel",
  "Power Automate",
  "IA en Productividad",
] as const;

const TEAM_SIZES = ["1–5", "6–12", "13–30", "Más de 30"] as const;

const WA = whatsappHref({
  page: "/empresas",
  intent: "empresas",
});

export function EmpresasContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const formLoadedAt = useRef(Date.now());

  const toggleTopic = (topic: string) => {
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((x) => x !== topic) : [...prev, topic]
    );
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Escribe tu nombre.";
    if (!company.trim()) next.company = "Escribe el nombre de la empresa.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Escribe un email válido.";
    }
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, "").length < 8) {
      next.whatsapp = "Escribe tu WhatsApp.";
    }
    if (!privacy) next.privacy = "Debes aceptar la política de privacidad.";
    return next;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("error");
      return;
    }

    const trap = honeypot.trim();
    if (trap && (trap.startsWith("http") || trap.length > 80 || /<script/i.test(trap))) {
      setStatus("success");
      return;
    }

    setSending(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          company: company.trim(),
          position: position.trim() || null,
          employeeCount: employeeCount || null,
          message: message.trim() || null,
          selectedCourses: selected,
          leadType: "asesoria_b2b",
          landing_path: "/empresas",
          referral_code: readBrowserReferralCode(),
          ...getAntiBotFields(formLoadedAt.current, ""),
        }),
      });

      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("No se pudo enviar. Intenta de nuevo.");
      }
      if (!res.ok) throw new Error(data.error || "Error al enviar");

      trackLeadSubmit("asesoria_b2b", "empresas_contact", selected[0]);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrors({
        form: err instanceof Error ? err.message : "Ocurrió un error. Intenta de nuevo.",
      });
    } finally {
      setSending(false);
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-paper px-6 py-8 sm:px-8">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
          Listo
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">
          Recibimos tu mensaje.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          Te escribimos por WhatsApp o email con una propuesta: temas, formato y
          valor. Si quieres adelantar, escríbenos ahora.
        </p>
        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-7 text-[14.5px] font-semibold text-canvas no-underline transition-transform active:scale-[0.98]"
        >
          Escribir por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-2xl border border-line bg-paper p-5 sm:p-7"
      noValidate
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor="empresas-website">Sitio web</label>
        <input
          id="empresas-website"
          name="_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          id="emp-name"
          label="Nombre"
          value={name}
          onChange={setName}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          id="emp-company"
          label="Empresa"
          value={company}
          onChange={setCompany}
          error={errors.company}
          autoComplete="organization"
        />
        <Field
          id="emp-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          id="emp-whatsapp"
          label="WhatsApp"
          value={whatsapp}
          onChange={setWhatsapp}
          error={errors.whatsapp}
          autoComplete="tel"
          helper="Incluye código de país. Chile: +56 9..."
        />
      </div>

      <div className="mt-4">
        <Field
          id="emp-position"
          label="Cargo"
          value={position}
          onChange={setPosition}
          autoComplete="organization-title"
          optional
        />
      </div>

      <fieldset className="mt-5 flex flex-col gap-2">
        <legend className="text-sm font-medium text-ink">
          Personas a capacitar{" "}
          <span className="font-normal text-mute">(opcional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {TEAM_SIZES.map((size) => {
            const on = employeeCount === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setEmployeeCount(on ? "" : size)}
                aria-pressed={on}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                  on
                    ? "border-ink bg-ink text-canvas"
                    : "border-line-strong bg-paper text-ink hover:border-ink/40"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-5 flex flex-col gap-2">
        <legend className="text-sm font-medium text-ink">
          Temas{" "}
          <span className="font-normal text-mute">(opcional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic) => {
            const on = selected.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                aria-pressed={on}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                  on
                    ? "border-ink bg-ink text-canvas"
                    : "border-line-strong bg-paper text-ink hover:border-ink/40"
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="emp-message" className="text-sm font-medium text-ink">
          Qué necesita el equipo{" "}
          <span className="font-normal text-mute">(opcional)</span>
        </label>
        <textarea
          id="emp-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ej: área de control de gestión, 8 personas, hoy todo está en Excel."
          className="rounded-xl border border-line-strong bg-paper px-3 py-3 text-base text-ink placeholder:text-faint"
        />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
            className="mt-1 size-4 accent-ink"
          />
          <span>
            Acepto la{" "}
            <Link href="/privacidad" className="underline underline-offset-2">
              política de privacidad
            </Link>{" "}
            y que ProgramBI me contacte sobre esta capacitación.
          </span>
        </label>
        {errors.privacy ? <p className="text-sm text-ink">{errors.privacy}</p> : null}
      </div>

      {errors.form ? <p className="mt-3 text-sm text-ink">{errors.form}</p> : null}

      <button
        type="submit"
        disabled={sending}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-8 text-base font-semibold text-canvas transition-transform active:scale-[0.98] disabled:opacity-60 sm:w-auto"
      >
        {sending ? "Enviando…" : "Pedir una propuesta"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  helper,
  optional,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  helper?: string;
  optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {optional ? <span className="font-normal text-mute"> (opcional)</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl border border-line-strong bg-canvas px-3 text-base text-ink placeholder:text-faint"
      />
      {helper ? <p className="text-xs text-mute">{helper}</p> : null}
      {error ? <p className="text-sm text-ink">{error}</p> : null}
    </div>
  );
}
