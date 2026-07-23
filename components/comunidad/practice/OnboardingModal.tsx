"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Check,
  SignalLow,
  SignalMedium,
  SignalHigh,
  Signal,
  Database,
  BarChart3,
  Brain,
  Code2,
  FileSpreadsheet,
  Clock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PRACTICE_UNITS } from "@/lib/practice/levels";
import Confetti from "./Confetti";
import ChromaVideo from "./ChromaVideo";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (unitId: string, dailyGoalXP: number) => void;
  onClose?: () => void;
}

const BIT_VIDEO_URL = "https://mail.programbi.com/uploads/Mapache_saludando_a_c%C3%A1mara_con_202607222213.mp4";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Database,
  BarChart3,
  Brain,
  Code2,
  FileSpreadsheet,
};

// Niveles de conocimiento estilo Duolingo
const KNOWLEDGE_LEVELS = [
  {
    id: "zero",
    title: "Estoy empezando a aprender desde cero",
    desc: "Nunca he usado esta herramienta antes.",
    bars: 1,
  },
  {
    id: "basic",
    title: "Conozco algunos conceptos básicos",
    desc: "Sé qué es y he realizado consultas o fórmulas simples.",
    bars: 2,
  },
  {
    id: "intermediate",
    title: "Puedo desarrollar proyectos intermedios",
    desc: "Trabajo habitualmente con esto en mi trabajo o estudios.",
    bars: 3,
  },
  {
    id: "advanced",
    title: "Nivel avanzado / Profesional",
    desc: "Quiero perfeccionar mis habilidades y resolver retos complejos.",
    bars: 4,
  },
];

// Metas de tiempo diario
const DAILY_GOALS = [
  { id: 10, title: "Relajado", time: "5 min / día", desc: "A tu propio ritmo sin presiones." },
  { id: 20, title: "Normal", time: "10 min / día", desc: "Recomendado para un avance constante." },
  { id: 30, title: "Intenso", time: "15 min / día", desc: "Acelera tu dominio técnico." },
  { id: 50, title: "Pro", time: "25 min / día", desc: "Inmersión total diaria en proyectos reales." },
];

export default function OnboardingModal({
  isOpen,
  onComplete,
  onClose,
}: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(20);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!isOpen) return null;

  const activeUnit = PRACTICE_UNITS.find((u) => u.id === selectedUnitId) || PRACTICE_UNITS[0];
  const activeGoal = DAILY_GOALS.find((g) => g.id === selectedGoalId) || DAILY_GOALS[1];

  const handleNext = () => {
    if (step === 1 && selectedUnitId) {
      setStep(2);
    } else if (step === 2 && selectedLevelId) {
      setStep(3);
    } else if (step === 3 && selectedGoalId) {
      setShowConfetti(true);
      setStep(4);
    } else if (step === 4) {
      onComplete(selectedUnitId || PRACTICE_UNITS[0].id, selectedGoalId || 20);
    }
  };

  const isNextDisabled =
    (step === 1 && !selectedUnitId) ||
    (step === 2 && !selectedLevelId) ||
    (step === 3 && !selectedGoalId);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-text overflow-hidden">
      {showConfetti && <Confetti />}

      {/* Header Superior con Barra de Progreso Flotante */}
      <div className="w-full flex items-center justify-between px-6 pt-5 pb-2 z-20 max-w-3xl mx-auto shrink-0">
        <button
          onClick={onClose}
          className="p-2 rounded-2xl text-text-secondary hover:text-text hover:bg-surface-hover transition-colors"
          title="Cerrar tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar con bordes claros y visibilidad perfecta */}
        <div className="w-48 sm:w-72 h-3.5 rounded-full bg-surface-hover border border-border shadow-inner overflow-hidden relative p-0.5">
          <motion.div
            className="h-full bg-accent rounded-full relative shadow-sm"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          >
            <span className="absolute inset-y-0 right-0 w-2 bg-white/40 rounded-full blur-[1px]" />
          </motion.div>
        </div>

        <div className="text-xs font-bold text-text-muted">
          Paso {step} de 4
        </div>
      </div>

      {/* ── CABECERA FIJA DE BIT EL MAPACHE (Alineado más a la izquierda estilo Duolingo) ── */}
      <div className="w-full max-w-3xl pl-4 sm:pl-8 pr-4 pt-2 pb-3 flex items-start gap-3 sm:gap-4 shrink-0 z-20">
        {/* Contenedor Fijo de BIT: 40% más grande (w-36 h-36 sm:w-44 sm:h-44 = 176px) */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full shrink-0 flex items-center justify-center overflow-hidden -ml-2 sm:-ml-3">
          <ChromaVideo
            src={BIT_VIDEO_URL}
            className="w-full h-full object-cover"
            width={360}
            height={360}
          />
        </div>

        {/* Globo de Diálogo Dinámico hacia la derecha */}
        <div className="relative bg-surface border border-border p-4 sm:p-5 rounded-2xl shadow-md flex-1 mt-1">
          <div className="absolute left-[-8px] top-6 w-3 h-3 bg-surface border-l border-b border-border rotate-45" />
          <div className="text-[10px] font-black uppercase text-accent tracking-wider mb-0.5">
            {step === 1 && "BIT · Guía de Práctica"}
            {step === 2 && "BIT · Evaluación de Nivel"}
            {step === 3 && "BIT · Compromiso Diario"}
            {step === 4 && "BIT · Confirmación final"}
          </div>
          <h2 className="font-display font-bold text-base sm:text-lg text-text leading-tight">
            {step === 1 && "¡Hola! Soy Bit 🦝 ¿Qué tecnología quieres dominar hoy?"}
            {step === 2 && `¿Cuánto ${activeUnit.title} sabes?`}
            {step === 3 && "¿Cuánto tiempo quieres practicar al día?"}
            {step === 4 && "¡Tu Módulo de Práctica está listo! 🎉"}
          </h2>
          <p className="text-text-secondary text-xs mt-1 leading-snug">
            {step === 1 && "Selecciona tu ruta principal. Podrás cambiar entre ellas cuando quieras."}
            {step === 2 && "Adapta tu punto de partida para recibir ejercicios a tu medida."}
            {step === 3 && "Elige una meta de práctica que encaje con tu rutina diaria."}
            {step === 4 && `Aprenderás ${activeUnit.title} practicando ${activeGoal.time}.`}
          </p>
        </div>
      </div>

      {/* ── ÁREA DE CONTENIDO (Cuestionario y Opciones) ──────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col items-center justify-start max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* PASO 1: SELECCIONAR QUÉ APRENDER */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full space-y-3"
            >
              {PRACTICE_UNITS.map((unit) => {
                const Icon = ICON_MAP[unit.icon] ?? Database;
                const isSelected = unit.id === selectedUnitId;
                return (
                  <button
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all text-left",
                      isSelected
                        ? "border-accent bg-accent/10 shadow-md ring-1 ring-accent"
                        : "border-border bg-surface hover:bg-surface-hover hover:border-border-strong"
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ background: unit.accentColor }}
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                      <div>
                        <div className="font-bold text-sm text-text flex items-center gap-1.5">
                          <span>{unit.emoji}</span>
                          <span>{unit.title}</span>
                        </div>
                        <div className="text-xs text-text-muted mt-0.5">
                          {unit.levels.length} lecciones interactivas
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* PASO 2: EVALUACIÓN DE NIVEL */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full space-y-3"
            >
              {KNOWLEDGE_LEVELS.map((lvl) => {
                const isSelected = lvl.id === selectedLevelId;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevelId(lvl.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all text-left",
                      isSelected
                        ? "border-accent bg-accent/10 shadow-md ring-1 ring-accent"
                        : "border-border bg-surface hover:bg-surface-hover hover:border-border-strong"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-end gap-1 h-6 w-7 justify-center shrink-0">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <span
                            key={i}
                            className={cn(
                              "w-1.5 rounded-full transition-colors",
                              i < lvl.bars
                                ? isSelected
                                  ? "bg-accent"
                                  : "bg-text-secondary"
                                : "bg-border"
                            )}
                            style={{ height: `${(i + 1) * 25}%` }}
                          />
                        ))}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-text leading-tight">
                          {lvl.title}
                        </div>
                        <div className="text-xs text-text-muted mt-0.5 leading-relaxed">
                          {lvl.desc}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* PASO 3: SELECCIONAR TIEMPO DIARIO */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DAILY_GOALS.map((goal) => {
                  const isSelected = goal.id === selectedGoalId;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoalId(goal.id)}
                      className={cn(
                        "flex flex-col p-4 rounded-2xl border-2 transition-all text-left relative",
                        isSelected
                          ? "border-accent bg-accent/10 shadow-md ring-1 ring-accent"
                          : "border-border bg-surface hover:bg-surface-hover"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-text">{goal.title}</span>
                        <span className="text-xs font-bold text-accent">{goal.time}</span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed mt-0.5">
                        {goal.desc}
                      </p>

                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* PASO 4: CONFIRMACIÓN Y CELEBRACIÓN */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center text-center space-y-4 py-2"
            >
              <div className="p-5 rounded-2xl bg-surface border border-border w-full max-w-md flex items-center justify-around shadow-sm">
                <div className="text-center">
                  <span className="text-[11px] text-text-muted uppercase font-bold">Tecnología</span>
                  <div className="font-bold text-sm text-text mt-0.5">{activeUnit.title}</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <span className="text-[11px] text-text-muted uppercase font-bold">Meta Diaria</span>
                  <div className="font-bold text-sm text-accent mt-0.5">{activeGoal.time}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botón "CONTINUAR" Sobrepuesto Flotante a la Derecha */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 pointer-events-auto">
        <motion.button
          whileHover={!isNextDisabled ? { scale: 1.04 } : {}}
          whileTap={!isNextDisabled ? { scale: 0.96 } : {}}
          onClick={handleNext}
          disabled={isNextDisabled}
          className={cn(
            "px-8 py-3.5 sm:px-9 sm:py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-2xl flex items-center gap-2 backdrop-blur-md",
            isNextDisabled
              ? "bg-surface/90 text-text-muted cursor-not-allowed shadow-none border border-border"
              : "bg-accent text-white shadow-accent/40 hover:bg-accent/90 ring-2 ring-accent/30"
          )}
        >
          {step === 4 ? "¡Empezar a Practicar!" : "Continuar"}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
