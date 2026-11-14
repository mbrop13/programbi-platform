"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { trackQuizComplete } from "@/lib/analytics/marketing";
import { calcularResultado, type TestNivel } from "@/lib/data/test-nivel";

type OtroTest = { tema: string; nombre: string; href: string };

type Props = {
  test: TestNivel;
  pais: string;
  cursoUrl: string;
  h1: string;
  inicioUrl: string;
  otrosTests: OtroTest[];
};

export default function TestNivelClient({
  test,
  pais,
  cursoUrl,
  h1,
  inicioUrl,
  otrosTests,
}: Props) {
  const total = test.preguntas.length;
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<(number | null)[]>(() =>
    test.preguntas.map(() => null),
  );
  const [terminado, setTerminado] = useState(false);
  const eventoEnviado = useRef(false);
  const [email, setEmail] = useState("");
  const [estadoEmail, setEstadoEmail] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  const pregunta = test.preguntas[indice];
  const respuesta = respuestas[indice];
  const esUltima = indice === total - 1;
  const aciertos = test.preguntas.reduce(
    (acc, item, posicion) => acc + (respuestas[posicion] === item.correcta ? 1 : 0),
    0,
  );
  const resultado = calcularResultado(aciertos, total);

  function elegir(opcion: number) {
    setRespuestas((prev) =>
      prev.map((valor, posicion) => (posicion === indice ? opcion : valor)),
    );
  }

  function avanzar() {
    if (respuesta === null) return;
    if (esUltima) {
      finalizar();
      return;
    }
    setIndice((valor) => valor + 1);
  }

  function finalizar() {
    if (terminado || eventoEnviado.current) return;
    eventoEnviado.current = true;
    const aciertosFinales = test.preguntas.reduce(
      (acc, item, posicion) => acc + (respuestas[posicion] === item.correcta ? 1 : 0),
      0,
    );
    const resultadoFinal = calcularResultado(aciertosFinales, total);
    setTerminado(true);
    trackQuizComplete({
      tema: test.tema,
      nivel: resultadoFinal.nivel.id,
      pais,
      aciertos: resultadoFinal.aciertos,
      total: resultadoFinal.total,
    });
  }

  function reiniciar() {
    eventoEnviado.current = false;
    setIndice(0);
    setRespuestas(test.preguntas.map(() => null));
    setTerminado(false);
    setEstadoEmail("idle");
    setEmail("");
  }

  async function enviarResultado(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const limpio = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(limpio)) {
      setEstadoEmail("error");
      return;
    }
    setEstadoEmail("enviando");
    try {
      const respuesta = await fetch("/api/leads-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: limpio,
          pais,
          recurso: `test-${test.tema}`,
          _t: Date.now(),
        }),
      });
      setEstadoEmail(respuesta.ok ? "ok" : "error");
    } catch {
      setEstadoEmail("error");
    }
  }

  if (terminado) {
    return (
      <div className="bg-[#FAFBFC] min-h-screen pt-28 pb-20 lg:pt-32 lg:pb-28">
        <div className="max-w-[900px] mx-auto px-5 lg:px-10">
          <section className="bg-white border border-slate-100 rounded-3xl shadow-sm p-7 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
              <div className="w-28 h-28 shrink-0 rounded-full border-8 border-blue-50 bg-white flex flex-col items-center justify-center shadow-inner">
                <span className="font-display font-black text-3xl text-slate-900 leading-none">
                  {resultado.aciertos}
                </span>
                <span className="text-[11px] font-bold text-slate-400 mt-1">de {total}</span>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#1890FF] bg-blue-50 border border-blue-100/60 rounded-full px-3 py-1.5 mb-3">
                  <Sparkles className="w-3 h-3" />
                  {test.titulo}
                </span>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight my-0">
                  Nivel {resultado.nivel.label}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3 mb-0">
                  {resultado.nivel.descripcion}
                </p>
                <p className="text-slate-400 text-xs font-semibold mt-2 mb-0">
                  {resultado.porcentaje}% de respuestas correctas
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-7 sm:p-10 mt-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1890FF]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#1890FF] bg-[#1890FF]/10 border border-[#1890FF]/20 rounded-full px-3 py-1.5 inline-block mb-4">
                Curso recomendado
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight my-0">
                {test.curso.nombre}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-3 mb-6">
                {test.curso.motivo}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={cursoUrl}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1890FF] hover:bg-blue-600 text-white font-bold text-sm no-underline rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/25"
                >
                  <span>Ver {test.curso.nombre}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={reiniciar}
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Repetir test</span>
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 sm:p-8 mt-6">
            <h2 className="font-display font-black text-lg text-slate-900 tracking-tight my-0">
              ¿Guardamos tu resultado?
            </h2>
            <p className="text-slate-500 text-sm mt-1 mb-4">
              Déjanos tu email y guardamos tu nivel y el curso recomendado para poder orientarte.
              Es opcional: el test ya te sirvió sin dejarlo.
            </p>
            {estadoEmail === "ok" ? (
              <p className="text-emerald-700 text-sm font-semibold my-0">
                Listo: guardamos tu resultado.
              </p>
            ) : (
              <form onSubmit={enviarResultado} className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="email-resultado" className="sr-only">
                  Email
                </label>
                <input
                  id="email-resultado"
                  type="email"
                  required
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  placeholder="tu@correo.com"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1890FF]"
                />
                <button
                  type="submit"
                  disabled={estadoEmail === "enviando"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-0 bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-60 cursor-pointer"
                >
                  {estadoEmail === "enviando" ? "Guardando…" : "Guardar resultado"}
                </button>
              </form>
            )}
            {estadoEmail === "error" && (
              <p className="mt-2 mb-0 text-xs font-semibold text-rose-600">
                Revisa el email e inténtalo de nuevo.
              </p>
            )}
          </section>

          {otrosTests.length > 0 && (
            <section className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 sm:p-8 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-black text-lg text-slate-900 tracking-tight my-0">
                    ¿Quieres medir otra habilidad?
                  </h2>
                  <p className="text-slate-500 text-sm mt-1 mb-0">
                    Completa el otro test y compara tu resultado.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {otrosTests.map((otro) => (
                    <Link
                      key={otro.tema}
                      href={otro.href}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs no-underline rounded-xl transition-colors"
                    >
                      <span>{otro.nombre}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="mt-6">
            <details className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 sm:p-8">
              <summary className="cursor-pointer font-display font-black text-lg text-slate-900 tracking-tight">
                Revisar las {total} preguntas
              </summary>
              <div className="mt-6 space-y-5">
                {test.preguntas.map((item, posicion) => {
                  const elegida = respuestas[posicion];
                  const correcta = elegida === item.correcta;
                  return (
                    <div key={item.id} className="border-t border-slate-100 pt-5 first:border-0 first:pt-0">
                      <div className="flex items-start gap-2.5">
                        {correcta ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-snug my-0">
                            {posicion + 1}. {item.pregunta}
                          </p>
                          <p className="text-emerald-700 text-xs font-semibold mt-1.5 mb-0">
                            Respuesta correcta: {item.opciones[item.correcta]}
                          </p>
                          {!correcta && elegida !== null && (
                            <p className="text-rose-600 text-xs font-semibold mt-1 mb-0">
                              Tu respuesta: {item.opciones[elegida]}
                            </p>
                          )}
                          <p className="text-slate-500 text-xs leading-relaxed mt-2 mb-0">
                            {item.explicacion}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBFC] min-h-screen pt-28 pb-20 lg:pt-32 lg:pb-28">
      <div className="max-w-[860px] mx-auto px-5 lg:px-10">
        <nav className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-7">
          <Link href={inicioUrl} className="text-slate-500 hover:text-[#1890FF] no-underline transition-colors">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-700">{test.titulo}</span>
        </nav>

        <header className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#1890FF] bg-blue-50 border border-blue-100/60 rounded-full px-3 py-1.5 mb-4">
            <Target className="w-3 h-3" />
            {total} preguntas · sin registro
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.1] mb-4">
            {h1}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mb-0">
            {test.descripcion}
          </p>
        </header>

        <section className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 sm:p-9">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Pregunta {indice + 1} de {total}
            </span>
            <span className="text-xs font-bold text-[#1890FF]">
              {Math.round(((indice + 1) / total) * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-[#1890FF] rounded-full transition-all duration-300"
              style={{ width: `${((indice + 1) / total) * 100}%` }}
            />
          </div>

          <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-snug tracking-tight mb-6">
            {pregunta.pregunta}
          </h2>

          <div className="space-y-3" role="group" aria-label="Opciones de respuesta">
            {pregunta.opciones.map((opcion, posicion) => {
              const seleccionada = respuesta === posicion;
              return (
                <button
                  key={opcion}
                  type="button"
                  onClick={() => elegir(posicion)}
                  aria-pressed={seleccionada}
                  className={`w-full flex items-start gap-3.5 text-left px-4 py-3.5 rounded-2xl border transition-all cursor-pointer ${
                    seleccionada
                      ? "border-[#1890FF] bg-blue-50/60 shadow-[0_4px_18px_rgba(24,144,255,0.08)]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <span
                    className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-black ${
                      seleccionada
                        ? "bg-[#1890FF] text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {String.fromCharCode(65 + posicion)}
                  </span>
                  <span
                    className={`text-sm leading-relaxed pt-0.5 ${
                      seleccionada ? "text-slate-900 font-semibold" : "text-slate-600"
                    }`}
                  >
                    {opcion}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIndice((valor) => Math.max(0, valor - 1))}
              disabled={indice === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-slate-800 disabled:opacity-35 disabled:cursor-not-allowed font-bold text-xs bg-transparent border-0 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              type="button"
              onClick={avanzar}
              disabled={respuesta === null}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1890FF] hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl border-0 cursor-pointer transition-colors shadow-lg shadow-blue-500/20 disabled:shadow-none"
            >
              <span>{esUltima ? "Ver resultado" : "Siguiente"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        <p className="text-center text-xs text-slate-400 mt-5 mb-0">
          No necesitas iniciar sesión. Tus respuestas se evalúan en este navegador.
        </p>
      </div>
    </div>
  );
}
