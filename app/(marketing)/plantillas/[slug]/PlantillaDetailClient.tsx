"use client";

import { useEffect, useState } from "react";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";
import { captureAndReadAttribution } from "@/lib/utm";
import { trackLeadSubmit, trackPlantillaDownload } from "@/lib/analytics/marketing";
import type { PlantillaFile } from "@/lib/data/plantillas";

const UNLOCK_STORAGE_KEY = "pb_plantillas_unlocked_v1";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore clipboard error */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-line bg-paper px-2.5 py-1 text-[11px] font-semibold text-ink transition-colors hover:border-ink"
    >
      {copied ? "Copiado ✓" : "Copiar código"}
    </button>
  );
}

interface Props {
  slug: string;
  title: string;
  files: PlantillaFile[];
  relatedCourseSlug: string;
}

export default function PlantillaDetailClient({
  slug,
  title,
  files,
  relatedCourseSlug,
}: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formLoadedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(UNLOCK_STORAGE_KEY) === "1") {
        setUnlocked(true);
      }
    } catch {
      /* ignore storage errors */
    }
  }, []);

  function triggerDownload(filePath: string) {
    trackPlantillaDownload({
      recurso: `${slug}:${filePath.split("/").pop() || "archivo"}`,
      location: "plantillas_detail",
    });
    const link = document.createElement("a");
    link.href = filePath;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (cleanName.length < 2) {
      setErrorMsg("Ingresa tu nombre (mínimo 2 caracteres).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg("Ingresa un correo electrónico válido.");
      return;
    }

    setSubmitting(true);
    try {
      const attribution = captureAndReadAttribution();
      const antiBot = getAntiBotFields(formLoadedAt, honeypot);

      await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          whatsapp: whatsapp.trim() || undefined,
          leadType: "contact",
          sourceCourse: relatedCourseSlug,
          selectedCourses: [relatedCourseSlug],
          message: `Descarga de plantilla: ${title} (${slug})`,
          ...attribution,
          ...antiBot,
        }),
      }).catch(() => null);

      try {
        localStorage.setItem(UNLOCK_STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }

      trackLeadSubmit("plantilla", "plantillas_detail", relatedCourseSlug);
      setUnlocked(true);

      if (files[0]) {
        triggerDownload(files[0].path);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-line-strong bg-paper p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
        Descarga directa gratuita
      </p>
      <h2 className="mt-2 text-lg font-bold tracking-tight text-ink">
        {unlocked ? "Archivos listos para descargar" : "Descarga los archivos de esta plantilla"}
      </h2>

      {!unlocked ? (
        <>
          <p className="mt-2 text-sm leading-relaxed text-mute">
            Ingresa tu nombre y correo para desbloquear la descarga inmediata de todos los archivos
            de la biblioteca.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5" noValidate>
            {/* Honeypot anti-bot */}
            <div style={honeypotStyle} aria-hidden="true">
              <label htmlFor="pb-website">Sitio web</label>
              <input
                id="pb-website"
                type="text"
                name="_website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="plantilla-name" className="block text-xs font-semibold text-ink">
                Nombre *
              </label>
              <input
                id="plantilla-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Camila Soto"
                className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-ink focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="plantilla-email" className="block text-xs font-semibold text-ink">
                Correo electrónico *
              </label>
              <input
                id="plantilla-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="camila@empresa.cl"
                className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-ink focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="plantilla-wa" className="block text-xs font-semibold text-ink">
                WhatsApp <span className="font-normal text-faint">(opcional)</span>
              </label>
              <input
                id="plantilla-wa"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-ink focus:outline-none"
              />
            </div>

            {errorMsg && (
              <p role="alert" className="text-xs font-semibold text-red-700">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg border border-ink bg-ink px-4 py-2.5 text-sm font-bold text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Desbloqueando..." : "Desbloquear y descargar →"}
            </button>
          </form>

          <div className="mt-5 border-t border-line pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
              Archivos incluidos ({files.length})
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-mute">
              {files.map((f) => (
                <li key={f.path} className="flex items-center justify-between gap-2">
                  <span className="truncate">{f.label}</span>
                  <span className="shrink-0 rounded border border-line bg-wash px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink">
                    {f.format}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="rounded-lg border border-line bg-wash px-3 py-2 text-xs font-medium text-ink">
            Descarga habilitada. Haz clic en cada archivo para guardarlo:
          </p>
          {files.map((f) => (
            <a
              key={f.path}
              href={f.path}
              download
              onClick={() =>
                trackPlantillaDownload({
                  recurso: `${slug}:${f.path.split("/").pop() || "archivo"}`,
                  location: "plantillas_detail_unlocked",
                })
              }
              className="flex items-center justify-between gap-3 rounded-lg border border-ink bg-ink px-4 py-2.5 text-xs font-bold text-canvas no-underline transition-opacity hover:opacity-90"
            >
              <span className="truncate">{f.label}</span>
              <span className="shrink-0 font-mono text-[11px] uppercase">
                ↓ {f.format}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
