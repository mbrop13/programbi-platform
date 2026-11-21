"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { courses } from "@/lib/data/courses";
import { leadCourses } from "@/lib/data/site";
import { getAntiBotFields } from "@/lib/antibot";
import { trackLeadSubmit } from "@/lib/analytics/marketing";
import { usePaisRuta } from "@/lib/paises/cliente";
import { muestraPrecioDirecto } from "@/config/paises";
import { textoCuotas } from "@/config/cuotas";
import { courseBrochureUrl, unlockPricesClient } from "@/lib/pricing-gate";
import { captureAndReadAttribution } from "@/lib/utm";

type Status = "idle" | "error" | "success";

/** Los títulos del formulario no siempre coinciden con los del catálogo. */
const courseSlugMap: Record<string, string> = {
  "Análisis de Datos": "analisis-de-datos",
  "Power BI": "power-bi",
  Python: "python",
  "SQL Server": "sql-server",
  Excel: "excel",
  "Microsoft Access": "access",
  "Machine Learning": "machine-learning",
  "IA en Productividad": "ia-productividad",
  "Power Automate": "power-automate",
  Minería: "analitica-mineria",
  "Mercado financiero": "mercado-financiero",
  Copilot: "copilot",
};

/** Slug del curso para el temario y el checkout; Power BI si no hay match. */
function slugDelPrograma(titulo: string | undefined): string {
  if (!titulo) return "power-bi";
  return courseSlugMap[titulo] || courses.find((curso) => curso.title === titulo)?.slug || "power-bi";
}

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
  const pais = usePaisRuta();
  const telefonoOpcional = muestraPrecioDirecto(pais);
  const cuotasPais = textoCuotas(pais);
  const destSlug = slugDelPrograma(selected[0]);

  const toggleCourse = (c: string) => {
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Escribe tu nombre.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Escribe un email válido.";
    if (!telefonoOpcional && (!whatsapp.trim() || whatsapp.replace(/\D/g, "").length < 8)) {
      next.whatsapp = "Escribe tu WhatsApp.";
    }
    if (selected.length === 0) next.course = "Elige al menos un programa.";
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

    // Autocomplete sometimes fills a "company" field; only treat clearly
    // bot-like values as honeypot hits so real quotes still send.
    const trap = honeypot.trim();
    if (trap && (trap.startsWith("http") || trap.length > 80 || /<script/i.test(trap))) {
      setStatus("success");
      return;
    }

    setSending(true);
    setStatus("idle");

    // El PDF se abre de forma síncrona dentro del submit: si se abre
    // después de un `await`, Safari y los navegadores móviles bloquean la
    // pestaña nueva. El desbloqueo de precios se persiste en el mismo gesto.
    window.open(courseBrochureUrl(destSlug, pais), "_blank", "noopener,noreferrer");
    unlockPricesClient({ name: name.trim(), email: email.trim(), whatsapp: whatsapp.trim() });

    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim() || null,
          message: message.trim() || null,
          selectedCourses: selected,
          leadType: "contact",
          pricingVariant: telefonoOpcional ? "direct" : "gate",
          pais,
          ...captureAndReadAttribution(),
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

      trackLeadSubmit("contact", "home_contact_section", destSlug, {
        form_name: "home_contact_section",
        country: pais,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrors({ form: err instanceof Error ? err.message : "Ocurrió un error. Intenta de nuevo." });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="cotizar" className="border-t border-[var(--h-border)] bg-[var(--h-bg)] py-16 lg:py-24">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-start lg:px-8 xl:gap-14">
        <div className="lg:col-span-5">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--h-ink)] sm:text-4xl lg:text-5xl">
            Cotiza Ahora
          </h2>
          <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-[var(--h-muted)]">
            {telefonoOpcional
              ? "Completa tu nombre y correo y abrimos el PDF del temario con fechas en tu horario y detalle del curso."
              : "Completa tus datos y abrimos el PDF de temario y precios con las fechas, los cupos y el detalle del curso."}
          </p>

          <dl className="mt-8 space-y-4 border-t border-[var(--h-border)] pt-6 text-sm">
            <div>
              <dt className="font-semibold text-[var(--h-ink)]">Temario por módulo</dt>
              <dd className="mt-1 text-[var(--h-muted)]">
                Contenido detallado de cada nivel y herramientas que se trabajan en clase.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--h-ink)]">Fechas y horarios en vivo</dt>
              <dd className="mt-1 text-[var(--h-muted)]">
                Próximas cohortes disponibles y duración total del programa elegido.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--h-ink)]">Arancel y medios de pago</dt>
              <dd className="mt-1 text-[var(--h-muted)]">
                Valores vigentes en tu país{cuotasPais ? `, incluyendo ${cuotasPais}` : ""}.
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-[var(--h-border-strong)] bg-[var(--h-surface)] p-6 sm:p-8">
            {status === "success" ? (
              <div className="py-2">
                <h3 className="text-xl font-bold tracking-tight text-[var(--h-ink)]">
                  Abrimos el PDF de temario y precios en una pestaña nueva.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--h-muted)] sm:text-base">
                  Ahí ves el temario completo, las fechas y el arancel vigente con los descuentos
                  {cuotasPais ? ` y las ${cuotasPais}` : ""}. Los precios de la web ya quedaron desbloqueados en este navegador.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={courseBrochureUrl(destSlug, pais)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--h-ink)] px-6 py-2.5 text-sm font-semibold text-[var(--h-surface)] transition-opacity hover:opacity-90 active:opacity-80"
                  >
                    Abrir temario y precios (PDF)
                  </a>
                  <Link
                    href={pais === "cl" ? `/pago?curso=${destSlug}` : `/pago?curso=${destSlug}&pais=${pais}`}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[var(--h-border-strong)] bg-[var(--h-surface)] px-6 py-2.5 text-sm font-semibold text-[var(--h-ink)] transition-colors hover:bg-[var(--h-wash)]"
                  >
                    Ir a inscripción y pago
                  </Link>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-5 text-sm">
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="inline-flex min-h-[44px] items-center font-medium text-[var(--h-ink)] underline underline-offset-4"
                  >
                    Cotizar otro programa
                  </button>
                  <Link
                    href="/cursos"
                    className="inline-flex min-h-[44px] items-center font-medium text-[var(--h-muted)] underline underline-offset-4 hover:text-[var(--h-ink)]"
                  >
                    Ver catálogo de cursos
                  </Link>
                </div>
                <p className="mt-3 text-xs text-[var(--h-subtle)]">
                  ¿No se abrió la pestaña? Usa el botón «Abrir temario y precios (PDF)».
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="relative space-y-5" noValidate>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                >
                  <label htmlFor="lead-website">Sitio web</label>
                  <input
                    id="lead-website"
                    name="_website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    id="name"
                    label="Nombre"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={setName}
                    error={errors.name}
                    autoComplete="name"
                  />
                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="nombre@correo.com"
                    value={email}
                    onChange={setEmail}
                    error={errors.email}
                    autoComplete="email"
                  />
                </div>

                <Field
                  id="whatsapp"
                  label={telefonoOpcional ? "Teléfono o WhatsApp (opcional)" : "WhatsApp"}
                  placeholder={telefonoOpcional ? "Opcional, con código de país" : "+56 9 1234 5678"}
                  value={whatsapp}
                  onChange={setWhatsapp}
                  error={errors.whatsapp}
                  autoComplete="tel"
                  helper={
                    telefonoOpcional
                      ? "En EE.UU. te respondemos por email; agrégalo solo si prefieres WhatsApp."
                      : "Incluye código de país. Chile: +56 9..."
                  }
                />

                <fieldset className="flex flex-col gap-2">
                  <legend className="text-sm font-medium text-[var(--h-ink)]">Programa</legend>
                  <p className="text-xs text-[var(--h-muted)]">Puedes elegir más de uno.</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {leadCourses.map((c) => {
                      const on = selected.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleCourse(c)}
                          aria-pressed={on}
                          className={`min-h-[44px] rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                            on
                              ? "border-[var(--h-ink)] bg-[var(--h-ink)] text-[var(--h-surface)]"
                              : "border-[var(--h-border-strong)] bg-[var(--h-surface)] text-[var(--h-ink)] hover:bg-[var(--h-wash)]"
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  {errors.course ? (
                    <p role="alert" className="text-sm font-medium text-[var(--danger)]">
                      {errors.course}
                    </p>
                  ) : null}
                </fieldset>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-medium text-[var(--h-ink)]">
                    Mensaje <span className="font-normal text-[var(--h-muted)]">(opcional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    placeholder="Cuéntanos tu nivel actual o qué objetivo buscas con el curso"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[88px] rounded-xl border border-[var(--h-border-strong)] bg-[var(--h-surface)] px-3.5 py-3 text-base text-[var(--h-ink)] placeholder:text-[var(--h-subtle)]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="flex min-h-[44px] cursor-pointer items-start gap-3 py-1 text-sm text-[var(--h-ink)]">
                    <input
                      type="checkbox"
                      checked={privacy}
                      onChange={(e) => setPrivacy(e.target.checked)}
                      className="mt-0.5 size-5 shrink-0 accent-[var(--h-ink)]"
                    />
                    <span>
                      Acepto la{" "}
                      <Link href="/privacidad" className="underline underline-offset-2">
                        política de privacidad
                      </Link>{" "}
                      y que ProgramBI me contacte sobre el programa elegido.
                    </span>
                  </label>
                  {errors.privacy ? (
                    <p role="alert" className="text-sm font-medium text-[var(--danger)]">
                      {errors.privacy}
                    </p>
                  ) : null}
                </div>

                {errors.form ? (
                  <p role="alert" className="text-sm font-medium text-[var(--danger)]">
                    {errors.form}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[var(--h-ink)] px-7 py-3 text-base font-semibold text-[var(--h-surface)] transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {sending ? "Abriendo temario y precios..." : "Ver temario y precios (PDF)"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  helper,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  helper?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[var(--h-ink)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[44px] rounded-xl border border-[var(--h-border-strong)] bg-[var(--h-surface)] px-3.5 py-2.5 text-base text-[var(--h-ink)] placeholder:text-[var(--h-subtle)]"
      />
      {helper ? <p className="text-xs text-[var(--h-muted)]">{helper}</p> : null}
      {error ? (
        <p role="alert" className="text-sm font-medium text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
