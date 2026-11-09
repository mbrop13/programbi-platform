"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, FileText } from "lucide-react";
import { COUNTRIES } from "@/lib/context/CountryContext";
import {
  courseBrochureUrl,
  getSavedLeadInfo,
  unlockPricesClient,
  type SavedLeadInfo,
} from "@/lib/pricing-gate";
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
  /**
   * @deprecated El formulario siempre se pinta en tamaño grande. Se mantiene
   * la prop solo por compatibilidad con llamadas antiguas; se ignora.
   */
  compact?: boolean;
  /** Se llama al desbloquear, con los datos normalizados del lead. */
  onUnlocked?: (lead: SavedLeadInfo) => void;
  className?: string;
};

export const BROCHURE_GATE_HEADING = "Descarga el Brochure PDF con precios y temario";
export const BROCHURE_GATE_SUBHEADING =
  "Completa tus datos y abre al instante el brochure oficial con el arancel de tu país, las fechas con horario local y la malla completa.";

export function phoneCodeFor(iso: string): string {
  const country = COUNTRIES.find((item) => item.iso === iso);
  return country?.phoneCode || "+56";
}

/** Deja el teléfono en formato internacional E.164 simplificado (+569****5678). */
export function withDialCode(raw: string, code: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) return `+${trimmed.replace(/[^\d]/g, "")}`;
  return `${code}${trimmed.replace(/\D/g, "")}`;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/**
 * Separa un teléfono guardado en E.164 (`+56912345678`) en prefijo conocido y
 * resto local. Si no hay prefijo reconocible deja el valor tal cual en el input
 * y devuelve el prefijo por defecto del país.
 */
function splitDialCode(raw: string, fallbackCode: string): { code: string; rest: string } {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return { code: fallbackCode, rest: "" };

  const candidates = COUNTRIES.filter((country) =>
    digits.startsWith(country.phoneCode.replace("+", ""))
  ).sort((a, b) => b.phoneCode.length - a.phoneCode.length);

  for (const country of candidates) {
    const code = country.phoneCode;
    const rest = digits.slice(code.replace("+", "").length);
    if (rest.length >= 6) return { code, rest };
  }

  return { code: fallbackCode, rest: raw.trim() };
}

const INCLUDES = [
  "Arancel oficial en tu moneda, becas y 3 cuotas sin interés",
  "Próximas fechas y horarios convertidos a tu país",
  "Malla curricular completa módulo a módulo y profesores",
];

const labelClass = "mb-1.5 block text-xs font-semibold tracking-wide text-ink/80 uppercase";
const inputClass =
  "h-12 w-full rounded-xl border border-line-strong bg-canvas px-4 text-base font-medium text-ink placeholder:text-faint";

/**
 * Formulario de 3 campos que abre el brochure PDF con precios.
 *
 * Es el único camino para desbloquear precios en la web pública. Al enviar:
 *   1. abre el brochure en una pestaña nueva (sincrónico, para que Safari y
 *      los móviles no bloqueen el popup),
 *   2. desbloquea precios en toda la web,
 *   3. guarda el lead en `/api/leads/create` en segundo plano.
 *
 * El formulario nunca se destruye: tras el éxito se mantiene visible y editable
 * y aparece un banner de confirmación con el enlace directo al PDF.
 */
export function BrochureGateForm({
  slug,
  courseTitle,
  pais,
  source,
  buttonLabel = "Descargar Brochure PDF",
  heading = BROCHURE_GATE_HEADING,
  subheading = BROCHURE_GATE_SUBHEADING,
  idPrefix = "brochure-gate",
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
  const [sentEmail, setSentEmail] = useState("");
  const [brochureUrl, setBrochureUrl] = useState(() => courseBrochureUrl(slug, pais));
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const formLoadedAt = useRef(Date.now());

  useEffect(() => {
    setPrefix(phoneCodeFor(pais));
    setBrochureUrl(courseBrochureUrl(slug, pais));
  }, [pais, slug]);

  // Prefill del último lead guardado. Va después del efecto de país para que
  // el prefijo recordado gane sobre el del país en el primer render.
  useEffect(() => {
    const saved = getSavedLeadInfo();
    if (!saved) return;
    if (saved.name) setName(saved.name);
    if (saved.email) setEmail(saved.email);
    if (saved.whatsapp) {
      const { code, rest } = splitDialCode(saved.whatsapp, phoneCodeFor(pais));
      setPrefix(code);
      setPhone(rest);
    }
    // Solo al montar: no debe pisar lo que el usuario escriba después.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    // 2) Desbloqueo inmediato y confirmación sin destruir el formulario.
    unlockPricesClient(lead);
    setSentEmail(correo);
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

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-gate-form="brochure"
      className={`rounded-3xl border border-line bg-paper p-5 shadow-sm sm:p-6 ${className}`}
    >
      {isSuccess ? (
        <div
          data-gate-success=""
          role="status"
          aria-live="polite"
          className="mb-5 rounded-2xl border border-emerald-300 bg-emerald-50 p-4"
        >
          <p className="text-base font-bold text-emerald-900">¡Listo! Tu brochure ya está abierto.</p>
          <p className="mt-1 text-sm leading-relaxed text-emerald-800">
            También lo enviamos a {sentEmail || email || "tu correo"}. Puedes volver a abrirlo cuando
            quieras.
          </p>
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 text-sm font-bold text-white no-underline"
          >
            <FileText size={17} aria-hidden /> Abrir Brochure PDF en nueva pestaña
          </a>
          {popupBlocked ? (
            <p className="mt-2 text-xs text-emerald-800">
              Si no se abrió sola, usa el botón de arriba.
            </p>
          ) : null}
        </div>
      ) : null}

      <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-bold tracking-wider text-canvas uppercase">
        <FileText size={14} aria-hidden />
        BROCHURE OFICIAL PDF · PRECIOS Y TEMARIO
      </span>

      <h3 className="mt-3 text-xl font-bold tracking-tight text-ink leading-snug sm:text-2xl">
        {heading}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-mute sm:text-[15px]">{subheading}</p>

      <ul className="mt-4 space-y-2">
        {INCLUDES.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm font-medium text-ink">
            <Check size={17} strokeWidth={2.4} className="mt-0.5 shrink-0 text-ink" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor={`${idPrefix}-name`} className={labelClass}>
            Nombre completo
          </label>
          <input
            id={`${idPrefix}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Ej: María González"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-email`} className={labelClass}>
            Correo electrónico
          </label>
          <input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="tu@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-whatsapp`} className={labelClass}>
            WhatsApp / Teléfono
          </label>
          <div className="flex gap-2">
            <select
              id={`${idPrefix}-prefix`}
              name="phonePrefix"
              value={prefix}
              onChange={(event) => setPrefix(event.target.value)}
              aria-label="Código de país"
              className="h-12 w-[7.5rem] shrink-0 rounded-xl border border-line-strong bg-canvas px-3 text-sm font-medium text-ink"
            >
              {COUNTRIES.map((country) => (
                <option key={`${country.iso}-${country.phoneCode}`} value={country.phoneCode}>
                  {country.iso.toUpperCase()} {country.phoneCode}
                </option>
              ))}
            </select>

            <input
              id={`${idPrefix}-whatsapp`}
              name="whatsapp"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              placeholder="9 8765 4321"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-12 min-w-0 flex-1 rounded-xl border border-line-strong bg-canvas px-4 text-base font-medium text-ink placeholder:text-faint"
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
        <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex h-13 min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-base font-bold text-canvas shadow-md transition-transform active:scale-[0.98] disabled:opacity-70"
      >
        <FileText size={18} aria-hidden /> {buttonLabel} <ArrowRight size={18} aria-hidden />
      </button>

      <p className="mt-3 text-center text-xs leading-snug text-faint">
        Sin spam. Usamos tus datos solo para enviarte el brochure y el detalle del curso.
      </p>
    </form>
  );
}
