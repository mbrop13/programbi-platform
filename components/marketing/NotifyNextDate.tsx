"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle2, Loader2, Mail, MessageCircle, X } from "lucide-react";
import { trackLeadSubmit } from "@/lib/analytics/marketing";

export type NotifyNextDateProps = {
  courseSlug: string;
  courseTitle: string;
  levelName?: string;
  pais?: string;
  ctaLocation: string;
  initialEmail?: string;
  variant?: "button" | "card" | "compact";
  className?: string;
};

type ContactChannel = "email" | "whatsapp";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export default function NotifyNextDate({
  courseSlug,
  courseTitle,
  levelName,
  pais = "cl",
  ctaLocation,
  initialEmail = "",
  variant = "button",
  className = "",
}: NotifyNextDateProps) {
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<ContactChannel>("email");
  const [contact, setContact] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialEmail && !contact && channel === "email") {
      setContact(initialEmail);
    }
  }, [initialEmail, contact, channel]);

  const switchChannel = (next: ContactChannel) => {
    if (next === channel) return;
    setChannel(next);
    setError(null);
    setContact(next === "email" ? initialEmail : "");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || isSuccess) return;

    const value = contact.trim();
    if (channel === "email") {
      if (!isValidEmail(value)) {
        setError("Escribe un correo válido.");
        return;
      }
    } else {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 7) {
        setError("Escribe tu WhatsApp con al menos 7 dígitos.");
        return;
      }
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          courseSlug,
          courseName: courseTitle,
          levelName,
          email: channel === "email" ? value : undefined,
          whatsapp: channel === "whatsapp" ? value : undefined,
          pais,
        }),
      });

      let data: { error?: string; success?: boolean } = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok || !data.success) {
        setError(data.error || "No pudimos registrar tu aviso. Intenta de nuevo.");
        return;
      }

      trackLeadSubmit("avisame_proxima_fecha", ctaLocation, courseSlug, {
        form_name: "notify_next_date",
        country: pais,
      });
      setIsSuccess(true);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900 ${className}`}
      >
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
        <span>Listo, te avisaremos la próxima fecha.</span>
      </div>
    );
  }

  const triggerButton = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={
        variant === "compact"
          ? "inline-flex min-h-[38px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-line bg-wash px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-paper"
          : "inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-line-strong bg-paper px-5 text-sm font-semibold text-ink transition-colors hover:bg-wash sm:w-auto"
      }
    >
      <Bell className="h-4 w-4 shrink-0" aria-hidden />
      <span>Avísame la próxima fecha</span>
    </button>
  );

  const inlineForm = (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`rounded-xl border border-line-strong bg-paper text-left ${
        variant === "compact" ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-ink">
          Avísame cuando abra fecha
        </span>
        {variant !== "card" ? (
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
            aria-label="Cerrar aviso"
            className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-mute hover:bg-wash hover:text-ink"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="mt-2 inline-flex rounded-lg border border-line bg-wash p-0.5" role="group" aria-label="Medio de aviso">
        <button
          type="button"
          onClick={() => switchChannel("email")}
          aria-pressed={channel === "email"}
          className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
            channel === "email" ? "bg-paper text-ink shadow-xs" : "text-mute hover:text-ink"
          }`}
        >
          <Mail className="h-3 w-3" aria-hidden /> Correo
        </button>
        <button
          type="button"
          onClick={() => switchChannel("whatsapp")}
          aria-pressed={channel === "whatsapp"}
          className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
            channel === "whatsapp" ? "bg-paper text-ink shadow-xs" : "text-mute hover:text-ink"
          }`}
        >
          <MessageCircle className="h-3 w-3" aria-hidden /> WhatsApp
        </button>
      </div>

      <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
        <input
          type={channel === "email" ? "email" : "tel"}
          inputMode={channel === "email" ? "email" : "tel"}
          autoComplete={channel === "email" ? "email" : "tel"}
          placeholder={channel === "email" ? "tu@correo.com" : "+56 9 1234 5678"}
          value={contact}
          onChange={(e) => {
            setContact(e.target.value);
            if (error) setError(null);
          }}
          aria-label={channel === "email" ? "Correo electrónico" : "Número de WhatsApp"}
          className="h-10 min-w-0 flex-1 rounded-lg border border-line-strong bg-canvas px-3 text-sm text-ink placeholder:text-faint"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-ink px-4 text-xs font-semibold text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : "Avisarme"}
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );

  if (variant === "card") {
    return (
      <div className={`rounded-2xl border border-line bg-wash p-4 ${className}`}>
        <p className="text-sm font-bold text-ink">¿Prefieres otra fecha?</p>
        <p className="mt-1 text-xs text-mute">
          Déjanos tu correo o WhatsApp y te avisamos apenas abramos un nuevo grupo de {courseTitle}.
        </p>
        <div className="mt-3">{open ? inlineForm : triggerButton}</div>
      </div>
    );
  }

  return <div className={className}>{open ? inlineForm : triggerButton}</div>;
}
