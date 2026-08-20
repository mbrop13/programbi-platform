"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { leadCourses } from "@/lib/data/site";
import { contactGallery } from "@/lib/data/images";
import { getAntiBotFields } from "@/lib/antibot";
import { trackLeadSubmit } from "@/lib/analytics/marketing";
import CourseImage from "@/components/shared/CourseImage";

type Status = "idle" | "error" | "success";

const courseSlugMap: Record<string, string> = {
  "Análisis de Datos": "analisis-de-datos",
  "Power BI": "power-bi",
  Python: "python",
  "SQL Server": "sql-server",
  Excel: "excel",
  "Machine Learning": "machine-learning",
  "IA en Productividad": "ia-productividad",
  "Power Automate": "power-automate",
  Minería: "analitica-mineria",
  Finanzas: "analitica-financiera",
  Copilot: "copilot",
};

export default function LeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const formLoadedAt = useRef(Date.now());

  const toggleCourse = (c: string) => {
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Escribe tu nombre.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Escribe un email válido.";
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, "").length < 8) next.whatsapp = "Escribe tu WhatsApp.";
    if (selected.length === 0) next.course = "Elige al menos un programa.";
    if (!privacy) next.privacy = "Debes aceptar la política de privacidad.";
    return next;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("error");
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
          message: message.trim() || null,
          selectedCourses: selected,
          leadType: "contact",
          ...getAntiBotFields(formLoadedAt.current, honeypot),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar");

      const destSlug = courseSlugMap[selected[0]] || "";
      trackLeadSubmit("contact", "home_contact_section", destSlug || undefined);
      setStatus("success");

      setTimeout(() => {
        window.location.href = destSlug ? `/pago?curso=${destSlug}` : "/pago";
      }, 2500);
    } catch (err) {
      setStatus("error");
      setErrors({ form: err instanceof Error ? err.message : "Ocurrió un error. Intenta de nuevo." });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="cotizar" className="border-t border-line">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        <div className="px-4 py-16 sm:px-6 lg:px-16 lg:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">Cotiza Ahora</h2>
          <p className="mt-4 max-w-[36rem] text-base leading-relaxed text-mute">
            Te respondemos con fechas, cupos y el plan de estudios.
          </p>

          {status === "success" ? (
            <p className="mt-10 max-w-[36rem] rounded-2xl border border-line bg-paper px-5 py-6 text-base text-ink">
              Recibimos tu cotización. En un momento te llevamos al pago, o escríbenos al +56 9 3540 9699.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 max-w-[36rem] space-y-5" noValidate>
              <label className="sr-only" htmlFor="company">
                Empresa
              </label>
              <input
                id="company"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field id="name" label="Nombre" value={name} onChange={setName} error={errors.name} autoComplete="name" />
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  error={errors.email}
                  autoComplete="email"
                />
              </div>
              <Field
                id="whatsapp"
                label="WhatsApp"
                value={whatsapp}
                onChange={setWhatsapp}
                error={errors.whatsapp}
                autoComplete="tel"
                helper="Incluye código de país. Chile: +56 9..."
              />

              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium text-ink">Programa</legend>
                <p className="text-xs text-mute">Puedes elegir más de uno.</p>
                <div className="flex flex-wrap gap-2">
                  {leadCourses.map((c) => {
                    const on = selected.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCourse(c)}
                        aria-pressed={on}
                        className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                          on
                            ? "border-ink bg-ink text-canvas"
                            : "border-line-strong bg-paper text-ink hover:border-ink/40"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
                {errors.course ? <p className="text-sm text-ink">{errors.course}</p> : null}
              </fieldset>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-ink">
                  Mensaje <span className="font-normal text-mute">(opcional)</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-xl border border-line-strong bg-paper px-3 py-3 text-base text-ink"
                />
              </div>

              <div className="flex flex-col gap-2">
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
                    y que ProgramBI me contacte sobre el programa elegido.
                  </span>
                </label>
                {errors.privacy ? <p className="text-sm text-ink">{errors.privacy}</p> : null}
              </div>

              {errors.form ? <p className="text-sm text-ink">{errors.form}</p> : null}

              <button
                type="submit"
                disabled={sending}
                className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-base font-semibold text-canvas transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                {sending ? "Enviando…" : "Cotiza Ahora"}
              </button>
            </form>
          )}
        </div>

        <div className="grid min-h-[520px] grid-cols-2 grid-rows-2 gap-2 bg-canvas p-4 lg:min-h-full lg:p-6">
          {contactGallery.map((item, i) => (
            <div
              key={item.url}
              className={`relative overflow-hidden rounded-[22px] border border-line ${
                item.tall ? "row-span-2" : ""
              }`}
            >
              <CourseImage
                src={item.url}
                alt={item.label}
                fill
                sizes={i === 0 ? "(max-width: 1024px) 50vw, 28vw" : "(max-width: 1024px) 50vw, 22vw"}
                className={`object-cover ${item.object}`}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-3 py-3">
                <p className="text-sm font-semibold text-canvas">{item.label}</p>
                <p className="text-[11px] text-canvas/80">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  helper?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl border border-line-strong bg-paper px-3 text-base text-ink placeholder:text-faint"
      />
      {helper ? <p className="text-xs text-mute">{helper}</p> : null}
      {error ? <p className="text-sm text-ink">{error}</p> : null}
    </div>
  );
}
