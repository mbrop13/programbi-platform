"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, FileText } from "lucide-react";
import { COUNTRIES } from "@/lib/context/CountryContext";
import { courseBrochureUrl, unlockPricesClient, type SavedLeadInfo } from "@/lib/pricing-gate";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";
import { captureAndReadAttribution } from "@/lib/utm";
import { trackLeadSubmit } from "@/lib/analytics/marketing";

export type BrochureGateFormProps = {
  /** Slug del curso cuyo brochure se abre al enviar. */
  slug: string;
  /** Título del curso, tal como se guarda en `course_leads`. */
  courseTitle: string;
  /** ISO del país del visitante (cl, pe, mx, ...). */
  pais: string;
  /** Origen del lead para medición y para el campo `source` del endpoint. */
  source: string;
  /** Texto del botón principal. */
  buttonLabel?: string;
  /** Encabezado propio; si no se pasa, se muestra el estándar. */
  heading?: string;
  subheading?: string;
  /** Prefijo de los `id` de los campos (evita ids duplicados si hay dos forms). */
  idPrefix?: string;
  /** `true` para la tarjeta lateral de la ficha (tipografía más ajustada). */
  compact?: boolean;
  /** Se llama al desbloquear, con los datos normalizados del lead. */
  onUnlocked?: (lead: SavedLeadInfo) => void;
  className?: string;
};

export function phoneCodeFor(iso: string): string {
  const country = COUNTRIES.find((item) => item.iso === iso);
  return country?.phoneCode || "+56";
}

/** Deja el teléfono en formato internacional E.164 simplificado (+56912345678). */
export function withDialCode(raw: string, code: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) return `+${trimmed.replace(/[^\d]/g, "")}`;
  return `${code}${trimmed.replace(/\D/g, "")}`;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/**
 * Formulario de 3 campos que abre el brochure PDF con precios.
 *
 * Es el único camino para desbloquear precios en la web pública. Al enviar:
 *   1. abre el brochure en una pestaña nueva (sincrónico, para que Safari y
 *      los móviles no bloqueen el popup),
 *   2. desbloquea precios en toda la web,
 *   3. guarda el lead en `/api/leads/create` en segundo plano.
 */
export function BrochureGateForm({
  slug,
  courseTitle,
  pais,
  source,
  buttonLabel = "Completar y ver PDF con precios",
  heading = "Arancel, fechas y temario en PDF",
  subheading = "Completa tus datos para abrir y descargar al instante el brochure oficial con los precios de tu país, descuentos y 3 cuotas sin interés.",
  idPrefix = "brochure-gate",
  compact = false,
  onUnlocked,
  className = "",
}: BrochureGateFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [prefix, setPrefix] = useState(() => phoneCodeFor(pais));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [brochureUrl, setBrochureUrl] = useState(() => courseBrochureUrl(slug, pais));
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const formLoadedAt = useRef(Date.now());

  useEffect(() => {
    setPrefix(phoneCodeFor(pais));
    setBrochureUrl(courseBrochureUrl(slug, pais));
  }, [pais, slug]);

  const fieldClass = compact
    ? "h-11 w-full rounded-xl border border-line-strong bg-canvas px-3 text-sm text-ink placeholder:text-faint"
    : "h-12 w-full rounded-xl border border-line-strong bg-canvas px-3 text-base text-ink placeholder:text-faint";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nombre = name.trim();
    const correo = email.trim();
    const telefono = phone.trim();
    const digits = telefono.replace(/\D/g, "");

    if (nombre.length < 2) {
      setError("Escribe tu nombre completo.");
      return;
    }
    if (!isValidEmail(correo)) {
      setError("Revisa tu email: parece incompleto.");
      return;
    }
    if (digits.length < 7) {
      setError("Escribe tu teléfono o WhatsApp con al menos 7 dígitos.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const whatsapp = withDialCode(telefono, prefix);
    const url = courseBrochureUrl(slug, pais);
    setBrochureUrl(url);

    // 1) Abrir el brochure dentro del handler: el navegador lo trata como
    //    acción del usuario y no lo bloquea como popup.
    let opened: Window | null = null;
    try {
      opened = window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      opened = null;
    }
    setPopupBlocked(!opened);

    const lead: SavedLeadInfo = { name: nombre, email: correo, whatsapp };

    // 2) Desbloqueo inmediato: la tarjeta muestra precio y botón de compra.
    unlockPricesClient(lead);
    setIsSuccess(true);
    setIsSubmitting(false);
    onUnlocked?.(lead);

    // 3) Guardado en Supabase, sin bloquear la apertura del PDF.
    const payload: Record<string, unknown> = {
      name: nombre,
      email: correo,
      whatsapp,
      message: "Descargó Brochure PDF con precios",
      sourceCourse: courseTitle,
      selectedCourses: [courseTitle],
      leadType: "personal",
      pais,
      pricingVariant: "gate",
      ...captureAndReadAttribution(),
      ...getAntiBotFields(formLoadedAt.current, honeypot),
    };

    void fetch("/api/leads/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) trackLeadSubmit("personal", source, slug);
      })
      .catch(() => {
        // El PDF ya está abierto: un fallo de red no debe romper la experiencia.
      });
  };

  if (isSuccess) {
    return (
      <div className={`rounded-2xl border border-line bg-paper p-4 ${className}`} data-gate-success="">
        <p className="text-sm font-semibold text-ink">Listo. Tu brochure se abrió en otra pestaña.</p>
        <p className="mt-1 text-xs leading-snug text-mute">
          Ya puedes ver el precio de tu país, las fechas con horario local y el temario completo. También lo enviamos a{" "}
          {email || "tu correo"}.
        </p>
        <a
          href={brochureUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-canvas no-underline"
        >
          <FileText size={16} /> Abrir Brochure PDF con precios
        </a>
        <a
          href={`/pago?curso=${encodeURIComponent(slug)}${pais && pais !== "cl" ? `&pais=${encodeURIComponent(pais)}` : ""}`}
          className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-canvas text-sm font-medium text-ink no-underline hover:bg-wash"
        >
          Ir a Inscripción / Pago <ArrowRight size={16} />
        </a>
        {popupBlocked ? (
          <p className="mt-2 text-xs leading-snug text-mute">
            Si no se abrió sola, usa el botón «Abrir Brochure PDF con precios».
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-gate-form="brochure"
      className={`rounded-2xl border border-line bg-wash p-4 ${className}`}
    >
      <p className="text-sm font-semibold text-ink">{heading}</p>
      <p className="mt-1 text-xs leading-snug text-mute">{subheading}</p>

      <div className="mt-3 space-y-2">
        <label htmlFor={`${idPrefix}-name`} className="sr-only">
          Nombre
        </label>
        <input
          id={`${idPrefix}-name`}
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Nombre"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={fieldClass}
        />

        <label htmlFor={`${idPrefix}-email`} className="sr-only">
          Email
        </label>
        <input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClass}
        />

        <div className="flex gap-2">
          <label htmlFor={`${idPrefix}-prefix`} className="sr-only">
            Código de país
          </label>
          <select
            id={`${idPrefix}-prefix`}
            name="phonePrefix"
            value={prefix}
            onChange={(event) => setPrefix(event.target.value)}
            aria-label="Código de país"
            className="h-11 w-[6.5rem] shrink-0 rounded-xl border border-line-strong bg-canvas px-2 text-sm text-ink"
          >
            {COUNTRIES.map((country) => (
              <option key={`${country.iso}-${country.phoneCode}`} value={country.phoneCode}>
                {country.iso.toUpperCase()} {country.phoneCode}
              </option>
            ))}
          </select>

          <div className="min-w-0 flex-1">
            <label htmlFor={`${idPrefix}-whatsapp`} className="sr-only">
              Teléfono o WhatsApp
            </label>
            <input
              id={`${idPrefix}-whatsapp`}
              name="whatsapp"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              placeholder="Teléfono / WhatsApp"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <div aria-hidden="true" style={honeypotStyle}>
          <input
            tabIndex={-1}
            autoComplete="off"
            name="_website"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-canvas transition-transform active:scale-[0.98] disabled:opacity-70"
      >
        <FileText size={16} /> {buttonLabel} <ArrowRight size={16} />
      </button>

      <p className="mt-2 text-center text-[11px] leading-snug text-faint">
        Sin spam. Usamos tus datos solo para enviarte el brochure y el detalle del curso.
      </p>
    </form>
  );
}
