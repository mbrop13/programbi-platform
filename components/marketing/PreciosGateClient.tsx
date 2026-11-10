"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileText, LockKeyhole, Unlock } from "lucide-react";
import { COUNTRIES } from "@/lib/context/CountryContext";
import { usePriceUnlock } from "@/hooks/usePriceUnlock";
import {
  courseBrochurePath,
  courseBrochureUrl,
  type SavedLeadInfo,
} from "@/lib/pricing-gate";
import { NOTA_PAGO, formatMoneda, porcentajeDescuento, precioListaVenta, precioVenta } from "@/lib/paises/precios";
import { NOTA_CUOTAS, textoCuotas } from "@/config/cuotas";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";
import { captureAndReadAttribution } from "@/lib/utm";
import { trackLeadSubmit } from "@/lib/analytics/marketing";
import { isValidEmail, phoneCodeFor, withDialCode } from "@/components/marketing/BrochureGateForm";

/**
 * Fila de la tabla de precios. No lleva montos: el cliente los calcula con
 * `precioVenta`/`precioListaVenta` después de hidratar, así nada de esto viaja
 * en el HTML inicial.
 */
export type CursoPrecioGate = {
  slug: string;
  title: string;
  levelName: string;
  hours: number;
};

type Props = {
  cursos: CursoPrecioGate[];
  /** ISO del país del visitante (cl, pe, mx, ...). */
  pais: string;
  /** Código de la moneda publicada: CLP, PEN, MXN... */
  moneda: string;
  /** `false` cuando el checkout no cobra en la moneda local. */
  cobroLocal: boolean;
};

const FUENTE_NOTA = "Precios publicados y sujetos a cambios. El monto final se confirma en el checkout.";

/**
 * Tabla de precios de `/precios` detrás del gate.
 *
 * Con los precios bloqueados no se renderiza ningún monto: cada fila muestra
 * «En el PDF de temario y precios» y el nombre del curso abre el temario de su
 * país. Arriba aparece el formulario que desbloquea la tabla completa (Nombre,
 * Email, Teléfono con prefijo y curso principal) y abre el PDF en una pestaña.
 */
export default function PreciosGateClient({ cursos, pais, moneda, cobroLocal }: Props) {
  const { unlocked, unlock } = usePriceUnlock();
  const [slug, setSlug] = useState(() => cursos[0]?.slug ?? "power-bi");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [prefix, setPrefix] = useState(() => phoneCodeFor(pais));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  // Timestamp de montaje del formulario (antibot). Se fija en un efecto para no
  // llamar a Date.now() durante el render (react-hooks/purity).
  const formLoadedAt = useRef(0);
  useEffect(() => {
    formLoadedAt.current = Date.now();
  }, []);

  const seleccionado = cursos.find((curso) => curso.slug === slug) ?? cursos[0];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nombre = name.trim();
    const correo = email.trim();
    const telefono = phone.trim();

    if (nombre.length < 2) {
      setError("Escribe tu nombre completo.");
      return;
    }
    if (!isValidEmail(correo)) {
      setError("Revisa tu email: parece incompleto.");
      return;
    }
    if (telefono.replace(/\D/g, "").length < 7) {
      setError("Escribe tu teléfono o WhatsApp con al menos 7 dígitos.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const whatsapp = withDialCode(telefono, prefix);
    const curso = seleccionado;
    if (!curso) {
      setError("Elige un curso para abrir su temario con precios.");
      setIsSubmitting(false);
      return;
    }

    // 1) Abrir el temario de forma sincrónica: el navegador lo trata como
    //    acción del usuario y no lo bloquea como popup.
    try {
      window.open(courseBrochureUrl(curso.slug, pais), "_blank", "noopener,noreferrer");
    } catch {
      // Si el navegador bloquea la pestaña, el botón «Abrir temario y precios
      // (PDF)» queda disponible arriba de la tabla ya desbloqueada.
    }

    // 2) Desbloqueo inmediato: la tabla muestra los montos al instante.
    const lead: SavedLeadInfo = { name: nombre, email: correo, whatsapp };
    unlock(lead);
    setIsSubmitting(false);

    // 3) Lead en segundo plano, sin bloquear la apertura del PDF.
    const payload: Record<string, unknown> = {
      name: nombre,
      email: correo,
      whatsapp,
      message: "Descargó Brochure PDF con precios",
      sourceCourse: curso.title,
      selectedCourses: [curso.title],
      leadType: "personal",
      pais,
      pricingVariant: "gate",
      ...captureAndReadAttribution(),
      ...getAntiBotFields(formLoadedAt.current || Date.now(), honeypot),
    };

    void fetch("/api/leads/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) trackLeadSubmit("personal", "precios", curso.slug);
      })
      .catch(() => {
        // El PDF ya está abierto: un fallo de red no rompe la experiencia.
      });
  };

  const fieldClass =
    "h-12 w-full rounded-xl border border-line-strong bg-canvas px-3 text-base text-ink placeholder:text-faint";

  return (
    <section aria-labelledby="precios-por-curso" className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="precios-por-curso" className="text-2xl font-bold tracking-tight text-ink">
          Precios por curso
        </h2>
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-mute">
          {unlocked ? (
            <>
              <Unlock size={13} aria-hidden /> Precios desbloqueados
            </>
          ) : (
            <>
              <LockKeyhole size={13} aria-hidden /> Aranceles en el PDF de temario y precios
            </>
          )}
        </p>
      </div>

      {unlocked ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-wash px-5 py-4">
          <p className="text-sm font-semibold text-ink">
            Tabla completa en {moneda}. {textoCuotas(pais)}.
          </p>
          {seleccionado ? (
            <Link
              href={courseBrochurePath(seleccionado.slug, pais)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas no-underline"
            >
              <FileText size={15} aria-hidden /> Abrir temario y precios (PDF)
            </Link>
          ) : null}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          data-gate-form="brochure"
          className="mt-5 rounded-[26px] border border-line-strong bg-paper p-5 sm:p-6"
        >
          <p className="text-lg font-bold tracking-tight text-ink">
            Desbloquea todos los precios y llévate el temario con precios
          </p>
          <p className="mt-1 max-w-[52rem] text-sm leading-relaxed text-mute">
            Los aranceles de cada curso se publican en su PDF de temario y precios, con el descuento
            vigente, las fechas en hora de tu país y las 3 cuotas sin interés. Completa tus datos y
            abrimos el PDF de tu curso principal en una pestaña nueva.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div>
              <label htmlFor="precios-gate-name" className="sr-only">
                Nombre
              </label>
              <input
                id="precios-gate-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Nombre"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="precios-gate-email" className="sr-only">
                Email
              </label>
              <input
                id="precios-gate-email"
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
            </div>
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="flex gap-2">
              <label htmlFor="precios-gate-prefix" className="sr-only">
                Código de país
              </label>
              <select
                id="precios-gate-prefix"
                name="phonePrefix"
                value={prefix}
                onChange={(event) => setPrefix(event.target.value)}
                aria-label="Código de país"
                className="h-12 w-[6.5rem] shrink-0 rounded-xl border border-line-strong bg-canvas px-2 text-sm text-ink"
              >
                {COUNTRIES.map((country) => (
                  <option key={`${country.iso}-${country.phoneCode}`} value={country.phoneCode}>
                    {country.iso.toUpperCase()} {country.phoneCode}
                  </option>
                ))}
              </select>
              <div className="min-w-0 flex-1">
                <label htmlFor="precios-gate-whatsapp" className="sr-only">
                  Teléfono o WhatsApp
                </label>
                <input
                  id="precios-gate-whatsapp"
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
            <div>
              <label htmlFor="precios-gate-curso" className="sr-only">
                Curso principal
              </label>
              <select
                id="precios-gate-curso"
                name="curso"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                aria-label="Curso principal"
                className="h-12 w-full rounded-xl border border-line-strong bg-canvas px-3 text-sm text-ink"
              >
                {cursos.map((curso) => (
                  <option key={curso.slug} value={curso.slug}>
                    {curso.title}
                  </option>
                ))}
              </select>
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

          {error ? (
            <p role="alert" className="mt-2 text-xs font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas transition-transform active:scale-[0.99] disabled:opacity-70 sm:w-auto"
          >
            <FileText size={16} aria-hidden /> Desbloquear todos los precios y abrir el PDF de temario y precios →
          </button>

          <p className="mt-2 text-[11px] leading-snug text-faint">
            Sin spam. Usamos tus datos para enviarte el temario con precios y el detalle del curso.
          </p>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Precios y duración de los cursos en {moneda}
          </caption>
          <thead className="bg-wash text-xs uppercase tracking-wide text-mute">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Curso
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Duración
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Precio
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-paper">
            {cursos.map((curso) => {
              const precio = precioVenta(pais, curso.slug);
              const lista = precioListaVenta(pais, curso.slug);
              const descuento =
                lista != null && precio != null ? porcentajeDescuento(lista, precio) : 0;
              return (
                <tr key={curso.slug}>
                  <th scope="row" className="px-4 py-4 font-semibold text-ink">
                    {unlocked ? (
                      <Link
                        href={`/cursos/${curso.slug}`}
                        className="no-underline hover:text-mute"
                      >
                        {curso.title}
                      </Link>
                    ) : (
                      <Link
                        href={courseBrochurePath(curso.slug, pais)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline hover:text-mute"
                      >
                        {curso.title}
                      </Link>
                    )}
                    <span className="mt-1 block text-xs font-normal text-faint">{curso.levelName}</span>
                  </th>
                  <td className="whitespace-nowrap px-4 py-4 text-mute">{curso.hours} h</td>
                  <td className="px-4 py-4">
                    {unlocked ? (
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        {lista != null ? (
                          <span className="text-xs text-faint line-through">
                            {formatMoneda(pais, lista)}
                          </span>
                        ) : null}
                        <span className="text-base font-bold text-ink tabular-nums">
                          {precio != null ? formatMoneda(pais, precio) : "Consultar"}
                        </span>
                        {descuento > 0 ? (
                          <span className="rounded-full bg-wash px-2 py-0.5 text-[11px] font-semibold text-ink">
                            {descuento}% off
                          </span>
                        ) : null}
                        <span className="block w-full text-[11px] leading-snug text-faint">
                          {NOTA_PAGO}
                        </span>
                      </div>
                    ) : (
                      <Link
                        href={courseBrochurePath(curso.slug, pais)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline hover:text-mute"
                      >
                        <FileText size={14} aria-hidden /> En el PDF de temario y precios
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-sm text-mute">{FUENTE_NOTA}</p>
      {cobroLocal ? null : (
        <p className="mt-1 text-sm text-mute">
          Cuando no hay cobro local disponible, el checkout procesa el pago en pesos chilenos (CLP).
        </p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-faint">
        {NOTA_CUOTAS} El detalle de cada arancel, con descuentos y fechas, está en el PDF de temario y
        precios del curso.
      </p>
    </section>
  );
}
