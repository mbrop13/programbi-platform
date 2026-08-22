"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

/**
 * Captura de pre-inscripción al lanzamiento (usa el endpoint de leads
 * existente con honeypot y timing anti-bot). Variantes clara y oscura.
 */
export default function WaitlistForm({ dark = false }: { dark?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const loadedAt = useRef(Date.now());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setErrorMsg(null);

    // Honeypot: si un bot lo rellenó, fingir éxito
    if (honeypot.current?.value) {
      setStatus("done");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: "Pre-inscripción lanzamiento Bolsa de Trabajo",
          leadType: "bolsa_waitlist",
          _website: "",
          _t: loadedAt.current, // timestamp de carga del form (anti-bot de timing)
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "No pudimos registrarte.");
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error de conexión. Intenta de nuevo.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold ${
          dark
            ? "border-canvas/20 bg-canvas/10 text-canvas"
            : "border-line bg-[#16a34a]/[0.07] text-[#16a34a]"
        }`}
        role="status"
      >
        <Check size={16} strokeWidth={2.6} />
        Listo — te avisaremos por correo el día del lanzamiento.
      </p>
    );
  }

  const inputCls = dark
    ? "h-12 w-full rounded-full border border-canvas/20 bg-canvas/[0.06] px-5 text-sm text-canvas placeholder:text-canvas/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas/40 sm:w-36"
    : "h-12 w-full rounded-full border border-line-strong bg-paper px-5 text-sm text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 sm:w-36";
  const emailCls = dark
    ? "h-12 w-full flex-1 rounded-full border border-canvas/20 bg-canvas/[0.06] px-5 text-sm text-canvas placeholder:text-canvas/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas/40"
    : "h-12 w-full flex-1 rounded-full border border-line-strong bg-paper px-5 text-sm text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25";

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-md flex-col gap-2.5">
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div>
          <label htmlFor="wl-name" className="sr-only">
            Nombre
          </label>
          <input
            id="wl-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            className={inputCls}
          />
        </div>
        <div className="flex flex-1">
          <label htmlFor="wl-email" className="sr-only">
            Email
          </label>
          <input
            id="wl-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.cl"
            required
            autoComplete="email"
            className={emailCls}
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 ${
            dark
              ? "bg-canvas text-ink focus-visible:ring-canvas/40"
              : "bg-ink text-canvas focus-visible:ring-ink/25"
          }`}
        >
          {status === "sending" ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <ArrowRight size={15} strokeWidth={2.4} />
          )}
          {status === "sending" ? "Enviando…" : "Avisarme"}
        </button>
      </div>

      {/* Honeypot invisible para bots */}
      <input
        ref={honeypot}
        type="text"
        name="_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {status === "error" && errorMsg && (
        <p className="text-xs font-medium text-[#dc2626]" role="alert">
          {errorMsg}
        </p>
      )}
      <p className={`text-[11px] ${dark ? "text-canvas/40" : "text-faint"}`}>
        Sin spam: un solo correo el día del lanzamiento y nada más.
      </p>
    </form>
  );
}
