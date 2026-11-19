"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Pause,
  Play,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import {
  evaluarSimulacroPl300,
  PL300_DOMINIO_MAP,
  PL300_DOMINIOS,
  seleccionarPreguntas,
  type ModoSimulador,
  type Pl300DominioId,
  type Pl300Pregunta,
  type ResultadoSimulacroPl300,
} from "@/lib/data/pl300-preguntas";
import { trackLeadSubmit, trackQuizComplete } from "@/lib/analytics/marketing";
import { getAntiBotFields } from "@/lib/antibot";
import { captureAndReadAttribution } from "@/lib/utm";
import { readBrowserReferralCode } from "@/lib/referrals/cookie";
import { usePaisRuta } from "@/lib/paises/cliente";

type FaseSimulador = "inicio" | "examen" | "resultado";
type EstadoForm = "idle" | "error" | "success";

const LETRAS_OPCION = ["A", "B", "C", "D"] as const;

const MODOS: readonly {
  id: ModoSimulador;
  titulo: string;
  preguntas: string;
  tiempo: string;
  tiempoMin: number;
  descripcion: string;
}[] = [
  {
    id: "rapido",
    titulo: "Simulacro rápido",
    preguntas: "15 preguntas",
    tiempo: "20 min sugeridos",
    tiempoMin: 20,
    descripcion:
      "Muestra balanceada según los pesos oficiales de Microsoft (Preparar, Modelar, Visualizar e Implementar).",
  },
  {
    id: "completo",
    titulo: "Simulacro completo",
    preguntas: "40 preguntas",
    tiempo: "50 min sugeridos",
    tiempoMin: 50,
    descripcion:
      "Banco completo de práctica por dominios para medir resistencia, ritmo de lectura y dominio técnico.",
  },
  {
    id: "dominio",
    titulo: "Práctica por dominio",
    preguntas: "10 preguntas",
    tiempo: "15 min sugeridos",
    tiempoMin: 15,
    descripcion:
      "Enfócate en uno de los 4 dominios oficiales del PL-300 para cerrar brechas puntuales.",
  },
];

function formatearTiempo(segundos: number): string {
  const mins = Math.floor(segundos / 60);
  const secs = segundos % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function SimuladorPl300Client() {
  const pais = usePaisRuta();
  const [fase, setFase] = useState<FaseSimulador>("inicio");
  const [modo, setModo] = useState<ModoSimulador>("rapido");
  const [dominioElegido, setDominioElegido] = useState<Pl300DominioId>("preparar");
  const [explicacionInmediata, setExplicacionInmediata] = useState<boolean>(true);

  const [preguntas, setPreguntas] = useState<Pl300Pregunta[]>(() =>
    seleccionarPreguntas("rapido"),
  );
  const [respuestas, setRespuestas] = useState<(number | null)[]>([]);
  const [indice, setIndice] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [pausado, setPausado] = useState(false);

  const completoEnviado = useRef(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fase !== "examen" || pausado) return;
    const id = window.setInterval(() => {
      setSegundos((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [fase, pausado]);

  function iniciarSimulacro() {
    const lista = seleccionarPreguntas(modo, dominioElegido);
    setPreguntas(lista);
    setRespuestas(lista.map(() => null));
    setIndice(0);
    setSegundos(0);
    setPausado(false);
    completoEnviado.current = false;
    setFase("examen");
    contenedorRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function elegirOpcion(posicion: number) {
    const actualRespondida = respuestas[indice] !== null;
    // En modo práctica inmediata, al responder se revela la explicación y queda fijada la respuesta.
    if (explicacionInmediata && actualRespondida) return;
    setRespuestas((prev) =>
      prev.map((val, idx) => (idx === indice ? posicion : val)),
    );
  }

  function finalizarExamen() {
    if (!completoEnviado.current) {
      completoEnviado.current = true;
      const res = evaluarSimulacroPl300(preguntas, respuestas);
      trackQuizComplete({
        tema: "pl-300",
        nivel: res.aprobadoSimulado ? "aprobado_simulado" : "refuerzo",
        pais,
        aciertos: res.correctas,
        total: res.total,
      });
    }
    setPausado(false);
    setFase("resultado");
    contenedorRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function reiniciar() {
    setFase("inicio");
    setPausado(false);
    setSegundos(0);
    completoEnviado.current = false;
    contenedorRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  if (fase === "inicio") {
    const modoInfo = MODOS.find((m) => m.id === modo) ?? MODOS[0];

    return (
      <div ref={contenedorRef} className="scroll-mt-24">
        <div className="rounded-[26px] border border-line bg-paper p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
                Configura tu práctica
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Elige el formato del simulacro PL-300
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-wash px-3 py-1.5 text-xs font-semibold text-ink">
              <Target size={14} aria-hidden />
              Meta oficial: 700 / 1000
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label="Modo del simulacro"
            className="mt-6 grid gap-3.5 sm:grid-cols-3"
          >
            {MODOS.map((item) => {
              const activo = modo === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  onClick={() => setModo(item.id)}
                  className={`flex flex-col rounded-2xl border p-4 text-left transition-colors ${
                    activo
                      ? "border-ink bg-wash"
                      : "border-line-strong bg-canvas hover:border-ink/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-bold tracking-tight text-ink">
                      {item.titulo}
                    </span>
                    <span
                      className={`size-4 shrink-0 rounded-full border ${
                        activo
                          ? "border-ink bg-ink ring-2 ring-ink/20"
                          : "border-line-strong bg-paper"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-mute">
                    {item.preguntas} · {item.tiempo}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-mute">
                    {item.descripcion}
                  </p>
                </button>
              );
            })}
          </div>

          {modo === "dominio" ? (
            <div className="mt-5 rounded-2xl border border-line bg-canvas p-4 sm:p-5">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
                Selecciona el dominio (10 preguntas)
              </p>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {PL300_DOMINIOS.map((dom) => {
                  const activo = dominioElegido === dom.id;
                  return (
                    <button
                      key={dom.id}
                      type="button"
                      onClick={() => setDominioElegido(dom.id)}
                      className={`flex items-start justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
                        activo
                          ? "border-ink bg-wash text-ink"
                          : "border-line bg-paper text-mute hover:border-ink/40"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {dom.nombre}
                        </p>
                        <p className="mt-0.5 text-xs text-mute">
                          Peso oficial: {dom.peso}
                        </p>
                      </div>
                      {activo ? (
                        <Check
                          size={16}
                          strokeWidth={2.5}
                          className="mt-0.5 shrink-0 text-ink"
                          aria-hidden
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-5 rounded-2xl border border-line bg-canvas p-4 sm:p-5">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
              Modo de corrección
            </p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setExplicacionInmediata(true)}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  explicacionInmediata
                    ? "border-ink bg-wash text-ink"
                    : "border-line bg-paper text-mute hover:border-ink/40"
                }`}
              >
                <p className="text-sm font-semibold text-ink">
                  Modo práctica (recomendado para estudiar)
                </p>
                <p className="mt-0.5 text-xs text-mute">
                  Muestra si acertaste y la explicación técnica después de cada pregunta.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setExplicacionInmediata(false)}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  !explicacionInmediata
                    ? "border-ink bg-wash text-ink"
                    : "border-line bg-paper text-mute hover:border-ink/40"
                }`}
              >
                <p className="text-sm font-semibold text-ink">
                  Evaluación tipo examen
                </p>
                <p className="mt-0.5 text-xs text-mute">
                  Sin pistas durante la prueba; ves el puntaje y las explicaciones al finalizar.
                </p>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-mute">
              Seleccionado: <strong className="text-ink">{modoInfo.titulo}</strong>{" "}
              ({modoInfo.preguntas}) · Sin registro previo.
            </p>
            <button
              type="button"
              onClick={iniciarSimulacro}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-[14.5px] font-semibold text-canvas transition-transform active:scale-[0.98] sm:w-auto"
            >
              Comenzar simulacro
              <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (fase === "resultado") {
    const resultado = evaluarSimulacroPl300(preguntas, respuestas);
    return (
      <div ref={contenedorRef} className="scroll-mt-24">
        <DashboardResultado
          resultado={resultado}
          preguntas={preguntas}
          respuestas={respuestas}
          segundos={segundos}
          modo={modo}
          onReiniciar={reiniciar}
        />
      </div>
    );
  }

  // FASE: EXAMEN ACTIVO
  const pregunta = preguntas[indice];
  const seleccion = respuestas[indice];
  const dominioInfo = PL300_DOMINIO_MAP[pregunta.dominio];
  const respondidasCount = respuestas.filter((r) => r !== null).length;
  const progreso = Math.round(((indice + 1) / preguntas.length) * 100);
  const mostrarFeedbackInmediato = explicacionInmediata && seleccion !== null;
  const esUltima = indice === preguntas.length - 1;
  const modoActual = MODOS.find((m) => m.id === modo) ?? MODOS[0];

  return (
    <div ref={contenedorRef} className="scroll-mt-24">
      <div className="rounded-[26px] border border-line bg-paper p-5 sm:p-7">
        {/* Cabecera: Dominio, dificultad, reloj */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-wash px-3 py-1 text-[11px] font-semibold text-ink">
              {dominioInfo.nombre}
            </span>
            <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-mute">
              Nivel: {pregunta.dificultad}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-semibold tabular-nums text-ink">
              <Clock size={13} aria-hidden />
              {formatearTiempo(segundos)}
              <span className="text-faint">/ {modoActual.tiempoMin}m</span>
            </span>
            <button
              type="button"
              onClick={() => setPausado((p) => !p)}
              aria-label={pausado ? "Reanudar temporizador" : "Pausar temporizador"}
              className="inline-flex size-8 items-center justify-center rounded-full border border-line bg-canvas text-ink transition-colors hover:bg-wash"
            >
              {pausado ? <Play size={13} aria-hidden /> : <Pause size={13} aria-hidden />}
            </button>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
            Pregunta {indice + 1} de {preguntas.length}
          </p>
          <p className="text-[11px] font-semibold text-mute">
            Respondidas: {respondidasCount}/{preguntas.length}
          </p>
        </div>

        <div
          role="progressbar"
          aria-label={`Pregunta ${indice + 1} de ${preguntas.length}`}
          aria-valuemin={1}
          aria-valuemax={preguntas.length}
          aria-valuenow={indice + 1}
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-wash"
        >
          <div
            className="h-full rounded-full bg-ink transition-[width] duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>

        {/* Navegador de preguntas (pills) */}
        <div
          aria-label="Navegador de preguntas"
          className="mt-4 flex flex-wrap gap-1.5"
        >
          {preguntas.map((p, idx) => {
            const resp = respuestas[idx];
            const esActual = idx === indice;
            let estilo = "border-line bg-canvas text-mute hover:border-ink/40";
            if (esActual) {
              estilo = "border-ink bg-ink text-canvas";
            } else if (resp !== null) {
              if (explicacionInmediata) {
                estilo =
                  resp === p.correcta
                    ? "border-emerald-600/40 bg-emerald-50 text-emerald-900"
                    : "border-rose-600/40 bg-rose-50 text-rose-900";
              } else {
                estilo = "border-ink/40 bg-wash text-ink";
              }
            }
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndice(idx)}
                aria-label={`Ir a pregunta ${idx + 1}`}
                aria-current={esActual ? "step" : undefined}
                className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full border px-2 text-xs font-semibold tabular-nums transition-colors ${estilo}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {pausado ? (
          <div className="mt-6 rounded-2xl border border-line bg-wash p-6 text-center">
            <p className="text-base font-bold text-ink">Simulacro en pausa</p>
            <p className="mt-1 text-sm text-mute">
              El temporizador está detenido. Retoma cuando quieras continuar.
            </p>
            <button
              type="button"
              onClick={() => setPausado(false)}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas"
            >
              <Play size={14} aria-hidden /> Reanudar
            </button>
          </div>
        ) : (
          <>
            {/* Escenario y pregunta */}
            <div className="mt-6 rounded-2xl bg-wash p-4">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
                Escenario
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">
                {pregunta.escenario}
              </p>
            </div>

            <h2
              id="sim-pregunta"
              className="mt-5 text-lg font-bold leading-snug tracking-tight text-ink sm:text-xl"
            >
              {pregunta.pregunta}
            </h2>

            {pregunta.codigo ? (
              <pre className="mt-3 overflow-x-auto rounded-xl border border-line bg-canvas p-3.5 font-mono text-xs leading-relaxed text-ink">
                <code>{pregunta.codigo}</code>
              </pre>
            ) : null}

            {/* Opciones */}
            <div
              role="radiogroup"
              aria-labelledby="sim-pregunta"
              className="mt-5 flex flex-col gap-2.5"
            >
              {pregunta.opciones.map((opcion, pos) => {
                const activa = seleccion === pos;
                const esCorrecta = pos === pregunta.correcta;

                let claseBorde =
                  "border-line-strong bg-canvas text-mute hover:border-ink/40";
                if (mostrarFeedbackInmediato) {
                  if (esCorrecta) {
                    claseBorde =
                      "border-emerald-600 bg-emerald-50/70 text-ink";
                  } else if (activa && !esCorrecta) {
                    claseBorde = "border-rose-600 bg-rose-50/70 text-ink";
                  } else {
                    claseBorde = "border-line bg-canvas text-faint opacity-75";
                  }
                } else if (activa) {
                  claseBorde = "border-ink bg-wash text-ink";
                }

                return (
                  <label
                    key={`${pregunta.id}-${pos}`}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm leading-relaxed transition-colors ${claseBorde}`}
                  >
                    <input
                      type="radio"
                      name={`sim-${pregunta.id}`}
                      value={pos}
                      checked={activa}
                      disabled={mostrarFeedbackInmediato}
                      onChange={() => elegirOpcion(pos)}
                      className="sr-only"
                    />
                    <span
                      className={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                        activa
                          ? "border-ink bg-ink text-canvas"
                          : "border-line-strong bg-paper text-ink"
                      }`}
                    >
                      {LETRAS_OPCION[pos]}
                    </span>
                    <span className="flex-1 text-ink">{opcion}</span>
                    {mostrarFeedbackInmediato && esCorrecta ? (
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-700"
                        aria-label="Respuesta correcta"
                      />
                    ) : null}
                    {mostrarFeedbackInmediato && activa && !esCorrecta ? (
                      <XCircle
                        size={18}
                        className="mt-0.5 shrink-0 text-rose-700"
                        aria-label="Respuesta incorrecta"
                      />
                    ) : null}
                  </label>
                );
              })}
            </div>

            {/* Explicación inmediata en modo práctica */}
            {mostrarFeedbackInmediato ? (
              <div className="mt-5 rounded-2xl border border-line bg-wash p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-ink">
                    {seleccion === pregunta.correcta
                      ? "Correcto"
                      : `Incorrecto — la respuesta correcta es la ${LETRAS_OPCION[pregunta.correcta]}`}
                  </p>
                  <span className="rounded-full border border-line bg-paper px-2.5 py-0.5 text-[11px] font-semibold text-mute">
                    {pregunta.temaClave}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink">
                  {pregunta.explicacion}
                </p>
              </div>
            ) : null}
          </>
        )}

        {/* Navegación inferior */}
        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIndice((i) => Math.max(0, i - 1))}
              disabled={indice === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong bg-paper px-5 text-sm font-semibold text-ink transition-colors hover:bg-wash disabled:opacity-40"
            >
              <ArrowLeft size={16} aria-hidden /> Anterior
            </button>
            <button
              type="button"
              onClick={reiniciar}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-line bg-canvas px-4 text-xs font-semibold text-mute transition-colors hover:text-ink"
            >
              Salir
            </button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {!esUltima ? (
              <button
                type="button"
                onClick={() =>
                  setIndice((i) => Math.min(preguntas.length - 1, i + 1))
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas transition-transform active:scale-[0.98]"
              >
                Siguiente <ArrowRight size={16} aria-hidden />
              </button>
            ) : null}

            <button
              type="button"
              onClick={finalizarExamen}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform active:scale-[0.98] ${
                esUltima
                  ? "bg-ink text-canvas"
                  : "border border-line-strong bg-paper text-ink hover:bg-wash"
              }`}
            >
              {esUltima ? "Ver resultados" : "Finalizar ahora"}
              {esUltima ? <Award size={16} aria-hidden /> : null}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardResultado({
  resultado,
  preguntas,
  respuestas,
  segundos,
  modo,
  onReiniciar,
}: {
  resultado: ResultadoSimulacroPl300;
  preguntas: readonly Pl300Pregunta[];
  respuestas: readonly (number | null)[];
  segundos: number;
  modo: ModoSimulador;
  onReiniciar: () => void;
}) {
  const incorrectas = preguntas
    .map((preg, idx) => ({ preg, idx, resp: respuestas[idx] }))
    .filter((item) => item.resp !== item.preg.correcta);

  const [filtroRevision, setFiltroRevision] = useState<"incorrectas" | "todas">(
    incorrectas.length > 0 ? "incorrectas" : "todas",
  );

  const itemsRevision =
    filtroRevision === "incorrectas"
      ? incorrectas
      : preguntas.map((preg, idx) => ({ preg, idx, resp: respuestas[idx] }));

  return (
    <div className="flex flex-col gap-6">
      {/* Tarjeta principal de puntaje */}
      <section className="rounded-[26px] border border-line bg-paper p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
              Resultado del simulacro PL-300
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {resultado.puntajeEscala} / 1000
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  resultado.aprobadoSimulado
                    ? "bg-ink text-canvas"
                    : "border border-line-strong bg-wash text-ink"
                }`}
              >
                {resultado.aprobadoSimulado
                  ? "Nivel aprobado (≥ 700)"
                  : "Requiere refuerzo (< 700)"}
              </span>
            </div>
            <p className="mt-2 text-xs text-mute">
              Puntaje simulado de referencia; Microsoft aprueba el examen oficial con 700/1000.
            </p>
          </div>

          <div className="flex gap-5 rounded-2xl bg-wash px-4 py-3">
            <div>
              <p className="text-[11px] font-semibold text-faint uppercase">
                Aciertos
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-ink">
                {resultado.correctas}/{resultado.total} ({resultado.porcentaje}%)
              </p>
            </div>
            <div className="border-l border-line pl-5">
              <p className="text-[11px] font-semibold text-faint uppercase">
                Tiempo
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-ink">
                {formatearTiempo(segundos)}
              </p>
            </div>
          </div>
        </div>

        {/* Desglose por dominio */}
        <div className="mt-7 border-t border-line pt-6">
          <h3 className="text-base font-semibold tracking-tight text-ink">
            Desempeño por dominio oficial PL-300
          </h3>
          <div className="mt-4 flex flex-col gap-4">
            {resultado.porDominio.map((dom) => (
              <div key={dom.dominio.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">
                    {dom.dominio.nombre}{" "}
                    <span className="font-normal text-faint">
                      (peso oficial {dom.dominio.peso})
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tabular-nums text-mute">
                      {dom.correctas}/{dom.total} ({dom.porcentaje}%)
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        dom.estado === "fortaleza"
                          ? "bg-ink text-canvas"
                          : dom.estado === "en-proceso"
                            ? "bg-wash text-mute"
                            : "border border-line-strong text-ink"
                      }`}
                    >
                      {dom.estado === "fortaleza"
                        ? "Fortaleza"
                        : dom.estado === "en-proceso"
                          ? "En proceso"
                          : "Reforzar"}
                    </span>
                  </div>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-wash">
                  <div
                    className="h-full rounded-full bg-ink transition-[width] duration-500"
                    style={{ width: `${dom.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <button
            type="button"
            onClick={onReiniciar}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas transition-transform active:scale-[0.98]"
          >
            <RotateCcw size={15} aria-hidden /> Hacer otro simulacro
          </button>
          <Link
            href="/cursos/power-bi"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-paper px-5 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash"
          >
            Ver curso de Power BI <ArrowRight size={15} aria-hidden />
          </Link>
          <Link
            href="/guias/certificacion-pl-300-power-bi"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-canvas px-5 text-sm font-semibold text-mute no-underline transition-colors hover:text-ink"
          >
            <BookOpen size={15} aria-hidden /> Guía de certificación PL-300
          </Link>
        </div>
      </section>

      {/* Revisión detallada de preguntas */}
      <section className="rounded-[26px] border border-line bg-paper p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-ink">
              Revisión técnica de preguntas
            </h3>
            <p className="mt-1 text-xs text-mute">
              {incorrectas.length === 0
                ? "Respondiste todas correctamente. Puedes repasar las explicaciones."
                : `Tienes ${incorrectas.length} pregunta${incorrectas.length === 1 ? "" : "s"} por reforzar.`}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-line bg-canvas p-1">
            {incorrectas.length > 0 ? (
              <button
                type="button"
                onClick={() => setFiltroRevision("incorrectas")}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  filtroRevision === "incorrectas"
                    ? "bg-ink text-canvas"
                    : "text-mute hover:text-ink"
                }`}
              >
                Solo incorrectas ({incorrectas.length})
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setFiltroRevision("todas")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filtroRevision === "todas"
                  ? "bg-ink text-canvas"
                  : "text-mute hover:text-ink"
              }`}
            >
              Todas ({preguntas.length})
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {itemsRevision.map(({ preg, idx, resp }) => {
            const acerto = resp === preg.correcta;
            const dom = PL300_DOMINIO_MAP[preg.dominio];
            return (
              <details
                key={preg.id}
                open={!acerto && itemsRevision.length <= 8}
                className="rounded-2xl border border-line bg-canvas p-4"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-3 text-left">
                  <div className="flex items-start gap-2.5">
                    {acerto ? (
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-emerald-700"
                        aria-hidden
                      />
                    ) : (
                      <XCircle
                        size={18}
                        className="mt-0.5 shrink-0 text-rose-700"
                        aria-hidden
                      />
                    )}
                    <div>
                      <p className="text-[11px] font-semibold text-faint uppercase">
                        Pregunta {idx + 1} · {dom.nombre} · {preg.temaClave}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {preg.pregunta}
                      </p>
                    </div>
                  </div>
                </summary>

                <div className="mt-4 space-y-2 border-t border-line pt-3 text-xs leading-relaxed">
                  <p className="text-mute">
                    <strong className="text-ink">Escenario:</strong> {preg.escenario}
                  </p>
                  <p className="text-mute">
                    <strong className="text-ink">Tu respuesta:</strong>{" "}
                    {resp !== null
                      ? `${LETRAS_OPCION[resp]}. ${preg.opciones[resp]}`
                      : "Sin responder"}
                  </p>
                  <p className="text-ink">
                    <strong>Respuesta correcta:</strong>{" "}
                    {LETRAS_OPCION[preg.correcta]}. {preg.opciones[preg.correcta]}
                  </p>
                  <div className="rounded-xl bg-wash p-3 text-ink">
                    <strong>Explicación:</strong> {preg.explicacion}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* Formulario opcional de plan de estudio */}
      <FormularioPlanEstudio resultado={resultado} modo={modo} />
    </div>
  );
}

function FormularioPlanEstudio({
  resultado,
  modo,
}: {
  resultado: ResultadoSimulacroPl300;
  modo: ModoSimulador;
}) {
  const pais = usePaisRuta();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
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

    const trampa = honeypot.trim();
    if (
      trampa &&
      (trampa.startsWith("http") || trampa.length > 80 || /<script/i.test(trampa))
    ) {
      setEstado("success");
      return;
    }

    setEnviando(true);
    setEstado("idle");

    const detalleDominios = resultado.porDominio
      .map((d) => `${d.dominio.nombre}: ${d.porcentaje}% (${d.correctas}/${d.total})`)
      .join(" | ");

    const brechasTxt =
      resultado.brechas.length > 0
        ? resultado.brechas.map((b) => b.dominio.nombre).join(", ")
        : "Sin brechas críticas (<70%)";

    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nombre.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim() || null,
          message: `Simulador PL-300 (${modo}): ${resultado.puntajeEscala}/1000 (${resultado.correctas}/${resultado.total}). Brechas: ${brechasTxt}. Desglose: ${detalleDominios}.`,
          selectedCourses: ["power-bi"],
          sourceCourse: "power-bi",
          leadType: "contact",
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

      trackLeadSubmit("contact", "simulador_pl300", "power-bi");
      setEstado("success");
    } catch (err) {
      setEstado("error");
      setErrores({
        form:
          err instanceof Error
            ? err.message
            : "Ocurrió un error. Intenta de nuevo.",
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
          Recibimos tu resultado ({resultado.puntajeEscala}/1000) y te enviaremos
          recomendaciones según tus brechas para preparar el examen PL-300 y
          nuestro curso de Power BI.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[26px] border border-line bg-paper p-5 sm:p-7">
      <h3 className="text-xl font-bold tracking-tight text-ink">
        Recibe tu plan de estudio PL-300 según tus brechas
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-mute">
        Opcional: déjanos tu correo para recibir una ruta de estudio enfocada en
        los dominios que necesitas reforzar y conocer cómo te prepara nuestro{" "}
        <Link
          href="/cursos/power-bi"
          className="font-semibold text-ink underline underline-offset-2"
        >
          curso de Power BI
        </Link>
        .
      </p>

      <form onSubmit={onSubmit} className="relative mt-5" noValidate>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        >
          <label htmlFor="sim-website">Sitio web</label>
          <input
            id="sim-website"
            name="_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sim-nombre" className="text-sm font-medium text-ink">
              Nombre
            </label>
            <input
              id="sim-nombre"
              type="text"
              value={nombre}
              autoComplete="name"
              onChange={(e) => setNombre(e.target.value)}
              aria-invalid={errores.nombre ? true : undefined}
              className="h-11 rounded-xl border border-line-strong bg-canvas px-3 text-sm text-ink"
            />
            {errores.nombre ? (
              <p className="text-xs text-ink">{errores.nombre}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sim-email" className="text-sm font-medium text-ink">
              Correo
            </label>
            <input
              id="sim-email"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={errores.email ? true : undefined}
              className="h-11 rounded-xl border border-line-strong bg-canvas px-3 text-sm text-ink"
            />
            {errores.email ? (
              <p className="text-xs text-ink">{errores.email}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sim-whatsapp" className="text-sm font-medium text-ink">
              WhatsApp <span className="font-normal text-mute">(opcional)</span>
            </label>
            <input
              id="sim-whatsapp"
              type="tel"
              value={whatsapp}
              autoComplete="tel"
              onChange={(e) => setWhatsapp(e.target.value)}
              aria-invalid={errores.whatsapp ? true : undefined}
              className="h-11 rounded-xl border border-line-strong bg-canvas px-3 text-sm text-ink"
            />
            {errores.whatsapp ? (
              <p className="text-xs text-ink">{errores.whatsapp}</p>
            ) : null}
          </div>
        </div>

        {errores.form ? (
          <p role="alert" className="mt-3 text-sm font-medium text-ink">
            {errores.form}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={enviando}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-ink px-7 text-sm font-semibold text-canvas transition-transform active:scale-[0.98] disabled:opacity-60 sm:w-auto"
        >
          {enviando ? "Enviando…" : "Enviar mi plan de estudio"}
        </button>

        <p className="mt-3 text-xs leading-relaxed text-faint">
          Usamos tus datos solo para enviarte el plan de estudio.{" "}
          <Link href="/privacidad" className="underline underline-offset-2">
            Política de privacidad
          </Link>
          .
        </p>
      </form>
    </section>
  );
}
