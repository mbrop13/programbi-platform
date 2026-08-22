"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, Loader2, PenLine, RotateCcw } from "lucide-react";
import type { JobPublic } from "@/lib/jobs/types";

export default function ApplyPanel({ job }: { job: JobPublic }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [applied, setApplied] = useState(false);
  const [checking, setChecking] = useState(true);
  const [checkFailed, setCheckFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setChecking(true);
      setCheckFailed(false);
      try {
        const res = await fetch("/api/applications/mine");
        if (res.status === 401) {
          if (!cancelled) {
            setLoggedIn(false);
            setChecking(false);
          }
          return;
        }
        if (!res.ok) throw new Error("http");
        const data = await res.json();
        if (cancelled) return;
        setLoggedIn(true);
        setApplied((data.applications ?? []).some((a: { job_id: string }) => a.job_id === job.id));

        const profileRes = await fetch("/api/candidate-profile");
        const profileData = await profileRes.json();
        if (!cancelled) setHasProfile(!!profileData.profile);
      } catch {
        if (!cancelled) setCheckFailed(true);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [job.id, retryCount]);

  const externalApply =
    job.apply_via === "email"
      ? `mailto:${job.apply_url}?subject=${encodeURIComponent(`Postulación: ${job.title}`)}`
      : job.apply_via === "url"
        ? job.apply_url
        : null;

  if (externalApply) {
    return (
      <a
        href={externalApply ?? "#"}
        target={job.apply_via === "url" ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-base font-semibold text-canvas transition-transform active:scale-[0.98]"
      >
        Postular por {job.apply_via === "email" ? "correo" : "sitio externo"}
        <ArrowRight size={17} strokeWidth={2.4} />
      </a>
    );
  }

  if (checking) {
    return (
      <div className="flex h-12 items-center justify-center rounded-full border border-line bg-paper" role="status" aria-label="Verificando tu sesión">
        <Loader2 size={18} className="animate-spin text-faint" />
      </div>
    );
  }

  if (checkFailed) {
    return (
      <div className="rounded-2xl border border-line bg-wash p-4 text-center">
        <p className="text-sm text-mute">
          No pudimos verificar tu sesión. Revisa tu conexión.
        </p>
        <button
          onClick={() => setRetryCount((n) => n + 1)}
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas transition-transform active:scale-[0.98]"
        >
          <RotateCcw size={14} />
          Reintentar
        </button>
      </div>
    );
  }

  if (applied) {
    return (
      <div className="rounded-2xl border border-line bg-wash p-4 text-center">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
          <BadgeCheck size={16} className="text-[#16a34a]" />
          Ya postulaste a esta vacante
        </span>
        <Link
          href="/comunidad/empleos"
          className="mt-2 block text-xs font-medium text-mute underline-offset-4 hover:underline"
        >
          Ver el estado en Mis postulaciones →
        </Link>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <button
        onClick={() => window.dispatchEvent(new Event("open-auth-modal"))}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-base font-semibold text-canvas transition-transform active:scale-[0.98]"
      >
        Crear cuenta y postular
        <ArrowRight size={17} strokeWidth={2.4} />
      </button>
    );
  }

  if (hasProfile === false) {
    return (
      <div className="rounded-2xl border border-line bg-wash p-4">
        <p className="text-sm leading-relaxed text-mute">
          Para postular necesitas tu perfil laboral (toma 2 minutos). Tus certificados
          de ProgramBI se agregan automáticamente.
        </p>
        <Link
          href="/comunidad/empleos"
          onClick={() => sessionStorage.setItem("empleos-section", "perfil")}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas"
        >
          <PenLine size={15} />
          Completar mi perfil laboral
        </Link>
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-base font-semibold text-canvas transition-transform active:scale-[0.98]"
      >
        Postular ahora
        <ArrowRight size={17} strokeWidth={2.4} />
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <label htmlFor="cover-letter" className="text-xs font-semibold text-mute">
        Carta de presentación (opcional)
      </label>
      <textarea
        id="cover-letter"
        rows={5}
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        placeholder="Cuéntale a la empresa por qué eres la persona ideal para este rol…"
        className="w-full rounded-xl border border-line-strong bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-faint"
        maxLength={4000}
      />
      {error && <p className="text-xs font-medium text-[#dc2626]">{error}</p>}
      <button
        onClick={async () => {
          setSubmitting(true);
          setError(null);
          try {
            const res = await fetch(`/api/jobs/${job.id}/apply`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ coverLetter: coverLetter.trim() || null }),
            });
            const data = await res.json();
            if (!res.ok) {
              if (data.needsProfile) {
                setHasProfile(false);
              } else {
                setError(data.error ?? "No pudimos enviar tu postulación.");
              }
              return;
            }
            setApplied(true);
            setShowForm(false);
          } catch {
            setError("Error de conexión. Intenta de nuevo.");
          } finally {
            setSubmitting(false);
          }
        }}
        disabled={submitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-base font-semibold text-canvas transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 size={17} className="animate-spin" />
        ) : (
          <Check size={17} strokeWidth={2.4} />
        )}
        {submitting ? "Enviando…" : "Enviar postulación"}
      </button>
      <p className="text-[11px] leading-relaxed text-faint">
        Al postular, la empresa recibirá tu perfil, CV y certificados verificados de ProgramBI.
      </p>
    </div>
  );
}
