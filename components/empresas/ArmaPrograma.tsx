"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, MessageCircle, Monitor, Users } from "lucide-react";
import { whatsappHref } from "@/lib/whatsapp";
import { trackCtaClick } from "@/lib/analytics/marketing";
import {
  EVENTO_PRESELECCION,
  TOPICS,
  type DetallePreseleccion,
} from "@/components/empresas/empresas-contact-form";

const TAMANOS = ["1 a 5", "6 a 15", "16 a 30", "Más de 30"] as const;
const MODALIDADES = ["En vivo por Zoom", "Presencial", "Mixta"] as const;

/** Grupos de temas para que la lista no sea una pared de botones. */
const GRUPOS: { titulo: string; temas: (typeof TOPICS)[number][] }[] = [
  { titulo: "Datos y reportes", temas: ["Power BI", "Excel", "SQL Server", "Python"] },
  { titulo: "Automatización", temas: ["Power Automate"] },
  { titulo: "IA en el trabajo", temas: ["IA en Productividad", "ChatGPT", "Copilot", "Claude", "Gemini"] },
];

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors ${
        activo
          ? "border-ink bg-ink text-canvas"
          : "border-line bg-paper text-ink hover:border-ink/30"
      }`}
    >
      {activo ? <Check size={13} strokeWidth={2.6} aria-hidden /> : null}
      {children}
    </button>
  );
}

/**
 * Configurador del hero de /empresas: temas, tamaño del equipo y modalidad.
 * «Pedir propuesta» precarga el formulario de contacto (evento
 * `empresas:preseleccion`) y baja hasta él; WhatsApp abre el chat con el
 * mismo resumen.
 */
export function ArmaPrograma({ pagina = "/empresas" }: { pagina?: string }) {
  const [temas, setTemas] = useState<string[]>(["Power BI"]);
  const [tamano, setTamano] = useState<(typeof TAMANOS)[number]>("6 a 15");
  const [modalidad, setModalidad] = useState<(typeof MODALIDADES)[number]>("En vivo por Zoom");

  const alternar = (tema: string) =>
    setTemas((prev) => (prev.includes(tema) ? prev.filter((t) => t !== tema) : [...prev, tema]));

  const resumen = useMemo(() => {
    const listaTemas = temas.length > 0 ? temas.join(", ") : "por definir";
    return `Temas: ${listaTemas}. Equipo de ${tamano.toLowerCase()} personas. Modalidad: ${modalidad}.`;
  }, [temas, tamano, modalidad]);

  const hrefWa = whatsappHref({
    page: pagina,
    intent: "empresas",
    customText: `Hola, queremos una capacitación para la empresa. ${resumen}`,
  });

  const pedirPropuesta = () => {
    const detalle: DetallePreseleccion = { temas, mensaje: resumen };
    window.dispatchEvent(new CustomEvent(EVENTO_PRESELECCION, { detail: detalle }));
    trackCtaClick("Pedir propuesta (configurador)", "empresas_hero_configurador", {
      temas: temas.join("|"),
      tamano,
      modalidad,
    });
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="rounded-[28px] border border-line bg-paper p-5 shadow-[0_30px_80px_-30px_rgba(23,23,22,0.25)] sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[15px] font-bold tracking-tight text-ink">Arma el programa de tu equipo</p>
        <span className="rounded-full bg-[#e6f4ff] px-2.5 py-1 text-[11px] font-semibold text-[#0958d9]">
          1 minuto
        </span>
      </div>

      <fieldset className="mt-5">
        <legend className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
          1 · ¿Qué necesita aprender?
        </legend>
        <div className="mt-3 space-y-3">
          {GRUPOS.map((grupo) => (
            <div key={grupo.titulo}>
              <p className="mb-1.5 text-[12px] text-mute">{grupo.titulo}</p>
              <div className="flex flex-wrap gap-1.5">
                {grupo.temas.map((tema) => (
                  <Chip key={tema} activo={temas.includes(tema)} onClick={() => alternar(tema)}>
                    {tema}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <fieldset>
          <legend className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
            <Users size={13} aria-hidden /> 2 · Personas
          </legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TAMANOS.map((t) => (
              <Chip key={t} activo={tamano === t} onClick={() => setTamano(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
            <Monitor size={13} aria-hidden /> 3 · Modalidad
          </legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {MODALIDADES.map((m) => (
              <Chip key={m} activo={modalidad === m} onClick={() => setModalidad(m)}>
                {m}
              </Chip>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-6 rounded-2xl bg-wash px-4 py-3 text-[13px] leading-relaxed text-mute">
        <span className="font-semibold text-ink">Tu solicitud: </span>
        {resumen}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={pedirPropuesta}
          disabled={temas.length === 0}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-ink px-5 text-sm font-semibold text-canvas transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          Pedir propuesta con esto <ArrowRight size={16} aria-hidden />
        </button>
        <a
          href={hrefWa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#15803D] px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#126c34]"
        >
          <MessageCircle size={16} aria-hidden /> WhatsApp
        </a>
      </div>
      <p className="mt-3 text-center text-[12px] text-faint">
        Respondemos con temas, fechas y valor. Sin compromiso.
      </p>
    </div>
  );
}
