"use client";

import { useRef, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";

type Props = {
  pais: string;
  fechaTexto: string;
};

/**
 * Inscripción a la clase gratis.
 *
 * Solo se monta cuando hay fecha real (flag encendido + CLASE_GRATIS.fecha).
 * Reutiliza el endpoint de leads que ya usa el webinar: no inventa backend.
 */
export default function FormularioClase({ pais, fechaTexto }: Props) {
  const [form, setForm] = useState({ nombre: "", email: "" });
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const [honeypot, setHoneypot] = useState("");
  const cargadoEn = useRef(Date.now());

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!form.nombre.trim() || !form.email.trim()) return;
    setEstado("enviando");
    try {
      const respuesta = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.nombre.trim(),
          email: form.email.trim().toLowerCase(),
          whatsapp: null,
          message: `Inscripción a la clase gratis del ${fechaTexto}`,
          selectedCourses: ["Clase gratis"],
          leadType: "clase-gratis",
          sourceCourse: "clase-gratis",
          pais,
          ...getAntiBotFields(cargadoEn.current, honeypot),
        }),
      });
      if (!respuesta.ok) throw new Error("sin respuesta");
      setEstado("ok");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="m-0 text-sm font-semibold text-emerald-800">
          Listo: quedaste anotado para la clase del {fechaTexto}. Te enviaremos el enlace de Zoom
          antes del evento.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-3">
      <input
        type="text"
        name="_website"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(evento) => setHoneypot(evento.target.value)}
        style={honeypotStyle}
        aria-hidden="true"
      />
      <div>
        <label htmlFor="clase-nombre" className="mb-1 block text-xs font-semibold text-mute">
          Nombre
        </label>
        <input
          id="clase-nombre"
          type="text"
          required
          maxLength={80}
          value={form.nombre}
          onChange={(evento) => setForm((prev) => ({ ...prev, nombre: evento.target.value }))}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink"
        />
      </div>
      <div>
        <label htmlFor="clase-email" className="mb-1 block text-xs font-semibold text-mute">
          Email
        </label>
        <input
          id="clase-email"
          type="email"
          required
          maxLength={254}
          value={form.email}
          onChange={(evento) => setForm((prev) => ({ ...prev, email: evento.target.value }))}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink"
        />
      </div>
      {estado === "error" ? (
        <p className="m-0 text-xs font-semibold text-rose-600">
          No pudimos guardar tu cupo. Inténtalo de nuevo.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={estado === "enviando"}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-ink px-5 py-3 text-sm font-semibold text-canvas transition-opacity disabled:opacity-60"
      >
        {estado === "enviando" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Reservar mi cupo
      </button>
      <p className="m-0 text-[11px] leading-relaxed text-faint">
        Usamos tu email solo para enviarte el enlace de la clase y avisos de la próxima fecha.
      </p>
    </form>
  );
}
