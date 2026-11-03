"use client";

import { useId, useRef, useState } from "react";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";
import { trackPlantillaDownload } from "@/lib/analytics/marketing";
import {
  ARCHIVO_PLANTILLA_VENTAS,
  NOMBRE_PLANTILLA_VENTAS,
  RECURSO_PLANTILLA_VENTAS,
} from "@/lib/leads-magnet";

type Status = "idle" | "error" | "success";

export default function PlantillaDescarga({
  pais,
  location,
  label = "Descargar plantilla CSV",
  className,
}: {
  pais: string;
  location: string;
  label?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const formLoadedAt = useRef(Date.now());
  const inputId = useId();
  const honeypotId = useId();

  const descargarArchivo = () => {
    const link = document.createElement("a");
    link.href = ARCHIVO_PLANTILLA_VENTAS;
    link.download = NOMBRE_PLANTILLA_VENTAS;
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
          pais,
          recurso: RECURSO_PLANTILLA_VENTAS,
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
          recurso: RECURSO_PLANTILLA_VENTAS,
          pais,
          location,
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
    <div className="flex flex-col gap-2">
      {status === "success" ? (
        <>
          <p role="status" className="text-xs text-mute">
            Listo. La descarga comenzó.
          </p>
          <button type="button" onClick={descargarArchivo} className={className}>
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
          <button type="submit" disabled={sending} className={className}>
            {sending ? "Enviando…" : label}
          </button>
        </form>
      )}

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
