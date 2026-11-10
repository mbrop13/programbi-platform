"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { getCourseBySlug, type Course } from "@/lib/data/courses";
import {
  DIAGNOSTICO_PREGUNTAS,
  DIAGNOSTICO_TOTAL,
  evaluarDiagnostico,
  textoBrechas,
  type DiagnosticoAreaResultado,
  type DiagnosticoEstadoArea,
  type DiagnosticoResultado,
} from "@/lib/data/diagnostico-madurez";
import {
  trackDiagnosticoComplete,
  trackLeadSubmit,
  trackWhatsAppClick,
} from "@/lib/analytics/marketing";
import { getAntiBotFields } from "@/lib/antibot";
import { captureAndReadAttribution } from "@/lib/utm";
import { readBrowserReferralCode } from "@/lib/referrals/cookie";
import { usePaisRuta } from "@/lib/paises/cliente";
import { whatsappHref } from "@/lib/whatsapp";

type EstadoForm = "idle" | "error" | "success";

const ETIQUETA_ESTADO: Record<DiagnosticoEstadoArea, string> = {
  fortaleza: "Fortaleza",
  "en-proceso": "En proceso",
  brecha: "Brecha",
};

const CHIP_ESTADO: Record<DiagnosticoEstadoArea, string> = {
  fortaleza: "bg-ink text-canvas",
  "en-proceso": "bg-wash text-mute",
  brecha: "border border-line-strong text-ink",
};

/**
 * Diagnóstico de madurez de datos: una pregunta por pantalla, resultado con
 * nivel y brechas por área, cursos recomendados y dos salidas (WhatsApp y
 * formulario corto). Todo se calcula en el navegador; no se guarda nada hasta
 * que la persona decide dejar sus datos.
 */
export function DiagnosticoMadurez() {
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<(number | null)[]>(() =>
    DIAGNOSTICO_PREGUNTAS.map(() => null),
  );
  const [terminado, setTerminado] = useState(false);
  const completoEnviado = useRef(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  const total = DIAGNOSTICO_PREGUNTAS.length;
  const pregunta = DIAGNOSTICO_PREGUNTAS[indice];
  const seleccion = respuestas[indice];
  const esUltima = indice === total - 1;
  const progreso = Math.round(((indice + 1) / total) * 100);

  function elegir(posicion: number) {
    setRespuestas((previas) =>
      previas.map((valor, lugar) => (lugar === indice ? posicion : valor)),
    );
  }

  function finalizar() {
    if (completoEnviado.current) return;
    completoEnviado.current = true;
    const resultado = evaluarDiagnostico(respuestas);
    setTerminado(true);
    trackDiagnosticoComplete({
      score: resultado.puntos,
      nivel: resultado.nivel.nombre,
    });
    contenedorRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }

  function avanzar() {
    if (seleccion === null) return;
    if (esUltima) {
      finalizar();
      return;
    }
    setIndice((valor) => valor + 1);
  }

  function atras() {
    setIndice((valor) => Math.max(0, valor - 1));
  }

  function reiniciar() {
    completoEnviado.current = false;
    setRespuestas(DIAGNOSTICO_PREGUNTAS.map(() => null));
    setIndice(0);
    setTerminado(false);
    contenedorRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }

  if (terminado) {
    const resultado = evaluarDiagnostico(respuestas);
    const cursos = resultado.nivel.cursos
      .map((slug) => getCourseBySlug(slug))
      .filter((curso): curso is Course => Boolean(curso));

    return (
      <div ref={contenedorRef} className="scroll-mt-24">
        <Resultado resultado={resultado} cursos={cursos} onReiniciar={reiniciar} />
      </div>
    );
  }

  return (
    <div ref={contenedorRef} className="scroll-mt-24">
      <div className="rounded-[26px] border border-line bg-paper p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
            Pregunta {indice + 1} de {total}
          </p>
          <p className="text-[11px] font-semibold text-mute">{progreso}%</p>
        </div>

        <div
          role="progressbar"
          aria-label={`Pregunta ${indice + 1} de ${total}`}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={indice + 1}
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-wash"
        >
          <div
            className="h-full rounded-full bg-ink transition-[width] duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>

        <h2
          id="diag-pregunta"
          className="mt-6 text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl"
        >
          {pregunta.pregunta}
        </h2>
        {pregunta.ayuda ? (
          <p className="mt-2 text-sm leading-relaxed text-mute">{pregunta.ayuda}</p>
        ) : null}

        <div
          role="group"
          aria-labelledby="diag-pregunta"
          className="mt-5 flex flex-col gap-2.5"
        >
          {pregunta.opciones.map((opcion, posicion) => {
            const activa = seleccion === posicion;
            return (
              <label
                key={opcion.texto}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm leading-relaxed transition-colors ${
                  activa
                    ? "border-ink bg-wash text-ink"
                    : "border-line-strong bg-canvas text-mute hover:border-ink/40"
                }`}
              >
                <input
                  type="radio"
                  name={`diag-${pregunta.id}`}
                  value={posicion}
                  checked={activa}
                  onChange={() => elegir(posicion)}
                  className="mt-0.5 size-4 shrink-0 accent-ink"
                />
                <span>{opcion.texto}</span>
              </label>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {indice > 0 ? (
            <button
              type="button"
              onClick={atras}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong bg-paper px-5 text-sm font-semibold text-ink transition-colors hover:bg-wash sm:justify-start"
            >
              <ArrowLeft size={16} aria-hidden /> Atrás
            </button>
          ) : (
            <span className="hidden sm:block" aria-hidden="true" />
          )}
          <button
            type="button"
            onClick={avanzar}
            disabled={seleccion === null}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-[14.5px] font-semibold text-canvas transition-transform active:scale-[0.98] disabled:opacity-40 sm:w-auto"
          >
            {esUltima ? "Ver mi diagnóstico" : "Siguiente"}
            <ArrowRight size={16} aria-hidden />
          </button>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-faint">
          Sin registro. Cada respuesta suma de 0 a 3 puntos (total: 30) y el
          resultado se calcula en tu navegador; solo se envía si decides dejar
          tus datos.
        </p>
      </div>
    </div>
  );
}

function Resultado({
  resultado,
  cursos,
  onReiniciar,
}: {
  resultado: DiagnosticoResultado;
  cursos: readonly Course[];
  onReiniciar: () => void;
}) {
  const waHref = whatsappHref({
    page: "/empresas/diagnostico",
    intent: "empresas",
    extra: `Mi diagnóstico: ${resultado.nivel.nombre} (${resultado.puntos}/${DIAGNOSTICO_TOTAL})`,
  });

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[26px] border border-line bg-paper p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
              Tu nivel de madurez
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {resultado.nivel.nombre}
            </h2>
          </div>
          <p className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tracking-tight text-ink">
              {resultado.puntos}
            </span>
            <span className="text-sm font-semibold text-mute">
              / {DIAGNOSTICO_TOTAL} puntos
            </span>
          </p>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-mute sm:text-base">
          {resultado.nivel.descripcion}
        </p>

        <div className="mt-5 rounded-2xl bg-wash p-4 sm:p-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
            Qué haría ahora
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            {resultado.nivel.recomendacion}
          </p>
        </div>
      </section>

      <section aria-label="Fortalezas y brechas por área" className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <h3 className="text-base font-semibold tracking-tight text-ink">Fortalezas</h3>
          <p className="mt-1 text-xs leading-relaxed text-mute">
            Lo que el equipo ya hace bien y conviene sostener.
          </p>
          {resultado.fortalezas.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2.5">
              {resultado.fortalezas.map((area) => (
                <li key={area.id} className="flex items-start gap-2 text-sm leading-relaxed">
                  <Check size={15} strokeWidth={2.5} className="mt-0.5 shrink-0 text-ink" aria-hidden />
                  <span>
                    <span className="font-semibold text-ink">{area.nombre}</span>{" "}
                    <span className="text-mute">
                      ({area.puntos}/{area.max})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-mute">
              Todavía no hay un área consolidada. La primera meta es ordenar las
              fuentes y dejar un reporte que no dependa de una sola persona.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-paper p-5">
          <h3 className="text-base font-semibold tracking-tight text-ink">
            Brechas por cerrar
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-mute">
            Donde la práctica todavía es inicial y se nota en el trabajo diario.
          </p>
          {resultado.brechas.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2.5">
              {resultado.brechas.map((area) => (
                <li key={area.id} className="flex items-start gap-2 text-sm leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink"
                  />
                  <span>
                    <span className="font-semibold text-ink">{area.nombre}</span>{" "}
                    <span className="text-mute">
                      ({area.puntos}/{area.max})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-mute">
              Ninguna de las áreas medidas queda en nivel inicial. La brecha
              ahora es de profundidad, no de base.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
        <h3 className="text-base font-semibold tracking-tight text-ink">Detalle por área</h3>
        <div className="mt-5 flex flex-col gap-4">
          {resultado.areas.map((area) => (
            <AreaDetalle key={area.id} area={area} />
          ))}
        </div>
      </section>

      <section aria-labelledby="diag-cursos">
        <h3
          id="diag-cursos"
          className="text-xl font-bold tracking-tight text-ink sm:text-2xl"
        >
          Cursos para este nivel
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-mute">
          Según tus respuestas, estos son los cursos que conviene priorizar.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cursos.map((curso) => (
            <Link
              key={curso.slug}
              href={`/cursos/${curso.slug}?para=empresas`}
              className="group flex flex-col rounded-2xl border border-line bg-paper p-5 no-underline transition-colors hover:border-ink/20"
            >
              <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
                Curso
              </p>
              <h4 className="mt-1.5 text-base font-semibold tracking-tight text-ink">
                {curso.title}
              </h4>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-mute">
                {curso.shortDescription}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">
                Ver la ficha <ArrowRight size={14} aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[26px] bg-ink p-5 text-canvas sm:p-7">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-canvas/60 uppercase">
          Siguiente paso
        </p>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-canvas sm:text-2xl">
          ¿Revisamos el diagnóstico con tu equipo?
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-canvas/70">
          Cuéntanos qué área quieres reforzar y armamos una propuesta con temas,
          formato y fechas para el equipo.
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          data-wa-tracked="1"
          onClick={() => trackWhatsAppClick({ cta_position: "diagnostico_resultado" })}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-canvas px-6 text-[14.5px] font-semibold text-ink no-underline transition-transform active:scale-[0.98] sm:w-auto"
        >
          Contar el resultado por WhatsApp <ArrowRight size={16} aria-hidden />
        </a>
      </section>

      <FormularioPropuesta
        resultado={resultado}
        cursosTitulos={cursos.map((curso) => curso.title)}
      />

      <div>
        <button
          type="button"
          onClick={onReiniciar}
          className="inline-flex items-center gap-2 text-sm font-semibold text-mute underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          <RotateCcw size={14} aria-hidden /> Repetir el diagnóstico
        </button>
      </div>
    </div>
  );
}

function AreaDetalle({ area }: { area: DiagnosticoAreaResultado }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink">{area.nombre}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-mute">
            {area.puntos}/{area.max}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${CHIP_ESTADO[area.estado]}`}
          >
            {ETIQUETA_ESTADO[area.estado]}
          </span>
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-wash">
        <div
          className="h-full rounded-full bg-ink"
          style={{ width: `${Math.round(area.ratio * 100)}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-mute">{area.descripcion}</p>
    </div>
  );
}

function FormularioPropuesta({
  resultado,
  cursosTitulos,
}: {
  resultado: DiagnosticoResultado;
  cursosTitulos: readonly string[];
}) {
  const pais = usePaisRuta();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<EstadoForm>("idle");
  const [enviando, setEnviando] = useState(false);
  const formLoadedAt = useRef(Date.now());

  async function onSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const siguiente: Record<string, string> = {};
    if (nombre.trim().length < 2) siguiente.nombre = "Escribe tu nombre.";
    if (!empresa.trim()) siguiente.empresa = "Escribe el nombre de la empresa.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      siguiente.email = "Escribe un email válido.";
    }
    if (whatsapp.trim() && whatsapp.replace(/\D/g, "").length < 8) {
      siguiente.whatsapp = "Revisa el número: faltan dígitos.";
    }
    setErrores(siguiente);
    if (Object.keys(siguiente).length > 0) {
      setEstado("error");
      return;
    }

    // Mismo criterio que el formulario de /empresas: si el honeypot trae una
    // URL o un script, se corta aquí sin enviar nada.
    const trampa = honeypot.trim();
    if (trampa && (trampa.startsWith("http") || trampa.length > 80 || /<script/i.test(trampa))) {
      setEstado("success");
      return;
    }

    setEnviando(true);
    setEstado("idle");

    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nombre.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim() || null,
          company: empresa.trim(),
          message: `Diagnóstico de madurez de datos: ${resultado.nivel.nombre} (${resultado.puntos}/${DIAGNOSTICO_TOTAL}). Brechas: ${textoBrechas(resultado)}.`,
          selectedCourses: cursosTitulos,
          leadType: "asesoria_b2b",
          pais,
          ...captureAndReadAttribution(),
          referral_code: readBrowserReferralCode(),
          ...getAntiBotFields(formLoadedAt.current, honeypot),
        }),
      });

      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("No se pudo enviar. Intenta de nuevo.");
      }
      if (!res.ok) throw new Error(data.error || "Error al enviar");

      trackLeadSubmit("asesoria_b2b", "empresas_diagnostico");
      setEstado("success");
    } catch (err) {
      setEstado("error");
      setErrores({
        form: err instanceof Error ? err.message : "Ocurrió un error. Intenta de nuevo.",
      });
    } finally {
      setEnviando(false);
    }
  }

  if (estado === "success") {
    return (
      <section className="rounded-[26px] border border-line bg-paper p-5 sm:p-7">
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-ink text-canvas">
          <Check size={20} strokeWidth={2.5} aria-hidden />
        </span>
        <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">
          Listo, {nombre.split(" ")[0] || "gracias"}.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-mute">
          Un asesor te contactará con el diagnóstico y una propuesta para{" "}
          <span className="font-semibold text-ink">{empresa || "tu empresa"}</span>.
          Si prefieres adelantar la conversación, escríbenos por WhatsApp.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[26px] border border-line bg-paper p-5 sm:p-7">
      <h3 className="text-xl font-bold tracking-tight text-ink">
        Recibe el diagnóstico y una propuesta
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-mute">
        Déjanos tus datos y te enviamos el resultado con una propuesta de
        capacitación para el equipo. Es opcional: el resultado ya lo tienes.
      </p>

      <form onSubmit={onSubmit} className="relative mt-5" noValidate>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        >
          <label htmlFor="diag-website">Sitio web</label>
          <input
            id="diag-website"
            name="_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(evento) => setHoneypot(evento.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo
            id="diag-nombre"
            label="Nombre"
            value={nombre}
            onChange={setNombre}
            error={errores.nombre}
            autoComplete="name"
          />
          <Campo
            id="diag-empresa"
            label="Empresa"
            value={empresa}
            onChange={setEmpresa}
            error={errores.empresa}
            autoComplete="organization"
          />
          <Campo
            id="diag-email"
            label="Correo"
            type="email"
            value={email}
            onChange={setEmail}
            error={errores.email}
            autoComplete="email"
          />
          <Campo
            id="diag-whatsapp"
            label="WhatsApp"
            value={whatsapp}
            onChange={setWhatsapp}
            error={errores.whatsapp}
            autoComplete="tel"
            helper="Opcional. Incluye código de país."
            optional
          />
        </div>

        {errores.form ? (
          <p role="alert" className="mt-4 text-sm font-medium text-ink">
            {errores.form}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={enviando}
          className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-8 text-base font-semibold text-canvas transition-transform active:scale-[0.98] disabled:opacity-60 sm:w-auto"
        >
          {enviando ? "Enviando…" : "Quiero el diagnóstico y una propuesta"}
        </button>

        <p className="mt-3 text-xs leading-relaxed text-faint">
          Usamos tus datos solo para enviarte el resultado y contactarte por esta
          capacitación.{" "}
          <Link href="/privacidad" className="underline underline-offset-2">
            Política de privacidad
          </Link>
          .
        </p>
      </form>
    </section>
  );
}

function Campo({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  helper,
  optional,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (valor: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  helper?: string;
  optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {optional ? <span className="font-normal text-mute"> (opcional)</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(evento) => onChange(evento.target.value)}
        aria-invalid={error ? true : undefined}
        className="h-12 rounded-xl border border-line-strong bg-canvas px-3 text-base text-ink placeholder:text-faint"
      />
      {helper ? <p className="text-xs text-mute">{helper}</p> : null}
      {error ? <p className="text-sm text-ink">{error}</p> : null}
    </div>
  );
}
