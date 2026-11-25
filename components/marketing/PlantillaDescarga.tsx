"use client";

import { useId, useRef, useState } from "react";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";
import { trackLeadSubmit, trackPlantillaDownload } from "@/lib/analytics/marketing";
import {
  ARCHIVO_PLANTILLA_VENTAS,
  NOMBRE_PLANTILLA_VENTAS,
  RECURSO_PLANTILLA_VENTAS,
} from "@/lib/leads-magnet";

type Status = "idle" | "error" | "success";

export interface PlantillaDescargaProps {
  pais: string;
  location: string;
  label?: string;
  className?: string;
  recurso?: string;
  archivoUrl?: string;
  nombreArchivo?: string;
  titulo?: string;
  descripcion?: string;
  course?: string;
  courseSlug?: string;
  country?: string;
  page?: string;
  mostrarWhatsappAlternativo?: boolean;
  mostrarWhatsAppAlternativo?: boolean;
  whatsappLabel?: string;
  whatsappText?: string;
  whatsappTexto?: string;
}

export default function PlantillaDescarga({
  pais,
  location,
  label = "Descargar plantilla CSV",
  className,
  recurso = RECURSO_PLANTILLA_VENTAS,
  archivoUrl = ARCHIVO_PLANTILLA_VENTAS,
  nombreArchivo = NOMBRE_PLANTILLA_VENTAS,
  titulo,
  descripcion,
  course = "Excel",
  courseSlug = "power-bi",
  country,
  page,
  mostrarWhatsappAlternativo = false,
  mostrarWhatsAppAlternativo = false,
  whatsappLabel,
  whatsappText,
  whatsappTexto,
}: PlantillaDescargaProps) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const formLoadedAt = useRef(Date.now());
  const inputId = useId();
  const honeypotId = useId();
  const resolvedCountry = country?.trim() || pais;
  const mostrarWa =
    mostrarWhatsappAlternativo ||
    mostrarWhatsAppAlternativo ||
    resolvedCountry === "pe" ||
    resolvedCountry === "co";
  const resolvedWaLabel =
    whatsappLabel ??
    (resolvedCountry === "co"
      ? "Pedir plantilla y asesoría por WhatsApp"
      : resolvedCountry === "pe"
        ? "Pedir por WhatsApp"
        : "Pedir plantilla por WhatsApp");
  const resolvedWaText =
    whatsappText ??
    whatsappTexto ??
    `Hola, quiero la plantilla ${nombreArchivo} y consultar por el curso de ${course} [${recurso}]`;
  const buttonClassName =
    className ||
    "inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60";

  const descargarArchivo = () => {
    const link = document.createElement("a");
    link.href = archivoUrl;
    link.download = nombreArchivo;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;
    const emailLimpio = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) {
      setStatus("error");
      setError("Escribe un email válido.");
      return;
    }

    setSending(true);
    setError("");
    setStatus("idle");

    try {
      const res = await fetch("/api/leads-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailLimpio,
          pais: resolvedCountry,
          recurso,
          ...getAntiBotFields(formLoadedAt.current, honeypot),
        }),
      });

      let data: { success?: boolean; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("No pudimos registrar tu email. Intenta de nuevo.");
      }

      if (!res.ok || data.success !== true) {
        throw new Error(data.error || "No pudimos registrar tu email. Intenta de nuevo.");
      }

      setStatus("success");
      descargarArchivo();

      // Analítica best-effort: si falla, el email ya quedó guardado y la
      // descarga ya se inició; nunca debe convertir el éxito en un error.
      try {
        trackPlantillaDownload({
          recurso,
          pais: resolvedCountry,
          location,
        });
        trackLeadSubmit("plantilla", location, courseSlug, {
          form_name: "plantilla_descarga",
          country: resolvedCountry,
        });
      } catch {
        // no-op
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ocurrió un error. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {titulo ? <p className="text-sm font-semibold text-ink">{titulo}</p> : null}
      {descripcion ? <p className="text-xs leading-relaxed text-mute">{descripcion}</p> : null}

      {status === "success" ? (
        <>
          <p role="status" className="text-xs text-mute">
            Listo. La descarga comenzó.
          </p>
          <button type="button" onClick={descargarArchivo} className={buttonClassName}>
            Descargar de nuevo
          </button>
        </>
      ) : (
        <form
          onSubmit={onSubmit}
          className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"
          noValidate
        >
          <label htmlFor={inputId} className="sr-only">
            Tu email
          </label>
          <input
            id={inputId}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 min-w-0 rounded-full border border-line-strong bg-paper px-4 text-sm text-ink placeholder:text-faint sm:min-w-[15rem]"
          />
          <button type="submit" disabled={sending} className={buttonClassName}>
            {sending ? "Enviando…" : label}
          </button>
        </form>
      )}

      {mostrarWa ? (
        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-mute">
          {resolvedCountry === "pe" ? (
            <span>¿Prefieres recibirla o resolver dudas por WhatsApp?</span>
          ) : null}
          <WhatsAppCta
            page={page ?? location}
            intent="curso"
            course={course}
            courseSlug={courseSlug}
            country={resolvedCountry}
            ctaPosition={`${location}_whatsapp_alt`}
            customText={resolvedWaText}
            className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-4 text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-ink)]"
          >
            {resolvedWaLabel}
          </WhatsAppCta>
        </div>
      ) : null}

      {status === "error" ? (
        <p role="alert" className="text-xs text-mute">
          {error}
        </p>
      ) : null}

      <div style={honeypotStyle} aria-hidden="true">
        <label htmlFor={honeypotId}>Sitio web</label>
        <input
          id={honeypotId}
          name="_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>
    </div>
  );
}
