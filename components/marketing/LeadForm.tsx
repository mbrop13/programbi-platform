"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { courses } from "@/lib/data/courses";
import { leadCourses } from "@/lib/data/site";
import { contactGallery } from "@/lib/data/images";
import { getAntiBotFields } from "@/lib/antibot";
import { trackLeadSubmit } from "@/lib/analytics/marketing";
import CourseImage from "@/components/shared/CourseImage";
import { usePaisRuta } from "@/lib/paises/cliente";
import { getPais, muestraPrecioDirecto } from "@/config/paises";
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

function CheckIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

function ChevronIcon({
  direction,
  className = "size-4",
}: {
  direction: "prev" | "next";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={direction === "prev" ? "M10 3.5 5.5 8 10 12.5" : "M6 3.5 10.5 8 6 12.5"} />
    </svg>
  );
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
  const [activePhoto, setActivePhoto] = useState(0);
  const formLoadedAt = useRef(Date.now());
  const pais = usePaisRuta();
  const telefonoOpcional = muestraPrecioDirecto(pais);
  const cuotasPais = textoCuotas(pais);
  const destSlug = slugDelPrograma(selected[0]);
  const currentPhoto = contactGallery[activePhoto];

  const prevPhoto = () => {
    setActivePhoto((prev) => (prev === 0 ? contactGallery.length - 1 : prev - 1));
  };
  const nextPhoto = () => {
    setActivePhoto((prev) => (prev === contactGallery.length - 1 ? 0 : prev + 1));
  };

  const toggleCourse = (c: string) => {
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
    if (errors.course) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.course;
        return next;
      });
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Escribe tu nombre.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Escribe un correo electrónico válido.";
    const waDigits = whatsapp.replace(/\D/g, "");
    if (waDigits.length > 0 && waDigits.length < 7) {
      next.whatsapp = "Si ingresas WhatsApp, incluye al menos 7 dígitos.";
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
    <section id="cotizar" className="border-t border-border bg-bg">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24 xl:px-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 xl:gap-14">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Cotiza ahora
            </h2>
            <p className="mt-2 text-lg font-medium text-text-primary">
              Recibe temario, fechas y valores
            </p>
            <p className="mt-3 max-w-[34rem] text-[15px] leading-relaxed text-text-secondary">
              {telefonoOpcional
                ? "Completa tu nombre y correo para abrir el brochure PDF del programa con fechas en tu horario."
                : "Selecciona el programa que te interesa y abre al instante el brochure PDF con fechas, cupos y valores."}
            </p>

            <div className="mt-7">
              <figure className="overflow-hidden rounded-2xl border border-border bg-surface">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f0f1f4] dark:bg-[#181920]">
                  <CourseImage
                    src={currentPhoto.url}
                    alt={`Clases presenciales ProgramBI: ${currentPhoto.label} - ${currentPhoto.subtitle}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className={currentPhoto.tall ? "object-contain" : `object-cover ${currentPhoto.object}`}
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">{currentPhoto.label}</p>
                    <p className="truncate text-xs text-text-secondary">{currentPhoto.subtitle}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="mr-1 text-xs font-medium text-text-muted tabular-nums">
                      {String(activePhoto + 1).padStart(2, "0")} / {String(contactGallery.length).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={prevPhoto}
                      aria-label="Foto anterior"
                      className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg border border-border bg-bg/70 text-text-primary transition-colors hover:border-border-strong hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa] sm:min-h-[36px] sm:min-w-[36px]"
                    >
                      <ChevronIcon direction="prev" className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextPhoto}
                      aria-label="Siguiente foto"
                      className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg border border-border bg-bg/70 text-text-primary transition-colors hover:border-border-strong hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa] sm:min-h-[36px] sm:min-w-[36px]"
                    >
                      <ChevronIcon direction="next" className="size-4" />
                    </button>
                  </div>
                </figcaption>
              </figure>

              <div className="mt-3 grid grid-cols-3 gap-2.5" role="group" aria-label="Galería de clases presenciales">
                {contactGallery.map((item, idx) => {
                  const isActive = idx === activePhoto;
                  return (
                    <button
                      key={item.url}
                      type="button"
                      onClick={() => setActivePhoto(idx)}
                      aria-pressed={isActive}
                      aria-label={`Ver foto ${idx + 1}: ${item.label} (${item.subtitle})`}
                      className={`group relative aspect-[16/10] min-h-[44px] w-full cursor-pointer overflow-hidden rounded-xl border-2 bg-[#f0f1f4] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:bg-[#181920] dark:focus-visible:outline-[#60a5fa] ${
                        isActive
                          ? "border-[#0b63c5] dark:border-[#60a5fa]"
                          : "border-border opacity-75 hover:border-border-strong hover:opacity-100"
                      }`}
                    >
                      <CourseImage
                        src={item.url}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 30vw, 14vw"
                        className={item.tall ? "object-cover object-[center_35%]" : `object-cover ${item.object}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border-strong bg-surface p-6 shadow-[0_18px_48px_-24px_rgba(17,24,39,0.10)] dark:shadow-[0_18px_48px_-24px_rgba(0,0,0,0.45)] sm:p-8 lg:p-9">
              {status === "success" ? (
                <div className="space-y-6">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-[#0b63c5]/30 bg-[#0b63c5]/[0.08] text-[#0b63c5] dark:border-[#60a5fa]/35 dark:bg-[#60a5fa]/[0.14] dark:text-[#60a5fa]">
                      <CheckIcon className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-text-primary">
                        Solicitud enviada, temario abierto
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                        Abrimos el brochure PDF con el temario completo, las fechas en vivo y los valores vigentes
                        {cuotasPais ? ` incluyendo ${cuotasPais}` : ""}. Los precios del sitio quedaron desbloqueados en este navegador.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={courseBrochureUrl(destSlug, pais)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[46px] cursor-pointer items-center justify-center rounded-xl bg-text-primary px-6 text-sm font-medium text-surface transition-opacity hover:opacity-92 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa]"
                    >
                      Abrir temario y precios (PDF)
                    </a>
                    <Link
                      href={pais === "cl" ? `/pago?curso=${destSlug}` : `/pago?curso=${destSlug}&pais=${pais}`}
                      className="inline-flex min-h-[46px] cursor-pointer items-center justify-center rounded-xl border border-border-strong bg-bg/70 px-6 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa]"
                    >
                      Ir a inscripción y pago
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 border-t border-border pt-4 text-sm">
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="inline-flex min-h-[44px] cursor-pointer items-center font-medium text-text-primary underline underline-offset-4 hover:text-[#0b63c5] dark:hover:text-[#60a5fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa]"
                    >
                      Cotizar otro programa
                    </button>
                    <Link
                      href="/cursos"
                      className="inline-flex min-h-[44px] cursor-pointer items-center font-medium text-text-secondary underline underline-offset-4 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa]"
                    >
                      Ver catálogo de cursos
                    </Link>
                  </div>

                  <p className="text-xs text-text-muted">
                    Si el navegador bloqueó la pestaña emergente, usa el botón &ldquo;Abrir temario y precios (PDF)&rdquo;.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="relative space-y-6" noValidate>
                  <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
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

                  <fieldset className="space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <legend className="text-sm font-semibold text-text-primary">
                        1. Selecciona tu programa
                      </legend>
                      <span className="tabular-nums text-xs text-text-muted">
                        {selected.length > 0
                          ? `${selected.length} ${selected.length === 1 ? "programa seleccionado" : "programas seleccionados"}`
                          : "Puedes elegir uno o más"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {leadCourses.map((c) => {
                        const on = selected.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => toggleCourse(c)}
                            aria-pressed={on}
                            className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa] sm:min-h-[38px] ${
                              on
                                ? "border-[#0b63c5] bg-[#0b63c5]/[0.08] text-text-primary dark:border-[#60a5fa] dark:bg-[#60a5fa]/[0.14]"
                                : "border-border bg-bg/70 text-text-primary hover:border-border-strong hover:bg-surface-hover"
                            }`}
                          >
                            {on ? (
                              <CheckIcon className="size-3.5 shrink-0 text-[#0b63c5] dark:text-[#60a5fa]" />
                            ) : null}
                            <span>{c}</span>
                          </button>
                        );
                      })}
                    </div>

                    {errors.course ? (
                      <p role="alert" className="text-sm font-medium text-danger">
                        {errors.course}
                      </p>
                    ) : null}
                  </fieldset>

                  <div className="space-y-4 border-t border-border pt-6">
                    <p className="text-sm font-semibold text-text-primary">
                      2. Tus datos de contacto
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        label="Correo electrónico"
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
                      label="WhatsApp (opcional)"
                      placeholder="+56 9 ..."
                      value={whatsapp}
                      onChange={setWhatsapp}
                      error={errors.whatsapp}
                      autoComplete="tel"
                      helper="Opcional: agrégalo solo si prefieres que te escribamos por WhatsApp."
                    />

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-sm font-medium text-text-primary">
                        Mensaje <span className="font-normal text-text-muted">(opcional)</span>
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Cuéntanos tu nivel actual o qué necesitas consultar"
                        className="w-full rounded-xl border border-border-strong bg-bg/60 px-3.5 py-2.5 text-[15px] text-text-primary placeholder:text-text-muted transition-colors focus:bg-surface focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-border pt-5">
                    <label className="flex min-h-[44px] cursor-pointer items-start gap-3 py-1 text-sm leading-relaxed text-text-secondary">
                      <input
                        type="checkbox"
                        checked={privacy}
                        onChange={(e) => setPrivacy(e.target.checked)}
                        aria-invalid={Boolean(errors.privacy)}
                        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border-strong accent-[#0b63c5] dark:accent-[#60a5fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa]"
                      />
                      <span>
                        Acepto la{" "}
                        <Link
                          href="/privacidad"
                          className="font-medium text-text-primary underline underline-offset-2 hover:text-[#0b63c5] dark:hover:text-[#60a5fa]"
                        >
                          política de privacidad
                        </Link>{" "}
                        y que ProgramBI me envíe la información del programa elegido.
                      </span>
                    </label>
                    {errors.privacy ? (
                      <p role="alert" className="text-sm font-medium text-danger">
                        {errors.privacy}
                      </p>
                    ) : null}
                  </div>

                  {errors.form ? (
                    <p
                      role="alert"
                      className="rounded-xl border border-danger/30 bg-destructive-soft px-4 py-3 text-sm font-medium text-danger"
                    >
                      {errors.form}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex min-h-[50px] w-full cursor-pointer items-center justify-center rounded-xl bg-text-primary px-6 text-[15px] font-medium text-surface transition-opacity hover:opacity-92 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa]"
                  >
                    {sending ? "Enviando solicitud..." : "Recibir temario y valores"}
                  </button>
                </form>
              )}
            </div>
          </div>
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
  placeholder,
  type = "text",
  autoComplete,
  helper,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  helper?: string;
}) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        onChange={(e) => onChange(e.target.value)}
        className={`min-h-[46px] rounded-xl border bg-bg/60 px-3.5 text-[15px] text-text-primary placeholder:text-text-muted transition-colors focus:bg-surface focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#0b63c5] dark:focus-visible:outline-[#60a5fa] ${
          error ? "border-danger" : "border-border-strong"
        }`}
      />
      {helper ? <p className="text-xs text-text-muted">{helper}</p> : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
